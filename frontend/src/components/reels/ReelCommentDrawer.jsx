import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, Loader2, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { getComments, addComment, deleteComment } from '../../services/commentService'
import Avatar from '../common/Avatar'
import { useAuth } from '../../context/AuthContext'

function ReelCommentDrawer({ postId, open, onClose, commentCount, onCommentCountChange }) {
  const { user } = useAuth()
  const [comments, setComments] = useState([])
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const inputRef = useRef(null)
  const listRef = useRef(null)

  useEffect(() => {
    if (open && postId) {
      setLoading(true)
      getComments(postId)
        .then(res => setComments(res.data?.comments || []))
        .catch(() => toast.error('Failed to load comments'))
        .finally(() => setLoading(false))
      // Focus input after open animation
      setTimeout(() => inputRef.current?.focus(), 400)
    }
  }, [open, postId])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!text.trim() || sending) return
    setSending(true)
    try {
      const res = await addComment(postId, text.trim())
      if (res.data?.comment) {
        setComments(prev => [res.data.comment, ...prev])
        onCommentCountChange?.((commentCount || 0) + 1)
        toast.success('Comment added!')
      }
      setText('')
      listRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
    } catch {
      toast.error('Comment failed')
    } finally {
      setSending(false)
    }
  }

  const handleDelete = async (commentId) => {
    try {
      await deleteComment(commentId)
      setComments(prev => prev.filter(c => c.id !== commentId))
      onCommentCountChange?.(Math.max(0, (commentCount || 1) - 1))
      toast.success('Comment deleted')
    } catch {
      toast.error('Delete failed')
    }
  }

  const timeAgo = (date) => {
    if (!date) return ''
    const diff = (Date.now() - new Date(date).getTime()) / 1000
    if (diff < 60) return 'now'
    if (diff < 3600) return `${Math.floor(diff / 60)}m`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`
    return `${Math.floor(diff / 86400)}d`
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-[70]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 z-[80] max-h-[70vh] flex flex-col rounded-t-3xl overflow-hidden"
            style={{ background: 'rgba(24, 24, 27, 0.97)', backdropFilter: 'blur(20px)' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Handle + Header */}
            <div className="flex flex-col items-center pt-3 pb-2 px-4 border-b border-white/10 shrink-0">
              <div className="w-10 h-1 rounded-full bg-white/20 mb-3" />
              <div className="flex items-center justify-between w-full">
                <h3 className="text-white font-bold text-base">
                  Comments {comments.length > 0 && <span className="text-white/40 font-normal text-sm ml-1">({comments.length})</span>}
                </h3>
                <motion.button
                  whileTap={{ scale: 0.85 }}
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition-colors"
                >
                  <X size={16} />
                </motion.button>
              </div>
            </div>

            {/* Comments List */}
            <div ref={listRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3 min-h-[120px]">
              {loading ? (
                <div className="flex items-center justify-center py-10">
                  <Loader2 size={24} className="text-white/30 animate-spin" />
                </div>
              ) : comments.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-4xl mb-2">💬</p>
                  <p className="text-white/40 text-sm">No comments yet. Start the conversation!</p>
                </div>
              ) : (
                <AnimatePresence>
                  {comments.map((comment, i) => (
                    <motion.div
                      key={comment.id || i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      transition={{ delay: i * 0.03 }}
                      className="flex gap-2.5 group"
                    >
                      <Avatar src={comment.user?.avatar} name={comment.user?.fullName} size="xs" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-white/80 text-xs font-semibold">
                            {comment.user?.username || comment.user?.fullName || 'user'}
                          </span>
                          <span className="text-white/25 text-[10px]">{timeAgo(comment.createdAt)}</span>
                        </div>
                        <p className="text-white/60 text-[13px] leading-relaxed mt-0.5">{comment.text}</p>
                      </div>
                      {user?.id === comment.userId && (
                        <motion.button
                          whileTap={{ scale: 0.8 }}
                          onClick={() => handleDelete(comment.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-red-500/20 text-red-400/60 hover:text-red-400 self-center"
                        >
                          <Trash2 size={13} />
                        </motion.button>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Input */}
            <form
              onSubmit={handleSubmit}
              className="flex items-center gap-2 px-4 py-3 border-t border-white/10 shrink-0 safe-area-pb"
            >
              <Avatar src={user?.avatar} name={user?.fullName} size="xs" />
              <div className="flex-1 flex items-center rounded-xl bg-white/10 border border-white/5 focus-within:border-orange-500/40 transition-colors overflow-hidden">
                <input
                  ref={inputRef}
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder={user ? 'Add a comment...' : 'Login to comment'}
                  disabled={!user}
                  className="flex-1 px-3 py-2.5 text-sm bg-transparent text-white placeholder:text-white/30 outline-none disabled:opacity-50"
                />
                <motion.button
                  whileTap={{ scale: 0.85 }}
                  type="submit"
                  disabled={!text.trim() || sending || !user}
                  className="p-2.5 text-orange-400 disabled:opacity-20 transition-opacity"
                >
                  {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default ReelCommentDrawer
