import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../contexts/AuthContext'
import { User, Mail, Lock, Save, LogOut, Trash, Pencil } from 'lucide-react'

const Profile = () => {
  const navigate = useNavigate()
  const { user, logout, isAuthenticated } = useAuth()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [changingPassword, setChangingPassword] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const [profile, setProfile] = useState({
    username: '',
    firstName: '',
    lastName: '',
    email: ''
  })

  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const [isEditing, setIsEditing] = useState(false)
  const [initialProfile, setInitialProfile] = useState(null)

  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const loadProfile = async () => {
      try {
        if (!isAuthenticated) {
          setLoading(false)
          return
        }
        // Prefer fresh data from API so fields like first/last/email are up-to-date
        const res = await axios.get('/api/users/me')
        const data = res.data || {}
        const nextProfile = {
          username: data.username || user?.username || '',
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          email: data.email || ''
        }
        setProfile(nextProfile)
        setInitialProfile(nextProfile)
      } catch (err) {
        console.error('Failed to load profile', err)
        setError(err.response?.data?.message || 'Failed to load profile')
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value })
    if (error) setError('')
    if (message) setMessage('')
  }

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value })
    if (error) setError('')
    if (message) setMessage('')
  }

  const saveProfile = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setMessage('')
    try {
      await axios.put('/api/users/me', {
        username: profile.username,
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email
      })
      setMessage('Profile updated successfully')
      setInitialProfile(profile)
      setIsEditing(false)
    } catch (err) {
      console.error('Update failed', err)
      setError(err.response?.data?.message || 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const cancelEditing = () => {
    if (initialProfile) {
      setProfile(initialProfile)
    }
    setIsEditing(false)
    setError('')
    setMessage('')
  }

  const changePassword = async (e) => {
    e.preventDefault()
    setChangingPassword(true)
    setError('')
    setMessage('')

    if (passwords.newPassword !== passwords.confirmPassword) {
      setChangingPassword(false)
      setError('New password and confirmation do not match')
      return
    }
    if (passwords.newPassword.length < 8) {
      setChangingPassword(false)
      setError('New password must be at least 8 characters long')
      return
    }

    try {
      await axios.put('/api/users/me/password', {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword
      })
      setMessage('Password changed successfully')
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err) {
      console.error('Password change failed', err)
      setError(err.response?.data?.message || 'Failed to change password')
    } finally {
      setChangingPassword(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const deleteAccount = async () => {
    const ok = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone.'
    )
    if (!ok) return

    setDeleting(true)
    setError('')
    setMessage('')
    try {
      await axios.delete('/api/users/me')
      logout()
      navigate('/register')
    } catch (err) {
      console.error('Delete failed', err)
      setError(err.response?.data?.message || 'Failed to delete account')
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-primary-600 font-semibold">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4">
        <div className="card p-8 max-w-md w-full text-center space-y-4">
          <h2 className="text-2xl font-bold">You are not signed in</h2>
          <p className="text-gray-600">Please sign in to view your profile.</p>
          <button
            className="btn-primary w-full"
            onClick={() => navigate('/login')}
          >
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-3xl space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Your Profile</h2>
            <p className="text-gray-600">Manage your account information and security</p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="btn-secondary flex items-center space-x-2"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {message && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            {message}
          </div>
        )}

        {/* Profile Info */}
        <div className="card p-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">Profile Information</h3>
            {!isEditing ? (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <Pencil className="h-4 w-4" />
                <span>Edit</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={cancelEditing}
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <span>Cancel</span>
              </button>
            )}
          </div>
          <form className="space-y-6" onSubmit={saveProfile}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    disabled={!isEditing}
                    className="input-field pl-10"
                    placeholder="First name"
                    value={profile.firstName}
                    onChange={handleProfileChange}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  disabled={!isEditing}
                  className="input-field"
                  placeholder="Last name"
                  value={profile.lastName}
                  onChange={handleProfileChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  disabled={!isEditing}
                  className="input-field pl-10"
                  placeholder="Username"
                  value={profile.username}
                  onChange={handleProfileChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  disabled={!isEditing}
                  className="input-field pl-10"
                  placeholder="Email address"
                  value={profile.email}
                  onChange={handleProfileChange}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={!isEditing || saving}
                className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Save className="h-5 w-5" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Change Password */}
        <div className="card p-8">
          <h3 className="text-xl font-semibold mb-6">Change Password</h3>
          <form className="space-y-6" onSubmit={changePassword}>
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Current Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="currentPassword"
                  name="currentPassword"
                  type="password"
                  className="input-field pl-10"
                  placeholder="Enter current password"
                  value={passwords.currentPassword}
                  onChange={handlePasswordChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    className="input-field pl-10"
                    placeholder="Enter new password"
                    value={passwords.newPassword}
                    onChange={handlePasswordChange}
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Must be at least 8 characters.
                </p>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  className="input-field"
                  placeholder="Confirm new password"
                  value={passwords.confirmPassword}
                  onChange={handlePasswordChange}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={changingPassword}
                className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {changingPassword ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Lock className="h-5 w-5" />
                    <span>Change Password</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Danger Zone */}
        <div className="card p-8 border-red-200">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-semibold text-red-700">Danger Zone</h3>
              <p className="text-sm text-red-600">Deleting your account is irreversible.</p>
            </div>
            <button
              type="button"
              onClick={deleteAccount}
              disabled={deleting}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg border border-red-300 text-red-700 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {deleting ? (
                <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Trash className="h-4 w-4" />
                  <span>Delete Account</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
