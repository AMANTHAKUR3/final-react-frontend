import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Header from '../Components/Header'
import { registerUser } from '../api/auth'
import loginHealthcare from '../assets/img.svg'

export default function RegisterHorizontal() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    gender: '',
    dob: '',
    insurancePolicy: '',
    bloodGroup: '',
    password: '',
    confirmPassword: '',
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
    if (formData.password.length < 8) e.password = 'Min 8 characters.'
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
      const payload = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        gender: formData.gender,
        dob: formData.dob,
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

  const inputCls =
    'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition ' +
    'focus:border-teal-400 focus:ring-2 focus:ring-teal-100 placeholder:text-slate-400'

  return (
    <>
      <Header />

      <div className="h-[calc(100vh-64px)] relative overflow-hidden bg-gradient-to-br from-cyan-50 via-white to-teal-50 px-4 py-4">
        <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-cyan-300/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-teal-300/30 blur-3xl" />

        <div className="relative mx-auto flex h-full w-full max-w-5xl items-center justify-center">
          <div className="grid w-full overflow-hidden rounded-2xl border border-white/50 bg-white/70 shadow-xl backdrop-blur-xl md:grid-cols-[260px_1fr]">

            {/* ── LEFT PANEL ── */}
            <div className="hidden md:flex flex-col justify-between bg-gradient-to-br from-[#0f766e] to-[#14b8a6] p-7 text-white">
              <div>
                <h2 className="text-2xl font-bold leading-tight">Create Account</h2>
                <p className="mt-2 text-sm text-white/80 leading-relaxed">
                  Register to book appointments, view records and manage your health journey.
                </p>
              </div>

              <div className="mt-4 rounded-xl p-3">
                <img
                  src={loginHealthcare}
                  alt="Healthcare illustration"
                  className="mx-auto w-[90%] h-auto max-h-[180px] object-contain"
                />
              </div>

              <p className="mt-4 text-center text-xs text-white/60">
                Already have an account?{' '}
                <Link className="cursor-pointer font-semibold text-white hover:underline" to="/login">
                  Sign in
                </Link>
              </p>
            </div>

            {/* ── RIGHT PANEL — FORM ── */}
            <form
              className="flex w-full items-center justify-center p-5 sm:p-6 overflow-y-auto max-h-[calc(100vh-120px)]"
              onSubmit={handleSubmit}
              noValidate
            >
              <div className="w-full max-w-md">
              <h1 className="text-xl font-extrabold text-slate-800">Patient Registration</h1>
              <p className="mt-0.5 text-xs text-slate-500">Fill in your details to get started</p>

              {apiError && (
                <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                  {apiError}
                </div>
              )}

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Full Name</label>
                  <input className={inputCls} type="text" name="fullName" value={formData.fullName} onChange={handleChange} required />
                  {errors.fullName && <span className="mt-0.5 block text-xs text-red-600">{errors.fullName}</span>}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Email</label>
                  <input className={inputCls} type="email" name="email" value={formData.email} onChange={handleChange}  required />
                  {errors.email && <span className="mt-0.5 block text-xs text-red-600">{errors.email}</span>}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Phone</label>
                  <input className={inputCls} type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="10-digit number" required />
                  {errors.phone && <span className="mt-0.5 block text-xs text-red-600">{errors.phone}</span>}
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Gender</label>
                  <select className={inputCls} name="gender" value={formData.gender} onChange={handleChange} required>
                    <option value="">Select</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                  {errors.gender && <span className="mt-0.5 block text-xs text-red-600">{errors.gender}</span>}
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Date of Birth</label>
                  <input className={inputCls} type="date" name="dob" value={formData.dob} onChange={handleChange} required />
                  {errors.dob && <span className="mt-0.5 block text-xs text-red-600">{errors.dob}</span>}
                </div>

                {/* Blood Group */}
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Blood Group</label>
                  <select className={inputCls} name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} required>
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
                  {errors.bloodGroup && <span className="mt-0.5 block text-xs text-red-600">{errors.bloodGroup}</span>}
                </div>

                {/* Insurance Policy — full width */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Insurance Policy <span className="text-slate-400">(optional)</span>
                  </label>
                  <input className={inputCls} type="text" name="insurancePolicy" value={formData.insurancePolicy} onChange={handleChange} placeholder="Policy number" />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Password</label>
                  <input className={inputCls} type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Min 8 characters" required />
                  {errors.password && <span className="mt-0.5 block text-xs text-red-600">{errors.password}</span>}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Confirm Password</label>
                  <input className={inputCls} type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Re-enter password" required />
                  {errors.confirmPassword && <span className="mt-0.5 block text-xs text-red-600">{errors.confirmPassword}</span>}
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="mt-5 mx-auto block w-full max-w-xs cursor-pointer rounded-lg bg-gradient-to-r from-teal-600 to-cyan-600 py-2.5 text-sm font-semibold text-white shadow-md shadow-teal-200 transition hover:from-teal-500 hover:to-cyan-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? 'Registering…' : 'Create Account'}
              </button>

              {/* Mobile-only login link */}
              <p className="mt-3 text-center text-xs text-slate-500 md:hidden">
                Already have an account?{' '}
                <Link className="cursor-pointer font-semibold text-[#F0745A] hover:underline" to="/login">
                  Login here
                </Link>
              </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}