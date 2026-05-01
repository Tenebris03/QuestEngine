/**
 * Unit Tests for Home Page
 * Tests rendering, typing animation, and content display.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import Home from './Home';

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'hero.badge': 'AI-Powered',
        'hero.title1': 'Forge Your',
        'hero.title2': 'Fitness Destiny',
        'hero.subtitle': 'Transform your body with personalized AI-generated workout quests',
        'hero.cta': 'Start Your Journey',
        'features.title': 'Quest Types',
        'features.daily.title': 'Daily Quests',
        'features.daily.description': 'Complete daily fitness challenges',
        'features.daily.tag': 'Daily',
        'features.attribute.title': 'Attribute Training',
        'features.attribute.description': 'Focus on specific attributes',
        'features.attribute.tag': 'Attribute',
        'features.penalty.title': 'Penalty System',
        'features.penalty.description': 'Consequences for missed quests',
        'features.penalty.tag': 'Penalty',
        'cta.title': 'Ready to level up?',
        'cta.button': 'Generate Your Plan',
      };
      return translations[key] || key;
    },
  }),
}));

// Mock Card component
vi.mock('../../components/Card/Card', () => ({
  default: ({ title, description, children }: any) => (
    <div data-testid="card">
      <h3>{title}</h3>
      <p>{description}</p>
      {children}
    </div>
  ),
}));

describe('Home', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('should render hero section with initial empty title', () => {
    render(<Home />);

    expect(screen.getByText('AI-Powered')).toBeInTheDocument();
    expect(screen.getByText('')).toBeInTheDocument(); // Empty title initially
    expect(screen.getByText('Transform your body with personalized AI-generated workout quests')).toBeInTheDocument();
    expect(screen.getByText('Start Your Journey')).toBeInTheDocument();
  });

  it('should render features section', () => {
    render(<Home />);

    expect(screen.getByText('Quest Types')).toBeInTheDocument();
    expect(screen.getAllByTestId('card')).toHaveLength(3);
  });

  it('should render CTA section', () => {
    render(<Home />);

    expect(screen.getByText('Ready to level up?')).toBeInTheDocument();
    expect(screen.getByText('Generate Your Plan')).toBeInTheDocument();
  });

  it('should start typing first text', async () => {
    render(<Home />);

    // Initially empty
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('');

    // After some time, should have started typing
    vi.advanceTimersByTime(100);
    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('F');
    });

    vi.advanceTimersByTime(80 * 8); // 80ms per character * 8 chars for "Forge Your"
    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Forge Your');
    });
  });

  it('should transition to red color after first text', async () => {
    render(<Home />);

    // Type first text
    vi.advanceTimersByTime(80 * 9); // "Forge Your" has 9 chars
    vi.advanceTimersByTime(600); // pause

    await waitFor(() => {
      const title = screen.getByRole('heading', { level: 1 });
      expect(title).toHaveClass('is-red');
    });
  });

  it('should delete text after shake', async () => {
    render(<Home />);

    // Complete first text and pause
    vi.advanceTimersByTime(80 * 9 + 600 + 600); // typing + pause + shake

    // Start deleting
    vi.advanceTimersByTime(35 * 9); // deleting speed * 9 chars

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('');
    });
  });

  it('should type second text after deleting', async () => {
    render(<Home />);

    // Complete deletion
    vi.advanceTimersByTime(80 * 9 + 600 + 600 + 35 * 9); // full cycle

    // Start typing second text
    vi.advanceTimersByTime(80 * 14); // "Fitness Destiny" has 14 chars + space

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Fitness Destiny');
    });
  });

  it('should stop at final text', async () => {
    render(<Home />);

    // Complete entire animation
    vi.advanceTimersByTime(80 * 9 + 600 + 600 + 35 * 9 + 80 * 14);

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Fitness Destiny');
    });

    // Should not change anymore
    vi.advanceTimersByTime(1000);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Fitness Destiny');
  });

  it('should render feature cards with correct content', () => {
    render(<Home />);

    const cards = screen.getAllByTestId('card');
    expect(cards[0]).toHaveTextContent('Daily Quests');
    expect(cards[0]).toHaveTextContent('Complete daily fitness challenges');
    expect(cards[0]).toHaveTextContent('Daily');

    expect(cards[1]).toHaveTextContent('Attribute Training');
    expect(cards[1]).toHaveTextContent('Focus on specific attributes');
    expect(cards[1]).toHaveTextContent('Attribute');

    expect(cards[2]).toHaveTextContent('Penalty System');
    expect(cards[2]).toHaveTextContent('Consequences for missed quests');
    expect(cards[2]).toHaveTextContent('Penalty');
  });

  it('should have correct semantic structure', () => {
    render(<Home />);

    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument();
    expect(screen.getAllByRole('button')).toHaveLength(2);
  });
});