import React from 'react';
import './Footer.css';

/**
 * Global Footer Component
 */
const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <p className="footer-text">
        &copy; {currentYear} MySpace. All rights reserved. Gebaut mit React & Vite.
      </p>
    </footer>
  );
};

export default Footer;