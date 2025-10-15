import type { DictionaryError, DictionaryEventData } from '../types/dictionary';

/**
 * Error reporting and logging system for dictionary operations
 */
export class DictionaryLogger {
  private static instance: DictionaryLogger | null = null;
  private logs: LogEntry[] = [];
  private maxLogs = 1000;
  private reportingEndpoint: string | null = null;

  private constructor() {}

  static getInstance(): DictionaryLogger {
    if (!DictionaryLogger.instance) {
      DictionaryLogger.instance = new DictionaryLogger();
    }
    return DictionaryLogger.instance;
  }

  /**
   * Configure logging settings
   */
  configure(options: {
    maxLogs?: number;
    reportingEndpoint?: string;
  }): void {
    this.maxLogs = options.maxLogs ?? 1000;
    this.reportingEndpoint = options.reportingEndpoint ?? null;
  }

  /**
   * Log a dictionary error
   */
  logError(error: DictionaryError, context?: Record<string, unknown>): void {
    const entry: LogEntry = {
      id: this.generateId(),
      timestamp: Date.now(),
      level: 'error',
      type: 'dictionary-error',
      message: error.message,
      data: {
        error: {
          type: error.type,
          code: error.code,
          retryable: error.retryable,
          details: error.details
        },
        context,
        userAgent: navigator.userAgent,
        url: window.location.href,
        timestamp: Date.now()
      }
    };

    this.addLog(entry);
    this.reportError(entry);

    // Console logging for development
    if (import.meta.env.DEV) {
      console.error('Dictionary Error:', error, context);
    }
  }

  /**
   * Log a dictionary event
   */
  logEvent(event: DictionaryEventData, context?: Record<string, unknown>): void {
    const entry: LogEntry = {
      id: this.generateId(),
      timestamp: Date.now(),
      level: 'info',
      type: 'dictionary-event',
      message: `Dictionary event: ${event.type}`,
      data: {
        event,
        context,
        userAgent: navigator.userAgent,
        url: window.location.href
      }
    };

    this.addLog(entry);

    // Console logging for development
    if (import.meta.env.DEV) {
      console.info('Dictionary Event:', event, context);
    }
  }

  /**
   * Log performance metrics
   */
  logPerformance(
    operation: string,
    duration: number,
    success: boolean,
    metadata?: Record<string, unknown>
  ): void {
    const entry: LogEntry = {
      id: this.generateId(),
      timestamp: Date.now(),
      level: success ? 'info' : 'warn',
      type: 'performance',
      message: `Dictionary ${operation}: ${duration}ms`,
      data: {
        operation,
        duration,
        success,
        metadata,
        performance: {
          navigation: performance.getEntriesByType('navigation')[0],
          memory: (performance as any).memory
        }
      }
    };

    this.addLog(entry);

    // Console logging for development
    if (import.meta.env.DEV) {
      console.info('Dictionary Performance:', { operation, duration, success, metadata });
    }
  }

  /**
   * Log user interaction
   */
  logUserAction(
    action: string,
    data?: Record<string, unknown>
  ): void {
    const entry: LogEntry = {
      id: this.generateId(),
      timestamp: Date.now(),
      level: 'info',
      type: 'user-action',
      message: `User action: ${action}`,
      data: {
        action,
        ...data,
        sessionId: this.getSessionId(),
        timestamp: Date.now()
      }
    };

    this.addLog(entry);

    // Console logging for development
    if (import.meta.env.DEV) {
      console.info('User Action:', action, data);
    }
  }

  /**
   * Get recent logs
   */
  getLogs(filter?: {
    level?: LogLevel;
    type?: string;
    since?: number;
    limit?: number;
  }): LogEntry[] {
    let filtered = [...this.logs];

    if (filter?.level) {
      filtered = filtered.filter(log => log.level === filter.level);
    }

    if (filter?.type) {
      filtered = filtered.filter(log => log.type === filter.type);
    }

    if (filter?.since) {
      filtered = filtered.filter(log => log.timestamp >= filter.since!);
    }

    if (filter?.limit) {
      filtered = filtered.slice(-filter.limit);
    }

    return filtered.sort((a, b) => b.timestamp - a.timestamp);
  }

  /**
   * Export logs for debugging
   */
  exportLogs(): string {
    return JSON.stringify({
      exportDate: new Date().toISOString(),
      logs: this.logs,
      system: {
        userAgent: navigator.userAgent,
        url: window.location.href,
        timestamp: Date.now(),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      }
    }, null, 2);
  }

  /**
   * Clear all logs
   */
  clearLogs(): void {
    this.logs = [];
    if (import.meta.env.DEV) {
      console.info('Dictionary logs cleared');
    }
  }

  /**
   * Get logging statistics
   */
  getStats(): {
    totalLogs: number;
    errorCount: number;
    warningCount: number;
    performanceIssues: number;
    oldestLog?: number;
    newestLog?: number;
  } {
    const stats = {
      totalLogs: this.logs.length,
      errorCount: this.logs.filter(log => log.level === 'error').length,
      warningCount: this.logs.filter(log => log.level === 'warn').length,
      performanceIssues: this.logs.filter(log => 
        log.type === 'performance' && 
        typeof log.data?.duration === 'number' && 
        log.data.duration > 5000
      ).length,
      oldestLog: this.logs.length > 0 ? Math.min(...this.logs.map(log => log.timestamp)) : undefined,
      newestLog: this.logs.length > 0 ? Math.max(...this.logs.map(log => log.timestamp)) : undefined
    };

    return stats;
  }

  /**
   * Add log entry with rotation
   */
  private addLog(entry: LogEntry): void {
    this.logs.push(entry);

    // Rotate logs if we exceed max
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }
  }

  /**
   * Report error to external service
   */
  private async reportError(entry: LogEntry): Promise<void> {
    if (!this.reportingEndpoint || entry.level !== 'error') {
      return;
    }

    try {
      await fetch(this.reportingEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          timestamp: entry.timestamp,
          error: entry.data?.error,
          context: entry.data?.context,
          userAgent: navigator.userAgent,
          url: window.location.href,
          sessionId: this.getSessionId()
        })
      });
    } catch (error) {
      // Silently fail error reporting to avoid infinite loops
      if (import.meta.env.DEV) {
        console.warn('Failed to report error:', error);
      }
    }
  }

  /**
   * Generate unique ID for log entries
   */
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get or create session ID
   */
  private getSessionId(): string {
    const key = 'word-finder-session';
    let sessionId = sessionStorage.getItem(key);
    
    if (!sessionId) {
      sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem(key, sessionId);
    }
    
    return sessionId;
  }
}

/**
 * Log entry interface
 */
interface LogEntry {
  id: string;
  timestamp: number;
  level: LogLevel;
  type: string;
  message: string;
  data?: Record<string, unknown>;
}

/**
 * Log levels
 */
type LogLevel = 'error' | 'warn' | 'info' | 'debug';

/**
 * Convenience functions for common logging operations
 */
export const DictionaryLogging = {
  /**
   * Log dictionary error
   */
  error: (error: DictionaryError, context?: Record<string, unknown>) => {
    DictionaryLogger.getInstance().logError(error, context);
  },

  /**
   * Log dictionary event
   */
  event: (event: DictionaryEventData, context?: Record<string, unknown>) => {
    DictionaryLogger.getInstance().logEvent(event, context);
  },

  /**
   * Log performance metric
   */
  performance: (operation: string, duration: number, success: boolean, metadata?: Record<string, unknown>) => {
    DictionaryLogger.getInstance().logPerformance(operation, duration, success, metadata);
  },

  /**
   * Log user action
   */
  userAction: (action: string, data?: Record<string, unknown>) => {
    DictionaryLogger.getInstance().logUserAction(action, data);
  },

  /**
   * Configure logging
   */
  configure: (options: { maxLogs?: number; reportingEndpoint?: string }) => {
    DictionaryLogger.getInstance().configure(options);
  },

  /**
   * Get logger instance
   */
  getInstance: () => DictionaryLogger.getInstance()
};