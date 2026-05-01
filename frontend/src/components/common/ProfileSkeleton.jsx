import { motion } from 'framer-motion'
import { useTheme } from '../../context/ThemeContext'

const cardVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay) => ({
    opacity: 1, y: 0,
    transition: { delay, duration: 0.4, ease: 'easeOut' }
  }),
}

function ProfileSkeleton() {
  const { darkMode } = useTheme()
  const sh = `skeleton ${darkMode ? 'bg-white/[0.04]' : ''}`

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header card */}
      <motion.div
        custom={0}
        variants={cardVariant}
        initial="hidden"
        animate="visible"
        className={`rounded-3xl p-6 sm:p-8 border backdrop-blur-sm ${
          darkMode ? 'bg-white/[0.02] border-white/[0.04]' : 'bg-white/60 border-black/[0.03]'
        }`}
      >
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className={`w-32 h-32 rounded-full ${sh}`} />
          <div className="space-y-3 flex-1 w-full">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className={`h-7 w-44 rounded-xl ${sh}`} />
              <div className={`h-8 w-24 rounded-xl ${sh}`} />
            </div>
            <div className={`h-3.5 w-28 rounded-lg ${sh}`} />
            <div className={`h-3 w-full max-w-[300px] rounded-lg ${sh}`} />

            {/* Stats — match gradient card layout */}
            <div className="flex gap-3 mt-4">
              {[1, 2, 3].map(i => (
                <div
                  key={i}
                  className={`px-5 py-3 rounded-2xl space-y-1.5 ${
                    darkMode ? 'bg-white/[0.02] border border-white/[0.03]' : 'bg-gray-50/80 border border-black/[0.02]'
                  }`}
                >
                  <div className={`h-5 w-8 rounded-lg ${sh}`} />
                  <div className={`h-2.5 w-14 rounded ${sh}`} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div custom={0.15} variants={cardVariant} initial="hidden" animate="visible" className="flex gap-2">
        <div className={`h-10 w-24 rounded-xl ${sh}`} />
        <div className={`h-10 w-24 rounded-xl ${sh}`} />
      </motion.div>

      {/* Grid */}
      <motion.div custom={0.25} variants={cardVariant} initial="hidden" animate="visible" className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className={`aspect-square rounded-2xl ${sh}`} />
        ))}
      </motion.div>
    </div>
  )
}

export default ProfileSkeleton
