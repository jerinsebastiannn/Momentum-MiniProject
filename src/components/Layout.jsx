import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import './Layout.css';

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="layout">
      <button
        type="button"
        className="sidebar-toggle"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle menu"
      >
        <span className="sidebar-toggle-icon">☰</span>
      </button>

      <aside className={`sidebar ${sidebarOpen ? 'sidebar--open' : ''}`}>
        <div className="sidebar-overlay" onClick={closeSidebar} aria-hidden="true" />

        <div className="sidebar-content">
          <NavLink to="/dashboard" className="sidebar-brand" onClick={closeSidebar}>
            <span className="sidebar-logo">M</span>
            <div className="sidebar-brand-text">
              <span className="sidebar-brand-name">Momentum</span>
              <span className="sidebar-brand-tagline">Track. Improve. Repeat.</span>
            </div>
          </NavLink>

          <nav className="sidebar-nav">
            <NavLink
              to="/dashboard"
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={closeSidebar}
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/calendar"
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={closeSidebar}
            >
              Calendar
            </NavLink>
            <NavLink
              to="/statistics"
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={closeSidebar}
            >
              Stats
            </NavLink>
          </nav>

          <div className="sidebar-footer">
            <div className="sidebar-profile">
              <div className="sidebar-avatar" aria-hidden="true">
                {user?.name?.charAt(0)?.toUpperCase() || '?'}
              </div>
              <span className="sidebar-user-name">{user?.name || 'User'}</span>
            </div>
            <button
              type="button"
              className="sidebar-theme-toggle"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              <span className="theme-icon">{theme === 'light' ? '🌙' : '☀️'}</span>
              {theme === 'light' ? 'Dark mode' : 'Light mode'}
            </button>
            <button type="button" className="sidebar-logout" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </aside>

      <main className="layout-main">{children}</main>
    </div>
  );
}
