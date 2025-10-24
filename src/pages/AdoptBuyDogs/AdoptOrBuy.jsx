import { useNavigate } from "react-router-dom"
import { DollarSign, Gift, Mail, CheckCircle, XCircle, Clock, Eye, X } from "lucide-react"
import { useAuth } from "../../contexts/AuthContext"
import { useEffect, useState } from "react"

import "./AdoptOrBuy.css"

export default function AdoptOrBuy() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [applications, setApplications] = useState([])
  const [showNotifications, setShowNotifications] = useState(false)
  const [selectedApplication, setSelectedApplication] = useState(null)

  // Fetch user applications if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchApplications()
    }
  }, [isAuthenticated])

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return

      const API_URL = import.meta.env.VITE_API_URL;
      const response = await fetch(`${API_URL}/api/applications/my-applications`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        setApplications(data)
      }
    } catch (error) {
      console.error('Error fetching applications:', error)
    }
  }

  // Helper functions for application notifications
  const getStatusIcon = (status) => {
    switch (status) {
      case 'APPROVED':
        return <CheckCircle className="status-icon approved" />
      case 'REJECTED':
        return <XCircle className="status-icon rejected" />
      case 'PENDING':
        return <Clock className="status-icon pending" />
      default:
        return <Clock className="status-icon pending" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'APPROVED':
        return '#48bb78'
      case 'REJECTED':
        return '#e53e3e'
      case 'PENDING':
        return '#ed8936'
      default:
        return '#a0aec0'
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // Get applications with responses (approved/rejected) - both adoption and purchase
  const applicationsWithResponses = applications.filter(app => 
    app.status === 'APPROVED' || app.status === 'REJECTED'
  )

  return (
    <div className="adoptbuy-container">
      <h1 className="title">🐾 Welcome to Home4Paws 🐾</h1>
      <p className="subtitle">Do you want to buy or adopt a dog?</p>

      {/* Application Notifications Mailbox */}
      {isAuthenticated && applicationsWithResponses.length > 0 && (
        <div className="notifications-section">
          <button 
            className="notifications-toggle"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Mail className="mail-icon" />
            Application Updates ({applicationsWithResponses.length})
          </button>
          
          {showNotifications && (
            <div className="notifications-dropdown">
              <div className="notifications-header">
                <h3>Application Updates</h3>
                <button 
                  className="close-notifications"
                  onClick={() => setShowNotifications(false)}
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="notifications-list">
                {applicationsWithResponses.map((app) => (
                  <div key={app.id} className="notification-item">
                    <div className="notification-header">
                      <div className="notification-status">
                        {getStatusIcon(app.status)}
                        <span 
                          className="status-text"
                          style={{ color: getStatusColor(app.status) }}
                        >
                          {app.status}
                        </span>
                      </div>
                      <span className="notification-date">
                        {formatDate(app.processedAt || app.submittedAt)}
                      </span>
                    </div>
                    
                    <div className="notification-content">
                      <p className="notification-title">
                        {app.type} Application for Dog #{app.dogId}
                      </p>
                      {app.adminNotes && (
                        <p className="notification-message">
                          {app.adminNotes}
                        </p>
                      )}
                    </div>
                    
                    <button 
                      className="view-details-btn"
                      onClick={() => setSelectedApplication(app)}
                    >
                      <Eye size={16} />
                      View Details
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="options">
        {/* Buy Card */}
        <div className="option-card" onClick={() => navigate("/dogs/buy")}>
          <div className="icon-wrapper buy">
            <DollarSign className="icon" />
          </div>
          <h2>Buy a Dog</h2>
          <p>Browse premium breed dogs from trusted breeders.</p>
          <button className="buy-btn">Explore Dogs for Sale</button>
        </div>

        {/* Adopt Card */}
        <div className="option-card" onClick={() => navigate("/dogs/adopt")}>
          <div className="icon-wrapper adopt">
            <Gift className="icon" />
          </div>
          <h2>Adopt a Dog</h2>
          <p>Give a stray dog a loving forever home.</p>
          <button className="adopt-btn">See Dogs for Adoption</button>
        </div>
      </div>

      {/* Application Details Modal */}
      {selectedApplication && (
        <div className="modal-overlay" onClick={() => setSelectedApplication(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Application Details</h2>
              <button 
                className="close-btn"
                onClick={() => setSelectedApplication(null)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="message-details">
                <div className="detail-row">
                  <label>Application Type:</label>
                  <span>{selectedApplication.type}</span>
                </div>
                <div className="detail-row">
                  <label>Dog ID:</label>
                  <span>{selectedApplication.dogId}</span>
                </div>
                <div className="detail-row">
                  <label>Status:</label>
                  <span style={{ color: getStatusColor(selectedApplication.status) }}>
                    {selectedApplication.status}
                  </span>
                </div>
                <div className="detail-row">
                  <label>Full Name:</label>
                  <span>{selectedApplication.fullName}</span>
                </div>
                <div className="detail-row">
                  <label>Email:</label>
                  <span>{selectedApplication.email}</span>
                </div>
                <div className="detail-row">
                  <label>Phone:</label>
                  <span>{selectedApplication.phoneNumber}</span>
                </div>
                <div className="detail-row">
                  <label>Address:</label>
                  <span>{selectedApplication.address}</span>
                </div>
                <div className="detail-row">
                  <label>Message:</label>
                  <div className="message-detail-text">{selectedApplication.message}</div>
                </div>
                {selectedApplication.adminNotes && (
                  <div className="detail-row">
                    <label>Admin Response:</label>
                    <div className="response-detail-text">{selectedApplication.adminNotes}</div>
                  </div>
                )}
                <div className="detail-row">
                  <label>Submitted:</label>
                  <span>{formatDate(selectedApplication.submittedAt)}</span>
                </div>
                {selectedApplication.processedAt && (
                  <div className="detail-row">
                    <label>Processed:</label>
                    <span>{formatDate(selectedApplication.processedAt)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

