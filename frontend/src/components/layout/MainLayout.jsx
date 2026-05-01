import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import MobileNavbar from './MobileNavbar'
import RightSidebar from './RightSidebar'

const pageVariants = {
  initial: { opacity: 0, y: 16, scale: 0.99 },
  animate: {
    opacity: 1, y: 0, scale: 1,
    transition: { type: 'spring', stiffness: 260, damping: 24, mass: 0.8 }
  },
  exit: {
    opacity: 0, y: -12, scale: 0.99,
    transition: { duration: 0.18, ease: 'easeIn' }
  },
}

function MainLayout({ children }) {
  const { darkMode } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <div className={`min-h-screen overflow-x-clip transition-colors duration-300 ${darkMode ? 'bg-[#0f0f1a]' : 'bg-[#faf7f5]'}`}>
      {/* Desktop Sidebar — full at lg */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Medium breakpoint — icons-only sidebar */}
      <div className="hidden md:block lg:hidden">
        <Sidebar collapsed />
      </div>

      {/* Main content area */}
      <div className="md:ml-[72px] lg:ml-[280px] flex flex-col min-h-screen">
        <Navbar />

        <div className="flex flex-1">
          {/* Page transition wrapper */}
          <AnimatePresence mode="wait">
            <motion.main
              key={location.pathname}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex-1 px-3 sm:px-5 md:px-6 lg:px-8 py-4 sm:py-6 pb-24 md:pb-6 w-full min-w-0"
            >
              {children}
            </motion.main>
          </AnimatePresence>

          {/* Right sidebar - xl only */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 200, damping: 25 }}
            className="hidden xl:block w-[300px] shrink-0 p-6 pt-2"
          >
            <RightSidebar />
          </motion.div>
        </div>
      </div>

      {/* Floating Upload Button (FAB) — pulse + expand */}
      <motion.button
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.5 }}
        whileHover={{ scale: 1.15, rotate: 90, boxShadow: '0 0 30px rgba(239,68,68,0.5)' }}
        whileTap={{ scale: 0.85, rotate: 45 }}
        onClick={() => navigate('/upload')}
        className="fixed bottom-24 md:bottom-8 right-4 sm:right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-xl shadow-red-500/25 flex items-center justify-center fab-pulse"
        style={{ display: location.pathname === '/upload' ? 'none' : 'flex' }}
      >
        <Plus size={26} strokeWidth={2.5} />
      </motion.button>

      {/* Mobile bottom nav — visible below md */}
      <div className="md:hidden">
        <MobileNavbar />
      </div>
    </div>
  )
}

export default MainLayout