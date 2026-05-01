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

      <div className="social-login-divider">
        <span>{t('social.orContinueWith')}</span>
      </div>

      <div className="social-login-buttons">
        <button
          type="button"
          className="social-login-btn google"
          onClick={() => window.open('http://localhost:3001/auth/google', '_self')}
          title="Continue with Google"
        >
          <svg viewBox="0 0 24 24" width="20" height="20">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.63l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.96 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.96 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Google
        </button>

        <button
          type="button"
          className="social-login-btn github"
          onClick={() => window.open('http://localhost:3001/auth/github', '_self')}
          title="Continue with GitHub"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
          GitHub
        </button>

        <button
          type="button"
          className="social-login-btn discord"
          onClick={() => window.open('http://localhost:3001/auth/discord', '_self')}
          title="Continue with Discord"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.0771 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.0771 0 01-.0076-.1277c.1258-.0943.2517-.1923.3713-.2924a.0743.0743 0 01.0776.0107c.184.4514.4279.8758.768 1.2617a.087.087 0 01-.0584.1392c-.2582.0523-.4589.1412-.6257.2121a.074.074 0 01-.0262-.0251c.2376-.2098.4764-.4217.6945-.6264a.075.075 0 01.0768-.0184c.2745.0409.5406.0907.7925.1257a.077.0771 0 01.0718.0254zm-9.022 12.6081c-.1149 0-.2079-.0403-.2931-.1312a.0852.0852 0 01-.0134-.1445c0-.1098.0287-.2022.0895-.2791a.0747.0747 0 01.0728-.0226c.1146.0095.2185.0396.3119.0912a.085.085 0 01.0114.1382c.0029.1075-.0254.2072-.0841.2918a.0747.0747 0 01-.0691.0278c-.104-.0071-.2017-.0364-.2929-.131zm.1028-.1695c-.1072 0-.1967-.0326-.2676-.0971a.0756.0756 0 01-.0093-.1449c0-.11.0288-.2029.0872-.2791a.0747.0747 0 01.0727-.0226c.1146.0095.2185.0396.3119.0912a.085.085 0 01.0114.1382c.0029.1075-.0255.2072-.0841.2918a.0747.0747 0 01-.069.0278zM15.393 9.1291c-.0793 0-.1507-.0259-.215-.0766a.0661.0661 0 01-.0169-.1312c.0433-.0777.1099-.1466.1993-.2067a.0779.0779 0 01.1038.0027c.0937.0603.1628.1422.2065.2498.0443.1088.0145.1944-.0806.2627a.0779.0779 0 01-.0968-.095zm.027 1.9433c-.0599 0-.1127-.0205-.1591-.061a.0531.0531 0 01-.0192-.1061c.0296-.0592.0759-.1082.1393-.1473a.0702.0702 0 01.1045.0091c.0677.0546.108.1295.1208.2247.015.0955-.0187.1725-.101 .2311a.0702.0702 0 01-.0844-.1506z"/>
          </svg>
          Discord
        </button>
      </div>

      <p className="auth-footer">
        {t('footer')} <Link to="/register">{t('user.register')}</Link>
      </p>
    </div>
  );
};

export default Login;
