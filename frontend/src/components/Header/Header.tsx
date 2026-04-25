import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';


/**
 * Global Header Component
 * Beinhaltet das Logo und die Hauptnavigation.
 */
const Header: React.FC = () => {
  return (
    <header className="header">
      <Link to="/" className="header-logo">
        {/* Hier binden wir das SVG aus dem public-Ordner ein */}
        <img src="/favicon.svg" alt="MySpace Logo" width="28" height="28" />
        <span>QuestEngine</span>
      </Link>

      
      <nav className="header-nav" aria-label="Hauptnavigation">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/quest-generator" className="nav-link">Quest Generator</Link>
        <Link to="/about" className="nav-link">About</Link>

      </nav>
    </header>
  );
};

export default Header;
