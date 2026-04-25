/**
 * QuestGenerator Page
 * Hauptseite für die Quest-Generierung.
 * Zeigt entweder das PreferenceForm oder den WeeklyOverview an.
 * Nutzt WebLLM für KI-basierte Quest-Generierung.
 */

import React, { useState, useCallback } from 'react';
import type { UserPreferences, WeeklyPlan, AIProgress } from './QuestGenerator.types';
import {
  loadPreferences,
  loadWeeklyPlan,
  hasPreferences,
  saveWeeklyPlan,
} from './services/QuestGeneratorService';
import {
  generatePlanWithAI,
  isWebGPUAvailable,
  getLastError,
  resetEngine,
} from './services/LocalAIService';
import PreferenceForm from './components/PreferenceForm/PreferenceForm';
import WeeklyOverview from './components/WeeklyOverview/WeeklyOverview';
import './QuestGenerator.css';

/**
 * Hauptkomponente der QuestGenerator Page.
 */
const QuestGenerator: React.FC = () => {
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

  return (
    <div className="quest-generator-page">
      <section className="quest-hero">
        <h1 className="quest-hero-title">Quest Generator</h1>
        <p className="quest-hero-subtitle">
          Generiere personalisierte Fitness-Quests basierend auf deinen Zielen und Equipment.
        </p>
      </section>

      {/* WebGPU Warnung */}
      {!webgpuAvailable && (
        <div className="ai-progress-container" style={{ borderColor: '#f59e0b' }}>
          <p className="ai-progress-message" style={{ color: '#f59e0b' }}>
            ⚠️ WebGPU ist nicht verfügbar. Die KI-Generierung wird nicht funktionieren.
            Bitte verwenden Sie Chrome oder Edge in der neuesten Version.
          </p>
        </div>
      )}

      {/* KI-Fortschrittsanzeige */}
      {aiProgress && (
        <div className="ai-progress-container">
          <div className="ai-progress-bar">
            <div
              className="ai-progress-fill"
              style={{ width: `${aiProgress.percent}%` }}
            />
          </div>
          <p className="ai-progress-message">{aiProgress.message}</p>
        </div>
      )}

      {/* Fehlermeldung mit Retry */}
      {modelError && !aiProgress && (
        <div className="ai-progress-container" style={{ borderColor: '#ef4444' }}>
          <p className="ai-progress-message" style={{ color: '#ef4444', marginBottom: '12px' }}>
            ❌ {modelError}
          </p>
          <button
            type="button"
            className="btn-primary"
            onClick={handleRetry}
            disabled={isGenerating}
            style={{ padding: '8px 16px', fontSize: '0.9rem' }}
          >
            Erneut versuchen
          </button>
        </div>
      )}

      {showForm && (
        <PreferenceForm
          onSave={handleSavePreferences}
          onClose={handleCloseForm}
          initialValues={preferences}
        />
      )}

      {plan && !showForm && (
        <>
          <WeeklyOverview plan={plan} onRegenerate={handleRegenerate} />
          <div className="plan-actions">
            <button
              type="button"
              className="btn-edit-prefs"
              onClick={handleOpenForm}
              disabled={isGenerating}
            >
              Preferences bearbeiten
            </button>
          </div>
        </>
      )}

      {!plan && !showForm && (
        <div className="no-plan-message">
          <p>Noch keine Quests generiert.</p>
          <button
            type="button"
            className="btn-primary"
            onClick={handleOpenForm}
            disabled={isGenerating}
          >
            Jetzt starten
          </button>
        </div>
      )}
    </div>
  );
};

export default QuestGenerator;
