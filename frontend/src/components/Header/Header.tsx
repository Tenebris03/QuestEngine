import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useUser } from '../../context/UserContext';
import './Header.css';


/**
 * Global Header Component
 * Beinhaltet das Logo, die Hauptnavigation, den Sprachwechsler und das Benutzerprofil.
 */
const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useUser();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === 'de' ? 'en' : 'de';
    i18n.changeLanguage(newLang);
  };

  return (
    <header className="header">
      <Link to="/" className="header-logo">
        <img src="/favicon.svg" alt={t('header.logoAlt')} width="28" height="28" />
        <span>QuestEngine</span>
      </Link>

      <nav className="header-nav" aria-label={t('header.aria.mainNav')}>
        <Link to="/" className="nav-link">{t('header.nav.home')}</Link>
        <Link to="/dashboard" className="nav-link">{t('header.nav.dashboard')}</Link>
        <Link to="/quest-generator" className="nav-link">{t('header.nav.questGenerator')}</Link>
      </nav>

      <div className="header-actions">
        <button
          className="language-toggle"
          onClick={toggleLanguage}
          aria-label={t('header.language.label')}
          title={t('header.language.label')}
        >
          {i18n.language === 'de' ? '🇩🇪' : '🇬🇧'}
        </button>

        {isAuthenticated && user ? (
          <div className="header-auth">
            <Link to="/settings" className="header-profile" aria-label={t('header.aria.openSettings')}>
              <span className="header-username">{user.name}</span>
              <img
                src={user.profilePicture}
                alt={`${user.name}'s profile`}
                className="header-avatar"
                width="36"
                height="36"
              />
            </Link>
            <button className="header-logout-btn" onClick={handleLogout} aria-label={t('header.aria.logout')}>
              {t('header.user.logout')}
            </button>
          </div>
        ) : (
          <div className="header-auth">
            <Link to="/login" className="nav-link">{t('header.user.login')}</Link>
            <Link to="/register" className="nav-link nav-link--cta">{t('header.user.register')}</Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
