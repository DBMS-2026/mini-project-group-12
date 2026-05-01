import { motion } from 'framer-motion'
import { useTheme } from '../../context/ThemeContext'

function EmptyState({ icon: Icon, title, description, action, onAction }) {
  const { darkMode } = useTheme()

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      className="flex flex-col items-center justify-center py-20 px-6 text-center"
    >
      {Icon && (
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="relative mb-8"
        >
          {/* Background glow circle */}
          <div className={`absolute -inset-4 rounded-full blur-2xl ${
            darkMode ? 'bg-orange-500/10' : 'bg-orange-500/8'
          }`} />
          <div className={`relative w-24 h-24 rounded-[28px] flex items-center justify-center ${
            darkMode
              ? 'bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/[0.06]'
              : 'bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-100/50'
          }`}>
            <Icon size={40} className="text-orange-500/80" strokeWidth={1.5} />
          </div>
        </motion.div>
      )}

      <motion.h3
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, type: 'spring' }}
        className={`text-xl font-bold font-['Outfit'] mb-2 ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}
      >
        {title}
      </motion.h3>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, type: 'spring' }}
        className={`text-sm max-w-[280px] leading-relaxed ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}
      >
        {description}
      </motion.p>

      {action && onAction && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, type: 'spring' }}
          whileHover={{ scale: 1.05, boxShadow: '0 12px 30px rgba(239, 68, 68, 0.3)' }}
          whileTap={{ scale: 0.95 }}
          onClick={onAction}
          className="mt-8 gradient-btn px-7 py-3 text-sm font-semibold tracking-wide"
        >
          {action}
        </motion.button>
      )}
    </motion.div>
  )
}

export default EmptyState