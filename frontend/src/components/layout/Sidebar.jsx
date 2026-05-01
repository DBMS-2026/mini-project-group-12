import { NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  House, Clapperboard, UploadCloud, Bookmark,
  User, Store, Search, LogOut, Settings, Bell, Package
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import Avatar from '../common/Avatar'

const navItems = [
  { to: '/home', icon: House, label: 'Home' },
  { to: '/search', icon: Search, label: 'Search' },
  { to: '/reels', icon: Clapperboard, label: 'Reels' },
  { to: '/upload', icon: UploadCloud, label: 'Upload' },
  { to: '/saved', icon: Bookmark, label: 'Saved' },
  { to: '/restaurant', icon: Store, label: 'Restaurants' },
  { to: '/orders', icon: Package, label: 'Orders' },
  { to: '/notifications', icon: Bell, label: 'Notifications' },
  { to: '/profile', icon: User, label: 'Profile' },
  { to: '/settings', icon: Settings, label: 'Settings' },
]

function Sidebar({ collapsed = false }) {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { darkMode } = useTheme()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const sidebarWidth = collapsed ? 'w-[72px]' : 'w-[280px]'

  return (
    <motion.div
      initial={{ x: collapsed ? -72 : -280 }}
      animate={{ x: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className={`fixed left-0 top-0 ${sidebarWidth} h-screen z-50 flex flex-col border-r backdrop-blur-xl ${
        darkMode
          ? 'bg-[#1a1a2e]/90 border-white/5'
          : 'bg-white/80 border-black/5'
      }`}
    >
      {/* Logo */}
      <div className={`${collapsed ? 'px-3 pt-6 pb-4' : 'px-7 pt-8 pb-6'}`}>
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          className={`font-extrabold font-['Outfit'] gradient-text cursor-pointer ${collapsed ? 'text-xl text-center' : 'text-3xl'}`}
          onClick={() => navigate('/home')}
        >
          {collapsed ? '🍔' : '🍔 Crave Food'}
        </motion.h1>
        {!collapsed && (
          <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            Discover amazing food
          </p>
        )}
      </div>

      {/* Nav items */}
      <nav className={`flex-1 ${collapsed ? 'px-2' : 'px-4'} space-y-1 overflow-y-auto`}>
        {navItems.map((item, index) => (
          <motion.div
            key={item.to}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + index * 0.04, type: 'spring', stiffness: 300, damping: 24 }}
          >
            <NavLink
              to={item.to}
              title={collapsed ? item.label : undefined}
              className={({ isActive }) =>
                `flex items-center ${collapsed ? 'justify-center' : ''} gap-3.5 ${collapsed ? 'px-0 py-3' : 'px-4 py-3'} rounded-2xl text-[15px] font-semibold transition-all duration-200 group ${
                  isActive
                    ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg shadow-red-500/20'
                    : darkMode
                      ? 'text-gray-300 hover:bg-white/5 hover:text-orange-400'
                      : 'text-gray-600 hover:bg-orange-50 hover:text-orange-500'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                    className="shrink-0"
                  >
                    <item.icon size={20} />
                  </motion.div>
                  {!collapsed && (
                    <motion.span
                      initial={false}
                      animate={isActive ? { x: 2 } : { x: 0 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      {item.label}
                    </motion.span>
                  )}
                </>
              )}
            </NavLink>
          </motion.div>
        ))}
      </nav>

      {/* Gradient divider */}
      <div className={`${collapsed ? 'mx-3' : 'mx-5'} h-px bg-gradient-to-r from-transparent ${darkMode ? 'via-white/[0.06]' : 'via-black/[0.05]'} to-transparent`} />

      {/* User section + logout */}
      <div className={`${collapsed ? 'px-2' : 'px-4'} pb-6 pt-4`}>
        {/* User card */}
        {user && !collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            whileHover={{ x: 3 }}
            whileTap={{ scale: 0.98 }}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-2xl mb-3 cursor-pointer transition-colors duration-200 ${
              darkMode ? 'hover:bg-white/[0.04]' : 'hover:bg-orange-50/50'
            }`}
            onClick={() => navigate('/profile')}
          >
            <Avatar src={user.avatar} name={user.fullName || user.username} size="sm" showRing={true} />
            <div className="min-w-0">
              <p className={`text-[13px] font-semibold truncate ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                {user.fullName}
              </p>
              <p className={`text-[11px] truncate ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>
                @{user.username}
              </p>
            </div>
          </motion.div>
        )}

        {/* Collapsed user avatar */}
        {user && collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            whileTap={{ scale: 0.9 }}
            className="flex justify-center mb-3"
          >
            <div onClick={() => navigate('/profile')} title={user.fullName} className="cursor-pointer">
              <Avatar src={user.avatar} name={user.fullName} size="sm" showRing={true} />
            </div>
          </motion.div>
        )}

        <motion.button
          whileHover={{ x: collapsed ? 0 : 3 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogout}
          title={collapsed ? 'Logout' : undefined}
          className={`flex items-center ${collapsed ? 'justify-center' : ''} gap-3 w-full ${collapsed ? 'px-0' : 'px-3'} py-2.5 rounded-2xl text-[13px] font-semibold transition-colors duration-200 ${
            darkMode
              ? 'text-red-400/80 hover:bg-red-500/[0.06] hover:text-red-400'
              : 'text-red-500/80 hover:bg-red-50 hover:text-red-500'
          }`}
        >
          <LogOut size={17} />
          {!collapsed && 'Logout'}
        </motion.button>
      </div>
    </motion.div>
  )
}

export default Sidebar