import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import PageLoader from '../components/common/PageLoader'
import ProtectedRoute from '../components/common/ProtectedRoute'

// Lazy-loaded pages for code-splitting
const Login = lazy(() => import('../pages/Login'))
const Signup = lazy(() => import('../pages/Signup'))
const ForgotPassword = lazy(() => import('../pages/ForgotPassword'))
const ResetPassword = lazy(() => import('../pages/ResetPassword'))
const Home = lazy(() => import('../pages/Home'))
const Reels = lazy(() => import('../pages/Reels'))
const Upload = lazy(() => import('../pages/Upload'))
const Profile = lazy(() => import('../pages/Profile'))
const Restaurant = lazy(() => import('../pages/Restaurant'))
const Saved = lazy(() => import('../pages/Saved'))
const Search = lazy(() => import('../pages/Search'))
const Notifications = lazy(() => import('../pages/Notifications'))
const Settings = lazy(() => import('../pages/Settings'))
const NotFound = lazy(() => import('../pages/NotFound'))
const OrderTracking = lazy(() => import('../pages/OrderTracking'))
const Orders = lazy(() => import('../pages/Orders'))
import CartDrawer from '../components/layout/CartDrawer'
import VoiceAssistant from '../components/common/VoiceAssistant'

function AppRoutes() {
  const location = useLocation()

  return (
    <>
      <AnimatePresence mode="wait">
        <Suspense fallback={<PageLoader />} key={location.pathname}>
          <Routes location={location} key={location.pathname}>
            {/* Public Routes */}
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />

            {/* Protected Routes */}
            <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/reels" element={<ProtectedRoute><Reels /></ProtectedRoute>} />
            <Route path="/upload" element={<ProtectedRoute><Upload /></ProtectedRoute>} />
            <Route path="/saved" element={<ProtectedRoute><Saved /></ProtectedRoute>} />
            <Route path="/search" element={<ProtectedRoute><Search /></ProtectedRoute>} />
            <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/profile/:username" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

            <Route path="/restaurant" element={<ProtectedRoute><Restaurant /></ProtectedRoute>} />
            <Route path="/restaurant/:restaurantName" element={<ProtectedRoute><Restaurant /></ProtectedRoute>} />
            <Route path="/order-tracking/:id" element={<ProtectedRoute><OrderTracking /></ProtectedRoute>} />
            <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />

            <Route path="/uploads" element={<Navigate to="/upload" />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </AnimatePresence>
      <CartDrawer />
      <VoiceAssistant />
    </>
  )
}

export default AppRoutes