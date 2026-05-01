import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { User, AtSign, Phone, FileText, Loader2, Check, Camera, MapPin } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'
import { uploadImage } from '../../services/uploadService'
import toast from 'react-hot-toast'

const API_BASE = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:5000'

const fieldVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 24, delay: 0.1 + i * 0.07 }
  }),
}

const fields = [
  { key: 'fullName', label: 'Full Name', icon: User, type: 'text', placeholder: 'Your full name' },
  { key: 'username', label: 'Username', icon: AtSign, type: 'text', placeholder: 'your_username' },
  { key: 'phone', label: 'Phone', icon: Phone, type: 'tel', placeholder: '+91 XXXXX XXXXX' },
]

function EditProfileModal({ user, onClose, onSave, isOpen }) {
  const { darkMode } = useTheme()
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    username: user?.username || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
    address: user?.address || '',
  })
  const [saving, setSaving] = useState(false)
  const [focused, setFocused] = useState(null)
  
  const fileInputRef = useRef(null)
  const [avatarFile, setAvatarFile] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState(
    user?.avatar ? (user.avatar.startsWith('http') ? user.avatar : `${API_BASE}${user.avatar}`) : null
  )

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image must be less than 5MB')
        return
      }
      setAvatarFile(file)
      setAvatarPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      let finalFormData = { ...formData }
      if (avatarFile) {
        const uploadRes = await uploadImage(avatarFile)
        if (uploadRes?.data?.url) {
          finalFormData.avatar = uploadRes.data.url
        }
      }
      await onSave(finalFormData)
    } catch (err) {
      toast.error('Failed to save profile')
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
      {/* Avatar Upload */}
      <motion.div custom={0} variants={fieldVariants} initial="hidden" animate="visible" className="flex justify-center mb-6">
        <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
          <div className={`w-24 h-24 rounded-full overflow-hidden border-4 ${darkMode ? 'border-[#1a1a2e]' : 'border-white'} shadow-xl`}>
            {avatarPreview ? (
              <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white text-3xl font-bold">
                {formData.fullName?.charAt(0) || formData.username?.charAt(0) || 'U'}
              </div>
            )}
          </div>
          <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera size={24} className="text-white" />
          </div>
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
        </div>
      </motion.div>

      {fields.map((field, i) => (
        <motion.div
          key={field.key}
          custom={i + 1}
          variants={fieldVariants}
          initial="hidden"
          animate="visible"
        >
          <label className={`block text-[12px] font-semibold mb-1.5 tracking-wide uppercase ${
            darkMode ? 'text-gray-500' : 'text-gray-400'
          }`}>
            {field.label}
          </label>
          <div className="relative">
            <motion.div
              animate={{
                scale: focused === field.key ? 1.1 : 1,
                color: focused === field.key ? (darkMode ? '#f97316' : '#f97316') : (darkMode ? '#4a5568' : '#9ca3af'),
              }}
              transition={{ type: 'spring', stiffness: 500 }}
              className="absolute left-3.5 top-1/2 -translate-y-1/2"
            >
              <field.icon size={16} />
            </motion.div>
            <input
              type={field.type}
              name={field.key}
              value={formData[field.key]}
              onChange={handleChange}
              onFocus={() => setFocused(field.key)}
              onBlur={() => setFocused(null)}
              placeholder={field.placeholder}
              className={inputClass(field.key)}
            />
          </div>
        </motion.div>
      ))}

      {/* Bio field */}
      <motion.div custom={4} variants={fieldVariants} initial="hidden" animate="visible">
        <label className={`block text-[12px] font-semibold mb-1.5 tracking-wide uppercase ${
          darkMode ? 'text-gray-500' : 'text-gray-400'
        }`}>
          Bio
        </label>
        <div className="relative">
          <motion.div
            animate={{
              scale: focused === 'bio' ? 1.1 : 1,
              color: focused === 'bio' ? '#f97316' : (darkMode ? '#4a5568' : '#9ca3af'),
            }}
            transition={{ type: 'spring', stiffness: 500 }}
            className="absolute left-3.5 top-3.5"
          >
            <FileText size={16} />
          </motion.div>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            onFocus={() => setFocused('bio')}
            onBlur={() => setFocused(null)}
            rows={3}
            placeholder="Tell people about your food journey..."
            className={`${inputClass('bio')} resize-none`}
          />
        </div>
      </motion.div>

      {/* Address field */}
      <motion.div custom={5} variants={fieldVariants} initial="hidden" animate="visible">
        <label className={`block text-[12px] font-semibold mb-1.5 tracking-wide uppercase ${
          darkMode ? 'text-gray-500' : 'text-gray-400'
        }`}>
          Address
        </label>
        <div className="relative">
          <motion.div
            animate={{
              scale: focused === 'address' ? 1.1 : 1,
              color: focused === 'address' ? '#f97316' : (darkMode ? '#4a5568' : '#9ca3af'),
            }}
            transition={{ type: 'spring', stiffness: 500 }}
            className="absolute left-3.5 top-3.5"
          >
            <MapPin size={16} />
          </motion.div>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            onFocus={() => setFocused('address')}
            onBlur={() => setFocused(null)}
            rows={2}
            placeholder="Your delivery address..."
            className={`${inputClass('address')} resize-none`}
          />
        </div>
      </motion.div>

      {/* Submit */}
      <motion.button
        custom={6}
        variants={fieldVariants}
        initial="hidden"
        animate="visible"
        whileHover={{ scale: 1.02, boxShadow: '0 12px 30px rgba(239, 68, 68, 0.3)' }}
        whileTap={{ scale: 0.98 }}
        type="submit"
        disabled={saving}
        className="w-full gradient-btn py-3.5 text-sm font-bold disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
      >
        {saving ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <Check size={16} />
            Save Changes
          </>
        )}
      </motion.button>
    </form>
  )
}

export default EditProfileModal
