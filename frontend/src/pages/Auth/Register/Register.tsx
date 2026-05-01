import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useUser } from '../../../context/UserContext';
import '../Auth.css';

interface FormErrors {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Register: React.FC = () => {
  const { t } = useTranslation('auth');
  const { register } = useUser();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [successMessage, setSuccessMessage] = useState('');

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!username.trim()) {
      newErrors.username = t('form.errors.usernameRequired');
    } else if (username.trim().length < 3) {
      newErrors.username = t('form.errors.usernameMinLength');
    }

    if (!email.trim()) {
      newErrors.email = t('form.errors.emailRequired');
    } else if (!emailRegex.test(email.trim())) {
      newErrors.email = t('form.errors.emailInvalid');
    }

    if (!password) {
      newErrors.password = t('form.errors.passwordRequired');
    } else if (password.length < 6) {
      newErrors.password = t('form.errors.passwordMinLength');
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = t('form.errors.confirmRequired');
    } else if (confirmPassword !== password) {
      newErrors.confirmPassword = t('form.errors.passwordMismatch');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');

    if (!validate()) return;

    // Register expects: (email, password, firstName, lastName)
    const success = await register(email.trim(), password, username.trim());
    
    if (success) {
      setSuccessMessage(t('success'));
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    }
  };

  const isFormValid =
    username.trim().length >= 3 &&
    emailRegex.test(email.trim()) &&
    password.length >= 6 &&
    confirmPassword === password;

  return (
    <div className="auth-container">
      <h1 className="auth-title">{t('title')}</h1>
      <p className="auth-subtitle">{t('subtitle')}</p>

      {successMessage && (
        <div
          className="auth-error"
          style={{
            background: 'var(--success-soft)',
            borderColor: 'rgba(16, 185, 129, 0.2)',
            color: 'var(--success)',
          }}
        >
          {successMessage}
        </div>
      )}

      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="register-username" className="form-label">
            {t('form.username.label')}
          </label>
          <input
            id="register-username"
            type="text"
            className={`form-input ${errors.username ? 'error' : ''}`}
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              if (errors.username) setErrors((prev) => ({ ...prev, username: undefined }));
            }}
            placeholder={t('form.username.placeholder')}
            autoComplete="username"
          />
          <div className="error-message">{errors.username || ''}</div>
        </div>

        <div className="form-group">
          <label htmlFor="register-email" className="form-label">
            {t('form.email.label')}
          </label>
          <input
            id="register-email"
            type="email"
            className={`form-input ${errors.email ? 'error' : ''}`}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
            }}
            placeholder={t('form.email.placeholder')}
            autoComplete="email"
          />
          <div className="error-message">{errors.email || ''}</div>
        </div>

        <div className="form-group">
          <label htmlFor="register-password" className="form-label">
            {t('form.password.label')}
          </label>
          <input
            id="register-password"
            type="password"
            className={`form-input ${errors.password ? 'error' : ''}`}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
            }}
            placeholder={t('form.password.placeholder')}
            autoComplete="new-password"
          />
          <div className="error-message">{errors.password || ''}</div>
        </div>

        <div className="form-group">
          <label htmlFor="register-confirm" className="form-label">
            {t('form.confirmPassword.label')}
          </label>
          <input
            id="register-confirm"
            type="password"
            className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
            }}
            placeholder={t('form.confirmPassword.placeholder')}
            autoComplete="new-password"
          />
          <div className="error-message">{errors.confirmPassword || ''}</div>
        </div>

        <button type="submit" className="auth-submit-btn" disabled={!isFormValid}>
          {t('form.submit')}
        </button>
      </form>

      <p className="auth-footer">
        {t('footer')} <Link to="/login">{t('user.login')}</Link>
      </p>
    </div>
  );
};

export default Register;
