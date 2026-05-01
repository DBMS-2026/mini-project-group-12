import api from './api'

export const getComments = async (postId) => {
  const response = await api.get(`/comments/${postId}`)
  return response.data
}

export const addComment = async (postId, text) => {
  const response = await api.post(`/comments/${postId}`, { text })
  return response.data
}

export const deleteComment = async (commentId) => {
  const response = await api.delete(`/comments/${commentId}`)
  return response.data
}
