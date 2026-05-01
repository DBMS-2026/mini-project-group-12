import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { signupUser } from '../services/authService'
import SignupForm from '../components/auth/SignupForm'
import AuthLayout from '../components/auth/AuthLayout'

function Signup() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSignup = async (formData) => {
    setLoading(true)
    setError('')

    try {
      const response = await signupUser(formData)
      login(response.data.user, response.data.token)
      toast.success('Account created! Welcome to Crave Food 🎉')
      navigate('/home')
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Signup failed'
      setError(msg)
      toast.error(msg)
      if (!err.response) {
        const userData = { id: 1, fullName: formData.fullName, username: formData.username, email: formData.email, phone: formData.phone, bio: '', avatar: '' }
        login(userData, 'demo-token')
        navigate('/home')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout>
      <div className="w-full max-w-lg bg-white/[0.08] backdrop-blur-3xl rounded-[32px] shadow-[0_32px_64px_rgba(0,0,0,0.3)] p-8 sm:p-10 border border-white/[0.12]">
        <motion.div
          initial={{ opacity: 0, y: -15, filter: 'blur(4px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
          className="text-center mb-6"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.05 }}
            className="text-5xl mb-4"
          >
            🍕
          </motion.div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-['Outfit'] mb-2 tracking-tight">
            Join Crave Food
          </h1>
          <p className="text-white/50 text-[13px] tracking-wide">
            Start sharing your food journey
          </p>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -5, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="bg-red-500/10 border border-red-400/15 text-red-200 px-4 py-3 rounded-2xl mb-5 text-[13px] text-center backdrop-blur-sm"
          >
            {error}
          </motion.div>
        )}

        <SignupForm onSubmit={handleSignup} loading={loading} />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-8"
        >
          <div className="h-px w-full mb-6 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <p className="text-white/40 text-[13px]">
            Already have an account?{' '}
            <Link to="/" className="text-white/90 font-semibold hover:text-white transition-colors">
              Login
            </Link>
          </p>
        </motion.div>
      </div>
    </AuthLayout>
  )
}

export default Signup