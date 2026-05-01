/**
 * Unit Tests for QuestGenerator Page
 * Tests conditional rendering and integration with useQuestGenerator hook.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import QuestGenerator from './QuestGenerator';

// Mock components
vi.mock('../../components/PreferenceForm/PreferenceForm', () => ({
  default: ({ onSave, onClose, initialValues }: any) => (
    <div data-testid="preference-form">
      <button onClick={() => onSave({ fitnessGoal: 'strength' })} data-testid="save-prefs">Save</button>
      <button onClick={onClose} data-testid="close-form">Close</button>
    </div>
  ),
}));

vi.mock('../../components/WeeklyOverview/WeeklyOverview', () => ({
  default: ({ plan, onRegenerate }: any) => (
    <div data-testid="weekly-overview">
      <button onClick={onRegenerate} data-testid="regenerate">Regenerate</button>
    </div>
  ),
}));

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock useQuestGenerator
const mockUseQuestGenerator = vi.fn();
vi.mock('../../hooks/useQuestGenerator', () => ({
  useQuestGenerator: () => mockUseQuestGenerator(),
}));

const defaultHookReturn = {
  preferences: null,
  plan: null,
  showForm: true,
  aiProgress: null,
  isGenerating: false,
  modelError: null,
  webgpuAvailable: true,
  handleSavePreferences: vi.fn(),
  handleRegenerate: vi.fn(),
  handleOpenForm: vi.fn(),
  handleCloseForm: vi.fn(),
  handleRetry: vi.fn(),
};

describe('QuestGenerator', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseQuestGenerator.mockReturnValue(defaultHookReturn);
  });

  it('should render hero section', () => {
    render(<QuestGenerator />);

    expect(screen.getByText('title')).toBeInTheDocument();
    expect(screen.getByText('subtitle')).toBeInTheDocument();
  });

  it('should not show WebGPU warning when available', () => {
    render(<QuestGenerator />);

    expect(screen.queryByText('webgpu.warning')).not.toBeInTheDocument();
  });

  it('should show WebGPU warning when not available', () => {
    mockUseQuestGenerator.mockReturnValue({
      ...defaultHookReturn,
      webgpuAvailable: false,
    });

    render(<QuestGenerator />);

    expect(screen.getByText('⚠️ webgpu.warning')).toBeInTheDocument();
    expect(screen.getByText('webgpu.description')).toBeInTheDocument();
  });

  it('should show AI progress when generating', () => {
    mockUseQuestGenerator.mockReturnValue({
      ...defaultHookReturn,
      aiProgress: {
        status: 'generating',
        message: 'Generating plan...',
        percent: 50,
      },
    });

    render(<QuestGenerator />);

    expect(screen.getByText('Generating plan...')).toBeInTheDocument();
    const progressBar = document.querySelector('.ai-progress-fill');
    expect(progressBar).toHaveStyle({ width: '50%' });
  });

  it('should show error message with retry button', () => {
    const mockRetry = vi.fn();
    mockUseQuestGenerator.mockReturnValue({
      ...defaultHookReturn,
      showForm: false,
      modelError: 'AI Error occurred',
      handleRetry: mockRetry,
    });

    render(<QuestGenerator />);
    const user = userEvent.setup();

    expect(screen.getByText('❌ error.title')).toBeInTheDocument();
    expect(screen.getByText('AI Error occurred')).toBeInTheDocument();

    const retryButton = screen.getByRole('button', { name: 'error.retry' });
    expect(retryButton).toBeInTheDocument();

    user.click(retryButton);
    expect(mockRetry).toHaveBeenCalled();
  });

  it('should render PreferenceForm when showForm is true', () => {
    render(<QuestGenerator />);

    expect(screen.getByTestId('preference-form')).toBeInTheDocument();
  });

  it('should pass correct props to PreferenceForm', () => {
    const mockSave = vi.fn();
    const mockClose = vi.fn();
    mockUseQuestGenerator.mockReturnValue({
      ...defaultHookReturn,
      preferences: { fitnessGoal: 'strength' },
      handleSavePreferences: mockSave,
      handleCloseForm: mockClose,
    });

    render(<QuestGenerator />);

    const saveButton = screen.getByTestId('save-prefs');
    const closeButton = screen.getByTestId('close-form');

    expect(saveButton).toBeInTheDocument();
    expect(closeButton).toBeInTheDocument();
  });

  it('should render WeeklyOverview when plan exists and form is hidden', () => {
    mockUseQuestGenerator.mockReturnValue({
      ...defaultHookReturn,
      showForm: false,
      plan: { weekNumber: 1, quests: [] },
    });

    render(<QuestGenerator />);

    expect(screen.getByTestId('weekly-overview')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'actions.editPreferences' })).toBeInTheDocument();
  });

  it('should call handleOpenForm when edit preferences button is clicked', async () => {
    const mockOpenForm = vi.fn();
    mockUseQuestGenerator.mockReturnValue({
      ...defaultHookReturn,
      showForm: false,
      plan: { weekNumber: 1, quests: [] },
      handleOpenForm: mockOpenForm,
    });

    render(<QuestGenerator />);
    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: 'actions.editPreferences' }));

    expect(mockOpenForm).toHaveBeenCalled();
  });

  it('should show no plan message when no plan and form hidden', () => {
    mockUseQuestGenerator.mockReturnValue({
      ...defaultHookReturn,
      showForm: false,
      plan: null,
    });

    render(<QuestGenerator />);

    expect(screen.getByText('noPlan.description')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'noPlan.button' })).toBeInTheDocument();
  });

  it('should call handleOpenForm when create plan button is clicked', async () => {
    const mockOpenForm = vi.fn();
    mockUseQuestGenerator.mockReturnValue({
      ...defaultHookReturn,
      showForm: false,
      plan: null,
      handleOpenForm: mockOpenForm,
    });

    render(<QuestGenerator />);
    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: 'noPlan.button' }));

    expect(mockOpenForm).toHaveBeenCalled();
  });

  it('should disable buttons when generating', () => {
    mockUseQuestGenerator.mockReturnValue({
      ...defaultHookReturn,
      showForm: false,
      plan: { weekNumber: 1, quests: [] },
      isGenerating: true,
    });

    render(<QuestGenerator />);

    const editButton = screen.getByRole('button', { name: 'actions.editPreferences' });
    expect(editButton).toBeDisabled();
  });

  it('should disable retry button when generating', () => {
    mockUseQuestGenerator.mockReturnValue({
      ...defaultHookReturn,
      showForm: false,
      modelError: 'Error',
      isGenerating: true,
    });

    render(<QuestGenerator />);

    const retryButton = screen.getByRole('button', { name: 'error.retry' });
    expect(retryButton).toBeDisabled();
  });
});