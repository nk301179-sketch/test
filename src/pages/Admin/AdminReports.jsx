import React, { useState, useEffect } from 'react';
import { AlertTriangle, Search, Eye, Trash2, User, Phone, MapPin, Calendar, Image } from 'lucide-react';
import ConfirmationModal from '../../components/ConfirmationModal/ConfirmationModal';
import './AdminReports.css';

const AdminReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReport, setSelectedReport] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [reportToDelete, setReportToDelete] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const API_URL = import.meta.env.VITE_API_URL;
      const response = await fetch(`${API_URL}/api/admin/reports`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setReports(data);
    } catch (error) {
      console.error('Error fetching reports:', error);
      setError('Failed to fetch reports. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (reportId) => {
    setReportToDelete(reportId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const response = await fetch(`${API_URL}/api/admin/reports/${reportToDelete}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setReports(prev => prev.filter(report => report.id !== reportToDelete));
      setShowDeleteModal(false);
      setReportToDelete(null);
    } catch (error) {
      console.error('Error deleting report:', error);
      setError('Failed to delete report. Please try again.');
    }
  };

  const handleStatusUpdate = async (reportId, newStatus) => {
    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const response = await fetch(`${API_URL}/api/admin/reports/${reportId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        // Update the report in the local state
        setReports(prev => prev.map(report => 
          report.id === reportId 
            ? { ...report, status: newStatus }
            : report
        ));
      } else {
        throw new Error('Failed to update report status');
      }
    } catch (error) {
      console.error('Error updating report status:', error);
      setError('Failed to update report status. Please try again.');
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

  const filteredReports = reports.filter(report =>
    report.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.phone?.includes(searchTerm)
  );

  if (loading) {
    return (
      <div className="admin-reports-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-reports-container">
      {/* Header */}
      <div className="admin-page-header">
        <div className="page-title-section">
          <AlertTriangle className="page-icon" />
          <div>
            <h2>Report Management</h2>
            <p>View and manage lost/injured dog reports</p>
          </div>
        </div>
        <div className="page-stats">
          <div className="stat-card">
            <AlertTriangle className="stat-icon" />
            <div>
              <span className="stat-number">{reports.length}</span>
              <span className="stat-label">Total Reports</span>
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
            placeholder="Search reports by name, description, location, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <button onClick={fetchReports} className="refresh-btn">
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

      {/* Reports List */}
      <div className="admin-table-container">
        {filteredReports.length === 0 ? (
          <div className="empty-state">
            <AlertTriangle className="empty-icon" />
            <h3>No reports found</h3>
            <p>{searchTerm ? 'Try adjusting your search terms' : 'No reports have been submitted yet'}</p>
          </div>
        ) : (
          <div className="reports-grid">
            {filteredReports.map(report => (
              <div key={report.id} className="report-card">
                <div className="report-header">
                  <div className="report-info">
                    <h4 className="report-name">{report.name}</h4>
                    <span className="report-timestamp">{formatDate(report.submittedAt)}</span>
                    <div className="report-status">
                      <span className={`status-badge ${report.status?.toLowerCase() || 'pending'}`}>
                        {report.status || 'PENDING'}
                      </span>
                    </div>
                    {report.user && (
                      <div className="user-info">
                        <User className="user-icon" />
                        <span className="user-details">
                          {report.user.username} ({report.user.email})
                        </span>
                      </div>
                    )}
                    {!report.user && (
                      <div className="user-info guest">
                        <User className="user-icon" />
                        <span className="user-details">Guest User</span>
                      </div>
                    )}
                  </div>
                  <div className="report-actions">
                    <select
                      value={report.status || 'PENDING'}
                      onChange={(e) => handleStatusUpdate(report.id, e.target.value)}
                      className="status-select"
                      title="Update Status"
                    >
                      <option value="PENDING">Pending</option>
                      <option value="TOOK_ACTION">Took Action</option>
                      <option value="RESOLVED">Resolved</option>
                    </select>
                    <button
                      onClick={() => setSelectedReport(report)}
                      className="action-btn view-btn"
                      title="View Details"
                    >
                      <Eye size={20} />
                    </button>
                    <button
                      onClick={() => handleDelete(report.id)}
                      className="action-btn delete-btn"
                      title="Delete Report"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>

                <div className="report-content">
                  <div className="report-description">
                    <p>{report.description}</p>
                  </div>

                  <div className="report-details">
                    <div className="detail-item">
                      <Phone className="detail-icon" />
                      <span>{report.phone}</span>
                    </div>
                    {report.location && (
                      <div className="detail-item">
                        <MapPin className="detail-icon" />
                        <span>{report.location}</span>
                      </div>
                    )}
                  </div>

                  {report.photos && report.photos.length > 0 && (
                    <div className="report-photos">
                      <div className="photos-header">
                        <Image className="photos-icon" />
                        <span>Photos ({report.photos.length})</span>
                      </div>
                      <div className="photos-grid">
                        {report.photos.slice(0, 3).map((photo, index) => (
                          <img
                            key={index}
                            src={photo}
                            alt={`Report photo ${index + 1}`}
                            className="photo-thumbnail"
                          />
                        ))}
                        {report.photos.length > 3 && (
                          <div className="more-photos">
                            +{report.photos.length - 3} more
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Report Details Modal */}
      {selectedReport && (
        <div className="modal-overlay" onClick={() => setSelectedReport(null)}>
          <div className="modal-content report-details-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Report Details</h3>
              <button className="close-btn" onClick={() => setSelectedReport(null)}>×</button>
            </div>
            <div className="report-details-content">
              <div className="detail-section">
                <h4>Report Information</h4>
                <div className="detail-grid">
                  <div className="detail-field">
                    <label>Report ID</label>
                    <span>{selectedReport.id}</span>
                  </div>
                  <div className="detail-field">
                    <label>Submitted Date</label>
                    <span>{formatDate(selectedReport.submittedAt)}</span>
                  </div>
                  <div className="detail-field">
                    <label>Status</label>
                    <span className={`status-badge ${selectedReport.status?.toLowerCase() || 'pending'}`}>
                      {selectedReport.status || 'PENDING'}
                    </span>
                  </div>
                  {selectedReport.submittedAt && (
                    <div className="detail-field">
                      <label>Submitted At</label>
                      <span>{formatDate(selectedReport.submittedAt)}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="detail-section">
                <h4>Reporter Information</h4>
                <div className="detail-grid">
                  <div className="detail-field">
                    <label>Name (from form)</label>
                    <span>{selectedReport.name}</span>
                  </div>
                  <div className="detail-field">
                    <label>Phone</label>
                    <span>{selectedReport.phone}</span>
                  </div>
                  <div className="detail-field">
                    <label>Location</label>
                    <span>{selectedReport.location || 'Not provided'}</span>
                  </div>
                </div>
              </div>

              {selectedReport.user && (
                <div className="detail-section">
                  <h4>User Account Information</h4>
                  <div className="detail-grid">
                    <div className="detail-field">
                      <label>User ID</label>
                      <span>{selectedReport.user.id}</span>
                    </div>
                    <div className="detail-field">
                      <label>Username</label>
                      <span>{selectedReport.user.username}</span>
                    </div>
                    <div className="detail-field">
                      <label>Email</label>
                      <span>{selectedReport.user.email}</span>
                    </div>
                    <div className="detail-field">
                      <label>Full Name</label>
                      <span>{selectedReport.user.firstName} {selectedReport.user.lastName}</span>
                    </div>
                  </div>
                </div>
              )}

              {!selectedReport.user && (
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
                <h4>Report Description</h4>
                <div className="description-content">
                  <p>{selectedReport.description}</p>
                </div>
              </div>

              {selectedReport.photos && selectedReport.photos.length > 0 && (
                <div className="detail-section">
                  <h4>Photos ({selectedReport.photos.length})</h4>
                  <div className="photos-gallery">
                    {selectedReport.photos.map((photo, index) => (
                      <div key={index} className="photo-item">
                        <img
                          src={photo}
                          alt={`Report photo ${index + 1}`}
                          className="gallery-photo"
                        />
                      </div>
                    ))}
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
          message="Are you sure you want to delete this report? This action cannot be undone."
          onConfirm={confirmDelete}
          onCancel={() => {
            setShowDeleteModal(false);
            setReportToDelete(null);
          }}
        />
      )}
    </div>
  );
};

export default AdminReports;
