import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, MicOff, Loader2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import { useCart } from '../../context/CartContext'
import toast from 'react-hot-toast'

export default function VoiceAssistant() {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [recognition, setRecognition] = useState(null)
  const [showTranscript, setShowTranscript] = useState(false)
  
  const navigate = useNavigate()
  const { darkMode, toggleTheme } = useTheme()
  const { setIsCartOpen } = useCart()
  const handleCommandRef = useRef(null)

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (SpeechRecognition) {
      const rec = new SpeechRecognition()
      rec.continuous = false
      rec.interimResults = false
      rec.lang = 'en-US'

      rec.onstart = () => {
        setIsListening(true)
        setShowTranscript(true)
        setTranscript('Listening...')
      }

      rec.onresult = (event) => {
        const text = event.results[0][0].transcript
        setTranscript(text)
        if (handleCommandRef.current) handleCommandRef.current(text.toLowerCase())
        setTimeout(() => setShowTranscript(false), 3000)
      }

      rec.onerror = (event) => {
        console.error('Speech recognition error', event.error)
        setIsListening(false)
        setTranscript('Error listening')
        setTimeout(() => setShowTranscript(false), 2000)
        if (event.error !== 'no-speech') {
          toast.error('Voice Assistant Error: ' + event.error)
        }
      }

      rec.onend = () => {
        setIsListening(false)
      }

      setRecognition(rec)
    } else {
      console.warn('Speech Recognition API not supported in this browser.')
    }
  }, [])

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel() // stop any current speech
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.pitch = 1.1
      utterance.rate = 1.0
      window.speechSynthesis.speak(utterance)
    }
  }

  const handleCommand = useCallback((cmd) => {
    let handled = false

    if (cmd.includes('home')) {
      speak('Going to home page')
      navigate('/home')
      handled = true
    } else if (cmd.includes('profile')) {
      speak('Opening your profile')
      navigate('/profile')
      handled = true
    } else if (cmd.includes('search')) {
      const match = cmd.match(/search\s+(?:for\s+)?(.+)/)
      const query = match ? match[1] : ''
      speak(`Searching for ${query || 'restaurants'}`)
      navigate(query ? `/search?q=${encodeURIComponent(query)}` : '/search')
      handled = true
    } else if (cmd.includes('restaurant') || cmd.includes('food')) {
      speak('Showing restaurants')
      navigate('/restaurant')
      handled = true
    } else if (cmd.includes('reel') || cmd.includes('video')) {
      speak('Playing reels')
      navigate('/reels')
      handled = true
    } else if (cmd.includes('upload') || cmd.includes('post')) {
      speak('Opening upload page')
      navigate('/upload')
      handled = true
    } else if (cmd.includes('cart') || cmd.includes('checkout')) {
      speak('Opening your cart')
      setIsCartOpen(true)
      handled = true
    } else if (cmd.includes('dark mode') || cmd.includes('light mode') || cmd.includes('theme')) {
      speak('Toggling theme')
      toggleTheme()
      handled = true
    } else if (cmd.includes('order')) {
      speak('Opening your orders')
      navigate('/orders')
      handled = true
    } else if (cmd.includes('saved') || cmd.includes('bookmark')) {
      speak('Opening saved posts')
      navigate('/saved')
      handled = true
    } else if (cmd.includes('notification')) {
      speak('Opening notifications')
      navigate('/notifications')
      handled = true
    }

    if (!handled) {
      speak("I didn't catch that command. Try saying home, profile, search, reels, restaurant, or dark mode.")
    }
  }, [navigate, toggleTheme, setIsCartOpen])

  // Keep the ref always pointing to the latest handleCommand
  useEffect(() => {
    handleCommandRef.current = handleCommand
  }, [handleCommand])

  const toggleListening = () => {
    if (!recognition) {
      toast.error('Voice Assistant not supported in this browser.')
      return
    }
    
    if (isListening) {
      recognition.stop()
      setIsListening(false)
    } else {
      try {
        recognition.start()
      } catch (e) {
        console.error(e)
      }
    }
  }

  return (
    <div className="fixed bottom-24 md:bottom-8 left-4 sm:left-6 z-50 flex flex-col items-start gap-2">
      <AnimatePresence>
        {showTranscript && (
          <motion.div
            initial={{ opacity: 0, x: -20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className={`px-4 py-2.5 rounded-2xl shadow-xl backdrop-blur-xl border ${
              darkMode 
                ? 'bg-[#1a1a2e]/90 border-white/10 text-white' 
                : 'bg-white/90 border-gray-200 text-gray-800'
            }`}
          >
            <p className="text-sm font-semibold max-w-[200px] truncate">
              {isListening && transcript === 'Listening...' ? (
                <span className="flex items-center gap-2">
                  <Loader2 size={14} className="animate-spin text-blue-500" />
                  Listening...
                </span>
              ) : (
                <span className="italic">"{transcript}"</span>
              )}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1, boxShadow: '0 0 25px rgba(59, 130, 246, 0.5)' }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleListening}
        className={`relative w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-colors ${
          isListening 
            ? 'bg-blue-500 text-white shadow-blue-500/30' 
            : darkMode ? 'bg-gray-800 text-blue-400 border border-white/10' : 'bg-white text-blue-500 border border-gray-100'
        }`}
      >
        {isListening && (
          <motion.div
            animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 rounded-full bg-blue-500"
          />
        )}
        {isListening ? <Mic size={24} /> : <MicOff size={24} />}
      </motion.button>
    </div>
  )
}
