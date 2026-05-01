/**
 * Unit Tests for QuestCard Component
 * Tests rendering, expand/collapse functionality, and accessibility.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import QuestCard from './QuestCard';
import type { Quest } from '../../types/QuestGenerator.types';

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: any) => {
      if (key === 'setsReps') return `${options.sets} sets, ${options.reps} reps`;
      if (key === 'rest') return `Rest: ${options.seconds}s`;
      if (key === 'equipment') return `Equipment: ${options.items}`;
      return key;
    },
  }),
}));

const mockQuest: Quest = {
  day: 'Monday',
  title: 'Upper Body Strength',
  description: 'Focus on building upper body strength with compound movements.',
  duration: 45,
  intensity: 'high',
  exercises: [
    {
      name: 'Push-ups',
      sets: 3,
      reps: 12,
      restSeconds: 60,
    },
    {
      name: 'Pull-ups',
      sets: 3,
      reps: 8,
      restSeconds: 90,
    },
  ],
  equipment: ['Kein Equipment (Bodyweight)'],
};

describe('QuestCard', () => {
  it('should render quest header information', () => {
    render(<QuestCard quest={mockQuest} />);

    expect(screen.getByText('Monday')).toBeInTheDocument();
    expect(screen.getByText('Upper Body Strength')).toBeInTheDocument();
    expect(screen.getByText('high')).toBeInTheDocument();
    expect(screen.getByText('45 min')).toBeInTheDocument();
  });

  it('should have correct CSS classes based on intensity', () => {
    render(<QuestCard quest={mockQuest} />);

    const card = screen.getByRole('article');
    expect(card).toHaveClass('quest-card', 'intensity-high');
  });

  it('should start collapsed by default', () => {
    render(<QuestCard quest={mockQuest} />);

    expect(screen.queryByText('Focus on building upper body strength with compound movements.')).not.toBeInTheDocument();
    expect(screen.queryByText('Push-ups')).not.toBeInTheDocument();
  });

  it('should expand when header is clicked', async () => {
    render(<QuestCard quest={mockQuest} />);
    const user = userEvent.setup();
    const header = screen.getByRole('button');

    await user.click(header);

    expect(screen.getByText('Focus on building upper body strength with compound movements.')).toBeInTheDocument();
    expect(screen.getByText('Push-ups')).toBeInTheDocument();
    expect(screen.getByText('3 sets, 12 reps')).toBeInTheDocument();
    expect(screen.getByText('Rest: 60s')).toBeInTheDocument();
  });

  it('should collapse when header is clicked again', async () => {
    render(<QuestCard quest={mockQuest} />);
    const user = userEvent.setup();
    const header = screen.getByRole('button');

    // Expand
    await user.click(header);
    expect(screen.getByText('Push-ups')).toBeInTheDocument();

    // Collapse
    await user.click(header);
    expect(screen.queryByText('Push-ups')).not.toBeInTheDocument();
  });

  it('should expand when Enter key is pressed', async () => {
    render(<QuestCard quest={mockQuest} />);
    const user = userEvent.setup();
    const header = screen.getByRole('button');

    header.focus();
    await user.keyboard('{Enter}');

    expect(screen.getByText('Push-ups')).toBeInTheDocument();
  });

  it('should expand when Space key is pressed', async () => {
    render(<QuestCard quest={mockQuest} />);
    const user = userEvent.setup();
    const header = screen.getByRole('button');

    header.focus();
    await user.keyboard(' ');

    expect(screen.getByText('Push-ups')).toBeInTheDocument();
  });

  it('should display equipment when available', async () => {
    render(<QuestCard quest={mockQuest} />);
    const user = userEvent.setup();
    const header = screen.getByRole('button');

    await user.click(header);

    expect(screen.getByText('Equipment: Kein Equipment (Bodyweight)')).toBeInTheDocument();
  });

  it('should not display equipment section when empty', async () => {
    const questWithoutEquipment = { ...mockQuest, equipment: [] };
    render(<QuestCard quest={questWithoutEquipment} />);
    const user = userEvent.setup();
    const header = screen.getByRole('button');

    await user.click(header);

    expect(screen.queryByText(/Equipment:/)).not.toBeInTheDocument();
  });

  it('should have correct accessibility attributes', () => {
    render(<QuestCard quest={mockQuest} />);

    const article = screen.getByRole('article');
    expect(article).toHaveAttribute('aria-expanded', 'false');

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(button).toHaveAttribute('tabindex', '0');
  });

  it('should update aria-expanded when expanded', async () => {
    render(<QuestCard quest={mockQuest} />);
    const user = userEvent.setup();
    const header = screen.getByRole('button');

    await user.click(header);

    const article = screen.getByRole('article');
    expect(article).toHaveAttribute('aria-expanded', 'true');

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-expanded', 'true');
  });

  it('should render multiple exercises', async () => {
    render(<QuestCard quest={mockQuest} />);
    const user = userEvent.setup();
    const header = screen.getByRole('button');

    await user.click(header);

    expect(screen.getByText('Push-ups')).toBeInTheDocument();
    expect(screen.getByText('Pull-ups')).toBeInTheDocument();
    expect(screen.getAllByText(/Rest: \d+s/)).toHaveLength(2);
  });
});