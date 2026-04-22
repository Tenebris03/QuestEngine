import React from 'react';
import './Card.css';

// TypeScript Interface für die Props (Eigenschaften) der Karte
interface CardProps {
  title: string;
  description: string;
  children?: React.ReactNode; // Optional: falls wir noch Buttons o.ä. reinlegen wollen
}

/**
 * Reusable Card Component
 * Nutzt unsere globalen Theme-Variablen für ein konsistentes Design.
 */
const Card: React.FC<CardProps> = ({ title, description, children }) => {
  return (
    <article className="card">
      <h3 className="card-title">{title}</h3>
      <p className="card-description">{description}</p>
      {children && <div className="card-actions">{children}</div>}
    </article>
  );
};

export default Card;