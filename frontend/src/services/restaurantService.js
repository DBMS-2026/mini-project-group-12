import api from './api'

export const getRestaurants = async (query = '', filters = {}) => {
  const params = new URLSearchParams()
  if (query) params.append('q', query)
  if (filters.location) params.append('location', filters.location)
  if (filters.cuisine) params.append('cuisine', filters.cuisine)
  if (filters.rating) params.append('minRating', filters.rating)
  if (filters.cost) params.append('maxCost', filters.cost)
  
  const queryString = params.toString()
  const url = queryString ? `/restaurants?${queryString}` : '/restaurants'
  
  const response = await api.get(url)
  return response.data
}

export const getRestaurant = async (name) => {
  const response = await api.get(`/restaurants/${encodeURIComponent(name)}`)
  return response.data
}

export const getRestaurantPosts = async (name) => {
  const response = await api.get(`/restaurants/${encodeURIComponent(name)}/posts`)
  return response.data
}