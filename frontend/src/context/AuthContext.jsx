import { createContext, useContext, useEffect, useState } from 'react'
import { getMe } from '../services/authService'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('foodcreed-token'))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('foodcreed-token')

      if (storedToken) {
        try {
          const response = await getMe()
          setUser(response.data.user)
          localStorage.setItem('foodcreed-user', JSON.stringify(response.data.user))
        } catch (error) {
          console.error('Auth check failed:', error)
          localStorage.removeItem('foodcreed-token')
          localStorage.removeItem('foodcreed-user')
          setToken(null)
        }
      } else {
        const savedUser = localStorage.getItem('foodcreed-user')
        if (savedUser) {
          try {
            setUser(JSON.parse(savedUser))
          } catch (e) {
            localStorage.removeItem('foodcreed-user')
          }
        }
      }

      setLoading(false)
    }

    initAuth()
  }, [])

  const login = (userData, authToken) => {
    setUser(userData)
    setToken(authToken)
    localStorage.setItem('foodcreed-user', JSON.stringify(userData))
    if (authToken) {
      localStorage.setItem('foodcreed-token', authToken)
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('foodcreed-user')
    localStorage.removeItem('foodcreed-token')
  }

  const updateUser = (userData) => {
    setUser(userData)
    localStorage.setItem('foodcreed-user', JSON.stringify(userData))
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}

export default AuthContext