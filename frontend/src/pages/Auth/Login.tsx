import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import './Auth.css';

interface FormErrors {
  username?: string;
  password?: string;
}

const Login: React.FC = () => {
  const { login } = useUser();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [authError, setAuthError] = useState('');

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!username.trim()) {
      newErrors.username = 'Username is required.';
    } else if (username.trim().length < 3) {
      newErrors.username = 'Username must be at least 3 characters.';
    }

    if (!password) {
      newErrors.password = 'Password is required.';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
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
      setAuthError('Invalid username or password.');
    }
  };

  const isFormValid = username.trim().length >= 3 && password.length >= 6;

  return (
    <div className="auth-container">
      <h1 className="auth-title">System Login</h1>
      <p className="auth-subtitle">Enter your credentials to access the system.</p>

      {authError && <div className="auth-error">{authError}</div>}

      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="login-username" className="form-label">
            Username
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
            placeholder="Enter your username"
            autoComplete="username"
          />
          <div className="error-message">{errors.username || ''}</div>
        </div>

        <div className="form-group">
          <label htmlFor="login-password" className="form-label">
            Password
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
            placeholder="Enter your password"
            autoComplete="current-password"
          />
          <div className="error-message">{errors.password || ''}</div>
        </div>

        <button type="submit" className="auth-submit-btn" disabled={!isFormValid}>
          Login
        </button>
      </form>

      <p className="auth-footer">
        No account yet? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
};

export default Login;

