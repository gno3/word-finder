import React from 'react';
import type { LoadingState, DictionaryError } from '../types/dictionary';

/**
 * Props for DictionaryLoadingIndicator component
 */
interface DictionaryLoadingIndicatorProps {
  loadingState: LoadingState;
  className?: string;
  showProgress?: boolean;
  showDetails?: boolean;
}

/**
 * Loading indicator component for dictionary operations
 * Uses Tailwind CSS for styling as per constitutional requirements
 */
export const DictionaryLoadingIndicator: React.FC<DictionaryLoadingIndicatorProps> = ({
  loadingState,
  className = '',
  showProgress = true,
  showDetails = false
}) => {
  if (loadingState.status === 'idle' || loadingState.status === 'loaded' || loadingState.status === 'cached') {
    return null;
  }

  const isLoading = loadingState.status === 'loading';
  const progress = loadingState.progress || 0;

  return (
    <div className={`dictionary-loading ${className}`}>
      {/* Loading Spinner */}
      {isLoading && (
        <div className="flex items-center justify-center space-x-3">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="text-sm text-gray-600">Loading dictionary...</span>
        </div>
      )}

      {/* Progress Bar */}
      {showProgress && isLoading && progress > 0 && (
        <div className="mt-3">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Details */}
      {showDetails && (
        <div className="mt-2 text-xs text-gray-500">
          {loadingState.retryCount > 0 && (
            <div>Retry attempt: {loadingState.retryCount}</div>
          )}
          {loadingState.lastAttempt > 0 && (
            <div>Last attempt: {new Date(loadingState.lastAttempt).toLocaleTimeString()}</div>
          )}
        </div>
      )}
    </div>
  );
};

/**
 * Props for DictionaryStatus component
 */
interface DictionaryStatusProps {
  loadingState: LoadingState;
  wordCount?: number;
  className?: string;
  variant?: 'compact' | 'detailed';
}

/**
 * Status display component for dictionary state
 */
export const DictionaryStatus: React.FC<DictionaryStatusProps> = ({
  loadingState,
  wordCount,
  className = '',
  variant = 'compact'
}) => {
  const getStatusDisplay = () => {
    switch (loadingState.status) {
      case 'idle':
        return {
          icon: '⏸️',
          text: 'Dictionary not loaded',
          color: 'text-gray-500',
          bgColor: 'bg-gray-100'
        };

      case 'loading':
        return {
          icon: '⏳',
          text: 'Loading dictionary...',
          color: 'text-blue-600',
          bgColor: 'bg-blue-50'
        };

      case 'loaded':
        return {
          icon: '✅',
          text: `Dictionary loaded (${wordCount?.toLocaleString() || 'unknown'} words)`,
          color: 'text-green-600',
          bgColor: 'bg-green-50'
        };

      case 'cached':
        return {
          icon: '📄',
          text: `Using cached dictionary (${wordCount?.toLocaleString() || 'unknown'} words)`,
          color: 'text-blue-600',
          bgColor: 'bg-blue-50'
        };

      case 'error':
        return {
          icon: '❌',
          text: 'Dictionary loading failed',
          color: 'text-red-600',
          bgColor: 'bg-red-50'
        };

      default:
        return {
          icon: '❓',
          text: 'Unknown status',
          color: 'text-gray-500',
          bgColor: 'bg-gray-100'
        };
    }
  };

  const status = getStatusDisplay();

  if (variant === 'compact') {
    return (
      <div className={`inline-flex items-center space-x-2 px-2 py-1 rounded-md ${status.bgColor} ${className}`}>
        <span className="text-sm">{status.icon}</span>
        <span className={`text-sm font-medium ${status.color}`}>
          {loadingState.status === 'loaded' || loadingState.status === 'cached' 
            ? `${wordCount?.toLocaleString() || '0'} words` 
            : status.text}
        </span>
      </div>
    );
  }

  return (
    <div className={`p-3 rounded-lg border ${status.bgColor} ${className}`}>
      <div className="flex items-start space-x-3">
        <span className="text-lg">{status.icon}</span>
        <div className="flex-1">
          <div className={`font-medium ${status.color}`}>
            {status.text}
          </div>
          {loadingState.lastAttempt > 0 && (
            <div className="text-sm text-gray-500 mt-1">
              Last updated: {new Date(loadingState.lastAttempt).toLocaleString()}
            </div>
          )}
          {loadingState.retryCount > 0 && (
            <div className="text-sm text-gray-500">
              Retry attempts: {loadingState.retryCount}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * Props for DictionaryErrorDisplay component
 */
interface DictionaryErrorDisplayProps {
  error: DictionaryError;
  onRetry?: () => void;
  onDismiss?: () => void;
  className?: string;
  showDetails?: boolean;
}

/**
 * Error display component for dictionary failures
 */
export const DictionaryErrorDisplay: React.FC<DictionaryErrorDisplayProps> = ({
  error,
  onRetry,
  onDismiss,
  className = '',
  showDetails = false
}) => {
  const getErrorIcon = (type: DictionaryError['type']) => {
    switch (type) {
      case 'network': return '🌐';
      case 'validation': return '⚠️';
      case 'storage': return '💾';
      case 'size': return '📏';
      default: return '❌';
    }
  };

  const getErrorColor = (type: DictionaryError['type']) => {
    switch (type) {
      case 'network': return 'border-orange-200 bg-orange-50 text-orange-800';
      case 'validation': return 'border-yellow-200 bg-yellow-50 text-yellow-800';
      case 'storage': return 'border-purple-200 bg-purple-50 text-purple-800';
      case 'size': return 'border-red-200 bg-red-50 text-red-800';
      default: return 'border-red-200 bg-red-50 text-red-800';
    }
  };

  return (
    <div className={`rounded-lg border p-4 ${getErrorColor(error.type)} ${className}`}>
      <div className="flex items-start space-x-3">
        <span className="text-lg">{getErrorIcon(error.type)}</span>
        <div className="flex-1">
          <div className="font-medium">
            Dictionary Loading Error
          </div>
          <div className="mt-1 text-sm">
            {error.message}
          </div>
          
          {showDetails && error.details && (
            <div className="mt-2 text-xs opacity-75">
              <div>Error type: {error.type}</div>
              {error.code && <div>Error code: {error.code}</div>}
              {typeof error.details.timestamp === 'number' && (
                <div>
                  Occurred: {new Date(error.details.timestamp).toLocaleString()}
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-3 flex space-x-2">
            {error.retryable && onRetry && (
              <button
                onClick={onRetry}
                className="inline-flex items-center px-3 py-1 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
              >
                Try Again
              </button>
            )}
            {onDismiss && (
              <button
                onClick={onDismiss}
                className="inline-flex items-center px-3 py-1 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 rounded-md transition-colors"
              >
                Dismiss
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Props for DictionaryStartupScreen component
 */
interface DictionaryStartupScreenProps {
  loadingState: LoadingState;
  onRetry?: () => void;
  className?: string;
}

/**
 * Full-screen loading component for initial dictionary loading
 */
export const DictionaryStartupScreen: React.FC<DictionaryStartupScreenProps> = ({
  loadingState,
  onRetry,
  className = ''
}) => {
  const isLoading = loadingState.status === 'loading';
  const hasError = loadingState.status === 'error';
  const progress = loadingState.progress || 0;

  if (loadingState.status === 'loaded' || loadingState.status === 'cached') {
    return null;
  }

  return (
    <div className={`fixed inset-0 bg-white z-50 flex items-center justify-center ${className}`}>
      <div className="max-w-md w-full mx-4">
        <div className="text-center">
          {/* App Icon/Logo placeholder */}
          <div className="w-16 h-16 bg-blue-600 rounded-lg mx-auto mb-6 flex items-center justify-center">
            <span className="text-2xl text-white">📚</span>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Word Finder
          </h1>

          {isLoading && (
            <>
              <p className="text-gray-600 mb-6">
                Loading dictionary for the first time...
              </p>
              
              {/* Large Spinner */}
              <div className="flex justify-center mb-6">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>

              {/* Progress Bar */}
              {progress > 0 && (
                <div className="mb-6">
                  <div className="flex justify-between text-sm text-gray-500 mb-2">
                    <span>Downloading...</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-blue-600 h-3 rounded-full transition-all duration-300 ease-out"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </>
          )}

          {hasError && loadingState.error && (
            <>
              <p className="text-red-600 mb-6">
                Failed to load dictionary
              </p>
              
              <div className="text-left mb-6">
                <DictionaryErrorDisplay 
                  error={loadingState.error}
                  onRetry={onRetry}
                  showDetails={false}
                />
              </div>
            </>
          )}

          {loadingState.status === 'idle' && (
            <p className="text-gray-600">
              Initializing...
            </p>
          )}
        </div>
      </div>
    </div>
  );
};