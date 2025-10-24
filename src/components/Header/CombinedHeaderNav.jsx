import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Menu } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import './CombinedHeaderNav.css';

const CombinedHeaderNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const { isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="combined-header-nav">
      <div className="combined-container">
        {/* Logo and Tagline - Left */} 
        <div className="logo-section">
          <h1 className="logo-text">
            Home4Paws
          </h1>
          <span className="logo-tagline">
            Reuniting families, one paw at a time
          </span>
        </div>

        {/* Navigation Links - Middle */}
        <nav className="nav-links-section">
          <ul className="nav-list">
            <li className="nav-item">
              <Link 
                to="/" 
                className={`nav-link ${currentPath === '/' ? 'active' : ''}`}>
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                to="/adopt" 
                className={`nav-link ${currentPath === '/adopt' ? 'active' : ''}`}>
                Adopt Dogs
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                to="/report" 
                className={`nav-link ${currentPath === '/report' ? 'active' : ''}`}>
                Report
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                to="/surrender" 
                className={`nav-link ${currentPath === '/surrender' ? 'active' : ''}`}>
                Surrender
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                to="/contact" 
                className={`nav-link ${currentPath === '/contact' ? 'active' : ''}`}>
                Contact
              </Link>
            </li>
          </ul>
        </nav>

        {/* Auth Buttons - Right */}
        <div className="auth-buttons-section">
          {isAuthenticated ? (
            <>
              <Link
                to="/profile"
                className="nav-button profile-button"
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="nav-button logout-button"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="nav-button login-button"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="nav-button signup-button"
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="mobile-menu-toggle">
          <button
            type="button"
            className="mobile-menu-button-icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="sr-only">Open main menu</span>
            {mobileMenuOpen ? (
              <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
            ) : (
              <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${mobileMenuOpen ? 'mobile-menu-open' : 'mobile-menu-closed'} mobile-menu-panel`}>
        <div className="mobile-menu-links">
          <Link
            to="/"
            className={`mobile-nav-link ${currentPath === '/' ? 'active' : ''}`}
          >
            Home
          </Link>
          <Link
            to="/adopt"
            className={`mobile-nav-link ${currentPath === '/adopt' ? 'active' : ''}`}
          >
            Adopt Dogs
          </Link>
          <Link
            to="/report"
            className={`mobile-nav-link ${currentPath === '/report' ? 'active' : ''}`}
          >
            Report
          </Link>
          <Link
            to="/surrender"
            className={`mobile-nav-link ${currentPath === '/surrender' ? 'active' : ''}`}
          >
            Surrender
          </Link>
          <Link
            to="/contact"
            className={`mobile-nav-link ${currentPath === '/contact' ? 'active' : ''}`}
          >
            Contact
          </Link>
        </div>
        <div className="mobile-menu-auth">
          <div className="mobile-auth-buttons">
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  className="mobile-nav-button mobile-profile-button"
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="mobile-nav-button mobile-logout-button"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="mobile-nav-button mobile-login-button"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="mobile-nav-button mobile-signup-button"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default CombinedHeaderNav;
