import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaChartBar, FaUsers, FaClipboardCheck, FaSignOutAlt, FaBars } from 'react-icons/fa';
import '../styles/AdminLayout.css';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleLogout = () => {
    if (window.confirm('Apakah Anda yakin ingin logout?')) {
      logout();
      navigate('/login');
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="admin-layout">
      {/* Top Navigation Bar */}
      <nav className="admin-navbar">
        <div className="admin-nav-container">
          <div className="admin-nav-brand">
            <img src="/logo-mandiri.png" alt="Bank Mandiri" className="admin-logo" />
            <div className="admin-brand-text">
              <h2>Admin Panel</h2>
              <p>Sistem Absensi & Logbook Magang</p>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
            <FaBars />
          </button>

          {/* Navigation Menu */}
          <div className={`admin-nav-menu ${mobileMenuOpen ? 'active' : ''}`}>
            <div className="admin-nav-links">
              <a href="#statistics" className="admin-nav-link">
                <FaChartBar />
                <span>Statistik</span>
              </a>
              <a href="#peserta" className="admin-nav-link">
                <FaUsers />
                <span>Peserta Magang</span>
              </a>
              <a href="#validasi" className="admin-nav-link">
                <FaClipboardCheck />
                <span>Validasi Logbook</span>
              </a>
            </div>

            {/* User Info & Logout */}
            <div className="admin-nav-user">
              <div className="admin-user-info">
                <span className="admin-user-name">{user?.nama_lengkap}</span>
                <span className="admin-user-role">Administrator</span>
              </div>
              <button className="admin-logout-btn" onClick={handleLogout}>
                <FaSignOutAlt />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="admin-main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
