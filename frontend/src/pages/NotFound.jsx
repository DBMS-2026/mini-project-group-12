import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, ArrowRight } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

const floatingEmojis = ['🍔', '🍕', '🍩', '🧇', '🌮', '🍦', '☕', '🍰']

function NotFound() {
  const navigate = useNavigate()
  const { darkMode } = useTheme()

  return (
    <div className={`min-h-screen flex items-center justify-center p-6 relative overflow-hidden ${
      darkMode ? 'bg-[#0c0c18]' : 'bg-[#faf7f5]'
    }`}>
      {/* Ambient glow */}
      <div className={`absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none ${
        darkMode ? 'bg-orange-500/[0.06]' : 'bg-orange-500/[0.04]'
      }`} />

      {/* Floating food emojis */}
      {floatingEmojis.map((emoji, i) => (
        <motion.span
          key={i}
          className="absolute pointer-events-none select-none"
          style={{
            left: `${(i * 12 + 5) % 90}%`,
            top: `${(i * 14 + 8) % 85}%`,
            fontSize: `${1.5 + (i % 3) * 0.6}rem`,
            opacity: darkMode ? 0.06 : 0.08,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: darkMode ? 0.06 : 0.08,
            scale: 1,
            y: [0, -(12 + i * 3), 0, 8 + i * 2, 0],
            rotate: [0, 8, -6, 4, 0],
          }}
          transition={{
            opacity: { duration: 0.5, delay: i * 0.1 },
            scale: { duration: 0.5, delay: i * 0.1, type: 'spring' },
            y: { duration: 6 + i * 0.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 },
            rotate: { duration: 6 + i * 0.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 },
          }}
        >
          {emoji}
        </motion.span>
      ))}

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30, filter: 'blur(6px)' }}
        animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className={`p-10 sm:p-16 text-center max-w-md w-full relative z-10 rounded-[32px] border backdrop-blur-xl ${
          darkMode
            ? 'bg-white/[0.03] border-white/[0.05]'
            : 'bg-white/70 border-black/[0.04] shadow-[0_16px_48px_rgba(0,0,0,0.06)]'
        }`}
      >
        {/* 404 with gradient */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.15 }}
        >
          <h1 className="text-8xl sm:text-9xl font-extrabold gradient-text font-['Outfit'] leading-none tracking-tighter">
            404
          </h1>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, type: 'spring' }}
          className={`text-xl sm:text-2xl font-bold font-['Outfit'] mt-4 ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}
        >
          Page Not Found
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, type: 'spring' }}
          className={`text-sm mt-2 leading-relaxed ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}
        >
          Looks like this dish isn't on the menu! 🍽️
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, type: 'spring' }}
          whileHover={{ scale: 1.05, boxShadow: '0 12px 30px rgba(239, 68, 68, 0.3)' }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/home')}
          className="mt-8 gradient-btn inline-flex items-center gap-2.5 px-7 py-3.5 text-sm font-bold tracking-wide"
        >
          <Home size={16} />
          Go Back Home
          <motion.div
            animate={{ x: [0, 4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ArrowRight size={14} />
          </motion.div>
        </motion.button>
      </motion.div>
    </div>
  )
}

export default NotFound