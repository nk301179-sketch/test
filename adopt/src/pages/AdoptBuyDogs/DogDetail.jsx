import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "./DogDetail.css";

const DogDetails = () => {
  const { id } = useParams();
  const [dog, setDog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL;
    axios
      .get(`${API_URL}/api/dogs/${id}`)
      .then((res) => {
        setDog(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching dog details:", err);
        setLoading(false);
      });
  }, [id]);

  const handleImageError = () => {
    setImageError(true);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading dog details...</p>
      </div>
    );
  }

  if (!dog) {
    return (
      <div className="error-container">
        <h2>🐕 Dog Not Found</h2>
        <p>Sorry, we couldn't find the dog you're looking for.</p>
        <Link to="/dogs/buy" className="back-btn">
          ← Back to All Dogs
        </Link>
      </div>
    );
  }

  const defaultImage = "https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=612&q=80";

  const getDogTypeInfo = () => {
    if (dog.isStray) {
      return {
        type: "adoption",
        badge: "🏠 For Adoption",
        badgeColor: "adoption-badge",
        cardColor: "adoption-card",
        actionText: dog.status === "AVAILABLE" ? "🎯 Start Adoption Process" : dog.status,
        buttonClass: "adopt-btn",
        description: "This lovely dog is looking for a forever home through our adoption program."
      };
    } else {
      return {
        type: "purchase",
        badge: "💰 For Sale",
        badgeColor: "purchase-badge",
        cardColor: "purchase-card",
        actionText: dog.status === "AVAILABLE" ? "🛒 Purchase Now" : dog.status,
        buttonClass: "buy-btn",
        description: "This premium breed dog is available for purchase."
      };
    }
  };

  const dogType = getDogTypeInfo();

  return (
    <div className="dog-detail-wrapper">
      {/* Header with Breadcrumbs */}
      <header className="detail-header">
        <nav className="breadcrumbs">
          <Link to="/" className="breadcrumb-link">Home</Link>
          <span className="breadcrumb-separator">/</span>
          <Link to={dog.isStray ? "/dogs/adopt" : "/dogs/buy"} className="breadcrumb-link">
            {dog.isStray ? "Adoption Dogs" : "Dogs for Sale"}
          </Link>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">{dog.name || "Dog Details"}</span>
        </nav>
        
        <Link to={dog.isStray ? "/dogs/adopt" : "/dogs/buy"} className="back-button">
          ← Back to {dog.isStray ? "Adoptions" : "Dogs"}
        </Link>
      </header>

      <main className="dog-detail-container">
        {/* Image Gallery */}
        <div className="image-section">
          <div className="main-image-container">
            <img
              src={imageError ? defaultImage : (dog.image || defaultImage)}
              alt={dog.name}
              className="main-image"
              onError={handleImageError}
            />
            <div className={`type-badge ${dogType.badgeColor}`}>
              {dogType.badge}
            </div>
            {dog.status !== "AVAILABLE" && (
              <div className="status-badge unavailable">
                {dog.status}
              </div>
            )}
          </div>
        </div>

        {/* Dog Information */}
        <div className="info-section">
          <div className="dog-header">
            <h1 className="dog-name">{dog.name || "Unnamed Dog"}</h1>
            <span className="dog-breed">{dog.breed || "Mixed Breed"}</span>
          </div>

          <div className="dog-meta">
            <div className="meta-item">
              <span className="meta-label">Type</span>
              <span className={`type-tag ${dogType.badgeColor}`}>
                {dog.isStray ? "Adoption" : "For Sale"}
              </span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Status</span>
              <span className={`status-tag ${dog.status?.toLowerCase()}`}>
                {dog.status || "Unknown"}
              </span>
            </div>
            {dog.age && (
              <div className="meta-item">
                <span className="meta-label">Age</span>
                <span className="meta-value">{dog.age}</span>
              </div>
            )}
            {dog.gender && (
              <div className="meta-item">
                <span className="meta-label">Gender</span>
                <span className="meta-value">{dog.gender}</span>
              </div>
            )}
          </div>

          <div className={`type-info-card ${dogType.cardColor}`}>
            <h3>💡 About This Listing</h3>
            <p>{dogType.description}</p>
            {dog.isStray ? (
              <div className="adoption-features">
                <p><strong>Adoption Includes:</strong></p>
                <ul>
                  <li>✓ Full health checkup</li>
                  <li>✓ Vaccination records</li>
                  <li>✓ Spay/Neuter surgery</li>
                  <li>✓ Microchipping</li>
                </ul>
              </div>
            ) : (
              <div className="purchase-features">
                <p><strong>Purchase Includes:</strong></p>
                <ul>
                  <li>✓ Purebred documentation</li>
                  <li>✓ Health guarantee</li>
                  <li>✓ Vaccination records</li>
                  <li>✓ Pedigree certificate</li>
                </ul>
              </div>
            )}
          </div>

          <div className="description-card">
            <h3>🐾 About {dog.name || "This Dog"}</h3>
            <p className="dog-description">
              {dog.description || "No description available for this lovely dog."}
            </p>
          </div>

          {!dog.isStray && dog.price ? (
            <div className="price-card purchase">
              <div className="price-info">
                <span className="price-label">Purchase Price</span>
                <span className="price-amount">Rs. {dog.price?.toLocaleString()}</span>
              </div>
              <small className="price-note">Includes all documentation and health guarantee</small>
            </div>
          ) : dog.isStray ? (
            <div className="price-card adoption">
              <div className="price-info">
                <span className="price-label">Adoption Fee</span>
                <span className="price-amount">Free</span>
              </div>
              <small className="price-note">Standard adoption procedures apply</small>
            </div>
          ) : null}

          <div className="action-section">
            <button
              className={`action-button ${dogType.buttonClass} ${dog.status !== "AVAILABLE" ? 'disabled' : ''}`}
              disabled={dog.status !== "AVAILABLE"}
            >
              {dogType.actionText}
            </button>
            
            {dog.status === "AVAILABLE" && (
              <div className="action-notes">
                <p>📞 Contact us to schedule a meeting with {dog.name}</p>
                <p>❤️ All our dogs are fully vaccinated and health checked</p>
                <p>🏡 Home visit may be required for adoption approval</p>
              </div>
            )}

            {dog.status !== "AVAILABLE" && (
              <div className="unavailable-notice">
                <p>This dog is currently {dog.status?.toLowerCase()}. Please check back later or browse other available dogs.</p>
                <Link to={dog.isStray ? "/dogs/adopt" : "/dogs/buy"} className="browse-link">
                  Browse {dog.isStray ? "Other Dogs for Adoption" : "Other Dogs for Sale"}
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DogDetails;