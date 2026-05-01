/**
 * Unit Tests for WeeklyOverview Component
 * Tests plan display, statistics calculation, and interactions.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import WeeklyOverview from './WeeklyOverview';
import type { WeeklyPlan } from '../../types/QuestGenerator.types';

// Mock QuestCard
vi.mock('../QuestCard/QuestCard', () => ({
  default: ({ quest }: { quest: any }) => (
    <div data-testid={`quest-card-${quest.dayIndex}`}>
      Quest: {quest.title}
    </div>
  ),
}));

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: any) => {
      if (key === 'title') return `Week ${options.week} Overview`;
      if (key === 'stats.quests') return `${options.count} quests`;
      if (key === 'stats.duration') return `${options.minutes} min total`;
      if (key === 'stats.completed') return `${options.completed}/${options.total} completed`;
      if (key === 'regenerate') return 'Regenerate Plan';
      return key;
    },
  }),
}));

const mockPlan: WeeklyPlan = {
  weekNumber: 1,
  quests: [
    {
      dayIndex: 1,
      day: 'Monday',
      title: 'Upper Body',
      description: 'Strength training',
      duration: 45,
      intensity: 'high',
      exercises: [],
      equipment: [],
      completed: false,
    },
    {
      dayIndex: 2,
      day: 'Tuesday',
      title: 'Lower Body',
      description: 'Leg day',
      duration: 50,
      intensity: 'medium',
      exercises: [],
      equipment: [],
      completed: true,
    },
    {
      dayIndex: 3,
      day: 'Wednesday',
      title: 'Core',
      description: 'Abs workout',
      duration: 30,
      intensity: 'low',
      exercises: [],
      equipment: [],
      completed: true,
    },
  ],
};

const mockOnRegenerate = vi.fn();

describe('WeeklyOverview', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render weekly title with week number', () => {
    render(<WeeklyOverview plan={mockPlan} onRegenerate={mockOnRegenerate} />);

    expect(screen.getByRole('heading', { name: 'Week 1 Overview' })).toBeInTheDocument();
  });

  it('should display correct statistics', () => {
    render(<WeeklyOverview plan={mockPlan} onRegenerate={mockOnRegenerate} />);

    expect(screen.getByText('3 quests')).toBeInTheDocument();
    expect(screen.getByText('125 min total')).toBeInTheDocument(); // 45 + 50 + 30
    expect(screen.getByText('2/3 completed')).toBeInTheDocument();
  });

  it('should render regenerate button', () => {
    render(<WeeklyOverview plan={mockPlan} onRegenerate={mockOnRegenerate} />);

    expect(screen.getByRole('button', { name: 'Regenerate Plan' })).toBeInTheDocument();
  });

  it('should call onRegenerate when button is clicked', async () => {
    render(<WeeklyOverview plan={mockPlan} onRegenerate={mockOnRegenerate} />);
    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: 'Regenerate Plan' }));

    expect(mockOnRegenerate).toHaveBeenCalledTimes(1);
  });

  it('should render QuestCard for each quest', () => {
    render(<WeeklyOverview plan={mockPlan} onRegenerate={mockOnRegenerate} />);

    expect(screen.getByTestId('quest-card-1')).toBeInTheDocument();
    expect(screen.getByTestId('quest-card-2')).toBeInTheDocument();
    expect(screen.getByTestId('quest-card-3')).toBeInTheDocument();
  });

  it('should display quest titles in QuestCards', () => {
    render(<WeeklyOverview plan={mockPlan} onRegenerate={mockOnRegenerate} />);

    expect(screen.getByText('Quest: Upper Body')).toBeInTheDocument();
    expect(screen.getByText('Quest: Lower Body')).toBeInTheDocument();
    expect(screen.getByText('Quest: Core')).toBeInTheDocument();
  });

  it('should have correct accessibility attributes', () => {
    render(<WeeklyOverview plan={mockPlan} onRegenerate={mockOnRegenerate} />);

    const section = screen.getByRole('region');
    expect(section).toHaveAttribute('aria-labelledby', 'weekly-title');

    const list = screen.getByRole('list');
    expect(list).toBeInTheDocument();

    const listitems = screen.getAllByRole('listitem');
    expect(listitems).toHaveLength(3);
  });

  it('should handle empty quests array', () => {
    const emptyPlan = { ...mockPlan, quests: [] };
    render(<WeeklyOverview plan={emptyPlan} onRegenerate={mockOnRegenerate} />);

    expect(screen.getByText('0 quests')).toBeInTheDocument();
    expect(screen.getByText('0 min total')).toBeInTheDocument();
    expect(screen.getByText('0/0 completed')).toBeInTheDocument();

    const listitems = screen.queryAllByRole('listitem');
    expect(listitems).toHaveLength(0);
  });

  it('should calculate completion stats correctly', () => {
    const allCompletedPlan = {
      ...mockPlan,
      quests: mockPlan.quests.map(q => ({ ...q, completed: true }))
    };

    render(<WeeklyOverview plan={allCompletedPlan} onRegenerate={mockOnRegenerate} />);

    expect(screen.getByText('3/3 completed')).toBeInTheDocument();
  });
});