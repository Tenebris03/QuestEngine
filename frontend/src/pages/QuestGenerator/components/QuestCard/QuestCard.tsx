/**
 * QuestCard Komponente
 * Zeigt eine einzelne Quest (Trainingseinheit) in kompakter Form an.
 */

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuestGenerator } from '../../../../hooks/useQuestGenerator';
import { useUser } from '../../../../context/UserContext';
import type { Quest } from '../../QuestGenerator.types';
import './QuestCard.css';

/**
 * Props für die QuestCard Komponente.
 */
interface QuestCardProps {
  quest: Quest;
  questIndex: number;
}

/**
 * QuestCard zeigt die Details einer täglichen Quest an.
 */
const QuestCard: React.FC<QuestCardProps> = ({ quest, questIndex }) => {
  const { t } = useTranslation();
  const { handleCompleteQuest } = useQuestGenerator();
  const { isAuthenticated } = useUser();
  const [expanded, setExpanded] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [tempRating, setTempRating] = useState(5);

  const intensityClass = `intensity-${quest.intensity}`;

  const handleRatingSubmit = (e?: React.MouseEvent) => {
    e?.preventDefault();
    handleCompleteQuest(questIndex, tempRating);
    setShowRatingModal(false);
  };

  const handleComplete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!quest.completed && isAuthenticated) {
      setShowRatingModal(true);
    }
  };

  return (
    <>
      <article className={`quest-card ${intensityClass}`} aria-expanded={expanded}>
        <div
          className="quest-header"
          onClick={() => setExpanded(!expanded)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setExpanded(!expanded);
            }
          }}
          role="button"
          tabIndex={0}
          aria-expanded={expanded}
        >
          <div className="quest-day">{quest.day}</div>
          <h4 className="quest-title">{quest.title}</h4>
          <div className="quest-meta">
            <span className={`quest-tag-intensity ${intensityClass}`}>{quest.intensity}</span>
            <span className="quest-duration">{quest.duration} min</span>
            
            {/* Auth-Check für den Abschließen Button */}
            {!quest.completed ? (
              isAuthenticated && (
                <button 
                  className="btn-complete"
                  onClick={handleComplete}
                  aria-label="Quest abschließen und bewerten"
                >
                  Abschließen
                </button>
              )
            ) : (
              quest.difficultyRating && (
                <span className="quest-rating">
                  ⭐ {quest.difficultyRating}/10
                </span>
              )
            )}
          </div>
        </div>

        {expanded && (
          <div className="quest-details">
            <p className="quest-description">{quest.description}</p>

            <ul className="exercise-list">
              {quest.exercises.map((exercise, index) => (
                <li key={index} className="exercise-item">
                  <span className="exercise-name">{exercise.name}</span>
                  <span className="exercise-stats">
                    {t('questCard.setsReps', { sets: exercise.sets, reps: exercise.reps })}
                  </span>
                  <span className="exercise-rest">{t('questCard.rest', { seconds: exercise.restSeconds })}</span>
                </li>
              ))}
            </ul>

            {quest.equipment.length > 0 && (
              <div className="quest-equipment">
                <strong>{t('questCard.equipment', { items: quest.equipment.join(', ') })}</strong>
              </div>
            )}
          </div>
        )}
      </article>

      {/* Modal aus dem <article> Container ausgelagert, um z-index & overflow Bugs zu beheben */}
      {showRatingModal && isAuthenticated && (
        <div className={`rating-modal ${intensityClass}`}>
          <div className="rating-modal-content">
            <button className="rating-modal-close" onClick={() => setShowRatingModal(false)} aria-label="Schließen">
              ×
            </button>
            <h3>Wie schwer war die Quest?</h3>
            <div className="rating-stars">
              {Array.from({length: 10}, (_, i) => (
                <span key={i} className={`rating-star ${i < tempRating ? 'active' : ''}`}>
                  ⭐
                </span>
              ))}
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={tempRating}
              onChange={(e) => setTempRating(Number(e.target.value))}
              className="rating-slider"
              aria-label="Schwierigkeitsbewertung 1-10"
            />
            <div className="rating-value">{tempRating}/10</div>
            <div className="rating-modal-buttons">
              <button 
                type="button" 
                onClick={() => setShowRatingModal(false)}
                className="btn-secondary"
              >
                Abbrechen
              </button>
              <button 
                type="button" 
                onClick={handleRatingSubmit}
                className="btn-primary"
              >
                Speichern
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default QuestCard;