import { useState, useEffect } from "react";

function RequestModal({ onClose, onSubmit, initialData }) {
  const [formData, setFormData] = useState({
    ownerName: "",
    ownerPhone: "",
    ownerEmail: "",
    ownerAddress: "",
    dogName: "",
    dogBreed: "",
    dogAge: 0,
    dogGender: "",
    dogSize: "",
    dogDescription: "",
    isVaccinated: false,
    isNeutered: false,
    hasMedicalIssues: false,
    medicalHistory: "",
    surrenderReason: "",
    isUrgent: false,
    preferredDate: "",
    dogPhotoUrl: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pre-fill form if editing
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  // Handle form changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "file") {
      setFormData({ ...formData, file: files[0]?.name || "" });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Submitting form data:", formData);
    setIsSubmitting(true);

    try {
      const response = await fetch("http://localhost:8084/api/surrender-dogs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Report submitted successfully:", result);

      // Update parent state
      onSubmit(result);

      // Close modal
      onClose();
    } catch (error) {
      console.error("Error submitting report:", error);
      alert("Failed to submit report. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="modal-overlay" onClick={onClose}></div>
      <div className="modal">
        <h2>{initialData ? "Edit Surrender Dog Request" : "Create Surrender Dog Request"}</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Owner Name:
            <input
              type="text"
              name="ownerName"
              value={formData.ownerName}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Owner Phone:
            <input
              type="text"
              name="ownerPhone"
              value={formData.ownerPhone}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Owner Email:
            <input
              type="email"
              name="ownerEmail"
              value={formData.ownerEmail}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Owner Address:
            <input
              type="text"
              name="ownerAddress"
              value={formData.ownerAddress}
              onChange={handleChange}
            />
          </label>

          <label>
            Dog Name:
            <input
              type="text"
              name="dogName"
              value={formData.dogName}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Dog Breed:
            <input
              type="text"
              name="dogBreed"
              value={formData.dogBreed}
              onChange={handleChange}
            />
          </label>

          <label>
            Dog Age:
            <input
              type="number"
              name="dogAge"
              value={formData.dogAge}
              onChange={handleChange}
            />
          </label>

          <label>
            Dog Gender:
            <select
              name="dogGender"
              value={formData.dogGender}
              onChange={handleChange}
            >
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </label>

          <label>
            Dog Size:
            <input
              type="text"
              name="dogSize"
              value={formData.dogSize}
              onChange={handleChange}
            />
          </label>

          <label>
            Dog Description:
            <textarea
              name="dogDescription"
              value={formData.dogDescription}
              onChange={handleChange}
              rows="4"
            />
          </label>

          <label>
            Is Vaccinated:
            <input
              type="checkbox"
              name="isVaccinated"
              checked={formData.isVaccinated}
              onChange={(e) => setFormData({ ...formData, isVaccinated: e.target.checked })}
            />
          </label>

          <label>
            Is Neutered:
            <input
              type="checkbox"
              name="isNeutered"
              checked={formData.isNeutered}
              onChange={(e) => setFormData({ ...formData, isNeutered: e.target.checked })}
            />
          </label>

          <label>
            Has Medical Issues:
            <input
              type="checkbox"
              name="hasMedicalIssues"
              checked={formData.hasMedicalIssues}
              onChange={(e) => setFormData({ ...formData, hasMedicalIssues: e.target.checked })}
            />
          </label>

          <label>
            Medical History:
            <textarea
              name="medicalHistory"
              value={formData.medicalHistory}
              onChange={handleChange}
              rows="4"
            />
          </label>

          <label>
            Surrender Reason:
            <textarea
              name="surrenderReason"
              value={formData.surrenderReason}
              onChange={handleChange}
              required
              rows="4"
            />
          </label>

          <label>
            Is Urgent:
            <input
              type="checkbox"
              name="isUrgent"
              checked={formData.isUrgent}
              onChange={(e) => setFormData({ ...formData, isUrgent: e.target.checked })}
            />
          </label>

          <label>
            Preferred Date:
            <input
              type="date"
              name="preferredDate"
              value={formData.preferredDate}
              onChange={handleChange}
            />
          </label>

          <label>
            Dog Photo URL:
            <input
              type="text"
              name="dogPhotoUrl"
              value={formData.dogPhotoUrl}
              onChange={handleChange}
            />
          </label>

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </form>

        <button className="close" onClick={onClose}>
          Close
        </button>
      </div>
    </>
  );
}

export default RequestModal;
