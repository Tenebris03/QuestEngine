import React from 'react';
import { useTranslation } from 'react-i18next';
import './Footer.css';

/**
 * Global Footer Component
 */
const Footer: React.FC = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <img src="/favicon.svg" alt="" width="20" height="20" />
          <span>QuestEngine</span>
        </div>
        <ul className="footer-links">
          <li><a href="/">{t('footer.links.home')}</a></li>
          <li><a href="/quest-generator">{t('footer.links.questGenerator')}</a></li>
          <li><a href="/about">{t('footer.links.about')}</a></li>
        </ul>
        <div className="footer-divider" />
        <p className="footer-text">
          {t('footer.copyright', { year: currentYear })}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
