import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 
import "./BuyDogs.css"

const DogBuy = () => {
  const [dogs, setDogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [breedFilter, setBreedFilter] = useState("All");
  const [maxPrice, setMaxPrice] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL;
    axios
      .get(`${API_URL}/api/dogs/buy`)
      .then((res) => setDogs(res.data))
      .catch((err) => console.error("Error fetching dogs:", err));
  }, []);

  // Collect unique breeds
  const breeds = ["All", ...new Set(dogs.map((dog) => dog.breed || "Mixed"))];

  // Apply search + filter
  const filteredDogs = dogs.filter((dog) => {
    const matchesSearch =
      dog.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dog.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesBreed =
      breedFilter === "All" || (dog.breed || "Mixed") === breedFilter;

    const matchesPrice =
      !maxPrice || (dog.price && dog.price <= parseFloat(maxPrice));

    return matchesSearch && matchesBreed && matchesPrice;
  });

  return (
    <div className="dog-container">
      <h2 className="title">🐾 Dogs Available for Sale</h2>

      {/* Filter Section */}
      <div className="filter-bar">
        <input
          type="text"
          placeholder="Search dogs by name or description..."
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

        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="price-input"
        />
      </div>

      {/* Dogs Grid */}
      {filteredDogs.length === 0 ? (
        <p className="no-dogs">No dogs match your search or filter.</p>
      ) : (
        <div className="dog-grid">
          {filteredDogs.map((dog) => (
            <div key={dog.id} className="dog-card">
              <img
                src={dog.image || "https://media.istockphoto.com/id/2173525702/photo/happy-brittany-spaniel-dog-panting-and-sitting-on-a-white-background.jpg?s=612x612&w=0&k=20&c=jn0i8dORqc7x3cZbtX2eHG21yb9wM9Rf-JsWkS8hzz8="}
                alt={dog.name}
                className="dog-image"
                onClick={() => navigate(`/dogs/${dog.id}`)} // ✅ Click image to go to details
                style={{ cursor: "pointer" }}
              />
              <div className="dog-info">
                <h3>{dog.name || "Unnamed"}</h3>
                <p className="breed">{dog.breed || "Mixed"}</p>
                <p className="desc">{dog.description}</p>
                <p className="price">Rs. {dog.price?.toLocaleString()}</p>
                <button
                  className="buy-btn"
                  disabled={dog.status !== "AVAILABLE"}
                  onClick={() => navigate(`/dogs/${dog.id}`)} // ✅ Button also navigates
                >
                  {dog.status === "AVAILABLE" ? "Buy Now" : dog.status}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DogBuy;
