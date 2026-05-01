import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Flame, Clock, Navigation, MapPin } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import MainLayout from '../components/layout/MainLayout'
import PostCard from '../components/feed/PostCard'
import FeedSkeleton from '../components/feed/FeedSkeleton'
import EmptyState from '../components/common/EmptyState'
import ErrorState from '../components/common/ErrorState'
import { usePosts } from '../context/PostContext'
import { useTheme } from '../context/ThemeContext'
import api from '../services/api'

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.15 }
  },
}

const headerVariants = {
  hidden: { opacity: 0, y: -20, filter: 'blur(4px)' },
  visible: {
    opacity: 1, y: 0, filter: 'blur(0px)',
    transition: { type: 'spring', stiffness: 260, damping: 20 }
  },
}

function Home() {
  const { posts, loading, fetchPosts } = usePosts()
  const { darkMode } = useTheme()
  const [error, setError] = useState(false)
  const [activeOrder, setActiveOrder] = useState(null)
  const [timeLeft, setTimeLeft] = useState(0)
  const navigate = useNavigate()

  const loadFeed = useCallback(async () => {
    setError(false)
    try {
      await fetchPosts(1, true)
    } catch (e) {
      setError(true)
    }
  }, [fetchPosts])

  const loadActiveOrder = async () => {
    try {
      const res = await api.get('/orders/active')
      if (res.data?.data?.order) {
        const order = res.data.data.order
        setActiveOrder(order)
        
        // Calculate time left (10 minutes from creation)
        const createdAt = new Date(order.createdAt).getTime()
        const targetTime = createdAt + 10 * 60 * 1000
        const now = Date.now()
        const remainingSeconds = Math.max(0, Math.floor((targetTime - now) / 1000))
        setTimeLeft(remainingSeconds)
      }
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => { 
    loadFeed()
    loadActiveOrder()
  }, [loadFeed])

  // Timer effect
  useEffect(() => {
    if (!activeOrder || timeLeft <= 0) return
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          setActiveOrder(null)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [activeOrder, timeLeft])

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          variants={headerVariants}
          initial="hidden"
          animate="visible"
          className="flex items-center justify-between mb-6"
        >
          <div>
            <h1 className={`text-2xl sm:text-3xl font-extrabold font-['Outfit'] ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
              Food Feed
            </h1>
            <motion.p
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, type: 'spring' }}
              className={`text-sm mt-0.5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}
            >
              Discover what's cooking today 🍔
            </motion.p>
          </div>
        </motion.div>

        {/* Active Order Banner */}
        <AnimatePresence>
          {activeOrder && (
            <motion.div
              initial={{ opacity: 0, y: -20, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -20, height: 0 }}
              className={`mb-6 p-4 rounded-2xl border flex items-center justify-between cursor-pointer group transition-all ${
                darkMode 
                  ? 'bg-orange-500/10 border-orange-500/20 hover:bg-orange-500/20 hover:border-orange-500/30' 
                  : 'bg-orange-50 border-orange-200 hover:bg-orange-100 hover:border-orange-300'
              }`}
              onClick={() => navigate(`/order-tracking/${activeOrder.id}`)}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                  darkMode ? 'bg-orange-500/20 text-orange-400' : 'bg-white shadow-sm text-orange-500'
                }`}>
                  <Clock className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <h3 className={`font-bold text-[15px] ${darkMode ? 'text-orange-400' : 'text-orange-700'}`}>
                    Order is on the way!
                  </h3>
                  <p className={`text-[13px] font-medium flex items-center gap-1.5 mt-0.5 ${darkMode ? 'text-orange-200/70' : 'text-orange-600/80'}`}>
                    <MapPin size={12} />
                    {timeLeft > 0 ? `Arriving in ${formatTime(timeLeft)}` : 'Arriving now!'}
                  </p>
                </div>
              </div>
              <div className={`p-2 rounded-xl transition-all ${
                darkMode ? 'bg-white/10 group-hover:bg-white/20 text-white' : 'bg-white shadow-sm text-orange-600 group-hover:bg-orange-500 group-hover:text-white'
              }`}>
                <Navigation size={18} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content */}
        {loading && posts.length === 0 ? (
          <FeedSkeleton count={3} />
        ) : error ? (
          <ErrorState
            title="Couldn't load feed"
            description="Something went wrong while fetching posts."
            onRetry={loadFeed}
          />
        ) : posts.length === 0 ? (
          <EmptyState
            icon={Flame}
            title="No posts yet"
            description="Be the first to share a delicious food experience!"
            action="Upload Post"
            onAction={() => window.location.href = '/upload'}
          />
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-5 sm:space-y-6"
          >
            {posts.map((post, index) => (
              <PostCard key={post.id} post={post} index={index} />
            ))}
          </motion.div>
        )}
      </div>
    </MainLayout>
  )
}

export default Home