import { useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Lock, ArrowLeft, Loader2, KeyRound } from 'lucide-react'
import toast from 'react-hot-toast'
import { resetPassword } from '../services/authService'
import AuthLayout from '../components/auth/AuthLayout'

function ResetPassword() {
  const { token } = useParams()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!password || !confirmPassword) return toast.error('Please fill in all fields')
    if (password !== confirmPassword) return toast.error('Passwords do not match')
    if (password.length < 6) return toast.error('Password must be at least 6 characters')

    setLoading(true)
    try {
      await resetPassword(token, password)
      toast.success('Password reset successfully! You can now log in.')
      navigate('/')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reset password. The token may be expired.')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full pl-12 pr-4 py-4 rounded-2xl bg-white/15 text-white placeholder:text-white/50 outline-none border border-white/15 transition-all duration-300 text-sm backdrop-blur-sm focus:border-white/50 focus:bg-white/20 focus:shadow-[0_0_20px_rgba(255,255,255,0.1)]"

  return (
    <AuthLayout>
      <div className="w-full max-w-md bg-white/[0.08] backdrop-blur-3xl rounded-[32px] shadow-[0_32px_64px_rgba(0,0,0,0.3)] p-8 sm:p-10 border border-white/[0.12]">
        
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="mx-auto w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
            <KeyRound size={28} className="text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-white font-['Outfit'] mb-2 tracking-tight">
            Create New Password
          </h1>
          <p className="text-white/50 text-[13px] tracking-wide px-4">
            Please enter your new password below.
          </p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50">
              <Lock size={18} />
            </div>
            <input
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={inputClass}
            />
          </div>

          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50">
              <Lock size={18} />
            </div>
            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className={inputClass}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-red-500 font-bold py-4 rounded-2xl text-sm hover:shadow-xl transition-all duration-200 mt-4 flex items-center justify-center gap-2"
          >
            {loading ? (
              <><Loader2 size={18} className="animate-spin" /> Saving...</>
            ) : (
              'Reset Password'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/" className="inline-flex items-center text-white/60 hover:text-white text-sm transition-colors">
            <ArrowLeft size={16} className="mr-1" /> Back to Login
          </Link>
        </div>
      </div>
    </AuthLayout>
  )
}

export default ResetPassword
