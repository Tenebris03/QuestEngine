/**
 * Unit Tests for Card Component
 * Tests rendering and props handling.
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Card from './Card';

describe('Card', () => {
  it('should render with title and description', () => {
    render(
      <Card title="Test Title" description="Test Description" />
    );

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('should render with correct accessible markup', () => {
    render(
      <Card title="Accessible Card" description="A description" />
    );

    const article = screen.getByRole('article');
    expect(article).toBeInTheDocument();
    
    const heading = screen.getByRole('heading', { level: 3 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('Accessible Card');
  });

  it('should render children when provided', () => {
    render(
      <Card title="Card with Children" description="Description">
        <button>Click Me</button>
      </Card>
    );

    expect(screen.getByRole('button', { name: 'Click Me' })).toBeInTheDocument();
  });

  it('should not render actions div when no children', () => {
    render(
      <Card title="Simple Card" description="No children" />
    );

    const actionsDiv = document.querySelector('.card-actions');
    expect(actionsDiv).not.toBeInTheDocument();
  });

  it('should have correct CSS classes', () => {
    render(
      <Card title="Styled Card" description="Description" />
    );

    const article = screen.getByRole('article');
    expect(article).toHaveClass('card');
    
    const title = screen.getByRole('heading', { level: 3 });
    expect(title).toHaveClass('card-title');
    
    const description = screen.getByText('Description');
    expect(description).toHaveClass('card-description');
  });

  it('should handle empty description gracefully', () => {
    render(<Card title="Title Only" description="" />);
    
    expect(screen.getByText('Title Only')).toBeInTheDocument();
    expect(screen.getByText('')).toBeInTheDocument();
  });
});
