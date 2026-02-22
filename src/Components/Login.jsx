import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Header from './Header'
import { useRole } from '../Context/RoleContext'
import { login } from '../api/auth'
import loginHealthcare from '../assets/img.svg'

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
        role: formData.role,
      }

      const res = await login(payload)

      const resolvedRole = (res?.role || formData.role || '').toLowerCase()
      const resolvedUserId = res?.userId
      const resolvedEmail = res?.email || formData.email.trim()

      if (!resolvedUserId) {
        setApiError('Login failed: User ID not found')
        return
      }

      loginAs(resolvedRole, resolvedUserId, resolvedEmail)
    } catch (err) {
      setApiError('Invalid credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Header />

      <div className="h-[calc(100vh-64px)] relative overflow-hidden bg-gradient-to-br from-cyan-50 via-white to-teal-100 px-4 py-4">
        <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-cyan-300/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-70 rounded-full bg-teal-300/30 blur-3xl" />

        <div className="relative mx-auto flex h-full w-full max-w-4xl items-center justify-center">
          <div className="grid w-full overflow-hidden rounded-2xl border border-white/50 bg-white/60 shadow-xl backdrop-blur-xl md:grid-cols-[35%_65%]">
            <div className="hidden md:flex flex-col justify-center bg-gradient-to-br from-[#0f766e] to-[#14b8a6] p-7 text-white">
              <h2 className="text-2xl font-bold leading-tight">Welcome Back</h2>
              <p className="mt-2 text-sm text-white/90">Secure access to your healthcare dashboard.</p>

              <div className="mt-5 rounded-xl p-3 backdrop-blur-sm">
                <img
                  src={loginHealthcare}
                  alt="Doctor and healthcare login illustration"
                  className="mx-auto w-[85%] h-auto max-h-[220px] object-contain"
                />
              </div>
            </div>

            <form className="flex w-full items-center justify-center p-5 sm:p-6" onSubmit={handleSubmit} noValidate>
              <div className="w-full max-w-sm">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-800">Login</h1>
              <p className="mt-1 text-xs text-slate-500">Please enter your details to continue</p>

              {apiError && (
                <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                  {apiError}
                </div>
              )}

              <label className="mt-4 block text-xs font-medium text-slate-600">Email</label>
              <input
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-teal-400 focus:ring-3 focus:ring-teal-100"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
              {errors.email && <span className="mt-1 block text-xs text-red-600">{errors.email}</span>}

              <label className="mt-3 block text-xs font-medium text-slate-600">Password</label>
              <div className="relative mt-1">
                <input
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 pr-16 text-sm outline-none transition focus:border-teal-400 focus:ring-3 focus:ring-teal-100"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer rounded-md px-2 py-1 text-xs font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              {errors.password && <span className="mt-1 block text-xs text-red-600">{errors.password}</span>}

              <div className="mt-2 text-right">
                <Link className="cursor-pointer text-xs font-medium text-[#F0745A] hover:underline" to="/forgot-password">
                  Forgot Password?
                </Link>
              </div>

              <label className="mt-3 block text-xs font-medium text-slate-600">Select Role</label>
              <div className="mt-1.5 grid grid-cols-3 gap-1.5">
                {['patient', 'admin', 'doctor'].map((r) => {
                  const active = formData.role === r
                  return (
                    <label
                      key={r}
                      className={`cursor-pointer rounded-lg border px-2 py-1.5 text-center text-xs font-semibold transition ${
                        active
                          ? 'border-teal-600 bg-teal-600 text-white shadow-sm'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-teal-300 hover:text-teal-700'
                      }`}
                    >
                      <input type="radio" name="role" value={r} checked={active} onChange={handleChange} className="hidden" />
                      {r.charAt(0).toUpperCase() + r.slice(1)}
                    </label>
                  )
                })}
              </div>
              {errors.role && <span className="mt-1 block text-xs text-red-600">{errors.role}</span>}

              <button
                type="submit"
                disabled={loading}
                className="mt-5 mx-auto block w-full max-w-xs cursor-pointer rounded-lg bg-gradient-to-r from-teal-600 to-cyan-600 py-2.5 text-sm font-semibold text-white shadow-md shadow-teal-200 transition hover:from-teal-500 hover:to-cyan-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? 'Signing in…' : 'Sign In'}
              </button>

              <p className="mt-4 text-center text-xs text-slate-500">
                New patient?{' '}
                <Link className="cursor-pointer font-semibold text-[#F0745A] hover:underline" to="/register">
                  Register here
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