import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { UserPlus, UserCheck, Loader2 } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'
import Avatar from '../common/Avatar'
import { toggleFollow, getFollowStatus } from '../../services/followService'

const API_BASE = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:5000'

function FollowItem({ user, currentUserId, onClose }) {
  const { darkMode } = useTheme()
  const [isFollowing, setIsFollowing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)

  const isOwn = currentUserId === user.id

  useEffect(() => {
    if (!isOwn) {
      getFollowStatus(user.id)
        .then(res => setIsFollowing(res.data?.following))
        .catch(() => {})
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [user.id, isOwn])

  const handleToggle = async (e) => {
    e.stopPropagation()
    if (actionLoading) return
    setActionLoading(true)
    try {
      const res = await toggleFollow(user.id)
      setIsFollowing(res.data?.following)
    } catch (error) {
      // ignore
    } finally {
      setActionLoading(false)
    }
  }

  return (
    <div className={`flex items-center justify-between p-3 rounded-2xl transition-colors ${darkMode ? 'hover:bg-white/5' : 'hover:bg-gray-50'}`}>
      <div 
        className="flex items-center gap-3 cursor-pointer flex-1"
        onClick={() => {
          onClose()
          window.location.href = `/profile/${user.username}`
        }}
      >
        <Avatar src={user.avatar} name={user.fullName} size="md" />
        <div className="flex flex-col">
          <span className={`text-sm font-bold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>{user.fullName}</span>
          <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>@{user.username}</span>
        </div>
      </div>
      
      {!isOwn && (
        <motion.button 
          whileTap={{ scale: 0.95 }}
          onClick={handleToggle}
          disabled={loading || actionLoading}
          className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            isFollowing
              ? darkMode ? 'bg-white/10 text-gray-300' : 'bg-gray-200 text-gray-700'
              : 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-md shadow-red-500/20'
          }`}
        >
          {loading || actionLoading ? <Loader2 size={14} className="animate-spin" /> : isFollowing ? <><UserCheck size={14}/> Following</> : <><UserPlus size={14}/> Follow</>}
        </motion.button>
      )}
    </div>
  )
}

function FollowListModal({ title, users, loading, currentUserId, onClose }) {
  const { darkMode } = useTheme()

  return (
    <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 size={24} className="animate-spin text-orange-500" />
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-8">
          <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>No users found.</p>
        </div>
      ) : (
        users.map(u => (
          <FollowItem key={u.id} user={u} currentUserId={currentUserId} onClose={onClose} />
        ))
      )}
    </div>
  )
}

export default FollowListModal
