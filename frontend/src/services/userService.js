import api from './api'

export const getUserProfile = async (username) => {
  const response = await api.get(`/users/${encodeURIComponent(username)}`)
  return response.data
}

export const updateUserProfile = async (data) => {
  const response = await api.put('/users/profile', data)
  return response.data
}

export const searchUsers = async (query) => {
  const response = await api.get(`/users/search?q=${encodeURIComponent(query)}`)
  return response.data
}

export const getSuggestedUsers = async () => {
  const response = await api.get('/users/suggested')
  return response.data
}