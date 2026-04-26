import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useUser } from '../../context/UserContext';
import './Auth.css';

interface FormErrors {
  username?: string;
  password?: string;
}

const Login: React.FC = () => {
  const { t } = useTranslation();
  const { login } = useUser();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [authError, setAuthError] = useState('');

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!username.trim()) {
      newErrors.username = t('login.form.errors.usernameRequired');
    } else if (username.trim().length < 3) {
      newErrors.username = t('login.form.errors.usernameMinLength');
    }

    if (!password) {
      newErrors.password = t('login.form.errors.passwordRequired');
    } else if (password.length < 6) {
      newErrors.password = t('login.form.errors.passwordMinLength');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    if (!validate()) return;

    const success = login(username.trim(), password);
    if (success) {
      navigate('/dashboard');
    } else {
      setAuthError(t('login.form.errors.invalidCredentials'));
    }
  };

  const isFormValid = username.trim().length >= 3 && password.length >= 6;

  return (
    <div className="auth-container">
      <h1 className="auth-title">{t('login.title')}</h1>
      <p className="auth-subtitle">{t('login.subtitle')}</p>

      {authError && <div className="auth-error">{authError}</div>}

      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="login-username" className="form-label">
            {t('login.form.username.label')}
          </label>
          <input
            id="login-username"
            type="text"
            className={`form-input ${errors.username ? 'error' : ''}`}
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              if (errors.username) setErrors((prev) => ({ ...prev, username: undefined }));
            }}
            placeholder={t('login.form.username.placeholder')}
            autoComplete="username"
          />
          <div className="error-message">{errors.username || ''}</div>
        </div>

        <div className="form-group">
          <label htmlFor="login-password" className="form-label">
            {t('login.form.password.label')}
          </label>
          <input
            id="login-password"
            type="password"
            className={`form-input ${errors.password ? 'error' : ''}`}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
            }}
            placeholder={t('login.form.password.placeholder')}
            autoComplete="current-password"
          />
          <div className="error-message">{errors.password || ''}</div>
        </div>

        <button type="submit" className="auth-submit-btn" disabled={!isFormValid}>
          {t('login.form.submit')}
        </button>
      </form>

      <p className="auth-footer">
        {t('login.footer')} <Link to="/register">{t('header.user.register')}</Link>
      </p>
    </div>
  );
};

export default Login;

