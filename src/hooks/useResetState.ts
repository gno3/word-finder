/**
 * Custom hook for managing reset state and operations
 * Part of User Story 2 - Quick Reset and Start Over functionality
 */

import { useState, useCallback, useRef } from 'react';

export interface ResetState {
  isResetting: boolean;
  error: string | null;
  lastResetTime: number | null;
  resetCount: number;
}

export interface ResetOperation {
  execute: () => Promise<void>;
  canExecute: boolean;
  timeout?: number; // milliseconds
  retries?: number;
}

export interface UseResetStateOptions {
  onBeforeReset?: () => boolean | Promise<boolean>; // Return false to cancel
  onAfterReset?: () => void | Promise<void>;
  onError?: (error: Error) => void;
  confirmationRequired?: boolean;
  resetTimeout?: number; // Default 5000ms
  maxRetries?: number; // Default 3
  cooldownPeriod?: number; // Minimum time between resets (default 1000ms)
}

export interface UseResetStateReturn {
  resetState: ResetState;
  executeReset: (operation: ResetOperation) => Promise<boolean>;
  clearError: () => void;
  canReset: boolean;
  isResetting: boolean;
  lastError: string | null;
  resetStats: {
    count: number;
    lastResetTime: number | null;
    averageResetTime: number;
  };
}

/**
 * Hook for managing reset operations with error handling, timeouts, and state tracking
 */
export const useResetState = ({
  onBeforeReset,
  onAfterReset,
  onError,
  resetTimeout = 5000,
  maxRetries = 3,
  cooldownPeriod = 1000,
}: UseResetStateOptions = {}): UseResetStateReturn => {
  const [resetState, setResetState] = useState<ResetState>({
    isResetting: false,
    error: null,
    lastResetTime: null,
    resetCount: 0,
  });

  const resetTimesRef = useRef<number[]>([]);
  const abortControllerRef = useRef<AbortController | null>(null);

  const clearError = useCallback(() => {
    setResetState(prev => ({ ...prev, error: null }));
  }, []);

  const canReset = useCallback(() => {
    // Check if currently resetting
    if (resetState.isResetting) return false;
    
    // Check cooldown period
    if (resetState.lastResetTime) {
      const timeSinceLastReset = Date.now() - resetState.lastResetTime;
      if (timeSinceLastReset < cooldownPeriod) return false;
    }
    
    return true;
  }, [resetState.isResetting, resetState.lastResetTime, cooldownPeriod]);

  const executeReset = useCallback(async (operation: ResetOperation): Promise<boolean> => {
    // Validate if reset can be executed
    if (!canReset()) {
      console.warn('Reset operation cannot be executed at this time');
      return false;
    }

    // Clear any previous errors
    clearError();

    try {
      // Pre-reset validation
      if (onBeforeReset) {
        const canProceed = await onBeforeReset();
        if (!canProceed) {
          console.log('Reset operation cancelled by beforeReset hook');
          return false;
        }
      }

      // Start reset operation
      setResetState(prev => ({
        ...prev,
        isResetting: true,
        error: null,
      }));

      const startTime = Date.now();
      
      // Create abort controller for timeout
      abortControllerRef.current = new AbortController();
      const timeoutMs = operation.timeout || resetTimeout;
      
      // Setup timeout
      const timeoutId = setTimeout(() => {
        abortControllerRef.current?.abort();
      }, timeoutMs);

      let lastError: Error | null = null;
      let attempts = 0;
      const maxAttempts = (operation.retries ?? maxRetries) + 1;

      // Retry loop
      while (attempts < maxAttempts) {
        try {
          attempts++;
          
          // Check if operation was aborted
          if (abortControllerRef.current?.signal.aborted) {
            throw new Error(`Reset operation timed out after ${timeoutMs}ms`);
          }

          // Execute the reset operation
          await operation.execute();
          
          // Success - break out of retry loop
          lastError = null;
          break;
          
        } catch (error) {
          lastError = error as Error;
          
          // If this was the last attempt, don't retry
          if (attempts >= maxAttempts) {
            break;
          }
          
          // Wait before retry (exponential backoff)
          const retryDelay = Math.min(1000 * Math.pow(2, attempts - 1), 5000);
          await new Promise(resolve => setTimeout(resolve, retryDelay));
        }
      }

      clearTimeout(timeoutId);

      if (lastError) {
        throw lastError;
      }

      const endTime = Date.now();
      const resetDuration = endTime - startTime;
      
      // Track reset timing for analytics
      resetTimesRef.current.push(resetDuration);
      if (resetTimesRef.current.length > 10) {
        resetTimesRef.current.shift(); // Keep only last 10 reset times
      }

      // Update state with successful reset
      setResetState(prev => ({
        ...prev,
        isResetting: false,
        lastResetTime: endTime,
        resetCount: prev.resetCount + 1,
        error: null,
      }));

      // Post-reset callback
      if (onAfterReset) {
        await onAfterReset();
      }

      console.log(`Reset completed successfully in ${resetDuration}ms (attempt ${attempts}/${maxAttempts})`);
      return true;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown reset error';
      
      setResetState(prev => ({
        ...prev,
        isResetting: false,
        error: errorMessage,
      }));

      // Call error handler
      if (onError && error instanceof Error) {
        onError(error);
      }

      console.error('Reset operation failed:', error);
      return false;
      
    } finally {
      // Cleanup
      if (abortControllerRef.current) {
        abortControllerRef.current = null;
      }
    }
  }, [
    canReset,
    clearError,
    onBeforeReset,
    onAfterReset,
    onError,
    resetTimeout,
    maxRetries,
  ]);

  // Calculate reset statistics
  const resetStats = {
    count: resetState.resetCount,
    lastResetTime: resetState.lastResetTime,
    averageResetTime: resetTimesRef.current.length > 0
      ? resetTimesRef.current.reduce((a, b) => a + b, 0) / resetTimesRef.current.length
      : 0,
  };

  return {
    resetState,
    executeReset,
    clearError,
    canReset: canReset(),
    isResetting: resetState.isResetting,
    lastError: resetState.error,
    resetStats,
  };
};

/**
 * Convenience hook for simple reset operations without complex configuration
 */
export const useSimpleReset = (
  resetFunction: () => void | Promise<void>,
  options: Pick<UseResetStateOptions, 'onError' | 'confirmationRequired'> = {}
) => {
  const resetState = useResetState({
    ...options,
    resetTimeout: 3000, // Shorter timeout for simple operations
    maxRetries: 1, // No retries for simple operations
  });

  const handleReset = useCallback(async () => {
    const operation: ResetOperation = {
      execute: async () => {
        await resetFunction();
      },
      canExecute: true,
    };

    return await resetState.executeReset(operation);
  }, [resetFunction, resetState]);

  return {
    ...resetState,
    reset: handleReset,
  };
};