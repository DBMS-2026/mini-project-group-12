import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Bell, Sun, Moon, ShoppingBag } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { useCart } from '../../context/CartContext'
import Avatar from '../common/Avatar'

function Navbar() {
  const { user } = useAuth()
  const { darkMode, toggleTheme } = useTheme()
  const { cartItems, setIsCartOpen } = useCart()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const totalCartItems = cartItems.reduce((acc, item) => acc + item.quantity, 0)

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className={`sticky top-0 z-40 px-4 sm:px-6 md:px-8 py-3.5 backdrop-blur-2xl border-b transition-colors duration-300 ${
        darkMode
          ? 'bg-[#0c0c18]/85 border-white/[0.04]'
          : 'bg-[#faf7f5]/85 border-black/[0.04]'
      }`}
    >
      <div className="flex items-center justify-between gap-4">
        {/* Mobile logo */}
        <motion.h1
          whileTap={{ scale: 0.95 }}
          className="md:hidden text-xl font-extrabold font-['Outfit'] gradient-text cursor-pointer shrink-0"
          onClick={() => navigate('/home')}
        >
          🍔 Crave Food
        </motion.h1>

        {/* Search bar — hidden on mobile, shown on sm+ */}
        <form onSubmit={handleSearch} className="hidden sm:flex flex-1 max-w-md">
          <div className="relative w-full group">
            <Search
              size={16}
              className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 ${
                darkMode ? 'text-gray-600 group-focus-within:text-orange-400' : 'text-gray-400 group-focus-within:text-orange-500'
              }`}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search food, restaurants, creators..."
              className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-[13px] outline-none transition-all duration-300 border ${
                darkMode
                  ? 'bg-white/[0.04] border-white/[0.04] text-gray-200 placeholder:text-gray-600 focus:border-orange-500/25 focus:bg-white/[0.06] focus:shadow-[0_0_20px_rgba(249,115,22,0.05)]'
                  : 'bg-white/70 border-black/[0.04] text-gray-800 placeholder:text-gray-400 focus:border-orange-300/50 focus:bg-white focus:shadow-[0_0_20px_rgba(249,115,22,0.06)]'
              }`}
            />
          </div>
        </form>

        {/* Right actions */}
        <div className="flex items-center gap-1">
          {/* Mobile search */}
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={() => navigate('/search')}
            className={`sm:hidden p-2.5 rounded-xl transition-colors duration-200 ${
              darkMode ? 'text-gray-500 hover:bg-white/[0.04] hover:text-gray-300' : 'text-gray-400 hover:bg-black/[0.03] hover:text-gray-600'
            }`}
          >
            <Search size={20} />
          </motion.button>

          {/* Theme toggle */}
          <motion.button
            whileTap={{ scale: 0.85, rotate: 180 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            onClick={toggleTheme}
            className={`p-2.5 rounded-xl transition-colors duration-200 ${
              darkMode
                ? 'text-amber-400 hover:bg-amber-400/10'
                : 'text-gray-400 hover:bg-black/[0.03] hover:text-gray-600'
            }`}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={darkMode ? 'sun' : 'moon'}
                initial={{ y: -12, opacity: 0, rotate: -90 }}
                animate={{ y: 0, opacity: 1, rotate: 0 }}
                exit={{ y: 12, opacity: 0, rotate: 90 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              >
                {darkMode ? <Sun size={19} /> : <Moon size={19} />}
              </motion.div>
            </AnimatePresence>
          </motion.button>

          {/* Cart */}
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={() => setIsCartOpen(true)}
            className={`relative p-2.5 rounded-xl transition-colors duration-200 ${
              darkMode ? 'text-gray-500 hover:bg-white/[0.04] hover:text-gray-300' : 'text-gray-400 hover:bg-black/[0.03] hover:text-gray-600'
            }`}
          >
            <ShoppingBag size={19} />
            {totalCartItems > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-1 right-1 w-4 h-4 flex items-center justify-center bg-orange-500 text-white text-[10px] font-bold rounded-full ring-2 ring-[var(--bg-primary)]"
              >
                {totalCartItems}
              </motion.span>
            )}
          </motion.button>

          {/* Notifications */}
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={() => navigate('/notifications')}
            className={`relative p-2.5 rounded-xl transition-colors duration-200 ${
              darkMode ? 'text-gray-500 hover:bg-white/[0.04] hover:text-gray-300' : 'text-gray-400 hover:bg-black/[0.03] hover:text-gray-600'
            }`}
          >
            <Bell size={19} />
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 15, delay: 0.5 }}
              className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-[var(--bg-primary)]"
            />
          </motion.button>

          {/* User avatar */}
          {user && (
            <motion.button
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.08 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              onClick={() => navigate('/profile')}
              className="ml-1"
            >
              <Avatar src={user.avatar} name={user.fullName} size="sm" showRing={true} />
            </motion.button>
          )}
        </div>
      </div>
    </motion.header>
  )
}

export default Navbar