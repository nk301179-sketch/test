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
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8084'
    axios.defaults.baseURL = API_URL
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
      
      const { token: newToken, username: responseUsername, roles, id, email } = response.data
      
      // Check if user is admin based on specific credentials
      const isAdmin = (username === 'admin' || email === 'admin@home4paws.com') || 
                     roles?.includes('ADMIN') || roles?.includes('ROLE_ADMIN')
      
      if (isAdmin) {
        // Redirect admin to admin panel
        localStorage.setItem('adminToken', newToken)
        localStorage.setItem('adminUser', JSON.stringify({ id, username: responseUsername, roles, email }))
        return { 
          success: true, 
          isAdmin: true,
          redirectTo: '/admin'
        }
      }
      
      // Regular user login
      localStorage.setItem('token', newToken)
      setToken(newToken)
      setUser({ id, username: responseUsername, roles, email })
      
      return { success: true, isAdmin: false }
    } catch (error) {
      console.error('Login failed:', error)
      
      // Provide user-friendly error messages
      if (error.response?.status === 401) {
        return { 
          success: false, 
          error: 'Invalid username or password. Please check your credentials and try again.' 
        }
      } else if (error.response?.status === 403) {
        return { 
          success: false, 
          error: 'Account is disabled. Please contact support.' 
        }
      } else if (error.response?.status === 404) {
        return { 
          success: false, 
          error: 'User not found. Please check your username and try again.' 
        }
      } else if (error.response?.data?.message) {
        return { 
          success: false, 
          error: error.response.data.message 
        }
      } else {
        return { 
          success: false, 
          error: 'Login failed. Please check your credentials and try again.' 
        }
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
    // Clear user-specific data from localStorage
    if (user) {
      const userId = user.id || user.username; // Use id if available, fallback to username
      localStorage.removeItem(`reports_${userId}`)
      localStorage.removeItem(`surrenderDogs_${userId}`)
    }
    
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
