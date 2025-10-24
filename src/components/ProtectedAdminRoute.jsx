import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAdminAuth } from '../contexts/AdminAuthContext';
import AdminLogin from '../pages/Admin/AdminLogin';
import './ProtectedAdminRoute.css';

const ProtectedAdminRoute = ({ children }) => {
  const { isAdminAuthenticated, loading } = useAdminAuth();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAdminAuthenticated) {
    return <AdminLogin />;
  }

  return children;
};

export default ProtectedAdminRoute;
