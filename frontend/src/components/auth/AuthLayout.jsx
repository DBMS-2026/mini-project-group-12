import { motion } from 'framer-motion'

const floatingEmojis = ['🍔', '🍕', '🍗', '🧇', '☕', '🍰', '🌮', '🍩', '🍦', '🥗', '🍣', '🥤']

function AuthLayout({ children }) {
  return (
    <div className="min-h-screen animated-gradient flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Animated background circles */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-orange-400/10 blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{ scale: [1.2, 1, 1.2], x: [0, -30, 0], y: [0, 30, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-red-400/10 blur-3xl pointer-events-none"
      />

      {/* Floating food emojis with depth effect */}
      {floatingEmojis.map((emoji, i) => (
        <motion.span
          key={i}
          className="absolute pointer-events-none select-none"
          style={{
            left: `${(i * 8 + 5) % 95}%`,
            top: `${(i * 12 + 3) % 90}%`,
            fontSize: `${1.5 + (i % 3) * 0.5}rem`,
            opacity: 0.15 + (i % 3) * 0.05,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: 0.15 + (i % 3) * 0.05,
            scale: 1,
            y: [0, -(15 + i * 3), 0, 10 + i * 2, 0],
            rotate: [0, 10 + i * 2, -(5 + i), 8, 0],
            x: [0, (i % 2 === 0 ? 8 : -8), 0],
          }}
          transition={{
            opacity: { duration: 0.5, delay: i * 0.15 },
            scale: { duration: 0.5, delay: i * 0.15, type: 'spring', stiffness: 200 },
            y: { duration: 5 + i * 0.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 },
            rotate: { duration: 5 + i * 0.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 },
            x: { duration: 7 + i * 0.3, repeat: Infinity, ease: 'easeInOut', delay: i * 0.2 },
          }}
        >
          {emoji}
        </motion.span>
      ))}

      {/* Glass overlay */}
      <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px]" />

      {/* Content with spring entry */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.92, filter: 'blur(8px)' }}
        animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
        transition={{ type: 'spring', stiffness: 180, damping: 18, mass: 1 }}
        className="relative z-10 w-full flex items-center justify-center"
      >
        {children}
      </motion.div>
    </div>
  )
}

export default AuthLayout
