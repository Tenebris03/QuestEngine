/**
 * Unit Tests for Footer Component
 * Tests branding, links, and copyright display.
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Footer from './Footer';

describe('Footer', () => {
  it('should render brand name', () => {
    render(<Footer />);

    expect(screen.getByText('QuestEngine')).toBeInTheDocument();
  });

  it('should render footer links', () => {
    render(<Footer />);

    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /quest generator/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /about/i })).toBeInTheDocument();
  });

  it('should render footer logo', () => {
    render(<Footer />);

    const logo = screen.getByAltText('');
    expect(logo).toBeInTheDocument();
  });

  it('should have footer element', () => {
    render(<Footer />);

    const footer = screen.getByRole('contentinfo');
    expect(footer).toBeInTheDocument();
  });

it('should render current year in copyright', () => {
    render(<Footer />);

    const currentYear = new Date().getFullYear().toString();
    expect(screen.getByText(new RegExp(currentYear))).toBeInTheDocument();
  });
});
