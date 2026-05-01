import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { TrendingUp, Flame, Sparkles, Store } from 'lucide-react'
import Avatar from '../common/Avatar'
import { useTheme } from '../../context/ThemeContext'
import { getSuggestedUsers } from '../../services/userService'
import { getRestaurants } from '../../services/restaurantService'
import { toggleFollow } from '../../services/followService'

const trendingTags = [
  { tag: '🍔 Burgers', count: '2.4k' },
  { tag: '🍕 Pizza', count: '1.8k' },
  { tag: '🍗 Biryani', count: '3.1k' },
  { tag: '🧇 Waffles', count: '956' },
  { tag: '☕ Coffee', count: '1.2k' },
  { tag: '🍰 Desserts', count: '2.7k' },
]

const dummyUsers = [
  { id: 'dummy1', name: 'Pizza Lover', username: 'pizza_lover', avatarText: '🍕' },
  { id: 'dummy2', name: 'Sweet Tooth', username: 'sweet_tooth', avatarText: '🧁' },
  { id: 'dummy3', name: 'Street Foodie', username: 'street_foodie', avatarText: '🌮' },
]

const sectionVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  visible: (delay) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { delay, type: 'spring', stiffness: 220, damping: 22 }
  }),
}

function RightSidebar() {
  const { darkMode } = useTheme()
  const navigate = useNavigate()
  const [suggestedUsers, setSuggestedUsers] = useState([])
  const [loading, setLoading] = useState(true)

  const [topRestaurants, setTopRestaurants] = useState([])
  const [loadingRestaurants, setLoadingRestaurants] = useState(true)

  useEffect(() => {
    const fetchSuggested = async () => {
      try {
        const res = await getSuggestedUsers()
        if (res.data?.suggested && res.data.suggested.length > 0) {
          setSuggestedUsers(res.data.suggested)
        } else {
          setSuggestedUsers(dummyUsers)
        }
      } catch (error) {
        console.error('Failed to fetch suggested users:', error)
        setSuggestedUsers(dummyUsers)
      } finally {
        setLoading(false)
      }
    }

    const fetchTopRestaurants = async () => {
      try {
        const res = await getRestaurants('', { rating: '4.0' })
        if (res.data?.restaurants) {
          const sorted = res.data.restaurants.sort((a, b) => b.rating - a.rating).slice(0, 3)
          setTopRestaurants(sorted)
        }
      } catch (err) {
        console.error('Failed to fetch top restaurants:', err)
      } finally {
        setLoadingRestaurants(false)
      }
    }

    fetchSuggested()
    fetchTopRestaurants()
  }, [])

  const handleFollow = async (userId) => {
    try {
      if (!String(userId).startsWith('dummy')) {
        await toggleFollow(userId)
      }
      setSuggestedUsers(prev => prev.filter(u => u.id !== userId))
    } catch (error) {
      console.error('Failed to follow user:', error)
    }
  }

  const cardClass = `rounded-2xl p-5 border backdrop-blur-xl ${
    darkMode
      ? 'bg-white/[0.03] border-white/[0.05] hover:border-white/[0.08]'
      : 'bg-white/70 border-black/[0.04] hover:border-orange-200/50'
  } transition-colors duration-300`

  return (
    <div className="sticky top-[90px] space-y-5">
      {/* Trending */}
      <motion.div
        custom={0.3}
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        className={cardClass}
      >
        <div className="flex items-center gap-2.5 mb-4">
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
            darkMode ? 'bg-orange-500/10' : 'bg-orange-50'
          }`}>
            <Flame size={16} className="text-orange-500" />
          </div>
          <h3 className={`text-sm font-bold tracking-wide ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
            Trending Now
          </h3>
        </div>

        <div className="space-y-0.5">
          {trendingTags.map((item, i) => (
            <motion.div
              key={item.tag}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.05, type: 'spring', stiffness: 300 }}
              whileHover={{ x: 5, backgroundColor: darkMode ? 'rgba(255,255,255,0.03)' : 'rgba(249,115,22,0.04)' }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(`/search?q=${encodeURIComponent(item.tag.split(' ').slice(1).join(' ') || item.tag)}`)}
              className="flex items-center justify-between py-2.5 px-3 rounded-xl cursor-pointer transition-colors duration-200"
            >
              <span className={`text-[13px] font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {item.tag}
              </span>
              <span className={`text-[11px] font-semibold tabular-nums ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>
                {item.count}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Suggested */}
      {!loading && (
        <motion.div
          custom={0.5}
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          className={cardClass}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                darkMode ? 'bg-blue-500/10' : 'bg-blue-50'
              }`}>
                <Sparkles size={16} className="text-blue-500" />
              </div>
              <h3 className={`text-sm font-bold tracking-wide ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                Suggested
              </h3>
            </div>
            <button 
              onClick={() => navigate('/search')}
              className={`text-[11px] font-semibold ${darkMode ? 'text-orange-400' : 'text-orange-500'} hover:underline`}
            >
              See All
            </button>
          </div>

          <div className="space-y-1.5">
            {suggestedUsers.length > 0 ? (
              suggestedUsers.map((u, i) => (
                <motion.div
                  key={u.id}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + i * 0.05, type: 'spring', stiffness: 300 }}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate(`/profile/${u.username}`)}
                  className={`flex items-center gap-3 py-2.5 px-3 rounded-xl cursor-pointer transition-colors duration-200 ${
                    darkMode ? 'hover:bg-white/[0.03]' : 'hover:bg-orange-50/50'
                  }`}
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-red-500 to-orange-400 flex items-center justify-center text-base shrink-0 shadow-sm overflow-hidden">
                    {u.avatar ? (
                      <img src={u.avatar.startsWith('http') ? u.avatar : `http://localhost:5000${u.avatar}`} alt={u.fullName || u.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-white text-base">{u.avatarText || u.fullName?.charAt(0) || u.name?.charAt(0) || '👤'}</span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={`text-[13px] font-semibold truncate ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                      {u.fullName || u.name}
                    </p>
                    <p className={`text-[11px] truncate ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>
                      @{u.username}
                    </p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.92 }}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleFollow(u.id)
                    }}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                      darkMode
                        ? 'bg-white/[0.06] text-orange-400 hover:bg-white/[0.1]'
                        : 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-sm shadow-red-500/20'
                    }`}
                  >
                    Follow
                  </motion.button>
                </motion.div>
              ))
            ) : (
              <p className={`text-xs text-center py-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                You're all caught up! 🌟
              </p>
            )}
          </div>
        </motion.div>
      )}

      {/* Top Restaurants */}
      {!loadingRestaurants && topRestaurants.length > 0 && (
        <motion.div
          custom={0.7}
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          className={cardClass}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                darkMode ? 'bg-green-500/10' : 'bg-green-50'
              }`}>
                <Store size={16} className="text-green-500" />
              </div>
              <h3 className={`text-sm font-bold tracking-wide ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                Top Restaurants
              </h3>
            </div>
            <button 
              onClick={() => navigate('/restaurant')}
              className={`text-[11px] font-semibold ${darkMode ? 'text-green-400' : 'text-green-600'} hover:underline`}
            >
              See All
            </button>
          </div>

          <div className="space-y-2">
            {topRestaurants.map((r, i) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + i * 0.05, type: 'spring', stiffness: 300 }}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(`/restaurant/${encodeURIComponent(r.name)}`)}
                className={`flex items-center gap-3 py-2 px-2.5 rounded-xl cursor-pointer transition-colors duration-200 ${
                  darkMode ? 'hover:bg-white/[0.03]' : 'hover:bg-green-50/50'
                }`}
              >
                <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 shadow-sm bg-gray-100">
                  <img src={r.imageUrl || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200'} alt={r.name} className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className={`text-[13px] font-bold truncate ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                    {r.name}
                  </p>
                  <p className={`text-[11px] truncate flex items-center gap-1 mt-0.5 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                    ⭐ {r.rating} • {r.cuisine}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default RightSidebar