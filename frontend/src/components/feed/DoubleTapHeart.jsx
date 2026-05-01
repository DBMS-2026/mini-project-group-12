import { motion, AnimatePresence } from 'framer-motion'
import { Heart } from 'lucide-react'

// Mini hearts that fly outward
const miniHearts = Array.from({ length: 8 }, (_, i) => ({
  x: Math.cos((i * 45 * Math.PI) / 180) * 50,
  y: Math.sin((i * 45 * Math.PI) / 180) * 50,
  rotate: Math.random() * 360,
}))

function DoubleTapHeart({ show }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 2, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 15 }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
        >
          {/* Ring burst 1 */}
          <motion.div
            initial={{ scale: 0.3, opacity: 0.9 }}
            animate={{ scale: 3, opacity: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="absolute w-20 h-20 rounded-full border-[3px] border-red-400/60"
          />
          {/* Ring burst 2 — delayed */}
          <motion.div
            initial={{ scale: 0.3, opacity: 0.7 }}
            animate={{ scale: 3.5, opacity: 0 }}
            transition={{ duration: 0.9, ease: 'easeOut', delay: 0.08 }}
            className="absolute w-16 h-16 rounded-full border-2 border-white/30"
          />
          {/* Ring burst 3 — pink */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0.5 }}
            animate={{ scale: 2.8, opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.12 }}
            className="absolute w-12 h-12 rounded-full border-2 border-pink-400/40"
          />

          {/* Mini hearts flying outward */}
          {miniHearts.map((h, i) => (
            <motion.div
              key={i}
              initial={{ scale: 1, x: 0, y: 0, opacity: 1, rotate: 0 }}
              animate={{ scale: 0, x: h.x, y: h.y, opacity: 0, rotate: h.rotate }}
              transition={{ duration: 0.6, ease: 'easeOut', delay: 0.05 + i * 0.02 }}
              className="absolute"
            >
              <Heart size={10} fill="#ef4444" className="text-red-500" />
            </motion.div>
          ))}

          {/* Main heart */}
          <motion.div
            initial={{ rotate: -20, scale: 0 }}
            animate={{
              rotate: [-20, 12, -8, 4, 0],
              scale: [0, 1.3, 0.9, 1.1, 1],
            }}
            transition={{ duration: 0.5, type: 'spring', stiffness: 300 }}
          >
            <Heart
              size={80}
              fill="#ef4444"
              className="text-red-500 drop-shadow-[0_0_40px_rgba(239,68,68,0.7)]"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default DoubleTapHeart
