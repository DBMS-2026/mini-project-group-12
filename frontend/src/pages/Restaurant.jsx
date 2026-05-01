import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, MapPin, Clock, Phone, ExternalLink, Store, Plus, Filter, Search } from 'lucide-react'
import MainLayout from '../components/layout/MainLayout'
import PostCard from '../components/feed/PostCard'
import EmptyState from '../components/common/EmptyState'
import ErrorState from '../components/common/ErrorState'
import CardSkeleton from '../components/common/CardSkeleton'
import { useTheme } from '../context/ThemeContext'
import { useCart } from '../context/CartContext'
import { getRestaurants, getRestaurant, getRestaurantPosts } from '../services/restaurantService'

const API_BASE = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:5000'

function Restaurant() {
  const { restaurantName } = useParams()
  const { darkMode } = useTheme()
  const { addToCart } = useCart()
  const [restaurant, setRestaurant] = useState(null)
  const [restaurants, setRestaurants] = useState([])
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({ location: '', cuisine: '', rating: '', cost: '' })
  const [showFilters, setShowFilters] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    setError(false)
    try {
      if (restaurantName) {
        const [restRes, postsRes] = await Promise.all([
          getRestaurant(restaurantName),
          getRestaurantPosts(restaurantName),
        ])
        setRestaurant(restRes.data?.restaurant)
        setPosts(postsRes.data?.posts || [])
      } else {
        const res = await getRestaurants(searchQuery, filters)
        setRestaurants(res.data?.restaurants || [])
      }
    } catch (err) {
      console.error(err)
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData()
    }, 300)
    return () => clearTimeout(timer)
  }, [restaurantName, searchQuery, filters])

  if (loading) {
    return (
      <MainLayout>
        <div className="max-w-4xl mx-auto space-y-4">
          {restaurantName ? (
            <>
              <div className={`h-56 sm:h-72 rounded-3xl skeleton ${darkMode ? 'bg-white/5' : ''}`} />
              <div className={`h-24 rounded-2xl skeleton ${darkMode ? 'bg-white/5' : ''}`} />
            </>
          ) : (
            <CardSkeleton count={4} layout="grid" />
          )}
        </div>
      </MainLayout>
    )
  }

  if (error) {
    return (
      <MainLayout>
        <div className="max-w-4xl mx-auto">
          <ErrorState
            title="Couldn't load restaurants"
            description="Something went wrong. Please try again."
            onRetry={fetchData}
          />
        </div>
      </MainLayout>
    )
  }

  // Restaurant list view
  if (!restaurantName) {
    return (
      <MainLayout>
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className={`text-2xl sm:text-3xl font-extrabold font-['Outfit'] ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                Restaurants 🍽️
              </h1>
              <p className={`text-sm mt-0.5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                Discover top food places near you
              </p>
            </div>
            <div className="flex-1 max-w-md relative">
              <div className={`flex items-center px-4 py-2.5 rounded-2xl border transition-all ${
                darkMode ? 'bg-white/5 border-white/10 focus-within:border-orange-500/50' : 'bg-white border-gray-200 focus-within:border-orange-400'
              }`}>
                <Search size={18} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
                <input
                  type="text"
                  placeholder="Search restaurants..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full ml-3 bg-transparent outline-none text-sm ${darkMode ? 'text-gray-200 placeholder-gray-500' : 'text-gray-800 placeholder-gray-400'}`}
                />
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`p-1.5 rounded-lg transition-colors ml-2 ${
                    showFilters ? 'bg-orange-500 text-white shadow-md' : darkMode ? 'text-gray-400 hover:bg-white/10' : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  <Filter size={18} />
                </button>
              </div>
            </div>
          </motion.div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                className="overflow-hidden"
              >
                <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-white/5 border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>
                  <div className="flex items-center justify-between mb-3">
                    <p className={`text-sm font-semibold flex items-center gap-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                      <Filter size={14} /> Refine Search
                    </p>
                    <button onClick={() => setFilters({ location: '', cuisine: '', rating: '', cost: '' })} className="text-xs font-semibold text-orange-500 hover:text-orange-600 transition-colors">Clear Filters</button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <input type="text" placeholder="Location" value={filters.location} onChange={(e) => setFilters(f => ({ ...f, location: e.target.value }))} className={`w-full px-3 py-2 rounded-xl text-sm outline-none border transition-all ${darkMode ? 'bg-white/5 border-white/5 text-gray-200 focus:border-orange-500/30' : 'bg-gray-50 border-gray-100 text-gray-800 focus:border-orange-300'}`} />
                    <input type="text" placeholder="Cuisine" value={filters.cuisine} onChange={(e) => setFilters(f => ({ ...f, cuisine: e.target.value }))} className={`w-full px-3 py-2 rounded-xl text-sm outline-none border transition-all ${darkMode ? 'bg-white/5 border-white/5 text-gray-200 focus:border-orange-500/30' : 'bg-gray-50 border-gray-100 text-gray-800 focus:border-orange-300'}`} />
                    <select value={filters.rating} onChange={(e) => setFilters(f => ({ ...f, rating: e.target.value }))} className={`w-full px-3 py-2 rounded-xl text-sm outline-none border transition-all ${darkMode ? 'bg-white/5 border-white/5 text-gray-200 focus:border-orange-500/30' : 'bg-gray-50 border-gray-100 text-gray-800 focus:border-orange-300'}`}>
                      <option value="">Any Rating</option>
                      <option value="4.5">4.5+ ⭐</option>
                      <option value="4.0">4.0+ ⭐</option>
                      <option value="3.5">3.5+ ⭐</option>
                    </select>
                    <input type="number" placeholder="Max Cost" value={filters.cost} onChange={(e) => setFilters(f => ({ ...f, cost: e.target.value }))} className={`w-full px-3 py-2 rounded-xl text-sm outline-none border transition-all ${darkMode ? 'bg-white/5 border-white/5 text-gray-200 focus:border-orange-500/30' : 'bg-gray-50 border-gray-100 text-gray-800 focus:border-orange-300'}`} />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {restaurants.map((r, i) => (
              <motion.a
                key={r.id}
                href={`/restaurant/${encodeURIComponent(r.name)}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -4 }}
                className={`rounded-3xl overflow-hidden border group transition-all backdrop-blur-lg ${
                  darkMode
                    ? 'bg-white/[0.03] border-white/[0.06] hover:border-white/[0.1] hover:shadow-lg'
                    : 'bg-white/70 border-black/5 hover:shadow-lg hover:shadow-orange-500/5'
                }`}
              >
                <div className="relative h-36 sm:h-40 overflow-hidden">
                  <img
                    src={r.imageUrl || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800'}
                    alt={r.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-3 right-3 bg-green-500 text-white px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                    <Star size={12} fill="currentColor" /> {r.rating}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className={`text-base sm:text-lg font-bold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>{r.name}</h3>
                  <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{r.cuisine}</p>
                  <p className={`text-xs mt-1 flex items-center gap-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    <MapPin size={12} /> {r.location}
                  </p>
                </div>
              </motion.a>
            ))}
          </div>

          {restaurants.length === 0 && (
            <EmptyState icon={Store} title="No restaurants" description="Restaurants will appear here once added." />
          )}
        </div>
      </MainLayout>
    )
  }

  // Single restaurant detail
  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className={`rounded-3xl overflow-hidden border backdrop-blur-lg ${darkMode ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white/70 border-black/5'}`}
        >
          <div className="relative h-48 sm:h-56 md:h-72">
            <img
              src={restaurant?.imageUrl || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800'}
              alt={restaurant?.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-4 left-4 sm:left-5 right-4 sm:right-5">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white font-['Outfit']">{restaurant?.name}</h1>
                <span className="bg-green-500 text-white px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                  <Star size={12} fill="currentColor" /> {restaurant?.rating}
                </span>
              </div>
              <p className="text-white/70 text-sm mt-1 flex items-center gap-1">
                <MapPin size={14} /> {restaurant?.location}
              </p>
            </div>
          </div>

          <div className="p-4 sm:p-5 space-y-4">
            {restaurant?.description && (
              <p className={`text-sm leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {restaurant.description}
              </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { icon: Store, label: 'Cuisine', value: restaurant?.cuisine },
                { icon: Clock, label: 'Hours', value: restaurant?.openingTime },
                { icon: Phone, label: 'Phone', value: restaurant?.phone },
              ].map(item => (
                <div key={item.label} className={`p-3 rounded-2xl ${darkMode ? 'bg-white/5' : 'bg-orange-50'}`}>
                  <div className="flex items-center gap-2 mb-1">
                     <item.icon size={14} className="text-orange-500" />
                    <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{item.label}</span>
                  </div>
                  <p className={`text-sm font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>{item.value || 'N/A'}</p>
                </div>
              ))}
            </div>

            {restaurant?.mapLink && (
              <motion.a
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href={restaurant.mapLink}
                target="_blank"
                rel="noreferrer"
                className="gradient-btn inline-flex items-center gap-2 px-5 py-2.5 text-sm"
              >
                <ExternalLink size={16} /> Open in Maps
              </motion.a>
            )}
          </div>
        </motion.div>

        {/* Menu Items */}
        {restaurant?.menuItems?.length > 0 && (
          <div>
            <h2 className={`text-lg font-bold mb-4 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
              Menu 📋
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {restaurant.menuItems.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`p-4 rounded-2xl border flex flex-col justify-between ${darkMode ? 'bg-white/[0.02] border-white/5' : 'bg-white/60 border-gray-100'}`}
                >
                  <div className="flex gap-4">
                    <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0 bg-gray-100">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-3xl">🍽️</div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col">
                      <div className="flex items-center gap-2 mb-1">
                        <div className={`w-3 h-3 rounded-sm border flex items-center justify-center ${item.isVeg ? 'border-green-500' : 'border-red-500'}`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${item.isVeg ? 'bg-green-500' : 'bg-red-500'}`} />
                        </div>
                        <h3 className={`font-bold text-sm truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>{item.name}</h3>
                      </div>
                      <p className={`text-xs line-clamp-2 mt-1 flex-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{item.description}</p>
                      <div className="mt-3 flex items-center justify-between">
                        <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>₹{item.price}</span>
                        <button
                          onClick={() => addToCart(item, restaurant.id, restaurant.name)}
                          className={`flex items-center justify-center w-8 h-8 rounded-full ${
                            darkMode ? 'bg-orange-500/20 text-orange-400 hover:bg-orange-500/30' : 'bg-orange-100 text-orange-600 hover:bg-orange-200'
                          } transition-colors`}
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Restaurant posts */}
        {posts.length > 0 && (
          <div>
            <h2 className={`text-lg font-bold mt-6 mb-4 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
              Food Posts 🍔
            </h2>
            <div className="space-y-5">
              {posts.map((post, i) => (
                <PostCard key={post.id} post={post} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  )
}

export default Restaurant