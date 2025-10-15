import { useState, useEffect, useCallback, useRef } from 'react';
import type { UseDictionaryReturn, LoadingState, DictionaryError } from '../types/dictionary';
import { DictionaryService } from '../services/DictionaryService';
import { ErrorHandlingUtils } from '../utils/errorHandling';

/**
 * React hook for dictionary functionality
 * Provides reactive state management for dictionary operations
 */
export function useDictionary(): UseDictionaryReturn {
  // State management
  const [words, setWords] = useState<string[] | null>(null);
  const [loadingState, setLoadingState] = useState<LoadingState>({
    status: 'idle',
    retryCount: 0,
    lastAttempt: 0
  });

  // Service instance (created once and reused)
  const serviceRef = useRef<DictionaryService | null>(null);
  const initializationPromiseRef = useRef<Promise<void> | null>(null);

  // Initialize service on first render
  useEffect(() => {
    if (!serviceRef.current) {
      serviceRef.current = new DictionaryService();
      
      // Set up event listeners
      serviceRef.current.addEventListener('loading-started', () => {
        setLoadingState(prev => ({ ...prev, status: 'loading' }));
      });

      serviceRef.current.addEventListener('loading-progress', (data: { progress: number }) => {
        setLoadingState(prev => ({ ...prev, progress: data.progress }));
      });

      serviceRef.current.addEventListener('loading-completed', (data: { wordCount: number }) => {
        const wordsArray = serviceRef.current?.getWords();
        setWords(wordsArray || null);
        setLoadingState(prev => ({ 
          ...prev, 
          status: 'loaded',
          progress: 100,
          error: undefined
        }));
        console.info(`Dictionary loaded with ${data.wordCount} words`);
      });

      serviceRef.current.addEventListener('cache-loaded', (data: { wordCount: number }) => {
        const wordsArray = serviceRef.current?.getWords();
        setWords(wordsArray || null);
        setLoadingState(prev => ({ 
          ...prev, 
          status: 'cached',
          progress: 100,
          error: undefined
        }));
        console.info(`Dictionary loaded from cache with ${data.wordCount} words`);
      });

      serviceRef.current.addEventListener('loading-failed', (data: { error: DictionaryError }) => {
        setLoadingState(prev => ({ 
          ...prev, 
          status: 'error',
          error: data.error
        }));
        ErrorHandlingUtils.logError(data.error, { hook: 'useDictionary' });
      });

      serviceRef.current.addEventListener('cache-cleared', () => {
        setWords(null);
        setLoadingState({
          status: 'idle',
          retryCount: 0,
          lastAttempt: 0
        });
      });
    }

    // Initialize dictionary service
    if (!initializationPromiseRef.current) {
      initializationPromiseRef.current = serviceRef.current.initialize().catch(error => {
        console.error('Dictionary initialization failed:', error);
        // Error is already handled by event listeners
      });
    }

    return () => {
      // Cleanup would go here if needed
      // Note: We don't clean up the service as it should persist across component lifecycle
    };
  }, []);

  // Sync loading state with service
  useEffect(() => {
    if (serviceRef.current) {
      const currentState = serviceRef.current.getLoadingState();
      setLoadingState(currentState);
      
      // Sync words if already loaded
      const currentWords = serviceRef.current.getWords();
      if (currentWords && !words) {
        setWords(currentWords);
      }
    }
  }, [words]);

  // Computed derived state
  const isLoading = loadingState.status === 'loading';
  const isReady = loadingState.status === 'loaded' || loadingState.status === 'cached';
  const hasError = loadingState.status === 'error';

  // Word lookup function
  const hasWord = useCallback((word: string): boolean => {
    if (!serviceRef.current || !isReady) {
      return false;
    }
    return serviceRef.current.hasWord(word);
  }, [isReady]);

  // Refresh function
  const refresh = useCallback(async (): Promise<void> => {
    if (!serviceRef.current) {
      throw new Error('Dictionary service not initialized');
    }

    try {
      setLoadingState(prev => ({ 
        ...prev, 
        status: 'loading',
        progress: 0,
        error: undefined
      }));
      
      await serviceRef.current.refresh();
    } catch (error) {
      const dictionaryError = ErrorHandlingUtils.createDictionaryError(
        error,
        'network',
        'manual refresh'
      );
      setLoadingState(prev => ({ 
        ...prev, 
        status: 'error',
        error: dictionaryError
      }));
      throw dictionaryError;
    }
  }, []);

  // Retry function
  const retry = useCallback(async (): Promise<void> => {
    if (!serviceRef.current) {
      throw new Error('Dictionary service not initialized');
    }

    try {
      setLoadingState(prev => ({ 
        ...prev, 
        status: 'loading',
        progress: 0,
        error: undefined,
        retryCount: prev.retryCount + 1
      }));
      
      // Clear any existing error state
      setWords(null);
      
      // Re-initialize the service
      await serviceRef.current.initialize();
    } catch (error) {
      const dictionaryError = ErrorHandlingUtils.createDictionaryError(
        error,
        'network',
        'retry attempt'
      );
      setLoadingState(prev => ({ 
        ...prev, 
        status: 'error',
        error: dictionaryError
      }));
      throw dictionaryError;
    }
  }, []);

  return {
    words,
    loadingState,
    isLoading,
    isReady,
    hasError,
    hasWord,
    refresh,
    retry
  };
}

/**
 * Custom hook for dictionary statistics
 */
export function useDictionaryStats() {
  const [stats, setStats] = useState<{
    wordCount: number;
    cacheSize: number;
    lastLoaded: number;
    source: string;
  } | null>(null);

  const serviceRef = useRef<DictionaryService | null>(null);

  useEffect(() => {
    // This hook assumes the main useDictionary hook has already initialized the service
    // In a real app, you might want to use a context or singleton pattern
    if (!serviceRef.current) {
      serviceRef.current = new DictionaryService();
    }

    const updateStats = () => {
      if (serviceRef.current) {
        const currentStats = serviceRef.current.getStats();
        setStats(currentStats);
      }
    };

    // Update stats initially
    updateStats();

    // Update stats when dictionary state changes
    const interval = setInterval(updateStats, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return stats;
}

/**
 * Hook for managing dictionary configuration
 */
export function useDictionaryConfig() {
  const [config, setConfig] = useState<{
    sourceUrl: string;
    maxSize: number;
    maxRetries: number;
  } | null>(null);

  useEffect(() => {
    // Load configuration (in a real app, this might come from a config service)
    setConfig({
      sourceUrl: 'https://raw.githubusercontent.com/jesstess/Scrabble/master/scrabble/sowpods.txt',
      maxSize: 5 * 1024 * 1024, // 5MB
      maxRetries: 3
    });
  }, []);

  return config;
}

/**
 * Hook for error recovery and user guidance
 */
export function useDictionaryErrorRecovery() {
  const { loadingState, retry } = useDictionary();

  const getErrorMessage = useCallback((): string | null => {
    if (!loadingState.error) return null;
    return ErrorHandlingUtils.getUserFriendlyMessage(loadingState.error);
  }, [loadingState.error]);

  const getSuggestedActions = useCallback((): string[] => {
    if (!loadingState.error) return [];
    return ErrorHandlingUtils.getSuggestedActions(loadingState.error);
  }, [loadingState.error]);

  const canRetry = useCallback((): boolean => {
    if (!loadingState.error) return false;
    return loadingState.error.retryable && loadingState.retryCount < 3;
  }, [loadingState.error, loadingState.retryCount]);

  const shouldUseFallback = useCallback((): boolean => {
    if (!loadingState.error) return false;
    return ErrorHandlingUtils.shouldUseFallback(loadingState.error);
  }, [loadingState.error]);

  return {
    errorMessage: getErrorMessage(),
    suggestedActions: getSuggestedActions(),
    canRetry: canRetry(),
    shouldUseFallback: shouldUseFallback(),
    retry
  };
}