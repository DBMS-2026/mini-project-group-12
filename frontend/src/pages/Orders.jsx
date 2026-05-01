import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Package, Clock, CheckCircle2, Navigation, ChevronRight, MapPin } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import MainLayout from '../components/layout/MainLayout'
import { useTheme } from '../context/ThemeContext'
import api from '../services/api'
import EmptyState from '../components/common/EmptyState'

export default function Orders() {
  const { darkMode } = useTheme()
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/orders')
        if (res.data?.data?.orders) {
          setOrders(res.data.data.orders)
        }
      } catch (err) {
        console.error('Failed to fetch orders:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [])

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto space-y-6 pb-20">
        <div className="mb-8">
          <h1 className={`text-2xl sm:text-3xl font-extrabold font-['Outfit'] ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
            My Orders
          </h1>
          <p className={`text-sm mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            View all your past and active orders
          </p>
        </div>

        {orders.length === 0 ? (
          <EmptyState
            icon={Package}
            title="No orders yet"
            description="Looks like you haven't ordered anything yet."
            action="Browse Restaurants"
            onAction={() => navigate('/home')}
          />
        ) : (
          <div className="space-y-4">
            {orders.map((order, i) => {
              const createdAt = new Date(order.createdAt).getTime()
              const targetTime = createdAt + 10 * 60 * 1000
              const now = Date.now()
              const remainingSeconds = Math.max(0, Math.floor((targetTime - now) / 1000))
              const m = Math.floor(remainingSeconds / 60)
              const s = remainingSeconds % 60
              const timeString = `${m}:${s.toString().padStart(2, '0')}`
              
              // It's still processing if status is processing AND timer hasn't hit 0
              const isProcessing = order.status === 'processing' && remainingSeconds > 0
              
              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => navigate(`/order-tracking/${order.id}`)}
                  className={`p-5 rounded-2xl border cursor-pointer group transition-all ${
                    darkMode 
                      ? 'bg-white/5 border-white/10 hover:border-orange-500/30 hover:bg-white/[0.07]' 
                      : 'bg-white border-gray-200 hover:border-orange-300 shadow-sm hover:shadow-md'
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        isProcessing 
                          ? 'bg-orange-500 text-white animate-pulse' 
                          : darkMode ? 'bg-white/10 text-gray-400' : 'bg-green-100 text-green-600'
                      }`}>
                        {isProcessing ? <Clock size={20} /> : <CheckCircle2 size={20} />}
                      </div>
                      <div>
                        <h3 className={`font-bold text-base ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                          {order.restaurant?.name || 'Restaurant'}
                        </h3>
                        <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                          Order #{order.id} • {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      isProcessing 
                        ? 'bg-orange-100 text-orange-600' 
                        : 'bg-green-100 text-green-600'
                    }`}>
                      {isProcessing ? `Arriving in ${timeString}` : 'Delivered'}
                    </div>
                  </div>

                  <div className={`py-3 border-y ${darkMode ? 'border-white/10' : 'border-gray-100'} flex gap-2 overflow-x-auto custom-scrollbar`}>
                    {order.items?.map((item, idx) => (
                      <span key={idx} className={`whitespace-nowrap text-xs px-2.5 py-1.5 rounded-lg ${
                        darkMode ? 'bg-black/30 text-gray-300' : 'bg-gray-50 text-gray-700 border'
                      }`}>
                        {item.quantity}x {item.name}
                      </span>
                    ))}
                  </div>

                  {order.deliveryAddress && (
                    <div className={`py-3 border-b ${darkMode ? 'border-white/10' : 'border-gray-100'}`}>
                      <p className={`text-xs flex items-start gap-1.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        <MapPin size={14} className="shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{order.deliveryAddress}</span>
                      </p>
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-4">
                    <p className={`font-bold font-['Outfit'] ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Total: ₹{order.totalAmount}
                    </p>
                    <div className={`flex items-center gap-1 text-sm font-semibold transition-colors ${
                      darkMode ? 'text-orange-400 group-hover:text-orange-300' : 'text-orange-500 group-hover:text-orange-600'
                    }`}>
                      {isProcessing ? 'Track Order' : 'View Receipt'}
                      <ChevronRight size={16} />
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </MainLayout>
  )
}
