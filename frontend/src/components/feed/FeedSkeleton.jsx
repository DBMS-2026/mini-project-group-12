import { motion } from 'framer-motion'
import { useTheme } from '../../context/ThemeContext'

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.15, duration: 0.4, ease: 'easeOut' }
  }),
}

function FeedSkeleton({ count = 3 }) {
  const { darkMode } = useTheme()

  const pulse = darkMode ? 'bg-white/[0.04]' : 'bg-gray-100/80'
  const shimmer = `skeleton ${darkMode ? 'bg-white/[0.04]' : ''}`

  return (
    <div className="space-y-6">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          custom={i}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className={`rounded-3xl p-5 border backdrop-blur-sm ${
            darkMode ? 'bg-white/[0.02] border-white/[0.04]' : 'bg-white/60 border-black/[0.03]'
          }`}
        >
          {/* Header skeleton */}
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-10 h-10 rounded-full ${shimmer}`} />
            <div className="space-y-2 flex-1">
              <div className={`h-3.5 w-28 rounded-full ${shimmer}`} />
              <div className={`h-2.5 w-20 rounded-full ${shimmer}`} />
            </div>
            <div className={`h-6 w-16 rounded-full ${shimmer}`} />
          </div>

          {/* Image skeleton */}
          <div className={`w-full aspect-[4/3] rounded-2xl ${shimmer}`} />

          {/* Actions skeleton */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex gap-2">
              <div className={`h-9 w-16 rounded-xl ${shimmer}`} />
              <div className={`h-9 w-16 rounded-xl ${shimmer}`} />
              <div className={`h-9 w-12 rounded-xl ${shimmer}`} />
            </div>
            <div className={`h-9 w-12 rounded-xl ${shimmer}`} />
          </div>

          {/* Caption skeleton */}
          <div className="mt-4 space-y-2.5">
            <div className={`h-3 w-[85%] rounded-full ${shimmer}`} />
            <div className={`h-3 w-[60%] rounded-full ${shimmer}`} />
          </div>
        </motion.div>
      ))}
    </div>
  )
}

export default FeedSkeleton
