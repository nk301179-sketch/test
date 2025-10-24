import React, { useState } from 'react';
import axios from 'axios';
import './ApplicationForm.css';

const ApplicationForm = ({ dog, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    address: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const applicationData = {
        dogId: dog.id,
        type: dog.isStray ? 'ADOPTION' : 'PURCHASE',
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
        message: formData.message
      };

      const API_URL = import.meta.env.VITE_API_URL;
      const response = await axios.post(`${API_URL}/api/applications`, applicationData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.message) {
        alert('Application submitted successfully! We will contact you soon.');
        onSubmit && onSubmit(response.data);
        onClose();
      }
    } catch (err) {
      console.error('Error submitting application:', err);
      if (err.response?.status === 401) {
        setError('Please login to submit an application.');
      } else {
        setError('Failed to submit application. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="application-modal-overlay" onClick={onClose}>
      <div className="application-modal" onClick={(e) => e.stopPropagation()}>
        <div className="application-header">
          <h2>🐾 {dog.isStray ? 'Adoption' : 'Purchase'} Application</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="application-dog-info">
          <h3>{dog.name}</h3>
          <p>{dog.breed} • {dog.isStray ? 'For Adoption' : 'For Sale'}</p>
          {dog.price > 0 && <p className="price">Price: Rs. {dog.price.toLocaleString()}</p>}
        </div>

        <form onSubmit={handleSubmit} className="application-form">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="fullName">Full Name *</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              placeholder="Enter your full name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="phoneNumber">Phone Number *</label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
              placeholder="Enter your phone number"
            />
          </div>

          <div className="form-group">
            <label htmlFor="address">Address *</label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              rows="3"
              placeholder="Enter your full address"
            />
          </div>

          <div className="form-group">
            <label htmlFor="message">Additional Message</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="4"
              placeholder="Tell us why you want to adopt/purchase this dog..."
            />
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Submitting...' : `Submit ${dog.isStray ? 'Adoption' : 'Purchase'} Application`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplicationForm;
