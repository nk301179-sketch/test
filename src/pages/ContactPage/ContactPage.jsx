import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, ChevronDown, ChevronUp, MessageSquare, Edit, Trash2, Eye } from 'lucide-react';
import './ContactPage.css';

const ContactPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState(''); // 'success' or 'error'
  const [openFaq, setOpenFaq] = useState(null);
  const [userMessages, setUserMessages] = useState([]);
  const [showMessages, setShowMessages] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [editingMessage, setEditingMessage] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const faqs = [
    {
      question: "What is the adoption process?",
      answer: "Our adoption process includes filling out an application, meeting with our team, spending time with the dog, and completing the adoption paperwork. We also provide a trial period to ensure it's a perfect match for both you and the dog."
    },
    {
      question: "What are the adoption fees?",
      answer: "Adoption fees vary based on the dog's age, size, and medical needs, typically ranging from $150-$500. This fee covers vaccinations, spaying/neutering, microchipping, and initial medical care."
    },
    {
      question: "Do you accept surrendered dogs?",
      answer: "Yes, we accept dog surrenders when space allows. We require a surrender fee to cover initial medical care and ask that you provide the dog's medical history, behavioral information, and reasons for surrender."
    },
    {
      question: "How can I volunteer?",
      answer: "We welcome volunteers for dog walking, feeding, cleaning, administrative tasks, and special events. All volunteers must complete our orientation program and commit to at least 4 hours per month."
    },
    {
      question: "What should I do if I find an injured or stray dog?",
      answer: "If you find an injured dog, contact us immediately or take it to the nearest veterinary clinic. For stray dogs, check for ID tags, post on local social media groups, and contact local animal control or our rescue hotline."
    },
    {
      question: "Do you provide training services?",
      answer: "We offer basic training for adopted dogs and can recommend certified trainers in the area. Many of our dogs receive behavioral assessment and basic training while in our care to improve their adoption chances."
    },
    {
      question: "Can I visit the dogs before adopting?",
      answer: "Absolutely! We encourage potential adopters to visit and spend time with dogs they're interested in. Our facility is open for visits Tuesday-Sunday, 10 AM-6 PM. Weekend visits are by appointment only."
    }
  ];

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserMessages();
    } else {
      // For guest users, we can't fetch their messages since they're not authenticated
      // The messages will be visible to admins only
      setUserMessages([]);
    }
  }, [isAuthenticated]);

  const fetchUserMessages = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token found, skipping user messages fetch');
        setUserMessages([]);
        return;
      }

      const API_URL = import.meta.env.VITE_API_URL;
      const response = await fetch(`${API_URL}/api/contact-messages/my-messages`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const messages = await response.json();
        setUserMessages(messages);
      } else {
        console.error('Failed to fetch user messages');
        setUserMessages([]);
      }
    } catch (error) {
      console.error('Error fetching user messages:', error);
      setUserMessages([]);
    }
  };

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check authentication first
    if (!isAuthenticated) {
      alert('Please login or register to send a message');
      navigate('/login');
      return;
    }

    setStatus('sending');
    try {
      const token = localStorage.getItem('token');
      const API_URL = import.meta.env.VITE_API_URL;
      const response = await fetch(`${API_URL}/api/contact-messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', message: '' }); // Clear form
        fetchUserMessages(); // Refresh user messages
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error('Submission error:', error);
      setStatus('error');
    }
  };

  const handleEditMessage = (message) => {
    setEditingMessage(message);
    setEditFormData({
      name: message.name,
      email: message.email,
      message: message.message
    });
  };

  const handleEditChange = (e) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdateMessage = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8084/api/contact-messages/${editingMessage.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editFormData)
      });

      if (response.ok) {
        setEditingMessage(null);
        fetchUserMessages(); // Refresh user messages
      } else {
        alert('Failed to update message');
      }
    } catch (error) {
      console.error('Error updating message:', error);
      alert('Error updating message');
    }
  };

  const handleDeleteMessage = async (messageId) => {
    if (!window.confirm('Are you sure you want to delete this message?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8084/api/contact-messages/${messageId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        fetchUserMessages(); // Refresh user messages
      } else {
        alert('Failed to delete message');
      }
    } catch (error) {
      console.error('Error deleting message:', error);
      alert('Error deleting message');
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="contact-page-container"
    >
      <div className="contact-header">
        <h2 className="contact-title">Get in Touch</h2>
        <p className="contact-description">
          We'd love to hear from you! Send us a message or find our contact information below.
        </p>
        {!isAuthenticated && (
          <div className="auth-warning" style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(255, 193, 7, 0.1)', border: '1px solid rgba(255, 193, 7, 0.3)', borderRadius: '0.5rem' }}>
            <p style={{ margin: 0, color: '#ffc107', textAlign: 'center' }}>⚠️ You must be logged in to send a message</p>
          </div>
        )}
      </div>

      <div className="form-section">
        <form onSubmit={handleSubmit} className="contact-form">
          <div className="form-group">
            <label htmlFor="name" className="form-label">Full name</label>
            <input
              type="text"
              name="name"
              id="name"
              autoComplete="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email address</label>
            <input
              type="email"
              name="email"
              id="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="message" className="form-label">Message</label>
            <textarea
              name="message"
              id="message"
              rows="4"
              value={formData.message}
              onChange={handleChange}
              required
              className="form-textarea"
            />
          </div>
          <button
            type="submit"
            className="form-button"
            disabled={status === 'sending'}
          >
            {status === 'sending' ? 'Sending...' : 'Send message'}
          </button>
          {status === 'success' && <p className="form-success-message">Message sent successfully!</p>}
          {status === 'error' && <p className="form-error-message">Failed to send message. Please try again.</p>}
        </form>
      </div>

      {/* User Messages Section */}
      {isAuthenticated ? (
        <div className="user-messages-section">
          <div className="messages-header">
            <h3 className="messages-title">Your Messages</h3>
            <button 
              className="toggle-messages-btn"
              onClick={() => setShowMessages(!showMessages)}
            >
              <MessageSquare className="messages-icon" />
              {showMessages ? 'Hide Messages' : 'Show Messages'} ({userMessages.length})
            </button>
          </div>
          
          {showMessages && (
            <div className="messages-list">
              {userMessages.length === 0 ? (
                <div className="no-messages">
                  <MessageSquare className="no-messages-icon" />
                  <p>You haven't sent any messages yet.</p>
                </div>
              ) : (
                userMessages.map((message) => (
                  <div key={message.id} className="message-item">
                    <div className="message-header">
                      <div className="message-info">
                        <h4 className="message-subject">Message #{message.id}</h4>
                        <div className="message-meta">
                          <span className="message-date">
                            {new Date(message.submittedAt).toLocaleDateString()} at {new Date(message.submittedAt).toLocaleTimeString()}
                          </span>
                          <span 
                            className="message-status"
                            style={{ color: getStatusColor(message.status) }}
                          >
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
                          <Eye size={16} />
                        </button>
                        {message.status === 'PENDING' && (
                          <button 
                            className="action-btn edit-btn"
                            onClick={() => handleEditMessage(message)}
                            title="Edit Message"
                          >
                            <Edit size={16} />
                          </button>
                        )}
                        <button 
                          className="action-btn delete-btn"
                          onClick={() => handleDeleteMessage(message.id)}
                          title="Delete Message"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <div className="message-preview">
                      <p>{message.message.substring(0, 100)}...</p>
                    </div>
                    {message.adminResponse && (
                      <div className="admin-response">
                        <div className="response-header">
                          <MessageSquare className="response-icon" />
                          <span className="response-label">Admin Response</span>
                        </div>
                        <p className="response-text">{message.adminResponse}</p>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="user-messages-section">
          <div className="messages-header">
            <h3 className="messages-title">Your Messages</h3>
            <button 
              className="toggle-messages-btn"
              onClick={() => setShowMessages(!showMessages)}
            >
              <MessageSquare className="messages-icon" />
              {showMessages ? 'Hide Messages' : 'Show Messages'} (0)
            </button>
          </div>
          
          {showMessages && (
            <div className="messages-list">
              <div className="no-messages">
                <MessageSquare className="no-messages-icon" />
                <p>You haven't sent any messages yet.</p>
                <p className="guest-message-note">
                  <strong>Note:</strong> As a guest user, your messages will be visible to our admin team for review and response. 
                  To view your messages and admin responses, please <strong>login</strong> and submit messages while logged in.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="contact-info-section">
        <div className="info-card">
          <Mail className="info-icon" />
          <h3 className="info-title">Email</h3>
          <p className="info-text">info@home4paws.com</p>
        </div>
        <div className="info-card">
          <Phone className="info-icon" />
          <h3 className="info-title">Phone</h3>
          <p className="info-text">0705872977</p>
        </div>
        <div className="info-card">
          <MapPin className="info-icon" />
          <h3 className="info-title">Address</h3>
          <p className="info-text">45/2 Walikada road Borella</p>
        </div>
      </div>

      {/* FAQ Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="faq-section"
      >
        <div className="faq-header">
          <h2 className="faq-title">Frequently Asked Questions</h2>
          <p className="faq-description">
            Find answers to common questions about our adoption process, services, and policies.
          </p>
        </div>
        
        <div className="faq-container">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              className={`faq-item ${openFaq === index ? 'active' : ''}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
            >
              <button
                className="faq-question"
                onClick={() => toggleFaq(index)}
                aria-expanded={openFaq === index}
              >
                <span className="faq-question-text">{faq.question}</span>
                {openFaq === index ? (
                  <ChevronUp className="faq-icon" />
                ) : (
                  <ChevronDown className="faq-icon" />
                )}
              </button>
              <motion.div
                className="faq-answer"
                initial={false}
                animate={{
                  height: openFaq === index ? 'auto' : 0,
                  opacity: openFaq === index ? 1 : 0
                }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              >
                <div className="faq-answer-content">
                  <p>{faq.answer}</p>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Message Details Modal */}
      {selectedMessage && (
        <div className="modal-overlay" onClick={() => setSelectedMessage(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Message Details</h2>
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

      {/* Edit Message Modal */}
      {editingMessage && (
        <div className="modal-overlay" onClick={() => setEditingMessage(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Message</h2>
              <button className="close-btn" onClick={() => setEditingMessage(null)}>×</button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleUpdateMessage} className="edit-form">
                <div className="form-group">
                  <label htmlFor="editName">Full name</label>
                  <input
                    type="text"
                    name="name"
                    id="editName"
                    value={editFormData.name}
                    onChange={handleEditChange}
                    required
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="editEmail">Email address</label>
                  <input
                    type="email"
                    name="email"
                    id="editEmail"
                    value={editFormData.email}
                    onChange={handleEditChange}
                    required
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="editMessage">Message</label>
                  <textarea
                    name="message"
                    id="editMessage"
                    rows="4"
                    value={editFormData.message}
                    onChange={handleEditChange}
                    required
                    className="form-textarea"
                  />
                </div>
                <div className="form-actions">
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => setEditingMessage(null)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="submit-btn"
                  >
                    Update Message
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ContactPage;
