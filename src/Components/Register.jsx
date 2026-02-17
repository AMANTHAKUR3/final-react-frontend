import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Header from '../Components/Header'
import { registerUser } from '../api/auth'

export default function RegisterHorizontal() {
  const [formData, setFormData] = useState({
    // UI fields mapped to backend DTO
    fullName: '',          // ✅ backend key
    email: '',
    phone: '',
    gender: '',
    dob: '',               // YYYY-MM-DD
    insurancePolicy: '',   // ✅ backend key
    bloodGroup: '',        // ✅ backend key
    password: '',
    confirmPassword: '',

    // // (Optional) UI-only fields — NOT sent to backend
    // address: '',
    // healthStatus: '',
  })

  const [errors, setErrors] = useState({})
  const [apiError, setApiError] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const validate = () => {
    const e = {}
    if (!formData.fullName.trim()) e.fullName = 'Full name is required.'
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) e.email = 'Enter a valid email.'
    if (!/^\d{10}$/.test(formData.phone)) e.phone = 'Enter a 10-digit phone number.'
    if (!formData.gender) e.gender = 'Select gender.'
    if (!formData.dob) e.dob = 'Date of birth is required.'
    if (!formData.bloodGroup) e.bloodGroup = 'Blood group is required.'
    // insurancePolicy may be optional; enforce only if your backend requires it:
    // if (!formData.insurancePolicy.trim()) e.insurancePolicy = 'Insurance policy is required.'
    if (formData.password.length < 8) e.password = 'Password must be at least 8 characters.'
    if (formData.password !== formData.confirmPassword) e.confirmPassword = 'Passwords do not match.'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationErrors = validate()
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    setApiError(null)
    setLoading(true)
    try {
      // Send exactly what backend expects
      const payload = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        gender: formData.gender,
        dob: formData.dob, // HTML date input gives YYYY-MM-DD
        insurancePolicy: formData.insurancePolicy.trim(),
        bloodGroup: formData.bloodGroup,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      }

      await registerUser(payload)
      navigate('/login', { replace: true })
    } catch (err) {
      setApiError(err?.message || 'Registration failed.')
    } finally {
      setLoading(false)
    }
  }

  const inputBase =
    'w-full rounded-lg border border-slate-300 px-4 py-3 outline-none ' +
    'focus:border-[#90e0ef] focus:ring-4 focus:ring-[#90e0ef]/30 transition'
  const rowClass = 'flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-4'
  const labelClass = 'md:w-40 font-semibold text-slate-900'
  const errorClass = 'text-sm text-red-600 md:ml-40'

  return (
    <>
      <Header />

      <div className="min-h-screen bg-[#f0fdfc] flex items-center justify-center px-4 py-10">
        <form
          className="w-full max-w-3xl bg-white rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.08)]
                     border-t-4 border-[#149e90] p-8"
          onSubmit={handleSubmit}
          noValidate
        >
          <h2 className="text-center text-2xl font-extrabold text-[#149e90] mb-6">
            Patient Registration
          </h2>

          {apiError && (
            <div className="mb-4 text-red-700 bg-red-50 border border-red-200 rounded p-3">
              {apiError}
            </div>
          )}

          {/* Full Name */}
          <div className={rowClass}>
            <label className={labelClass}>Full Name</label>
            <div className="flex-1">
              <input
                className={inputBase}
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
              />
            </div>
          </div>
          {errors.fullName && <div className={errorClass}>{errors.fullName}</div>}

          {/* Email */}
          <div className={rowClass}>
            <label className={labelClass}>Email</label>
            <div className="flex-1">
              <input
                className={inputBase}
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="example@gmail.com"
                required
              />
            </div>
          </div>
          {errors.email && <div className={errorClass}>{errors.email}</div>}

          {/* Phone */}
          <div className={rowClass}>
            <label className={labelClass}>Phone</label>
            <div className="flex-1">
              <input
                className={inputBase}
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="10-digit phone number"
                required
              />
            </div>
          </div>
          {errors.phone && <div className={errorClass}>{errors.phone}</div>}

          {/* Gender */}
          <div className={rowClass}>
            <label className={labelClass}>Gender</label>
            <div className="flex-1">
              <select
                className={inputBase}
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
              >
                <option value="">Select</option>
                <option value="MALE">MALE</option>
                <option value="FEMALE">FEMALE</option>
                <option value="OTHER">OTHER</option>
              </select>
            </div>
          </div>
          {errors.gender && <div className={errorClass}>{errors.gender}</div>}

          {/* Date of Birth */}
          <div className={rowClass}>
            <label className={labelClass}>Date of Birth</label>
            <div className="flex-1">
              <input
                className={inputBase}
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          {errors.dob && <div className={errorClass}>{errors.dob}</div>}

          {/* Insurance Policy */}
          <div className={rowClass}>
            <label className={labelClass}>Insurance Policy</label>
            <div className="flex-1">
              <input
                className={inputBase}
                type="text"
                name="insurancePolicy"
                value={formData.insurancePolicy}
                onChange={handleChange}
                placeholder="Enter insurance policy number"
              />
            </div>
          </div>
          {errors.insurancePolicy && <div className={errorClass}>{errors.insurancePolicy}</div>}

          {/* Blood Group */}
          <div className={rowClass}>
            <label className={labelClass}>Blood Group</label>
            <div className="flex-1">
              <select
                className={inputBase}
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleChange}
                required
              >
                <option value="">Select</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            </div>
          </div>
          {errors.bloodGroup && <div className={errorClass}>{errors.bloodGroup}</div>}

          {/* Password */}
          <div className={rowClass}>
            <label className={labelClass}>Password</label>
            <div className="flex-1">
              <input
                className={inputBase}
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a strong password"
                required
              />
            </div>
          </div>
          {errors.password && <div className={errorClass}>{errors.password}</div>}

          {/* Confirm Password */}
          <div className={rowClass}>
            <label className={labelClass}>Confirm Password</label>
            <div className="flex-1">
              <input
                className={inputBase}
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter your password"
                required
              />
            </div>
          </div>
          {errors.confirmPassword && <div className={errorClass}>{errors.confirmPassword}</div>}

          {/* (Optional) Address */}
          <div className={rowClass}>
            <label className={labelClass}>Address (optional)</label>
            <div className="flex-1">
              <input
                className={inputBase}
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter your address"
              />
            </div>
          </div>

          {/* (Optional) Health Status */}
          <div className={rowClass}>
            <label className={labelClass}>Health Status (optional)</label>
            <div className="flex-1">
              <textarea
                className={inputBase + ' resize-y'}
                name="healthStatus"
                value={formData.healthStatus}
                onChange={handleChange}
                rows={3}
                placeholder="Describe your current health status"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 rounded-lg bg-[#149e90] text-white font-semibold
                       py-3 hover:bg-[#1DB1A2] transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Registering…' : 'Register'}
          </button>

          <p className="text-center text-sm text-slate-500 mt-4">
            Already have an account?{' '}
            <Link className="text-[#149e90] hover:underline" to="/login">
              Login here
            </Link>
          </p>
        </form>
      </div>
    </>
  )
}