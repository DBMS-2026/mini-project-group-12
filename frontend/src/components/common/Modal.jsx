import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'

const backdropVariants = {
  hidden: { opacity: 0, backdropFilter: 'blur(0px)' },
  visible: { opacity: 1, backdropFilter: 'blur(8px)' },
  exit: { opacity: 0, backdropFilter: 'blur(0px)' },
}

const modalVariants = {
  hidden: { opacity: 0, scale: 0.85, y: 40, filter: 'blur(4px)' },
  visible: {
    opacity: 1, scale: 1, y: 0, filter: 'blur(0px)',
    transition: { type: 'spring', stiffness: 350, damping: 25, mass: 0.8 }
  },
  exit: {
    opacity: 0, scale: 0.9, y: 30, filter: 'blur(2px)',
    transition: { duration: 0.2, ease: 'easeIn' }
  },
}

function Modal({ isOpen, onClose, title, children }) {
  const { darkMode } = useTheme()

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50"
          />

          {/* Modal content */}
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`relative z-10 w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl p-6 border ${
              darkMode
                ? 'bg-[#1a1a2e]/95 border-white/10 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]'
                : 'bg-white/95 border-black/5 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)]'
            } backdrop-blur-xl`}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <motion.h2
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1, type: 'spring', stiffness: 300 }}
                className={`text-xl font-bold font-['Outfit'] ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}
              >
                {title}
              </motion.h2>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.85 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                onClick={onClose}
                className={`p-2 rounded-xl transition-colors ${
                  darkMode ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
                }`}
              >
                <X size={20} />
              </motion.button>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, type: 'spring', stiffness: 200 }}
            >
              {children}
            </motion.div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default Modal