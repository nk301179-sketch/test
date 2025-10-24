import { useState, useEffect } from 'react';
import './ReportInjuredDogs.css';
import ConfirmationModal from '../../components/ConfirmationModal/ConfirmationModal';

const ReportDog = () => {
  const [showModal, setShowModal] = useState(false);
  const [reports, setReports] = useState(() => {
    const savedReports = localStorage.getItem('reports');
    return savedReports ? JSON.parse(savedReports) : [];
  });
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
          alert('Unable to get location. Please enter manually.');
        }
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      const url = editingReport
        ? `http://localhost:8080/api/reports/${editingReport.id}`
        : 'http://localhost:8080/api/reports';

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

      const response = await fetch(url, {
        method: method,
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Backend response after submission:', result);
      console.log('Report submitted successfully:', result);

      const processedResult = {
        ...result,
        photos: result.photos || [],
        submittedAt: result.submittedAt || new Date().toISOString()
      };

      if (editingReport) {
        setReports(prev => {
          const updatedReports = prev.map(report =>
            report.id === editingReport.id ? { ...processedResult, photos: result.photos || [] } : report
          );
          localStorage.setItem('reports', JSON.stringify(updatedReports));
          return updatedReports;
        });
        setEditingReport(null);
      } else {
        setReports(prev => {
          const updatedReports = [...prev, { ...processedResult, photos: result.photos || [] }];
          localStorage.setItem('reports', JSON.stringify(updatedReports));
          return updatedReports;
        });
      }

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
      const response = await fetch(`http://localhost:8080/api/reports/${reportToDelete}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.log(`Report ${reportToDelete} deleted successfully from backend.`);
      setReports(prev => {
        const updatedReports = prev.filter(report => report.id !== reportToDelete);
        localStorage.setItem('reports', JSON.stringify(updatedReports));
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
        <button
          className="create-request-btn"
          onClick={() => setShowModal(true)}
          disabled={isSubmitting} // Disable button during submission
        >
          {isSubmitting ? 'Submitting...' : 'Create Request'} {/* Dynamic button text */}
        </button>
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
                <label htmlFor="photos">Photos</label>
                <input
                  type="file"
                  id="photos"
                  name="photos"
                  onChange={handlePhotoUpload}
                  multiple
                  accept="image/*"
                />
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
                  <span className="timestamp">{report.submittedAt ? new Date(report.submittedAt).toLocaleDateString() : 'No date'}</span>
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

export default ReportDog;