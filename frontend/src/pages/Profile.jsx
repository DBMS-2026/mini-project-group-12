import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Edit3, Grid3X3, Bookmark, UserPlus, UserCheck, Trash2, Video } from 'lucide-react'
import toast from 'react-hot-toast'
import MainLayout from '../components/layout/MainLayout'
import Avatar from '../components/common/Avatar'
import EmptyState from '../components/common/EmptyState'
import ErrorState from '../components/common/ErrorState'
import ProfileSkeleton from '../components/common/ProfileSkeleton'
import Modal from '../components/common/Modal'
import PostCard from '../components/feed/PostCard'
import EditProfileModal from '../components/profile/EditProfileModal'
import FollowListModal from '../components/profile/FollowListModal'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { getUserProfile, updateUserProfile } from '../services/userService'
import { getUserPosts, deletePost } from '../services/postService'
import { getSavedPosts } from '../services/saveService'
import { toggleFollow, getFollowStatus, getFollowers, getFollowing } from '../services/followService'

const API_BASE = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:5000'

function Profile() {
  const { username } = useParams()
  const { user: authUser, updateUser } = useAuth()
  const { darkMode } = useTheme()
  const navigate = useNavigate()

  const [profile, setProfile] = useState(null)
  const [posts, setPosts] = useState([])
  const [savedPosts, setSavedPosts] = useState([])
  const [tab, setTab] = useState('posts')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [selectedPost, setSelectedPost] = useState(null)
  const [editModal, setEditModal] = useState(false)
  const [editForm, setEditForm] = useState({ fullName: '', username: '', phone: '', bio: '' })
  const [isFollowing, setIsFollowing] = useState(false)
  const [followLoading, setFollowLoading] = useState(false)

  // Follow lists
  const [followModal, setFollowModal] = useState({ type: null, isOpen: false })
  const [followData, setFollowData] = useState([])
  const [followDataLoading, setFollowDataLoading] = useState(false)

  const isOwnProfile = !username || username === authUser?.username

  const loadProfile = useCallback(async () => {
    setLoading(true)
    setError(false)
    try {
      const targetUsername = username || authUser?.username
      if (!targetUsername) {
        setLoading(false)
        return
      }

      const profileRes = await getUserProfile(targetUsername)
      setProfile(profileRes.data?.profile)

      const postsRes = await getUserPosts(targetUsername)
      setPosts(postsRes.data?.posts || [])

      if (isOwnProfile) {
        const savedRes = await getSavedPosts()
        setSavedPosts(savedRes.data?.posts || [])
      }

      if (!isOwnProfile && profileRes.data?.profile?.id) {
        try {
          const followRes = await getFollowStatus(profileRes.data.profile.id)
          setIsFollowing(followRes.data?.following || false)
        } catch (e) {}
      }
    } catch (err) {
      console.error('Profile load failed:', err)
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [username, authUser?.username, isOwnProfile])

  useEffect(() => { loadProfile() }, [loadProfile])

  const handleFollow = async () => {
    if (!profile?.id) return
    setFollowLoading(true)
    try {
      const res = await toggleFollow(profile.id)
      setIsFollowing(res.data?.following)
      setProfile(prev => ({
        ...prev,
        followers: res.data?.followerCount ?? prev.followers,
      }))
      toast(res.data?.following ? `Following @${profile.username}` : `Unfollowed @${profile.username}`,
        { icon: res.data?.following ? '✅' : '👋' })
    } catch (err) {
      toast.error('Follow action failed')
    } finally {
      setFollowLoading(false)
    }
  }

  const handleDeletePost = async (e, postId) => {
    e.stopPropagation()
    if (!window.confirm('Are you sure you want to delete this post? This cannot be undone.')) return
    try {
      await deletePost(postId)
      setPosts(prev => prev.filter(p => p.id !== postId))
      setProfile(prev => ({ ...prev, postCount: prev.postCount - 1 }))
      toast.success('Post deleted successfully')
    } catch (err) {
      toast.error('Failed to delete post')
    }
  }

  const handleEditOpen = () => {
    setEditForm({
      fullName: profile?.fullName || '',
      username: profile?.username || '',
      phone: profile?.phone || '',
      bio: profile?.bio || '',
    })
    setEditModal(true)
  }

  const openFollowModal = async (type) => {
    if (!profile?.id) return
    setFollowModal({ type, isOpen: true })
    setFollowData([])
    setFollowDataLoading(true)
    try {
      if (type === 'followers') {
        const res = await getFollowers(profile.id)
        setFollowData(res.data?.followers || res.followers || [])
      } else {
        const res = await getFollowing(profile.id)
        setFollowData(res.data?.following || res.following || [])
      }
    } catch (err) {
      toast.error(`Failed to load ${type}`)
    } finally {
      setFollowDataLoading(false)
    }
  }

  const inputClass = `w-full px-4 py-2.5 rounded-xl text-sm outline-none border transition-all ${
    darkMode
      ? 'bg-white/5 border-white/5 text-gray-200 focus:border-orange-500/30'
      : 'bg-gray-50 border-gray-100 text-gray-800 focus:border-orange-300'
  }`

  const displayPosts = (tab === 'posts' ? posts : savedPosts).filter(Boolean)

  if (loading) {
    return (
      <MainLayout>
        <ProfileSkeleton />
      </MainLayout>
    )
  }

  if (error) {
    return (
      <MainLayout>
        <div className="max-w-3xl mx-auto">
          <ErrorState
            title="Couldn't load profile"
            description="Something went wrong. Please try again."
            onRetry={loadProfile}
          />
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto space-y-5 sm:space-y-6">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: 'spring', stiffness: 220, damping: 22 }}
          className={`rounded-3xl p-6 sm:p-8 border backdrop-blur-xl ${
            darkMode
              ? 'bg-white/[0.03] border-white/[0.05]'
              : 'bg-white/80 border-black/[0.04] shadow-[0_8px_32px_rgba(0,0,0,0.04)]'
          }`}
        >
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-6">
            <Avatar src={profile?.avatar} name={profile?.fullName} size="2xl" />

            <div className="flex-1 text-center sm:text-left min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <h1 className={`text-xl sm:text-2xl font-extrabold font-['Outfit'] ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                  {profile?.fullName}
                </h1>
                {isOwnProfile ? (
                  <motion.button whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.02 }} onClick={handleEditOpen}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      darkMode ? 'bg-white/5 text-gray-300 hover:bg-white/10' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}>
                    <Edit3 size={14} /> Edit Profile
                  </motion.button>
                ) : (
                  <motion.button whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.02 }} onClick={handleFollow} disabled={followLoading}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      isFollowing
                        ? darkMode ? 'bg-white/10 text-gray-300' : 'bg-gray-200 text-gray-700'
                        : 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-md shadow-red-500/20'
                    }`}>
                    {isFollowing ? <><UserCheck size={14} /> Following</> : <><UserPlus size={14} /> Follow</>}
                  </motion.button>
                )}
              </div>

              <p className={`text-sm mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>@{profile?.username}</p>

              {profile?.bio && (
                <p className={`text-sm mt-3 leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{profile.bio}</p>
              )}

              {/* Stats — gradient cards */}
              <div className="flex justify-center sm:justify-start gap-3 mt-6">
                {[
                  { label: 'Posts', value: profile?.postCount || posts.length, gradient: 'from-red-500/10 to-orange-500/10', action: null },
                  { label: 'Followers', value: profile?.followers || 0, gradient: 'from-blue-500/10 to-purple-500/10', action: () => openFollowModal('followers') },
                  { label: 'Following', value: profile?.following || 0, gradient: 'from-green-500/10 to-emerald-500/10', action: () => openFollowModal('following') },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    onClick={stat.action}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.1, type: 'spring', stiffness: 300 }}
                    whileHover={stat.action ? { y: -3, scale: 1.05 } : {}}
                    className={`text-center px-5 py-3 rounded-2xl ${stat.action ? 'cursor-pointer' : ''} transition-colors ${
                      darkMode
                        ? `bg-gradient-to-br ${stat.gradient} border border-white/[0.04]`
                        : `bg-gradient-to-br ${stat.gradient} border border-black/[0.03]`
                    }`}
                  >
                    <p className={`text-xl font-extrabold tabular-nums ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>{stat.value}</p>
                    <p className={`text-[11px] font-semibold tracking-wide uppercase ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2">
          <motion.button whileTap={{ scale: 0.95 }} onClick={() => setTab('posts')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              tab === 'posts'
                ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-md shadow-red-500/20'
                : darkMode ? 'bg-white/5 text-gray-400 hover:bg-white/10' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}>
            <Grid3X3 size={16} /> Posts
          </motion.button>
          {isOwnProfile && (
            <motion.button whileTap={{ scale: 0.95 }} onClick={() => setTab('saved')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                tab === 'saved'
                  ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-md shadow-red-500/20'
                  : darkMode ? 'bg-white/5 text-gray-400 hover:bg-white/10' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}>
              <Bookmark size={16} /> Saved
            </motion.button>
          )}
        </div>

        {/* Posts grid */}
        {displayPosts.length === 0 ? (
          <EmptyState icon={Grid3X3} title={tab === 'posts' ? 'No posts yet' : 'No saved posts'}
            description={tab === 'posts' ? 'Share your first food experience!' : 'Save posts you love.'} />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
            {displayPosts.map((post, i) => {
              const img = post.imageUrl?.startsWith('http') ? post.imageUrl : post.imageUrl ? `${API_BASE}${post.imageUrl}` : null
              return (
                <motion.div key={post.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.04 }}
                  whileHover={{ scale: 1.03 }}
                  onClick={() => setSelectedPost(post)}
                  className="relative rounded-2xl overflow-hidden cursor-pointer group aspect-square">
                  {img ? (
                    <img src={img} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                  ) : post.videoUrl ? (
                    <div className="w-full h-full bg-black flex items-center justify-center relative">
                      <video src={post.videoUrl.startsWith('http') ? post.videoUrl : `${API_BASE}${post.videoUrl}`} className="w-full h-full object-cover opacity-80" muted loop autoPlay playsInline />
                      <Video className="absolute top-2 right-2 text-white/80" size={18} />
                    </div>
                  ) : (
                    <div className={`w-full h-full flex items-center justify-center text-3xl ${darkMode ? 'bg-white/5' : 'bg-gray-100'}`}>🍔</div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-sm font-semibold flex items-center gap-3">
                      <span className="flex items-center gap-1">❤️ {post.likes?.length || 0}</span>
                      <span className="flex items-center gap-1">💬 {post.comments?.length || 0}</span>
                    </div>
                  </div>
                  {isOwnProfile && (
                    <button 
                      onClick={(e) => handleDeletePost(e, post.id)}
                      className="absolute top-2 left-2 p-1.5 bg-black/50 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white"
                      title="Delete post"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </motion.div>
              )
            })}
          </div>
        )}

        {/* Edit Profile Modal */}
        <Modal isOpen={editModal} onClose={() => setEditModal(false)} title="Edit Profile">
          <EditProfileModal
            user={profile}
            onClose={() => setEditModal(false)}
            onSave={async (data) => {
              try {
                const res = await updateUserProfile(data)
                if (res.data?.user) {
                  setProfile(prev => ({ ...prev, ...res.data.user }))
                  updateUser(res.data.user)
                  toast.success('Profile updated!')
                }
                setEditModal(false)
              } catch (err) {
                toast.error(err.response?.data?.message || 'Update failed')
              }
            }}
          />
        </Modal>

        {/* Followers / Following Modal */}
        <Modal 
          isOpen={followModal.isOpen} 
          onClose={() => setFollowModal({ type: null, isOpen: false })} 
          title={followModal.type === 'followers' ? 'Followers' : 'Following'}
        >
          <FollowListModal
            title={followModal.type === 'followers' ? 'Followers' : 'Following'}
            users={followData}
            loading={followDataLoading}
            currentUserId={authUser?.id}
            onClose={() => setFollowModal({ type: null, isOpen: false })}
          />
        </Modal>

        {/* View Post Modal */}
        <Modal isOpen={!!selectedPost} onClose={() => setSelectedPost(null)} title="Post Details">
          {selectedPost && (
            <div className="-mx-2 -mb-2 -mt-2">
              <PostCard post={selectedPost} />
            </div>
          )}
        </Modal>

      </div>
    </MainLayout>
  )
}

export default Profile