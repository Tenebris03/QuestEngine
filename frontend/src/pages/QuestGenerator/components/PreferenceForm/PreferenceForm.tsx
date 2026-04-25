/**
 * PreferenceForm Komponente
 * Ermöglicht dem Nutzer das Setzen seiner Fitness-Preferences.
 * Speichert die Daten im localStorage.
 */

import React, { useState, useCallback } from 'react';
import type { UserPreferences } from '../../QuestGenerator.types';
import { savePreferences } from '../../../../services/QuestGeneratorService';
import './PreferenceForm.css';

/**
 * Props für die PreferenceForm Komponente.
 */
interface PreferenceFormProps {
  onSave: (preferences: UserPreferences) => void;
  onClose: () => void;
  initialValues?: UserPreferences | null;
}

const EQUIPMENT_OPTIONS = [
  'Kein Equipment (Bodyweight)',
  'Klimmzugstange',
  'Hanteln',
  'Resistance Bands',
  'Yoga-Matte',
];

/**
 * PreferenceForm Komponente für die Eingabe von User-Preferences.
 */
const PreferenceForm: React.FC<PreferenceFormProps> = ({ onSave, onClose, initialValues }) => {
  const [goal, setGoal] = useState<UserPreferences['fitnessGoal']>(initialValues?.fitnessGoal || 'strength');
  const [time, setTime] = useState<UserPreferences['availableTime']>(initialValues?.availableTime || 60);
  const [equipment, setEquipment] = useState<string[]>(initialValues?.equipment || ['Kein Equipment (Bodyweight)']);
  const [intensity, setIntensity] = useState(initialValues?.intensity || 5);
  const [level, setLevel] = useState<UserPreferences['experienceLevel']>(initialValues?.experienceLevel || 'intermediate');
  const [weekend, setWeekend] = useState(initialValues?.includeWeekend ?? true);

  const toggleEquipment = useCallback((item: string) => {
    setEquipment((prev) =>
      prev.includes(item) ? prev.filter((e) => e !== item) : [...prev, item],
    );
  }, []);

  const handleSubmit = useCallback(() => {
    const preferences: UserPreferences = {
      fitnessGoal: goal,
      availableTime: time,
      equipment,
      intensity,
      experienceLevel: level,
      includeWeekend: weekend,
    };
    savePreferences(preferences);
    onSave(preferences);
  }, [goal, time, equipment, intensity, level, weekend, onSave]);

  return (
    <div className="preference-form-overlay" role="dialog" aria-modal="true" aria-labelledby="pref-title">
      <div className="preference-form">
        <h2 id="pref-title" className="form-title">Quest-Parameter festlegen</h2>
        <p className="form-subtitle">Definiere deine Ziele für den optimalen Trainingsplan.</p>

        {/* Fitness-Ziel */}
        <div className="form-group">
          <label htmlFor="fitness-goal" className="form-label">Fitness-Ziel</label>
          <select id="fitness-goal" className="form-select" value={goal} onChange={(e) => setGoal(e.target.value as UserPreferences['fitnessGoal'])}>
            <option value="strength">Kraftaufbau</option>
            <option value="endurance">Ausdauer</option>
            <option value="weightloss">Gewichtsverlust</option>
            <option value="muscle">Muskelaufbau</option>
          </select>
        </div>

        {/* Verfügbare Zeit */}
        <div className="form-group">
          <label htmlFor="available-time" className="form-label">Verfügbare Zeit pro Session</label>
          <select id="available-time" className="form-select" value={time} onChange={(e) => setTime(Number(e.target.value) as UserPreferences['availableTime'])}>
            <option value={30}>30 Minuten</option>
            <option value={45}>45 Minuten</option>
            <option value={60}>60 Minuten</option>
            <option value={90}>90 Minuten</option>
            <option value={120}>120 Minuten</option>
          </select>
        </div>

        {/* Erfahrungslevel */}
        <div className="form-group">
          <label htmlFor="experience-level" className="form-label">Erfahrungslevel</label>
          <select id="experience-level" className="form-select" value={level} onChange={(e) => setLevel(e.target.value as UserPreferences['experienceLevel'])}>
            <option value="beginner">Anfänger</option>
            <option value="intermediate">Fortgeschritten</option>
            <option value="advanced">Experte</option>
          </select>
        </div>

        {/* Intensität */}
        <div className="form-group">
          <label htmlFor="intensity" className="form-label">
            Intensität: <span className="intensity-value">{intensity}/10</span>
          </label>
          <input
            id="intensity"
            type="range"
            min={1}
            max={10}
            value={intensity}
            onChange={(e) => setIntensity(Number(e.target.value))}
            className="form-slider"
          />
          <div className="slider-labels">
            <span>Leicht</span>
            <span>Extrem</span>
          </div>
        </div>

        {/* Equipment */}
        <fieldset className="form-group equipment-group">
          <legend className="form-label">Verfügbares Equipment</legend>
          <div className="equipment-options">
            {EQUIPMENT_OPTIONS.map((item) => (
              <label key={item} className="equipment-checkbox">
                <input
                  type="checkbox"
                  checked={equipment.includes(item)}
                  onChange={() => toggleEquipment(item)}
                />
                <span>{item}</span>
              </label>
            ))}
          </div>
        </fieldset>

        {/* Wochenende */}
        <div className="form-group checkbox-group">
          <label className="equipment-checkbox">
            <input type="checkbox" checked={weekend} onChange={(e) => setWeekend(e.target.checked)} />
            <span>Wochenende inkludieren</span>
          </label>
        </div>

        {/* Buttons */}
        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Abbrechen
          </button>
          <button type="button" className="btn-primary" onClick={handleSubmit}>
            Plan generieren
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreferenceForm;
