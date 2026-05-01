/**
 * Unit Tests for useQuestGenerator Hook
 * Tests state management, preference handling, and AI generation flow.
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useQuestGenerator } from './useQuestGenerator';
import type { UserPreferences, WeeklyPlan } from '../types/QuestGenerator.types';

// Mock services
vi.mock('../services/QuestGeneratorService', () => ({
  loadPreferences: vi.fn(),
  loadWeeklyPlan: vi.fn(),
  hasPreferences: vi.fn(),
  saveWeeklyPlan: vi.fn(),
}));

vi.mock('../services/LocalAIService', () => ({
  generatePlanWithAI: vi.fn(),
  isWebGPUAvailable: vi.fn(),
  getLastError: vi.fn(),
  resetEngine: vi.fn(),
}));

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

import {
  loadPreferences,
  loadWeeklyPlan,
  hasPreferences,
  saveWeeklyPlan,
} from '../services/QuestGeneratorService';

import {
  generatePlanWithAI,
  isWebGPUAvailable,
  getLastError,
  resetEngine,
} from '../services/LocalAIService';

// Test component
const TestComponent = () => {
  const {
    preferences,
    plan,
    showForm,
    aiProgress,
    isGenerating,
    modelError,
    webgpuAvailable,
    handleSavePreferences,
    handleRegenerate,
    handleOpenForm,
    handleCloseForm,
    handleRetry,
  } = useQuestGenerator();

  return (
    <div>
      <div data-testid="preferences">{JSON.stringify(preferences)}</div>
      <div data-testid="plan">{JSON.stringify(plan)}</div>
      <div data-testid="showForm">{showForm.toString()}</div>
      <div data-testid="aiProgress">{JSON.stringify(aiProgress)}</div>
      <div data-testid="isGenerating">{isGenerating.toString()}</div>
      <div data-testid="modelError">{modelError}</div>
      <div data-testid="webgpuAvailable">{webgpuAvailable.toString()}</div>
      <button onClick={() => handleSavePreferences({ fitnessGoal: 'strength', availableTime: 60, equipment: [], intensity: 5, experienceLevel: 'intermediate', includeWeekend: true })} data-testid="save-prefs">Save Prefs</button>
      <button onClick={handleRegenerate} data-testid="regenerate">Regenerate</button>
      <button onClick={handleOpenForm} data-testid="open-form">Open Form</button>
      <button onClick={handleCloseForm} data-testid="close-form">Close Form</button>
      <button onClick={handleRetry} data-testid="retry">Retry</button>
    </div>
  );
};

const mockPreferences: UserPreferences = {
  fitnessGoal: 'strength',
  availableTime: 60,
  equipment: ['dumbbells'],
  intensity: 5,
  experienceLevel: 'intermediate',
  includeWeekend: true,
};

const mockPlan: WeeklyPlan = {
  weekNumber: 1,
  quests: [],
};

describe('useQuestGenerator', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (hasPreferences as ReturnType<typeof vi.fn>).mockReturnValue(false);
    (isWebGPUAvailable as ReturnType<typeof vi.fn>).mockReturnValue(true);
    (getLastError as ReturnType<typeof vi.fn>).mockReturnValue(null);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should initialize with no preferences and show form', () => {
    render(<TestComponent />);

    expect(screen.getByTestId('preferences')).toHaveTextContent('null');
    expect(screen.getByTestId('plan')).toHaveTextContent('null');
    expect(screen.getByTestId('showForm')).toHaveTextContent('true');
    expect(screen.getByTestId('isGenerating')).toHaveTextContent('false');
    expect(screen.getByTestId('modelError')).toHaveTextContent('');
  });

  it('should load preferences and plan if available', () => {
    (hasPreferences as ReturnType<typeof vi.fn>).mockReturnValue(true);
    (loadPreferences as ReturnType<typeof vi.fn>).mockReturnValue(mockPreferences);
    (loadWeeklyPlan as ReturnType<typeof vi.fn>).mockReturnValue(mockPlan);

    render(<TestComponent />);

    expect(screen.getByTestId('preferences')).toHaveTextContent(JSON.stringify(mockPreferences));
    expect(screen.getByTestId('plan')).toHaveTextContent(JSON.stringify(mockPlan));
    expect(screen.getByTestId('showForm')).toHaveTextContent('false');
  });

  it('should handle save preferences successfully', async () => {
    const mockResult = { plan: mockPlan };
    (generatePlanWithAI as ReturnType<typeof vi.fn>).mockResolvedValue(mockResult);

    render(<TestComponent />);
    const user = userEvent.setup();

    await user.click(screen.getByTestId('save-prefs'));

    expect(screen.getByTestId('isGenerating')).toHaveTextContent('true');

    await waitFor(() => {
      expect(screen.getByTestId('isGenerating')).toHaveTextContent('false');
    });

    expect(generatePlanWithAI).toHaveBeenCalledWith(mockPreferences, expect.any(Function));
    expect(saveWeeklyPlan).toHaveBeenCalledWith(mockPlan);
    expect(screen.getByTestId('plan')).toHaveTextContent(JSON.stringify(mockPlan));
    expect(screen.getByTestId('showForm')).toHaveTextContent('false');
  });

  it('should handle save preferences error', async () => {
    (generatePlanWithAI as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('AI Error'));

    render(<TestComponent />);
    const user = userEvent.setup();

    await user.click(screen.getByTestId('save-prefs'));

    await waitFor(() => {
      expect(screen.getByTestId('isGenerating')).toHaveTextContent('false');
    });

    expect(screen.getByTestId('modelError')).toHaveTextContent('questGenerator.error.unexpected');
  });

  it('should handle regenerate successfully', async () => {
    (hasPreferences as ReturnType<typeof vi.fn>).mockReturnValue(true);
    (loadPreferences as ReturnType<typeof vi.fn>).mockReturnValue(mockPreferences);
    const mockResult = { plan: { ...mockPlan, weekNumber: 2 } };
    (generatePlanWithAI as ReturnType<typeof vi.fn>).mockResolvedValue(mockResult);

    render(<TestComponent />);
    const user = userEvent.setup();

    await user.click(screen.getByTestId('regenerate'));

    await waitFor(() => {
      expect(screen.getByTestId('isGenerating')).toHaveTextContent('false');
    });

    expect(generatePlanWithAI).toHaveBeenCalledWith(mockPreferences, expect.any(Function));
    expect(saveWeeklyPlan).toHaveBeenCalledWith(mockResult.plan);
  });

  it('should not regenerate if no preferences', async () => {
    render(<TestComponent />);
    const user = userEvent.setup();

    await user.click(screen.getByTestId('regenerate'));

    expect(generatePlanWithAI).not.toHaveBeenCalled();
  });

  it('should open form', async () => {
    (hasPreferences as ReturnType<typeof vi.fn>).mockReturnValue(true);
    (loadPreferences as ReturnType<typeof vi.fn>).mockReturnValue(mockPreferences);

    render(<TestComponent />);
    const user = userEvent.setup();

    await user.click(screen.getByTestId('open-form'));

    expect(screen.getByTestId('showForm')).toHaveTextContent('true');
    expect(screen.getByTestId('modelError')).toHaveTextContent('');
  });

  it('should close form if preferences exist', async () => {
    (hasPreferences as ReturnType<typeof vi.fn>).mockReturnValue(true);
    (loadPreferences as ReturnType<typeof vi.fn>).mockReturnValue(mockPreferences);

    render(<TestComponent />);
    const user = userEvent.setup();

    await user.click(screen.getByTestId('open-form'));
    expect(screen.getByTestId('showForm')).toHaveTextContent('true');

    await user.click(screen.getByTestId('close-form'));
    expect(screen.getByTestId('showForm')).toHaveTextContent('false');
  });

  it('should not close form if no preferences', async () => {
    render(<TestComponent />);
    const user = userEvent.setup();

    await user.click(screen.getByTestId('close-form'));

    expect(screen.getByTestId('showForm')).toHaveTextContent('true');
  });

  it('should handle retry', async () => {
    (hasPreferences as ReturnType<typeof vi.fn>).mockReturnValue(true);
    (loadPreferences as ReturnType<typeof vi.fn>).mockReturnValue(mockPreferences);
    const mockResult = { plan: mockPlan };
    (generatePlanWithAI as ReturnType<typeof vi.fn>).mockResolvedValue(mockResult);

    render(<TestComponent />);
    const user = userEvent.setup();

    await user.click(screen.getByTestId('retry'));

    expect(resetEngine).toHaveBeenCalled();
    expect(screen.getByTestId('modelError')).toHaveTextContent('');

    await waitFor(() => {
      expect(generatePlanWithAI).toHaveBeenCalled();
    });
  });

  it('should return webgpu availability', () => {
    (isWebGPUAvailable as ReturnType<typeof vi.fn>).mockReturnValue(false);

    render(<TestComponent />);

    expect(screen.getByTestId('webgpuAvailable')).toHaveTextContent('false');
  });
});