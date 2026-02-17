import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Header from '../Components/Header'
import { resetPassword } from '../api/auth'

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

  const inputBase =
    'w-full rounded-lg border border-slate-300 px-4 py-3 outline-none ' +
    'focus:border-[#90e0ef] focus:ring-4 focus:ring-[#90e0ef]/30 transition'

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
            Forgot Password
          </h2>

          {apiMsg && (
            <div className="mb-4 text-slate-700 bg-slate-50 border border-slate-200 rounded p-3">
              {apiMsg}
            </div>
          )}

          {/* Email */}
          <label className="block mt-3 mb-1 text-sm text-slate-500">Email</label>
          <input
            className={inputBase}
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          {errors.email && (
            <span className="block text-sm text-red-600 mt-1">{errors.email}</span>
          )}

          {/* New Password */}
          <label className="block mt-4 mb-1 text-sm text-slate-500">New Password</label>
          <input
            className={inputBase}
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            required
          />
          {errors.newPassword && (
            <span className="block text-sm text-red-600 mt-1">{errors.newPassword}</span>
          )}

          {/* Confirm Password */}
          <label className="block mt-4 mb-1 text-sm text-slate-500">Confirm Password</label>
          <input
            className={inputBase}
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          {errors.confirmPassword && (
            <span className="block text-sm text-red-600 mt-1">
              {errors.confirmPassword}
            </span>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 rounded-lg bg-[#149e90] text-white font-semibold
                       py-3 hover:bg-[#1DB1A2] transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Changing…' : 'Change Password'}
          </button>

          <p className="text-center text-sm text-slate-500 mt-4">
            <Link className="text-[#149e90] hover:underline" to="/login">
              Back to Login
            </Link>
          </p>
        </form>
      </div>
    </>
  )
}
