import { motion } from 'framer-motion'

function PageLoader() {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[var(--bg-primary)]">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="text-center"
      >
        {/* Dual ring spinner */}
        <div className="relative w-14 h-14 mx-auto mb-5">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-red-500 border-r-orange-500"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-1.5 rounded-full border-[2px] border-transparent border-b-pink-400 border-l-yellow-400"
          />
          <motion.div
            animate={{ scale: [0.8, 1.1, 0.8] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-0 flex items-center justify-center text-xl"
          >
            🍔
          </motion.div>
        </div>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="text-xl font-bold font-['Outfit'] gradient-text"
        >
          Crave Food
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0.5, 1] }}
          transition={{ delay: 0.4, duration: 2, repeat: Infinity }}
          className="text-sm text-[var(--text-tertiary)] mt-1"
        >
          Loading deliciousness...
        </motion.p>
      </motion.div>
    </div>
  )
}

export default PageLoader
