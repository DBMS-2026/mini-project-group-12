import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search as SearchIcon, User, Store, TrendingUp, Sparkles, Filter, X } from 'lucide-react'
import MainLayout from '../components/layout/MainLayout'
import Avatar from '../components/common/Avatar'
import { useTheme } from '../context/ThemeContext'
import { searchUsers } from '../services/userService'
import { getRestaurants } from '../services/restaurantService'

const tagVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 10 },
  visible: (i) => ({
    opacity: 1, scale: 1, y: 0,
    transition: { type: 'spring', stiffness: 400, damping: 20, delay: 0.1 + i * 0.05 }
  }),
}

const resultVariants = {
  hidden: { opacity: 0, x: -20, scale: 0.97 },
  visible: (i) => ({
    opacity: 1, x: 0, scale: 1,
    transition: { type: 'spring', stiffness: 300, damping: 24, delay: i * 0.05 }
  }),
}

function Search() {
  const { darkMode } = useTheme()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const initialQuery = searchParams.get('q') || ''
  const [query, setQuery] = useState(initialQuery)
  const [filters, setFilters] = useState({ location: '', cuisine: '', rating: '', cost: '' })
  const [showFilters, setShowFilters] = useState(false)
  const [users, setUsers] = useState([])
  const [restaurants, setRestaurants] = useState([])
  const [loading, setLoading] = useState(false)
  const [inputFocused, setInputFocused] = useState(false)

  useEffect(() => {
    const hasFilters = Object.values(filters).some(val => val !== '')
    if (!query.trim() && !hasFilters) {
      setUsers([])
      setRestaurants([])
      return
    }

    const timer = setTimeout(async () => {
      setLoading(true)
      try {
        const [usersRes, restRes] = await Promise.all([
          query.trim() ? searchUsers(query) : { data: { users: [] } },
          getRestaurants(query, filters),
        ])
        setUsers(usersRes.data?.users || [])
        setRestaurants(restRes.data?.restaurants || [])
      } catch (err) {
        console.error('Search failed:', err)
      } finally {
        setLoading(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [query, filters])

  const trendingSearches = ['Biryani', 'Pizza', 'Burger', 'Waffles', 'Coffee', 'Desserts']

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20, filter: 'blur(4px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        >
          <h1 className={`text-2xl sm:text-3xl font-extrabold font-['Outfit'] mb-4 ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
            Search 🔍
          </h1>

          {/* Search input with animated border */}
          <motion.div
            animate={{
              boxShadow: inputFocused
                ? '0 0 0 3px rgba(249,115,22,0.15)'
                : '0 0 0 0px rgba(249,115,22,0)',
            }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="relative mb-6 rounded-2xl"
          >
            <motion.div
              animate={{ x: inputFocused ? 2 : 0 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className={`absolute left-4 top-1/2 -translate-y-1/2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}
            >
              <SearchIcon size={18} />
            </motion.div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setInputFocused(true)}
              onBlur={() => setInputFocused(false)}
              placeholder="Search foods, restaurants, creators..."
              autoFocus
              className={`w-full pl-11 pr-4 py-3.5 rounded-2xl text-sm outline-none border transition-all ${
                darkMode
                  ? 'bg-white/5 border-white/5 text-gray-200 placeholder:text-gray-600 focus:border-orange-500/30'
                  : 'bg-white border-gray-100 text-gray-800 placeholder:text-gray-400 focus:border-orange-300'
              }`}
            />
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-colors ${
                showFilters ? 'bg-orange-500 text-white shadow-md' : darkMode ? 'text-gray-400 hover:bg-white/10' : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              <Filter size={18} />
            </button>
          </motion.div>

          {/* Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: 'auto', marginTop: -12 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                className="overflow-hidden mb-6"
              >
                <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-white/5 border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>
                  <div className="flex items-center justify-between mb-3">
                    <p className={`text-sm font-semibold flex items-center gap-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                      <Filter size={14} /> Restaurant Filters
                    </p>
                    <button onClick={() => setFilters({ location: '', cuisine: '', rating: '', cost: '' })} className="text-xs font-semibold text-orange-500 hover:text-orange-600 transition-colors">Clear All</button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <input
                      type="text"
                      placeholder="Location"
                      value={filters.location}
                      onChange={(e) => setFilters(f => ({ ...f, location: e.target.value }))}
                      className={`w-full px-3 py-2 rounded-xl text-sm outline-none border transition-all ${darkMode ? 'bg-white/5 border-white/5 text-gray-200 focus:border-orange-500/30' : 'bg-gray-50 border-gray-100 text-gray-800 focus:border-orange-300'}`}
                    />
                    <input
                      type="text"
                      placeholder="Cuisine"
                      value={filters.cuisine}
                      onChange={(e) => setFilters(f => ({ ...f, cuisine: e.target.value }))}
                      className={`w-full px-3 py-2 rounded-xl text-sm outline-none border transition-all ${darkMode ? 'bg-white/5 border-white/5 text-gray-200 focus:border-orange-500/30' : 'bg-gray-50 border-gray-100 text-gray-800 focus:border-orange-300'}`}
                    />
                    <select
                      value={filters.rating}
                      onChange={(e) => setFilters(f => ({ ...f, rating: e.target.value }))}
                      className={`w-full px-3 py-2 rounded-xl text-sm outline-none border transition-all ${darkMode ? 'bg-white/5 border-white/5 text-gray-200 focus:border-orange-500/30' : 'bg-gray-50 border-gray-100 text-gray-800 focus:border-orange-300'}`}
                    >
                      <option value="">Any Rating</option>
                      <option value="4.5">4.5+ ⭐</option>
                      <option value="4.0">4.0+ ⭐</option>
                      <option value="3.5">3.5+ ⭐</option>
                    </select>
                    <input
                      type="number"
                      placeholder="Max Cost"
                      value={filters.cost}
                      onChange={(e) => setFilters(f => ({ ...f, cost: e.target.value }))}
                      className={`w-full px-3 py-2 rounded-xl text-sm outline-none border transition-all ${darkMode ? 'bg-white/5 border-white/5 text-gray-200 focus:border-orange-500/30' : 'bg-gray-50 border-gray-100 text-gray-800 focus:border-orange-300'}`}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Trending when empty */}
        <AnimatePresence>
          {!query.trim() && !Object.values(filters).some(val => val !== '') && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              <div className="flex items-center gap-2 mb-3">
                <motion.div
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
                >
                  <Sparkles size={16} className="text-orange-500" />
                </motion.div>
                <p className={`text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Trending Searches</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {trendingSearches.map((term, i) => (
                  <motion.button
                    key={term}
                    custom={i}
                    variants={tagVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover={{ scale: 1.08, y: -2 }}
                    whileTap={{ scale: 0.92 }}
                    onClick={() => setQuery(term)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                      darkMode
                        ? 'bg-white/5 text-gray-300 hover:bg-white/10'
                        : 'bg-orange-50 text-orange-600 hover:bg-orange-100'
                    }`}
                  >
                    {term}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <AnimatePresence mode="wait">
          {(query.trim() || Object.values(filters).some(val => val !== '')) && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {loading && (
                <div className="space-y-3">
                  {[1,2,3].map(i => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className={`h-16 rounded-2xl skeleton ${darkMode ? 'bg-white/5' : ''}`}
                    />
                  ))}
                </div>
              )}

              {!loading && users.length > 0 && (
                <div>
                  <p className={`text-xs font-semibold mb-2 flex items-center gap-1.5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    <User size={14} /> USERS
                  </p>
                  {users.map((u, i) => (
                    <motion.div
                      key={u.id}
                      custom={i}
                      variants={resultVariants}
                      initial="hidden"
                      animate="visible"
                      whileHover={{ x: 6, scale: 1.01, transition: { type: 'spring', stiffness: 400, damping: 20 } }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => navigate(`/profile/${u.username}`)}
                      className={`flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-colors ${
                        darkMode ? 'hover:bg-white/5' : 'hover:bg-orange-50'
                      }`}
                    >
                      <Avatar src={u.avatar} name={u.fullName} size="sm" />
                      <div>
                        <p className={`text-sm font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>{u.fullName}</p>
                        <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>@{u.username}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {!loading && restaurants.length > 0 && (
                <div>
                  <p className={`text-xs font-semibold mb-2 flex items-center gap-1.5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    <Store size={14} /> RESTAURANTS
                  </p>
                  {restaurants.map((r, i) => (
                    <motion.div
                      key={r.id}
                      custom={i}
                      variants={resultVariants}
                      initial="hidden"
                      animate="visible"
                      whileHover={{ x: 6, scale: 1.01, transition: { type: 'spring', stiffness: 400, damping: 20 } }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => navigate(`/restaurant/${encodeURIComponent(r.name)}`)}
                      className={`flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-colors ${
                        darkMode ? 'hover:bg-white/5' : 'hover:bg-orange-50'
                      }`}
                    >
                      <motion.div
                        whileHover={{ rotate: 10 }}
                        className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white shrink-0"
                      >
                        <Store size={18} />
                      </motion.div>
                      <div>
                        <p className={`text-sm font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>{r.name}</p>
                        <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{r.cuisine}</p>
                      </div>
                      <span className="ml-auto text-xs font-semibold text-green-500">⭐ {r.rating}</span>
                    </motion.div>
                  ))}
                </div>
              )}

              {!loading && users.length === 0 && restaurants.length === 0 && (
                <motion.p
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`text-center py-10 text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}
                >
                  No results found for "{query}"
                </motion.p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MainLayout>
  )
}

export default Search