import React, { useState, useEffect } from 'react';
import type { DictionaryError } from '../types/dictionary';

/**
 * Props for Toast notification component
 */
interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onDismiss?: () => void;
  className?: string;
}

/**
 * Toast notification component for user feedback
 */
export const Toast: React.FC<ToastProps> = ({
  message,
  type,
  duration = 5000,
  onDismiss,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => onDismiss?.(), 300); // Allow fade out animation
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onDismiss]);

  const getToastStyles = () => {
    const baseStyles = 'fixed top-4 right-4 max-w-sm w-full bg-white rounded-lg shadow-lg border-l-4 p-4 transition-all duration-300 ease-in-out z-50';
    
    const typeStyles = {
      success: 'border-green-500 text-green-800',
      error: 'border-red-500 text-red-800',
      warning: 'border-yellow-500 text-yellow-800',
      info: 'border-blue-500 text-blue-800'
    };

    const visibilityStyles = isVisible 
      ? 'translate-x-0 opacity-100' 
      : 'translate-x-full opacity-0';

    return `${baseStyles} ${typeStyles[type]} ${visibilityStyles} ${className}`;
  };

  const getIcon = () => {
    switch (type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
    }
  };

  return (
    <div className={getToastStyles()}>
      <div className="flex items-start">
        <span className="flex-shrink-0 text-lg mr-3">
          {getIcon()}
        </span>
        <div className="flex-1">
          <p className="text-sm font-medium">
            {message}
          </p>
        </div>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(() => onDismiss?.(), 300);
          }}
          className="flex-shrink-0 ml-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <span className="sr-only">Close</span>
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

/**
 * Toast manager for handling multiple notifications
 */
export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

interface ToastManagerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastManager: React.FC<ToastManagerProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed top-0 right-0 z-50 p-4 space-y-3">
      {toasts.map((toast, index) => (
        <div
          key={toast.id}
          style={{ 
            transform: `translateY(${index * 80}px)`,
            zIndex: 50 - index 
          }}
        >
          <Toast
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onDismiss={() => onDismiss(toast.id)}
            className="transition-all duration-300 ease-in-out"
          />
        </div>
      ))}
    </div>
  );
};

/**
 * Props for DictionaryFeedback component
 */
interface DictionaryFeedbackProps {
  type: 'loading-started' | 'loading-completed' | 'cache-loaded' | 'error' | 'retry';
  error?: DictionaryError;
  wordCount?: number;
  onAction?: (action: 'retry' | 'dismiss') => void;
  className?: string;
}

/**
 * Specialized feedback component for dictionary operations
 */
export const DictionaryFeedback: React.FC<DictionaryFeedbackProps> = ({
  type,
  error,
  wordCount,
  onAction,
  className = ''
}) => {
  const getFeedbackContent = () => {
    switch (type) {
      case 'loading-started':
        return {
          type: 'info' as const,
          message: 'Downloading dictionary...',
          duration: 3000
        };

      case 'loading-completed':
        return {
          type: 'success' as const,
          message: `Dictionary loaded successfully! ${wordCount?.toLocaleString() || 'Ready'} words available.`,
          duration: 4000
        };

      case 'cache-loaded':
        return {
          type: 'info' as const,
          message: `Using cached dictionary with ${wordCount?.toLocaleString() || 'unknown'} words.`,
          duration: 3000
        };

      case 'error':
        return {
          type: 'error' as const,
          message: error?.message || 'Dictionary loading failed',
          duration: 0 // Persist until dismissed
        };

      case 'retry':
        return {
          type: 'warning' as const,
          message: 'Retrying dictionary download...',
          duration: 3000
        };

      default:
        return {
          type: 'info' as const,
          message: 'Dictionary status updated',
          duration: 3000
        };
    }
  };

  const content = getFeedbackContent();

  if (type === 'error' && error) {
    return (
      <div className={`fixed bottom-4 right-4 max-w-md w-full bg-white rounded-lg shadow-lg border border-red-200 p-4 ${className}`}>
        <div className="flex items-start space-x-3">
          <span className="text-lg">❌</span>
          <div className="flex-1">
            <div className="font-medium text-red-800">
              Dictionary Error
            </div>
            <div className="text-sm text-red-700 mt-1">
              {error.message}
            </div>
            <div className="mt-3 flex space-x-2">
              {error.retryable && onAction && (
                <button
                  onClick={() => onAction('retry')}
                  className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                >
                  Retry
                </button>
              )}
              <button
                onClick={() => onAction?.('dismiss')}
                className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Toast
      message={content.message}
      type={content.type}
      duration={content.duration}
      onDismiss={() => onAction?.('dismiss')}
      className={className}
    />
  );
};

/**
 * Props for DictionaryStatsCard component
 */
interface DictionaryStatsCardProps {
  wordCount: number;
  lastUpdated: number;
  cacheSize: number;
  source: string;
  onRefresh?: () => void;
  className?: string;
}

/**
 * Statistics card component for dictionary information
 */
export const DictionaryStatsCard: React.FC<DictionaryStatsCardProps> = ({
  wordCount,
  lastUpdated,
  cacheSize,
  source,
  onRefresh,
  className = ''
}) => {
  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getTimeSince = (timestamp: number): string => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">
          Dictionary Statistics
        </h3>
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="text-blue-600 hover:text-blue-800 transition-colors"
            title="Refresh dictionary"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Words:</span>
          <span className="text-sm font-medium">{wordCount.toLocaleString()}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Cache size:</span>
          <span className="text-sm font-medium">{formatBytes(cacheSize)}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Last updated:</span>
          <span className="text-sm font-medium">{getTimeSince(lastUpdated)}</span>
        </div>

        <div className="pt-2 border-t border-gray-100">
          <div className="text-xs text-gray-500">
            Source: {new URL(source).hostname}
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Props for ProgressCard component
 */
interface ProgressCardProps {
  title: string;
  progress: number;
  message?: string;
  showPercentage?: boolean;
  color?: 'blue' | 'green' | 'yellow' | 'red';
  className?: string;
}

/**
 * Progress card component for long-running operations
 */
export const ProgressCard: React.FC<ProgressCardProps> = ({
  title,
  progress,
  message,
  showPercentage = true,
  color = 'blue',
  className = ''
}) => {
  const colorClasses = {
    blue: 'bg-blue-600',
    green: 'bg-green-600',
    yellow: 'bg-yellow-600',
    red: 'bg-red-600'
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-4 ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-medium text-gray-900">{title}</h4>
        {showPercentage && (
          <span className="text-sm text-gray-600">{Math.round(progress)}%</span>
        )}
      </div>

      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
        <div 
          className={`h-2 rounded-full transition-all duration-300 ease-out ${colorClasses[color]}`}
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        ></div>
      </div>

      {message && (
        <p className="text-xs text-gray-600">{message}</p>
      )}
    </div>
  );
};