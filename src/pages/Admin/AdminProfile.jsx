import React, { useState } from 'react';
import { User, Mail, Shield, Calendar, Save, Edit, X } from 'lucide-react';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import './AdminProfile.css';

const AdminProfile = () => {
  const { admin, logout } = useAdminAuth();
  
  console.log('AdminProfile component loaded, admin:', admin);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [profileData, setProfileData] = useState({
    name: admin?.name || 'System Administrator',
    email: admin?.email || 'admin@home4paws.com',
    username: admin?.username || 'admin',
    role: 'System Administrator',
    lastLogin: new Date().toLocaleString(),
    permissions: ['User Management', 'Dog Management', 'Application Management', 'Report Management', 'Surrender Management']
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      setError('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setProfileData({
      name: admin?.name || 'System Administrator',
      email: admin?.email || 'admin@home4paws.com',
      username: admin?.username || 'admin',
      role: 'System Administrator',
      lastLogin: new Date().toLocaleString(),
      permissions: ['User Management', 'Dog Management', 'Application Management', 'Report Management', 'Surrender Management']
    });
    setIsEditing(false);
    setError('');
    setSuccess('');
  };

  return (
    <div className="admin-profile-container">
      {/* Debug message */}
      <div style={{ padding: '1rem', background: '#f0f0f0', margin: '1rem', borderRadius: '0.5rem' }}>
        <h3>Debug: AdminProfile Component Loaded</h3>
        <p>Admin data: {JSON.stringify(admin)}</p>
        <p>Current URL: {window.location.pathname}</p>
      </div>
      
      {/* Header */}
      <div className="admin-page-header">
        <div className="page-title-section">
          <User className="page-icon" />
          <div>
            <h2>Admin Profile</h2>
            <p>Manage your administrator account and settings</p>
          </div>
        </div>
      </div>

      <div className="profile-content">
        {/* Profile Card */}
        <div className="profile-card">
          <div className="profile-header">
            <div className="profile-avatar-section">
              <div className="profile-avatar">
                {profileData.name.charAt(0).toUpperCase()}
              </div>
              <div className="profile-basic-info">
                <h3>{profileData.name}</h3>
                <p className="profile-role">{profileData.role}</p>
                <p className="profile-email">{profileData.email}</p>
              </div>
            </div>
            <div className="profile-actions">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="edit-profile-btn"
                >
                  <Edit size={16} />
                  Edit Profile
                </button>
              ) : (
                <div className="edit-actions">
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="save-btn"
                  >
                    <Save size={16} />
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    onClick={handleCancel}
                    className="cancel-btn"
                  >
                    <X size={16} />
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="message error-message">
              <p>{error}</p>
              <button onClick={() => setError('')}>×</button>
            </div>
          )}

          {success && (
            <div className="message success-message">
              <p>{success}</p>
              <button onClick={() => setSuccess('')}>×</button>
            </div>
          )}

          {/* Profile Details */}
          <div className="profile-details">
            <div className="detail-section">
              <h4>Account Information</h4>
              <div className="detail-grid">
                <div className="detail-field">
                  <label htmlFor="name">Full Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={profileData.name}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  ) : (
                    <span className="detail-value">{profileData.name}</span>
                  )}
                </div>
                <div className="detail-field">
                  <label htmlFor="email">Email Address</label>
                  {isEditing ? (
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  ) : (
                    <span className="detail-value">{profileData.email}</span>
                  )}
                </div>
                <div className="detail-field">
                  <label htmlFor="username">Username</label>
                  {isEditing ? (
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={profileData.username}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  ) : (
                    <span className="detail-value">{profileData.username}</span>
                  )}
                </div>
                <div className="detail-field">
                  <label>Role</label>
                  <span className="detail-value role-badge">{profileData.role}</span>
                </div>
              </div>
            </div>

            <div className="detail-section">
              <h4>Account Status</h4>
              <div className="status-grid">
                <div className="status-item">
                  <div className="status-icon">
                    <Calendar size={20} />
                  </div>
                  <div className="status-content">
                    <span className="status-label">Last Login</span>
                    <span className="status-value">{profileData.lastLogin}</span>
                  </div>
                </div>
                <div className="status-item">
                  <div className="status-icon">
                    <Shield size={20} />
                  </div>
                  <div className="status-content">
                    <span className="status-label">Account Status</span>
                    <span className="status-value active">Active</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="detail-section">
              <h4>Administrative Permissions</h4>
              <div className="permissions-grid">
                {profileData.permissions.map((permission, index) => (
                  <div key={index} className="permission-item">
                    <div className="permission-icon">
                      <Shield size={16} />
                    </div>
                    <span className="permission-text">{permission}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Security Section */}
        <div className="security-card">
          <h3>Security & Access</h3>
          <div className="security-actions">
            <button className="security-btn change-password-btn">
              Change Password
            </button>
            <button className="security-btn logout-btn" onClick={logout}>
              Logout from All Devices
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
