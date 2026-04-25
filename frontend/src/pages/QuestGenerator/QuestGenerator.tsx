/**
 * QuestGenerator Page
 * Hauptseite für die Quest-Generierung.
 * Zeigt entweder das PreferenceForm oder den WeeklyOverview an.
 * Nutzt WebLLM für KI-basierte Quest-Generierung.
 */

import React from 'react';
import { useQuestGenerator } from '../../hooks/useQuestGenerator';
import PreferenceForm from './components/PreferenceForm/PreferenceForm';
import WeeklyOverview from './components/WeeklyOverview/WeeklyOverview';
import './QuestGenerator.css';

/**
 * Hauptkomponente der QuestGenerator Page.
 */
const QuestGenerator: React.FC = () => {
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
    <div className="quest-generator-page">
      <section className="quest-hero">
        <h1 className="quest-hero-title">Quest Generator</h1>
        <p className="quest-hero-subtitle">
          Generiere personalisierte Fitness-Quests basierend auf deinen Zielen und Equipment.
        </p>
      </section>

      {/* WebGPU Warnung */}
      {!webgpuAvailable && (
        <div className="ai-progress-container warning">
          <p className="ai-progress-message">
            <strong>⚠️ WebGPU nicht verfügbar</strong>
            <br />
            Die KI-Generierung wird nicht funktionieren. Bitte verwenden Sie Chrome oder Edge in der neuesten Version.
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
        <div className="ai-progress-container error">
          <p className="ai-progress-message" style={{ marginBottom: '16px' }}>
            <strong>❌ Fehler</strong>
            <br />
            {modelError}
          </p>
          <button
            type="button"
            className="btn-primary"
            onClick={handleRetry}
            disabled={isGenerating}
            style={{ padding: '10px 20px', fontSize: '0.9rem' }}
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
