import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useUser } from '../../context/UserContext';
import './Auth.css';

interface FormErrors {
  email?: string;
  password?: string;
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Login: React.FC = () => {
  const { t } = useTranslation();
  const { login } = useUser();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [authError, setAuthError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!email.trim()) {
      newErrors.email = t('login.form.email.errors.required');
    } else if (!emailRegex.test(email.trim())) {
      newErrors.email = t('login.form.email.errors.invalid');
    }

    if (!password) {
      newErrors.password = t('login.form.password.errors.required');
    } else if (password.length < 6) {
      newErrors.password = t('login.form.password.errors.minLength');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    if (!validate()) return;

    setIsLoading(true);
    try {
      const success = await login(email.trim(), password);
      if (success) {
        navigate('/dashboard');
      } else {
        setAuthError(t('login.form.errors.invalidCredentials'));
      }
    } catch {
      setAuthError(t('login.form.errors.invalidCredentials'));
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = emailRegex.test(email.trim()) && password.length >= 6;

  return (
    <div className="auth-container">
      <h1 className="auth-title">{t('login.title')}</h1>
      <p className="auth-subtitle">{t('login.subtitle')}</p>

      {authError && <div className="auth-error">{authError}</div>}

      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="login-email" className="form-label">
            {t('login.form.email.label')}
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
            placeholder={t('login.form.email.placeholder')}
            autoComplete="email"
          />
          <div className="error-message">{errors.email || ''}</div>
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

        <button type="submit" className="auth-submit-btn" disabled={!isFormValid || isLoading}>
          {isLoading ? t('login.form.loading') : t('login.form.submit')}
        </button>
      </form>

      <p className="auth-footer">
        {t('login.footer')} <Link to="/register">{t('header.user.register')}</Link>
      </p>
    </div>
  );
};

export default Login;
