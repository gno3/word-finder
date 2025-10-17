/**
 * Reset confirmation dialog component
 * Part of User Story 2 - Quick Reset and Start Over functionality
 */

import React, { useEffect, useRef } from 'react';
import { useViewport } from '../../hooks/useViewport.js';
import { useAccessibleTypography } from '../../hooks/useAccessibleTypography.js';
import { TOUCH_TARGET_PATTERNS } from '../../utils/touchTargets.js';

export interface ResetConfirmationDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'warning' | 'danger';
  isLoading?: boolean;
}

/**
 * Accessible confirmation dialog for reset operations
 */
export const ResetConfirmationDialog: React.FC<ResetConfirmationDialogProps> = ({
  isOpen,
  onConfirm,
  onCancel,
  title = 'Reset Form',
  message = 'Are you sure you want to reset all segments and clear results? This action cannot be undone.',
  confirmText = 'Reset',
  cancelText = 'Cancel',
  variant = 'warning',
  isLoading = false,
}) => {
  const { isMobile, touchSupport } = useViewport();
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const { typographyClasses: titleClasses } = useAccessibleTypography({ role: 'heading-medium' });
  const { typographyClasses: bodyClasses } = useAccessibleTypography({ role: 'body' });
  const { typographyClasses: buttonClasses } = useAccessibleTypography({ role: 'button' });

  // Focus management
  useEffect(() => {
    if (isOpen && cancelButtonRef.current) {
      cancelButtonRef.current.focus();
    }
  }, [isOpen]);

  // Escape key handler
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onCancel();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onCancel]);

  // Prevent body scroll when dialog is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  // Touch-optimized button classes
  const touchButtonBase = touchSupport && isMobile ? TOUCH_TARGET_PATTERNS.BUTTON : '';
  
  const buttonSizeClasses = isMobile 
    ? 'px-4 py-3 min-h-11' 
    : 'px-6 py-2.5';

  // Variant-specific colors
  const iconColor = variant === 'danger' ? 'text-red-600' : 'text-amber-600';
  const confirmButtonClasses = variant === 'danger'
    ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
    : 'bg-amber-600 hover:bg-amber-700 focus:ring-amber-500';

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={handleBackdropClick}
        aria-hidden="true"
      />
      
      {/* Dialog */}
      <div className={`
        relative bg-white rounded-xl shadow-xl max-w-md w-full mx-auto
        ${isMobile ? 'p-4' : 'p-6'}
        transform transition-all duration-200
      `}>
        {/* Header */}
        <div className="flex items-start">
          <div className={`
            flex-shrink-0 mx-auto flex items-center justify-center 
            ${isMobile ? 'h-10 w-10' : 'h-12 w-12'}
            rounded-full ${variant === 'danger' ? 'bg-red-100' : 'bg-amber-100'}
          `}>
            {variant === 'danger' ? (
              <svg className={`${isMobile ? 'h-5 w-5' : 'h-6 w-6'} ${iconColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            ) : (
              <svg className={`${isMobile ? 'h-5 w-5' : 'h-6 w-6'} ${iconColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </div>
        </div>

        {/* Content */}
        <div className={`${isMobile ? 'mt-3' : 'mt-5'} text-center`}>
          <h3 
            id="dialog-title"
            className={`${titleClasses} font-semibold text-gray-900`}
          >
            {title}
          </h3>
          <div className={`${isMobile ? 'mt-2' : 'mt-3'}`}>
            <p 
              id="dialog-description"
              className={`${bodyClasses} text-gray-600`}
            >
              {message}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className={`
          ${isMobile ? 'mt-4 flex flex-col gap-3' : 'mt-6 flex flex-row-reverse gap-3'}
        `}>
          {/* Confirm Button */}
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`
              ${touchButtonBase}
              ${buttonSizeClasses}
              ${buttonClasses}
              ${confirmButtonClasses}
              text-white font-medium rounded-lg
              focus:outline-none focus:ring-2 focus:ring-offset-2
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-200
              ${isMobile ? 'w-full' : 'min-w-[100px]'}
            `}
            aria-describedby="confirm-button-description"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Resetting...
              </div>
            ) : (
              confirmText
            )}
          </button>

          {/* Cancel Button */}
          <button
            ref={cancelButtonRef}
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className={`
              ${touchButtonBase}
              ${buttonSizeClasses}
              ${buttonClasses}
              bg-white text-gray-700 border border-gray-300 
              hover:bg-gray-50 focus:ring-gray-500
              font-medium rounded-lg
              focus:outline-none focus:ring-2 focus:ring-offset-2
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-200
              ${isMobile ? 'w-full' : 'min-w-[100px]'}
            `}
          >
            {cancelText}
          </button>
        </div>

        {/* Hidden descriptions for screen readers */}
        <div className="sr-only">
          <div id="confirm-button-description">
            This will permanently {confirmText.toLowerCase()} all form data
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Hook for managing confirmation dialog state
 */
export const useConfirmationDialog = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [pendingAction, setPendingAction] = React.useState<(() => void) | null>(null);

  const openDialog = React.useCallback((action: () => void) => {
    setPendingAction(() => action);
    setIsOpen(true);
  }, []);

  const closeDialog = React.useCallback(() => {
    setIsOpen(false);
    setPendingAction(null);
  }, []);

  const confirmAction = React.useCallback(() => {
    if (pendingAction) {
      pendingAction();
    }
    closeDialog();
  }, [pendingAction, closeDialog]);

  return {
    isOpen,
    openDialog,
    closeDialog,
    confirmAction,
  };
};