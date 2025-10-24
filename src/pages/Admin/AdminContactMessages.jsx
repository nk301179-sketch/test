import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, User, Calendar, MessageSquare, Trash2, Edit, CheckCircle, Clock, AlertCircle, Eye, Reply } from 'lucide-react';
import './AdminContactMessages.css';

const AdminContactMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [adminResponse, setAdminResponse] = useState('');
  const [responseLoading, setResponseLoading] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const API_URL = import.meta.env.VITE_API_URL;
      const response = await fetch(`${API_URL}/api/admin/contact-messages`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      } else {
        setError('Failed to fetch contact messages');
      }
    } catch (err) {
      setError('Error fetching contact messages');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (messageId, newStatus) => {
    try {
      const token = localStorage.getItem('adminToken');
      const API_URL = import.meta.env.VITE_API_URL;
      const response = await fetch(`${API_URL}/api/admin/contact-messages/${messageId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        fetchMessages(); // Refresh the list
      } else {
        alert('Failed to update status');
      }
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Error updating status');
    }
  };

  const handleRespond = async () => {
    if (!adminResponse.trim()) {
      alert('Please enter a response');
      return;
    }

    try {
      setResponseLoading(true);
      const token = localStorage.getItem('adminToken');
      const API_URL = import.meta.env.VITE_API_URL;
      const response = await fetch(`${API_URL}/api/admin/contact-messages/${selectedMessage.id}/respond`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ adminResponse: adminResponse })
      });

      if (response.ok) {
        setShowResponseModal(false);
        setAdminResponse('');
        setSelectedMessage(null);
        fetchMessages(); // Refresh the list
      } else {
        alert('Failed to send response');
      }
    } catch (err) {
      console.error('Error sending response:', err);
      alert('Error sending response');
    } finally {
      setResponseLoading(false);
    }
  };

  const handleDelete = async (messageId) => {
    if (!window.confirm('Are you sure you want to delete this contact message?')) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const API_URL = import.meta.env.VITE_API_URL;
      const response = await fetch(`${API_URL}/api/admin/contact-messages/${messageId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        fetchMessages(); // Refresh the list
      } else {
        alert('Failed to delete contact message');
      }
    } catch (err) {
      console.error('Error deleting message:', err);
      alert('Error deleting message');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="status-icon pending" />;
      case 'RESPONDED':
        return <CheckCircle className="status-icon responded" />;
      case 'CLOSED':
        return <AlertCircle className="status-icon closed" />;
      default:
        return <Clock className="status-icon pending" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return '#f59e0b';
      case 'RESPONDED':
        return '#10b981';
      case 'CLOSED':
        return '#6b7280';
      default:
        return '#f59e0b';
    }
  };

  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.message?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || message.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="admin-contact-messages">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading contact messages...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-contact-messages">
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button onClick={fetchMessages} className="retry-button">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-contact-messages">
      <div className="admin-header">
        <div className="header-content">
          <div className="header-title">
            <MessageSquare className="header-icon" />
            <h1>Contact Messages</h1>
            <p>Manage user contact messages and responses</p>
          </div>
          <div className="header-stats">
            <div className="stat-card">
              <div className="stat-number">{messages.length}</div>
              <div className="stat-label">Total Messages</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{messages.filter(m => m.status === 'PENDING').length}</div>
              <div className="stat-label">Pending</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{messages.filter(m => m.status === 'RESPONDED').length}</div>
              <div className="stat-label">Responded</div>
            </div>
          </div>
        </div>
      </div>

      <div className="filters-section">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search by name, email, or message..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="filter-container">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="status-filter"
          >
            <option value="ALL">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="RESPONDED">Responded</option>
            <option value="CLOSED">Closed</option>
          </select>
        </div>
      </div>

      <div className="messages-grid">
        {filteredMessages.map((message) => (
          <motion.div
            key={message.id}
            className="message-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="message-header">
              <div className="message-info">
                <div className="message-sender">
                  <User className="sender-icon" />
                  <div className="sender-details">
                    <h3 className="sender-name">{message.name}</h3>
                    <p className="sender-email">{message.email}</p>
                    {message.user && (
                      <div className="user-account-info">
                        <User className="user-icon" />
                        <span className="user-details">
                          {message.user.username} ({message.user.email})
                        </span>
                      </div>
                    )}
                    {!message.user && (
                      <div className="user-account-info guest">
                        <User className="user-icon" />
                        <span className="user-details">Guest User</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="message-status">
                  {getStatusIcon(message.status)}
                  <span className="status-text" style={{ color: getStatusColor(message.status) }}>
                    {message.status}
                  </span>
                </div>
              </div>
              <div className="message-actions">
                <button
                  className="action-btn view-btn"
                  onClick={() => setSelectedMessage(message)}
                  title="View Details"
                >
                  <Eye size={20} />
                </button>
                {message.status === 'PENDING' && (
                  <button
                    className="action-btn respond-btn"
                    onClick={() => {
                      setSelectedMessage(message);
                      setShowResponseModal(true);
                    }}
                    title="Respond"
                  >
                    <Reply size={20} />
                  </button>
                )}
                <button
                  className="action-btn delete-btn"
                  onClick={() => handleDelete(message.id)}
                  title="Delete"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
            
            <div className="message-content">
              <p className="message-text">{message.message}</p>
            </div>

            <div className="message-footer">
              <div className="message-meta">
                <Calendar className="meta-icon" />
                <span className="meta-text">
                  {new Date(message.submittedAt).toLocaleDateString()} at {new Date(message.submittedAt).toLocaleTimeString()}
                </span>
              </div>
              <div className="status-actions">
                <select
                  value={message.status}
                  onChange={(e) => handleStatusUpdate(message.id, e.target.value)}
                  className="status-select"
                >
                  <option value="PENDING">Pending</option>
                  <option value="RESPONDED">Responded</option>
                  <option value="CLOSED">Closed</option>
                </select>
              </div>
            </div>

            {message.adminResponse && (
              <div className="admin-response">
                <div className="response-header">
                  <MessageSquare className="response-icon" />
                  <span className="response-label">Admin Response</span>
                </div>
                <p className="response-text">{message.adminResponse}</p>
                {message.respondedAt && (
                  <div className="response-meta">
                    <Calendar className="meta-icon" />
                    <span className="meta-text">
                      Responded on {new Date(message.respondedAt).toLocaleDateString()} at {new Date(message.respondedAt).toLocaleTimeString()}
                    </span>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {filteredMessages.length === 0 && (
        <div className="empty-state">
          <MessageSquare className="empty-icon" />
          <h3>No contact messages found</h3>
          <p>No messages match your current filters.</p>
        </div>
      )}

      {/* Message Details Modal */}
      {selectedMessage && !showResponseModal && (
        <div className="modal-overlay" onClick={() => setSelectedMessage(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Contact Message Details</h2>
              <button className="close-btn" onClick={() => setSelectedMessage(null)}>×</button>
            </div>
            <div className="modal-body">
              <div className="message-details">
                <div className="detail-row">
                  <label>From:</label>
                  <span>{selectedMessage.name} ({selectedMessage.email})</span>
                </div>
                <div className="detail-row">
                  <label>Status:</label>
                  <span style={{ color: getStatusColor(selectedMessage.status) }}>
                    {selectedMessage.status}
                  </span>
                </div>
                <div className="detail-row">
                  <label>Submitted:</label>
                  <span>{new Date(selectedMessage.submittedAt).toLocaleString()}</span>
                </div>
                <div className="detail-row">
                  <label>Message:</label>
                  <div className="message-detail-text">{selectedMessage.message}</div>
                </div>
                {selectedMessage.adminResponse && (
                  <div className="detail-row">
                    <label>Admin Response:</label>
                    <div className="response-detail-text">{selectedMessage.adminResponse}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Response Modal */}
      {showResponseModal && (
        <div className="modal-overlay" onClick={() => setShowResponseModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Respond to Message</h2>
              <button className="close-btn" onClick={() => setShowResponseModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="response-form">
                <div className="form-group">
                  <label>Original Message:</label>
                  <div className="original-message">{selectedMessage?.message}</div>
                </div>
                <div className="form-group">
                  <label htmlFor="adminResponse">Your Response:</label>
                  <textarea
                    id="adminResponse"
                    value={adminResponse}
                    onChange={(e) => setAdminResponse(e.target.value)}
                    placeholder="Enter your response here..."
                    rows="6"
                    className="response-textarea"
                  />
                </div>
                <div className="form-actions">
                  <button
                    className="cancel-btn"
                    onClick={() => setShowResponseModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="submit-btn"
                    onClick={handleRespond}
                    disabled={responseLoading}
                  >
                    {responseLoading ? 'Sending...' : 'Send Response'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminContactMessages;
