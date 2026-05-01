import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { House, Search, UploadCloud, Clapperboard, User } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'

const mobileNavItems = [
  { to: '/home', icon: House, label: 'Home' },
  { to: '/search', icon: Search, label: 'Search' },
  { to: '/upload', icon: UploadCloud, label: 'Upload' },
  { to: '/reels', icon: Clapperboard, label: 'Reels' },
  { to: '/profile', icon: User, label: 'Profile' },
]

const navVariants = {
  hidden: { y: 80, opacity: 0 },
  visible: {
    y: 0, opacity: 1,
    transition: { type: 'spring', stiffness: 300, damping: 25, delay: 0.3 }
  },
}

function MobileNavbar() {
  const { darkMode } = useTheme()

  return (
    <motion.div
      variants={navVariants}
      initial="hidden"
      animate="visible"
      className={`fixed bottom-0 left-0 right-0 z-50 backdrop-blur-xl border-t safe-area-pb ${
        darkMode
          ? 'bg-[#1a1a2e]/90 border-white/5'
          : 'bg-white/90 border-black/5'
      }`}
    >
      <nav className="flex items-center justify-around px-1 py-1.5">
        {mobileNavItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 py-1.5 px-3 rounded-xl transition-colors duration-200 ${
                isActive
                  ? 'text-orange-500'
                  : darkMode
                    ? 'text-gray-500 hover:text-gray-300'
                    : 'text-gray-400 hover:text-gray-600'
              }`
            }
          >
            {({ isActive }) => (
              <motion.div
                className="flex flex-col items-center gap-0.5"
                whileTap={{ scale: 0.75 }}
                transition={{ type: 'spring', stiffness: 500, damping: 15 }}
              >
                <motion.div
                  animate={isActive ? { y: -3, scale: 1.15 } : { y: 0, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                >
                  <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                </motion.div>
                <motion.span
                  animate={isActive ? { opacity: 1, scale: 1 } : { opacity: 0.7, scale: 0.95 }}
                  className="text-[10px] font-medium"
                >
                  {item.label}
                </motion.span>
                {isActive && (
                  <motion.div
                    layoutId="mobileNavIndicator"
                    className="w-4 h-1 rounded-full bg-gradient-to-r from-red-500 to-orange-500"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </motion.div>
            )}
          </NavLink>
        ))}
      </nav>
    </motion.div>
  )
}

export default MobileNavbar