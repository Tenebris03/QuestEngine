import React, { useState, useEffect } from 'react';
import Card from '../../components/Card/Card';
import './Home.css';

const Home: React.FC = () => {
  const [displayedText, setDisplayedText] = useState('');
  const [isRed, setIsRed] = useState(false);
  const [phase, setPhase] = useState<'typing1' | 'pause1' | 'shake' | 'deleting' | 'typing2'>('typing1');

  const text1 = 'Netflix and Chill?';
  const text2 = 'Level Up Your Life.';
  const typingSpeed = 80;
  const deletingSpeed = 35;
  const pauseDuration = 600;
  const shakeDuration = 600;

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (phase === 'typing1') {
      if (displayedText.length < text1.length) {
        timer = setTimeout(() => {
          setDisplayedText(text1.slice(0, displayedText.length + 1));
        }, typingSpeed);
      } else {
        setPhase('pause1');
      }
    } else if (phase === 'pause1') {
      timer = setTimeout(() => {
        setIsRed(true);
        setPhase('shake');
      }, pauseDuration);
    } else if (phase === 'shake') {
      timer = setTimeout(() => {
        setPhase('deleting');
      }, shakeDuration);
    } else if (phase === 'deleting') {
      if (displayedText.length > 0) {
        timer = setTimeout(() => {
          setDisplayedText(displayedText.slice(0, -1));
        }, deletingSpeed);
      } else {
        setIsRed(false);
        setPhase('typing2');
      }
    } else if (phase === 'typing2') {
      if (displayedText.length < text2.length) {
        timer = setTimeout(() => {
          setDisplayedText(text2.slice(0, displayedText.length + 1));
        }, typingSpeed);
      }
    }

    return () => clearTimeout(timer);
  }, [displayedText, phase]);

  return (
    <div className="home-container">
      
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-badge">
          <span className="badge-dot" />
          System Initialized
        </div>
        <h1 className={`hero-title ${isRed ? 'is-red' : ''}`}>{displayedText}</h1>
        <p className="hero-subtitle">
          Das System hat dich ausgewählt. Erledige Quests in der realen Welt,
          steigere deine Stats und brich deine Limits.
        </p>
        <button className="cta-button">
          <span>System beitreten</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </button>
      </section>

      <hr className="section-divider" />

      {/* Feature Section mit Quest-Beispielen */}
      <section>
        <h2 className="section-title">Verfügbare Quest-Typen</h2>
        <div className="features-grid">
          <Card
            title="Tägliche Quests"
            description="Wiederholbare Aufgaben, die dein Fundament stärken. Ignorieren führt zu Strafen."
          >
            <div className="quest-tag tag-daily">Daily: 100 Liegestütze</div>
          </Card>

          <Card
            title="Attribut-Aufstieg"
            description="Spezifische Herausforderungen, die deine Kraft, Agilität oder Intelligenz dauerhaft erhöhen."
          >
            <div className="quest-tag tag-side">+5 STR Points</div>
          </Card>

          <Card
            title="Penalty System"
            description="Wer die Regeln des Systems bricht, muss sich der Strafe stellen. Scheitern ist keine Option."
          >
            <div className="quest-tag tag-penalty">Status: Emergency</div>
          </Card>
        </div>
      </section>

      <hr className="section-divider" />

      {/* Stat Preview Section */}
      <section className="cta-section">
        <h3>Bist du bereit für den ersten Rank-Up?</h3>
        <button className="cta-button" style={{ marginTop: 0 }}>
          <span>Jetzt starten</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </button>
      </section>
    </div>
  );
};

export default Home;

