/**
 * Unit Tests for Dashboard Page
 * Tests authentication states, user stats display, and daily quest functionality.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from './Dashboard';
import type { Quest } from '../../types/QuestGenerator.types';

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    Link: ({ to, children, ...props }: any) => <a href={to} {...props}>{children}</a>,
  };
});

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: any) => {
      const translations: Record<string, string> = {
        'locked.badge': 'Locked',
        'locked.title': 'Access Restricted',
        'locked.subtitle': 'Please log in to view your dashboard',
        'locked.authRequired': 'Authentication Required',
        'locked.authDescription': 'You need to be logged in to access your fitness dashboard',
        'locked.loginButton': 'Log In',
        'stats.level': 'Level',
        'stats.xp': '{{current}}/{{max}} XP',
        'stats.xpPercent': '{{percent}}%',
        'dailyQuest.title': 'Today\'s Quest',
        'dailyQuest.duration': '{{minutes}} min',
        'dailyQuest.completed': 'Quest Completed!',
        'dailyQuest.empty.description': 'No quest planned for today',
        'dailyQuest.empty.button': 'Generate Plan',
        'dailyQuest.exercise.setsRepsRest': '{{sets}} sets × {{reps}} reps, {{rest}}s rest',
        'weekdays.0': 'Sunday',
        'weekdays.1': 'Monday',
        'weekdays.2': 'Tuesday',
        'weekdays.3': 'Wednesday',
        'weekdays.4': 'Thursday',
        'weekdays.5': 'Friday',
        'weekdays.6': 'Saturday',
      };
      if (options) {
        let result = translations[key] || key;
        Object.keys(options).forEach(opt => {
          result = result.replace(`{{${opt}}}`, options[opt]);
        });
        return result;
      }
      return translations[key] || key;
    },
  }),
}));

// Mock services
vi.mock('../../services/QuestGeneratorService', () => ({
  getTodaysQuest: vi.fn(),
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
  level: 5,
  experience: 250,
  maxExperience: 500,
  stats: {
    strength: 15,
    agility: 12,
    intelligence: 10,
    vitality: 13,
  },
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01',
};

const mockQuest: Quest = {
  dayIndex: 1,
  day: 'Monday',
  title: 'Upper Body Strength',
  description: 'Build strength with compound movements',
  duration: 45,
  intensity: 'high',
  exercises: [
    {
      name: 'Push-ups',
      sets: 3,
      reps: 12,
      restSeconds: 60,
    },
    {
      name: 'Pull-ups',
      sets: 3,
      reps: 8,
      restSeconds: 90,
    },
  ],
  equipment: [],
  completed: false,
};

const renderWithRouter = (ui: React.ReactElement) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('Dashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Unauthenticated state', () => {
    it('should show locked content when not authenticated', () => {
      mockUseUser.mockReturnValue({
        user: null,
        isAuthenticated: false,
      });

      renderWithRouter(<Dashboard />);

      expect(screen.getByText('Access Restricted')).toBeInTheDocument();
      expect(screen.getByText('Please log in to view your dashboard')).toBeInTheDocument();
      expect(screen.getByText('Authentication Required')).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Log In' })).toHaveAttribute('href', '/login');
    });
  });

  describe('Authenticated state', () => {
    beforeEach(() => {
      mockUseUser.mockReturnValue({
        user: mockUser,
        isAuthenticated: true,
      });
    });

    it('should display user stats and level', () => {
      renderWithRouter(<Dashboard />);

      expect(screen.getByText('Test User')).toBeInTheDocument();
      expect(screen.getByText('Level')).toBeInTheDocument();
      expect(screen.getByText('5')).toBeInTheDocument();
      expect(screen.getByText('250/500 XP')).toBeInTheDocument();
      expect(screen.getByText('50%')).toBeInTheDocument();
    });

    it('should display stat pills', () => {
      renderWithRouter(<Dashboard />);

      expect(screen.getByText('STR')).toBeInTheDocument();
      expect(screen.getByText('15')).toBeInTheDocument();
      expect(screen.getByText('AGI')).toBeInTheDocument();
      expect(screen.getByText('12')).toBeInTheDocument();
      expect(screen.getByText('INT')).toBeInTheDocument();
      expect(screen.getByText('10')).toBeInTheDocument();
      expect(screen.getByText('VIT')).toBeInTheDocument();
      expect(screen.getByText('13')).toBeInTheDocument();
    });

    it('should show empty state when no daily quest', () => {
      const { getTodaysQuest } = require('../../services/QuestGeneratorService');
      getTodaysQuest.mockReturnValue(null);

      renderWithRouter(<Dashboard />);

      expect(screen.getByText('Today\'s Quest')).toBeInTheDocument();
      expect(screen.getByText('No quest planned for today')).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Generate Plan' })).toHaveAttribute('href', '/quest-generator');
    });

    it('should display daily quest when available', () => {
      const { getTodaysQuest } = require('../../services/QuestGeneratorService');
      getTodaysQuest.mockReturnValue(mockQuest);

      renderWithRouter(<Dashboard />);

      expect(screen.getByText('Upper Body Strength')).toBeInTheDocument();
      expect(screen.getByText('Build strength with compound movements')).toBeInTheDocument();
      expect(screen.getByText('high')).toBeInTheDocument();
      expect(screen.getByText('45 min')).toBeInTheDocument();
    });

    it('should display exercises with checkboxes', () => {
      const { getTodaysQuest } = require('../../services/QuestGeneratorService');
      getTodaysQuest.mockReturnValue(mockQuest);

      renderWithRouter(<Dashboard />);

      expect(screen.getByText('Push-ups')).toBeInTheDocument();
      expect(screen.getByText('3 sets × 12 reps, 60s rest')).toBeInTheDocument();
      expect(screen.getByText('Pull-ups')).toBeInTheDocument();
      expect(screen.getByText('3 sets × 8 reps, 90s rest')).toBeInTheDocument();

      const checkboxes = screen.getAllByRole('checkbox');
      expect(checkboxes).toHaveLength(2);
      expect(checkboxes[0]).not.toBeChecked();
      expect(checkboxes[1]).not.toBeChecked();
    });

    it('should toggle exercise completion', async () => {
      const { getTodaysQuest } = require('../../services/QuestGeneratorService');
      getTodaysQuest.mockReturnValue(mockQuest);

      renderWithRouter(<Dashboard />);
      const user = userEvent.setup();

      const firstCheckbox = screen.getAllByRole('checkbox')[0];
      await user.click(firstCheckbox);

      expect(firstCheckbox).toBeChecked();

      // Check localStorage
      const stored = JSON.parse(localStorage.getItem('questEngine_dailyCompletion_' + new Date().toISOString().split('T')[0]) || '[]');
      expect(stored[0]).toBe(true);
      expect(stored[1]).toBe(false);
    });

    it('should show completion banner when all exercises completed', async () => {
      const { getTodaysQuest } = require('../../services/QuestGeneratorService');
      getTodaysQuest.mockReturnValue(mockQuest);

      renderWithRouter(<Dashboard />);
      const user = userEvent.setup();

      const checkboxes = screen.getAllByRole('checkbox');
      await user.click(checkboxes[0]);
      await user.click(checkboxes[1]);

      expect(screen.getByText('Quest Completed!')).toBeInTheDocument();
    });

    it('should load completed exercises from localStorage', () => {
      const { getTodaysQuest } = require('../../services/QuestGeneratorService');
      getTodaysQuest.mockReturnValue(mockQuest);

      // Pre-populate localStorage
      const todayKey = 'questEngine_dailyCompletion_' + new Date().toISOString().split('T')[0];
      localStorage.setItem(todayKey, JSON.stringify([true, false]));

      renderWithRouter(<Dashboard />);

      const checkboxes = screen.getAllByRole('checkbox');
      expect(checkboxes[0]).toBeChecked();
      expect(checkboxes[1]).not.toBeChecked();
    });

    it('should handle invalid localStorage data gracefully', () => {
      const { getTodaysQuest } = require('../../services/QuestGeneratorService');
      getTodaysQuest.mockReturnValue(mockQuest);

      // Invalid data
      const todayKey = 'questEngine_dailyCompletion_' + new Date().toISOString().split('T')[0];
      localStorage.setItem(todayKey, 'invalid-json');

      renderWithRouter(<Dashboard />);

      const checkboxes = screen.getAllByRole('checkbox');
      expect(checkboxes[0]).not.toBeChecked();
      expect(checkboxes[1]).not.toBeChecked();
    });
  });
});