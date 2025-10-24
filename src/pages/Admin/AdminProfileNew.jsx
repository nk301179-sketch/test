import React, { useState } from 'react';
import { User, Mail, Shield, Calendar, Save, Edit, X, Trash2, AlertTriangle, Settings } from 'lucide-react';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import ConfirmationModal from '../../components/ConfirmationModal/ConfirmationModal';
import './AdminProfileNew.css';

const AdminProfileNew = () => {
  const { admin, logout } = useAdminAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Hardcoded admin credentials
  const [adminData, setAdminData] = useState({
    id: 1,
    name: 'System Administrator',
    email: 'admin@home4paws.com',
    username: 'admin',
    role: 'System Administrator',
    permissions: ['User Management', 'Dog Management', 'Application Management', 'Report Management', 'Surrender Management'],
    lastLogin: new Date().toLocaleString(),
    accountCreated: '2024-01-01',
    status: 'Active'
  });

  const [formData, setFormData] = useState({
    name: adminData.name,
    email: adminData.email,
    username: adminData.username
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
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
      
      // Update admin data
      setAdminData(prev => ({
        ...prev,
        name: formData.name,
        email: formData.email,
        username: formData.username
      }));
      
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      setError('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: adminData.name,
      email: adminData.email,
      username: adminData.username
    });
    setIsEditing(false);
    setError('');
    setSuccess('');
  };

  const handleDeleteAccount = () => {
    setShowDeleteModal(true);
  };

  const confirmDeleteAccount = async () => {
    try {
      setLoading(true);
      // Simulate account deletion
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Logout and redirect to main user website as guest
      logout();
      window.location.href = '/';
    } catch (error) {
      setError('Failed to delete account. Please try again.');
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
  };

  return (
    <div className="admin-profile-new-container">
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
                {adminData.name.charAt(0).toUpperCase()}
              </div>
              <div className="profile-basic-info">
                <h3>{adminData.name}</h3>
                <p className="profile-role">{adminData.role}</p>
                <p className="profile-email">{adminData.email}</p>
              </div>
            </div>
            <div className="profile-actions">
              {!isEditing ? (
                <div className="action-buttons">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="edit-profile-btn"
                  >
                    <Edit size={16} />
                    Edit Profile
                  </button>
                  <button
                    onClick={handleDeleteAccount}
                    className="delete-account-btn"
                  >
                    <Trash2 size={16} />
                    Delete Account
                  </button>
                </div>
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
                      value={formData.name}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  ) : (
                    <span className="detail-value">{adminData.name}</span>
                  )}
                </div>
                <div className="detail-field">
                  <label htmlFor="email">Email Address</label>
                  {isEditing ? (
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  ) : (
                    <span className="detail-value">{adminData.email}</span>
                  )}
                </div>
                <div className="detail-field">
                  <label htmlFor="username">Username</label>
                  {isEditing ? (
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  ) : (
                    <span className="detail-value">{adminData.username}</span>
                  )}
                </div>
                <div className="detail-field">
                  <label>Role</label>
                  <span className="detail-value role-badge">{adminData.role}</span>
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
                    <span className="status-value">{adminData.lastLogin}</span>
                  </div>
                </div>
                <div className="status-item">
                  <div className="status-icon">
                    <Shield size={20} />
                  </div>
                  <div className="status-content">
                    <span className="status-label">Account Status</span>
                    <span className="status-value active">{adminData.status}</span>
                  </div>
                </div>
                <div className="status-item">
                  <div className="status-icon">
                    <Settings size={20} />
                  </div>
                  <div className="status-content">
                    <span className="status-label">Account Created</span>
                    <span className="status-value">{adminData.accountCreated}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="detail-section">
              <h4>Administrative Permissions</h4>
              <div className="permissions-grid">
                {adminData.permissions.map((permission, index) => (
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

      {/* Delete Account Confirmation Modal */}
      {showDeleteModal && (
        <ConfirmationModal
          message="Are you sure you want to delete your admin account? This action cannot be undone and will remove all your administrative privileges."
          onConfirm={confirmDeleteAccount}
          onCancel={cancelDelete}
        />
      )}
    </div>
  );
};

export default AdminProfileNew;
