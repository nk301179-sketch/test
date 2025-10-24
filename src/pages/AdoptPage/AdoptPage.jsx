import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  HeartIcon, 
  MapPinIcon, 
  CalendarIcon, 
  UserIcon, 
  FunnelIcon, 
  MagnifyingGlassIcon 
} from '@heroicons/react/24/outline';
import './AdoptPage.css';

const AdoptPage = () => {
  const [dogs, setDogs] = useState([]);
  const [filteredDogs, setFilteredDogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({
    age: '',
    size: '',
    gender: '',
    location: ''
  });
  const [isLoading, setIsLoading] = useState(true);

  // Mock data for available dogs
  const mockDogs = [
    {
      id: 1,
      name: 'Buddy',
      breed: 'Golden Retriever Mix',
      age: '3 years',
      size: 'Large',
      gender: 'Male',
      location: 'Colombo',
      image: '/api/placeholder/300/300',
      description: 'Buddy is a friendly and energetic dog who loves playing fetch and swimming. He gets along well with children and other pets.',
      vaccinated: true,
      spayed: true,
      trained: true
    },
    {
      id: 2,
      name: 'Luna',
      breed: 'Labrador Mix',
      age: '2 years',
      size: 'Medium',
      gender: 'Female',
      location: 'Kandy',
      image: '/api/placeholder/300/300',
      description: 'Luna is a gentle and loving companion who enjoys long walks and cuddle time. Perfect for families looking for a calm, affectionate pet.',
      vaccinated: true,
      spayed: true,
      trained: false
    },
    {
      id: 3,
      name: 'Max',
      breed: 'German Shepherd Mix',
      age: '4 years',
      size: 'Large',
      gender: 'Male',
      location: 'Galle',
      image: '/api/placeholder/300/300',
      description: 'Max is an intelligent and loyal dog with excellent guard dog instincts. He needs an active family who can provide mental stimulation.',
      vaccinated: true,
      spayed: true,
      trained: true
    },
    {
      id: 4,
      name: 'Daisy',
      breed: 'Beagle Mix',
      age: '1 year',
      size: 'Small',
      gender: 'Female',
      location: 'Negombo',
      image: '/api/placeholder/300/300',
      description: 'Daisy is a playful puppy full of energy and curiosity. She loves exploring new places and making new friends.',
      vaccinated: true,
      spayed: false,
      trained: false
    },
    {
      id: 5,
      name: 'Rocky',
      breed: 'Mixed Breed',
      age: '5 years',
      size: 'Medium',
      gender: 'Male',
      location: 'Colombo',
      image: '/api/placeholder/300/300',
      description: 'Rocky is a calm and mature dog looking for a quiet home where he can enjoy his golden years with a loving family.',
      vaccinated: true,
      spayed: true,
      trained: true
    },
    {
      id: 6,
      name: 'Bella',
      breed: 'Border Collie Mix',
      age: '2 years',
      size: 'Medium',
      gender: 'Female',
      location: 'Kandy',
      image: '/api/placeholder/300/300',
      description: 'Bella is extremely intelligent and active. She excels at learning new tricks and would thrive in an environment with lots of mental challenges.',
      vaccinated: true,
      spayed: true,
      trained: true
    }
  ];

  useEffect(() => {
    // Simulate loading dogs from API
    setTimeout(() => {
      setDogs(mockDogs);
      setFilteredDogs(mockDogs);
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    filterDogs();
  }, [searchTerm, selectedFilters, dogs]);

  const filterDogs = () => {
    let filtered = dogs.filter(dog =>
      dog.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dog.breed.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (selectedFilters.age) {
      filtered = filtered.filter(dog => {
        const dogAge = parseInt(dog.age);
        switch(selectedFilters.age) {
          case 'young': return dogAge <= 2;
          case 'adult': return dogAge > 2 && dogAge <= 6;
          case 'senior': return dogAge > 6;
          default: return true;
        }
      });
    }

    if (selectedFilters.size) {
      filtered = filtered.filter(dog => 
        dog.size.toLowerCase() === selectedFilters.size.toLowerCase()
      );
    }

    if (selectedFilters.gender) {
      filtered = filtered.filter(dog => 
        dog.gender.toLowerCase() === selectedFilters.gender.toLowerCase()
      );
    }

    if (selectedFilters.location) {
      filtered = filtered.filter(dog => 
        dog.location.toLowerCase().includes(selectedFilters.location.toLowerCase())
      );
    }

    setFilteredDogs(filtered);
  };

  const handleFilterChange = (filterType, value) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearFilters = () => {
    setSelectedFilters({
      age: '',
      size: '',
      gender: '',
      location: ''
    });
    setSearchTerm('');
  };

  const handleAdoptClick = (dog) => {
    // This would typically open a modal or navigate to an adoption form
    alert(`Thank you for your interest in adopting ${dog.name}! Please contact us to proceed with the adoption process.`);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  if (isLoading) {
    return (
      <div className="adopt-page-loading">
        <div className="loading-spinner"></div>
        <p>Loading our wonderful dogs...</p>
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="adopt-page"
    >
      {/* Header Section */}
      <motion.section variants={cardVariants} className="adopt-header">
        <div className="adopt-header-content">
          <h1 className="adopt-title">Find Your Perfect Companion</h1>
          <p className="adopt-subtitle">
            Browse through our wonderful dogs waiting for their forever homes. 
            Each one has been health-checked, vaccinated, and is ready to bring joy to your family.
          </p>
        </div>
      </motion.section>

      {/* Search and Filters */}
      <motion.section variants={cardVariants} className="search-filter-section">
        <div className="search-bar">
          <MagnifyingGlassIcon className="search-icon" />
          <input
            type="text"
            placeholder="Search by name or breed..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-section">
          <div className="filter-group">
            <FunnelIcon className="filter-icon" />
            <span className="filter-label">Filters:</span>
          </div>

          <select
            value={selectedFilters.age}
            onChange={(e) => handleFilterChange('age', e.target.value)}
            className="filter-select"
          >
            <option value="">All Ages</option>
            <option value="young">Young (0-2 years)</option>
            <option value="adult">Adult (3-6 years)</option>
            <option value="senior">Senior (7+ years)</option>
          </select>

          <select
            value={selectedFilters.size}
            onChange={(e) => handleFilterChange('size', e.target.value)}
            className="filter-select"
          >
            <option value="">All Sizes</option>
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>

          <select
            value={selectedFilters.gender}
            onChange={(e) => handleFilterChange('gender', e.target.value)}
            className="filter-select"
          >
            <option value="">All Genders</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>

          <select
            value={selectedFilters.location}
            onChange={(e) => handleFilterChange('location', e.target.value)}
            className="filter-select"
          >
            <option value="">All Locations</option>
            <option value="colombo">Colombo</option>
            <option value="kandy">Kandy</option>
            <option value="galle">Galle</option>
            <option value="negombo">Negombo</option>
          </select>

          <button onClick={clearFilters} className="clear-filters-btn">
            Clear All
          </button>
        </div>
      </motion.section>

      {/* Results Count */}
      <motion.div variants={cardVariants} className="results-count">
        <p>Showing {filteredDogs.length} dog{filteredDogs.length !== 1 ? 's' : ''} available for adoption</p>
      </motion.div>

      {/* Dogs Grid */}
      <motion.section variants={containerVariants} className="dogs-grid">
        {filteredDogs.length === 0 ? (
          <div className="no-results">
            <p>No dogs match your current search and filter criteria.</p>
            <button onClick={clearFilters} className="clear-filters-btn">
              Clear Filters
            </button>
          </div>
        ) : (
          filteredDogs.map((dog) => (
            <motion.div
              key={dog.id}
              variants={cardVariants}
              whileHover={{ y: -5, scale: 1.02 }}
              className="dog-card"
            >
              <div className="dog-image-container">
                <img 
                  src={dog.image} 
                  alt={dog.name}
                  className="dog-image"
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNTAgMTAwQzE2MS4wNDYgMTAwIDE3MCA4OS4wNDU3IDE3MCA3OEMxNzAgNjYuOTU0MyAxNjEuMDQ2IDU2IDE1MCA1NkMxMzguOTU0IDU2IDEzMCA2Ni45NTQzIDEzMCA3OEMxMzAgODkuMDQ1NyAxMzguOTU0IDEwMCAxNTAgMTAwWiIgZmlsbD0iIzk0QTNBRiIvPgo8cGF0aCBkPSJNMTUwIDE4MkMxODguNjYgMTgyIDIyMCAxNTguNjYgMjIwIDEzMEMyMjAgMTAxLjM0IDE4OC42NiA3OCAxNTAgNzhDMTExLjM0IDc4IDgwIDEwMS4zNCA4MCAxMzBDODAgMTU4LjY2IDExMS4zNCAxODIgMTUwIDE4MloiIGZpbGw9IiM5NEEzQUYiLz4KPC9zdmc+';
                  }}
                />
                <div className="dog-status-badges">
                  {dog.vaccinated && <span className="status-badge vaccinated">Vaccinated</span>}
                  {dog.spayed && <span className="status-badge spayed">Spayed/Neutered</span>}
                  {dog.trained && <span className="status-badge trained">Trained</span>}
                </div>
              </div>

              <div className="dog-info">
                <h3 className="dog-name">{dog.name}</h3>
                <p className="dog-breed">{dog.breed}</p>
                
                <div className="dog-details">
                  <div className="detail-item">
                    <CalendarIcon className="detail-icon" />
                    <span>{dog.age}</span>
                  </div>
                  <div className="detail-item">
                    <UserIcon className="detail-icon" />
                    <span>{dog.gender} • {dog.size}</span>
                  </div>
                  <div className="detail-item">
                    <MapPinIcon className="detail-icon" />
                    <span>{dog.location}</span>
                  </div>
                </div>

                <p className="dog-description">{dog.description}</p>

                <button 
                  onClick={() => handleAdoptClick(dog)}
                  className="adopt-button"
                >
                  <HeartIcon className="adopt-icon" />
                  Adopt {dog.name}
                </button>
              </div>
            </motion.div>
          ))
        )}
      </motion.section>

      {/* Call to Action */}
      <motion.section variants={cardVariants} className="adopt-cta">
        <div className="cta-content">
          <h2>Can't Find the Perfect Match?</h2>
          <p>
            New dogs arrive regularly at our shelter. Sign up for notifications 
            or contact us to learn about upcoming arrivals that might be perfect for your family.
          </p>
          <div className="cta-buttons">
            <button className="cta-button primary">Get Notified</button>
            <button className="cta-button secondary">Contact Us</button>
          </div>
        </div>
      </motion.section>
    </motion.div>
  );
};

export default AdoptPage;