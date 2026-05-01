import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Bell, Heart, MessageCircle, UserPlus, Inbox } from 'lucide-react'
import MainLayout from '../components/layout/MainLayout'
import { useTheme } from '../context/ThemeContext'
import { getNotifications, markNotificationsAsRead } from '../services/notificationService'
import Avatar from '../components/common/Avatar'

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, x: -30, scale: 0.95 },
  visible: {
    opacity: 1, x: 0, scale: 1,
    transition: { type: 'spring', stiffness: 300, damping: 24 }
  },
}

const getIconForType = (type) => {
  switch (type) {
    case 'like': return Heart
    case 'comment': return MessageCircle
    case 'follow': return UserPlus
    default: return Bell
  }
}

const API_BASE = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:5000'

function Notifications() {
  const { darkMode } = useTheme()
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  const loadNotifications = useCallback(async () => {
    try {
      const res = await getNotifications()
      setNotifications(res.notifications || res.data?.notifications || [])
      // Mark as read when opened
      await markNotificationsAsRead()
    } catch (error) {
      console.error('Failed to load notifications:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadNotifications() }, [loadNotifications])

  const typeColors = {
    like: darkMode ? 'bg-red-500/10 text-red-400' : 'bg-red-50 text-red-500',
    comment: darkMode ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-500',
    follow: darkMode ? 'bg-green-500/10 text-green-400' : 'bg-green-50 text-green-500',
  }

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20, filter: 'blur(4px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="flex items-center gap-3 mb-6"
        >
          <motion.div
            animate={{ rotate: [0, 15, -15, 10, -10, 0] }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Bell className="text-orange-500" size={24} />
          </motion.div>
          <h1 className={`text-2xl sm:text-3xl font-extrabold font-['Outfit'] ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
            Notifications
          </h1>
        </motion.div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className={`h-20 rounded-2xl skeleton ${darkMode ? 'bg-white/5' : ''}`} />
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-16 text-center"
          >
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-4 ${darkMode ? 'bg-white/5' : 'bg-orange-50'}`}
            >
              <Inbox size={36} className="text-orange-500" />
            </motion.div>
            <h3 className={`text-lg font-bold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>No notifications yet</h3>
            <p className={`text-sm mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>You're all caught up! 🎉</p>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-3"
          >
            {notifications.map((notif) => {
              const Icon = getIconForType(notif.type)
              return (
                <motion.div
                  key={notif.id}
                  variants={itemVariants}
                  whileHover={{
                    x: 6,
                    scale: 1.01,
                    boxShadow: darkMode
                      ? '0 8px 30px -8px rgba(239,68,68,0.08)'
                      : '0 8px 30px -8px rgba(239,68,68,0.1)',
                    transition: { type: 'spring', stiffness: 400, damping: 20 }
                  }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center gap-4 p-4 rounded-2xl border cursor-pointer backdrop-blur-lg transition-colors duration-200 ${
                    darkMode
                      ? 'bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.06] hover:border-white/[0.1]'
                      : 'bg-white/70 border-black/5 hover:shadow-md hover:shadow-orange-500/5'
                  } ${!notif.isRead ? (darkMode ? 'bg-orange-500/10' : 'bg-orange-50') : ''}`}
                >
                  <motion.div
                    whileHover={{ scale: 1.15, rotate: 10 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                    className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${typeColors[notif.type]}`}
                  >
                    <Icon size={20} />
                  </motion.div>
                  <div className="flex-1 min-w-0 flex items-center justify-between">
                    <div>
                      <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        <span className="font-bold">@{notif.sender?.username}</span> {notif.message}
                      </p>
                      <p className={`text-xs mt-0.5 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>
                        {new Date(notif.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    {notif.post?.imageUrl && (
                      <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 ml-3">
                        <img 
                          src={notif.post.imageUrl.startsWith('http') ? notif.post.imageUrl : `${API_BASE}${notif.post.imageUrl}`}
                          alt="Post" 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        )}
      </div>
    </MainLayout>
  )
}

export default Notifications
