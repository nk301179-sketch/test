import React, { useEffect, useState } from "react";
import axios from "axios";
import ConfirmationModal from "../../components/ConfirmationModal/ConfirmationModal";
import "./AdminDog.css";

const Admin = () => {
  const [dogs, setDogs] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({});
  const [dogToDelete, setDogToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
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
  const fetchDogs = () => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/dogs`)
      .then((res) => setDogs(res.data))
      .catch((err) => console.error("Error fetching dogs:", err));
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
      .put(`${import.meta.env.VITE_API_URL}/api/dogs/${id}`, form)
      .then(() => {
        fetchDogs();
        setEditingId(null);
        setForm({});
      })
      .catch((err) => console.error("Error updating dog:", err));
  };

  // Delete dog
  const handleDelete = (id) => {
    setDogToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    axios
      .delete(`${import.meta.env.VITE_API_URL}/api/dogs/${dogToDelete}`)
      .then(() => {
        fetchDogs();
        setShowDeleteModal(false);
        setDogToDelete(null);
      })
      .catch((err) => console.error("Error deleting dog:", err));
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDogToDelete(null);
  };

  // Create new dog
  const handleAddDog = () => {
    if (!newDog.name || !newDog.breed) {
      alert("Please fill in at least Name and Breed.");
      return;
    }

    axios
      .post(`${import.meta.env.VITE_API_URL}/api/dogs`, newDog)
      .then(() => {
        fetchDogs();
        setNewDog({
          name: "",
          breed: "",
          description: "",
          price: "",
          status: "AVAILABLE",
          isStray: false,
          image: ""
        });
      })
      .catch((err) => console.error("Error adding dog:", err));
  };

  return (
    <div className="admin-container">
      <h2>🐾 Admin Dashboard - Manage Dogs</h2>

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
              <button onClick={handleAddDog}>➕ Add</button>
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
                  <td>{dog.description}</td>
                  <td>Rs. {dog.price}</td>
                  <td>{dog.status}</td>
                  <td>{dog.isStray ? "Yes" : "No"}</td>
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

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <ConfirmationModal
          message="Are you sure you want to delete this dog? This action cannot be undone."
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
    </div>
  );
};

export default Admin;

