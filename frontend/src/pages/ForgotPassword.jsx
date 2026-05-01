import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, ArrowLeft, Loader2, KeyRound } from 'lucide-react'
import toast from 'react-hot-toast'
import { forgotPassword } from '../services/authService'
import AuthLayout from '../components/auth/AuthLayout'

function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [resetToken, setResetToken] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email) return toast.error('Please enter your email')

    setLoading(true)
    try {
      const res = await forgotPassword(email)
      setSuccess(true)
      // Display the token for demo purposes
      if (res.data && res.data.resetToken) {
        setResetToken(res.data.resetToken)
      }
      toast.success('Password reset link generated!')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to process request')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full pl-12 pr-4 py-4 rounded-2xl bg-white/15 text-white placeholder:text-white/50 outline-none border border-white/15 transition-all duration-300 text-sm backdrop-blur-sm focus:border-white/50 focus:bg-white/20 focus:shadow-[0_0_20px_rgba(255,255,255,0.1)]"

  return (
    <AuthLayout>
      <div className="w-full max-w-md bg-white/[0.08] backdrop-blur-3xl rounded-[32px] shadow-[0_32px_64px_rgba(0,0,0,0.3)] p-8 sm:p-10 border border-white/[0.12]">
        
        <Link to="/" className="inline-flex items-center text-white/60 hover:text-white text-sm mb-6 transition-colors">
          <ArrowLeft size={16} className="mr-1" /> Back to Login
        </Link>

        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="mx-auto w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
            <KeyRound size={28} className="text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-white font-['Outfit'] mb-2 tracking-tight">
            Reset Password
          </h1>
          <p className="text-white/50 text-[13px] tracking-wide px-4">
            Enter your email and we'll send you instructions to reset your password.
          </p>
        </motion.div>

        {!success ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50">
                <Mail size={18} />
              </div>
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={inputClass}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-red-500 font-bold py-4 rounded-2xl text-sm hover:shadow-xl transition-all duration-200 mt-2 flex items-center justify-center gap-2"
            >
              {loading ? (
                <><Loader2 size={18} className="animate-spin" /> Processing...</>
              ) : (
                'Send Reset Link'
              )}
            </button>
          </form>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-green-500/10 border border-green-500/20 rounded-2xl p-6 text-center space-y-4"
          >
            <h3 className="text-green-400 font-bold">Email Sent! (Demo Mode)</h3>
            <p className="text-white/70 text-sm">
              We've generated a password reset link for you.
            </p>
            {resetToken && (
              <div className="pt-4 border-t border-white/10">
                <p className="text-white/50 text-xs mb-2">Simulated Email Link:</p>
                <Link 
                  to={`/reset-password/${resetToken}`}
                  className="inline-block bg-white/10 text-white px-4 py-2 rounded-xl text-xs hover:bg-white/20 transition-colors break-all"
                >
                  Click here to reset password
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </AuthLayout>
  )
}

export default ForgotPassword
