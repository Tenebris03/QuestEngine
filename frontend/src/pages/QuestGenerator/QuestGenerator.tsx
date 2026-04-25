/**
 * QuestGenerator Page
 * Hauptseite für die Quest-Generierung.
 * Zeigt entweder das PreferenceForm oder den WeeklyOverview an.
 */

import React, { useState, useCallback } from 'react';
import type { UserPreferences, WeeklyPlan } from './QuestGenerator.types';
import {
  generateWeeklyPlan,
  loadPreferences,
  loadWeeklyPlan,
  hasPreferences,
} from './services/QuestGeneratorService';
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

  const handleSavePreferences = useCallback((newPrefs: UserPreferences) => {
    setPreferences(newPrefs);
    const newPlan = generateWeeklyPlan(newPrefs);
    setPlan(newPlan);
    setShowForm(false);
  }, []);

  const handleRegenerate = useCallback(() => {
    if (preferences) {
      const newPlan = generateWeeklyPlan(preferences);
      setPlan(newPlan);
    }
  }, [preferences]);

  const handleOpenForm = useCallback(() => {
    setShowForm(true);
  }, []);

  const handleCloseForm = useCallback(() => {
    if (preferences) {
      setShowForm(false);
    }
  }, [preferences]);

  return (
    <div className="quest-generator-page">
      <section className="quest-hero">
        <h1 className="quest-hero-title">Quest Generator</h1>
        <p className="quest-hero-subtitle">
          Generiere personalisierte Fitness-Quests basierend auf deinen Zielen und Equipment.
        </p>
      </section>

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
            <button type="button" className="btn-edit-prefs" onClick={handleOpenForm}>
              Preferences bearbeiten
            </button>
          </div>
        </>
      )}

      {!plan && !showForm && (
        <div className="no-plan-message">
          <p>Noch keine Quests generiert.</p>
          <button type="button" className="btn-primary" onClick={handleOpenForm}>
            Jetzt starten
          </button>
        </div>
      )}
    </div>
  );
};

export default QuestGenerator;
