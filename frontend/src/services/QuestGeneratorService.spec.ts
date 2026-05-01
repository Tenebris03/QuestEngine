/**
 * Unit Tests for QuestGeneratorService
 * Tests the storage layer functions for preferences and weekly plans.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  savePreferences,
  loadPreferences,
  hasPreferences,
  saveWeeklyPlan,
  loadWeeklyPlan,
  getTodaysQuest,
} from './QuestGeneratorService';
import type { UserPreferences, WeeklyPlan, Quest } from '../types/QuestGenerator.types';

// Sample test data matching the actual types
const mockPreferences: UserPreferences = {
  fitnessGoal: 'strength',
  availableTime: 60,
  equipment: ['dumbbells', 'resistance-band'],
  intensity: 3,
  experienceLevel: 'intermediate',
  includeWeekend: false,
};

const mockExercise = {
  name: 'Push-ups',
  sets: 3,
  reps: '10',
  restSeconds: 60,
  muscleGroup: 'chest',
};

const mockQuest: Quest = {
  day: 'Monday',
  dayIndex: 0,
  title: 'Test Quest',
  description: 'Test description',
  exercises: [mockExercise],
  duration: 30,
  intensity: 'medium',
  equipment: ['dumbbells'],
  completed: false,
};

const mockWeeklyPlan: WeeklyPlan = {
  weekNumber: 1,
  quests: [mockQuest],
  totalDuration: 150,
  createdAt: new Date('2024-01-15'),
};

describe('QuestGeneratorService', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('savePreferences', () => {
    it('should save preferences to localStorage', () => {
      savePreferences(mockPreferences);
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'questGenerator_preferences',
        JSON.stringify(mockPreferences),
      );
    });

    it('should stringify preferences to JSON', () => {
      savePreferences(mockPreferences);
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'questGenerator_preferences',
        expect.any(String),
      );
    });
  });

  describe('loadPreferences', () => {
    it('should return null when no preferences stored', () => {
      const result = loadPreferences();
      expect(result).toBeNull();
    });

    it('should return parsed preferences from localStorage', () => {
      localStorage.getItem = vi.fn().mockReturnValue(JSON.stringify(mockPreferences));
      const result = loadPreferences();
      expect(result).toEqual(mockPreferences);
    });
  });

  describe('hasPreferences', () => {
    it('should return false when no preferences exist', () => {
      const result = hasPreferences();
      expect(result).toBe(false);
    });

    it('should return true when preferences exist', () => {
      localStorage.getItem = vi.fn().mockReturnValue(JSON.stringify(mockPreferences));
      const result = hasPreferences();
      expect(result).toBe(true);
    });
  });

  describe('saveWeeklyPlan', () => {
    it('should save weekly plan to localStorage', () => {
      saveWeeklyPlan(mockWeeklyPlan);
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'questGenerator_weeklyPlan',
        expect.any(String),
      );
    });
  });

  describe('loadWeeklyPlan', () => {
    it('should return null when no plan stored', () => {
      const result = loadWeeklyPlan();
      expect(result).toBeNull();
    });

    it('should return parsed plan from localStorage with Date objects', () => {
      const planWithDate = {
        ...mockWeeklyPlan,
        createdAt: '2024-01-15T00:00:00.000Z',
      };
      localStorage.getItem = vi.fn().mockReturnValue(JSON.stringify(planWithDate));
      
      const result = loadWeeklyPlan();
      
      expect(result).not.toBeNull();
      expect(result?.createdAt).toBeInstanceOf(Date);
    });
  });

  describe('getTodaysQuest', () => {
    it('should return null when no plan exists', () => {
      const result = getTodaysQuest();
      expect(result).toBeNull();
    });

    it('should return null when plan has no quests', () => {
      localStorage.getItem = vi.fn().mockReturnValue(JSON.stringify({
        ...mockWeeklyPlan,
        quests: [],
        createdAt: '2024-01-15T00:00:00.000Z',
      }));
      
      const result = getTodaysQuest();
      expect(result).toBeNull();
    });

    it('should return quest matching current day index', () => {
      // Mock Date.getDay() to return Monday (1)
      const originalGetDay = Date.prototype.getDay;
      Date.prototype.getDay = function() {
        return 1; // Monday
      };

      const planWithMultipleDays = {
        ...mockWeeklyPlan,
        quests: [
          { ...mockQuest, dayIndex: 0 }, // Monday = 0 in our system
          { ...mockQuest, id: '2', dayIndex: 1, title: 'Tuesday Quest' }, // Tuesday = 1
        ],
        createdAt: '2024-01-15T00:00:00.000Z',
      };
      localStorage.getItem = vi.fn().mockReturnValue(JSON.stringify(planWithMultipleDays));
      
      const result = getTodaysQuest();
      
      // Restore original
      Date.prototype.getDay = originalGetDay;
      
      expect(result).toBeDefined();
      expect(result?.dayIndex).toBe(0);
    });
  });
});
