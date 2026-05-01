import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin } from 'lucide-react'
import Avatar from '../common/Avatar'
import { useTheme } from '../../context/ThemeContext'

function PostHeader({ post }) {
  const { darkMode } = useTheme()
  const navigate = useNavigate()
  const user = post.user || {}
  const timeAgo = getTimeAgo(post.createdAt)

  return (
    <div className="flex items-center justify-between mb-4">
      <motion.div
        className="flex items-center gap-3 cursor-pointer"
        onClick={() => navigate(`/profile/${user.username}`)}
        whileHover={{ x: 3 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      >
        <motion.div
          whileHover={{ scale: 1.1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 15 }}
        >
          <Avatar src={user.avatar} name={user.fullName || user.username} size="sm" />
        </motion.div>
        <div>
          <p className={`text-sm font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
            {user.fullName || user.username}
          </p>
          <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            {timeAgo}
          </p>
        </div>
      </motion.div>

      {post.restaurant && (
        <motion.button
          onClick={() => navigate(`/restaurant/${encodeURIComponent(post.restaurant)}`)}
          whileHover={{ scale: 1.05, y: -1 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full transition-colors duration-200 ${
            darkMode
              ? 'bg-orange-500/10 text-orange-400 hover:bg-orange-500/20'
              : 'bg-orange-50 text-orange-600 hover:bg-orange-100'
          }`}
        >
          <motion.div
            animate={{ y: [0, -2, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <MapPin size={12} />
          </motion.div>
          {post.restaurant}
        </motion.button>
      )}
    </div>
  )
}

function getTimeAgo(dateString) {
  if (!dateString) return ''
  const now = new Date()
  const date = new Date(dateString)
  const seconds = Math.floor((now - date) / 1000)
  if (seconds < 60) return 'Just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return date.toLocaleDateString()
}

export default PostHeader