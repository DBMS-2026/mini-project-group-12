import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Package, Clock, CheckCircle2, ChevronLeft, MapPin, Navigation, HelpCircle } from 'lucide-react'
import MainLayout from '../components/layout/MainLayout'
import { useTheme } from '../context/ThemeContext'
import api from '../services/api'
import toast from 'react-hot-toast'
import HelpModal from '../components/orders/HelpModal'

// Fix leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
})

const customIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/3004/3004655.png', // delivery bike icon
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40]
})

export default function OrderTracking() {
  const { id } = useParams()
  const { darkMode } = useTheme()
  const navigate = useNavigate()

  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isHelpOpen, setIsHelpOpen] = useState(false)
  const [timeLeft, setTimeLeft] = useState(600) // 10 minutes in seconds
  const [deliveryPos, setDeliveryPos] = useState([17.43, 78.48]) // Dummy start pos (Hyderabad)

  useEffect(() => {
    const loadOrder = async () => {
      try {
        const res = await api.get(`/orders/${id}`)
        setOrder(res.data.data.order)
        
        // Calculate dynamic time based on createdAt
        const createdAt = new Date(res.data.data.order.createdAt).getTime()
        const targetTime = createdAt + 10 * 60 * 1000
        const now = Date.now()
        const remainingSeconds = Math.max(0, Math.floor((targetTime - now) / 1000))
        setTimeLeft(remainingSeconds)
      } catch (error) {
        toast.error('Order not found')
        navigate('/')
      } finally {
        setLoading(false)
      }
    }
    loadOrder()
  }, [id, navigate])

  // Timer simulation
  useEffect(() => {
    if (loading || timeLeft <= 0) return
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1)
      // Simulate bike moving by changing coords slightly every second
      setDeliveryPos(prev => [prev[0] + 0.0001, prev[1] + 0.0001])
    }, 1000)
    return () => clearInterval(timer)
  }, [loading, timeLeft])

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      </MainLayout>
    )
  }

  const isDelivered = timeLeft <= 0

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto space-y-6 pb-20">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/orders')}
              className={`p-2 rounded-xl transition-colors ${darkMode ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-black/5 text-gray-600'}`}
            >
              <ChevronLeft size={24} />
            </button>
            <div>
              <h1 className={`text-2xl font-bold font-['Outfit'] ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Order #{order.id}
              </h1>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {order.restaurant?.name || 'Restaurant'}
              </p>
            </div>
          </div>
          
          <button
            onClick={() => setIsHelpOpen(true)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm border transition-colors ${
              darkMode ? 'bg-white/10 border-white/20 hover:bg-white/20 text-white' : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-800 shadow-sm'
            }`}
          >
            <HelpCircle size={16} /> Help
          </button>
        </div>

        {/* Status Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-6 rounded-3xl border overflow-hidden relative ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200 shadow-sm'}`}
        >
          {isDelivered && (
            <div className="absolute inset-0 bg-green-500/10 pointer-events-none" />
          )}
          <div className="flex flex-col md:flex-row items-center gap-6 justify-between relative z-10">
            <div className="flex items-center gap-5">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 ${
                isDelivered 
                  ? 'bg-green-500 text-white' 
                  : 'bg-orange-500 text-white'
              }`}>
                {isDelivered ? <CheckCircle2 size={32} /> : <Package size={32} />}
              </div>
              <div>
                <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {isDelivered ? 'Order Delivered!' : 'Food is on the way'}
                </h2>
                <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {isDelivered 
                    ? 'Enjoy your meal! Please rate your experience.' 
                    : 'Your delivery partner is heading to your location.'}
                </p>
              </div>
            </div>

            {!isDelivered && (
              <div className={`px-6 py-4 rounded-2xl flex items-center gap-4 border ${darkMode ? 'bg-black/40 border-white/10' : 'bg-orange-50 border-orange-100'}`}>
                <Clock className="text-orange-500 animate-pulse" size={28} />
                <div>
                  <p className={`text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-orange-600/80'}`}>
                    Arriving in
                  </p>
                  <p className={`text-2xl font-black font-['Outfit'] ${darkMode ? 'text-white' : 'text-orange-600'}`}>
                    {formatTime(timeLeft)}
                  </p>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Map Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`h-[400px] rounded-3xl overflow-hidden border ${darkMode ? 'border-white/10' : 'border-gray-200 shadow-sm'}`}
        >
          <MapContainer 
            center={deliveryPos} 
            zoom={15} 
            style={{ height: '100%', width: '100%', zIndex: 10 }}
            zoomControl={false}
          >
            <TileLayer
              url={darkMode 
                ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
                : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
              }
              attribution='&copy; OpenStreetMap contributors'
            />
            {!isDelivered && (
              <Marker position={deliveryPos} icon={customIcon}>
                <Popup>Delivery Partner</Popup>
              </Marker>
            )}
            {/* Destination Marker (slightly offset) */}
            <Marker position={[17.435, 78.485]}>
               <Popup>Delivery Location</Popup>
            </Marker>
          </MapContainer>
        </motion.div>

        {/* Order Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`p-6 rounded-3xl border ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200 shadow-sm'}`}
        >
          <h3 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Order Summary</h3>
          <div className="space-y-4">
            {order.items?.map((item, i) => (
              <div key={i} className="flex justify-between items-center pb-4 border-b last:border-0 last:pb-0 border-gray-200 dark:border-white/10">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded bg-gray-100 flex items-center justify-center font-bold text-sm ${darkMode ? 'text-gray-900' : 'text-gray-600'}`}>
                    {item.quantity}x
                  </div>
                  <span className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>{item.name}</span>
                </div>
                <span className={`font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-white/10 flex justify-between items-center">
            <span className={`font-bold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Total Paid</span>
            <span className={`text-xl font-bold font-['Outfit'] ${darkMode ? 'text-white' : 'text-gray-900'}`}>₹{order.totalAmount}</span>
          </div>
        </motion.div>

        <HelpModal 
          isOpen={isHelpOpen} 
          onClose={() => setIsHelpOpen(false)} 
          order={order}
          onOrderUpdate={(updatedOrder) => setOrder(updatedOrder)}
          onOrderCancel={() => navigate('/orders')}
        />
      </div>
    </MainLayout>
  )
}
