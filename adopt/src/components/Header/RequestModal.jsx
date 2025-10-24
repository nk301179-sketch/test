import { useState, useEffect } from "react";

function RequestModal({ onClose, onSubmit, initialData }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "",
    file: "",
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
      const response = await fetch("http://localhost:8080/api/reports", {
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
        <h2>{initialData ? "Edit Report" : "Create Report"}</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Description:
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Location:
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Upload File:
            <input type="file" name="file" onChange={handleChange} />
            {formData.file && <p>Selected: {formData.file}</p>}
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
