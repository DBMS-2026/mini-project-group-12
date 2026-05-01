import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Heart, MessageCircle, Bookmark, Share2, MapPin,
  Play, Pause, Volume2, VolumeX, ArrowLeft, Loader2, Store, ChevronRight
} from 'lucide-react'
import toast from 'react-hot-toast'
import Avatar from '../components/common/Avatar'
import DoubleTapHeart from '../components/feed/DoubleTapHeart'
import ReelCommentDrawer from '../components/reels/ReelCommentDrawer'
import { useTheme } from '../context/ThemeContext'
import { usePosts } from '../context/PostContext'
import { getReels } from '../services/reelService'
import { getPosts } from '../services/postService'
import { toggleFollow, getFollowStatus } from '../services/followService'
import { useAuth } from '../context/AuthContext'

const API_BASE = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:5000'

/* ================================================================
   MAIN REELS PAGE — Fullscreen, no MainLayout
   ================================================================ */
function Reels() {
  const { darkMode } = useTheme()
  const { toggleLike, toggleSave } = usePosts()
  const navigate = useNavigate()
  const containerRef = useRef(null)

  const [reels, setReels] = useState([])
  const [baseReels, setBaseReels] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [globalMuted, setGlobalMuted] = useState(true)

  const loadReels = useCallback(async () => {
    setLoading(true)
    setError(false)
    try {
      const res = await getReels(1, 20)
      let items = res.data?.reels || []
      if (items.length === 0) {
        const postsRes = await getPosts(1, 20)
        items = postsRes.data?.posts || []
      }
      setBaseReels(items)
      setReels(items.map((r, i) => ({ ...r, _loopId: r.id + '-init-' + i })))
    } catch (err) {
      console.error(err)
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadReels() }, [loadReels])

  // Track which reel is active via scroll position and handle infinite loop
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleScroll = () => {
      const scrollTop = container.scrollTop
      const height = container.clientHeight
      const index = Math.round(scrollTop / height)
      setActiveIndex(index)

      // Infinite loop append if we're near the end
      if (baseReels.length > 0 && index >= reels.length - 3) {
        setReels(prev => [
          ...prev,
          ...baseReels.map((r, i) => ({ ...r, _loopId: r.id + '-' + Date.now() + i }))
        ])
      }
    }

    container.addEventListener('scroll', handleScroll, { passive: true })
    return () => container.removeEventListener('scroll', handleScroll)
  }, [reels, baseReels])

  return (
    <div className={`fixed inset-0 z-[60] ${darkMode ? 'bg-black' : 'bg-black'}`}>
      {/* Top bar — floating over reels */}
      <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-4 pt-4 pb-8 bg-gradient-to-b from-black/50 to-transparent safe-area-pt">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white"
        >
          <ArrowLeft size={20} />
        </motion.button>

        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-white text-lg font-bold font-['Outfit']"
        >
          Reels
        </motion.h1>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setGlobalMuted(!globalMuted)}
          className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white"
        >
          {globalMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </motion.button>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="relative w-16 h-16 mx-auto mb-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-red-500 border-r-orange-500"
              />
              <div className="absolute inset-0 flex items-center justify-center text-2xl">🎬</div>
            </div>
            <p className="text-white/60 text-sm">Loading reels...</p>
          </motion.div>
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="text-center px-8">
            <p className="text-white text-lg font-bold mb-2">Couldn't load reels</p>
            <p className="text-white/50 text-sm mb-4">Something went wrong.</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={loadReels}
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-red-500 to-orange-500 text-white text-sm font-bold"
            >
              Try Again
            </motion.button>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && reels.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="text-center px-8">
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-5xl mb-4"
            >
              🎥
            </motion.div>
            <p className="text-white text-lg font-bold mb-1">No reels yet</p>
            <p className="text-white/50 text-sm mb-4">Be the first to upload a food reel!</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/upload')}
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-red-500 to-orange-500 text-white text-sm font-bold"
            >
              Upload Reel
            </motion.button>
          </div>
        </div>
      )}

      {/* Reels container — snap scroll */}
      {!loading && !error && reels.length > 0 && (
        <div
          ref={containerRef}
          className="h-full w-full overflow-y-scroll snap-y snap-mandatory hide-scrollbar"
          style={{ scrollSnapType: 'y mandatory' }}
        >
          {reels.map((reel, index) => (
            <ReelItem
              key={reel._loopId || reel.id}
              reel={reel}
              index={index}
              isActive={index === activeIndex}
              muted={globalMuted}
              toggleLike={toggleLike}
              toggleSave={toggleSave}
            />
          ))}
        </div>
      )}

      {/* Reel progress dots */}
      {!loading && reels.length > 1 && (
        <div className="absolute right-2 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-1">
          {reels.slice(0, Math.min(reels.length, 8)).map((_, i) => (
            <motion.div
              key={i}
              animate={{
                height: i === activeIndex ? 16 : 4,
                opacity: i === activeIndex ? 1 : 0.3,
              }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className="w-1 rounded-full bg-white"
            />
          ))}
        </div>
      )}
    </div>
  )
}

/* ================================================================
   SINGLE REEL ITEM — Full viewport height
   ================================================================ */
function ReelItem({ reel, index, isActive, muted, toggleLike, toggleSave }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const videoRef = useRef(null)
  const [liked, setLiked] = useState(reel._liked || false)
  const [saved, setSaved] = useState(reel._saved || false)
  const [likeCount, setLikeCount] = useState(reel._likeCount ?? reel.likes?.length ?? 0)
  const [showHeart, setShowHeart] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showPauseIcon, setShowPauseIcon] = useState(false)
  const [videoLoaded, setVideoLoaded] = useState(false)
  const [showCaption, setShowCaption] = useState(false)
  const [isFollowing, setIsFollowing] = useState(false)
  const [followLoading, setFollowLoading] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [commentCount, setCommentCount] = useState(reel.comments?.length || 0)

  // Fetch initial follow status
  useEffect(() => {
    if (reel.user?.id && user?.id && reel.user.id !== user.id) {
      getFollowStatus(reel.user.id)
        .then(res => setIsFollowing(res.data?.following || res.following || false))
        .catch(() => {})
    }
  }, [reel.user?.id, user?.id])

  const handleFollowClick = async (e) => {
    e.stopPropagation()
    if (!reel.user?.id || followLoading) return
    setFollowLoading(true)
    try {
      const res = await toggleFollow(reel.user.id)
      setIsFollowing(res.data?.following || res.following || false)
    } catch (err) {
      console.error(err)
    } finally {
      setFollowLoading(false)
    }
  }

  const videoUrl = reel.videoUrl?.startsWith('http') ? reel.videoUrl : reel.videoUrl ? `${API_BASE}${reel.videoUrl}` : null
  const imageUrl = reel.imageUrl?.startsWith('http') ? reel.imageUrl : reel.imageUrl ? `${API_BASE}${reel.imageUrl}` : null

  // Auto-play/pause based on visibility
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    if (isActive) {
      const playPromise = video.play()
      if (playPromise !== undefined) {
        playPromise.then(() => {
          setIsPlaying(true)
        }).catch(() => {
          setIsPlaying(false)
        })
      } else {
        setIsPlaying(true)
      }
    } else {
      video.pause()
      video.currentTime = 0
      setIsPlaying(false)
    }
  }, [isActive])

  // Sync mute
  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = muted
  }, [muted])

  // Double-tap to like
  const handleDoubleTap = useCallback(async () => {
    setShowHeart(true)
    if (!liked) {
      setLiked(true)
      setLikeCount(prev => prev + 1)
    }
    setTimeout(() => setShowHeart(false), 800)
    try {
      const result = await toggleLike(reel.id)
      if (result) {
        setLiked(result.liked)
        setLikeCount(result.likeCount)
      }
    } catch (e) {}
  }, [reel.id, toggleLike, liked])

  // Tap to play/pause
  const handleTap = useCallback(() => {
    const video = videoRef.current
    if (!video) return

    if (isPlaying) {
      video.pause()
      setIsPlaying(false)
      setShowPauseIcon(true)
      setTimeout(() => setShowPauseIcon(false), 1000)
    } else {
      video.play().catch(() => {})
      setIsPlaying(true)
      setShowPauseIcon(true)
      setTimeout(() => setShowPauseIcon(false), 600)
    }
  }, [isPlaying])

  const handleLike = async (e) => {
    e.stopPropagation()
    const newLiked = !liked
    setLiked(newLiked)
    setLikeCount(prev => newLiked ? prev + 1 : prev - 1)
    try {
      const result = await toggleLike(reel.id)
      if (result) { setLiked(result.liked); setLikeCount(result.likeCount) }
    } catch (e) {
      setLiked(!newLiked)
      setLikeCount(prev => newLiked ? prev - 1 : prev + 1)
    }
  }

  const handleSave = async (e) => {
    e.stopPropagation()
    const newSaved = !saved
    setSaved(newSaved)
    try {
      const result = await toggleSave(reel.id)
      if (result) setSaved(result.saved)
      toast(newSaved ? '🔖 Saved!' : 'Unsaved', { icon: newSaved ? '✅' : '📌' })
    } catch (e) { setSaved(!newSaved) }
  }

  const handleShare = (e) => {
    e.stopPropagation()
    navigator.clipboard?.writeText(window.location.origin + '/reels#' + reel.id)
    toast.success('Link copied!')
  }

  return (
    <div
      className="relative w-full h-screen snap-start snap-always flex items-center justify-center overflow-hidden"
      onDoubleClick={handleDoubleTap}
      onClick={handleTap}
    >
      {/* Video / Image */}
      {videoUrl ? (
        <>
          {/* Video loading skeleton */}
          {!videoLoaded && (
            <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
              <Loader2 size={32} className="text-white/30 animate-spin" />
            </div>
          )}
          <motion.video
            ref={videoRef}
            src={videoUrl}
            className="absolute inset-0 w-full h-full object-cover"
            muted={muted}
            loop
            playsInline
            preload="auto"
            onLoadedData={() => setVideoLoaded(true)}
            // Subtle zoom on active
            animate={isActive ? { scale: 1.02 } : { scale: 1 }}
            transition={{ duration: 6, ease: 'easeInOut' }}
          />
        </>
      ) : imageUrl ? (
        <motion.img
          src={imageUrl}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          animate={isActive ? { scale: [1, 1.05, 1] } : { scale: 1 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-red-600 to-orange-500 flex items-center justify-center text-7xl">
          🍔
        </div>
      )}

      {/* Gradient overlays — top + bottom for readability */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      </div>

      {/* Double-tap heart */}
      <DoubleTapHeart show={showHeart} />

      {/* Top Restaurant Pill */}
      {reel.restaurant && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : -20 }}
          transition={{ delay: 0.2 }}
          className="absolute top-20 left-4 z-30 pointer-events-auto"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => { e.stopPropagation(); navigate(`/restaurant/${encodeURIComponent(reel.restaurant)}`) }}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white shadow-lg"
          >
            <Store size={16} className="text-orange-400" />
            <span className="text-sm font-bold tracking-wide">{reel.restaurant}</span>
            <ChevronRight size={16} className="text-white/50" />
          </motion.button>
        </motion.div>
      )}

      {/* Play/Pause indicator */}
      <AnimatePresence>
        {showPauseIcon && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.5 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
          >
            <div className="w-20 h-20 rounded-full bg-black/30 backdrop-blur-xl flex items-center justify-center ring-2 ring-white/20">
              {isPlaying ? (
                <Pause size={32} fill="white" className="text-white" />
              ) : (
                <Play size={32} fill="white" className="text-white ml-1" />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Right side action buttons */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
        className="absolute right-3 bottom-28 sm:bottom-32 flex flex-col items-center gap-5 z-20"
      >
        {/* Like */}
        <ActionButton
          icon={Heart}
          label={likeCount}
          active={liked}
          activeColor="bg-red-500 shadow-red-500/40"
          onClick={handleLike}
          activeAnimation={{ scale: [1, 1.5, 0.9, 1.15, 1] }}
        />

        {/* Comment */}
        <ActionButton
          icon={MessageCircle}
          label={commentCount}
          onClick={(e) => { e.stopPropagation(); setShowComments(true) }}
        />

        {/* Save */}
        <ActionButton
          icon={Bookmark}
          active={saved}
          activeColor="bg-orange-500 shadow-orange-500/40"
          onClick={handleSave}
          activeAnimation={{ scale: [1, 1.4, 0.9, 1.1, 1], rotate: [0, -10, 10, 0] }}
        />

        {/* Share */}
        <ActionButton
          icon={Share2}
          onClick={handleShare}
        />

        {/* Map */}
        {reel.restaurant && (
          <ActionButton
            icon={MapPin}
            onClick={(e) => {
              e.stopPropagation()
              window.open(
                reel.mapLink || `https://maps.google.com/?q=${encodeURIComponent(reel.restaurant)}`,
                '_blank'
              )
            }}
          />
        )}
      </motion.div>

      {/* Bottom info — username, caption, restaurant */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, type: 'spring' }}
        className="absolute bottom-6 left-4 right-20 z-20 safe-area-pb"
      >
        {/* User row */}
        <div className="flex items-center gap-2.5 mb-2.5">
          <motion.div 
            whileTap={{ scale: 0.9 }} 
            onClick={(e) => { e.stopPropagation(); navigate(`/profile/${reel.user?.username}`) }}
            className="cursor-pointer"
          >
            <Avatar src={reel.user?.avatar} name={reel.user?.fullName} size="sm" />
          </motion.div>
          <div className="flex items-center gap-2">
            <span 
              onClick={(e) => { e.stopPropagation(); navigate(`/profile/${reel.user?.username}`) }}
              className="text-white text-sm font-bold cursor-pointer hover:underline"
            >
              @{reel.user?.username || 'foodie'}
            </span>
            {(!user || user.id !== reel.user?.id) && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleFollowClick}
                disabled={followLoading}
                className={`px-3 py-1 rounded-lg backdrop-blur-sm text-xs font-semibold border ${
                  isFollowing
                    ? 'bg-white/20 text-white border-white/20'
                    : 'bg-white/15 text-white border-white/10'
                }`}
              >
                {followLoading ? '...' : isFollowing ? 'Following' : 'Follow'}
              </motion.button>
            )}
          </div>
        </div>

        {/* Caption — tap to expand */}
        {reel.caption && (
          <motion.div onClick={(e) => { e.stopPropagation(); setShowCaption(!showCaption) }}>
            <p className={`text-white/90 text-[13px] leading-relaxed ${showCaption ? '' : 'line-clamp-2'}`}>
              {reel.caption}
            </p>
            {reel.caption.length > 80 && (
              <span className="text-white/50 text-xs mt-0.5 inline-block">
                {showCaption ? 'less' : '...more'}
              </span>
            )}
          </motion.div>
        )}

        {/* Restaurant tag */}
        {reel.restaurant && (
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={(e) => { e.stopPropagation(); navigate(`/restaurant/${encodeURIComponent(reel.restaurant)}`) }}
            className="inline-flex items-center gap-1.5 mt-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-orange-300 text-xs font-medium border border-white/10"
          >
            <MapPin size={12} />
            {reel.restaurant}
          </motion.button>
        )}

        {/* Scrolling music bar (decorative) */}
        <div className="flex items-center gap-2 mt-3 overflow-hidden">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            className="w-6 h-6 rounded-full bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center text-[10px] shrink-0"
          >
            🎵
          </motion.div>
          <div className="overflow-hidden flex-1">
            <motion.p
              animate={{ x: [200, -300] }}
              transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
              className="text-white/50 text-xs whitespace-nowrap"
            >
              Original Audio — @{reel.user?.username || 'foodie'} • Crave Food
            </motion.p>
          </div>
        </div>
      </motion.div>

      {/* Comment Drawer */}
      <ReelCommentDrawer
        postId={reel.id}
        open={showComments}
        onClose={() => setShowComments(false)}
        commentCount={commentCount}
        onCommentCountChange={setCommentCount}
      />
    </div>
  )
}

/* ================================================================
   ACTION BUTTON — Reusable for the right-side panel
   ================================================================ */
function ActionButton({ icon: Icon, label, active, activeColor, onClick, activeAnimation }) {
  return (
    <motion.button
      whileTap={{ scale: 0.75 }}
      onClick={onClick}
      className="flex flex-col items-center gap-1"
    >
      <motion.div
        animate={active && activeAnimation ? activeAnimation : {}}
        transition={{ type: 'spring', stiffness: 400, damping: 15 }}
        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
          active
            ? `${activeColor} shadow-lg`
            : 'bg-white/10 backdrop-blur-md hover:bg-white/20'
        }`}
      >
        <Icon
          size={22}
          fill={active ? 'white' : 'none'}
          className="text-white"
          strokeWidth={active ? 0 : 2}
        />
      </motion.div>
      {label !== undefined && (
        <motion.span
          key={label}
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className="text-white text-[11px] font-semibold"
        >
          {label}
        </motion.span>
      )}
    </motion.button>
  )
}

export default Reels