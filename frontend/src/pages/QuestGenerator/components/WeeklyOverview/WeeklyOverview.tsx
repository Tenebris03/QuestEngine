/**
 * WeeklyOverview Komponente
 * Zeigt den generierten Wochenplan als übersichtliche Tabelle an.
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  const completedQuests = plan.quests.filter((q) => q.completed).length;
  const totalDuration = plan.quests.reduce((sum, q) => sum + q.duration, 0);

  return (
    <section className="weekly-overview" aria-labelledby="weekly-title">
      <div className="weekly-header">
        <div>
          <h2 id="weekly-title" className="weekly-title">
            {t('weeklyOverview.title', { week: plan.weekNumber })}
          </h2>
          <p className="weekly-subtitle">
            <span className="stat-chip">
              <span className="chip-dot" />
              {t('weeklyOverview.stats.quests', { count: plan.quests.length })}
            </span>
            <span className="stat-chip">
              <span className="chip-dot" />
              {t('weeklyOverview.stats.duration', { minutes: totalDuration })}
            </span>
            <span className="stat-chip completed">
              <span className="chip-dot" />
              {t('weeklyOverview.stats.completed', { completed: completedQuests, total: plan.quests.length })}
            </span>
          </p>
        </div>
        <button type="button" className="btn-regenerate" onClick={onRegenerate}>
          {t('weeklyOverview.regenerate')}
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
