import React from 'react';
import './Footer.css';

/**
 * Global Footer Component
 */
const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <img src="/favicon.svg" alt="" width="20" height="20" />
          <span>QuestEngine</span>
        </div>
        <ul className="footer-links">
          <li><a href="/">Home</a></li>
          <li><a href="/quest-generator">Quest Generator</a></li>
          <li><a href="/about">About</a></li>
        </ul>
        <div className="footer-divider" />
        <p className="footer-text">
          &copy; {currentYear} QuestEngine. All rights reserved. Gebaut mit React & Vite.
        </p>
      </div>
    </footer>
  );
};

export default Footer;