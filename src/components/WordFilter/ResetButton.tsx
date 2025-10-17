/**
 * Reset button component with loading states and mobile optimization
 * Part of User Story 2 - Quick Reset and Start Over functionality
 */

import React from 'react';
import { useViewport } from '../../hooks/useViewport.js';
import { useAccessibleTypography } from '../../hooks/useAccessibleTypography.js';
import { TOUCH_TARGET_PATTERNS } from '../../utils/touchTargets.js';
import { COMPONENT_FOCUS } from '../../utils/focusSystem.js';

export interface ResetButtonProps {
  onReset: () => void | Promise<void>;
  disabled?: boolean;
  isLoading?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  showIcon?: boolean;
  children?: React.ReactNode;
  className?: string;
  'aria-label'?: string;
}

/**
 * Accessible reset button with mobile optimization and loading states
 */
export const ResetButton: React.FC<ResetButtonProps> = ({
  onReset,
  disabled = false,
  isLoading = false,
  variant = 'secondary',
  size = 'medium',
  showIcon = true,
  children,
  className = '',
  'aria-label': ariaLabel,
}) => {
  const { isMobile, touchSupport } = useViewport();
  const { typographyClasses } = useAccessibleTypography({
    role: size === 'large' ? 'button-large' : 'button'
  });

  const handleClick = async () => {
    if (disabled || isLoading) return;
    
    try {
      await onReset();
    } catch (error) {
      console.error('Reset operation failed:', error);
    }
  };

  // Base classes for all variants with enhanced focus
  const baseClasses = [
    'inline-flex items-center justify-center',
    'font-medium rounded-lg',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    'transition-all duration-200',
    typographyClasses
  ];

  // Touch target classes for mobile accessibility
  const touchClasses = (touchSupport && isMobile) 
    ? TOUCH_TARGET_PATTERNS.BUTTON 
    : '';

  // Size-specific classes
  const sizeClasses = (() => {
    if (touchSupport && isMobile) {
      // Mobile touch targets (44px minimum)
      switch (size) {
        case 'small': return 'px-3 py-2 min-h-11';
        case 'large': return 'px-6 py-3 min-h-12';
        default: return 'px-4 py-2.5 min-h-11';
      }
    } else {
      // Desktop sizes
      switch (size) {
        case 'small': return 'px-3 py-1.5 text-sm';
        case 'large': return 'px-6 py-3 text-lg';
        default: return 'px-4 py-2';
      }
    }
  })();

  // Variant-specific classes with enhanced focus indicators
  const variantClasses = (() => {
    switch (variant) {
      case 'primary':
        return `bg-blue-600 text-white hover:bg-blue-700 ${COMPONENT_FOCUS.button.primary}`;
      case 'danger':
        return `bg-red-600 text-white hover:bg-red-700 ${COMPONENT_FOCUS.button.danger}`;
      default: // secondary
        return `bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 ${COMPONENT_FOCUS.button.secondary}`;
    }
  })();

  // Combine all classes
  const buttonClasses = [
    ...baseClasses,
    touchClasses,
    sizeClasses,
    variantClasses,
    className
  ].filter(Boolean).join(' ');

  // Icon component
  const ResetIcon = () => (
    <svg 
      className={`${children ? 'mr-2' : ''} ${size === 'small' ? 'h-4 w-4' : 'h-5 w-5'}`}
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
      aria-hidden="true"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2} 
        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
      />
    </svg>
  );

  // Loading spinner component
  const LoadingSpinner = () => (
    <svg 
      className={`animate-spin ${children ? 'mr-2' : ''} ${size === 'small' ? 'h-4 w-4' : 'h-5 w-5'}`}
      fill="none" 
      viewBox="0 0 24 24"
      aria-hidden="true"
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
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  const defaultAriaLabel = isLoading 
    ? 'Resetting form...' 
    : 'Reset form and clear all data';

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled || isLoading}
      className={buttonClasses}
      aria-label={ariaLabel || defaultAriaLabel}
      aria-describedby={children ? undefined : 'reset-button-description'}
    >
      {isLoading ? (
        <LoadingSpinner />
      ) : showIcon ? (
        <ResetIcon />
      ) : null}
      
      {children && (
        <span className={isLoading ? 'opacity-75' : ''}>
          {children}
        </span>
      )}
      
      {!children && (
        <span className="sr-only">
          {isLoading ? 'Resetting...' : 'Reset'}
        </span>
      )}
    </button>
  );
};

/**
 * Preset reset button configurations for common use cases
 */
export const ResetButtonPresets = {
  /**
   * Standard reset button for forms
   */
  FormReset: (props: Pick<ResetButtonProps, 'onReset' | 'disabled' | 'isLoading'>) => (
    <ResetButton
      {...props}
      variant="secondary"
      size="medium"
      aria-label="Reset form to initial state"
    >
      Reset
    </ResetButton>
  ),

  /**
   * Danger-styled reset for destructive actions
   */
  ClearAll: (props: Pick<ResetButtonProps, 'onReset' | 'disabled' | 'isLoading'>) => (
    <ResetButton
      {...props}
      variant="danger"
      size="medium"
      aria-label="Clear all data - this action cannot be undone"
    >
      Clear All
    </ResetButton>
  ),

  /**
   * Compact reset button for mobile interfaces
   */
  CompactReset: (props: Pick<ResetButtonProps, 'onReset' | 'disabled' | 'isLoading'>) => (
    <ResetButton
      {...props}
      variant="secondary"
      size="small"
      showIcon={true}
      aria-label="Reset form"
    />
  ),

  /**
   * Large reset button for prominent placement
   */
  PrimaryReset: (props: Pick<ResetButtonProps, 'onReset' | 'disabled' | 'isLoading'>) => (
    <ResetButton
      {...props}
      variant="primary"
      size="large"
      aria-label="Start over - reset all segments and results"
    >
      Start Over
    </ResetButton>
  ),
};