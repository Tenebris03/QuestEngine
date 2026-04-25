import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import './Settings.css';

const Settings: React.FC = () => {
  const { user, updateUser, isAuthenticated } = useUser();
  const [name, setName] = useState(user?.name ?? '');
  const [profilePicture, setProfilePicture] = useState(user?.profilePicture ?? '');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({ name, profilePicture });
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="settings-container">
        <h1 className="settings-title">Settings</h1>
        <p className="settings-subtitle">You must be logged in to customize your profile.</p>
        <Link to="/login" className="settings-save-btn" style={{ textDecoration: 'none', display: 'inline-flex' }}>
          Login to System
        </Link>
      </div>
    );
  }

  return (
    <div className="settings-container">
      <h1 className="settings-title">Settings</h1>
      <p className="settings-subtitle">Customize your adventurer profile.</p>

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
            Adventurer Name
          </label>
          <input
            id="settings-name"
            type="text"
            className="form-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="settings-avatar" className="form-label">
            Profile Picture URL
          </label>
          <input
            id="settings-avatar"
            type="url"
            className="form-input"
            value={profilePicture}
            onChange={(e) => setProfilePicture(e.target.value)}
            placeholder="https://example.com/avatar.png"
          />
        </div>

        <button type="submit" className="settings-save-btn">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default Settings;

