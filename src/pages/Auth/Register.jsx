import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, User, Mail, Lock, Eye, EyeOff, UserPlus } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import './Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError(''); // Clear error when user starts typing
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setError('');
    
    try {
      const result = await register(formData);
      if (result.success) {
        setSuccess('Registration successful! Redirecting...');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    }
    
    setLoading(false);
  };

  return (
    <div className="register-container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="register-card-wrapper"
      >
        {/* Logo and Title */}
        <div className="register-header">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="register-logo-wrapper"
          >
            <div className="register-logo-icon-bg">
              <Heart className="register-logo-icon" />
            </div>
          </motion.div>
          <h2 className="register-title">Create an Account</h2>
          <p className="register-subtitle">Join Home4Paws and help us make a difference</p>
        </div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="register-card"
        >
          <form className="form-spacing" onSubmit={handleSubmit}>
            {error && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="error-message"
              >
                <div className="error-content">
                  <div className="error-icon-wrapper">
                    <svg className="error-icon" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="error-text-wrapper">
                    <p className="error-text">{error}</p>
                  </div>
                </div>
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="success-message"
              >
                <div className="success-content">
                  <div className="success-icon-wrapper">
                    <svg className="success-icon" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="success-text-wrapper">
                    <p className="success-text">{success}</p>
                  </div>
                </div>
              </motion.div>
            )}

            <div className="form-grid-two-cols">
              <div>
                <label htmlFor="firstName" className="form-label">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  id="firstName"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="John"
                />
              </div>

              <div>
                <label htmlFor="lastName" className="form-label">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  id="lastName"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Doe"
                />
              </div>
            </div>

            <div>
              <label htmlFor="username" className="form-label">
                Username
              </label>
              <input
                type="text"
                name="username"
                id="username"
                required
                value={formData.username}
                onChange={handleChange}
                className="form-input"
                placeholder="johndoe"
              />
            </div>

            <div>
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="form-input"
                placeholder="john.doe@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <div className="input-icon-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="form-input form-input-right-icon"
                  placeholder="••••••••"
                />
                <div className="password-toggle-wrapper">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="password-toggle"
                  >
                    {showPassword ? (
                      <EyeOff className="input-icon" />
                    ) : (
                      <Eye className="input-icon" />
                    )}
                  </button>
                </div>
              </div>
              <p className="form-help-text">Password must be at least 8 characters long.</p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="form-label">
                Confirm Password
              </label>
              <div className="input-icon-wrapper">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  id="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="form-input form-input-right-icon"
                  placeholder="••••••••"
                />
                <div className="password-toggle-wrapper">
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="password-toggle"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="input-icon" />
                    ) : (
                      <Eye className="input-icon" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="terms-agreement-container">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="checkbox-input"
              />
              <label htmlFor="terms" className="checkbox-label">
                I agree to the <Link to="/terms" className="link-primary">Terms</Link> and <Link to="/privacy" className="link-primary">Privacy Policy</Link>
              </label>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="primary-button"
            >
              {loading ? (
                <div className="spinner"></div>
              ) : (
                'Create Account'
              )}
            </motion.button>
          </form>

          <div className="divider-wrapper">
            <div className="divider-line-container">
              <div className="divider-line"></div>
            </div>
            <div className="divider-text-container">
              <span className="divider-text">Already have an account?</span>
            </div>
          </div>

          <div className="login-link-wrapper">
            <Link
              to="/login"
              className="secondary-button"
            >
              Sign in
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Register;
