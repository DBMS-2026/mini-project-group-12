import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, MapPin, XCircle, Phone, Loader2, Info } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'
import toast from 'react-hot-toast'
import api from '../../services/api'

export default function HelpModal({ isOpen, onClose, order, onOrderUpdate, onOrderCancel }) {
  const { darkMode } = useTheme()
  const [activeTab, setActiveTab] = useState(null)
  const [newAddress, setNewAddress] = useState(order?.deliveryAddress || '')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen) return null

  const handleUpdateAddress = async () => {
    if (!newAddress.trim()) return toast.error('Address cannot be empty')
    setIsSubmitting(true)
    try {
      const res = await api.put(`/orders/${order.id}/address`, { address: newAddress })
      toast.success('Delivery address updated!')
      onOrderUpdate(res.data.data.order)
      setActiveTab(null)
      onClose()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update address')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancelOrder = async () => {
    setIsSubmitting(true)
    try {
      await api.put(`/orders/${order.id}/cancel`)
      toast.success('Order cancelled successfully')
      onOrderCancel()
      onClose()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel order')
    } finally {
      setIsSubmitting(false)
    }
  }

  const ActionCard = ({ icon: Icon, title, desc, onClick, color }) => (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`w-full p-4 rounded-2xl border text-left flex gap-4 items-center transition-colors ${
        darkMode ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-white border-gray-200 hover:bg-gray-50 shadow-sm'
      }`}
    >
      <div className={`p-3 rounded-xl ${color}`}>
        <Icon size={20} />
      </div>
      <div>
        <h4 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{title}</h4>
        <p className={`text-xs mt-0.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{desc}</p>
      </div>
    </motion.button>
  )

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className={`relative w-full max-w-md rounded-3xl overflow-hidden shadow-2xl ${
          darkMode ? 'bg-[#1a1a2e] border border-white/10' : 'bg-white'
        }`}
      >
        <div className={`p-5 border-b flex justify-between items-center ${darkMode ? 'border-white/10' : 'border-gray-100'}`}>
          <h2 className={`text-xl font-bold font-['Outfit'] ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Help & Support
          </h2>
          <button onClick={onClose} className={`p-2 rounded-full ${darkMode ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}>
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">
            {!activeTab && (
              <motion.div
                key="menu"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-3"
              >
                <ActionCard 
                  icon={MapPin} 
                  title="Change Delivery Address" 
                  desc="Update where we should deliver your food"
                  color="bg-blue-100 text-blue-600"
                  onClick={() => setActiveTab('address')}
                />
                <ActionCard 
                  icon={XCircle} 
                  title="Cancel Order" 
                  desc="Cancel this order if you made a mistake"
                  color="bg-red-100 text-red-600"
                  onClick={() => setActiveTab('cancel')}
                />
                <ActionCard 
                  icon={Phone} 
                  title="Contact Delivery Partner" 
                  desc="Call the person delivering your food"
                  color="bg-orange-100 text-orange-600"
                  onClick={() => toast('Connecting to delivery partner...', { icon: '📞' })}
                />
              </motion.div>
            )}

            {activeTab === 'address' && (
              <motion.div
                key="address"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className={`p-3 rounded-xl flex gap-3 ${darkMode ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
                  <Info size={20} className="shrink-0" />
                  <p className="text-sm">You can change the address as long as the delivery partner hasn't reached your location.</p>
                </div>
                
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>New Delivery Address</label>
                  <textarea
                    value={newAddress}
                    onChange={(e) => setNewAddress(e.target.value)}
                    rows={3}
                    className={`w-full px-4 py-3 rounded-xl text-sm outline-none border transition-all resize-none ${
                      darkMode ? 'bg-white/5 border-white/10 text-white focus:border-blue-500' : 'bg-gray-50 border-gray-200 focus:border-blue-500'
                    }`}
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button onClick={() => setActiveTab(null)} className={`flex-1 py-3 rounded-xl font-bold ${darkMode ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                    Back
                  </button>
                  <button onClick={handleUpdateAddress} disabled={isSubmitting} className="flex-1 py-3 rounded-xl font-bold bg-blue-500 text-white hover:bg-blue-600 flex items-center justify-center gap-2">
                    {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : 'Update Address'}
                  </button>
                </div>
              </motion.div>
            )}

            {activeTab === 'cancel' && (
              <motion.div
                key="cancel"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4 text-center"
              >
                <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-2">
                  <XCircle size={32} />
                </div>
                <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Cancel this order?</h3>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Are you sure you want to cancel this order? This action cannot be undone.
                </p>

                <div className="flex gap-3 pt-4">
                  <button onClick={() => setActiveTab(null)} className={`flex-1 py-3 rounded-xl font-bold ${darkMode ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                    Keep Order
                  </button>
                  <button onClick={handleCancelOrder} disabled={isSubmitting} className="flex-1 py-3 rounded-xl font-bold bg-red-500 text-white hover:bg-red-600 flex items-center justify-center gap-2">
                    {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : 'Yes, Cancel'}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}
