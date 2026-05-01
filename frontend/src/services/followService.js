import api from './api'

export const toggleFollow = async (userId) => {
  const response = await api.post(`/follows/${userId}/toggle`)
  return response.data
}

export const getFollowStatus = async (userId) => {
  const response = await api.get(`/follows/${userId}/status`)
  return response.data
}

export const getFollowers = async (userId) => {
  const response = await api.get(`/follows/${userId}/followers`)
  return response.data
}

export const getFollowing = async (userId) => {
  const response = await api.get(`/follows/${userId}/following`)
  return response.data
}
