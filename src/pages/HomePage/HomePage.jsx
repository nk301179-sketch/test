import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Users, Shield, Award, DogIcon, Home, Phone } from 'lucide-react';
import './HomePage.css';

const HomePage = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const stats = [
    { number: '500+', label: 'Dogs Rescued' },
    { number: '450+', label: 'Happy Families' },
    { number: '50+', label: 'Volunteers' },
    { number: '5', label: 'Years of Service' }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      text: 'We found our perfect companion through Home4Paws. The process was smooth and the staff was incredibly helpful.',
      image: '🐕'
    },
    {
      name: 'Mike Chen',
      text: 'Amazing organization! They helped us rescue a dog in need and provided excellent post-adoption support.',
      image: '🦮'
    },
    {
      name: 'Emily Davis',
      text: 'Professional, caring, and dedicated. Our family is complete thanks to Home4Paws.',
      image: '🐶'
    }
  ];

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="home-page-container"
    >
      {/* Hero Section */}
      <motion.section
        variants={itemVariants}
        className="hero-section"
      >
        <div className="hero-content">
          <div className="hero-text">
            <motion.div 
              className="glass-box"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <motion.h1 
                className="hero-title"
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                <span className="line">Every <span className="accent">Dog</span></span>
                <span className="line">Deserves a</span>
                <span className="line accent">Loving Home</span>
              </motion.h1>
              <motion.p 
                className="hero-subtitle"
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                <span className="line">Join our mission to connect rescued dogs with <span className="accent">caring families</span>.</span>
                <span className="line">Together, we create stories of <span className="accent">hope</span>, <span className="accent">healing</span>, and <span className="accent">unconditional love</span>.</span>
              </motion.p>
              <motion.div 
                className="hero-buttons"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.8 }}
              >
                <Link to="/adopt" className="cta-button primary">
                  <Heart className="button-icon" />
                  Adopt Now
                </Link>
                <Link to="/contact" className="cta-button secondary">
                  <Phone className="button-icon" />
                  Learn More
                </Link>
              </motion.div>
            </motion.div>
          </div>
          <motion.div 
            className="hero-image"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <div className="floating-card">
              <DogIcon size={60} className="dog-icon" />
              <h3>Find Your Best Friend</h3>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Statistics Section */}
      <motion.section
        variants={itemVariants}
        className="stats-section"
      >
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="stat-card"
              whileHover={{ scale: 1.05 }}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
            >
              <h3 className="stat-number">{stat.number}</h3>
              <p className="stat-label">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Services Grid */}
      <motion.section
        variants={itemVariants}
        className="services-section"
      >
        <div className="section-header">
          <h2 className="section-title">How We Help</h2>
          <p className="section-subtitle">
            Choose how you'd like to make a difference in a dog's life
          </p>
        </div>
        <div className="services-grid">
          <Link to="/adopt" className="service-card">
            <div className="service-icon adopt">
              <Heart size={40} />
            </div>
            <h3>Adopt a Dog</h3>
            <p>Find your new best friend and give them the loving home they deserve. Browse our available dogs and start your adoption journey.</p>
            <span className="service-arrow">→</span>
          </Link>

          <Link to="/report" className="service-card">
            <div className="service-icon rescue">
              <Shield size={40} />
            </div>
            <h3>Report & Rescue</h3>
            <p>Help us rescue dogs in need and provide them with immediate care. Your report could save a life.</p>
            <span className="service-arrow">→</span>
          </Link>

          <Link to="/surrender" className="service-card">
            <div className="service-icon surrender">
              <Home size={40} />
            </div>
            <h3>Rehoming Services</h3>
            <p>Ensure a safe and caring transition for your pet to their next loving home with our professional rehoming services.</p>
            <span className="service-arrow">→</span>
          </Link>
        </div>
      </motion.section>


      {/* Call to Action Section */}
      <motion.section
        variants={itemVariants}
        className="cta-section"
      >
        <div className="cta-content">
          <h2 className="cta-title">Ready to Make a Difference?</h2>
          <p className="cta-description">
            Join our community of dog lovers and help us create more happy endings. 
            Whether you adopt, volunteer, or donate, every action counts.
          </p>
          <div className="cta-buttons">
            <Link to="/adopt" className="cta-button primary large">
              <Heart className="button-icon" />
              Start Adopting
            </Link>
            <Link to="/contact" className="cta-button secondary large">
              <Users className="button-icon" />
              Volunteer With Us
            </Link>
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        variants={itemVariants}
        className="features-section"
      >
        <div className="features-grid">
          <motion.div
            whileHover={{ y: -5 }}
            className="feature-card"
          >
            <div className="feature-icon">
              <Shield size={32} />
            </div>
            <h3>Verified & Safe</h3>
            <p>All our dogs are health-checked, vaccinated, and ready for their new homes with complete medical records.</p>
          </motion.div>
          <motion.div
            whileHover={{ y: -5 }}
            className="feature-card"
          >
            <div className="feature-icon">
              <Heart size={32} />
            </div>
            <h3>Lifetime Support</h3>
            <p>We provide ongoing support and guidance throughout your dog's life, ensuring a successful adoption experience.</p>
          </motion.div>
          <motion.div
            whileHover={{ y: -5 }}
            className="feature-card"
          >
            <div className="feature-icon">
              <Award size={32} />
            </div>
            <h3>Expert Care</h3>
            <p>Our professional team of veterinarians and animal behaviorists ensure every dog receives the best possible care.</p>
          </motion.div>
        </div>
      </motion.section>
    </motion.div>
  );
};

export default HomePage;
