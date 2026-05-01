/**
 * Unit Tests for Settings Page
 * Tests authentication, form inputs, and settings updates.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Settings from './Settings';

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    Link: ({ to, children, ...props }: any) => <a href={to} {...props}>{children}</a>,
  };
});

// Mock react-i18next
const mockChangeLanguage = vi.fn();
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'title': 'Settings',
        'subtitle': 'Manage your account settings',
        'unauthenticated.subtitle': 'Please log in to access settings',
        'unauthenticated.loginButton': 'Log In',
        'form.name.label': 'Name',
        'form.name.placeholder': 'Enter your name',
        'form.avatar.label': 'Avatar URL',
        'form.avatar.placeholder': 'Enter avatar URL',
        'form.language.label': 'Language',
        'form.language.en': 'English',
        'form.language.de': 'Deutsch',
        'form.submit': 'Save Changes',
      };
      return translations[key] || key;
    },
    i18n: {
      language: 'en',
      changeLanguage: mockChangeLanguage,
    },
  }),
}));

// Mock UserContext
const mockUseUser = vi.fn();
vi.mock('../../context/UserContext', () => ({
  useUser: () => mockUseUser(),
}));

const mockUser = {
  id: 1,
  email: 'test@test.com',
  name: 'Test User',
  level: 1,
  experience: 0,
  maxExperience: 100,
  stats: { strength: 10, agility: 10, intelligence: 10, vitality: 10 },
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01',
  profilePicture: 'https://example.com/avatar.jpg',
};

const renderWithRouter = (ui: React.ReactElement) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('Settings', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Unauthenticated state', () => {
    it('should show login prompt when not authenticated', () => {
      mockUseUser.mockReturnValue({
        user: null,
        isAuthenticated: false,
        updateUser: vi.fn(),
      });

      renderWithRouter(<Settings />);

      expect(screen.getByText('Settings')).toBeInTheDocument();
      expect(screen.getByText('Please log in to access settings')).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Log In' })).toHaveAttribute('href', '/login');
    });
  });

  describe('Authenticated state', () => {
    beforeEach(() => {
      mockUseUser.mockReturnValue({
        user: mockUser,
        isAuthenticated: true,
        updateUser: vi.fn(),
      });
    });

    it('should render settings form with user data', () => {
      renderWithRouter(<Settings />);

      expect(screen.getByText('Settings')).toBeInTheDocument();
      expect(screen.getByText('Manage your account settings')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Test User')).toBeInTheDocument();
      expect(screen.getByDisplayValue('https://example.com/avatar.jpg')).toBeInTheDocument();
    });

    it('should display avatar image', () => {
      renderWithRouter(<Settings />);

      const avatar = screen.getByAltText('Profile preview');
      expect(avatar).toHaveAttribute('src', 'https://example.com/avatar.jpg');
    });

    it('should update name input', async () => {
      renderWithRouter(<Settings />);
      const user = userEvent.setup();

      const nameInput = screen.getByLabelText('Name');
      await user.clear(nameInput);
      await user.type(nameInput, 'New Name');

      expect(nameInput).toHaveValue('New Name');
    });

    it('should update avatar URL input', async () => {
      renderWithRouter(<Settings />);
      const user = userEvent.setup();

      const avatarInput = screen.getByLabelText('Avatar URL');
      await user.clear(avatarInput);
      await user.type(avatarInput, 'https://new-avatar.com/image.jpg');

      expect(avatarInput).toHaveValue('https://new-avatar.com/image.jpg');
    });

    it('should change language', async () => {
      renderWithRouter(<Settings />);
      const user = userEvent.setup();

      const languageSelect = screen.getByLabelText('Language');
      await user.selectOptions(languageSelect, 'de');

      expect(mockChangeLanguage).toHaveBeenCalledWith('de');
    });

    it('should call updateUser on form submit', async () => {
      const mockUpdateUser = vi.fn();
      mockUseUser.mockReturnValue({
        user: mockUser,
        isAuthenticated: true,
        updateUser: mockUpdateUser,
      });

      renderWithRouter(<Settings />);
      const user = userEvent.setup();

      const nameInput = screen.getByLabelText('Name');
      await user.clear(nameInput);
      await user.type(nameInput, 'Updated Name');

      const avatarInput = screen.getByLabelText('Avatar URL');
      await user.clear(avatarInput);
      await user.type(avatarInput, 'https://updated-avatar.com/image.jpg');

      await user.click(screen.getByRole('button', { name: 'Save Changes' }));

      expect(mockUpdateUser).toHaveBeenCalledWith({
        name: 'Updated Name',
        profilePicture: 'https://updated-avatar.com/image.jpg',
      });
    });

    it('should handle empty initial values', () => {
      const userWithoutProfile = { ...mockUser, name: '', profilePicture: undefined };
      mockUseUser.mockReturnValue({
        user: userWithoutProfile,
        isAuthenticated: true,
        updateUser: vi.fn(),
      });

      renderWithRouter(<Settings />);

      expect(screen.getByDisplayValue('')).toBeInTheDocument();
    });

    it('should handle avatar load error', () => {
      renderWithRouter(<Settings />);

      const avatar = screen.getByAltText('Profile preview');
      // Simulate error
      avatar.dispatchEvent(new Event('error'));

      expect(avatar).toHaveAttribute('src', 'https://example.com/avatar.jpg'); // Should fallback to user's profile picture
    });

    it('should require name field', () => {
      renderWithRouter(<Settings />);

      const nameInput = screen.getByLabelText('Name');
      expect(nameInput).toBeRequired();
    });

    it('should have correct form structure', () => {
      renderWithRouter(<Settings />);

      expect(screen.getByRole('form')).toBeInTheDocument();
      expect(screen.getByRole('textbox', { name: 'Name' })).toBeInTheDocument();
      expect(screen.getByRole('textbox', { name: 'Avatar URL' })).toBeInTheDocument();
      expect(screen.getByRole('combobox', { name: 'Language' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Save Changes' })).toBeInTheDocument();
    });
  });
});