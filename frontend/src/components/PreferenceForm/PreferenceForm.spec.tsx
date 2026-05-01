/**
 * Unit Tests for PreferenceForm Component
 * Tests form rendering, state management, and submission.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PreferenceForm from './PreferenceForm';
import { savePreferences } from '../../services/QuestGeneratorService';

// Mock the service
vi.mock('../../services/QuestGeneratorService', () => ({
  savePreferences: vi.fn(),
}));

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

const mockOnSave = vi.fn();
const mockOnClose = vi.fn();

const renderComponent = (initialValues = null) => {
  return render(
    <PreferenceForm
      onSave={mockOnSave}
      onClose={mockOnClose}
      initialValues={initialValues}
    />
  );
};

describe('PreferenceForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render form with title and subtitle', () => {
    renderComponent();

    expect(screen.getByRole('heading', { name: 'title' })).toBeInTheDocument();
    expect(screen.getByText('subtitle')).toBeInTheDocument();
  });

  it('should render all form fields', () => {
    renderComponent();

    expect(screen.getByLabelText('fitnessGoal.label')).toBeInTheDocument();
    expect(screen.getByLabelText('availableTime.label')).toBeInTheDocument();
    expect(screen.getByLabelText('experienceLevel.label')).toBeInTheDocument();
    expect(screen.getByLabelText('intensity.label: intensity.value')).toBeInTheDocument();
    expect(screen.getByText('equipment.label')).toBeInTheDocument();
    expect(screen.getByText('weekend.label')).toBeInTheDocument();
  });

  it('should render buttons', () => {
    renderComponent();

    expect(screen.getByRole('button', { name: 'buttons.cancel' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'buttons.generate' })).toBeInTheDocument();
  });

  it('should call onClose when cancel button is clicked', async () => {
    renderComponent();
    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: 'buttons.cancel' }));

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should update fitness goal select', async () => {
    renderComponent();
    const user = userEvent.setup();
    const select = screen.getByLabelText('fitnessGoal.label');

    await user.selectOptions(select, 'endurance');

    expect(select).toHaveValue('endurance');
  });

  it('should update available time select', async () => {
    renderComponent();
    const user = userEvent.setup();
    const select = screen.getByLabelText('availableTime.label');

    await user.selectOptions(select, '90');

    expect(select).toHaveValue('90');
  });

  it('should update experience level select', async () => {
    renderComponent();
    const user = userEvent.setup();
    const select = screen.getByLabelText('experienceLevel.label');

    await user.selectOptions(select, 'advanced');

    expect(select).toHaveValue('advanced');
  });

  it('should update intensity slider', async () => {
    renderComponent();
    const user = userEvent.setup();
    const slider = screen.getByRole('slider');

    await user.clear(slider);
    await user.type(slider, '8');

    expect(slider).toHaveValue('8');
  });

  it('should toggle equipment checkboxes', async () => {
    renderComponent();
    const user = userEvent.setup();
    const dumbbellsCheckbox = screen.getByRole('checkbox', { name: 'equipment.options.dumbbells' });

    await user.click(dumbbellsCheckbox);
    expect(dumbbellsCheckbox).toBeChecked();

    await user.click(dumbbellsCheckbox);
    expect(dumbbellsCheckbox).not.toBeChecked();
  });

  it('should toggle weekend checkbox', async () => {
    renderComponent();
    const user = userEvent.setup();
    const weekendCheckbox = screen.getByRole('checkbox', { name: 'weekend.label' });

    expect(weekendCheckbox).toBeChecked(); // Default is true

    await user.click(weekendCheckbox);
    expect(weekendCheckbox).not.toBeChecked();
  });

  it('should call onSave and savePreferences on form submit', async () => {
    renderComponent();
    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: 'buttons.generate' }));

    expect(savePreferences).toHaveBeenCalledWith({
      fitnessGoal: 'strength',
      availableTime: 60,
      equipment: ['Kein Equipment (Bodyweight)'],
      intensity: 5,
      experienceLevel: 'intermediate',
      includeWeekend: true,
    });

    expect(mockOnSave).toHaveBeenCalledWith({
      fitnessGoal: 'strength',
      availableTime: 60,
      equipment: ['Kein Equipment (Bodyweight)'],
      intensity: 5,
      experienceLevel: 'intermediate',
      includeWeekend: true,
    });
  });

  it('should use initial values when provided', () => {
    const initialValues = {
      fitnessGoal: 'weightloss' as const,
      availableTime: 30 as const,
      equipment: ['Hanteln', 'Yoga-Matte'],
      intensity: 7,
      experienceLevel: 'beginner' as const,
      includeWeekend: false,
    };

    renderComponent(initialValues);

    expect(screen.getByLabelText('fitnessGoal.label')).toHaveValue('weightloss');
    expect(screen.getByLabelText('availableTime.label')).toHaveValue('30');
    expect(screen.getByLabelText('experienceLevel.label')).toHaveValue('beginner');
    expect(screen.getByRole('slider')).toHaveValue('7');
    expect(screen.getByRole('checkbox', { name: 'equipment.options.dumbbells' })).toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'equipment.options.yogaMat' })).toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'weekend.label' })).not.toBeChecked();
  });

  it('should have correct accessibility attributes', () => {
    renderComponent();

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby', 'pref-title');
  });
});