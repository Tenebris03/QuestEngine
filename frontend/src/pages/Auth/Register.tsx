import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import './Auth.css';

interface FormErrors {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Register: React.FC = () => {
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
      newErrors.username = 'Username is required.';
    } else if (username.trim().length < 3) {
      newErrors.username = 'Username must be at least 3 characters.';
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!emailRegex.test(email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!password) {
      newErrors.password = 'Password is required.';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password.';
    } else if (confirmPassword !== password) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');

    if (!validate()) return;

    const success = register(username.trim(), email.trim(), password);
    if (success) {
      setSuccessMessage('Registration successful! Redirecting to login...');
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
      <h1 className="auth-title">Join the System</h1>
      <p className="auth-subtitle">Create your account to begin your journey.</p>

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
            Username
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
            placeholder="Choose a username"
            autoComplete="username"
          />
          <div className="error-message">{errors.username || ''}</div>
        </div>

        <div className="form-group">
          <label htmlFor="register-email" className="form-label">
            Email
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
            placeholder="your@email.com"
            autoComplete="email"
          />
          <div className="error-message">{errors.email || ''}</div>
        </div>

        <div className="form-group">
          <label htmlFor="register-password" className="form-label">
            Password
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
            placeholder="Create a password"
            autoComplete="new-password"
          />
          <div className="error-message">{errors.password || ''}</div>
        </div>

        <div className="form-group">
          <label htmlFor="register-confirm" className="form-label">
            Confirm Password
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
            placeholder="Repeat your password"
            autoComplete="new-password"
          />
          <div className="error-message">{errors.confirmPassword || ''}</div>
        </div>

        <button type="submit" className="auth-submit-btn" disabled={!isFormValid}>
          Register
        </button>
      </form>

      <p className="auth-footer">
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
};

export default Register;

