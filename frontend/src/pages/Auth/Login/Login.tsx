import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useUser } from '../../../context/UserContext';
import '../Auth.css';

interface FormErrors {
  email?: string;
  password?: string;
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Login: React.FC = () => {
  const { t } = useTranslation('auth');
  const { login } = useUser();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [authError, setAuthError] = useState('');

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!email.trim()) {
      newErrors.email = t('form.errors.emailRequired');
    } else if (!emailRegex.test(email.trim())) {
      newErrors.email = t('form.errors.emailInvalid');
    }

    if (!password.trim()) {
      newErrors.password = t('form.errors.passwordRequired');
    } else if (password.trim().length < 6) {
      newErrors.password = t('form.errors.passwordMinLength');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    if (!validate()) return;

    const success = await login(email.trim(), password.trim());
    if (success) {
      navigate('/dashboard');
    } else {
      setAuthError(t('form.errors.invalidCredentials'));
    }
  };

  const isFormValid = emailRegex.test(email.trim()) && password.trim().length >= 6;

  return (
    <div className="auth-container">
      <h1 className="auth-title">{t('title')}</h1>
      <p className="auth-subtitle">{t('subtitle')}</p>

      {authError && <div className="auth-error">{authError}</div>}

<form className="auth-form" onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="login-email" className="form-label">
            {t('form.email.label')}
          </label>
          <input
            id="login-email"
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
          <label htmlFor="login-password" className="form-label">
            {t('form.password.label')}
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
            placeholder={t('form.password.placeholder')}
            autoComplete="current-password"
          />
          <div className="error-message">{errors.password || ''}</div>
        </div>

        <button type="submit" className="auth-submit-btn" disabled={!isFormValid}>
          {t('form.submit')}
        </button>
      </form>

      <p className="auth-footer">
        {t('footer')} <Link to="/register">{t('user.register')}</Link>
      </p>
    </div>
  );
};

export default Login;
