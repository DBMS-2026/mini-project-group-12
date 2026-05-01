import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, AtSign, Mail, Phone, Lock, Loader2, ArrowRight } from 'lucide-react'

const fieldVariants = {
  hidden: { opacity: 0, x: -30, filter: 'blur(4px)' },
  visible: (i) => ({
    opacity: 1, x: 0, filter: 'blur(0px)',
    transition: { type: 'spring', stiffness: 300, damping: 24, delay: 0.15 + i * 0.08 }
  }),
}

function SignupForm({ onSubmit, loading }) {
  const [formData, setFormData] = useState({
    fullName: '', username: '', email: '', phone: '', password: ''
  })
  const [focused, setFocused] = useState(null)

  const handleChange = (field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const fields = [
    { key: 'fullName', icon: User, placeholder: 'Full Name', type: 'text' },
    { key: 'username', icon: AtSign, placeholder: 'Username', type: 'text' },
    { key: 'email', icon: Mail, placeholder: 'Email address', type: 'email' },
    { key: 'phone', icon: Phone, placeholder: 'Phone (optional)', type: 'tel', required: false },
    { key: 'password', icon: Lock, placeholder: 'Password', type: 'password' },
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {fields.map((field, i) => (
        <motion.div
          key={field.key}
          custom={i}
          variants={fieldVariants}
          initial="hidden"
          animate="visible"
          className="relative"
        >
          <motion.div
            animate={{
              x: focused === field.key ? 2 : 0,
              scale: focused === field.key ? 1.1 : 1,
            }}
            transition={{ type: 'spring', stiffness: 500 }}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50"
          >
            <field.icon size={18} />
          </motion.div>
          <input
            type={field.type}
            placeholder={field.placeholder}
            value={formData[field.key]}
            onChange={handleChange(field.key)}
            onFocus={() => setFocused(field.key)}
            onBlur={() => setFocused(null)}
            required={field.required !== false}
            className={`w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white/15 text-white placeholder:text-white/50 outline-none border transition-all duration-300 text-sm backdrop-blur-sm ${
              focused === field.key
                ? 'border-white/50 bg-white/20 shadow-[0_0_20px_rgba(255,255,255,0.1)]'
                : 'border-white/15'
            }`}
          />
        </motion.div>
      ))}

      <motion.button
        custom={fields.length}
        variants={fieldVariants}
        initial="hidden"
        animate="visible"
        whileHover={{ scale: 1.03, boxShadow: '0 12px 30px rgba(255,255,255,0.15)' }}
        whileTap={{ scale: 0.97 }}
        type="submit"
        disabled={loading}
        className="w-full bg-white text-red-500 font-bold py-4 rounded-2xl text-sm hover:shadow-xl transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2 mt-2 group"
      >
        {loading ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Creating account...
          </>
        ) : (
          <>
            Create Account
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

export default SignupForm
