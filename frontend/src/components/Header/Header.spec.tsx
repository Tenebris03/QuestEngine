/**
 * Unit Tests for Header Component
 * Tests navigation, language toggle, and authentication state.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { UserProvider } from '../../context/UserContext';
import Header from './Header';

// Wrapped component with providers
const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <UserProvider>
      <BrowserRouter>
        {ui}
      </BrowserRouter>
    </UserProvider>
  );
};

describe('Header', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should render logo and brand name', () => {
    renderWithProviders(<Header />);

    expect(screen.getByText('QuestEngine')).toBeInTheDocument();
    expect(screen.getByAltText(/logo/i)).toBeInTheDocument();
  });

  it('should render navigation links', () => {
    renderWithProviders(<Header />);

    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /dashboard/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /quest generator/i })).toBeInTheDocument();
  });

  it('should render language toggle button', () => {
    renderWithProviders(<Header />);

    expect(screen.getByRole('button', { name: /language/i })).toBeInTheDocument();
  });

  it('should show login/register links when not authenticated', () => {
    renderWithProviders(<Header />);

    expect(screen.getByRole('link', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /register/i })).toBeInTheDocument();
  });

  it('should have correct navigation structure', () => {
    renderWithProviders(<Header />);

    const nav = screen.getByLabelText(/main navigation/i);
    expect(nav).toBeInTheDocument();
    expect(nav).toHaveClass('header-nav');
  });

  it('should have proper ARIA labels', () => {
    renderWithProviders(<Header />);

    const languageBtn = screen.getByRole('button', { name: /language/i });
    expect(languageBtn).toHaveAttribute('aria-label');
  });
});
