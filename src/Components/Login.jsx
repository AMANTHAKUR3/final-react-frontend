import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Header from './Header'
import { useRole } from '../Context/RoleContext'
import { login } from '../api/auth'

export default function LoginWithRoles() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: '',
  })

  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [apiError, setApiError] = useState(null)
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()
  const { role, loginAs } = useRole()

  useEffect(() => {
    if (role === 'admin') navigate('/admin', { replace: true })
    else if (role === 'doctor') navigate('/doctor-dashboard', { replace: true })
    else if (role === 'patient') navigate('/patient-dashboard', { replace: true })
  }, [role, navigate])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const validate = () => {
    const newErrors = {}
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Valid email is required.'
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters.'
    if (!formData.role) newErrors.role = 'Please select a role.'
    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setApiError(null)

    const validationErrors = validate()
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    setLoading(true)
    try {
      const payload = {
        email: formData.email.trim(),
        password: formData.password,
        role: formData.role, // required by your backend
      }
      console.log("📤 Sending login request:", payload);
      const res = await login(payload)
      console.log("📥 Login response:", res);

      // Store JWT token
      if (res?.token) {
        localStorage.setItem('token', res.token)
        console.log("🔑 JWT token stored");
      } else {
        console.warn("⚠️ No token in response!");
      }

      // API returns: { userId, email, role, patientId, token }
      const resolvedRole = (res?.role || formData.role || '').toLowerCase()
      const resolvedUserId = res?.userId
      const resolvedEmail = res?.email || formData.email.trim()
      
      // Store patientId if available
      if (res?.patientId) {
        localStorage.setItem('patientId', res.patientId.toString())
        console.log("👤 Patient ID stored:", res.patientId);
      }
      
      console.log("👤 Extracted - Role:", resolvedRole, "UserID:", resolvedUserId, "Email:", resolvedEmail);
      
      if (!resolvedUserId) {
        console.error("❌ No userId in response!");
        setApiError('Login failed: User ID not found');
        return;
      }
      
    loginAs(resolvedRole, resolvedUserId, resolvedEmail);
      // console.log("✅ Login successful, stored info:", loginInfo);
      // localStorage.setItem("loginInfo", JSON.stringify(loginInfo)); // for debugging, remove later
      // navigation handled by useEffect
    } catch (err) {
      console.error("❌ Login error:", err);
      setApiError('Invalid credentials.')  // err?.message || 
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Header />

      <div className="min-h-screen bg-[#f0fdfc] flex items-center justify-center px-4 py-10">
        <form
          className="w-full max-w-md bg-white rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.08)]
                     border-t-4 border-[#149e90] p-8"
          onSubmit={handleSubmit}
          noValidate
        >
          <h2 className="text-center text-2xl font-extrabold text-[#149e90] mb-6">
            Login Portal
          </h2>

          {apiError && (
            <div className="mb-3 text-red-700 bg-red-50 border border-red-200 rounded p-3">
              {apiError}
            </div>
          )}

          {/* Email */}
          <label className="block mt-3 mb-1 text-sm text-slate-500">Email</label>
          <input
            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none
                       focus:border-[#90e0ef] focus:ring-4 focus:ring-[#90e0ef]/30 transition"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          {errors.email && (
            <span className="block text-sm text-red-600 mt-1">{errors.email}</span>
          )}

          {/* Password */}
          <label className="block mt-4 mb-1 text-sm text-slate-500">Password</label>
          <div className="relative">
            <input
              className="w-full rounded-lg border border-slate-300 px-4 py-3 pr-16 outline-none
                         focus:border-[#90e0ef] focus:ring-4 focus:ring-[#90e0ef]/30 transition"
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-slate-500
                         px-2 py-1 rounded-md hover:bg-slate-100 hover:text-slate-900
                         focus:outline-none focus-visible:ring-2 focus-visible:ring-[#90e0ef]/70"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          {errors.password && (
            <span className="block text-sm text-red-600 mt-1">{errors.password}</span>
          )}

          {/* Forgot Password */}
          <p className="text-center text-sm text-slate-500 mt-4">
            <Link className="text-[#149e90] hover:underline" to="/forgot-password">
              Forgot Password?
            </Link>
          </p>

          {/* Role */}
          <label className="block mt-4 mb-1 text-sm text-slate-500">Role</label>
          <div className="mt-2 flex gap-6 text-sm text-slate-700">
            {['patient', 'admin', 'doctor'].map((r) => (
              <label key={r} className="flex items-center gap-2 font-medium">
                <input
                  type="radio"
                  name="role"
                  value={r}
                  checked={formData.role === r}
                  onChange={handleChange}
                  className="accent-[#149e90]"
                />
                {r.charAt(0).toUpperCase() + r.slice(1)}
              </label>
            ))}
          </div>
          {errors.role && (
            <span className="block text-sm text-red-600 mt-1">{errors.role}</span>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 rounded-lg bg-[#149e90] text-white font-semibold
                       py-3 hover:bg-[#1DB1A2] transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in…' : 'Login'}
          </button>

          {/* Switch link */}
          <p className="text-center text-sm text-slate-500 mt-4">
            New patient?{' '}
            <Link className="text-[#149e90] hover:underline" to="/register">
              Register here
            </Link>
          </p>
        </form>
      </div>
    </>
  )
}