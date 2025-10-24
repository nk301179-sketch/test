import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const AdminAuthContext = createContext()

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext)
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider')
  }
  return context
}

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('adminToken'))
  const [loading, setLoading] = useState(true)

  // Configure axios defaults
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      axios.defaults.baseURL = 'http://localhost:8084'
    } else {
      delete axios.defaults.headers.common['Authorization']
    }
  }, [token])

  // Check if admin is logged in on app start
  useEffect(() => {
    const checkAdminAuth = async () => {
      if (token) {
        try {
          const response = await axios.get('/api/admin/me')
          setAdmin(response.data)
        } catch (error) {
          console.error('Admin auth check failed:', error)
          logout()
        }
      }
      setLoading(false)
    }
    
    checkAdminAuth()
  }, [token])

  const login = async (email, password) => {
    try {
      // Set base URL for this request
      const api = axios.create({
        baseURL: 'http://localhost:8084'
      })
      
      // Try backend admin login
      const response = await api.post('/api/admin/login', {
        username: email === 'admin@home4paws.com' ? 'admin' : email,
        password
      })
      
      const { token: newToken, username, roles } = response.data
      
      // Get admin profile
      const profileResponse = await api.get('/api/admin/me', {
        headers: { Authorization: `Bearer ${newToken}` }
      })
      
      const adminData = {
        id: profileResponse.data.id,
        username: profileResponse.data.username,
        email: profileResponse.data.email,
        firstName: profileResponse.data.firstName,
        lastName: profileResponse.data.lastName,
        roles: roles
      }
      
      localStorage.setItem('adminToken', newToken)
      setToken(newToken)
      setAdmin(adminData)
      
      return { success: true }
    } catch (error) {
      console.error('Admin login failed:', error)
      return { 
        success: false, 
        error: 'Invalid admin credentials. Please check your email and password.' 
      }
    }
  }

  const logout = () => {
    localStorage.removeItem('adminToken')
    setToken(null)
    setAdmin(null)
    delete axios.defaults.headers.common['Authorization']
  }

  const value = {
    admin,
    token,
    loading,
    login,
    logout,
    isAdminAuthenticated: !!token && !!admin
  }

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  )
}
