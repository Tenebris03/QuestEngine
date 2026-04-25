import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import './Header.css';


/**
 * Global Header Component
 * Beinhaltet das Logo, die Hauptnavigation und das Benutzerprofil.
 */
const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="header">
      <Link to="/" className="header-logo">
        {/* Hier binden wir das SVG aus dem public-Ordner ein */}
        <img src="/favicon.svg" alt="MySpace Logo" width="28" height="28" />
        <span>QuestEngine</span>
      </Link>

      
      <nav className="header-nav" aria-label="Hauptnavigation">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/dashboard" className="nav-link">Dashboard</Link>
        <Link to="/quest-generator" className="nav-link">Quest Generator</Link>
      </nav>

      {isAuthenticated && user ? (
        <div className="header-auth">
          <Link to="/settings" className="header-profile" aria-label="Open settings">
            <span className="header-username">{user.name}</span>
            <img
              src={user.profilePicture}
              alt={`${user.name}'s profile`}
              className="header-avatar"
              width="36"
              height="36"
            />
          </Link>
          <button className="header-logout-btn" onClick={handleLogout} aria-label="Logout">
            Logout
          </button>
        </div>
      ) : (
        <div className="header-auth">
          <Link to="/login" className="nav-link">Login</Link>
          <Link to="/register" className="nav-link nav-link--cta">Register</Link>
        </div>
      )}
    </header>
  );
};

export default Header;
