import { motion } from 'framer-motion'
import VideoPlayer from './VideoPlayer'
import ReelInfo from './ReelInfo'
import ReelActions from './ReelActions'

function ReelCard({ reel }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="relative h-screen flex items-center justify-center bg-black overflow-hidden"
    >
      <div className="relative w-[380px] h-[700px] rounded-[40px] overflow-hidden shadow-2xl border border-white/10">
        <VideoPlayer video={reel.video} />

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

        <ReelInfo reel={reel} />

        <ReelActions />
      </div>
    </motion.div>
  )
}

export default ReelCard