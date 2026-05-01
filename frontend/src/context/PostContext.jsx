import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { getPosts } from '../services/postService'
import { toggleLike as toggleLikeApi } from '../services/likeService'
import { toggleSave as toggleSaveApi } from '../services/saveService'

const PostContext = createContext()

export function PostProvider({ children }) {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  const fetchPosts = useCallback(async (pageNum = 1, reset = false) => {
    setLoading(true)
    try {
      const res = await getPosts(pageNum, 10)
      const newPosts = res.data?.posts || []
      setPosts(prev => reset ? newPosts : [...prev, ...newPosts])
      setHasMore(pageNum < (res.data?.totalPages || 1))
      setPage(pageNum)
    } catch (err) {
      console.error('Failed to fetch posts:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const toggleLike = async (postId) => {
    try {
      const res = await toggleLikeApi(postId)
      const { liked, likeCount } = res.data
      setPosts(prev => prev.map(p =>
        p.id === postId ? { ...p, _liked: liked, _likeCount: likeCount } : p
      ))
      return { liked, likeCount }
    } catch (err) {
      console.error('Like failed:', err)
    }
  }

  const toggleSave = async (postId) => {
    try {
      const res = await toggleSaveApi(postId)
      const { saved } = res.data
      setPosts(prev => prev.map(p =>
        p.id === postId ? { ...p, _saved: saved } : p
      ))
      return { saved }
    } catch (err) {
      console.error('Save failed:', err)
    }
  }

  const addPost = (post) => {
    setPosts(prev => [post, ...prev])
  }

  const removePost = (postId) => {
    setPosts(prev => prev.filter(p => p.id !== postId))
  }

  return (
    <PostContext.Provider value={{
      posts, loading, page, hasMore,
      fetchPosts, toggleLike, toggleSave, addPost, removePost
    }}>
      {children}
    </PostContext.Provider>
  )
}

export function usePosts() {
  return useContext(PostContext)
}

export default PostContext
