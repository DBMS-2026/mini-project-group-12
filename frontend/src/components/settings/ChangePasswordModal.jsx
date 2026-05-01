import { useState } from 'react'
import { motion } from 'framer-motion'
import { Lock, Loader2, Check } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'
import toast from 'react-hot-toast'
import api from '../../services/api'

function ChangePasswordModal({ onClose }) {
  const { darkMode } = useTheme()
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [saving, setSaving] = useState(false)
  const [focused, setFocused] = useState(null)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (formData.newPassword !== formData.confirmPassword) {
      return toast.error('New passwords do not match')
    }

    setSaving(true)
    try {
      await api.put('/auth/change-password', {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      })
      toast.success('Password changed successfully!')
      onClose()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password')
    } finally {
      setSaving(false)
    }
  }

  const inputClass = (field) => `w-full pl-11 pr-4 py-3.5 rounded-2xl text-sm outline-none border transition-all duration-300 ${
    darkMode
      ? `bg-white/[0.04] text-gray-200 placeholder:text-gray-600 ${
          focused === field ? 'border-orange-500/30 bg-white/[0.06] shadow-[0_0_20px_rgba(249,115,22,0.06)]' : 'border-white/[0.06]'
        }`
      : `bg-gray-50/80 text-gray-800 placeholder:text-gray-400 ${
          focused === field ? 'border-orange-300 bg-white shadow-[0_0_20px_rgba(249,115,22,0.06)]' : 'border-gray-100'
        }`
  }`

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {['currentPassword', 'newPassword', 'confirmPassword'].map((field, i) => (
        <motion.div
          key={field}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 0.1 + i * 0.05 } }}
        >
          <label className={`block text-[12px] font-semibold mb-1.5 tracking-wide uppercase ${
            darkMode ? 'text-gray-500' : 'text-gray-400'
          }`}>
            {field.replace(/([A-Z])/g, ' $1').trim()}
          </label>
          <div className="relative">
            <motion.div
              animate={{
                scale: focused === field ? 1.1 : 1,
                color: focused === field ? '#f97316' : (darkMode ? '#4a5568' : '#9ca3af'),
              }}
              transition={{ type: 'spring', stiffness: 500 }}
              className="absolute left-3.5 top-1/2 -translate-y-1/2"
            >
              <Lock size={16} />
            </motion.div>
            <input
              type="password"
              name={field}
              value={formData[field]}
              onChange={handleChange}
              onFocus={() => setFocused(field)}
              onBlur={() => setFocused(null)}
              placeholder="••••••••"
              required
              minLength={6}
              className={inputClass(field)}
            />
          </div>
        </motion.div>
      ))}

      <motion.button
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0, transition: { delay: 0.25 } }}
        whileHover={{ scale: 1.02, boxShadow: '0 12px 30px rgba(239, 68, 68, 0.3)' }}
        whileTap={{ scale: 0.98 }}
        type="submit"
        disabled={saving}
        className="w-full gradient-btn py-3.5 text-sm font-bold disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
      >
        {saving ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Updating...
          </>
        ) : (
          <>
            <Check size={16} />
            Update Password
          </>
        )}
      </motion.button>
    </form>
  )
}

export default ChangePasswordModal
