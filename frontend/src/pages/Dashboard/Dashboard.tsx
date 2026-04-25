import React from 'react';
import { useUser } from '../../context/UserContext';
import Card from '../../components/Card/Card';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const { user } = useUser();
  const xpPercent = Math.min(100, Math.round((user.experience / user.maxExperience) * 100));

  return (
    <div className="dashboard-container">
      <section className="dashboard-hero">
        <div className="level-badge">
          <span className="level-number">{user.level}</span>
          <span className="level-label">Level</span>
        </div>
        <h1 className="dashboard-title">{user.name}</h1>
        <p className="dashboard-subtitle">Welcome back, adventurer.</p>
      </section>

      <section className="xp-section">
        <div className="xp-header">
          <span>Experience</span>
          <span>{user.experience} / {user.maxExperience} XP</span>
        </div>
        <div className="xp-bar-bg">
          <div className="xp-bar-fill" style={{ width: `${xpPercent}%` }} />
        </div>
      </section>

      <section>
        <h2 className="section-title">Stats</h2>
        <div className="stats-grid">
          <Card title="Strength" description="Physical power and melee damage.">
            <div className="stat-value">{user.stats.strength}</div>
          </Card>
          <Card title="Agility" description="Speed, dodge chance, and reflexes.">
            <div className="stat-value">{user.stats.agility}</div>
          </Card>
          <Card title="Intelligence" description="Magic damage and skill learning.">
            <div className="stat-value">{user.stats.intelligence}</div>
          </Card>
          <Card title="Vitality" description="Health points and endurance.">
            <div className="stat-value">{user.stats.vitality}</div>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;

