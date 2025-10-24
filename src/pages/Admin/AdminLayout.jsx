import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Users, Dog, FileText, AlertTriangle, Heart, Settings, LogOut, User, UserCircle, MessageSquare } from 'lucide-react';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import './AdminLayout.css';

const AdminLayout = ({ children }) => {
  const location = useLocation();
  const { admin, logout } = useAdminAuth();
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const timeoutRef = useRef(null);

  const adminNavItems = [
    { path: '/admin/users', label: 'Users', icon: Users, description: 'Manage account holders' },
    { path: '/admin/dogs', label: 'Dogs', icon: Dog, description: 'Add adoption & purchase dogs' },
    { path: '/admin/applications', label: 'Applications', icon: FileText, description: 'Manage adoption/purchase applications' },
    { path: '/admin/contact-messages', label: 'Messages', icon: MessageSquare, description: 'Manage contact messages' },
    { path: '/admin/reports', label: 'Reports', icon: AlertTriangle, description: 'View & delete report submissions' },
    { path: '/admin/surrender', label: 'Surrender', icon: Heart, description: 'Manage surrender requests' },
    { path: '/admin/profile', label: 'Profile', icon: User, description: 'Manage admin account' }
  ];

  const handleLogout = () => {
    logout();
    // Redirect to main user website as guest user
    window.location.href = '/';
  };

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setSidebarVisible(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setSidebarVisible(false);
    }, 300); // 300ms delay before hiding
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="admin-layout">
      {/* Admin Header */}
      <header className="admin-header">
        <div className="admin-header-content">
          <div className="admin-title-section">
            <Settings className="admin-icon" />
            <div>
              <h1>Admin Dashboard</h1>
              <p>Manage your Home4Paws platform</p>
            </div>
          </div>
          <div className="admin-user-info">
            <div className="admin-profile">
              <div className="admin-avatar">
                {admin?.name ? admin.name.charAt(0).toUpperCase() : admin?.username?.charAt(0).toUpperCase()}
              </div>
              <div className="admin-details">
                <span className="admin-name">{admin?.name || admin?.username}</span>
                <span className="admin-role">System Administrator</span>
              </div>
            </div>
            <div className="admin-header-actions">
              <Link to="/admin/profile" className="admin-profile-btn">
                <UserCircle size={16} />
                Profile
              </Link>
              <button onClick={handleLogout} className="admin-logout-btn">
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className={`admin-container ${sidebarVisible ? 'sidebar-visible' : ''}`}>
        {/* Hover trigger for sidebar */}
        <div 
          className="sidebar-trigger"
          onMouseEnter={handleMouseEnter}
        />
        
        {/* Admin Sidebar */}
        <aside 
          className={`admin-sidebar ${sidebarVisible ? 'visible' : ''}`}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <nav className="admin-nav">
            {adminNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`admin-nav-item ${isActive ? 'active' : ''}`}
                  onClick={() => console.log('Navigating to:', item.path)}
                >
                  <Icon className="nav-icon" />
                  <div className="nav-content">
                    <span className="nav-label">{item.label}</span>
                    <span className="nav-description">{item.description}</span>
                  </div>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Admin Main Content */}
        <main className="admin-main">
          <div className="admin-content">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
