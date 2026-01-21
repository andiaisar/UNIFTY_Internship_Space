import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaHome, FaClipboardCheck, FaBook, FaHistory, FaUser, FaSignOutAlt, FaBars, FaTimes, FaUserShield } from 'react-icons/fa';
import '../styles/Layout.css';
import logoMagang from '../../img/logo_unify.png';

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const handleLogout = () => {
    if (window.confirm('Apakah Anda yakin ingin logout?')) {
      logout();
      navigate('/login');
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="layout">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            <img src={logoMagang} alt="UNIFY Internship Space" />
          </div>
          <h3>UNIFY Internship Space</h3>
          <button className="close-sidebar" onClick={closeSidebar}>
            <FaTimes />
          </button>
        </div>

        <div className="user-info">
          <div className="user-avatar">
            {user?.foto_profil ? (
              <img src={user.foto_profil} alt={user.nama_lengkap} />
            ) : (
              <FaUser />
            )}
          </div>
          <div className="user-details">
            <h4>{user?.nama_lengkap}</h4>
            <p>{user?.nim_nip}</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/dashboard" className="nav-item" onClick={closeSidebar}>
            <FaHome />
            <span>Dashboard</span>
          </NavLink>
          {user?.role === 'admin' && (
            <NavLink to="/admin" className="nav-item" onClick={closeSidebar}>
              <FaUserShield />
              <span>Admin Panel</span>
            </NavLink>
          )}
          <NavLink to="/absensi" className="nav-item" onClick={closeSidebar}>
            <FaClipboardCheck />
            <span>Absensi</span>
          </NavLink>
          <NavLink to="/logbook" className="nav-item" onClick={closeSidebar}>
            <FaBook />
            <span>Logbook</span>
          </NavLink>
          <NavLink to="/history" className="nav-item" onClick={closeSidebar}>
            <FaHistory />
            <span>Riwayat</span>
          </NavLink>
          <NavLink to="/profile" className="nav-item" onClick={closeSidebar}>
            <FaUser />
            <span>Profil</span>
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <header className="header">
          <button className="menu-toggle" onClick={toggleSidebar}>
            <FaBars />
          </button>
          <div className="header-title">
            <h1>Sistem Absensi & Logbook Magang</h1>
          </div>
          <div className="header-user">
            <span>{user?.nama_lengkap}</span>
            <div className="user-avatar-small">
              {user?.foto_profil ? (
                <img src={user.foto_profil} alt={user.nama_lengkap} />
              ) : (
                <FaUser />
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="page-content">
          <Outlet />
        </main>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && <div className="overlay" onClick={closeSidebar}></div>}
    </div>
  );
};

export default Layout;
