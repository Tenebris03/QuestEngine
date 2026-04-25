/**
 * useQuestGenerator Hook
 * Encapsulates all state management and business logic for the QuestGenerator page.
 * Follows the React standard of separating state logic from UI components.
 */

import { useState, useCallback } from 'react';
import type { UserPreferences, WeeklyPlan, AIProgress } from '../pages/QuestGenerator/QuestGenerator.types';
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

/**
 * Return type for the useQuestGenerator hook.
 */
export interface UseQuestGeneratorReturn {
  preferences: UserPreferences | null;
  plan: WeeklyPlan | null;
  showForm: boolean;
  aiProgress: AIProgress | null;
  isGenerating: boolean;
  modelError: string | null;
  webgpuAvailable: boolean;
  handleSavePreferences: (newPrefs: UserPreferences) => Promise<void>;
  handleRegenerate: () => Promise<void>;
  handleOpenForm: () => void;
  handleCloseForm: () => void;
  handleRetry: () => void;
}

/**
 * Custom hook that manages all QuestGenerator state and side effects.
 */
export function useQuestGenerator(): UseQuestGeneratorReturn {
  const [preferences, setPreferences] = useState<UserPreferences | null>(() =>
    hasPreferences() ? loadPreferences() : null,
  );
  const [plan, setPlan] = useState<WeeklyPlan | null>(() =>
    hasPreferences() ? loadWeeklyPlan() : null,
  );
  const [showForm, setShowForm] = useState(() => !hasPreferences());
  const [aiProgress, setAiProgress] = useState<AIProgress | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [modelError, setModelError] = useState<string | null>(null);

  const handleSavePreferences = useCallback(async (newPrefs: UserPreferences) => {
    setPreferences(newPrefs);
    setIsGenerating(true);
    setModelError(null);
    setAiProgress({
      status: 'generating',
      message: 'Trainingsplan wird generiert...',
      percent: 0,
    });

    try {
      const result = await generatePlanWithAI(newPrefs, (progress) => {
        setAiProgress(progress);
        if (progress.status === 'error') {
          setModelError(getLastError());
        }
      });

      setPlan(result.plan);
      saveWeeklyPlan(result.plan);
      setShowForm(false);
    } catch (error) {
      console.error('Fehler bei der Generierung:', error);
      setModelError('Ein unerwarteter Fehler ist aufgetreten.');
    } finally {
      setIsGenerating(false);
      setAiProgress(null);
    }
  }, []);

  const handleRegenerate = useCallback(async () => {
    if (preferences) {
      setIsGenerating(true);
      setModelError(null);
      setAiProgress({
        status: 'generating',
        message: 'Trainingsplan wird neu generiert...',
        percent: 0,
      });

      try {
        const result = await generatePlanWithAI(preferences, (progress) => {
          setAiProgress(progress);
          if (progress.status === 'error') {
            setModelError(getLastError());
          }
        });

        setPlan(result.plan);
        saveWeeklyPlan(result.plan);
      } catch (error) {
        console.error('Fehler bei der Regenerierung:', error);
        setModelError('Ein unerwarteter Fehler ist aufgetreten.');
      } finally {
        setIsGenerating(false);
        setAiProgress(null);
      }
    }
  }, [preferences]);

  const handleOpenForm = useCallback(() => {
    setShowForm(true);
    setModelError(null);
  }, []);

  const handleCloseForm = useCallback(() => {
    if (preferences) {
      setShowForm(false);
    }
  }, [preferences]);

  const handleRetry = useCallback(() => {
    resetEngine();
    setModelError(null);
    // Trigger regeneration if we have preferences
    if (preferences) {
      handleRegenerate();
    }
  }, [preferences, handleRegenerate]);

  const webgpuAvailable = isWebGPUAvailable();

  return {
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
  };
}
