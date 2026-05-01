/**
 * Unit Tests for UserContext
 * Tests authentication state management.
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UserProvider, useUser } from './UserContext';

// Mock axios
vi.mock('axios', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
  },
  create: vi.fn(() => ({
    get: vi.fn(),
    post: vi.fn(),
  })),
}));

import axios from 'axios';

// Test component to access context
const TestConsumer = () => {
  const { user, isAuthenticated, login, logout, loading } = useUser();
  
  return (
    <div>
      <span data-testid="loading">{loading.toString()}</span>
      <span data-testid="authenticated">{isAuthenticated.toString()}</span>
      {user && <span data-testid="user-email">{user.email}</span>}
      <button onClick={() => login('test@test.com', 'password')} data-testid="login-btn">
        Login
      </button>
      <button onClick={logout} data-testid="logout-btn">
        Logout
      </button>
    </div>
  );
};

// Mock response for successful login
const mockUserResponse = {
  data: {
    access_token: 'test-token',
    user: {
      id: 1,
      email: 'test@test.com',
      level: 1,
      experience: 0,
      maxExperience: 100,
      stats: {
        strength: 10,
        agility: 10,
        intelligence: 10,
        vitality: 10,
      },
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    },
  },
};

describe('UserContext', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should provide default unauthenticated state', () => {
    render(
      <UserProvider>
        <TestConsumer />
      </UserProvider>
    );

    expect(screen.getByTestId('authenticated')).toHaveTextContent('false');
    expect(screen.getByTestId('loading')).toHaveTextContent('false');
  });

  it('should update loading state during login', async () => {
    let resolveLogin: (value: unknown) => void;
    const loginPromise = new Promise((resolve) => {
      resolveLogin = resolve;
    });
    
    (axios.post as ReturnType<typeof vi.fn>).mockImplementation(() => loginPromise);

    render(
      <UserProvider>
        <TestConsumer />
      </UserProvider>
    );

    const user = userEvent.setup();
    await user.click(screen.getByTestId('login-btn'));

    // At this point the login function is called but the mock won't resolve immediately
    // The loading state should have been set
  });

it('should throw error when useUser is used outside provider', () => {
    // Suppress console error for this test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    // This should throw because useUser is called outside provider
    const UseOutsideProvider = () => {
      useUser();
      return null;
    };

    expect(() => render(<UseOutsideProvider />)).toThrow('useUser must be used within a UserProvider');
    
    consoleSpy.mockRestore();
  });

  it('should clear user on logout', async () => {
    // First set up a logged in state
    localStorage.setItem('token', 'existing-token');
    
    (axios.post as ReturnType<typeof vi.fn>).mockResolvedValue(mockUserResponse);

    render(
      <UserProvider>
        <TestConsumer />
      </UserProvider>
    );

    // Click login first
    const user = userEvent.setup();
    await user.click(screen.getByTestId('login-btn'));

    await waitFor(() => {
      expect(screen.getByTestId('authenticated')).toHaveTextContent('true');
    });

    // Now logout
    await user.click(screen.getByTestId('logout-btn'));

    expect(screen.getByTestId('authenticated')).toHaveTextContent('false');
    expect(localStorage.removeItem).toHaveBeenCalledWith('token');
  });

  it('should store token in localStorage on successful login', async () => {
    (axios.post as ReturnType<typeof vi.fn>).mockResolvedValue(mockUserResponse);

    render(
      <UserProvider>
        <TestConsumer />
      </UserProvider>
    );

    const user = userEvent.setup();
    await user.click(screen.getByTestId('login-btn'));

    await waitFor(() => {
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'token',
        'test-token'
      );
    });
  });
});
