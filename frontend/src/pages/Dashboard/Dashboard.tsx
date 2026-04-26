import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useUser, type UserStats } from '../../context/UserContext';
import Card from '../../components/Card/Card';
import { getTodaysQuest } from '../../services/QuestGeneratorService';
import type { Quest, Exercise } from '../../pages/QuestGenerator/QuestGenerator.types';
import './Dashboard.css';

interface StatConfig {
  key: keyof UserStats;
  label: string;
  color: string;
  glow: string;
  icon: React.ReactNode;
}

function getTodayStorageKey(): string {
  const today = new Date().toISOString().split('T')[0];
  return `questEngine_dailyCompletion_${today}`;
}

function loadCompletedExercises(count: number): boolean[] {
  try {
    const stored = localStorage.getItem(getTodayStorageKey());
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length === count) {
        return parsed;
      }
    }
  } catch {
    // ignore
  }
  return Array(count).fill(false);
}

function saveCompletedExercises(state: boolean[]): void {
  localStorage.setItem(getTodayStorageKey(), JSON.stringify(state));
}

const STATS_CONFIG: StatConfig[] = [
  {
    key: 'strength',
    label: 'STR',
    color: '#f97316',
    glow: 'rgba(249, 115, 22, 0.25)',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 5v14"/><path d="M18 5v14"/><path d="M2 12h20"/>
      </svg>
    ),
  },
  {
    key: 'agility',
    label: 'AGI',
    color: '#10b981',
    glow: 'rgba(16, 185, 129, 0.25)',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
      </svg>
    ),
  },
  {
    key: 'intelligence',
    label: 'INT',
    color: '#8b5cf6',
    glow: 'rgba(139, 92, 246, 0.25)',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z"/>
        <path d="M9 21h6"/>
      </svg>
    ),
  },
  {
    key: 'vitality',
    label: 'VIT',
    color: '#06b6d4',
    glow: 'rgba(6, 182, 212, 0.25)',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
    ),
  },
];

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const { user, isAuthenticated } = useUser();
  const [dailyQuest, setDailyQuest] = useState<Quest | null>(null);
  const [completedExercises, setCompletedExercises] = useState<boolean[]>([]);

  useEffect(() => {
    const quest = getTodaysQuest();
    setDailyQuest(quest);
    if (quest) {
      setCompletedExercises(loadCompletedExercises(quest.exercises.length));
    }
  }, []);

  const toggleExercise = (index: number) => {
    setCompletedExercises((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      saveCompletedExercises(next);
      return next;
    });
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="dashboard-container">
        <section className="dashboard-hero">
          <div className="level-badge-wrapper">
            <div className="level-badge" style={{ background: 'var(--error-soft)', borderColor: 'rgba(239, 68, 68, 0.2)' }}>
              <span className="level-number" style={{ color: 'var(--error)' }}>!</span>
              <span className="level-label">{t('dashboard.locked.badge')}</span>
            </div>
          </div>
          <h1 className="dashboard-title">{t('dashboard.locked.title')}</h1>
          <p className="dashboard-subtitle">{t('dashboard.locked.subtitle')}</p>
        </section>

        <section>
          <div className="stats-grid">
            <Card title={t('dashboard.locked.authRequired')} description={t('dashboard.locked.authDescription')}>
              <Link to="/login" className="cta-button" style={{ marginTop: 'var(--space-md)', textDecoration: 'none', display: 'inline-flex' }}>
                <span>{t('dashboard.locked.loginButton')}</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
            </Card>
          </div>
        </section>
      </div>
    );
  }

  const xpPercent = Math.min(100, Math.round((user.experience / user.maxExperience) * 100));
  const maxStat = Math.max(...Object.values(user.stats));

  const intensityClass = dailyQuest ? `intensity-${dailyQuest.intensity}` : '';
  const allExercisesCompleted = dailyQuest && completedExercises.length > 0 && completedExercises.every(Boolean);

  return (
    <div className="dashboard-container">
      <section className="dashboard-hero">
        <h1 className="dashboard-title">{user.name}</h1>
        
        <StatPieChart 
          level={user.level} 
          stats={user.stats} 
          maxStat={maxStat}
          xpPercent={xpPercent}
        />

        <div className="xp-text">
          <span>{t('dashboard.stats.xp', { current: user.experience, max: user.maxExperience })}</span>
          <span className="xp-percent">{t('dashboard.stats.xpPercent', { percent: xpPercent })}</span>
        </div>
      </section>

      {dailyQuest && (
        <section className="daily-quest-section">
          <h2 className="section-title">{t('dashboard.dailyQuest.title')}</h2>
          <div className={`daily-quest-card ${intensityClass} ${allExercisesCompleted ? 'quest-completed' : ''}`}>
            <div className="daily-quest-header">
              <div className="daily-quest-day">{t(`weekdays.${new Date().getDay()}`)}</div>
              <h3 className="daily-quest-title">{dailyQuest.title}</h3>
              <div className="daily-quest-meta">
                <span className={`quest-tag-intensity ${intensityClass}`}>{dailyQuest.intensity}</span>
                <span className="quest-duration">{t('dashboard.dailyQuest.duration', { minutes: dailyQuest.duration })}</span>
              </div>
            </div>
            <p className="daily-quest-description">{dailyQuest.description}</p>
            <div className="daily-quest-checklist">
              {dailyQuest.exercises.map((ex, i) => (
                <ExerciseCheckItem
                  key={i}
                  exercise={ex}
                  checked={completedExercises[i] ?? false}
                  onToggle={() => toggleExercise(i)}
                />
              ))}
            </div>
            {allExercisesCompleted && (
              <div className="quest-completion-banner">{t('dashboard.dailyQuest.completed')}</div>
            )}
          </div>
        </section>
      )}

      {!dailyQuest && (
        <section className="daily-quest-section">
          <h2 className="section-title">{t('dashboard.dailyQuest.title')}</h2>
          <div className="daily-quest-card empty">
            <div className="daily-quest-empty-content">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                <path d="M2 17l10 5 10-5"/>
                <path d="M2 12l10 5 10-5"/>
              </svg>
              <p>{t('dashboard.dailyQuest.empty.description')}</p>
              <Link to="/quest-generator" className="cta-button" style={{ textDecoration: 'none', display: 'inline-flex' }}>
                <span>{t('dashboard.dailyQuest.empty.button')}</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

const StatPieChart: React.FC<{
  level: number;
  stats: UserStats;
  maxStat: number;
  xpPercent: number;
}> = ({ level, stats, maxStat, xpPercent }) => {
  const { t } = useTranslation();
  const [hoveredSegment, setHoveredSegment] = useState<number | null>(null);

  const size = 180;
  const center = size / 2;
  const outerRadius = size / 2 - 4;
  const innerRadius = outerRadius * 0.62;
  const labelRadius = (outerRadius + innerRadius) / 2;

  const segments = STATS_CONFIG.map((stat, index) => {
    const startAngle = (index * 90 - 45) * (Math.PI / 180);
    const endAngle = ((index + 1) * 90 - 45) * (Math.PI / 180);
    const midAngle = (startAngle + endAngle) / 2;

    const x1 = center + outerRadius * Math.cos(startAngle);
    const y1 = center + outerRadius * Math.sin(startAngle);
    const x2 = center + outerRadius * Math.cos(endAngle);
    const y2 = center + outerRadius * Math.sin(endAngle);
    const x3 = center + innerRadius * Math.cos(endAngle);
    const y3 = center + innerRadius * Math.sin(endAngle);
    const x4 = center + innerRadius * Math.cos(startAngle);
    const y4 = center + innerRadius * Math.sin(startAngle);

    const lx = center + labelRadius * Math.cos(midAngle);
    const ly = center + labelRadius * Math.sin(midAngle);

    const value = stats[stat.key];
    const relativePercent = Math.round((value / maxStat) * 100);

    return {
      ...stat,
      path: `M ${x1} ${y1} A ${outerRadius} ${outerRadius} 0 0 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 0 0 ${x4} ${y4} Z`,
      labelX: lx,
      labelY: ly,
      value,
      relativePercent,
    };
  });

  const circumference = 2 * Math.PI * (innerRadius - 4);
  const strokeDashoffset = circumference - (xpPercent / 100) * circumference;

  return (
    <div 
      className="stat-pie-chart"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {segments.map((seg, i) => (
          <path
            key={seg.key}
            d={seg.path}
            fill={seg.color}
            opacity={hoveredSegment === i ? 1 : 0.7}
            stroke="var(--bg-primary)"
            strokeWidth="2"
            style={{ 
              transition: 'opacity 0.3s ease, transform 0.3s ease',
              cursor: 'pointer',
              transformOrigin: `${center}px ${center}px`,
              transform: hoveredSegment === i ? 'scale(1.04)' : 'scale(1)',
            }}
            onMouseEnter={() => setHoveredSegment(i)}
            onMouseLeave={() => setHoveredSegment(null)}
          />
        ))}
        
        {/* Inner circle background */}
        <circle cx={center} cy={center} r={innerRadius - 2} fill="var(--bg-primary)" />
        
        {/* Inner XP ring */}
        <circle
          cx={center}
          cy={center}
          r={innerRadius - 6}
          fill="none"
          stroke="var(--glass-border)"
          strokeWidth="3"
        />
        <circle
          cx={center}
          cy={center}
          r={innerRadius - 6}
          fill="none"
          stroke="url(#xpGradientPie)"
          strokeWidth="3"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${center} ${center})`}
          style={{ transition: 'stroke-dashoffset 0.5s ease' }}
        />
        
        <defs>
          <linearGradient id="xpGradientPie" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
      </svg>

      {/* Center content - always visible level */}
      <div className="stat-pie-center">
        <span className="stat-pie-level">{level}</span>
        <span className="stat-pie-level-label">{t('dashboard.stats.level')}</span>
      </div>

      {/* Hover overlay */}
      {hoveredSegment !== null && (
        <div 
          className="stat-pie-hover"
          style={{ 
            animation: 'fadeScaleIn 0.25s ease',
          }}
        >
          <div className="stat-pie-hover-icon" style={{ color: segments[hoveredSegment].color }}>
            {segments[hoveredSegment].icon}
          </div>
          <div className="stat-pie-hover-value" style={{ color: segments[hoveredSegment].color }}>
            {segments[hoveredSegment].value}
          </div>
          <div className="stat-pie-hover-label">
            {segments[hoveredSegment].label}
          </div>
        </div>
      )}
    </div>
  );
};

const ExerciseCheckItem: React.FC<{
  exercise: Exercise;
  checked: boolean;
  onToggle: () => void;
}> = ({ exercise, checked, onToggle }) => {
  const { t } = useTranslation();
  return (
    <label className={`exercise-check-row ${checked ? 'checked' : ''}`}>
      <div className="exercise-checkbox" onClick={onToggle} role="checkbox" aria-checked={checked}>
        {checked && (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </div>
      <div className="exercise-check-info">
        <span className="exercise-check-name">{exercise.name}</span>
        <span className="exercise-check-detail">{t('dashboard.dailyQuest.exercise.setsRepsRest', { sets: exercise.sets, reps: exercise.reps, rest: exercise.restSeconds })}</span>
      </div>
    </label>
  );
};

export default Dashboard;
