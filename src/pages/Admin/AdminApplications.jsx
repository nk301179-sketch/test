import React, { useState, useEffect } from 'react';
import { FileText, Search, Eye, Trash2, CheckCircle, XCircle, Clock, User, Dog, Calendar } from 'lucide-react';
import ConfirmationModal from '../../components/ConfirmationModal/ConfirmationModal';
import './AdminApplications.css';

const AdminApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [applicationToDelete, setApplicationToDelete] = useState(null);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8084/api/admin/applications', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setApplications(data);
    } catch (error) {
      console.error('Error fetching applications:', error);
      setError('Failed to fetch applications. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (applicationId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:8084/api/admin/applications/${applicationId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setApplications(prev => 
        prev.map(app => 
          app.id === applicationId ? { ...app, status: newStatus } : app
        )
      );
    } catch (error) {
      console.error('Error updating application status:', error);
      setError('Failed to update application status. Please try again.');
    }
  };

  const handleDelete = (applicationId) => {
    setApplicationToDelete(applicationId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(`http://localhost:8084/api/admin/applications/${applicationToDelete}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setApplications(prev => prev.filter(app => app.id !== applicationToDelete));
      setShowDeleteModal(false);
      setApplicationToDelete(null);
    } catch (error) {
      console.error('Error deleting application:', error);
      setError('Failed to delete application. Please try again.');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'APPROVED':
        return <CheckCircle className="status-icon approved" />;
      case 'REJECTED':
        return <XCircle className="status-icon rejected" />;
      case 'PENDING':
        return <Clock className="status-icon pending" />;
      default:
        return <Clock className="status-icon pending" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'APPROVED':
        return '#48bb78';
      case 'REJECTED':
        return '#e53e3e';
      case 'PENDING':
        return '#ed8936';
      default:
        return '#a0aec0';
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = 
      app.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (app.dog && app.dog.name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (app.dog && app.dog.breed?.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'ALL' || app.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="admin-applications-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-applications-container">
      {/* Header */}
      <div className="admin-page-header">
        <div className="page-title-section">
          <FileText className="page-icon" />
          <div>
            <h2>Application Management</h2>
            <p>Manage adoption and purchase applications</p>
          </div>
        </div>
        <div className="page-stats">
          <div className="stat-card">
            <Clock className="stat-icon" />
            <div>
              <span className="stat-number">{applications.filter(a => a.status === 'PENDING').length}</span>
              <span className="stat-label">Pending</span>
            </div>
          </div>
          <div className="stat-card">
            <CheckCircle className="stat-icon" />
            <div>
              <span className="stat-number">{applications.filter(a => a.status === 'APPROVED').length}</span>
              <span className="stat-label">Approved</span>
            </div>
          </div>
          <div className="stat-card">
            <XCircle className="stat-icon" />
            <div>
              <span className="stat-number">{applications.filter(a => a.status === 'REJECTED').length}</span>
              <span className="stat-label">Rejected</span>
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
            placeholder="Search by applicant name, dog name, breed, or type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="filter-controls">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="status-filter"
          >
            <option value="ALL">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
          <button onClick={fetchApplications} className="refresh-btn">
            Refresh
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => setError('')}>×</button>
        </div>
      )}

      {/* Applications List */}
      <div className="admin-table-container">
        {filteredApplications.length === 0 ? (
          <div className="empty-state">
            <FileText className="empty-icon" />
            <h3>No applications found</h3>
            <p>{searchTerm || statusFilter !== 'ALL' ? 'Try adjusting your search or filter criteria' : 'No applications have been submitted yet'}</p>
          </div>
        ) : (
          <div className="applications-list">
            {filteredApplications.map(application => (
              <div key={application.id} className="application-card">
                <div className="application-header">
                  <div className="application-info">
                    <div className="application-type">
                      <span className={`type-badge ${application.type?.toLowerCase()}`}>
                        {application.type}
                      </span>
                    </div>
                    <div className="application-status">
                      {getStatusIcon(application.status)}
                      <span 
                        className="status-text"
                        style={{ color: getStatusColor(application.status) }}
                      >
                        {application.status}
                      </span>
                    </div>
                  </div>
                  <div className="application-actions">
                    <button
                      onClick={() => setSelectedApplication(application)}
                      className="action-btn view-btn"
                      title="View Details"
                    >
                      <Eye size={20} />
                    </button>
                    <button
                      onClick={() => handleDelete(application.id)}
                      className="action-btn delete-btn"
                      title="Delete Application"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>

                <div className="application-content">
                  <div className="application-details">
                    <div className="detail-row">
                      <User className="detail-icon" />
                      <span className="detail-label">Applicant:</span>
                      <span className="detail-value">{application.fullName}</span>
                    </div>
                    {application.user && (
                      <div className="detail-row user-account">
                        <User className="detail-icon" />
                        <span className="detail-label">User Account:</span>
                        <span className="detail-value">
                          {application.user.username} ({application.user.email})
                        </span>
                      </div>
                    )}
                    {!application.user && (
                      <div className="detail-row user-account guest">
                        <User className="detail-icon" />
                        <span className="detail-label">User Account:</span>
                        <span className="detail-value">Guest User</span>
                      </div>
                    )}
                    <div className="detail-row">
                      <Dog className="detail-icon" />
                      <span className="detail-label">Dog:</span>
                      <span className="detail-value">
                        {application.dog ? `${application.dog.name} (${application.dog.breed})` : `Dog ID: ${application.dogId}`}
                      </span>
                    </div>
                    <div className="detail-row">
                      <Calendar className="detail-icon" />
                      <span className="detail-label">Applied:</span>
                      <span className="detail-value">{formatDate(application.submittedAt)}</span>
                    </div>
                  </div>

                  {application.message && (
                    <div className="application-message">
                      <p><strong>Message:</strong> {application.message}</p>
                    </div>
                  )}

                  {application.status === 'PENDING' && (
                    <div className="status-actions">
                      <button
                        onClick={() => handleStatusUpdate(application.id, 'APPROVED')}
                        className="status-btn approve-btn"
                      >
                        <CheckCircle size={16} />
                        Approve
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(application.id, 'REJECTED')}
                        className="status-btn reject-btn"
                      >
                        <XCircle size={16} />
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Application Details Modal */}
      {selectedApplication && (
        <div className="modal-overlay" onClick={() => setSelectedApplication(null)}>
          <div className="modal-content application-details-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Application Details</h3>
              <button className="close-btn" onClick={() => setSelectedApplication(null)}>×</button>
            </div>
            <div className="application-details-content">
              <div className="detail-section">
                <h4>Application Information</h4>
                <div className="detail-grid">
                  <div className="detail-field">
                    <label>Application ID</label>
                    <span>{selectedApplication.id}</span>
                  </div>
                  <div className="detail-field">
                    <label>Type</label>
                    <span className={`type-badge ${selectedApplication.type?.toLowerCase()}`}>
                      {selectedApplication.type}
                    </span>
                  </div>
                  <div className="detail-field">
                    <label>Status</label>
                    <span 
                      className="status-text"
                      style={{ color: getStatusColor(selectedApplication.status) }}
                    >
                      {selectedApplication.status}
                    </span>
                  </div>
                  <div className="detail-field">
                    <label>Submitted Date</label>
                    <span>{formatDate(selectedApplication.submittedAt)}</span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h4>Applicant Information</h4>
                <div className="detail-grid">
                  <div className="detail-field">
                    <label>Name</label>
                    <span>{selectedApplication.fullName}</span>
                  </div>
                  <div className="detail-field">
                    <label>Email</label>
                    <span>{selectedApplication.email || 'Not provided'}</span>
                  </div>
                  <div className="detail-field">
                    <label>Phone</label>
                    <span>{selectedApplication.phoneNumber || 'Not provided'}</span>
                  </div>
                </div>
              </div>

              {selectedApplication.user && (
                <div className="detail-section">
                  <h4>User Account Information</h4>
                  <div className="detail-grid">
                    <div className="detail-field">
                      <label>User ID</label>
                      <span>{selectedApplication.user.id}</span>
                    </div>
                    <div className="detail-field">
                      <label>Username</label>
                      <span>{selectedApplication.user.username}</span>
                    </div>
                    <div className="detail-field">
                      <label>Account Email</label>
                      <span>{selectedApplication.user.email}</span>
                    </div>
                    <div className="detail-field">
                      <label>Full Name</label>
                      <span>{selectedApplication.user.firstName} {selectedApplication.user.lastName}</span>
                    </div>
                  </div>
                </div>
              )}

              {!selectedApplication.user && (
                <div className="detail-section">
                  <h4>User Account Information</h4>
                  <div className="detail-grid">
                    <div className="detail-field">
                      <label>Account Status</label>
                      <span className="guest-user">Guest User (Not logged in)</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="detail-section">
                <h4>Dog Information</h4>
                <div className="detail-grid">
                  <div className="detail-field">
                    <label>Dog Name</label>
                    <span>{selectedApplication.dog ? selectedApplication.dog.name : 'Dog ID: ' + selectedApplication.dogId}</span>
                  </div>
                  <div className="detail-field">
                    <label>Breed</label>
                    <span>{selectedApplication.dog ? selectedApplication.dog.breed : 'Not available'}</span>
                  </div>
                  <div className="detail-field">
                    <label>Price</label>
                    <span>{selectedApplication.dog ? (selectedApplication.dog.price ? `Rs. ${selectedApplication.dog.price.toLocaleString()}` : 'Free') : 'Not available'}</span>
                  </div>
                  <div className="detail-field">
                    <label>Type</label>
                    <span>{selectedApplication.dog ? (selectedApplication.dog.isStray ? 'For Adoption' : 'For Sale') : selectedApplication.type}</span>
                  </div>
                  {selectedApplication.dog && selectedApplication.dog.description && (
                    <div className="detail-field full-width">
                      <label>Description</label>
                      <span>{selectedApplication.dog.description}</span>
                    </div>
                  )}
                </div>
              </div>

              {selectedApplication.message && (
                <div className="detail-section">
                  <h4>Applicant Message</h4>
                  <div className="message-content">
                    <p>{selectedApplication.message}</p>
                  </div>
                </div>
              )}

              {selectedApplication.status === 'PENDING' && (
                <div className="modal-actions">
                  <button
                    onClick={() => {
                      handleStatusUpdate(selectedApplication.id, 'APPROVED');
                      setSelectedApplication(null);
                    }}
                    className="status-btn approve-btn"
                  >
                    <CheckCircle size={16} />
                    Approve Application
                  </button>
                  <button
                    onClick={() => {
                      handleStatusUpdate(selectedApplication.id, 'REJECTED');
                      setSelectedApplication(null);
                    }}
                    className="status-btn reject-btn"
                  >
                    <XCircle size={16} />
                    Reject Application
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <ConfirmationModal
          message="Are you sure you want to delete this application? This action cannot be undone."
          onConfirm={confirmDelete}
          onCancel={() => {
            setShowDeleteModal(false);
            setApplicationToDelete(null);
          }}
        />
      )}
    </div>
  );
};

export default AdminApplications;
