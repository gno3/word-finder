/**
 * Enhanced Loading Components
 * Part of Phase 5 Task T023 - Loading states enhancement
 * Improves loading state visual feedback and accessibility across the application
 */

import React from 'react';

/**
 * Enhanced loading spinner with customizable appearance and animations
 */
interface LoadingSpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'dots' | 'pulse' | 'bars' | 'ring';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  className?: string;
  'aria-label'?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  variant = 'default',
  color = 'primary',
  className = '',
  'aria-label': ariaLabel = 'Loading'
}) => {
  // Size mapping for consistent dimensions
  const sizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  // Color mapping for theming
  const colorClasses = {
    primary: 'text-blue-600',
    secondary: 'text-gray-600',
    success: 'text-green-600',
    warning: 'text-yellow-600',
    error: 'text-red-600'
  };

  const sizeClass = sizeClasses[size];
  const colorClass = colorClasses[color];

  // Render different spinner variants
  switch (variant) {
    case 'dots':
      return (
        <div 
          className={`inline-flex space-x-1 ${className}`}
          role="status"
          aria-label={ariaLabel}
        >
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className={`${sizeClass} ${colorClass} bg-current rounded-full animate-pulse`}
              style={{
                animationDelay: `${i * 0.2}s`,
                animationDuration: '1.4s'
              }}
            />
          ))}
          <span className="sr-only">{ariaLabel}</span>
        </div>
      );

    case 'pulse':
      return (
        <div 
          className={`${sizeClass} ${colorClass} ${className}`}
          role="status"
          aria-label={ariaLabel}
        >
          <div className="w-full h-full bg-current rounded-full animate-ping opacity-75" />
          <span className="sr-only">{ariaLabel}</span>
        </div>
      );

    case 'bars':
      return (
        <div 
          className={`inline-flex space-x-1 ${className}`}
          role="status"
          aria-label={ariaLabel}
        >
          {[0, 1, 2, 3].map(i => (
            <div
              key={i}
              className={`w-1 ${sizeClass.split(' ')[1]} ${colorClass} bg-current animate-pulse`}
              style={{
                animationDelay: `${i * 0.15}s`,
                animationDuration: '1.2s'
              }}
            />
          ))}
          <span className="sr-only">{ariaLabel}</span>
        </div>
      );

    case 'ring':
      return (
        <div 
          className={`${sizeClass} ${className}`}
          role="status"
          aria-label={ariaLabel}
        >
          <div 
            className={`animate-spin rounded-full border-2 border-gray-200 ${sizeClass}`}
            style={{
              borderTopColor: 'currentColor'
            }}
          />
          <span className="sr-only">{ariaLabel}</span>
        </div>
      );

    default: // 'default'
      return (
        <div 
          className={`${sizeClass} ${colorClass} ${className}`}
          role="status"
          aria-label={ariaLabel}
        >
          <svg
            className={`animate-spin ${sizeClass}`}
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span className="sr-only">{ariaLabel}</span>
        </div>
      );
  }
};

/**
 * Enhanced loading overlay with backdrop and improved accessibility
 */
interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
  progress?: number;
  variant?: 'fullscreen' | 'container' | 'inline';
  showProgress?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isVisible,
  message = 'Loading...',
  progress,
  variant = 'container',
  showProgress = false,
  className = '',
  children
}) => {
  if (!isVisible) return null;

  const overlayClasses = {
    fullscreen: 'fixed inset-0 z-50 bg-white bg-opacity-95',
    container: 'absolute inset-0 z-10 bg-white bg-opacity-90',
    inline: 'relative bg-white bg-opacity-80'
  };

  return (
    <div 
      className={`${overlayClasses[variant]} flex items-center justify-center ${className}`}
      role="status"
      aria-live="polite"
      aria-label={message}
    >
      <div className="text-center max-w-xs mx-4">
        {children || (
          <>
            <LoadingSpinner size="lg" className="mb-4" />
            <div className="text-lg font-medium text-gray-900 mb-2">
              {message}
            </div>
            
            {showProgress && typeof progress === 'number' && (
              <div className="w-full">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Progress</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                    role="progressbar"
                    aria-valuenow={progress}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  />
                </div>
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Screen reader announcement */}
      <div className="sr-only" aria-live="polite">
        {message}
        {showProgress && typeof progress === 'number' && 
          ` ${Math.round(progress)} percent complete`
        }
      </div>
    </div>
  );
};

/**
 * Enhanced skeleton loader for content placeholders
 */
interface SkeletonLoaderProps {
  variant?: 'text' | 'card' | 'avatar' | 'list' | 'custom';
  lines?: number;
  width?: string | number;
  height?: string | number;
  className?: string;
  animate?: boolean;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  variant = 'text',
  lines = 3,
  width,
  height,
  className = '',
  animate = true
}) => {
  const animationClass = animate ? 'animate-pulse' : '';
  const baseClass = `bg-gray-200 rounded ${animationClass}`;

  const widthStyle = width ? (typeof width === 'number' ? `${width}px` : width) : undefined;
  const heightStyle = height ? (typeof height === 'number' ? `${height}px` : height) : undefined;

  switch (variant) {
    case 'card':
      return (
        <div className={`${baseClass} p-4 space-y-4 ${className}`}>
          <div className="h-32 bg-gray-300 rounded mb-4" />
          <div className="space-y-2">
            <div className="h-4 bg-gray-300 rounded w-3/4" />
            <div className="h-4 bg-gray-300 rounded w-1/2" />
          </div>
        </div>
      );

    case 'avatar':
      return (
        <div className={`flex items-center space-x-4 ${className}`}>
          <div className={`rounded-full bg-gray-300 ${animationClass}`} 
               style={{ width: widthStyle || '40px', height: heightStyle || '40px' }} />
          <div className="space-y-2 flex-1">
            <div className="h-4 bg-gray-300 rounded w-1/2" />
            <div className="h-3 bg-gray-300 rounded w-1/3" />
          </div>
        </div>
      );

    case 'list':
      return (
        <div className={`space-y-3 ${className}`}>
          {Array.from({ length: lines }).map((_, i) => (
            <div key={i} className="flex items-center space-x-3">
              <div className={`w-8 h-8 bg-gray-300 rounded ${animationClass}`} />
              <div className="flex-1 space-y-2">
                <div className={`h-4 bg-gray-300 rounded ${animationClass}`} 
                     style={{ width: `${60 + Math.random() * 30}%` }} />
                <div className={`h-3 bg-gray-300 rounded ${animationClass}`} 
                     style={{ width: `${40 + Math.random() * 20}%` }} />
              </div>
            </div>
          ))}
        </div>
      );

    case 'custom':
      return (
        <div 
          className={`${baseClass} ${className}`}
          style={{ width: widthStyle, height: heightStyle }}
        />
      );

    default: // 'text'
      return (
        <div className={`space-y-2 ${className}`}>
          {Array.from({ length: lines }).map((_, i) => (
            <div
              key={i}
              className={`h-4 ${baseClass}`}
              style={{
                width: i === lines - 1 ? '75%' : `${80 + Math.random() * 20}%`
              }}
            />
          ))}
        </div>
      );
  }
};

/**
 * Enhanced progress indicator with better accessibility and visual feedback
 */
interface ProgressIndicatorProps {
  value: number;
  max?: number;
  label?: string;
  showPercentage?: boolean;
  showLabel?: boolean;
  variant?: 'linear' | 'circular' | 'step';
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'success' | 'warning' | 'error';
  className?: string;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  value,
  max = 100,
  label = 'Progress',
  showPercentage = true,
  showLabel = true,
  variant = 'linear',
  size = 'md',
  color = 'primary',
  className = ''
}) => {
  const percentage = Math.round((value / max) * 100);
  
  const colorClasses = {
    primary: 'bg-blue-600',
    success: 'bg-green-600',
    warning: 'bg-yellow-600',
    error: 'bg-red-600'
  };

  const sizeClasses = {
    linear: {
      sm: 'h-1',
      md: 'h-2',
      lg: 'h-3'
    },
    circular: {
      sm: 'w-8 h-8',
      md: 'w-12 h-12',
      lg: 'w-16 h-16'
    }
  };

  if (variant === 'circular') {
    const radius = 45;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className={`relative ${sizeClasses.circular[size]} ${className}`}>
        <svg
          className="transform -rotate-90 w-full h-full"
          viewBox="0 0 100 100"
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
          aria-label={`${label}: ${percentage}% complete`}
        >
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-gray-200"
          />
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className={colorClasses[color]}
            style={{
              transition: 'stroke-dashoffset 0.5s ease-in-out'
            }}
          />
        </svg>
        {showPercentage && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-semibold">{percentage}%</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`w-full ${className}`}>
      {(showLabel || showPercentage) && (
        <div className="flex justify-between items-center mb-2">
          {showLabel && (
            <span className="text-sm font-medium text-gray-700">{label}</span>
          )}
          {showPercentage && (
            <span className="text-sm text-gray-600">{percentage}%</span>
          )}
        </div>
      )}
      <div className={`w-full bg-gray-200 rounded-full ${sizeClasses.linear[size]}`}>
        <div
          className={`${colorClasses[color]} ${sizeClasses.linear[size]} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
          aria-label={`${label}: ${percentage}% complete`}
        />
      </div>
    </div>
  );
};

/**
 * Enhanced loading button state component
 */
interface LoadingButtonProps {
  isLoading: boolean;
  loadingText?: string;
  children: React.ReactNode;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

export const LoadingButton: React.FC<LoadingButtonProps> = ({
  isLoading,
  loadingText = 'Loading...',
  children,
  disabled,
  variant = 'primary',
  size = 'md',
  className = '',
  onClick,
  type = 'button'
}) => {
  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50'
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm min-h-8',
    md: 'px-4 py-2 text-base min-h-10',
    lg: 'px-6 py-3 text-lg min-h-12'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`
        inline-flex items-center justify-center
        font-medium rounded-lg
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
        disabled:opacity-50 disabled:cursor-not-allowed
        transition-all duration-200
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
      aria-label={isLoading ? loadingText : undefined}
    >
      {isLoading && (
        <LoadingSpinner 
          size={size === 'sm' ? 'xs' : size === 'lg' ? 'sm' : 'xs'} 
          className="mr-2" 
        />
      )}
      <span className={isLoading ? 'opacity-75' : ''}>
        {isLoading ? loadingText : children}
      </span>
    </button>
  );
};

/**
 * Enhanced loading state context for managing global loading states
 */
interface LoadingContextValue {
  isLoading: boolean;
  message: string;
  progress?: number;
  setLoading: (loading: boolean, message?: string, progress?: number) => void;
}

const LoadingContext = React.createContext<LoadingContextValue | undefined>(undefined);

export const LoadingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [message, setMessage] = React.useState('Loading...');
  const [progress, setProgress] = React.useState<number | undefined>();

  const setLoading = React.useCallback((loading: boolean, msg?: string, prog?: number) => {
    setIsLoading(loading);
    if (msg !== undefined) setMessage(msg);
    if (prog !== undefined) setProgress(prog);
  }, []);

  const value = React.useMemo(() => ({
    isLoading,
    message,
    progress,
    setLoading
  }), [isLoading, message, progress, setLoading]);

  return (
    <LoadingContext.Provider value={value}>
      {children}
      <LoadingOverlay
        isVisible={isLoading}
        message={message}
        progress={progress}
        showProgress={progress !== undefined}
        variant="fullscreen"
      />
    </LoadingContext.Provider>
  );
};

/**
 * Hook to use loading context
 */
export const useLoading = () => {
  const context = React.useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};