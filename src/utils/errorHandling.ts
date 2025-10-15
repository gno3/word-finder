import type { DictionaryError, DictionaryErrorType } from '../types/dictionary';
import { ERROR_MESSAGES } from '../config/dictionary';

/**
 * Error handling utilities for dictionary operations
 */
export class ErrorHandlingUtils {
  /**
   * Create a standardized DictionaryError from various error types
   */
  static createDictionaryError(
    error: unknown,
    type: DictionaryErrorType = 'network',
    operation: string = 'dictionary operation'
  ): DictionaryError {
    let message: string;
    let code: string | undefined;
    let details: Record<string, unknown> = {};

    if (error instanceof Error) {
      message = error.message;
      code = error.name;
      details.originalError = {
        name: error.name,
        message: error.message,
        stack: error.stack
      };
    } else if (typeof error === 'string') {
      message = error;
    } else {
      message = 'Unknown error occurred';
      details.originalError = error;
    }

    // Classify error type and determine retry behavior
    const classification = this.classifyError(error, type);
    
    return {
      type: classification.type,
      message: this.getStandardErrorMessage(classification.type, message),
      code,
      retryable: classification.retryable,
      details: {
        ...details,
        operation,
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
        url: window.location.href
      }
    };
  }

  /**
   * Classify error and determine appropriate type and retry behavior
   */
  private static classifyError(
    error: unknown,
    defaultType: DictionaryErrorType
  ): { type: DictionaryErrorType; retryable: boolean } {
    if (error instanceof Error) {
      const message = error.message.toLowerCase();
      const name = error.name.toLowerCase();

      // Network errors
      if (
        message.includes('network') ||
        message.includes('fetch') ||
        message.includes('timeout') ||
        message.includes('connection') ||
        name.includes('typeerror') ||
        name.includes('networkerror')
      ) {
        return { type: 'network', retryable: true };
      }

      // Validation errors
      if (
        message.includes('invalid') ||
        message.includes('format') ||
        message.includes('parse') ||
        message.includes('validation') ||
        message.includes('corrupt')
      ) {
        return { type: 'validation', retryable: false };
      }

      // Storage errors
      if (
        message.includes('storage') ||
        message.includes('quota') ||
        message.includes('cache') ||
        message.includes('localstorage')
      ) {
        return { type: 'storage', retryable: false };
      }

      // Size errors
      if (
        message.includes('size') ||
        message.includes('large') ||
        message.includes('limit') ||
        message.includes('bytes')
      ) {
        return { type: 'size', retryable: false };
      }
    }

    // HTTP Response errors
    if (this.isResponseLike(error)) {
      if (error.status >= 500) {
        return { type: 'network', retryable: true };
      } else if (error.status === 413) {
        return { type: 'size', retryable: false };
      } else if (error.status >= 400) {
        return { type: 'network', retryable: false };
      }
    }

    // Default classification
    return { type: defaultType, retryable: true };
  }

  /**
   * Get standardized error message for user display
   */
  private static getStandardErrorMessage(
    type: DictionaryErrorType,
    _originalMessage: string
  ): string {
    switch (type) {
      case 'network':
        return ERROR_MESSAGES.NETWORK_ERROR;
      case 'validation':
        return ERROR_MESSAGES.VALIDATION_ERROR;
      case 'storage':
        return ERROR_MESSAGES.STORAGE_ERROR;
      case 'size':
        return ERROR_MESSAGES.SIZE_ERROR;
      default:
        return ERROR_MESSAGES.GENERIC_ERROR;
    }
  }

  /**
   * Type guard to check if object has Response-like properties
   */
  private static isResponseLike(obj: unknown): obj is { status: number; statusText: string } {
    return (
      obj !== null &&
      typeof obj === 'object' &&
      'status' in obj &&
      typeof (obj as any).status === 'number'
    );
  }

  /**
   * Log error with appropriate level and context
   */
  static logError(error: DictionaryError, context?: Record<string, unknown>): void {
    const logData = {
      type: error.type,
      message: error.message,
      code: error.code,
      retryable: error.retryable,
      details: error.details,
      context
    };

    if (error.retryable) {
      console.warn('Retryable dictionary error:', logData);
    } else {
      console.error('Non-retryable dictionary error:', logData);
    }

    // In production, you might want to send to an error reporting service
    if (import.meta.env.PROD) {
      this.reportError(error, context);
    }
  }

  /**
   * Report error to external service (placeholder implementation)
   */
  private static reportError(error: DictionaryError, context?: Record<string, unknown>): void {
    // Placeholder for error reporting service integration
    // Example: Sentry, LogRocket, or custom analytics
    try {
      // In a real implementation, you might do:
      // errorReportingService.captureException(error, { context });
      console.debug('Error reported to external service:', { error, context });
    } catch (reportingError) {
      console.warn('Failed to report error to external service:', reportingError);
    }
  }

  /**
   * Create user-friendly error message for display
   */
  static getUserFriendlyMessage(error: DictionaryError): string {
    const baseMessage = error.message;
    
    if (error.retryable) {
      return `${baseMessage} Please try again.`;
    }

    switch (error.type) {
      case 'network':
        return `${baseMessage} Please check your internet connection.`;
      case 'storage':
        return `${baseMessage} Please free up some storage space and try again.`;
      case 'size':
        return `${baseMessage} The dictionary file is too large to process.`;
      case 'validation':
        return `${baseMessage} The dictionary file format is not supported.`;
      default:
        return baseMessage;
    }
  }

  /**
   * Get suggested actions for error resolution
   */
  static getSuggestedActions(error: DictionaryError): string[] {
    const actions: string[] = [];

    switch (error.type) {
      case 'network':
        actions.push('Check your internet connection');
        actions.push('Try again in a few moments');
        if (error.retryable) {
          actions.push('The app will automatically retry');
        }
        break;

      case 'storage':
        actions.push('Free up storage space in your browser');
        actions.push('Clear browser cache');
        actions.push('Try using a different browser');
        break;

      case 'size':
        actions.push('Contact support if this problem persists');
        actions.push('The dictionary file may be corrupted');
        break;

      case 'validation':
        actions.push('The dictionary file format may have changed');
        actions.push('Contact support for assistance');
        break;

      default:
        actions.push('Try refreshing the page');
        actions.push('Contact support if the problem persists');
        break;
    }

    return actions;
  }

  /**
   * Check if error should trigger fallback behavior
   */
  static shouldUseFallback(error: DictionaryError): boolean {
    // Use fallback for non-retryable errors or after max retries
    return !error.retryable || error.type === 'network';
  }

  /**
   * Create error for timeout scenarios
   */
  static createTimeoutError(operation: string, timeoutMs: number): DictionaryError {
    return this.createDictionaryError(
      new Error(`Operation timed out after ${timeoutMs}ms`),
      'network',
      operation
    );
  }

  /**
   * Create error for validation failures
   */
  static createValidationError(
    message: string,
    details?: Record<string, unknown>
  ): DictionaryError {
    return {
      type: 'validation',
      message: ERROR_MESSAGES.VALIDATION_ERROR,
      retryable: false,
      details: {
        validationMessage: message,
        timestamp: Date.now(),
        ...details
      }
    };
  }

  /**
   * Create error for storage failures
   */
  static createStorageError(
    operation: string,
    originalError?: unknown
  ): DictionaryError {
    return {
      type: 'storage',
      message: ERROR_MESSAGES.STORAGE_ERROR,
      retryable: false,
      details: {
        operation,
        originalError,
        timestamp: Date.now(),
        availableStorage: this.getStorageInfo()
      }
    };
  }

  /**
   * Get browser storage information for debugging
   */
  private static getStorageInfo(): Record<string, unknown> {
    try {
      const estimate = (navigator as any).storage?.estimate?.();
      return {
        estimate: estimate || 'unavailable',
        localStorage: this.getLocalStorageInfo()
      };
    } catch {
      return { error: 'Storage info unavailable' };
    }
  }

  /**
   * Get localStorage usage information
   */
  private static getLocalStorageInfo(): Record<string, unknown> {
    try {
      let totalSize = 0;
      let itemCount = 0;

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          const value = localStorage.getItem(key);
          totalSize += (key.length + (value?.length || 0)) * 2; // UTF-16
          itemCount++;
        }
      }

      return {
        totalSize,
        itemCount,
        available: true
      };
    } catch {
      return { available: false };
    }
  }
}