import api from './api'

export const uploadImage = async (file) => {
  const formData = new FormData()
  formData.append('image', file)
  const response = await api.post('/upload/image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return response.data
}

export const uploadVideo = async (file) => {
  const formData = new FormData()
  formData.append('video', file)
  const response = await api.post('/upload/video', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return response.data
}
