import { House, Clapperboard, Upload, Bookmark, User } from 'lucide-react'
import { motion } from 'framer-motion'

function Sidebar() {
  const menuItems = [
    { icon: <House size={20} />, label: 'Home' },
    { icon: <Clapperboard size={20} />, label: 'Reels' },
    { icon: <Upload size={20} />, label: 'Upload' },
    { icon: <Bookmark size={20} />, label: 'Saved' },
    { icon: <User size={20} />, label: 'Profile' },
  ]

  return (
    <div className="w-72 min-h-screen bg-white/80 backdrop-blur-lg border-r border-gray-200 shadow-xl p-6 sticky top-0">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-extrabold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent mb-12"
      >
        Food Creed
      </motion.h1>

      <div className="space-y-4">
        {menuItems.map((item, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.05, x: 10 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-4 w-full text-left px-4 py-4 rounded-2xl hover:bg-gradient-to-r hover:from-red-500 hover:to-orange-500 hover:text-white transition-all duration-300 text-gray-700 font-semibold"
          >
            {item.icon}
            {item.label}
          </motion.button>
        ))}
      </div>
    </div>
  )
}

export default Sidebar