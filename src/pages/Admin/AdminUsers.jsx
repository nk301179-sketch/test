import React, { useState, useEffect } from 'react';
import { Users, Search, Trash2, Eye, UserCheck, UserX, Mail, Phone, Calendar } from 'lucide-react';
import ConfirmationModal from '../../components/ConfirmationModal/ConfirmationModal';
import './AdminUsers.css';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8084/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to fetch users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = (userId) => {
    setUserToDelete(userId);
    setShowDeleteModal(true);
  };

  const confirmDeleteUser = async () => {
    try {
      const response = await fetch(`http://localhost:8084/api/admin/users/${userToDelete}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setUsers(prev => prev.filter(user => user.id !== userToDelete));
      setShowDeleteModal(false);
      setUserToDelete(null);
    } catch (error) {
      console.error('Error deleting user:', error);
      setError('Failed to delete user. Please try again.');
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setUserToDelete(null);
  };

  const filteredUsers = users.filter(user =>
    user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.firstName && user.lastName ? `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) : false)
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="admin-users-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-users-container">
      {/* Header */}
      <div className="admin-page-header">
        <div className="page-title-section">
          <Users className="page-icon" />
          <div>
            <h2>User Management</h2>
            <p>Manage account holders and their information</p>
          </div>
        </div>
        <div className="page-stats">
          <div className="stat-card">
            <UserCheck className="stat-icon" />
            <div>
              <span className="stat-number">{users.length}</span>
              <span className="stat-label">Total Users</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="admin-filters">
        <div className="search-container">
          <Search className="search-icon" />
          <input
            type="text"
            placeholder="Search users by name, email, or username..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <button onClick={fetchUsers} className="refresh-btn">
          Refresh
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => setError('')}>×</button>
        </div>
      )}

      {/* Users Table */}
      <div className="admin-table-container">
        {filteredUsers.length === 0 ? (
          <div className="empty-state">
            <Users className="empty-icon" />
            <h3>No users found</h3>
            <p>{searchTerm ? 'Try adjusting your search terms' : 'No users have registered yet'}</p>
          </div>
        ) : (
          <div className="users-grid">
            {filteredUsers.map(user => (
              <div key={user.id} className="user-card">
                <div className="user-header">
                  <div className="user-avatar">
                    {(user.firstName && user.lastName) ? `${user.firstName} ${user.lastName}`.charAt(0).toUpperCase() : user.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="user-info">
                    <h4 className="user-name">{(user.firstName && user.lastName) ? `${user.firstName} ${user.lastName}` : user.username}</h4>
                    <p className="user-username">@{user.username}</p>
                  </div>
                  <div className="user-actions">
                    <button
                      onClick={() => setSelectedUser(user)}
                      className="action-btn view-btn"
                      title="View Details"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="action-btn delete-btn"
                      title="Delete User"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="user-details">
                  <div className="detail-item">
                    <Mail className="detail-icon" />
                    <span>{user.email || 'No email provided'}</span>
                  </div>
                  {user.phone && (
                    <div className="detail-item">
                      <Phone className="detail-icon" />
                      <span>{user.phone}</span>
                    </div>
                  )}
                  <div className="detail-item">
                    <Calendar className="detail-icon" />
                    <span>User ID: {user.id}</span>
                  </div>
                  {user.roles && (
                    <div className="user-roles">
                      {user.roles.map((role, index) => (
                        <span key={index} className="role-badge">
                          {role.name || role}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <div className="modal-overlay" onClick={() => setSelectedUser(null)}>
          <div className="modal-content user-details-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>User Details</h3>
              <button className="close-btn" onClick={() => setSelectedUser(null)}>×</button>
            </div>
            <div className="user-details-content">
              <div className="user-detail-section">
                <h4>Personal Information</h4>
                <div className="detail-grid">
                  <div className="detail-field">
                    <label>Full Name</label>
                    <span>{(selectedUser.firstName && selectedUser.lastName) ? `${selectedUser.firstName} ${selectedUser.lastName}` : 'Not provided'}</span>
                  </div>
                  <div className="detail-field">
                    <label>Username</label>
                    <span>{selectedUser.username}</span>
                  </div>
                  <div className="detail-field">
                    <label>Email</label>
                    <span>{selectedUser.email || 'Not provided'}</span>
                  </div>
                  <div className="detail-field">
                    <label>Phone</label>
                    <span>{selectedUser.phone || 'Not provided'}</span>
                  </div>
                </div>
              </div>

              <div className="user-detail-section">
                <h4>Account Information</h4>
                <div className="detail-grid">
                  <div className="detail-field">
                    <label>User ID</label>
                    <span>{selectedUser.id}</span>
                  </div>
                  <div className="detail-field">
                    <label>Registration Date</label>
                    <span>User ID: {selectedUser.id}</span>
                  </div>
                  <div className="detail-field">
                    <label>Roles</label>
                    <div className="roles-list">
                      {selectedUser.roles?.map((role, index) => (
                        <span key={index} className="role-badge">{role.name || role}</span>
                      )) || <span>No roles assigned</span>}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <ConfirmationModal
          message={`Are you sure you want to delete this user? This action cannot be undone.`}
          onConfirm={confirmDeleteUser}
          onCancel={cancelDelete}
        />
      )}
    </div>
  );
};

export default AdminUsers;
