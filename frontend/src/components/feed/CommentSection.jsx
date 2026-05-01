import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { getComments, addComment } from '../../services/commentService'
import Avatar from '../common/Avatar'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'

function CommentSection({ postId }) {
  const { user } = useAuth()
  const { darkMode } = useTheme()
  const [comments, setComments] = useState([])
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const [newCommentId, setNewCommentId] = useState(null)
  const listRef = useRef(null)

  useEffect(() => {
    if (postId) {
      setLoading(true)
      getComments(postId)
        .then(res => setComments(res.data?.comments || []))
        .catch(() => {})
        .finally(() => setLoading(false))
    }
  }, [postId])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!text.trim() || sending) return
    setSending(true)
    try {
      const res = await addComment(postId, text.trim())
      if (res.data?.comment) {
        const newComment = res.data.comment
        setComments(prev => [newComment, ...prev])
        setNewCommentId(newComment.id)
        toast.success('Comment added!')
        // Clear highlight after animation
        setTimeout(() => setNewCommentId(null), 1500)
      }
      setText('')
      // Scroll to top of comments
      listRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
      toast.error('Comment failed')
    } finally {
      setSending(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className={`mt-4 pt-4 border-t ${darkMode ? 'border-white/5' : 'border-gray-100'}`}
    >
      {/* Comment input */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2 mb-4">
        <Avatar src={user?.avatar} name={user?.fullName} size="xs" />
        <div className={`flex-1 flex items-center rounded-xl overflow-hidden border transition-all ${
          darkMode ? 'bg-white/5 border-white/5 focus-within:border-orange-500/30' : 'bg-gray-50 border-gray-100 focus-within:border-orange-300'
        }`}>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Add a comment..."
            className={`flex-1 px-3 py-2.5 text-sm outline-none bg-transparent ${
              darkMode ? 'text-gray-200 placeholder:text-gray-600' : 'text-gray-800 placeholder:text-gray-400'
            }`}
          />
          <motion.button
            whileTap={{ scale: 0.85 }}
            type="submit"
            disabled={!text.trim() || sending}
            className="p-2.5 text-orange-500 disabled:opacity-30 transition-opacity"
          >
            {sending ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Send size={16} />
            )}
          </motion.button>
        </div>
      </form>

      {/* Loading state */}
      {loading && (
        <div className="space-y-3 py-2">
          {[1, 2].map(i => (
            <div key={i} className="flex gap-2">
              <div className={`w-7 h-7 rounded-full skeleton shrink-0 ${darkMode ? 'bg-white/5' : ''}`} />
              <div className="space-y-1.5 flex-1">
                <div className={`h-3 w-20 rounded-full skeleton ${darkMode ? 'bg-white/5' : ''}`} />
                <div className={`h-3 w-32 rounded-full skeleton ${darkMode ? 'bg-white/5' : ''}`} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Comments list */}
      {!loading && (
        <div ref={listRef} className="space-y-3 max-h-60 overflow-y-auto">
          <AnimatePresence>
            {comments.map((comment, i) => (
              <motion.div
                key={comment.id || i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className={`flex gap-2 p-2 rounded-xl transition-colors ${
                  comment.id === newCommentId ? 'highlight-new' : ''
                }`}
              >
                <Avatar src={comment.user?.avatar} name={comment.user?.fullName} size="xs" />
                <div className="min-w-0">
                  <p className={`text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {comment.user?.fullName || comment.user?.username}
                  </p>
                  <p className={`text-sm leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {comment.text}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {comments.length === 0 && (
            <p className={`text-xs text-center py-3 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>
              No comments yet. Be the first! 💬
            </p>
          )}
        </div>
      )}
    </motion.div>
  )
}

export default CommentSection