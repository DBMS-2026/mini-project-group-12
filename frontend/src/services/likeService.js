import api from './api'

export const toggleLike = async (postId) => {
  const response = await api.post(`/likes/${postId}/toggle`)
  return response.data
}

export const getLikeStatus = async (postId) => {
  const response = await api.get(`/likes/${postId}`)
  return response.data
}
