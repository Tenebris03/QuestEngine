import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useUser } from '../../context/UserContext';
import './Settings.css';

const Settings: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { user, updateUser, isAuthenticated } = useUser();
  const [name, setName] = useState(user?.name ?? '');
  const [profilePicture, setProfilePicture] = useState(user?.profilePicture ?? '');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({ name, profilePicture });
  };

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="settings-container">
        <h1 className="settings-title">{t('settings.title')}</h1>
        <p className="settings-subtitle">{t('settings.unauthenticated.subtitle')}</p>
        <Link to="/login" className="settings-save-btn" style={{ textDecoration: 'none', display: 'inline-flex' }}>
          {t('settings.unauthenticated.loginButton')}
        </Link>
      </div>
    );
  }

  return (
    <div className="settings-container">
      <h1 className="settings-title">{t('settings.title')}</h1>
      <p className="settings-subtitle">{t('settings.subtitle')}</p>

      <form className="settings-form" onSubmit={handleSave}>
        <div className="settings-preview">
          <img
            src={profilePicture || user.profilePicture}
            alt="Profile preview"
            className="settings-avatar"
            onError={(e) => {
              (e.target as HTMLImageElement).src = user.profilePicture;
            }}
          />
        </div>

        <div className="form-group">
          <label htmlFor="settings-name" className="form-label">
            {t('settings.form.name.label')}
          </label>
          <input
            id="settings-name"
            type="text"
            className="form-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t('settings.form.name.placeholder')}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="settings-avatar" className="form-label">
            {t('settings.form.avatar.label')}
          </label>
          <input
            id="settings-avatar"
            type="url"
            className="form-input"
            value={profilePicture}
            onChange={(e) => setProfilePicture(e.target.value)}
            placeholder={t('settings.form.avatar.placeholder')}
          />
        </div>

        <div className="form-group">
          <label htmlFor="settings-language" className="form-label">
            {t('settings.form.language.label')}
          </label>
          <select
            id="settings-language"
            className="form-input"
            value={i18n.language}
            onChange={(e) => handleLanguageChange(e.target.value)}
          >
            <option value="en">{t('settings.form.language.en')}</option>
            <option value="de">{t('settings.form.language.de')}</option>
          </select>
        </div>

        <button type="submit" className="settings-save-btn">
          {t('settings.form.submit')}
        </button>
      </form>
    </div>
  );
};

export default Settings;

