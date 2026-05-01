import { useState, useRef } from 'react'
import { motion, AnimatePresence, useSpring, useTransform } from 'framer-motion'
import { Heart, MessageCircle, Bookmark, Share2, Send } from 'lucide-react'
import toast from 'react-hot-toast'
import { useTheme } from '../../context/ThemeContext'
import { usePosts } from '../../context/PostContext'

// Particle positions for like burst
const particles = Array.from({ length: 6 }, (_, i) => ({
  tx: Math.cos((i * 60 * Math.PI) / 180) * 24,
  ty: Math.sin((i * 60 * Math.PI) / 180) * 24,
}))

function PostActions({ post, onToggleComments }) {
  const { darkMode } = useTheme()
  const { toggleLike, toggleSave } = usePosts()
  const [liked, setLiked] = useState(post._liked || false)
  const [saved, setSaved] = useState(post._saved || false)
  const [likeCount, setLikeCount] = useState(post._likeCount ?? post.likes?.length ?? 0)
  const [showParticles, setShowParticles] = useState(false)
  const [shareAnimating, setShareAnimating] = useState(false)

  const handleLike = async () => {
    const newLiked = !liked
    setLiked(newLiked)
    setLikeCount(prev => newLiked ? prev + 1 : prev - 1)
    if (newLiked) {
      setShowParticles(true)
      setTimeout(() => setShowParticles(false), 600)
    }
    try {
      const result = await toggleLike(post.id)
      if (result) {
        setLiked(result.liked)
        setLikeCount(result.likeCount)
        if (result.liked) toast('❤️ Post liked!', { icon: '👍' })
      }
    } catch (e) {
      setLiked(!newLiked)
      setLikeCount(prev => newLiked ? prev - 1 : prev + 1)
      toast.error('Like failed')
    }
  }

  const handleSave = async () => {
    const newSaved = !saved
    setSaved(newSaved)
    try {
      const result = await toggleSave(post.id)
      if (result) {
        setSaved(result.saved)
        toast(result.saved ? '🔖 Post saved!' : 'Post unsaved', { icon: result.saved ? '✅' : '📌' })
      }
    } catch (e) {
      setSaved(!newSaved)
      toast.error('Save failed')
    }
  }

  const handleShare = () => {
    setShareAnimating(true)
    setTimeout(() => setShareAnimating(false), 500)
    navigator.clipboard?.writeText(window.location.origin + '/post/' + post.id)
    toast.success('Link copied!')
  }

  const btnBase = `relative flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-xl transition-all duration-200`

  return (
    <div className="flex items-center justify-between mt-3">
      <div className="flex items-center gap-1">
        {/* Like button with particle burst */}
        <motion.button
          whileTap={{ scale: 0.75 }}
          onClick={handleLike}
          className={`${btnBase} ${liked ? 'text-red-500' : darkMode ? 'text-gray-400 hover:bg-white/5' : 'text-gray-500 hover:bg-gray-100'}`}
        >
          <motion.div
            animate={liked
              ? { scale: [1, 1.6, 0.85, 1.2, 1], rotate: [0, -15, 10, -5, 0] }
              : { scale: 1, rotate: 0 }
            }
            transition={{ type: 'spring', stiffness: 500, damping: 15 }}
          >
            <Heart size={20} fill={liked ? 'currentColor' : 'none'} strokeWidth={liked ? 0 : 2} />
          </motion.div>

          {/* Like particles */}
          <AnimatePresence>
            {showParticles && particles.map((p, i) => (
              <motion.span
                key={i}
                initial={{ scale: 1, x: 0, y: 0, opacity: 1 }}
                animate={{ scale: 0, x: p.tx, y: p.ty, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="absolute left-3 top-2 w-1.5 h-1.5 rounded-full bg-red-400"
              />
            ))}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {likeCount > 0 && (
              <motion.span
                key={likeCount}
                initial={{ y: -10, opacity: 0, scale: 0.5 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: 10, opacity: 0, scale: 0.5 }}
                transition={{ type: 'spring', stiffness: 500, damping: 20 }}
              >
                {likeCount}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Comment button */}
        <motion.button
          whileTap={{ scale: 0.8 }}
          whileHover={{ scale: 1.08, y: -1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          onClick={onToggleComments}
          className={`${btnBase} ${darkMode ? 'text-gray-400 hover:bg-white/5 hover:text-blue-400' : 'text-gray-500 hover:bg-gray-100 hover:text-blue-500'}`}
        >
          <MessageCircle size={20} />
          {(post.comments?.length > 0) && <span>{post.comments.length}</span>}
        </motion.button>

        {/* Share button with send animation */}
        <motion.button
          whileTap={{ scale: 0.8 }}
          whileHover={{ scale: 1.08, y: -1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          onClick={handleShare}
          className={`${btnBase} ${darkMode ? 'text-gray-400 hover:bg-white/5 hover:text-green-400' : 'text-gray-500 hover:bg-gray-100 hover:text-green-500'}`}
        >
          <motion.div
            animate={shareAnimating ? { x: [0, 8, 0], rotate: [0, -20, 0] } : {}}
            transition={{ duration: 0.4, type: 'spring' }}
          >
            <Share2 size={18} />
          </motion.div>
        </motion.button>
      </div>

      {/* Save button with bookmark fill animation */}
      <motion.button
        whileTap={{ scale: 0.75 }}
        onClick={handleSave}
        className={`${btnBase} ${saved ? 'text-orange-500' : darkMode ? 'text-gray-400 hover:bg-white/5' : 'text-gray-500 hover:bg-gray-100'}`}
      >
        <motion.div
          animate={saved
            ? { scale: [1, 1.5, 0.85, 1.15, 1], rotate: [0, -15, 12, -6, 0], y: [0, -4, 2, -1, 0] }
            : { scale: 1, rotate: 0, y: 0 }
          }
          transition={{ type: 'spring', stiffness: 400, damping: 12 }}
        >
          <Bookmark size={20} fill={saved ? 'currentColor' : 'none'} strokeWidth={saved ? 0 : 2} />
        </motion.div>
      </motion.button>
    </div>
  )
}

export default PostActions