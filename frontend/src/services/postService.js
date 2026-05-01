import api from './api'

export const getPosts = async (page = 1, limit = 10) => {
  const response = await api.get(`/posts?page=${page}&limit=${limit}`)
  return response.data
}

export const getPost = async (id) => {
  const response = await api.get(`/posts/${id}`)
  return response.data
}

export const createPost = async (data) => {
  const response = await api.post('/posts', data)
  return response.data
}

export const deletePost = async (id) => {
  const response = await api.delete(`/posts/${id}`)
  return response.data
}

export const getUserPosts = async (username) => {
  const response = await api.get(`/posts/user/${encodeURIComponent(username)}`)
  return response.data
}