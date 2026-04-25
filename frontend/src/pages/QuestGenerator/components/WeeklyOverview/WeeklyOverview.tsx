/**
 * WeeklyOverview Komponente
 * Zeigt den generierten Wochenplan als übersichtliche Tabelle an.
 */

import React from 'react';
import type { WeeklyPlan } from '../../QuestGenerator.types';
import QuestCard from '../QuestCard/QuestCard';
import './WeeklyOverview.css';

/**
 * Props für die WeeklyOverview Komponente.
 */
interface WeeklyOverviewProps {
  plan: WeeklyPlan;
  onRegenerate: () => void;
}

/**
 * WeeklyOverview zeigt den kompletten Wochenplan in einer Tabelle an.
 */
const WeeklyOverview: React.FC<WeeklyOverviewProps> = ({ plan, onRegenerate }) => {
  const completedQuests = plan.quests.filter((q) => q.completed).length;
  const totalDuration = plan.quests.reduce((sum, q) => sum + q.duration, 0);

  return (
    <section className="weekly-overview" aria-labelledby="weekly-title">
      <div className="weekly-header">
        <div>
          <h2 id="weekly-title" className="weekly-title">
            Dein Trainingsplan – Woche {plan.weekNumber}
          </h2>
          <p className="weekly-subtitle">
            {plan.quests.length} Quests · {totalDuration} Minuten gesamt ·{' '}
            {completedQuests}/{plan.quests.length} abgeschlossen
          </p>
        </div>
        <button type="button" className="btn-regenerate" onClick={onRegenerate}>
          Neue Quests generieren
        </button>
      </div>

      <div className="quests-list" role="list">
        {plan.quests.map((quest) => (
          <div key={quest.dayIndex} role="listitem">
            <QuestCard quest={quest} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default WeeklyOverview;
