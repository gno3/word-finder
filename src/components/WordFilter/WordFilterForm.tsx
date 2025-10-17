import React, { useState, useCallback, useMemo } from 'react';
import type { Segment } from '../../types/wordFilter.js';
import { SegmentInput } from './SegmentInput.js';
import { isCollectionValid, validateSegmentCount } from '../../utils/segmentValidation.js';
import { useViewport } from '../../hooks/useViewport.js';
import { TOUCH_TARGET_PATTERNS } from '../../utils/touchTargets.js';
import { ResetButton } from './ResetButton.js';
import { ResetConfirmationDialog, useConfirmationDialog } from './ResetConfirmationDialog.js';
import { LoadingButton } from '../EnhancedLoadingComponents.js';
import { COMPONENT_SPACING } from '../../utils/spacingSystem.js';
import { COMPONENT_TYPOGRAPHY } from '../../utils/typographySystem.js';
import { COMPONENT_FOCUS } from '../../utils/focusSystem.js';
import { SCREEN_READER_TEXT } from '../../utils/ariaSystem.js';

interface WordFilterFormProps {
  /** Called when user initiates filtering with current segments */
  onFilter: (segments: Segment[]) => void;
  /** Whether filtering is currently in progress */
  isLoading: boolean;
  /** Whether the filter button should be disabled */
  disabled?: boolean;
  /** Validation errors by segment index */
  validationErrors?: Record<number, string>;
  /** Callback for reset operations */
  onReset?: () => void;
  /** Whether reset button should be disabled */
  resetDisabled?: boolean;
  /** Enable mobile-optimized layout */
  mobileOptimized?: boolean;
}

/**
 * Form component for managing word filter segments and initiating filtering
 */
export const WordFilterForm: React.FC<WordFilterFormProps> = ({
  onFilter,
  isLoading,
  disabled = false,
  validationErrors = {},
  onReset,
  resetDisabled = false,
  mobileOptimized = true
}) => {
  const { isMobile, touchSupport } = useViewport();
  const { isOpen, openDialog, closeDialog, confirmAction } = useConfirmationDialog();
  // Initialize with one empty segment
  const [segments, setSegments] = useState<Segment[]>([
    {
      availableLetters: '',
      targetLength: 3
    }
  ]);

  // Reset form to initial state
  const handleFormReset = useCallback(() => {
    setSegments([{
      availableLetters: '',
      targetLength: 3
    }]);
    
    // Call parent reset handler if provided
    if (onReset) {
      onReset();
    }
  }, [onReset]);

  // Handle reset button click with confirmation
  const handleResetClick = useCallback(() => {
    if (segments.length === 1 && segments[0].availableLetters === '' && segments[0].targetLength === 3) {
      // Already in initial state, no need for confirmation
      return;
    }
    
    openDialog(handleFormReset);
  }, [segments, openDialog, handleFormReset]);

  const handleSegmentChange = useCallback((index: number, newSegment: Segment) => {
    setSegments(prev => {
      const updated = [...prev];
      updated[index] = newSegment;
      return updated;
    });
  }, []);

  const handleAddSegment = useCallback(() => {
    setSegments(prev => [
      ...prev,
      {
        availableLetters: '',
        targetLength: 3
      }
    ]);
  }, []);

  const handleRemoveSegment = useCallback((index: number) => {
    setSegments(prev => prev.filter((_, i) => i !== index));
  }, []);

  const canRemoveSegment = segments.length > 1;
  const canAddSegment = segments.length < 6; // Max 6 segments per specification

  // Use validation utilities for comprehensive form validation
  const isFormValid = useMemo(() => {
    // Check segment count constraints
    const countError = validateSegmentCount(segments.length);
    if (countError) return false;
    
    // Use collection validation from utilities
    return isCollectionValid(segments);
  }, [segments]);

  const handleSubmit = useCallback((event: React.FormEvent) => {
    event.preventDefault();
    
    // Comprehensive validation using utilities
    if (isFormValid && !disabled && !isLoading) {
      onFilter(segments);
    }
  }, [segments, onFilter, disabled, isLoading, isFormValid]);

  // Apply consistent spacing system from T024
  const formSpacing = COMPONENT_SPACING.wordFilterForm.sectionSpacing;
  const segmentSpacing = COMPONENT_SPACING.wordFilterForm.segmentSpacing;
  
  // Responsive classes using design system and enhanced typography
  const formClasses = `space-y-4 sm:space-y-6`;
  const headerClasses = isMobile 
    ? "flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between" 
    : "flex items-center justify-between";
  
  // Enhanced typography hierarchy
  const titleClasses = COMPONENT_TYPOGRAPHY.wordFilterForm.sectionTitle;
  const counterClasses = COMPONENT_TYPOGRAPHY.wordFilterForm.segmentCounter;
  const addButtonTextClasses = COMPONENT_TYPOGRAPHY.wordFilterForm.addButton;
  const helpTextClasses = COMPONENT_TYPOGRAPHY.wordFilterForm.helpText;
  
  // Touch-optimized button classes with enhanced focus indicators
  const addButtonClasses = touchSupport && mobileOptimized
    ? `${TOUCH_TARGET_PATTERNS.BUTTON} w-full border-2 border-dashed border-slate-300 rounded-xl text-slate-600 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50/50 ${COMPONENT_FOCUS.button.ghost} transition-all duration-200 group`
    : `w-full py-4 px-6 border-2 border-dashed border-slate-300 rounded-xl text-slate-600 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50/50 ${COMPONENT_FOCUS.button.ghost} transition-all duration-200 group`;

  return (
    <form 
      onSubmit={handleSubmit} 
      className={formClasses}
      role="form"
      aria-labelledby="form-heading"
      aria-describedby="form-description"
    >
      <div className={formSpacing}>
        <div className={headerClasses}>
          <h2 id="form-heading" className={`${titleClasses} flex items-center`}>
            <svg className="w-6 h-6 mr-2 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            Configure Segments
          </h2>
          <div className="bg-slate-100 px-3 py-1 rounded-full" role="status" aria-live="polite">
            <span className={`${counterClasses} text-slate-700`}>
              {segments.length} of 6 segments
            </span>
          </div>
        </div>

        <p id="form-description" className={`${helpTextClasses} text-slate-600 mb-4`}>
          {SCREEN_READER_TEXT.wordFilter.segmentLabel}. Create up to 6 segments with different letter combinations and lengths.
        </p>

        <fieldset className={segmentSpacing}>
          <legend className="sr-only">Segment configurations</legend>
          {segments.map((segment, index) => (
            <SegmentInput
              key={index}
              segment={segment}
              onChange={(newSegment) => handleSegmentChange(index, newSegment)}
              onRemove={() => handleRemoveSegment(index)}
              index={index}
              canRemove={canRemoveSegment}
              error={validationErrors[index]}
              mobileOptimized={mobileOptimized}
              touchOptimized={touchSupport}
            />
          ))}
        </fieldset>

        {/* Add Segment Button */}
        {canAddSegment && (
          <button
            type="button"
            onClick={handleAddSegment}
            className={addButtonClasses}
            aria-describedby="add-segment-help"
          >
            <div className="flex items-center justify-center space-x-2">
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
              </svg>
              <span className={`${addButtonTextClasses}`}>Add Another Segment</span>
            </div>
          </button>
        )}
        <p id="add-segment-help" className="sr-only">
          {SCREEN_READER_TEXT.wordFilter.addSegment}. You can have up to 6 segments total.
        </p>
      </div>

      {/* Form Status */}
      {!isFormValid && segments.some(seg => seg.availableLetters.length > 0 || seg.targetLength > 0) && (
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 p-4 rounded-xl">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-amber-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
            </svg>
            <div>
              <div className="font-semibold text-amber-800 mb-1">
                Complete all segments to enable filtering
              </div>
              <div className={`${helpTextClasses} text-amber-700`}>
                Each segment needs valid letters (a-z only) and length (1-15).
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <div className="flex justify-center">
        <LoadingButton
          type="submit"
          isLoading={isLoading}
          loadingText="Filtering Words..."
          disabled={disabled || !isFormValid}
          variant="primary"
          size={isMobile ? "md" : "md"}
          className={isMobile ? "w-full" : "px-8 text-base font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none disabled:hover:scale-100"}
        >
          <span className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            Filter Words
          </span>
        </LoadingButton>
      </div>

      {/* Reset Button - Positioned at bottom of segment form area */}
      <div className="border-t border-slate-200 pt-4 mt-2">
        <div className="flex justify-center">
          <ResetButton
            onReset={handleResetClick}
            disabled={resetDisabled || isLoading}
            variant="secondary"
            size={isMobile ? "medium" : "medium"}
            className={`${isMobile ? "w-full max-w-xs" : "px-6"} text-sm`}
            showIcon={true}
          >
            Reset All Segments
          </ResetButton>
        </div>
        <p className={`${helpTextClasses} text-slate-500 text-center mt-2`}>
          Clear all segments and start over
        </p>
      </div>

      {/* Reset Confirmation Dialog */}
      <ResetConfirmationDialog
        isOpen={isOpen}
        onConfirm={confirmAction}
        onCancel={closeDialog}
        title="Reset Form"
        message="Are you sure you want to reset all segments? This will clear all current input and cannot be undone."
        confirmText="Reset"
        cancelText="Cancel"
        variant="warning"
      />
    </form>
  );
};

export default WordFilterForm;