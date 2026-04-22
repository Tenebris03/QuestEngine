import React from 'react';
import './Header.css';

/**
 * Global Header Component
 * Beinhaltet das Logo und die Hauptnavigation.
 */
const Header: React.FC = () => {
  return (
    <header className="header">
      <a href="/" className="header-logo">
        {/* Hier binden wir das SVG aus dem public-Ordner ein */}
        <img src="/favicon.svg" alt="MySpace Logo" width="28" height="28" />
        <span>QuestEngine</span>
      </a>
      
      <nav className="header-nav" aria-label="Hauptnavigation">
        <a href="/" className="nav-link">Home</a>
        <a href="/dashboard" className="nav-link">Dashboard</a>
        <a href="/about" className="nav-link">About</a>
      </nav>
    </header>
  );
};

export default Header;