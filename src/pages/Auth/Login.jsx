import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError(''); // Clear error when user starts typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const result = await login(formData.username, formData.password);
      
      if (result.success) {
        if (result.isAdmin) {
          // Admin user - redirect to admin panel
          window.location.href = result.redirectTo;
        } else {
          // Regular user - redirect to homepage
          navigate('/');
        }
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    }
    
    setLoading(false);
  };

  return (
    <div className="login-container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="login-card-wrapper"
      >
        {/* Logo and Title */}
        <div className="login-header">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="login-logo-wrapper"
          >
            <div className="login-logo-icon-bg">
              <Heart className="login-logo-icon" />
            </div>
          </motion.div>
          <h2 className="login-title">Welcome Back!</h2>
          <p className="login-subtitle">Sign in to continue to Home4Paws</p>
        </div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="login-card"
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
            
            <div>
              <label htmlFor="username" className="form-label">
                Email or Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter your email or username"
              />
            </div>

            <div>
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <div className="input-icon-wrapper">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="form-input form-input-right-icon"
                  placeholder="Enter your password"
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
            </div>

            <div className="form-options">
              <div className="checkbox-container">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="checkbox-input"
                />
                <label htmlFor="remember-me" className="checkbox-label">
                  Remember me
                </label>
              </div>

              <div className="link-wrapper">
                <Link to="/forgot-password" className="link-primary">
                  Forgot password?
                </Link>
              </div>
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
                'Sign in'
              )}
            </motion.button>
          </form>

          <div className="divider-wrapper">
            <div className="divider-line-container">
              <div className="divider-line"></div>
            </div>
            <div className="divider-text-container">
              <span className="divider-text">Don't have an account?</span>
            </div>
          </div>

          <div className="signup-link-wrapper">
            <Link
              to="/register"
              className="secondary-button"
            >
              Create new account
            </Link>
          </div>

          <div className="demo-credentials-card-wrapper">
            <div className="demo-credentials-card">
              <h3 className="demo-credentials-title">Demo Credentials</h3>
              <p className="demo-credentials-text">
                <strong>Regular User:</strong>
              </p>
              <p className="demo-credentials-text">
                Username: <code className="demo-credentials-code">user@example.com</code>
              </p>
              <p className="demo-credentials-text">
                Password: <code className="demo-credentials-code">password123</code>
              </p>
              <hr style={{ margin: '1rem 0', border: '1px solid #e2e8f0' }} />
              <p className="demo-credentials-text">
                <strong>Admin User:</strong>
              </p>
              <p className="demo-credentials-text">
                Username: <code className="demo-credentials-code">admin</code>
              </p>
              <p className="demo-credentials-text">
                Password: <code className="demo-credentials-code">Admin123!</code>
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
