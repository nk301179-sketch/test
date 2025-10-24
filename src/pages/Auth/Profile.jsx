import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { User, Mail, Lock, Save, Trash, Pencil } from 'lucide-react';
import './Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [profile, setProfile] = useState({
    username: '',
    firstName: '',
    lastName: '',
    email: ''
  });

  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const [initialProfile, setInitialProfile] = useState(null);

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      try {
        if (!isAuthenticated) {
          setLoading(false);
          return;
        }
        // Prefer fresh data from API
        const res = await axios.get('/api/users/me');
        const data = res.data || {};
        const nextProfile = {
          username: data.username || user?.username || '',
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          email: data.email || ''
        };
        setProfile(nextProfile);
        setInitialProfile(nextProfile);
      } catch (err) {
        console.error('Failed to load profile', err);
        setError(err.response?.data?.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [isAuthenticated, user]);

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
    if (error) setError('');
    if (message) setMessage('');
  };

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
    if (error) setError('');
    if (message) setMessage('');
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setMessage('');
    try {
      await axios.put('/api/users/me', {
        username: profile.username,
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email
      });
      setMessage('Profile updated successfully');
      setInitialProfile(profile);
      setIsEditing(false);
    } catch (err) {
      console.error('Update failed', err);
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const cancelEditing = () => {
    if (initialProfile) {
      setProfile(initialProfile);
    }
    setIsEditing(false);
    setError('');
    setMessage('');
  };

  const changePassword = async (e) => {
    e.preventDefault();
    setChangingPassword(true);
    setError('');
    setMessage('');

    if (passwords.newPassword !== passwords.confirmPassword) {
      setChangingPassword(false);
      setError('New password and confirmation do not match');
      return;
    }
    if (passwords.newPassword.length < 8) {
      setChangingPassword(false);
      setError('New password must be at least 8 characters long');
      return;
    }

    try {
      await axios.put('/api/users/me/password', {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword
      });
      setMessage('Password changed successfully');
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      console.error('Password change failed', err);
      setError(err.response?.data?.message || 'Failed to change password');
    } finally {
      setChangingPassword(false);
    }
  };


  const deleteAccount = async () => {
    const ok = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone.'
    );
    if (!ok) return;

    setDeleting(true);
    setError('');
    setMessage('');
    try {
      await axios.delete('/api/users/me');
      logout();
      navigate('/register');
    } catch (err) {
      console.error('Delete failed', err);
      setError(err.response?.data?.message || 'Failed to delete account');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-loading-container">
        <div className="profile-loading-content">
          <div className="profile-spinner"></div>
          <p className="profile-loading-text">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="profile-not-authenticated-container">
        <div className="profile-not-authenticated-card">
          <h2 className="profile-not-authenticated-title">You are not signed in</h2>
          <p className="profile-not-authenticated-text">Please sign in to view your profile.</p>
          <button
            className="profile-login-button"
            onClick={() => navigate('/login')}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-wrapper">
        {/* Header */}
        <div className="profile-header">
          <div>
            <h2 className="profile-title">Your Profile</h2>
            <p className="profile-subtitle">Manage your account information and security</p>
          </div>
        </div>

        {error && (
          <div className="profile-error-message">
            {error}
          </div>
        )}

        {message && (
          <div className="profile-success-message">
            {message}
          </div>
        )}

        {/* Profile Info */}
        <div className="profile-card">
          <div className="profile-card-header">
            <h3 className="profile-card-title">Profile Information</h3>
            {!isEditing ? (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="profile-edit-btn"
              >
                <Pencil className="profile-icon-sm" />
                <span>Edit</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={cancelEditing}
                className="profile-cancel-btn"
              >
                <span>Cancel</span>
              </button>
            )}
          </div>
          <form className="profile-form" onSubmit={saveProfile}>
            <div className="profile-form-grid">
              <div>
                <label htmlFor="firstName" className="profile-form-label">
                  First Name
                </label>
                <div className="profile-input-wrapper">
                  <div className="profile-input-icon-wrapper">
                    <User className="profile-input-icon" />
                  </div>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    disabled={!isEditing}
                    className="profile-form-input"
                    placeholder="First name"
                    value={profile.firstName}
                    onChange={handleProfileChange}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="lastName" className="profile-form-label">
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  disabled={!isEditing}
                  className="profile-form-input-plain"
                  placeholder="Last name"
                  value={profile.lastName}
                  onChange={handleProfileChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="username" className="profile-form-label">
                Username
              </label>
              <div className="profile-input-wrapper">
                <div className="profile-input-icon-wrapper">
                  <User className="profile-input-icon" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  disabled={!isEditing}
                  className="profile-form-input"
                  placeholder="Username"
                  value={profile.username}
                  onChange={handleProfileChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="profile-form-label">
                Email Address
              </label>
              <div className="profile-input-wrapper">
                <div className="profile-input-icon-wrapper">
                  <Mail className="profile-input-icon" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  disabled={!isEditing}
                  className="profile-form-input"
                  placeholder="Email address"
                  value={profile.email}
                  onChange={handleProfileChange}
                />
              </div>
            </div>

            <div className="profile-form-actions">
              <button
                type="submit"
                disabled={!isEditing || saving}
                className="profile-save-btn"
              >
                {saving ? (
                  <div className="profile-btn-spinner"></div>
                ) : (
                  <>
                    <Save className="profile-icon" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Change Password */}
        <div className="profile-card">
          <h3 className="profile-card-title">Change Password</h3>
          <form className="profile-form" onSubmit={changePassword}>
            <div>
              <label htmlFor="currentPassword" className="profile-form-label">
                Current Password
              </label>
              <div className="profile-input-wrapper">
                <div className="profile-input-icon-wrapper">
                  <Lock className="profile-input-icon" />
                </div>
                <input
                  id="currentPassword"
                  name="currentPassword"
                  type="password"
                  className="profile-form-input"
                  placeholder="Enter current password"
                  value={passwords.currentPassword}
                  onChange={handlePasswordChange}
                />
              </div>
            </div>

            <div className="profile-form-grid">
              <div>
                <label htmlFor="newPassword" className="profile-form-label">
                  New Password
                </label>
                <div className="profile-input-wrapper">
                  <div className="profile-input-icon-wrapper">
                    <Lock className="profile-input-icon" />
                  </div>
                  <input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    className="profile-form-input"
                    placeholder="Enter new password"
                    value={passwords.newPassword}
                    onChange={handlePasswordChange}
                  />
                </div>
                <p className="profile-input-help">
                  Must be at least 8 characters.
                </p>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="profile-form-label">
                  Confirm New Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  className="profile-form-input-plain"
                  placeholder="Confirm new password"
                  value={passwords.confirmPassword}
                  onChange={handlePasswordChange}
                />
              </div>
            </div>

            <div className="profile-form-actions">
              <button
                type="submit"
                disabled={changingPassword}
                className="profile-save-btn"
              >
                {changingPassword ? (
                  <div className="profile-btn-spinner"></div>
                ) : (
                  <>
                    <Lock className="profile-icon" />
                    <span>Change Password</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Danger Zone */}
        <div className="profile-danger-card">
          <div className="profile-danger-header">
            <div>
              <h3 className="profile-danger-title">Danger Zone</h3>
              <p className="profile-danger-subtitle">Deleting your account is irreversible.</p>
            </div>
            <button
              type="button"
              onClick={deleteAccount}
              disabled={deleting}
              className="profile-delete-btn"
            >
              {deleting ? (
                <div className="profile-danger-spinner"></div>
              ) : (
                <>
                  <Trash className="profile-icon-sm" />
                  <span>Delete Account</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

