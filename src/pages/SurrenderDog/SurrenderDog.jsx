import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './SurrenderDog.css';
import ConfirmationModal from '../../components/ConfirmationModal/ConfirmationModal';
import RequestCard from '../../components/Header/RequestCard';

const SurrenderDog = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  // Add/remove class to body for background image
  useEffect(() => {
    document.body.classList.add("surrender-dog-page-active");
    return () => {
      document.body.classList.remove("surrender-dog-page-active");
    };
  }, []);

  const [showModal, setShowModal] = useState(false);
  const [surrenderDogs, setSurrenderDogs] = useState([]); // Initialize as empty, will fetch from backend
  const [editingSurrenderDog, setEditingSurrenderDog] = useState(null);
  const [surrenderDogToDelete, setSurrenderDogToDelete] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // New state for submission status
  const [phoneError, setPhoneError] = useState(''); // New state for phone number error
  const [dogAgeError, setDogAgeError] = useState(''); // New state for dog age error
  const [formData, setFormData] = useState({
    ownerName: '',
    ownerPhone: '',
    ownerEmail: '',
    ownerAddress: '',
    dogName: '',
    dogBreed: '',
    dogAge: 0,
    dogGender: '',
    dogSize: '',
    dogDescription: '',
    isVaccinated: false,
    isNeutered: false,
    hasMedicalIssues: false,
    medicalHistory: '',
    surrenderReason: '',
    isUrgent: false,
    preferredDate: '',
    adminNotes: '',
    // Removed dogPhotoUrl and dogPhotoFile, photos will be handled as an array of File objects
    photos: [] // This will store File objects before upload
  });

  const [photoPreviews, setPhotoPreviews] = useState([]);

  // Load user-specific surrender dogs on component mount
  useEffect(() => {
    if (isAuthenticated && user) {
      const userId = user.id || user.username; // Use id if available, fallback to username
      console.log('Loading surrender dogs for user:', userId);
      
      // Always fetch from backend first to get latest data
      fetchSurrenderDogsFromBackend();
    } else {
      console.log('User not authenticated, clearing surrender dogs');
      setSurrenderDogs([]); // Clear surrender dogs for guests
    }
  }, [isAuthenticated, user]);

  // Fetch surrender dogs from backend
  const fetchSurrenderDogsFromBackend = async () => {
    try {
      console.log('Fetching surrender dogs from backend...');
      console.log('Current user:', user);
      
      if (!isAuthenticated || !user) {
        console.log('User not authenticated, cannot fetch surrender dogs');
        setSurrenderDogs([]);
        return;
      }
      
      // Use the new user-specific endpoint
      const API_URL = import.meta.env.VITE_API_URL;
      const url = `${API_URL}/api/surrender-dogs/my-requests`;
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
        console.log('Fetched surrender dogs from backend:', data);
        const processedData = data.map(dog => ({ 
          ...dog,
          photos: dog.dogPhotoUrls || []
        }));
        setSurrenderDogs(processedData);
        // Store in localStorage for this user
        const userId = user.id || user.username;
        localStorage.setItem(`surrenderDogs_${userId}`, JSON.stringify(processedData));
        console.log('Stored surrender dogs in localStorage for user:', userId);
      } else {
        console.error('Backend response not ok:', response.status, response.statusText);
        const errorText = await response.text();
        console.error('Error details:', errorText);
      }
    } catch (error) {
      console.error('Error fetching surrender dogs from backend:', error);
    }
  };


  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === 'ownerPhone') {
      const numericValue = value.replace(/[^0-9]/g, '');
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
    } else if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else if (name === 'dogAge') {
      const age = parseInt(value);
      if (isNaN(age) || age <= 0) {
        setDogAgeError('Dog age cannot be 0 or a negative value.');
      } else {
        setDogAgeError('');
      }
      setFormData(prev => ({
        ...prev,
        [name]: age || 0 // Parse dogAge as an integer
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
      alert('Please login or register to submit a surrender request');
      navigate('/login');
      return;
    }

    if (!formData.ownerName || !formData.ownerPhone || !formData.surrenderReason || !formData.dogName) {
      alert('Please fill in all required fields');
      return;
    }

    if (phoneError) {
      alert(phoneError);
      return;
    }

    if (dogAgeError) {
      alert(dogAgeError);
      return;
    }

    setIsSubmitting(true);

    try {
      const method = editingSurrenderDog ? 'PUT' : 'POST';
      const url = editingSurrenderDog
        ? `${import.meta.env.VITE_API_URL}/api/surrender-dogs/${editingSurrenderDog.surrenderId}`
        : `${import.meta.env.VITE_API_URL}/api/surrender-dogs`;

      const formDataToSend = new FormData();
      const surrenderDogData = {
        ownerName: formData.ownerName,
        ownerPhone: formData.ownerPhone,
        ownerEmail: formData.ownerEmail,
        ownerAddress: formData.ownerAddress,
        dogName: formData.dogName,
        dogBreed: formData.dogBreed,
        dogAge: formData.dogAge,
        dogGender: formData.dogGender,
        dogSize: formData.dogSize,
        dogDescription: formData.dogDescription,
        isVaccinated: formData.isVaccinated,
        isNeutered: formData.isNeutered,
        hasMedicalIssues: formData.hasMedicalIssues,
        medicalHistory: formData.medicalHistory,
        surrenderReason: formData.surrenderReason,
        isUrgent: formData.isUrgent,
        preferredDate: formData.preferredDate,
        adminNotes: formData.adminNotes,
        // Removed dogPhotoUrl from here, it's handled by backend after photo upload
      };

      console.log('Surrender Dog Data JSON payload being sent:', surrenderDogData);

      // Append the surrender dog data as a JSON string under the key 'surrenderRequest'
      // This key MUST match the @RequestPart name in the Spring Boot controller
      formDataToSend.append('surrenderRequest', JSON.stringify(surrenderDogData));

      // Append each photo file under the key 'photos'
      // This key MUST match the @RequestPart name for List<MultipartFile> in the Spring Boot controller
      formData.photos.forEach((photo) => {
        formDataToSend.append('photos', photo);
      });

      // --- ADD THIS NEW CONSOLE.LOG TO INSPECT FormData content ---
      console.log('Inspecting FormDataToSend entries:');
      for (let [key, value] of formDataToSend.entries()) {
          if (value instanceof File) {
              console.log(`${key}: File - ${value.name} (${value.size} bytes)`);
          } else {
              console.log(`${key}:`, value);
          }
      }
      console.log('FormData object before fetch:', formDataToSend);
      // --- END NEW CONSOLE.LOG ---

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

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Backend response after submission:', result);
      console.log('Surrender request submitted successfully:', result);
      
      // Immediately fetch fresh data from backend after successful submission
      console.log('Fetching fresh data after submission...');
      await fetchSurrenderDogsFromBackend();

      setFormData({ 
          ownerName: '',
          ownerPhone: '',
          ownerEmail: '',
          ownerAddress: '',
          dogName: '',
          dogBreed: '',
          dogAge: 0,
          dogGender: '',
          dogSize: '',
          dogDescription: '',
          isVaccinated: false,
          isNeutered: false,
          hasMedicalIssues: false,
          medicalHistory: '',
          surrenderReason: '',
          isUrgent: false,
          preferredDate: '',
          adminNotes: '',
          photos: [] // Reset photos to an empty array
        });
      setPhotoPreviews([]);
      setShowModal(false);
    } catch (error) {
      console.error('Error submitting report:', error);
      alert('Failed to submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (surrenderDog) => {
    setEditingSurrenderDog(surrenderDog);
    setFormData({
      ownerName: surrenderDog.ownerName,
      ownerPhone: surrenderDog.ownerPhone,
      ownerEmail: surrenderDog.ownerEmail,
      ownerAddress: surrenderDog.ownerAddress,
      dogName: surrenderDog.dogName,
      dogBreed: surrenderDog.dogBreed,
      dogAge: surrenderDog.dogAge,
      dogGender: surrenderDog.dogGender,
      dogSize: surrenderDog.dogSize,
      dogDescription: surrenderDog.dogDescription,
      isVaccinated: surrenderDog.isVaccinated,
      isNeutered: surrenderDog.isNeutered,
      hasMedicalIssues: surrenderDog.hasMedicalIssues,
      medicalHistory: surrenderDog.medicalHistory,
      surrenderReason: surrenderDog.surrenderReason,
      isUrgent: surrenderDog.isUrgent,
      preferredDate: surrenderDog.preferredDate,
      adminNotes: surrenderDog.adminNotes,
      // When editing, existing photos are URLs, not File objects
      photos: surrenderDog.dogPhotoUrls || [] // Use dogPhotoUrls from backend
    });
    // Set photo preview for existing dogPhotoUrls
    setPhotoPreviews(surrenderDog.dogPhotoUrls || []);
    setShowModal(true);
  };

  // Modified handleDelete to show custom modal
  const handleDelete = (surrenderId) => {
    setSurrenderDogToDelete(surrenderId);
  };

  const confirmDelete = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const response = await fetch(`${API_URL}/api/surrender-dogs/${surrenderDogToDelete}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.log(`Report ${surrenderDogToDelete} deleted successfully from backend.`);
      setSurrenderDogs(prev => {
        const updatedSurrenderDogs = prev.filter(surrenderDog => surrenderDog.surrenderId !== surrenderDogToDelete);
        // Update user-specific storage
        if (user) {
          const userId = user.id || user.username;
          localStorage.setItem(`surrenderDogs_${userId}`, JSON.stringify(updatedSurrenderDogs));
        }
        return updatedSurrenderDogs;
      });
      setSurrenderDogToDelete(null); // Clear the report to delete
    } catch (error) {
      console.error('Error deleting report:', error);
      alert('Failed to delete report. Please try again.');
    }
  };

  const cancelDelete = () => {
    setSurrenderDogToDelete(null); // Clear the report to delete
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingSurrenderDog(null);
    setFormData({
      ownerName: '',
      ownerPhone: '',
      ownerEmail: '',
      ownerAddress: '',
      dogName: '',
      dogBreed: '',
      dogAge: 0,
      dogGender: '',
      dogSize: '',
      dogDescription: '',
      isVaccinated: false,
      isNeutered: false,
      hasMedicalIssues: false,
      medicalHistory: '',
      surrenderReason: '',
      isUrgent: false,
      preferredDate: '',
      adminNotes: '',
      photos: [] // Reset photos to an empty array
    });
    setPhotoPreviews([]);
  };

  useEffect(() => {
    if (editingSurrenderDog) {
      setFormData({
        ownerName: editingSurrenderDog.ownerName,
        ownerPhone: editingSurrenderDog.ownerPhone,
        ownerEmail: editingSurrenderDog.ownerEmail,
        ownerAddress: editingSurrenderDog.ownerAddress,
        dogName: editingSurrenderDog.dogName,
        dogBreed: editingSurrenderDog.dogBreed,
        dogAge: editingSurrenderDog.dogAge,
        dogGender: editingSurrenderDog.dogGender,
        dogSize: editingSurrenderDog.dogSize,
        dogDescription: editingSurrenderDog.dogDescription,
        isVaccinated: editingSurrenderDog.isVaccinated,
        isNeutered: editingSurrenderDog.isNeutered,
        hasMedicalIssues: editingSurrenderDog.hasMedicalIssues,
        medicalHistory: editingSurrenderDog.medicalHistory,
        surrenderReason: editingSurrenderDog.surrenderReason,
        isUrgent: editingSurrenderDog.isUrgent,
        preferredDate: editingSurrenderDog.preferredDate,
        adminNotes: editingSurrenderDog.adminNotes,
        photos: editingSurrenderDog.dogPhotoUrls || [] // Use dogPhotoUrls from backend
      });
      // Set photo previews for existing dogPhotoUrls
      setPhotoPreviews(editingSurrenderDog.dogPhotoUrls || []);
    } else {
      setFormData({
        ownerName: '',
        ownerPhone: '',
        ownerEmail: '',
        ownerAddress: '',
        dogName: '',
        dogBreed: '',
        dogAge: 0,
        dogGender: '',
        dogSize: '',
        dogDescription: '',
        isVaccinated: false,
        isNeutered: false,
        hasMedicalIssues: false,
        medicalHistory: '',
        surrenderReason: '',
        isUrgent: false,
        preferredDate: '',
        adminNotes: '',
        photos: []
      });
      setPhotoPreviews([]);
    }
  }, [editingSurrenderDog]);

  return (
    <div className="surrender-dog-container">
      <div className="hero-section">
        <h2 className="hero-title">Surrender a Dog</h2>
        <p className="hero-subtitle">
          Provide information about the dog you wish to surrender. We ensure they find a loving home.
        </p>
        {!isAuthenticated && (
          <div className="auth-warning">
            <p>⚠️ You must be logged in to submit a surrender request</p>
          </div>
        )}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            className="create-request-btn"
            onClick={() => {
              if (!isAuthenticated) {
                alert('Please login or register to submit a surrender request');
                navigate('/login');
              } else {
                setShowModal(true);
              }
            }}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Surrender Request'}
          </button>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingSurrenderDog ? 'Edit Surrender Request' : 'Surrender a Dog'}</h3>
              <button className="close-btn" onClick={closeModal}>×</button>
            </div>

            <form onSubmit={handleSubmit} className="surrender-form">
              <div className="form-group">
                <label htmlFor="ownerName">Owner Name *</label>
                <input
                  type="text"
                  id="ownerName"
                  name="ownerName"
                  value={formData.ownerName}
                  onChange={handleInputChange}
                  placeholder="Your full name"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="ownerPhone">Owner Phone Number *</label>
                <input
                  type="tel"
                  id="ownerPhone"
                  name="ownerPhone"
                  value={formData.ownerPhone}
                  onChange={handleInputChange}
                  placeholder="Your contact number"
                  required
                />
                {phoneError && <p className="error-message">{phoneError}</p>}
              </div>

              <div className="form-group">
                <label htmlFor="ownerEmail">Owner Email</label>
                <input
                  type="email"
                  id="ownerEmail"
                  name="ownerEmail"
                  value={formData.ownerEmail}
                  onChange={handleInputChange}
                  placeholder="Your email address"
                />
              </div>

              <div className="form-group">
                <label htmlFor="ownerAddress">Owner Address</label>
                <input
                  type="text"
                  id="ownerAddress"
                  name="ownerAddress"
                  value={formData.ownerAddress}
                  onChange={handleInputChange}
                  placeholder="Your address"
                />
              </div>

              <div className="form-group">
                <label htmlFor="dogName">Dog Name *</label>
                <input
                  type="text"
                  id="dogName"
                  name="dogName"
                  value={formData.dogName}
                  onChange={handleInputChange}
                  placeholder="Name of the dog"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="dogBreed">Dog Breed</label>
                <input
                  type="text"
                  id="dogBreed"
                  name="dogBreed"
                  value={formData.dogBreed}
                  onChange={handleInputChange}
                  placeholder="Breed of the dog"
                />
              </div>

              <div className="form-group">
                <label htmlFor="dogAge">Dog Age</label>
                <input
                  type="number"
                  id="dogAge"
                  name="dogAge"
                  value={formData.dogAge}
                  onChange={handleInputChange}
                  placeholder="Age of the dog"
                />
                {dogAgeError && <p className="error-message">{dogAgeError}</p>}
              </div>

              <div className="form-group">
                <label htmlFor="dogGender">Dog Gender</label>
                <select
                  id="dogGender"
                  name="dogGender"
                  value={formData.dogGender}
                  onChange={handleInputChange}
                >
                  <option value="">Select Gender</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="dogSize">Dog Size</label>
                <select
                  id="dogSize"
                  name="dogSize"
                  value={formData.dogSize}
                  onChange={handleInputChange}
                >
                  <option value="">Select Size</option>
                  <option value="SMALL">Small</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="LARGE">Large</option>
                  <option value="VERY_LARGE">Very Large</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="dogDescription">Dog Description</label>
                <textarea
                  id="dogDescription"
                  name="dogDescription"
                  value={formData.dogDescription}
                  onChange={handleInputChange}
                  placeholder="Describe the dog (personality, habits, etc.)"
                  rows={4}
                />
              </div>

              <div className="form-group checkbox-group">
                <input
                  type="checkbox"
                  id="isVaccinated"
                  name="isVaccinated"
                  checked={formData.isVaccinated}
                  onChange={handleInputChange}
                />
                <label htmlFor="isVaccinated">Is Vaccinated?</label>
              </div>

              <div className="form-group checkbox-group">
                <input
                  type="checkbox"
                  id="isNeutered"
                  name="isNeutered"
                  checked={formData.isNeutered}
                  onChange={handleInputChange}
                />
                <label htmlFor="isNeutered">Is Neutered?</label>
              </div>

              <div className="form-group checkbox-group">
                <input
                  type="checkbox"
                  id="hasMedicalIssues"
                  name="hasMedicalIssues"
                  checked={formData.hasMedicalIssues}
                  onChange={handleInputChange}
                />
                <label htmlFor="hasMedicalIssues">Has Medical Issues?</label>
              </div>

              {formData.hasMedicalIssues && (
                <div className="form-group">
                  <label htmlFor="medicalHistory">Medical History</label>
                  <textarea
                    id="medicalHistory"
                    name="medicalHistory"
                    value={formData.medicalHistory}
                    onChange={handleInputChange}
                    placeholder="Describe any medical history or conditions"
                    rows={4}
                  />
                </div>
              )}

              <div className="form-group">
                <label htmlFor="surrenderReason">Reason for Surrender *</label>
                <textarea
                  id="surrenderReason"
                  name="surrenderReason"
                  value={formData.surrenderReason}
                  onChange={handleInputChange}
                  placeholder="Reason for surrendering the dog"
                  rows={4}
                  required
                />
              </div>

              <div className="form-group checkbox-group">
                <input
                  type="checkbox"
                  id="isUrgent"
                  name="isUrgent"
                  checked={formData.isUrgent}
                  onChange={handleInputChange}
                />
                <label htmlFor="isUrgent">Is Urgent?</label>
              </div>

              <div className="form-group">
                <label htmlFor="preferredDate">Preferred Date for Surrender</label>
                <input
                  type="date"
                  id="preferredDate"
                  name="preferredDate"
                  value={formData.preferredDate}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="adminNotes">Admin Notes</label>
                <textarea
                  id="adminNotes"
                  name="adminNotes"
                  value={formData.adminNotes}
                  onChange={handleInputChange}
                  placeholder="Any internal notes (optional)"
                  rows={2}
                />
              </div>

              <div className="form-group">
                <label htmlFor="photos">Dog Photos ({formData.photos.length}/5)</label>
                <input
                  type="file"
                  id="photos"
                  name="photos"
                  onChange={handlePhotoUpload}
                  multiple // Allow multiple files
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
                        onClick={() => handleRemovePhoto(index)} // Adjusted to remove by index
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
                  {isSubmitting ? 'Submitting...' : (editingSurrenderDog ? 'Update Request' : 'Submit Request')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Surrender Dogs List */}
      <div className="surrender-requests-section">
        <h3>Recent Surrender Requests</h3>
        {surrenderDogs.length === 0 ? (
          <div className="no-requests">
            <p>No surrender requests yet. Be the first to surrender a dog!</p>
          </div>
        ) : (
          <div className="requests-grid">
            {surrenderDogs.map(surrenderDog => (
              <RequestCard
                key={surrenderDog.surrenderId}
                surrenderDog={surrenderDog}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {surrenderDogToDelete && (
        <ConfirmationModal
          message="Are you sure you want to delete this surrender request?"
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
    </div>
  );
};

export default SurrenderDog;