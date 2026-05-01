import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Lock, Loader2, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const fieldVariants = {
  hidden: { opacity: 0, x: -30, filter: 'blur(4px)' },
  visible: (i) => ({
    opacity: 1, x: 0, filter: 'blur(0px)',
    transition: { type: 'spring', stiffness: 300, damping: 24, delay: 0.2 + i * 0.1 }
  }),
}

function LoginForm({ onSubmit, loading }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [focused, setFocused] = useState(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({ email, password })
  }

  const inputClass = (field) => `w-full pl-12 pr-4 py-4 rounded-2xl bg-white/15 text-white placeholder:text-white/50 outline-none border transition-all duration-300 text-sm backdrop-blur-sm ${
    focused === field ? 'border-white/50 bg-white/20 shadow-[0_0_20px_rgba(255,255,255,0.1)]' : 'border-white/15'
  }`

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <motion.div custom={0} variants={fieldVariants} initial="hidden" animate="visible" className="relative">
        <motion.div
          animate={{ x: focused === 'email' ? 2 : 0, scale: focused === 'email' ? 1.1 : 1 }}
          transition={{ type: 'spring', stiffness: 500 }}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50"
        >
          <Mail size={18} />
        </motion.div>
        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onFocus={() => setFocused('email')}
          onBlur={() => setFocused(null)}
          required
          className={inputClass('email')}
        />
      </motion.div>

      <motion.div custom={1} variants={fieldVariants} initial="hidden" animate="visible" className="relative">
        <motion.div
          animate={{ x: focused === 'password' ? 2 : 0, scale: focused === 'password' ? 1.1 : 1 }}
          transition={{ type: 'spring', stiffness: 500 }}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50"
        >
          <Lock size={18} />
        </motion.div>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onFocus={() => setFocused('password')}
          onBlur={() => setFocused(null)}
          required
          className={inputClass('password')}
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 pr-2">
           {/* If you wanted a custom eye toggle it would go here */}
        </div>
      </motion.div>

      <motion.div custom={1.5} variants={fieldVariants} initial="hidden" animate="visible" className="flex justify-end">
        <Link to="/forgot-password" className="text-white/70 text-[12px] hover:text-white transition-colors">
          Forgot Password?
        </Link>
      </motion.div>

      <motion.button
        custom={2}
        variants={fieldVariants}
        initial="hidden"
        animate="visible"
        whileHover={{ scale: 1.03, boxShadow: '0 12px 30px rgba(255,255,255,0.15)' }}
        whileTap={{ scale: 0.97 }}
        type="submit"
        disabled={loading}
        className="w-full bg-white text-red-500 font-bold py-4 rounded-2xl text-sm hover:shadow-xl transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2 group"
      >
        {loading ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Signing in...
          </>
        ) : (
          <>
            Sign In
            <motion.div
              className="inline-block"
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <ArrowRight size={16} />
            </motion.div>
          </>
        )}
      </motion.button>
    </form>
  )
}

export default LoginForm
