import { motion, AnimatePresence } from 'framer-motion'
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, MapPin } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { useTheme } from '../../context/ThemeContext'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import api from '../../services/api'
import { useState, useEffect } from 'react'

export default function CartDrawer() {
  const { isCartOpen, setIsCartOpen, cartItems, cartTotal, updateQuantity, removeFromCart, clearCart, restaurantId } = useCart()
  const { darkMode } = useTheme()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('razorpay')
  const [deliveryAddress, setDeliveryAddress] = useState(user?.address || '')

  useEffect(() => {
    if (user?.address && !deliveryAddress) {
      setDeliveryAddress(user.address)
    }
  }, [user])

  const handleCheckout = async () => {
    if (!user) {
      toast.error('Please login to place an order')
      setIsCartOpen(false)
      navigate('/login')
      return
    }

    if (cartItems.length === 0) return

    if (!deliveryAddress.trim()) {
      toast.error('Please enter a delivery address')
      return
    }

    setIsProcessing(true)
    try {
      // 1. Create order on backend
      const res = await api.post('/orders/create', {
        restaurantId,
        items: cartItems,
        totalAmount: cartTotal,
        paymentMethod,
        deliveryAddress
      })

      const { order, razorpayOrderId, keyId } = res.data.data

      if (paymentMethod === 'cod') {
        toast.success('Order placed successfully via Cash on Delivery!')
        clearCart()
        setIsCartOpen(false)
        window.location.href = '/home'
        return
      }

      // Mock Razorpay SDK if no real keys
      if (keyId === 'rzp_test_YOUR_KEY_ID' || !keyId) {
        setTimeout(async () => {
          try {
            await api.post('/orders/verify', {
              orderId: order.id,
              razorpayPaymentId: 'mock_payment_123',
              razorpayOrderId: razorpayOrderId,
              razorpaySignature: 'mock_signature'
            })
            toast.success('Payment successful! Order placed.')
            clearCart()
            setIsCartOpen(false)
            window.location.href = '/home'
          } catch (err) {
            toast.error('Payment verification failed.')
          }
        }, 1500)
        return
      }

      // 2. Load Razorpay SDK
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onerror = () => {
        toast.error('Razorpay SDK failed to load. Are you online?')
        setIsProcessing(false)
      }
      script.onload = () => {
        const options = {
          key: keyId,
          amount: order.totalAmount * 100, // paise
          currency: 'INR',
          name: 'Crave Food',
          description: `Order from ${cartItems[0].restaurantName}`,
          order_id: razorpayOrderId,
          handler: async function (response) {
            try {
              // Verify payment
              await api.post('/orders/verify', {
                orderId: order.id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                razorpaySignature: response.razorpay_signature
              })
              toast.success('Payment successful! Order placed.')
              clearCart()
              setIsCartOpen(false)
              window.location.href = '/home'
            } catch (err) {
              toast.error('Payment verification failed.')
            }
          },
          prefill: {
            name: user.fullName,
            email: user.email,
            contact: user.phone || ''
          },
          theme: {
            color: '#f97316' // orange-500
          }
        }
        const rzp = new window.Razorpay(options)
        rzp.on('payment.failed', function (response) {
          toast.error('Payment failed: ' + response.error.description)
        })
        rzp.open()
        setIsProcessing(false)
      }
      document.body.appendChild(script)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to initialize checkout')
      setIsProcessing(false)
    }
  }

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={`fixed top-0 right-0 h-full w-full sm:w-[400px] z-[101] shadow-2xl flex flex-col ${
              darkMode ? 'bg-gray-900 border-l border-white/10' : 'bg-white border-l border-gray-200'
            }`}
          >
            {/* Header */}
            <div className={`p-5 flex items-center justify-between border-b ${darkMode ? 'border-white/10' : 'border-gray-100'}`}>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${darkMode ? 'bg-white/5 text-orange-400' : 'bg-orange-50 text-orange-500'}`}>
                  <ShoppingBag size={20} />
                </div>
                <h2 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>Your Cart</h2>
              </div>
              <button 
                onClick={() => setIsCartOpen(false)}
                className={`p-2 rounded-full transition-colors ${darkMode ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-70">
                  <ShoppingBag size={48} className={darkMode ? 'text-gray-600' : 'text-gray-300'} />
                  <div>
                    <p className={`font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Your cart is empty</p>
                    <p className={`text-sm mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Looks like you haven't added anything yet.</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className={`text-sm font-semibold mb-4 pb-2 border-b ${darkMode ? 'text-orange-400 border-white/10' : 'text-orange-600 border-gray-100'}`}>
                    Order from: {cartItems[0].restaurantName}
                  </div>
                  
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex gap-4">
                        <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <h3 className={`font-semibold text-sm truncate pr-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                              {item.name}
                            </h3>
                            <button 
                              onClick={() => removeFromCart(item.id)}
                              className="text-red-500 hover:bg-red-50 p-1 rounded transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                          <p className={`text-xs mt-0.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            ₹{item.price}
                          </p>
                          
                          <div className="flex items-center justify-between mt-2">
                            <p className={`font-bold text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              ₹{(item.price * item.quantity).toFixed(2)}
                            </p>
                            
                            <div className={`flex items-center gap-3 px-2 py-1 rounded-lg border ${
                              darkMode ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-gray-50'
                            }`}>
                              <button 
                                onClick={() => updateQuantity(item.id, -1)}
                                className={`p-0.5 rounded hover:bg-black/5 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}
                              >
                                <Minus size={14} />
                              </button>
                              <span className={`text-sm font-semibold w-4 text-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                {item.quantity}
                              </span>
                              <button 
                                onClick={() => updateQuantity(item.id, 1)}
                                className={`p-0.5 rounded hover:bg-black/5 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer / Checkout */}
            {cartItems.length > 0 && (
              <div className={`p-5 border-t ${darkMode ? 'border-white/10 bg-gray-900/90' : 'border-gray-100 bg-white/90'} backdrop-blur-md`}>
                
                {/* Delivery Address */}
                <div className="mb-4">
                  <h3 className={`text-sm font-semibold mb-2 flex items-center gap-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <MapPin size={14} /> Delivery Address
                  </h3>
                  <textarea
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="Enter your full address..."
                    rows={2}
                    className={`w-full px-3 py-2.5 rounded-xl text-sm outline-none border transition-all resize-none ${
                      darkMode 
                        ? 'bg-white/5 border-white/10 text-gray-200 focus:border-orange-500/50' 
                        : 'bg-white border-gray-200 text-gray-800 focus:border-orange-400'
                    }`}
                  />
                </div>

                {/* Payment Method Selector */}
                <div className="mb-5">
                  <h3 className={`text-sm font-semibold mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Payment Method</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <label className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === 'razorpay'
                        ? (darkMode ? 'bg-orange-500/20 border-orange-500' : 'bg-orange-50 border-orange-500')
                        : (darkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200')
                    }`}>
                      <input 
                        type="radio" 
                        name="payment" 
                        value="razorpay" 
                        checked={paymentMethod === 'razorpay'} 
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="hidden" 
                      />
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        paymentMethod === 'razorpay' ? 'border-orange-500' : 'border-gray-400'
                      }`}>
                        {paymentMethod === 'razorpay' && <div className="w-2 h-2 rounded-full bg-orange-500" />}
                      </div>
                      <span className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Pay Online</span>
                    </label>

                    <label className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === 'cod'
                        ? (darkMode ? 'bg-orange-500/20 border-orange-500' : 'bg-orange-50 border-orange-500')
                        : (darkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200')
                    }`}>
                      <input 
                        type="radio" 
                        name="payment" 
                        value="cod" 
                        checked={paymentMethod === 'cod'} 
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="hidden" 
                      />
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        paymentMethod === 'cod' ? 'border-orange-500' : 'border-gray-400'
                      }`}>
                        {paymentMethod === 'cod' && <div className="w-2 h-2 rounded-full bg-orange-500" />}
                      </div>
                      <span className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Pay on Delivery</span>
                    </label>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <span className={`font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Amount</span>
                  <span className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>₹{cartTotal.toFixed(2)}</span>
                </div>
                
                <button
                  onClick={handleCheckout}
                  disabled={isProcessing}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-3.5 px-4 rounded-xl hover:shadow-lg hover:shadow-orange-500/25 active:scale-[0.98] transition-all disabled:opacity-70 disabled:pointer-events-none"
                >
                  {isProcessing ? 'Processing...' : 'Place Order'}
                  {!isProcessing && <ArrowRight size={18} />}
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
