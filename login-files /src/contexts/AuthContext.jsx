import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [loading, setLoading] = useState(true)

  // Configure axios defaults
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    } else {
      delete axios.defaults.headers.common['Authorization']
    }
  }, [token])

  // Check if user is logged in on app start
  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          const response = await axios.get('/api/users/me')
          setUser(response.data)
        } catch (error) {
          console.error('Auth check failed:', error)
          logout()
        }
      }
      setLoading(false)
    }
    
    checkAuth()
  }, [token])

  const login = async (username, password) => {
    try {
      const response = await axios.post('/api/auth/login', {
        username,
        password
      })
      
      const { token: newToken, username: responseUsername, roles } = response.data
      
      localStorage.setItem('token', newToken)
      setToken(newToken)
      setUser({ username: responseUsername, roles })
      
      return { success: true }
    } catch (error) {
      console.error('Login failed:', error)
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed. Please try again.' 
      }
    }
  }

  const register = async (userData) => {
    try {
      const response = await axios.post('/api/auth/register', userData)
      return { success: true, message: response.data }
    } catch (error) {
      console.error('Registration failed:', error)
      
      // Extract detailed error message from backend validation
      let errorMessage = 'Registration failed. Please try again.'
      
      if (error.response?.data) {
        // Handle Spring Boot validation errors
        if (error.response.data.errors) {
          // Multiple validation errors
          const errors = error.response.data.errors
          errorMessage = Object.values(errors).join('. ')
        } else if (error.response.data.message) {
          // Single error message
          errorMessage = error.response.data.message
        } else if (typeof error.response.data === 'string') {
          // String response
          errorMessage = error.response.data
        }
      }
      
      return { 
        success: false, 
        error: errorMessage
      }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
    delete axios.defaults.headers.common['Authorization']
  }

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!token && !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

