/**
 * Basic Reset Functionality Test
 * Validates core reset functionality works
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';

import { useWordFilter } from '../hooks/useWordFilter';

// Mock the hook
vi.mock('../hooks/useWordFilter');

const mockUseWordFilter = vi.mocked(useWordFilter);

// Simple test component using the hook
const TestResetComponent: React.FC = () => {
  const { result, canReset, resetAll } = useWordFilter();
  
  return (
    <div>
      <div data-testid="results">{result?.words.join(',') || ''}</div>
      <div data-testid="result-count">{result?.words.length || 0}</div>
      <button 
        data-testid="reset-button"
        disabled={!canReset}
        onClick={resetAll}
      >
        Reset
      </button>
    </div>
  );
};

describe('Basic Reset Functionality', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should enable reset button when canReset is true', () => {
    mockUseWordFilter.mockReturnValue({
      result: {
        words: ['word1', 'word2'],
        metadata: { 
          processingTimeMs: 10, 
          processedWords: 2, 
          totalCandidates: 5, 
          segmentCount: 3 
        }
      },
      isLoading: false,
      error: null,
      metrics: null,
      canReset: true,
      filterWords: vi.fn(),
      validateSegments: vi.fn(),
      reset: vi.fn(),
      resetAll: vi.fn()
    });

    render(<TestResetComponent />);
    
    const resetButton = screen.getByTestId('reset-button');
    expect(resetButton).not.toBeDisabled();
  });

  it('should disable reset button when canReset is false', () => {
    mockUseWordFilter.mockReturnValue({
      result: null,
      isLoading: false,
      error: null,
      metrics: null,
      canReset: false,
      filterWords: vi.fn(),
      validateSegments: vi.fn(),
      reset: vi.fn(),
      resetAll: vi.fn()
    });

    render(<TestResetComponent />);
    
    const resetButton = screen.getByTestId('reset-button');
    expect(resetButton).toBeDisabled();
  });

  it('should call resetAll when reset button is clicked', () => {
    const mockResetAll = vi.fn();
    
    mockUseWordFilter.mockReturnValue({
      result: {
        words: ['word1'],
        metadata: { 
          processingTimeMs: 10, 
          processedWords: 1, 
          totalCandidates: 3, 
          segmentCount: 3 
        }
      },
      isLoading: false,
      error: null,
      metrics: null,
      canReset: true,
      filterWords: vi.fn(),
      validateSegments: vi.fn(),
      reset: vi.fn(),
      resetAll: mockResetAll
    });

    render(<TestResetComponent />);
    
    const resetButton = screen.getByTestId('reset-button');
    fireEvent.click(resetButton);
    
    expect(mockResetAll).toHaveBeenCalledTimes(1);
  });

  it('should display current results', () => {
    mockUseWordFilter.mockReturnValue({
      result: {
        words: ['word1', 'word2', 'word3'],
        metadata: { 
          processingTimeMs: 15, 
          processedWords: 3, 
          totalCandidates: 8, 
          segmentCount: 3 
        }
      },
      isLoading: false,
      error: null,
      metrics: null,
      canReset: true,
      filterWords: vi.fn(),
      validateSegments: vi.fn(),
      reset: vi.fn(),
      resetAll: vi.fn()
    });

    render(<TestResetComponent />);
    
    expect(screen.getByTestId('results')).toHaveTextContent('word1,word2,word3');
    expect(screen.getByTestId('result-count')).toHaveTextContent('3');
  });
});