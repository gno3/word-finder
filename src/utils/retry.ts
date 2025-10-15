import { DEFAULT_DICTIONARY_CONFIG, DICTIONARY_CONSTANTS } from '../config/dictionary';
import type { DictionaryError } from '../types/dictionary';

/**
 * Retry utilities with exponential backoff for robust network operations
 */
export class RetryUtils {
  /**
   * Execute a function with exponential backoff retry logic
   */
  static async withExponentialBackoff<T>(
    fn: () => Promise<T>,
    maxRetries: number = DEFAULT_DICTIONARY_CONFIG.maxRetries,
    initialDelay: number = DEFAULT_DICTIONARY_CONFIG.initialRetryDelay,
    maxDelay: number = DEFAULT_DICTIONARY_CONFIG.maxRetryDelay
  ): Promise<T> {
    let lastError: Error = new Error('Unknown error');
    let currentDelay = initialDelay;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        // First attempt doesn't have a delay
        if (attempt > 0) {
          await this.delay(currentDelay);
        }

        const result = await fn();
        return result;
      } catch (error) {
        lastError = error as Error;
        
        // Don't retry on the last attempt
        if (attempt === maxRetries) {
          break;
        }

        // Check if error is retryable
        if (!this.isRetryableError(error)) {
          console.warn(`Non-retryable error on attempt ${attempt + 1}:`, error);
          throw error;
        }

        console.warn(`Attempt ${attempt + 1} failed, retrying in ${currentDelay}ms:`, error);

        // Calculate next delay with exponential backoff and jitter
        currentDelay = this.calculateNextDelay(currentDelay, maxDelay);
      }
    }

    // All retries exhausted
    const retryError = new Error(
      `Operation failed after ${maxRetries + 1} attempts. Last error: ${lastError.message}`
    );
    
    // Preserve the original error's properties
    if (lastError.name) {
      retryError.name = lastError.name;
    }
    
    throw retryError;
  }

  /**
   * Calculate next delay with exponential backoff and jitter
   */
  private static calculateNextDelay(currentDelay: number, maxDelay: number): number {
    // Double the delay (exponential)
    let nextDelay = currentDelay * 2;

    // Apply jitter to prevent thundering herd
    const jitter = 1 + (Math.random() - 0.5) * 2 * DICTIONARY_CONSTANTS.BACKOFF_JITTER;
    nextDelay = Math.floor(nextDelay * jitter);

    // Cap at maximum delay
    return Math.min(nextDelay, maxDelay);
  }

  /**
   * Create a delay promise
   */
  private static delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Determine if an error is retryable
   */
  static isRetryableError(error: unknown): boolean {
    if (!error) {
      return false;
    }

    // Network errors are generally retryable
    if (error instanceof TypeError) {
      // Network errors often manifest as TypeError in fetch
      return true;
    }

    if (error instanceof Error) {
      const message = error.message.toLowerCase();
      
      // Network-related errors
      if (message.includes('network') || 
          message.includes('timeout') ||
          message.includes('connection') ||
          message.includes('fetch')) {
        return true;
      }

      // Check for HTTP status codes if it's an HTTP error
      if (error.name === 'HTTPError' || message.includes('http')) {
        return this.isRetryableHttpStatus(error);
      }
    }

    // Check for specific response objects
    if (this.isResponse(error)) {
      return this.isRetryableHttpStatus(error);
    }

    // CORS errors are not retryable
    if (error instanceof Error && error.message.includes('cors')) {
      return false;
    }

    // Default to not retryable for unknown errors
    return false;
  }

  /**
   * Check if HTTP status code is retryable
   */
  private static isRetryableHttpStatus(error: unknown): boolean {
    let status: number | undefined;

    if (this.isResponse(error)) {
      status = error.status;
    } else if (error instanceof Error) {
      // Try to extract status from error message
      const statusMatch = error.message.match(/\b([45]\d{2})\b/);
      if (statusMatch) {
        status = parseInt(statusMatch[1], 10);
      }
    }

    if (!status) {
      return true; // Unknown status, assume retryable
    }

    // Retryable status codes
    return status >= 500 || // Server errors
           status === 408 || // Request Timeout
           status === 429 || // Too Many Requests
           status === 502 || // Bad Gateway
           status === 503 || // Service Unavailable
           status === 504;   // Gateway Timeout
  }

  /**
   * Type guard to check if object has Response-like properties
   */
  private static isResponse(obj: unknown): obj is { status: number; statusText: string } {
    return (
      obj !== null &&
      typeof obj === 'object' &&
      'status' in obj &&
      typeof (obj as any).status === 'number'
    );
  }

  /**
   * Create a retryable fetch function with built-in timeout
   */
  static createRetryableFetch(
    timeoutMs: number = DICTIONARY_CONSTANTS.MAX_LOAD_TIME
  ): (input: RequestInfo | URL, init?: RequestInit) => Promise<Response> {
    return async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

      try {
        const response = await fetch(input, {
          ...init,
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        return response;
      } catch (error) {
        if (controller.signal.aborted) {
          throw new Error(`Request timeout after ${timeoutMs}ms`);
        }
        throw error;
      } finally {
        clearTimeout(timeoutId);
      }
    };
  }

  /**
   * Wrap a function to track retry attempts and provide error context
   */
  static withRetryContext<T>(
    fn: () => Promise<T>,
    operation: string
  ): () => Promise<T> {
    return async (): Promise<T> => {
      const startTime = Date.now();
      
      try {
        const result = await fn();
        const duration = Date.now() - startTime;
        console.info(`${operation} completed successfully in ${duration}ms`);
        return result;
      } catch (error) {
        const duration = Date.now() - startTime;
        console.error(`${operation} failed after ${duration}ms:`, error);
        throw error;
      }
    };
  }

  /**
   * Create a DictionaryError from a generic error
   */
  static createDictionaryError(
    error: unknown,
    operation: string = 'dictionary operation'
  ): DictionaryError {
    let type: DictionaryError['type'] = 'network';
    let message = 'An unexpected error occurred';
    let retryable = true;

    if (error instanceof Error) {
      message = error.message;

      // Classify error type based on message content
      const errorMessage = message.toLowerCase();
      
      if (errorMessage.includes('timeout') || errorMessage.includes('network')) {
        type = 'network';
        retryable = true;
      } else if (errorMessage.includes('size') || errorMessage.includes('large')) {
        type = 'size';
        retryable = false;
      } else if (errorMessage.includes('valid') || errorMessage.includes('format')) {
        type = 'validation';
        retryable = false;
      } else if (errorMessage.includes('storage') || errorMessage.includes('cache')) {
        type = 'storage';
        retryable = false;
      }
    }

    return {
      type,
      message: `${operation}: ${message}`,
      retryable,
      details: {
        originalError: error,
        timestamp: Date.now(),
        operation,
      },
    };
  }

  /**
   * Get retry statistics for monitoring
   */
  static getRetryStats(
    attempts: number,
    totalDuration: number,
    success: boolean
  ): {
    attempts: number;
    averageDelay: number;
    totalDuration: number;
    success: boolean;
    efficiency: number;
  } {
    const averageDelay = attempts > 1 ? totalDuration / (attempts - 1) : 0;
    const efficiency = success ? 1 / attempts : 0;

    return {
      attempts,
      averageDelay,
      totalDuration,
      success,
      efficiency,
    };
  }
}