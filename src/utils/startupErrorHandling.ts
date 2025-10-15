import type { DictionaryError } from '../types/dictionary';
import { ErrorHandlingUtils } from './errorHandling';

/**
 * Specialized error handling for P1 (startup loading) scenarios
 * Extends base error handling with startup-specific logic
 */
export class StartupErrorHandler {
  /**
   * Handle errors specific to application startup dictionary loading
   */
  static handleStartupError(error: unknown, context: {
    isFirstLoad: boolean;
    hasCache: boolean;
    retryCount: number;
  }): DictionaryError {
    const baseError = ErrorHandlingUtils.createDictionaryError(
      error,
      'network',
      'startup loading'
    );

    // Enhance error with startup-specific context
    const startupError: DictionaryError = {
      ...baseError,
      details: {
        ...baseError.details,
        startup: true,
        isFirstLoad: context.isFirstLoad,
        hasCache: context.hasCache,
        retryCount: context.retryCount,
        startupPhase: this.determineStartupPhase(context)
      }
    };

    // Adjust retry behavior for startup scenarios
    if (context.hasCache && context.retryCount > 1) {
      startupError.retryable = false;
      startupError.message = 'Failed to update dictionary. Using cached version may be available.';
    }

    return startupError;
  }

  /**
   * Determine the current phase of startup loading
   */
  private static determineStartupPhase(context: {
    isFirstLoad: boolean;
    hasCache: boolean;
    retryCount: number;
  }): string {
    if (context.isFirstLoad && !context.hasCache) {
      return 'initial-load';
    } else if (context.isFirstLoad && context.hasCache) {
      return 'cache-validation';
    } else if (context.retryCount > 0) {
      return 'retry-attempt';
    }
    return 'unknown';
  }

  /**
   * Get startup-specific user messages
   */
  static getStartupUserMessage(error: DictionaryError): {
    title: string;
    message: string;
    action: string;
  } {
    const phase = error.details?.startupPhase as string;
    const hasCache = error.details?.hasCache as boolean;

    switch (phase) {
      case 'initial-load':
        return {
          title: 'Loading Dictionary',
          message: 'We\'re downloading the word dictionary for the first time. This may take a moment.',
          action: error.retryable ? 'Retrying automatically...' : 'Please check your connection and refresh.'
        };

      case 'cache-validation':
        return {
          title: 'Updating Dictionary',
          message: hasCache 
            ? 'Checking for dictionary updates. You can continue using the app.'
            : 'Loading dictionary from cache.',
          action: error.retryable ? 'Will retry in background' : 'Using cached version'
        };

      case 'retry-attempt':
        return {
          title: 'Connection Issues',
          message: 'Having trouble connecting to download the dictionary.',
          action: hasCache 
            ? 'Using cached version instead'
            : 'Please check your internet connection'
        };

      default:
        return {
          title: 'Dictionary Loading',
          message: ErrorHandlingUtils.getUserFriendlyMessage(error),
          action: error.retryable ? 'Retrying...' : 'Please refresh the page'
        };
    }
  }

  /**
   * Determine if app should continue loading despite dictionary error
   */
  static shouldContinueStartup(error: DictionaryError): boolean {
    const hasCache = error.details?.hasCache as boolean;
    const phase = error.details?.startupPhase as string;

    // If we have cache, we can continue
    if (hasCache) {
      return true;
    }

    // For initial load failures without cache, we should block
    if (phase === 'initial-load') {
      return false;
    }

    // For other scenarios, allow graceful degradation
    return true;
  }

  /**
   * Get fallback strategy for startup failures
   */
  static getFallbackStrategy(error: DictionaryError): {
    strategy: 'block' | 'graceful' | 'offline';
    reason: string;
    userAction: string;
  } {
    const hasCache = error.details?.hasCache as boolean;
    const phase = error.details?.startupPhase as string;
    const retryCount = error.details?.retryCount as number || 0;

    if (hasCache) {
      return {
        strategy: 'graceful',
        reason: 'Cached dictionary available',
        userAction: 'Continue with cached data'
      };
    }

    if (phase === 'initial-load' && retryCount >= 3) {
      return {
        strategy: 'offline',
        reason: 'No cache available and network failed',
        userAction: 'App functionality will be limited'
      };
    }

    if (!error.retryable) {
      return {
        strategy: 'block',
        reason: 'Critical error that cannot be recovered',
        userAction: 'Refresh page or contact support'
      };
    }

    return {
      strategy: 'graceful',
      reason: 'Temporary issue, will retry',
      userAction: 'Please wait for automatic retry'
    };
  }

  /**
   * Create progress indicators for startup loading
   */
  static getProgressIndicator(phase: string, progress?: number): {
    message: string;
    percentage: number;
    showSpinner: boolean;
  } {
    switch (phase) {
      case 'initial-load':
        return {
          message: 'Downloading dictionary for first use...',
          percentage: progress || 0,
          showSpinner: true
        };

      case 'cache-validation':
        return {
          message: 'Checking for updates...',
          percentage: progress || 50,
          showSpinner: true
        };

      case 'retry-attempt':
        return {
          message: 'Retrying connection...',
          percentage: progress || 25,
          showSpinner: true
        };

      default:
        return {
          message: 'Loading...',
          percentage: progress || 0,
          showSpinner: true
        };
    }
  }

  /**
   * Log startup-specific analytics
   */
  static logStartupEvent(event: 'started' | 'completed' | 'failed' | 'fallback', data: {
    phase?: string;
    hasCache?: boolean;
    duration?: number;
    error?: DictionaryError;
    strategy?: string;
  }): void {
    const logEntry = {
      event: `startup-${event}`,
      timestamp: Date.now(),
      ...data
    };

    console.info('Dictionary startup event:', logEntry);

    // In production, send to analytics service
    if (import.meta.env.PROD) {
      this.sendStartupAnalytics(logEntry);
    }
  }

  /**
   * Send startup analytics (placeholder implementation)
   */
  private static sendStartupAnalytics(data: Record<string, unknown>): void {
    // Placeholder for analytics service integration
    try {
      // Example: analytics.track('dictionary_startup', data);
      console.debug('Startup analytics:', data);
    } catch (error) {
      console.warn('Failed to send startup analytics:', error);
    }
  }

  /**
   * Create startup performance metrics
   */
  static createPerformanceMetrics(startTime: number, endTime: number, success: boolean): {
    duration: number;
    performance: 'excellent' | 'good' | 'poor' | 'failed';
    withinTarget: boolean;
    metrics: Record<string, number>;
  } {
    const duration = endTime - startTime;
    const targetTime = 5000; // 5 seconds as per success criteria

    let performance: 'excellent' | 'good' | 'poor' | 'failed';
    if (!success) {
      performance = 'failed';
    } else if (duration < 2000) {
      performance = 'excellent';
    } else if (duration < targetTime) {
      performance = 'good';
    } else {
      performance = 'poor';
    }

    return {
      duration,
      performance,
      withinTarget: duration <= targetTime,
      metrics: {
        durationMs: duration,
        targetMs: targetTime,
        overTarget: Math.max(0, duration - targetTime),
        efficiency: success ? targetTime / duration : 0
      }
    };
  }

  /**
   * Handle critical startup failures that block app loading
   */
  static handleCriticalStartupFailure(error: DictionaryError): {
    shouldBlock: boolean;
    errorScreen: {
      title: string;
      message: string;
      actions: Array<{
        label: string;
        action: 'retry' | 'offline' | 'refresh';
        primary: boolean;
      }>;
    };
  } {
    const hasCache = error.details?.hasCache as boolean;
    const retryable = error.retryable;

    if (hasCache) {
      return {
        shouldBlock: false,
        errorScreen: {
          title: 'Dictionary Update Failed',
          message: 'Using cached dictionary. Some words may be outdated.',
          actions: [
            { label: 'Continue', action: 'offline', primary: true },
            { label: 'Retry Update', action: 'retry', primary: false }
          ]
        }
      };
    }

    if (retryable) {
      return {
        shouldBlock: true,
        errorScreen: {
          title: 'Unable to Load Dictionary',
          message: 'Please check your internet connection and try again.',
          actions: [
            { label: 'Retry', action: 'retry', primary: true },
            { label: 'Refresh Page', action: 'refresh', primary: false }
          ]
        }
      };
    }

    return {
      shouldBlock: true,
      errorScreen: {
        title: 'Dictionary Loading Failed',
        message: 'There was a problem loading the word dictionary.',
        actions: [
          { label: 'Refresh Page', action: 'refresh', primary: true },
          { label: 'Continue Limited', action: 'offline', primary: false }
        ]
      }
    };
  }
}