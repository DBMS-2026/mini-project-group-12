import { Heart, MessageCircle, MapPin, Share2 } from 'lucide-react'
import { motion } from 'framer-motion'

function PostCard({ post }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.4 }}
      className="bg-white/80 backdrop-blur-lg rounded-[30px] shadow-2xl p-5 border border-white/40 overflow-hidden"
    >
      <div className="flex items-center gap-4 mb-5">
        <div className="w-14 h-14 rounded-full bg-gradient-to-r from-red-400 to-orange-400"></div>

        <div>
          <h3 className="font-bold text-lg text-gray-800">{post.username}</h3>
          <p className="text-sm text-gray-500">{post.restaurant}</p>
        </div>
      </div>

      <div className="h-72 rounded-[25px] bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-gray-500 text-lg font-medium">
        Food Image Here
      </div>

      <p className="mt-5 text-gray-700 text-lg">{post.caption}</p>

      <div className="flex items-center gap-4 mt-6 flex-wrap">
        <button className="flex items-center gap-2 bg-red-500 text-white px-5 py-3 rounded-2xl hover:scale-105 transition-all duration-300 shadow-lg">
          <Heart size={18} /> Like
        </button>

        <button className="flex items-center gap-2 bg-gray-200 text-gray-800 px-5 py-3 rounded-2xl hover:bg-gray-300 transition-all duration-300">
          <MessageCircle size={18} /> Comment
        </button>

        <button className="flex items-center gap-2 bg-orange-500 text-white px-5 py-3 rounded-2xl hover:scale-105 transition-all duration-300 shadow-lg">
          <MapPin size={18} /> View Location
        </button>

        <button className="flex items-center gap-2 bg-black text-white px-5 py-3 rounded-2xl hover:bg-gray-800 transition-all duration-300">
          <Share2 size={18} /> Share
        </button>
      </div>
    </motion.div>
  )
}

export default PostCard