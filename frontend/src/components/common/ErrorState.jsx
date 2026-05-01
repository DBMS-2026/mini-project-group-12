import { motion } from 'framer-motion'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'

function ErrorState({ title = 'Something went wrong', description = 'We couldn\'t load the content. Please try again.', onRetry }) {
  const { darkMode } = useTheme()

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      className="flex flex-col items-center justify-center py-20 px-6 text-center"
    >
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="relative mb-8"
      >
        {/* Background glow */}
        <div className={`absolute -inset-4 rounded-full blur-2xl ${
          darkMode ? 'bg-red-500/8' : 'bg-red-500/6'
        }`} />
        <div className={`relative w-24 h-24 rounded-[28px] flex items-center justify-center ${
          darkMode
            ? 'bg-gradient-to-br from-red-500/10 to-red-500/[0.03] border border-red-500/10'
            : 'bg-gradient-to-br from-red-50 to-orange-50 border border-red-100/50'
        }`}>
          <AlertTriangle size={40} className="text-red-500/80" strokeWidth={1.5} />
        </div>
      </motion.div>

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
        className={`text-sm max-w-[280px] leading-relaxed mb-8 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}
      >
        {description}
      </motion.p>

      {onRetry && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, type: 'spring' }}
          whileHover={{ scale: 1.05, boxShadow: '0 8px 25px rgba(239, 68, 68, 0.15)' }}
          whileTap={{ scale: 0.95 }}
          onClick={onRetry}
          className={`flex items-center gap-2.5 px-6 py-3 rounded-2xl text-sm font-semibold transition-all ${
            darkMode
              ? 'bg-white/[0.06] text-gray-200 hover:bg-white/[0.1] border border-white/[0.06]'
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-black/[0.06] shadow-sm'
          }`}
        >
          <motion.div
            whileHover={{ rotate: 180 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <RefreshCw size={15} />
          </motion.div>
          Try Again
        </motion.button>
      )}
    </motion.div>
  )
}

export default ErrorState
