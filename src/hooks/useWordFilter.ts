/**
 * React hook for word filtering with state management
 * Feature: 002-implement-a-word
 * 
 * Integrates with existing useDictionary hook from feature 001
 */

import { useState, useCallback } from 'react';
import type { Segment, FilterResult, ValidationResult, FilterError } from '../types/wordFilter.js';
import { WordFilterService } from '../services/wordFilterService.js';
import { useDictionary } from './useDictionary.js';

/**
 * Hook result interface for word filtering functionality
 */
interface UseWordFilterResult {
  /** Execute word filtering with loading state management */
  filterWords: (segments: Segment[]) => Promise<void>;
  /** Validate segments synchronously without filtering */
  validateSegments: (segments: Segment[]) => ValidationResult[];
  /** Current filtering results */
  result: FilterResult | null;
  /** Loading state during filtering operation */
  isLoading: boolean;
  /** Last error encountered */
  error: FilterError | null;
  /** Performance metrics from last operation */
  metrics: FilterResult['metadata'] | null;
  /** Clear current results and error state */
  reset: () => void;
  /** Reset all state including loading and error states */
  resetAll: () => void;
  /** Check if reset is available (has data to reset) */
  canReset: boolean;
}

/**
 * React hook for word filtering with state management
 * Integrates with existing useDictionary hook
 */
export function useWordFilter(): UseWordFilterResult {
  // Get dictionary from existing hook (feature 001)
  const { words: dictionary, isLoading: dictionaryLoading, loadingState } = useDictionary();
  const dictionaryError = loadingState.error;
  
  // Local state for filtering operations
  const [result, setResult] = useState<FilterResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<FilterError | null>(null);
  
  // Create service instance (could be moved to context for better performance)
  const filterService = new WordFilterService();
  
  /**
   * Execute word filtering with loading state management
   */
  const filterWords = useCallback(async (segments: Segment[]) => {
    // Check if dictionary is available
    if (!dictionary || dictionary.length === 0) {
      const dictionaryNotLoadedError: FilterError = {
        type: 'processing',
        message: 'Dictionary not loaded',
        details: {
          constraint: 'dictionary availability',
          suggestion: 'Wait for dictionary to load before filtering'
        }
      };
      setError(dictionaryNotLoadedError);
      return;
    }
    
    // Clear previous state and start loading
    setIsLoading(true);
    setError(null);
    setResult(null);
    
    try {
      // Execute filtering
      const filterResult = await filterService.filterWords(segments, dictionary);
      setResult(filterResult);
      
      // Set error state if filtering returned an error
      if (filterResult.error) {
        setError(filterResult.error);
      }
      
    } catch (err) {
      // Handle unexpected errors
      const processingError: FilterError = {
        type: 'processing',
        message: 'Unexpected error during filtering',
        details: {
          constraint: 'processing error',
          providedValue: err instanceof Error ? err.message : String(err),
          suggestion: 'Check input data and try again'
        }
      };
      setError(processingError);
      
      // Create empty result with error
      setResult({
        words: [],
        error: processingError,
        metadata: {
          processingTimeMs: 0,
          processedWords: 0,
          totalCandidates: 0,
          segmentCount: segments.length
        }
      });
      
    } finally {
      setIsLoading(false);
    }
  }, [dictionary, filterService]);
  
  /**
   * Validate segments synchronously without filtering
   */
  const validateSegments = useCallback((segments: Segment[]): ValidationResult[] => {
    return filterService.validateSegments(segments);
  }, [filterService]);
  
  /**
   * Clear current results and error state
   */
  const reset = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  /**
   * Reset all state including loading and error states
   */
  const resetAll = useCallback(() => {
    setResult(null);
    setError(null);
    setIsLoading(false);
  }, []);

  /**
   * Check if reset is available (has data to reset)
   */
  const canReset = result !== null || error !== null;
  
  // Combine loading states
  const combinedLoading = isLoading || dictionaryLoading;
  
  // Combine errors (prioritize dictionary errors as they block filtering)
  const combinedError = dictionaryError 
    ? {
        type: 'processing' as const,
        message: dictionaryError.message || 'Dictionary loading failed',
        details: {
          constraint: 'dictionary loading',
          suggestion: 'Wait for dictionary to load or check network connection'
        }
      }
    : error;
  
  return {
    filterWords,
    validateSegments,
    result,
    isLoading: combinedLoading,
    error: combinedError,
    metrics: result?.metadata || null,
    reset,
    resetAll,
    canReset
  };
}