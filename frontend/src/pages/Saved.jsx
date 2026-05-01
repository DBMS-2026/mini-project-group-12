import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Bookmark } from 'lucide-react'
import MainLayout from '../components/layout/MainLayout'
import PostCard from '../components/feed/PostCard'
import FeedSkeleton from '../components/feed/FeedSkeleton'
import EmptyState from '../components/common/EmptyState'
import ErrorState from '../components/common/ErrorState'
import { useTheme } from '../context/ThemeContext'
import { getSavedPosts } from '../services/saveService'

const headerVariants = {
  hidden: { opacity: 0, y: -20, filter: 'blur(4px)' },
  visible: {
    opacity: 1, y: 0, filter: 'blur(0px)',
    transition: { type: 'spring', stiffness: 260, damping: 20 }
  },
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
}

function Saved() {
  const { darkMode } = useTheme()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const loadSaved = useCallback(async () => {
    setLoading(true)
    setError(false)
    try {
      const res = await getSavedPosts()
      setPosts(res.data?.posts || [])
    } catch (e) {
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadSaved() }, [loadSaved])

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto">
        <motion.div
          variants={headerVariants}
          initial="hidden"
          animate="visible"
          className="flex items-center justify-between mb-6"
        >
          <div>
            <h1 className={`text-2xl sm:text-3xl font-extrabold font-['Outfit'] ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
              Saved Posts
            </h1>
            <motion.p
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, type: 'spring' }}
              className={`text-sm mt-0.5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}
            >
              Your bookmarked favorites 🔖
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
            className={`w-11 h-11 rounded-2xl flex items-center justify-center ${
              darkMode ? 'bg-orange-500/10' : 'bg-orange-50'
            }`}
          >
            <Bookmark size={20} className="text-orange-500" />
          </motion.div>
        </motion.div>

        {loading ? (
          <FeedSkeleton count={3} />
        ) : error ? (
          <ErrorState
            title="Couldn't load saved"
            description="Something went wrong while fetching saved posts."
            onRetry={loadSaved}
          />
        ) : posts.length === 0 ? (
          <EmptyState
            icon={Bookmark}
            title="No saved posts"
            description="Bookmark your favorite food posts to find them here later!"
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

export default Saved