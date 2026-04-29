/**
 * EventCard Komponente
 * Zeigt ein einzelnes Event (Ruhetag, Wettkampf, Milestone etc.) an.
 */

import React from 'react';
import type { CalendarEvent, EventType } from '../../QuestGenerator.types';
import './EventCard.css';

/**
 * Props für die EventCard Komponente.
 */
interface EventCardProps {
  event: CalendarEvent;
}

const EVENT_META: Record<EventType, { label: string; icon: string }> = {
  rest: { label: 'Ruhe', icon: '☁️' },
  competition: { label: 'Wettkampf', icon: '🏆' },
  milestone: { label: 'Milestone', icon: '🎯' },
  group: { label: 'Gruppe', icon: '👥' },
  nutrition: { label: 'Ernährung', icon: '🥗' },
};

/**
 * EventCard zeigt die Details eines Events an.
 */
const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const meta = EVENT_META[event.type];

  return (
    <article className={`event-card event-${event.type}`}>
      <div className="event-main">
        <span className="event-icon" aria-hidden="true">
          {meta.icon}
        </span>
        <div className="event-content">
          <h4 className="event-title">{event.title}</h4>
          <p className="event-description">{event.description}</p>
        </div>
        <div className="event-meta">
          <span className="event-type-badge">{meta.label}</span>
          {typeof event.duration === 'number' && (
            <span className="event-duration">{event.duration} min</span>
          )}
        </div>
      </div>
    </article>
  );
};

export default EventCard;

