import React from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import Card from '../../components/Card/Card';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const { user, isAuthenticated } = useUser();

  if (!isAuthenticated || !user) {
    return (
      <div className="dashboard-container">
        <section className="dashboard-hero">
          <div className="level-badge" style={{ background: 'var(--error-soft)', borderColor: 'rgba(239, 68, 68, 0.2)' }}>
            <span className="level-number" style={{ color: 'var(--error)' }}>!</span>
            <span className="level-label">Locked</span>
          </div>
          <h1 className="dashboard-title">System Access Denied</h1>
          <p className="dashboard-subtitle">You must be logged in to view your adventurer dashboard.</p>
        </section>

        <section>
          <div className="stats-grid">
            <Card title="Authentication Required" description="Your stats, quests, and progress are protected. Log in to access your personal dashboard.">
              <Link to="/login" className="cta-button" style={{ marginTop: 'var(--space-md)', textDecoration: 'none', display: 'inline-flex' }}>
                <span>Login to System</span>
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

