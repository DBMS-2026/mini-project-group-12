import api from './api'

export const toggleSave = async (postId) => {
  const response = await api.post(`/saves/${postId}/toggle`)
  return response.data
}

export const getSavedPosts = async () => {
  const response = await api.get('/saves')
  return response.data
}

export const checkSaved = async (postId) => {
  const response = await api.get(`/saves/${postId}/check`)
  return response.data
}
