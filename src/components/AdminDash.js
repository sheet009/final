import React, { useEffect, useState } from 'react';
import { Route, Routes, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminDash.css'; // Import the updated CSS

import AdminDon from './AdminDon';
import AdminReq from './AdminReq';
import AdminUser from './AdminUser';
import AdminCon from './AdminCon';

const AdminDash = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalRecipients: 0,
    totalDonors: 0,
    totalRequests: 0,
    totalDonations: 0,
  });

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'ADMIN') {
      navigate('/login');
    } else {
      fetchStatistics();
    }
  }, [navigate]);

  const fetchStatistics = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/admin/stats', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
      });
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    document.cookie = 'JSESSIONID=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    navigate('/login', { replace: true });
  };

  return (
    <div className="admin-dashboard-container">
      {/* Matrix Rain Background */}
      <div className="matrix-rain">
        {Array(50)
          .fill()
          .map((_, i) => (
            <div
              key={i}
              className="matrix-character"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            >
              {String.fromCharCode(0x30A0 + Math.random() * 96)}
            </div>
          ))}
      </div>

      {/* Sidebar (Always visible) */}
      <div className="admin-dashboard-sidebar">
        <h2>Admin Dashboard</h2>
        <ul>
          <li>
            <Link to="/admindash/donations">Donations</Link>
          </li>
          <li>
            <Link to="/admindash/users">Users</Link>
          </li>
          <li>
            <Link to="/admindash/requests">Requests</Link>
          </li>
          <li>
            <Link to="/admindash/messages">Messages</Link>
          </li>
        </ul>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="admin-dashboard-main-content">
        {/* Statistics */}
        {/* <div className="stats-section"> */}
          <h3>Welcome Admin!</h3>
          <div className="stats-grid">
            {Object.entries(stats).map(([key, value]) => (
              <div key={key} className="stat-card">
                <h4>{key.replace('total', '').toUpperCase()}</h4>
                <p>{value}</p>
              </div>
            ))}
          </div>
        {/* </div> */}

        {/* Nested Routes */}
        <Routes>
          <Route path="donations" element={<AdminDon />} />
          <Route path="users" element={<AdminUser />} />
          <Route path="requests" element={<AdminReq />} />
          <Route path="messages" element={<AdminCon />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminDash;
