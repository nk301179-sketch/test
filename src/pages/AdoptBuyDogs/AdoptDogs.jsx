import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import "./AdoptDog.css"; // custom CSS

const DogAdopt = () => {
  const [dogs, setDogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [breedFilter, setBreedFilter] = useState("All");
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:8084/api/dogs/adopt")
      .then((res) => setDogs(res.data))
      .catch((err) => console.error("Error fetching dogs:", err));
  }, []);

  // Collect unique breeds
  const breeds = ["All", ...new Set(dogs.map((dog) => dog.breed || "Mixed"))];

  // Filter dogs based on search and breed
  const filteredDogs = dogs.filter((dog) => {
    const matchesSearch =
      dog.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (dog.description && dog.description.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesBreed =
      breedFilter === "All" || (dog.breed || "Mixed") === breedFilter;

    return matchesSearch && matchesBreed;
  });

  const handleDogClick = (dogId) => {
    navigate(`/dogs/${dogId}`);
  };

  const handleAdoptClick = (dogId, e) => {
    e.stopPropagation(); // Prevent triggering the card click
    navigate(`/dogs/${dogId}`);
  };

  return (
    <div className="adopt-container">
      <div className="adopt-header">
        <h2 className="adopt-title">🐾 Dogs Available for Adoption 🐾</h2>
      </div>

      {/* Search + Filter Section */}
      <div className="filter-bar">
        <input
          type="text"
          placeholder="Search by name or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />

        <select
          value={breedFilter}
          onChange={(e) => setBreedFilter(e.target.value)}
          className="breed-select"
        >
          {breeds.map((breed, index) => (
            <option key={index} value={breed}>
              {breed}
            </option>
          ))}
        </select>
      </div>

      {filteredDogs.length === 0 ? (
        <p className="no-dogs">No dogs match your search or filter.</p>
      ) : (
        <div className="dog-grid">
          {filteredDogs.map((dog) => (
            <div 
              key={dog.id} 
              className="dog-card"
              onClick={() => handleDogClick(dog.id)}
            >
              <img 
                src={dog.image || "https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=612&q=80"} 
                alt={dog.name} 
                className="dog-img" 
              />
              <div className="dog-info">
                <h3>{dog.name || "Unnamed Dog"}</h3>
                <p className="dog-breed">{dog.breed || "Mixed"}</p>
                <p className="dog-desc">{dog.description || "A lovely dog looking for a forever home."}</p>
                <button 
                  className="adopt-btn"
                  onClick={(e) => handleAdoptClick(dog.id, e)}
                >
                  Adopt Me ❤️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DogAdopt;

