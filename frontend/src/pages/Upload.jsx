import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { UploadCloud, Image, Film, X, MapPin, Store, Type, Loader2, CheckCircle2 } from 'lucide-react'
import toast from 'react-hot-toast'
import MainLayout from '../components/layout/MainLayout'
import { useTheme } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'
import { usePosts } from '../context/PostContext'
import { uploadImage, uploadVideo } from '../services/uploadService'
import { createPost } from '../services/postService'

function Upload() {
  const { darkMode } = useTheme()
  const { user } = useAuth()
  const { addPost } = usePosts()
  const navigate = useNavigate()

  const [form, setForm] = useState({ caption: '', restaurant: '', mapLink: '', type: 'post' })
  const [imageFile, setImageFile] = useState(null)
  const [videoFile, setVideoFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [videoPreview, setVideoPreview] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [success, setSuccess] = useState(false)
  const imageRef = useRef()
  const videoRef = useRef()

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleVideoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setVideoFile(file)
      setVideoPreview(URL.createObjectURL(file))
      setForm(prev => ({ ...prev, type: 'reel' }))
    }
  }

  const handleSubmit = async () => {
    if (!imageFile && !videoFile) return
    setUploading(true)

    try {
      let imageUrl = null
      let videoUrl = null

      if (imageFile) {
        const res = await uploadImage(imageFile)
        imageUrl = res.data?.url
      }
      if (videoFile) {
        const res = await uploadVideo(videoFile)
        videoUrl = res.data?.url
      }

      const postData = {
        caption: form.caption,
        imageUrl,
        videoUrl,
        restaurant: form.restaurant || null,
        mapLink: form.mapLink || null,
        type: form.type,
      }

      const res = await createPost(postData)
      if (res.data?.post) addPost(res.data.post)

      setSuccess(true)
      toast.success('Post uploaded! 🎉')
      setTimeout(() => navigate('/home'), 1500)
    } catch (err) {
      console.error('Upload failed:', err)
      toast.error('Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const inputClass = `w-full px-4 py-3 rounded-2xl text-sm outline-none border transition-all duration-200 ${
    darkMode
      ? 'bg-white/5 border-white/5 text-gray-200 placeholder:text-gray-600 focus:border-orange-500/30'
      : 'bg-gray-50 border-gray-100 text-gray-800 placeholder:text-gray-400 focus:border-orange-300'
  }`

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20, filter: 'blur(4px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        >
          <h1 className={`text-2xl sm:text-3xl font-extrabold font-['Outfit'] mb-1 ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
            Upload Post
          </h1>
          <motion.p
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className={`text-sm mb-6 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}
          >
            Share your food experience with the world 📸
          </motion.p>
        </motion.div>

        <AnimatePresence mode="wait">
          {success ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, filter: 'blur(6px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="flex flex-col items-center justify-center py-20"
            >
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: [0, 1.3, 1], rotate: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15, duration: 0.6 }}
              >
                <CheckCircle2 size={64} className="text-green-500 mb-4" />
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, type: 'spring' }}
                className={`text-xl font-bold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}
              >
                Post uploaded! 🎉
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className={`text-sm mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}
              >
                Redirecting to feed...
              </motion.p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 22 }}
              className={`rounded-3xl p-6 border space-y-5 backdrop-blur-xl ${
                darkMode ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white/70 border-black/5'
              }`}
            >
              {/* Type toggle */}
              <div className="flex gap-2">
                {['post', 'reel'].map(t => (
                  <motion.button
                    key={t}
                    whileHover={{ scale: 1.05, y: -1 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                    onClick={() => setForm(prev => ({ ...prev, type: t }))}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize transition-all ${
                      form.type === t
                        ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-md shadow-red-500/20'
                        : darkMode
                          ? 'bg-white/5 text-gray-400 hover:bg-white/10'
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}
                  >
                    {t === 'post' ? '📸 Photo Post' : '🎬 Video Reel'}
                  </motion.button>
                ))}
              </div>

              {/* Caption */}
              <div>
                <label className={`flex items-center gap-2 text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <Type size={16} /> Caption
                </label>
                <textarea
                  value={form.caption}
                  onChange={(e) => setForm(prev => ({ ...prev, caption: e.target.value }))}
                  placeholder="Write something about your food..."
                  rows={3}
                  className={`${inputClass} resize-none`}
                />
              </div>

              {/* Restaurant */}
              <div>
                <label className={`flex items-center gap-2 text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <Store size={16} /> Restaurant Name
                </label>
                <input
                  type="text"
                  value={form.restaurant}
                  onChange={(e) => setForm(prev => ({ ...prev, restaurant: e.target.value }))}
                  placeholder="e.g. Burger King"
                  className={inputClass}
                />
              </div>

              {/* Map link */}
              <div>
                <label className={`flex items-center gap-2 text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <MapPin size={16} /> Google Maps Link
                </label>
                <input
                  type="url"
                  value={form.mapLink}
                  onChange={(e) => setForm(prev => ({ ...prev, mapLink: e.target.value }))}
                  placeholder="Paste location link..."
                  className={inputClass}
                />
              </div>

              {/* Image upload */}
              <div>
                <label className={`flex items-center gap-2 text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <Image size={16} /> Food Image
                </label>
                <input ref={imageRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />

                {imagePreview ? (
                  <div className="relative rounded-2xl overflow-hidden">
                    <img src={imagePreview} alt="Preview" className="w-full h-64 object-cover" />
                    <button
                      onClick={() => { setImageFile(null); setImagePreview(null) }}
                      className="absolute top-3 right-3 p-1.5 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => imageRef.current?.click()}
                    className={`w-full py-12 rounded-2xl border-2 border-dashed flex flex-col items-center gap-2 transition-colors ${
                      darkMode
                        ? 'border-white/10 hover:border-orange-500/30 text-gray-500'
                        : 'border-gray-200 hover:border-orange-300 text-gray-400'
                    }`}
                  >
                    <UploadCloud size={32} />
                    <span className="text-sm font-medium">Click to upload image</span>
                  </motion.button>
                )}
              </div>

              {/* Video upload */}
              <div>
                <label className={`flex items-center gap-2 text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <Film size={16} /> Food Video (Reel)
                </label>
                <input ref={videoRef} type="file" accept="video/*" onChange={handleVideoChange} className="hidden" />

                {videoPreview ? (
                  <div className="relative rounded-2xl overflow-hidden">
                    <video src={videoPreview} controls className="w-full h-64 object-cover rounded-2xl" />
                    <button
                      onClick={() => { setVideoFile(null); setVideoPreview(null) }}
                      className="absolute top-3 right-3 p-1.5 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => videoRef.current?.click()}
                    className={`w-full py-12 rounded-2xl border-2 border-dashed flex flex-col items-center gap-2 transition-colors ${
                      darkMode
                        ? 'border-white/10 hover:border-orange-500/30 text-gray-500'
                        : 'border-gray-200 hover:border-orange-300 text-gray-400'
                    }`}
                  >
                    <Film size={32} />
                    <span className="text-sm font-medium">Click to upload video</span>
                  </motion.button>
                )}
              </div>

              {/* Submit */}
              <motion.button
                whileHover={{ scale: 1.03, boxShadow: '0 12px 30px rgba(239, 68, 68, 0.3)' }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                onClick={handleSubmit}
                disabled={uploading || (!imageFile && !videoFile)}
                className="w-full gradient-btn py-3.5 text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {uploading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <motion.div
                      animate={{ y: [0, -2, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      <UploadCloud size={18} />
                    </motion.div>
                    Upload Post
                  </>
                )}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MainLayout>
  )
}

export default Upload