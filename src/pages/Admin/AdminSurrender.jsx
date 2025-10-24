import React, { useState, useEffect } from 'react';
import { Heart, Search, Eye, Trash2, User, Phone, Mail, MapPin, Calendar, Dog, Image, AlertCircle } from 'lucide-react';
import ConfirmationModal from '../../components/ConfirmationModal/ConfirmationModal';
import './AdminSurrender.css';

const AdminSurrender = () => {
  const [surrenderRequests, setSurrenderRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [requestToDelete, setRequestToDelete] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSurrenderRequests();
  }, []);

  const fetchSurrenderRequests = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8084/api/admin/surrender-submissions', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setSurrenderRequests(data);
    } catch (error) {
      console.error('Error fetching surrender requests:', error);
      setError('Failed to fetch surrender requests. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (requestId) => {
    setRequestToDelete(requestId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(`http://localhost:8084/api/admin/surrender-submissions/${requestToDelete}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setSurrenderRequests(prev => prev.filter(request => request.surrenderId !== requestToDelete));
      setShowDeleteModal(false);
      setRequestToDelete(null);
    } catch (error) {
      console.error('Error deleting surrender request:', error);
      setError('Failed to delete surrender request. Please try again.');
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

  const getUrgencyIcon = (isUrgent) => {
    return isUrgent ? <AlertCircle className="urgency-icon urgent" /> : null;
  };

  const filteredRequests = surrenderRequests.filter(request =>
    request.ownerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.dogName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.dogBreed?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.surrenderReason?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.ownerPhone?.includes(searchTerm)
  );

  if (loading) {
    return (
      <div className="admin-surrender-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading surrender requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-surrender-container">
      {/* Header */}
      <div className="admin-page-header">
        <div className="page-title-section">
          <Heart className="page-icon" />
          <div>
            <h2>Surrender Management</h2>
            <p>View and manage dog surrender requests</p>
          </div>
        </div>
        <div className="page-stats">
          <div className="stat-card">
            <Heart className="stat-icon" />
            <div>
              <span className="stat-number">{surrenderRequests.length}</span>
              <span className="stat-label">Total Requests</span>
            </div>
          </div>
          <div className="stat-card">
            <AlertCircle className="stat-icon" />
            <div>
              <span className="stat-number">{surrenderRequests.filter(r => r.isUrgent).length}</span>
              <span className="stat-label">Urgent</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="admin-filters">
        <div className="search-container">
          <Search className="search-icon" />
          <input
            type="text"
            placeholder="Search requests by owner, dog, breed, or reason..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <button onClick={fetchSurrenderRequests} className="refresh-btn">
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

      {/* Surrender Requests List */}
      <div className="admin-table-container">
        {filteredRequests.length === 0 ? (
          <div className="empty-state">
            <Heart className="empty-icon" />
            <h3>No surrender requests found</h3>
            <p>{searchTerm ? 'Try adjusting your search terms' : 'No surrender requests have been submitted yet'}</p>
          </div>
        ) : (
          <div className="requests-grid">
            {filteredRequests.map(request => (
              <div key={request.surrenderId} className="request-card">
                <div className="request-header">
                  <div className="request-info">
                    <div className="request-title">
                      <h4 className="request-owner">{request.ownerName}</h4>
                      {getUrgencyIcon(request.isUrgent)}
                    </div>
                    <span className="request-timestamp">{formatDate(request.submissionDate)}</span>
                    {request.user && (
                      <div className="user-info">
                        <User className="user-icon" />
                        <span className="user-details">
                          {request.user.username} ({request.user.email})
                        </span>
                      </div>
                    )}
                    {!request.user && (
                      <div className="user-info guest">
                        <User className="user-icon" />
                        <span className="user-details">Guest User</span>
                      </div>
                    )}
                  </div>
                  <div className="request-actions">
                    <button
                      onClick={() => setSelectedRequest(request)}
                      className="action-btn view-btn"
                      title="View Details"
                    >
                      <Eye size={20} />
                    </button>
                    <button
                      onClick={() => handleDelete(request.surrenderId)}
                      className="action-btn delete-btn"
                      title="Delete Request"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>

                <div className="request-content">
                  <div className="dog-info">
                    <div className="dog-header">
                      <Dog className="dog-icon" />
                      <span className="dog-name">{request.dogName}</span>
                      <span className="dog-breed">{request.dogBreed}</span>
                    </div>
                    <div className="dog-details">
                      <span className="dog-age">{request.dogAge} years old</span>
                      <span className="dog-gender">{request.dogGender}</span>
                      <span className="dog-size">{request.dogSize}</span>
                    </div>
                  </div>

                  <div className="request-details">
                    <div className="detail-item">
                      <Phone className="detail-icon" />
                      <span>{request.ownerPhone}</span>
                    </div>
                    {request.ownerEmail && (
                      <div className="detail-item">
                        <Mail className="detail-icon" />
                        <span>{request.ownerEmail}</span>
                      </div>
                    )}
                    {request.ownerAddress && (
                      <div className="detail-item">
                        <MapPin className="detail-icon" />
                        <span>{request.ownerAddress}</span>
                      </div>
                    )}
                  </div>

                  <div className="surrender-reason">
                    <p><strong>Reason:</strong> {request.surrenderReason}</p>
                  </div>

                  {request.dogPhotoUrls && request.dogPhotoUrls.length > 0 && (
                    <div className="request-photos">
                      <div className="photos-header">
                        <Image className="photos-icon" />
                        <span>Dog Photos ({request.dogPhotoUrls.length})</span>
                      </div>
                      <div className="photos-grid">
                        {request.dogPhotoUrls.slice(0, 3).map((photo, index) => (
                          <img
                            key={index}
                            src={photo}
                            alt={`Dog photo ${index + 1}`}
                            className="photo-thumbnail"
                          />
                        ))}
                        {request.dogPhotoUrls.length > 3 && (
                          <div className="more-photos">
                            +{request.dogPhotoUrls.length - 3} more
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {request.isUrgent && (
                    <div className="urgency-notice">
                      <AlertCircle className="urgency-icon" />
                      <span>URGENT REQUEST</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Request Details Modal */}
      {selectedRequest && (
        <div className="modal-overlay" onClick={() => setSelectedRequest(null)}>
          <div className="modal-content request-details-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Surrender Request Details</h3>
              <button className="close-btn" onClick={() => setSelectedRequest(null)}>×</button>
            </div>
            <div className="request-details-content">
              <div className="detail-section">
                <h4>Request Information</h4>
                <div className="detail-grid">
                  <div className="detail-field">
                    <label>Request ID</label>
                    <span>{selectedRequest.surrenderId}</span>
                  </div>
                  <div className="detail-field">
                    <label>Submitted Date</label>
                    <span>{formatDate(selectedRequest.submissionDate)}</span>
                  </div>
                  <div className="detail-field">
                    <label>Urgent</label>
                    <span className={selectedRequest.isUrgent ? 'urgent-badge' : 'normal-badge'}>
                      {selectedRequest.isUrgent ? 'Yes' : 'No'}
                    </span>
                  </div>
                  {selectedRequest.preferredDate && (
                    <div className="detail-field">
                      <label>Preferred Date</label>
                      <span>{formatDate(selectedRequest.preferredDate)}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="detail-section">
                <h4>Owner Information</h4>
                <div className="detail-grid">
                  <div className="detail-field">
                    <label>Name</label>
                    <span>{selectedRequest.ownerName}</span>
                  </div>
                  <div className="detail-field">
                    <label>Phone</label>
                    <span>{selectedRequest.ownerPhone}</span>
                  </div>
                  <div className="detail-field">
                    <label>Email</label>
                    <span>{selectedRequest.ownerEmail || 'Not provided'}</span>
                  </div>
                  <div className="detail-field">
                    <label>Address</label>
                    <span>{selectedRequest.ownerAddress || 'Not provided'}</span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h4>Dog Information</h4>
                <div className="detail-grid">
                  <div className="detail-field">
                    <label>Name</label>
                    <span>{selectedRequest.dogName}</span>
                  </div>
                  <div className="detail-field">
                    <label>Breed</label>
                    <span>{selectedRequest.dogBreed || 'Not specified'}</span>
                  </div>
                  <div className="detail-field">
                    <label>Age</label>
                    <span>{selectedRequest.dogAge} years</span>
                  </div>
                  <div className="detail-field">
                    <label>Gender</label>
                    <span>{selectedRequest.dogGender || 'Not specified'}</span>
                  </div>
                  <div className="detail-field">
                    <label>Size</label>
                    <span>{selectedRequest.dogSize || 'Not specified'}</span>
                  </div>
                  <div className="detail-field">
                    <label>Vaccinated</label>
                    <span className={selectedRequest.isVaccinated ? 'yes-badge' : 'no-badge'}>
                      {selectedRequest.isVaccinated ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="detail-field">
                    <label>Neutered</label>
                    <span className={selectedRequest.isNeutered ? 'yes-badge' : 'no-badge'}>
                      {selectedRequest.isNeutered ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="detail-field">
                    <label>Medical Issues</label>
                    <span className={selectedRequest.hasMedicalIssues ? 'yes-badge' : 'no-badge'}>
                      {selectedRequest.hasMedicalIssues ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>
              </div>

              {selectedRequest.dogDescription && (
                <div className="detail-section">
                  <h4>Dog Description</h4>
                  <div className="description-content">
                    <p>{selectedRequest.dogDescription}</p>
                  </div>
                </div>
              )}

              <div className="detail-section">
                <h4>Surrender Reason</h4>
                <div className="reason-content">
                  <p>{selectedRequest.surrenderReason}</p>
                </div>
              </div>

              {selectedRequest.medicalHistory && (
                <div className="detail-section">
                  <h4>Medical History</h4>
                  <div className="description-content">
                    <p>{selectedRequest.medicalHistory}</p>
                  </div>
                </div>
              )}

              {selectedRequest.dogPhotoUrls && selectedRequest.dogPhotoUrls.length > 0 && (
                <div className="detail-section">
                  <h4>Dog Photos ({selectedRequest.dogPhotoUrls.length})</h4>
                  <div className="photos-gallery">
                    {selectedRequest.dogPhotoUrls.map((photo, index) => (
                      <div key={index} className="photo-item">
                        <img
                          src={photo}
                          alt={`Dog photo ${index + 1}`}
                          className="gallery-photo"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedRequest.adminNotes && (
                <div className="detail-section">
                  <h4>Admin Notes</h4>
                  <div className="description-content">
                    <p>{selectedRequest.adminNotes}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <ConfirmationModal
          message="Are you sure you want to delete this surrender request? This action cannot be undone."
          onConfirm={confirmDelete}
          onCancel={() => {
            setShowDeleteModal(false);
            setRequestToDelete(null);
          }}
        />
      )}
    </div>
  );
};

export default AdminSurrender;
