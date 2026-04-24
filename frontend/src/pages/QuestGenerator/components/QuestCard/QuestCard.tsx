/**
 * QuestCard Komponente
 * Zeigt eine einzelne Quest (Trainingseinheit) in kompakter Form an.
 */

import React, { useState } from 'react';
import type { Quest } from '../../QuestGenerator.types';
import './QuestCard.css';

/**
 * Props für die QuestCard Komponente.
 */
interface QuestCardProps {
  quest: Quest;
}

/**
 * QuestCard zeigt die Details einer täglichen Quest an.
 */
const QuestCard: React.FC<QuestCardProps> = ({ quest }) => {
  const [expanded, setExpanded] = useState(false);

  const intensityClass = `intensity-${quest.intensity}`;

  return (
    <article className={`quest-card ${intensityClass}`}>
      <div className="quest-header" onClick={() => setExpanded(!expanded)} role="button" tabIndex={0} aria-expanded={expanded}>
        <div className="quest-day">{quest.day}</div>
        <h4 className="quest-title">{quest.title}</h4>
        <div className="quest-meta">
          <span className={`quest-tag-intensity ${intensityClass}`}>{quest.intensity}</span>
          <span className="quest-duration">{quest.duration} min</span>
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
                  {exercise.sets} Sets × {exercise.reps} Reps
                </span>
                <span className="exercise-rest">{exercise.restSeconds}s Pause</span>
              </li>
            ))}
          </ul>

          {quest.equipment.length > 0 && (
            <div className="quest-equipment">
              <strong>Equipment:</strong> {quest.equipment.join(', ')}
            </div>
          )}
        </div>
      )}
    </article>
  );
};

export default QuestCard;
