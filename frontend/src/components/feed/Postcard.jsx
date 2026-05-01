import { useState, useCallback } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import PostHeader from './PostHeader'
import PostActions from './PostActions'
import CommentSection from './CommentSection'
import DoubleTapHeart from './DoubleTapHeart'
import { useTheme } from '../../context/ThemeContext'
import { usePosts } from '../../context/PostContext'

const API_BASE = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:5000'

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.97 },
  visible: (i) => ({
    opacity: 1, y: 0, scale: 1,
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 22,
      mass: 0.8,
      delay: i * 0.08,
    }
  }),
}

function PostCard({ post, index = 0 }) {
  const { darkMode } = useTheme()
  const { toggleLike } = usePosts()
  const prefersReducedMotion = useReducedMotion()
  const [showComments, setShowComments] = useState(false)
  const [showHeart, setShowHeart] = useState(false)
  const [imgLoaded, setImgLoaded] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const handleDoubleClick = useCallback(() => {
    setShowHeart(true)
    toggleLike(post.id)
    setTimeout(() => setShowHeart(false), 800)
  }, [post.id, toggleLike])

  const imageUrl = post.imageUrl?.startsWith('http')
    ? post.imageUrl
    : post.imageUrl ? `${API_BASE}${post.imageUrl}` : null

  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={prefersReducedMotion ? {} : { y: -4, transition: { type: 'spring', stiffness: 400, damping: 25 } }}
      className={`rounded-3xl p-4 sm:p-5 border backdrop-blur-xl transition-all duration-300 ${
        darkMode
          ? `bg-white/[0.04] border-white/[0.06] ${isHovered ? 'shadow-[0_20px_40px_-12px_rgba(239,68,68,0.08)]' : ''}`
          : `bg-white/70 border-black/5 ${isHovered ? 'shadow-[0_20px_40px_-12px_rgba(239,68,68,0.1)]' : ''}`
      }`}
      style={{
        borderColor: isHovered
          ? darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(249,115,22,0.15)'
          : undefined,
      }}
    >
      <PostHeader post={post} />

      {/* Image with CLS prevention */}
      {imageUrl && (
        <div
          onDoubleClick={handleDoubleClick}
          className="relative overflow-hidden rounded-2xl cursor-pointer mt-3"
        >
          {/* Placeholder to prevent CLS */}
          {!imgLoaded && (
            <div className={`w-full aspect-[4/3] skeleton ${darkMode ? 'bg-white/5' : ''}`} />
          )}
          <motion.img
            src={imageUrl}
            alt={post.caption || 'Food post'}
            className={`w-full aspect-[4/3] object-cover transition-opacity duration-500 ${imgLoaded ? 'opacity-100' : 'opacity-0 absolute inset-0'}`}
            onLoad={() => setImgLoaded(true)}
            whileHover={{ scale: 1.03 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            loading="lazy"
          />
          {/* Subtle gradient on hover */}
          <motion.div
            animate={{ opacity: isHovered ? 1 : 0 }}
            className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none"
          />
          <DoubleTapHeart show={showHeart} />
        </div>
      )}

      {/* Caption */}
      {post.caption && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className={`mt-3 text-sm leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
        >
          {post.caption}
        </motion.p>
      )}

      {/* Actions */}
      <PostActions
        post={post}
        onToggleComments={() => setShowComments(!showComments)}
      />

      {/* Comments */}
      {showComments && <CommentSection postId={post.id} />}
    </motion.div>
  )
}

export default PostCard