import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Card from '../../components/Card/Card';
import './Home.css';

const Home: React.FC = () => {
  const { t } = useTranslation('home');
  const [displayedText, setDisplayedText] = useState('');
  const [isRed, setIsRed] = useState(false);
  const [phase, setPhase] = useState<'typing1' | 'pause1' | 'shake' | 'deleting' | 'typing2'>('typing1');

  const text1 = t('hero.title1');
  const text2 = t('hero.title2');
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
  }, [displayedText, phase, text1, text2]);

  return (
    <div className="home-container">
      
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-badge">
          <span className="badge-dot" />
          {t('hero.badge')}
        </div>
        <h1 className={`hero-title ${isRed ? 'is-red' : ''}`}>{displayedText}</h1>
        <p className="hero-subtitle">
          {t('hero.subtitle')}
        </p>
        <button className="cta-button">
          <span>{t('hero.cta')}</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </button>
      </section>

      <hr className="section-divider" />

      {/* Feature Section mit Quest-Beispielen */}
      <section>
        <h2 className="section-title">{t('features.title')}</h2>
        <div className="features-grid">
          <Card
            title={t('features.daily.title')}
            description={t('features.daily.description')}
          >
            <div className="quest-tag tag-daily">{t('features.daily.tag')}</div>
          </Card>

          <Card
            title={t('features.attribute.title')}
            description={t('features.attribute.description')}
          >
            <div className="quest-tag tag-side">{t('features.attribute.tag')}</div>
          </Card>

          <Card
            title={t('features.penalty.title')}
            description={t('features.penalty.description')}
          >
            <div className="quest-tag tag-penalty">{t('features.penalty.tag')}</div>
          </Card>
        </div>
      </section>

      <hr className="section-divider" />

      {/* Stat Preview Section */}
      <section className="cta-section">
        <h3>{t('cta.title')}</h3>
        <button className="cta-button" style={{ marginTop: 0 }}>
          <span>{t('cta.button')}</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </button>
      </section>
    </div>
  );
};

export default Home;
