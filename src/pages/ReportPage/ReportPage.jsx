import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './ReportPage.css';
import ConfirmationModal from '../../components/ConfirmationModal/ConfirmationModal';

const ReportPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    document.body.classList.add('report-page-active');
    return () => {
      document.body.classList.remove('report-page-active');
    };
  }, []);

  const [showModal, setShowModal] = useState(false);
  const [reports, setReports] = useState([]);
  const [editingReport, setEditingReport] = useState(null);
  const [reportToDelete, setReportToDelete] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // New state for submission status
  const [phoneError, setPhoneError] = useState(''); // New state for phone number error
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    description: '',
    location: '',
    photos: []
  });

  const [photoPreviews, setPhotoPreviews] = useState([]);

  // Load user-specific reports on component mount
  useEffect(() => {
    if (isAuthenticated && user) {
      const userId = user.id || user.username; // Use id if available, fallback to username
      console.log('Loading reports for user:', userId);
      
      // Always fetch from backend first to get latest data
      fetchReportsFromBackend();
    } else {
      console.log('User not authenticated, clearing reports');
      setReports([]); // Clear reports for guests
    }
  }, [isAuthenticated, user]);

  // Fetch reports from backend
  const fetchReportsFromBackend = async () => {
    try {
      console.log('Fetching reports from backend...');
      console.log('Current user:', user);
      
      if (!isAuthenticated || !user) {
        console.log('User not authenticated, cannot fetch reports');
        setReports([]);
        return;
      }
      
      // Use the new user-specific endpoint
      const API_URL = import.meta.env.VITE_API_URL;
      const url = `${API_URL}/api/reports/my-reports`;
      console.log('Using endpoint:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Backend response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched reports from backend:', data);
        console.log('Number of reports found:', data.length);
        
        setReports(data);
        // Store in localStorage for this user
        const userId = user.id || user.username;
        localStorage.setItem(`reports_${userId}`, JSON.stringify(data));
        console.log('Stored reports in localStorage for user:', userId);
      } else {
        console.error('Backend response not ok:', response.status, response.statusText);
        const errorText = await response.text();
        console.error('Error details:', errorText);
      }
    } catch (error) {
      console.error('Error fetching reports from backend:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'phone') {
      const numericValue = value.replace(/[^0-9]/g, ''); // Remove non-numeric characters
      if (numericValue.length > 10) {
        setPhoneError('Phone number cannot exceed 10 digits.');
      } else if (!/^[0-9]*$/.test(value)) {
        setPhoneError('Phone number can only contain digits.');
      } else {
        setPhoneError('');
      }
      setFormData(prev => ({
        ...prev,
        [name]: numericValue
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    const MAX_PHOTOS = 5;
    
    // Check if adding these files would exceed the limit
    if (formData.photos.length + files.length > MAX_PHOTOS) {
      alert(`Maximum ${MAX_PHOTOS} photos allowed. You currently have ${formData.photos.length} photos and are trying to add ${files.length} more.`);
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      photos: [...prev.photos, ...files]
    }));
    setPhotoPreviews(prev => [...prev, ...files.map(file => URL.createObjectURL(file))]);
  };

  const handleRemovePhoto = (index) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
    setPhotoPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      const options = {
        enableHighAccuracy: true,
        timeout: 10000, // 10 seconds
        maximumAge: 0 // Don't use cached position
      };
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // In a real app, you'd use Google Maps API to get the address
          setFormData(prev => ({
            ...prev,
            location: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
          }));
        },
        (error) => {
          console.error("Geolocation error:", error);
          let errorMessage = 'Unable to get location. Please enter manually.';
          if (error.code === error.PERMISSION_DENIED) {
            errorMessage = 'Location permission denied. Please enable it in your browser settings.';
          } else if (error.code === error.POSITION_UNAVAILABLE) {
            errorMessage = 'Location information is unavailable.';
          } else if (error.code === error.TIMEOUT) {
            errorMessage = 'The request to get user location timed out.';
          }
          alert(errorMessage);
        },
        options
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check authentication first
    if (!isAuthenticated) {
      alert('Please login or register to submit a report');
      navigate('/login');
      return;
    }

    if (!formData.name || !formData.phone || !formData.description) {
      alert('Please fill in all required fields');
      return;
    }

    if (phoneError) {
      alert(phoneError);
      return;
    }

    setIsSubmitting(true);

    try {
      const method = editingReport ? 'PUT' : 'POST';
      const API_URL = import.meta.env.VITE_API_URL;
      const url = editingReport
        ? `${API_URL}/api/reports/${editingReport.id}`
        : `${API_URL}/api/reports`;

      const formDataToSend = new FormData();
      const reportData = {
        name: formData.name,
        phone: formData.phone,
        description: formData.description,
        location: formData.location,
      };

      // --- ADD THESE NEW CONSOLE.LOGS ---
      console.log('Frontend formData state before FormData construction:', formData);
      console.log('Report data being JSON.stringified:', reportData);
      // --- END NEW CONSOLE.LOGS ---

      // Append the report data as a JSON string under the key 'report'
      formDataToSend.append('report', JSON.stringify(reportData));

      // Append each photo file under the key 'photos'
      formData.photos.forEach((photo) => {
        formDataToSend.append('photos', photo);
      });

      // --- ADD THIS NEW CONSOLE.LOG TO INSPECT FormData content ---
      console.log('Inspecting FormDataToSend entries:');
      for (let [key, value] of formDataToSend.entries()) {
          console.log(`${key}:`, value);
      }
      // --- END NEW CONSOLE.LOG ---

      console.log('FormData being sent (should now show contents in console.log above):', formDataToSend);

      console.log('Submitting with user context:', {
        currentUser: user,
        userId: user?.id,
        username: user?.username,
        token: localStorage.getItem('token') ? 'Present' : 'Missing'
      });

      const response = await fetch(url, {
        method: method,
        body: formDataToSend,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      console.log('Submission response status:', response.status);
      console.log('Submission response headers:', response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Submission failed:', response.status, errorText);
        
        // Handle specific error cases
        if (response.status === 404) {
          alert('Report not found. It may have been deleted. Please refresh the page and try again.');
          window.location.reload(); // Refresh the page to get updated data
          return;
        } else if (response.status === 500) {
          try {
            const errorData = JSON.parse(errorText);
            if (errorData.message && errorData.message.includes('Report not found')) {
              alert('Report not found. It may have been deleted. Please refresh the page and try again.');
              window.location.reload(); // Refresh the page to get updated data
              return;
            }
          } catch (e) {
            // If we can't parse the error, show generic message
          }
        }
        
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Backend response after submission:', result);
      console.log('Report submitted successfully:', result);
      console.log('Result user info:', {
        userId: result.userId,
        user: result.user,
        username: result.username,
        currentUser: user
      });
      
      // Immediately fetch fresh data from backend after successful submission
      console.log('Fetching fresh data after submission...');
      await fetchReportsFromBackend();

      setFormData({ name: '', phone: '', description: '', location: '', photos: [] });
      setPhotoPreviews([]);
      setShowModal(false);
    } catch (error) {
      console.error('Error submitting report:', error);
      alert('Failed to submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (report) => {
    setEditingReport(report);
    setFormData({
      name: report.name,
      phone: report.phone,
      description: report.description,
      location: report.location,
      photos: report.photos // These are already URLs from the backend
    });
    setPhotoPreviews(report.photos); // Use existing URLs for preview
    setShowModal(true);
  };

  // Modified handleDelete to show custom modal
  const handleDelete = (id) => {
    setReportToDelete(id);
  };

  const confirmDelete = async () => {
    try {
      console.log('Deleting report with user context:', {
        currentUser: user,
        userId: user?.id,
        username: user?.username,
        token: localStorage.getItem('token') ? 'Present' : 'Missing',
        reportId: reportToDelete
      });

      const API_URL = import.meta.env.VITE_API_URL;
      const response = await fetch(`${API_URL}/api/reports/${reportToDelete}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Delete response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Delete failed:', response.status, errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.log(`Report ${reportToDelete} deleted successfully from backend.`);
      setReports(prev => {
        const updatedReports = prev.filter(report => report.id !== reportToDelete);
        // Update user-specific storage
        if (user) {
          const userId = user.id || user.username;
          localStorage.setItem(`reports_${userId}`, JSON.stringify(updatedReports));
        }
        return updatedReports;
      });
      setReportToDelete(null); // Clear the report to delete
    } catch (error) {
      console.error('Error deleting report:', error);
      alert('Failed to delete report. Please try again.');
    }
  };

  const cancelDelete = () => {
    setReportToDelete(null); // Clear the report to delete
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingReport(null);
    setFormData({ name: '', phone: '', description: '', location: '', photos: [] });
    setPhotoPreviews([]);
  };

  useEffect(() => {
    if (editingReport) {
      setFormData({
        name: editingReport.name,
        phone: editingReport.phone,
        description: editingReport.description,
        location: editingReport.location,
        photos: editingReport.photos // Assuming editingReport.photos contains File objects or similar
      });
      // Generate photo previews for existing photos
      setPhotoPreviews(editingReport.photos.map(photo => {
        if (typeof photo === 'string') {
          return photo; // If photo is already a URL (e.g., from a saved report)
        } else {
          return URL.createObjectURL(photo); // If photo is a File object
        }
      }));
    } else {
      setFormData({
        name: '',
        phone: '',
        description: '',
        location: '',
        photos: []
      });
      setPhotoPreviews([]);
    }
  }, [editingReport]);

  return (
    <div className="report-dog-container">
      <div className="hero-section">
        <h2 className="hero-title">Help them</h2>
        <p className="hero-subtitle">
          Every lost or injured dog deserves to find their way home or trated. Report a missing or injured dogs to help our community reunite families.
        </p>
        {!isAuthenticated && (
          <div className="auth-warning">
            <p>⚠️ You must be logged in to submit a report</p>
          </div>
        )}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            className="create-request-btn"
            onClick={() => {
              if (!isAuthenticated) {
                alert('Please login or register to submit a report');
                navigate('/login');
              } else {
                setShowModal(true);
              }
            }}
            disabled={isSubmitting} // Disable button during submission
          >
            {isSubmitting ? 'Submitting...' : 'Create Request'} {/* Dynamic button text */}
          </button>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingReport ? 'Edit Report' : 'Report Lost Pet'}</h3>
              <button className="close-btn" onClick={closeModal}>×</button>
            </div>

            <form onSubmit={handleSubmit} className="report-form">
              <div className="form-group">
                <label htmlFor="name">Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Your full name"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Your contact number"
                  required
                />
                {phoneError && <p className="error-message">{phoneError}</p>}
              </div>

              <div className="form-group">
                <label htmlFor="description">Description *</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your pet (breed, color, size, distinctive features...)"
                  rows={4}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="location">Location</label>
                <div className="location-input">
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="Where was your pet last seen?"
                  />
                  <button
                    type="button"
                    className="location-btn"
                    onClick={getCurrentLocation}
                  >
                    📍 Get Location
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="photos">Photos ({formData.photos.length}/5)</label>
                <input
                  type="file"
                  id="photos"
                  name="photos"
                  onChange={handlePhotoUpload}
                  multiple
                  accept="image/*"
                />
                <small className="photo-limit-text">Maximum 5 photos allowed</small>
                <div className="photo-previews">
                  {photoPreviews.map((preview, index) => (
                    <div key={index} className="photo-preview-item">
                      <img src={preview} alt="Preview" className="photo-thumbnail" />
                      <button
                        type="button"
                        className="remove-photo-btn"
                        onClick={() => handleRemovePhoto(index)}
                      >
                        X
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="submit-btn" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : (editingReport ? 'Update Report' : 'Submit Report')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reports List */}
      <div className="reports-section">
        <h3>Recent Reports</h3>
        {reports.length === 0 ? (
          <div className="no-reports">
            <p>No reports yet. Be the first to report a lost pet!</p>
          </div>
        ) : (
          <div className="reports-grid">
            {reports.map(report => (
              <div key={report.id} className="report-card">
                <div className="report-header">
                  <h4>{report.name}</h4>
                  <div className="report-meta">
                    <span className="timestamp">
                      {report.submittedAt ? new Date(report.submittedAt).toLocaleDateString() : 'No date'}
                    </span>
                    {report.status && (
                      <span className={`status-badge ${report.status.toLowerCase()}`}>
                        {report.status}
                      </span>
                    )}
                  </div>
                </div>

                <div className="report-content">
                  <p className="description">{report.description}</p>
                  {report.location && (
                    <p className="location">📍 {report.location}</p>
                  )}
                  <p className="contact">📞 {report.phone}</p>

                  {report.photos && report.photos.length > 0 && (
                    <div className="report-photos">
                      {(report.photos || []).map((photo, index) => (
                        <img key={index} src={photo} alt={`Pet ${index + 1}`} />
                      ))}
                    </div>
                  )}
                </div>

                <div className="report-actions">
                  <button
                    className="edit-btn"
                    onClick={() => handleEdit(report)}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(report.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {reportToDelete && (
        <ConfirmationModal
          message="Are you sure you want to delete this report?"
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
    </div>
  );
};

export default ReportPage;