import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ErrorBoundary } from '../ErrorBoundary';

const ProblemChild = () => {
  throw new Error('Test component explosion');
};

describe('ErrorBoundary', () => {
  it('should render children when no error occurs', () => {
    render(
      <ErrorBoundary moduleName="TestModule">
        <div>Safe Content</div>
      </ErrorBoundary>
    );

    expect(screen.getByText('Safe Content')).toBeDefined();
  });

  it('should render fallback UI when child component throws', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary moduleName="TestModule">
        <ProblemChild />
      </ErrorBoundary>
    );

    expect(screen.getByText(/TestModule Module Error/i)).toBeDefined();
    expect(screen.getByText(/Test component explosion/i)).toBeDefined();

    consoleSpy.mockRestore();
  });
});
