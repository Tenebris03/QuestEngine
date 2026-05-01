/**
 * Unit Tests for Register Page
 * Tests form validation, submission, and navigation.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Register from './Register';

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    Link: ({ to, children, ...props }: any) => <a href={to} {...props}>{children}</a>,
  };
});

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'title': 'Create Account',
        'subtitle': 'Join the fitness quest',
        'success': 'Account created successfully!',
        'form.username.label': 'Username',
        'form.username.placeholder': 'Enter username',
        'form.email.label': 'Email',
        'form.email.placeholder': 'Enter email',
        'form.password.label': 'Password',
        'form.password.placeholder': 'Enter password',
        'form.confirmPassword.label': 'Confirm Password',
        'form.confirmPassword.placeholder': 'Confirm password',
        'form.submit': 'Create Account',
        'form.errors.usernameRequired': 'Username is required',
        'form.errors.usernameMinLength': 'Username must be at least 3 characters',
        'form.errors.emailRequired': 'Email is required',
        'form.errors.emailInvalid': 'Invalid email format',
        'form.errors.passwordRequired': 'Password is required',
        'form.errors.passwordMinLength': 'Password must be at least 6 characters',
        'form.errors.confirmRequired': 'Please confirm your password',
        'form.errors.passwordMismatch': 'Passwords do not match',
        'footer': 'Already have an account?',
        'user.login': 'Log in',
      };
      return translations[key] || key;
    },
  }),
}));

// Mock UserContext
const mockUseUser = vi.fn();
vi.mock('../../../context/UserContext', () => ({
  useUser: () => mockUseUser(),
}));

const renderWithRouter = (ui: React.ReactElement) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('Register', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseUser.mockReturnValue({
      register: vi.fn().mockResolvedValue(true),
    });
  });

  it('should render register form with title and subtitle', () => {
    renderWithRouter(<Register />);

    expect(screen.getByRole('heading', { name: 'Create Account' })).toBeInTheDocument();
    expect(screen.getByText('Join the fitness quest')).toBeInTheDocument();
  });

  it('should render all form fields', () => {
    renderWithRouter(<Register />);

    expect(screen.getByLabelText('Username')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Create Account' })).toBeInTheDocument();
  });

  it('should render login link', () => {
    renderWithRouter(<Register />);

    expect(screen.getByRole('link', { name: 'Log in' })).toHaveAttribute('href', '/login');
  });

  it('should disable submit button when form is invalid', () => {
    renderWithRouter(<Register />);

    const submitButton = screen.getByRole('button', { name: 'Create Account' });
    expect(submitButton).toBeDisabled();
  });

  it('should enable submit button when form is valid', async () => {
    renderWithRouter(<Register />);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText('Username'), 'testuser');
    await user.type(screen.getByLabelText('Email'), 'test@example.com');
    await user.type(screen.getByLabelText('Password'), 'password123');
    await user.type(screen.getByLabelText('Confirm Password'), 'password123');

    const submitButton = screen.getByRole('button', { name: 'Create Account' });
    await waitFor(() => {
      expect(submitButton).toBeEnabled();
    });
  });

  it('should disable submit button when username is too short', async () => {
    renderWithRouter(<Register />);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText('Username'), 'ab');
    await user.type(screen.getByLabelText('Email'), 'test@example.com');
    await user.type(screen.getByLabelText('Password'), 'password123');
    await user.type(screen.getByLabelText('Confirm Password'), 'password123');

    const submitButton = screen.getByRole('button', { name: 'Create Account' });
    expect(submitButton).toBeDisabled();
  });

  it('should disable submit button when email is invalid', async () => {
    renderWithRouter(<Register />);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText('Username'), 'testuser');
    await user.type(screen.getByLabelText('Email'), 'invalid-email');
    await user.type(screen.getByLabelText('Password'), 'password123');
    await user.type(screen.getByLabelText('Confirm Password'), 'password123');

    const submitButton = screen.getByRole('button', { name: 'Create Account' });
    expect(submitButton).toBeDisabled();
  });

  it('should disable submit button when password is too short', async () => {
    renderWithRouter(<Register />);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText('Username'), 'testuser');
    await user.type(screen.getByLabelText('Email'), 'test@example.com');
    await user.type(screen.getByLabelText('Password'), '12345');
    await user.type(screen.getByLabelText('Confirm Password'), '12345');

    const submitButton = screen.getByRole('button', { name: 'Create Account' });
    expect(submitButton).toBeDisabled();
  });

  it('should disable submit button when passwords do not match', async () => {
    renderWithRouter(<Register />);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText('Username'), 'testuser');
    await user.type(screen.getByLabelText('Email'), 'test@example.com');
    await user.type(screen.getByLabelText('Password'), 'password123');
    await user.type(screen.getByLabelText('Confirm Password'), 'different');

    const submitButton = screen.getByRole('button', { name: 'Create Account' });
    expect(submitButton).toBeDisabled();
  });

  it('should enable submit button when form is valid', async () => {
    renderWithRouter(<Register />);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText('Username'), 'testuser');
    await user.type(screen.getByLabelText('Email'), 'test@example.com');
    await user.type(screen.getByLabelText('Password'), 'password123');
    await user.type(screen.getByLabelText('Confirm Password'), 'password123');

    const submitButton = screen.getByRole('button', { name: 'Create Account' });
    await waitFor(() => {
      expect(submitButton).toBeEnabled();
    });
  });

  it('should submit form successfully', async () => {
    const mockRegister = vi.fn().mockResolvedValue(true);
    mockUseUser.mockReturnValue({
      register: mockRegister,
    });

    renderWithRouter(<Register />);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText('Username'), 'testuser');
    await user.type(screen.getByLabelText('Email'), 'test@example.com');
    await user.type(screen.getByLabelText('Password'), 'password123');
    await user.type(screen.getByLabelText('Confirm Password'), 'password123');

    await user.click(screen.getByRole('button', { name: 'Create Account' }));

    expect(mockRegister).toHaveBeenCalledWith('test@example.com', 'password123', 'testuser');
  });

  it('should show success message and navigate on successful registration', async () => {
    const mockRegister = vi.fn().mockResolvedValue(true);
    mockUseUser.mockReturnValue({
      register: mockRegister,
    });

    renderWithRouter(<Register />);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText('Username'), 'testuser');
    await user.type(screen.getByLabelText('Email'), 'test@example.com');
    await user.type(screen.getByLabelText('Password'), 'password123');
    await user.type(screen.getByLabelText('Confirm Password'), 'password123');

    await user.click(screen.getByRole('button', { name: 'Create Account' }));

    await waitFor(() => {
      expect(screen.getByText('Account created successfully!')).toBeInTheDocument();
    });

    // Wait for navigation timeout
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    }, { timeout: 2000 });
  });

  it('should handle registration failure', async () => {
    const mockRegister = vi.fn().mockResolvedValue(false);
    mockUseUser.mockReturnValue({
      register: mockRegister,
    });

    renderWithRouter(<Register />);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText('Username'), 'testuser');
    await user.type(screen.getByLabelText('Email'), 'test@example.com');
    await user.type(screen.getByLabelText('Password'), 'password123');
    await user.type(screen.getByLabelText('Confirm Password'), 'password123');

    await user.click(screen.getByRole('button', { name: 'Create Account' }));

    expect(mockRegister).toHaveBeenCalled();
    // No success message should appear
    expect(screen.queryByText('Account created successfully!')).not.toBeInTheDocument();
  });

  it('should have correct form attributes', () => {
    renderWithRouter(<Register />);

    const form = document.querySelector('form');
    expect(form).toHaveAttribute('noValidate');

    const inputs = screen.getAllByRole('textbox');
    expect(inputs[0]).toHaveAttribute('autoComplete', 'username');
    expect(inputs[1]).toHaveAttribute('autoComplete', 'email');
  });
});