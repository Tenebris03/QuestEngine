/**
 * PreferenceForm Komponente
 * Ermöglicht dem Nutzer das Setzen seiner Fitness-Preferences.
 * Speichert die Daten im localStorage.
 */

import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
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

const EQUIPMENT_OPTIONS: { value: string; key: string }[] = [
  { value: 'Kein Equipment (Bodyweight)', key: 'none' },
  { value: 'Klimmzugstange', key: 'pullupBar' },
  { value: 'Hanteln', key: 'dumbbells' },
  { value: 'Resistance Bands', key: 'resistanceBands' },
  { value: 'Yoga-Matte', key: 'yogaMat' },
];

/**
 * PreferenceForm Komponente für die Eingabe von User-Preferences.
 */
const PreferenceForm: React.FC<PreferenceFormProps> = ({ onSave, onClose, initialValues }) => {
  const { t } = useTranslation();
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
        <h2 id="pref-title" className="form-title">{t('preferenceForm.title')}</h2>
        <p className="form-subtitle">{t('preferenceForm.subtitle')}</p>

        {/* Fitness-Ziel */}
        <div className="form-group">
          <label htmlFor="fitness-goal" className="form-label">{t('preferenceForm.fitnessGoal.label')}</label>
          <select id="fitness-goal" className="form-select" value={goal} onChange={(e) => setGoal(e.target.value as UserPreferences['fitnessGoal'])}>
            <option value="strength">{t('preferenceForm.fitnessGoal.options.strength')}</option>
            <option value="endurance">{t('preferenceForm.fitnessGoal.options.endurance')}</option>
            <option value="weightloss">{t('preferenceForm.fitnessGoal.options.weightloss')}</option>
            <option value="muscle">{t('preferenceForm.fitnessGoal.options.muscle')}</option>
          </select>
        </div>

        {/* Verfügbare Zeit */}
        <div className="form-group">
          <label htmlFor="available-time" className="form-label">{t('preferenceForm.availableTime.label')}</label>
          <select id="available-time" className="form-select" value={time} onChange={(e) => setTime(Number(e.target.value) as UserPreferences['availableTime'])}>
            <option value={30}>{t('preferenceForm.availableTime.options.30')}</option>
            <option value={45}>{t('preferenceForm.availableTime.options.45')}</option>
            <option value={60}>{t('preferenceForm.availableTime.options.60')}</option>
            <option value={90}>{t('preferenceForm.availableTime.options.90')}</option>
            <option value={120}>{t('preferenceForm.availableTime.options.120')}</option>
          </select>
        </div>

        {/* Erfahrungslevel */}
        <div className="form-group">
          <label htmlFor="experience-level" className="form-label">{t('preferenceForm.experienceLevel.label')}</label>
          <select id="experience-level" className="form-select" value={level} onChange={(e) => setLevel(e.target.value as UserPreferences['experienceLevel'])}>
            <option value="beginner">{t('preferenceForm.experienceLevel.options.beginner')}</option>
            <option value="intermediate">{t('preferenceForm.experienceLevel.options.intermediate')}</option>
            <option value="advanced">{t('preferenceForm.experienceLevel.options.advanced')}</option>
          </select>
        </div>

        {/* Intensität */}
        <div className="form-group">
          <label htmlFor="intensity" className="form-label">
            {t('preferenceForm.intensity.label')}: <span className="intensity-value">{t('preferenceForm.intensity.value', { value: intensity })}</span>
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
            <span>{t('preferenceForm.intensity.min')}</span>
            <span>{t('preferenceForm.intensity.max')}</span>
          </div>
        </div>

        {/* Equipment */}
        <fieldset className="form-group equipment-group">
          <legend className="form-label">{t('preferenceForm.equipment.label')}</legend>
          <div className="equipment-options">
            {EQUIPMENT_OPTIONS.map((item) => (
              <label key={item.value} className="equipment-checkbox">
                <input
                  type="checkbox"
                  checked={equipment.includes(item.value)}
                  onChange={() => toggleEquipment(item.value)}
                />
                <span>{t(`preferenceForm.equipment.options.${item.key}`)}</span>
              </label>
            ))}
          </div>
        </fieldset>

        {/* Wochenende */}
        <div className="form-group checkbox-group">
          <label className="equipment-checkbox">
            <input type="checkbox" checked={weekend} onChange={(e) => setWeekend(e.target.checked)} />
            <span>{t('preferenceForm.weekend.label')}</span>
          </label>
        </div>

        {/* Buttons */}
        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={onClose}>
            {t('preferenceForm.buttons.cancel')}
          </button>
          <button type="button" className="btn-primary" onClick={handleSubmit}>
            {t('preferenceForm.buttons.generate')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreferenceForm;
