import api from './api'

export const getReels = async (page = 1, limit = 10) => {
  const response = await api.get(`/posts/reels?page=${page}&limit=${limit}`)
  return response.data
}