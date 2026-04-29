/**
 * useQuestGenerator Hook
 * Encapsulates all state management and business logic for the QuestGenerator page.
 * Follows the React standard of separating state logic from UI components.
 */

import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import type { UserPreferences, WeeklyPlan, AIProgress } from '../pages/QuestGenerator/QuestGenerator.types';
import { useUser } from '../context/UserContext';
import {
  loadPreferences,
  loadWeeklyPlan,
  hasPreferences,
  savePreferences,
  saveWeeklyPlan,
  completeQuest,
  getAverageRating
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
  averageRating: number;
  handleSavePreferences: (newPrefs: UserPreferences) => Promise<void>;
  handleRegenerate: () => Promise<void>;
  handleOpenForm: () => void;
  handleCloseForm: () => void;
  handleRetry: () => void;
  handleCompleteQuest: (questIndex: number, rating: number) => void;
}

/**
 * Custom hook that manages all QuestGenerator state and side effects.
 */
export function useQuestGenerator(): UseQuestGeneratorReturn {
  const { t } = useTranslation();
  const { gainRewards } = useUser(); // User Kontext für Rewards
  
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
    savePreferences(newPrefs);
    setPreferences(newPrefs);
    setIsGenerating(true);
    setModelError(null);
    setAiProgress({
      status: 'generating',
      message: t('questGenerator.progress.generating'),
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
      setModelError(t('questGenerator.error.unexpected'));
    } finally {
      setIsGenerating(false);
      setAiProgress(null);
    }
  }, [t]);

  const handleRegenerate = useCallback(async () => {
    if (preferences) {
      setIsGenerating(true);
      setModelError(null);
      setAiProgress({
        status: 'generating',
        message: t('questGenerator.progress.regenerating'),
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
        setModelError(t('questGenerator.error.unexpected'));
      } finally {
        setIsGenerating(false);
        setAiProgress(null);
      }
    }
  }, [preferences, t]);

  const handleOpenForm = useCallback(() => {
    setShowForm(true);
    setModelError(null);
  }, []);

  const handleCloseForm = useCallback(() => {
    if (preferences) {
      setShowForm(false);
    }
  }, [preferences]);

  const handleCompleteQuest = useCallback((questIndex: number, rating: number) => {
    const currentPlan = loadWeeklyPlan();
    
    // Prüfen, ob die Quest nicht ohnehin schon abgeschlossen ist
    if (currentPlan && currentPlan.quests[questIndex] && !currentPlan.quests[questIndex].completed) {
      const quest = currentPlan.quests[questIndex];
      
      // Belohnung berechnen: Längere Dauer & höhere Intensität = Mehr XP
      const multiplier = quest.intensity === 'hard' ? 20 : quest.intensity === 'medium' ? 15 : 10;
      const xp = quest.duration * multiplier;
      
      // Verteile die Stats
      gainRewards(xp, {
        strength: quest.intensity === 'hard' ? 1 : 0,
        vitality: 1
      });
    }

    completeQuest(questIndex, rating);
    const updatedPlan = loadWeeklyPlan();
    if (updatedPlan) setPlan(updatedPlan);
  }, [gainRewards]);

  const handleRetry = useCallback(() => {
    resetEngine();
    setModelError(null);
    if (preferences) {
      handleRegenerate();
    }
  }, [preferences, handleRegenerate]);

  const webgpuAvailable = isWebGPUAvailable();
  const averageRating = getAverageRating();

  return {
    preferences,
    plan,
    showForm,
    aiProgress,
    isGenerating,
    modelError,
    webgpuAvailable,
    averageRating,
    handleSavePreferences,
    handleRegenerate,
    handleOpenForm,
    handleCloseForm,
    handleRetry,
    handleCompleteQuest,
  };
}