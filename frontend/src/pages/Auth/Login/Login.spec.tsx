/**
 * Unit Tests for Login Page
 * Tests form validation, inputs, and submission.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { UserProvider } from '../../../context/UserContext';
import Login from './Login';

// Mock react-router-dom hooks
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

// Mock axios
vi.mock('axios', () => ({
  default: {
    post: vi.fn().mockResolvedValue({
      data: {
        access_token: 'test-token',
        user: { id: 1, email: 'test@test.com', name: 'Test User', level: 1, experience: 0, maxExperience: 100, stats: { strength: 10, agility: 10, intelligence: 10, vitality: 10 }, createdAt: '2024-01-01', updatedAt: '2024-01-01' }
      }
    }),
  },
  create: vi.fn(() => ({
    get: vi.fn(),
    post: vi.fn(),
  })),
}));

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <UserProvider>
      <BrowserRouter>
        {ui}
      </BrowserRouter>
    </UserProvider>
  );
};

describe('Login', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should render login form title', () => {
    renderWithProviders(<Login />);

    expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
  });

  it('should render email and password inputs', () => {
    renderWithProviders(<Login />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it('should render submit button', () => {
    renderWithProviders(<Login />);

    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  it('should show validation errors on empty submit', async () => {
    renderWithProviders(<Login />);

    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });
  });

  it('should validate email format', async () => {
    renderWithProviders(<Login />);

    const emailInput = screen.getByLabelText(/email/i);
    const user = userEvent.setup();
    
    await user.type(emailInput, 'invalid-email');
    await user.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
    });
  });

  it('should validate password minimum length', async () => {
    renderWithProviders(<Login />);

    const passwordInput = screen.getByLabelText(/password/i);
    const user = userEvent.setup();
    
    await user.type(passwordInput, '123');
    await user.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByText(/password must be at least/i)).toBeInTheDocument();
    });
  });

  it('should have login link to register page', () => {
    renderWithProviders(<Login />);

    expect(screen.getByRole('link', { name: /register/i })).toBeInTheDocument();
  });

  it('should disable submit button when form is invalid', () => {
    renderWithProviders(<Login />);

    const submitBtn = screen.getByRole('button', { name: /submit/i });
    expect(submitBtn).toBeDisabled();
  });

  it('should clear error when user types', async () => {
    renderWithProviders(<Login />);

    // First trigger an error
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    });

    // Now type in email field
    const emailInput = screen.getByLabelText(/email/i);
    await user.type(emailInput, 'test@test.com');

    // Error should be cleared
    expect(screen.queryByText(/email is required/i)).not.toBeInTheDocument();
  });
});
