import React, { useState, useEffect } from 'react';
import { Users, Dog, FileText, AlertTriangle, Heart, TrendingUp, Activity, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDogs: 0,
    totalApplications: 0,
    totalReports: 0,
    totalSurrenderRequests: 0,
    pendingApplications: 0,
    urgentRequests: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      
      // Fetch all stats in parallel
      const [usersRes, dogsRes, applicationsRes, reportsRes, surrenderRes] = await Promise.all([
        fetch('http://localhost:8084/api/admin/users', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
            'Content-Type': 'application/json'
          }
        }),
        fetch('http://localhost:8084/api/admin/dogs', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
            'Content-Type': 'application/json'
          }
        }),
        fetch('http://localhost:8084/api/admin/applications', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
            'Content-Type': 'application/json'
          }
        }),
        fetch('http://localhost:8084/api/admin/reports', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
            'Content-Type': 'application/json'
          }
        }),
        fetch('http://localhost:8084/api/admin/surrender-submissions', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
            'Content-Type': 'application/json'
          }
        })
      ]);

      const [users, dogs, applications, reports, surrenderRequests] = await Promise.all([
        usersRes.ok ? usersRes.json() : [],
        dogsRes.ok ? dogsRes.json() : [],
        applicationsRes.ok ? applicationsRes.json() : [],
        reportsRes.ok ? reportsRes.json() : [],
        surrenderRes.ok ? surrenderRes.json() : []
      ]);

      setStats({
        totalUsers: users.length,
        totalDogs: dogs.length,
        totalApplications: applications.length,
        totalReports: reports.length,
        totalSurrenderRequests: surrenderRequests.length,
        pendingApplications: applications.filter(app => app.status === 'PENDING').length,
        urgentRequests: surrenderRequests.filter(req => req.isUrgent).length
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      setError('Failed to load dashboard statistics.');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'blue',
      link: '/admin/users',
      description: 'Registered account holders'
    },
    {
      title: 'Dogs Available',
      value: stats.totalDogs,
      icon: Dog,
      color: 'green',
      link: '/admin/dogs',
      description: 'Dogs for adoption and sale'
    },
    {
      title: 'Applications',
      value: stats.totalApplications,
      icon: FileText,
      color: 'purple',
      link: '/admin/applications',
      description: 'Adoption and purchase applications'
    },
    {
      title: 'Reports',
      value: stats.totalReports,
      icon: AlertTriangle,
      color: 'orange',
      link: '/admin/reports',
      description: 'Lost/injured dog reports'
    },
    {
      title: 'Surrender Requests',
      value: stats.totalSurrenderRequests,
      icon: Heart,
      color: 'pink',
      link: '/admin/surrender',
      description: 'Dog surrender requests'
    }
  ];

  const quickActions = [
    {
      title: 'Add New Dog',
      description: 'Add a dog for adoption or sale',
      icon: Dog,
      link: '/admin/dogs',
      color: 'green'
    },
    {
      title: 'View Applications',
      description: 'Review pending applications',
      icon: FileText,
      link: '/admin/applications',
      color: 'purple'
    },
    {
      title: 'Manage Users',
      description: 'View and manage user accounts',
      icon: Users,
      link: '/admin/users',
      color: 'blue'
    },
    {
      title: 'Review Reports',
      description: 'Check lost/injured dog reports',
      icon: AlertTriangle,
      link: '/admin/reports',
      color: 'orange'
    }
  ];

  if (loading) {
    return (
      <div className="admin-dashboard-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <div className="welcome-section">
            <h1>Admin Dashboard</h1>
            <p>Welcome back! Here's an overview of your Home4Paws platform.</p>
          </div>
          <div className="refresh-section">
            <button onClick={fetchDashboardStats} className="refresh-btn">
              <Activity size={16} />
              Refresh Data
            </button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => setError('')}>×</button>
        </div>
      )}

      {/* Stats Overview */}
      <div className="stats-section">
        <h2>Platform Overview</h2>
        <div className="stats-grid">
          {statCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <Link key={index} to={card.link} className={`stat-card ${card.color}`}>
                <div className="stat-icon">
                  <Icon size={24} />
                </div>
                <div className="stat-content">
                  <div className="stat-value">{card.value}</div>
                  <div className="stat-title">{card.title}</div>
                  <div className="stat-description">{card.description}</div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions-section">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Link key={index} to={action.link} className={`action-card ${action.color}`}>
                <div className="action-icon">
                  <Icon size={24} />
                </div>
                <div className="action-content">
                  <h3>{action.title}</h3>
                  <p>{action.description}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="activity-section">
        <h2>Recent Activity</h2>
        <div className="activity-cards">
          <div className="activity-card">
            <div className="activity-header">
              <Clock className="activity-icon" />
              <span>Pending Applications</span>
            </div>
            <div className="activity-value">{stats.pendingApplications}</div>
            <div className="activity-description">Applications awaiting review</div>
          </div>
          
          <div className="activity-card">
            <div className="activity-header">
              <AlertTriangle className="activity-icon" />
              <span>Urgent Requests</span>
            </div>
            <div className="activity-value">{stats.urgentRequests}</div>
            <div className="activity-description">Urgent surrender requests</div>
          </div>
          
          <div className="activity-card">
            <div className="activity-header">
              <TrendingUp className="activity-icon" />
              <span>Total Platform Activity</span>
            </div>
            <div className="activity-value">
              {stats.totalUsers + stats.totalDogs + stats.totalApplications + stats.totalReports + stats.totalSurrenderRequests}
            </div>
            <div className="activity-description">All platform interactions</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
