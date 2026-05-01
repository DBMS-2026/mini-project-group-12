import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Settings as SettingsIcon, User, Lock, Palette, LogOut, Sun, Moon, ChevronRight } from 'lucide-react'
import MainLayout from '../components/layout/MainLayout'
import Modal from '../components/common/Modal'
import ChangePasswordModal from '../components/settings/ChangePasswordModal'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.97 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { type: 'spring', stiffness: 260, damping: 22 }
  },
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
}

function Settings() {
  const { user, logout } = useAuth()
  const { darkMode, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const [passwordModal, setPasswordModal] = useState(false)

  const handleLogout = () => { logout(); navigate('/') }

  const cardClass = `rounded-3xl p-6 border backdrop-blur-lg ${darkMode ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white/70 border-black/5'}`
  const rowClass = `flex justify-between items-center py-3.5 border-b ${darkMode ? 'border-white/5' : 'border-gray-100'}`

  return (
    <MainLayout>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-2xl mx-auto space-y-5"
      >
        <motion.div
          variants={cardVariants}
          className="flex items-center gap-3 mb-2"
        >
          <motion.div
            animate={{ rotate: [0, 90, 180, 270, 360] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          >
            <SettingsIcon className="text-orange-500" size={24} />
          </motion.div>
          <h1 className={`text-2xl font-extrabold font-['Outfit'] ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>Settings</h1>
        </motion.div>

        {/* Account */}
        <motion.div variants={cardVariants} whileHover={{ y: -2 }} transition={{ type: 'spring', stiffness: 300 }} className={cardClass}>
          <h2 className={`text-base font-bold mb-4 flex items-center gap-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
            <User size={18} className="text-orange-500" /> Account
          </h2>
          <div className="space-y-0">
            {[
              ['Full Name', user?.fullName],
              ['Username', `@${user?.username}`],
              ['Email', user?.email],
              ['Phone', user?.phone],
            ].map(([label, value], i, arr) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.05, type: 'spring' }}
                className={`${rowClass} ${i === arr.length - 1 ? 'border-b-0' : ''}`}
              >
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{label}</span>
                <span className={`text-sm font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>{value || 'N/A'}</span>
              </motion.div>
            ))}
          </div>
          <motion.button
            whileHover={{ scale: 1.03, boxShadow: '0 8px 25px rgba(239, 68, 68, 0.25)' }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/profile')}
            className="mt-4 gradient-btn px-5 py-2.5 text-sm font-semibold flex items-center gap-2"
          >
            Edit Profile <ChevronRight size={14} />
          </motion.button>
        </motion.div>

        {/* Appearance */}
        <motion.div variants={cardVariants} whileHover={{ y: -2 }} transition={{ type: 'spring', stiffness: 300 }} className={cardClass}>
          <h2 className={`text-base font-bold mb-4 flex items-center gap-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
            <Palette size={18} className="text-orange-500" /> Appearance
          </h2>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <motion.div
                key={darkMode ? 'moon' : 'sun'}
                initial={{ rotate: -90, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              >
                {darkMode ? <Moon size={18} className="text-yellow-400" /> : <Sun size={18} className="text-orange-500" />}
              </motion.div>
              <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Dark Mode</span>
            </div>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              className={`w-14 h-7 rounded-full transition-colors relative ${darkMode ? 'bg-orange-500' : 'bg-gray-300'}`}
            >
              <motion.div
                animate={{ x: darkMode ? 28 : 2 }}
                transition={{ type: 'spring', stiffness: 500, damping: 28 }}
                className="absolute top-[3px] w-[22px] h-[22px] bg-white rounded-full shadow-md"
              />
            </motion.button>
          </div>
        </motion.div>

        {/* Security */}
        <motion.div variants={cardVariants} whileHover={{ y: -2 }} transition={{ type: 'spring', stiffness: 300 }} className={cardClass}>
          <h2 className={`text-base font-bold mb-4 flex items-center gap-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
            <Lock size={18} className="text-orange-500" /> Security
          </h2>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setPasswordModal(true)}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              darkMode ? 'bg-white/5 text-gray-300 hover:bg-white/10' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Change Password
          </motion.button>
        </motion.div>

        {/* Logout */}
        <motion.button
          variants={cardVariants}
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleLogout}
          className={`w-full flex items-center justify-center gap-2 py-4 rounded-3xl text-base font-bold transition-all ${
            darkMode ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20' : 'bg-red-50 text-red-500 hover:bg-red-100'
          }`}
        >
          <motion.div
            whileHover={{ x: -4 }}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            <LogOut size={20} />
          </motion.div>
          Logout
        </motion.button>
      </motion.div>

      {/* Modals */}
      <Modal isOpen={passwordModal} onClose={() => setPasswordModal(false)} title="Change Password">
        <ChangePasswordModal onClose={() => setPasswordModal(false)} />
      </Modal>
    </MainLayout>
  )
}

export default Settings
