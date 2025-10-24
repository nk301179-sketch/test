import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminDogs.css";

const AdminDogs = () => {
  const [dogs, setDogs] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newDog, setNewDog] = useState({
    name: "",
    breed: "",
    description: "",
    price: "",
    status: "AVAILABLE",
    isStray: false,
    image: ""
  });

  // Fetch dogs
  const fetchDogs = async () => {
    try {
      setLoading(true);
      setError('');
      const API_URL = import.meta.env.VITE_API_URL;
      const response = await axios.get(`${API_URL}/api/admin/dogs`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          'Content-Type': 'application/json'
        }
      });
      setDogs(response.data);
    } catch (err) {
      console.error("Error fetching dogs:", err);
      setError('Failed to fetch dogs. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDogs();
  }, []);

  // Handle edit
  const handleEdit = (dog) => {
    setEditingId(dog.id);
    setForm({ ...dog });
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm({});
  };

  // Input change handlers
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleNewDogChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewDog({ ...newDog, [name]: type === "checkbox" ? checked : value });
  };

  // Save update
  const handleUpdate = (id) => {
    axios
      .put(`${import.meta.env.VITE_API_URL}/api/admin/dogs/${id}`, form, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          'Content-Type': 'application/json'
        }
      })
      .then(() => {
        fetchDogs();
        setEditingId(null);
        setForm({});
      })
      .catch((err) => console.error("Error updating dog:", err));
  };

  // Delete dog
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this dog?")) {
      axios
        .delete(`${import.meta.env.VITE_API_URL}/api/admin/dogs/${id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
            'Content-Type': 'application/json'
          }
        })
        .then(() => fetchDogs())
        .catch((err) => console.error("Error deleting dog:", err));
    }
  };

  // Create new dog
  const handleAddDog = async () => {
    if (!newDog.name || !newDog.breed) {
      alert("Please fill in at least Name and Breed.");
      return;
    }

    try {
      setError('');
      const API_URL = import.meta.env.VITE_API_URL;
      await axios.post(`${API_URL}/api/admin/dogs`, newDog, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          'Content-Type': 'application/json'
        }
      });
      await fetchDogs();
      setNewDog({
        name: "",
        breed: "",
        description: "",
        price: "",
        status: "AVAILABLE",
        isStray: false,
        image: ""
      });
    } catch (err) {
      console.error("Error adding dog:", err);
      setError('Failed to add dog. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="admin-container">
        <h2>🐾 Admin Dashboard - Manage Dogs</h2>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading dogs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <h2>🐾 Admin Dashboard - Manage Dogs</h2>
      
      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => setError('')}>×</button>
        </div>
      )}

      {dogs.length === 0 && !loading && (
        <div className="no-dogs-message">
          <p>No dogs found. Add your first dog using the form below!</p>
                      </div>
                    )}

      <div className="table-wrapper">
        <table className="dog-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Breed</th>
              <th>Description</th>
              <th>Price</th>
              <th>Status</th>
              <th>Stray</th>
              <th>Image</th>
              <th>Actions</th>
            </tr>
          </thead>
        <tbody>
          {/* Add New Dog Row */}
          <tr>
            <td>New</td>
            <td>
                  <input
                    type="text"
                    name="name"
                value={newDog.name}
                onChange={handleNewDogChange}
                placeholder="Name"
              />
            </td>
            <td>
                  <input
                    type="text"
                    name="breed"
                value={newDog.breed}
                onChange={handleNewDogChange}
                placeholder="Breed"
              />
            </td>
            <td>
              <input
                type="text"
                name="description"
                value={newDog.description}
                onChange={handleNewDogChange}
                placeholder="Description"
              />
            </td>
            <td>
                  <input
                    type="number"
                name="price"
                value={newDog.price}
                onChange={handleNewDogChange}
                placeholder="Price"
              />
            </td>
            <td>
                  <select
                    name="status"
                value={newDog.status}
                onChange={handleNewDogChange}
              >
                <option value="AVAILABLE">AVAILABLE</option>
                <option value="SOLD">SOLD</option>
                <option value="ADOPTED">ADOPTED</option>
                  </select>
            </td>
            <td>
              <input
                type="checkbox"
                name="isStray"
                checked={newDog.isStray}
                onChange={handleNewDogChange}
              />
            </td>
            <td>
              <input
                type="text"
                name="image"
                value={newDog.image}
                onChange={handleNewDogChange}
                placeholder="Image URL"
              />
            </td>
            <td>
              <button onClick={handleAddDog} className="add-button">➕ Add</button>
            </td>
          </tr>

          {/* Existing Dogs */}
          {dogs.map((dog) => (
            <tr key={dog.id}>
              <td>{dog.id}</td>

              {editingId === dog.id ? (
                <>
                  <td>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="breed"
                      value={form.breed}
                      onChange={handleChange}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                  name="description"
                      value={form.description}
                      onChange={handleChange}
                    />
                  </td>
                  <td>
                  <input
                    type="number"
                    name="price"
                      value={form.price}
                      onChange={handleChange}
                    />
                  </td>
                  <td>
                    <select
                      name="status"
                      value={form.status}
                      onChange={handleChange}
                    >
                      <option value="AVAILABLE">AVAILABLE</option>
                      <option value="SOLD">SOLD</option>
                      <option value="ADOPTED">ADOPTED</option>
                    </select>
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      name="isStray"
                      checked={form.isStray}
                      onChange={handleChange}
                    />
                  </td>
                  <td>
                  <input
                      type="text"
                    name="image"
                      value={form.image}
                      onChange={handleChange}
                    />
                  </td>
                  <td>
                    <button onClick={() => handleUpdate(dog.id)}>💾 Save</button>
                    <button onClick={handleCancel}>❌ Cancel</button>
                  </td>
                </>
              ) : (
                <>
                  <td>{dog.name}</td>
                  <td>{dog.breed}</td>
                  <td className="description-cell">{dog.description}</td>
                  <td className="price-cell">Rs. {dog.price}</td>
                  <td className={`status-cell status-${dog.status?.toLowerCase()}`}>{dog.status}</td>
                  <td className={`stray-cell ${dog.isStray ? 'stray-yes' : 'stray-no'}`}>
                    {dog.isStray ? "Yes" : "No"}
                  </td>
                  <td>
                    <img
                      src={dog.image || "https://via.placeholder.com/80"}
                      alt={dog.name}
                      width="80"
                    />
                  </td>
                  <td>
                    <button onClick={() => handleEdit(dog)}>✏️ Edit</button>
                    <button onClick={() => handleDelete(dog.id)}>🗑 Delete</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
        </table>
        </div>
    </div>
  );
};

export default AdminDogs;
