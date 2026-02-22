import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Header from '../Components/Header'
import { resetPassword } from '../api/auth'
import loginHealthcare from '../assets/img.svg'

export default function ForgotPassword() {
  const [formData, setFormData] = useState({
    email: '',
    newPassword: '',
    confirmPassword: '',
  })

  const [errors, setErrors] = useState({})
  const [apiMsg, setApiMsg] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const validate = () => {
    const newErrors = {}
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Valid email is required.'
    if (formData.newPassword.length < 6)
      newErrors.newPassword = 'Password must be at least 6 characters.'
    if (formData.newPassword !== formData.confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match.'
    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationErrors = validate()
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    setApiMsg(null)
    setLoading(true)
    try {
      await resetPassword({
        email: formData.email.trim(),
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword,
      })
      setApiMsg('Password changed successfully!')
      setTimeout(() => navigate('/login', { replace: true }), 800)
    } catch (err) {
      setApiMsg(err?.message || 'Failed to change password.')
    } finally {
      setLoading(false)
    }
  }

  const inputCls =
    'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition ' +
    'focus:border-teal-400 focus:ring-2 focus:ring-teal-100 placeholder:text-slate-400'

  const isSuccess = apiMsg?.includes('successfully')

  return (
    <>
      <Header />

      <div className="h-[calc(100vh-64px)] relative overflow-hidden bg-gradient-to-br from-cyan-50 via-white to-teal-100 px-4 py-4">
        <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-cyan-300/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-teal-300/30 blur-3xl" />

        <div className="relative mx-auto flex h-full w-full max-w-4xl items-center justify-center">
          <div className="grid w-full overflow-hidden rounded-2xl border border-white/50 bg-white/60 shadow-xl backdrop-blur-xl md:grid-cols-[35%_65%]">

            {/* ── LEFT PANEL ── */}
            <div className="hidden md:flex flex-col justify-center bg-gradient-to-br from-[#0f766e] to-[#14b8a6] p-7 text-white">
              <h2 className="text-2xl font-bold leading-tight">Reset Password</h2>
              <p className="mt-2 text-sm text-white/90 leading-relaxed">
                Enter your email and set a new password to regain access to your account.
              </p>

              <div className="mt-5 rounded-xl p-3 backdrop-blur-sm">
                <img
                  src={loginHealthcare}
                  alt="Healthcare illustration"
                  className="mx-auto w-[85%] h-auto max-h-[220px] object-contain"
                />
              </div>
            </div>

            {/* ── RIGHT PANEL — FORM ── */}
            <form className="flex w-full items-center justify-center p-5 sm:p-6" onSubmit={handleSubmit} noValidate>
              <div className="w-full max-w-sm">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-800">Forgot Password</h1>
              <p className="mt-1 text-xs text-slate-500">Enter your details to reset your password</p>

              {apiMsg && (
                <div className={`mt-3 rounded-lg border px-3 py-2 text-xs ${
                  isSuccess
                    ? 'border-teal-200 bg-teal-50 text-teal-700'
                    : 'border-red-200 bg-red-50 text-red-700'
                }`}>
                  {apiMsg}
                </div>
              )}

              {/* Email */}
              <label className="mt-4 block text-xs font-medium text-slate-600">Email</label>
              <input
                className={inputCls + ' mt-1'}
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
              {errors.email && <span className="mt-0.5 block text-xs text-red-600">{errors.email}</span>}

              {/* New Password */}
              <label className="mt-3 block text-xs font-medium text-slate-600">New Password</label>
              <input
                className={inputCls + ' mt-1'}
                type="password"
                name="newPassword"
                placeholder="Min 6 characters"
                value={formData.newPassword}
                onChange={handleChange}
                required
              />
              {errors.newPassword && <span className="mt-0.5 block text-xs text-red-600">{errors.newPassword}</span>}

              {/* Confirm Password */}
              <label className="mt-3 block text-xs font-medium text-slate-600">Confirm Password</label>
              <input
                className={inputCls + ' mt-1'}
                type="password"
                name="confirmPassword"
                placeholder="Re-enter password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              {errors.confirmPassword && <span className="mt-0.5 block text-xs text-red-600">{errors.confirmPassword}</span>}

              <button
                type="submit"
                disabled={loading}
                className="mt-5 mx-auto block w-full max-w-xs cursor-pointer rounded-lg bg-gradient-to-r from-teal-600 to-cyan-600 py-2.5 text-sm font-semibold text-white shadow-md shadow-teal-200 transition hover:from-teal-500 hover:to-cyan-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? 'Changing…' : 'Change Password'}
              </button>

              <p className="mt-4 text-center text-xs text-slate-500">
                <Link className="cursor-pointer font-semibold text-[#F0745A] hover:underline" to="/login">
                  ← Back to Login
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
