import React, { useState, useCallback } from 'react';
import type { Segment } from '../../types/wordFilter.js';
import { validateAvailableLetters, validateTargetLength, normalizeLetters } from '../../utils/segmentValidation.js';
import { useViewport } from '../../hooks/useViewport.js';
import { TOUCH_TARGET_PATTERNS } from '../../utils/touchTargets.js';
import { COMPONENT_TYPOGRAPHY } from '../../utils/typographySystem.js';
import { COMPONENT_FOCUS } from '../../utils/focusSystem.js';
import { SCREEN_READER_TEXT } from '../../utils/ariaSystem.js';

interface SegmentInputProps {
  /** Current segment configuration */
  segment: Segment;
  /** Called when segment configuration changes */
  onChange: (segment: Segment) => void;
  /** Called when segment should be removed */
  onRemove: () => void;
  /** Display index for user-friendly labeling */
  index: number;
  /** Whether the remove button should be disabled */
  canRemove: boolean;
  /** Any validation errors for this segment */
  error?: string;
  /** Enable mobile-optimized layout */
  mobileOptimized?: boolean;
  /** Enable touch-optimized interactions */
  touchOptimized?: boolean;
}

/**
 * Component for configuring individual word filter segments
 * Allows users to set target length and available letters for each segment
 */
export const SegmentInput: React.FC<SegmentInputProps> = ({
  segment,
  onChange,
  onRemove,
  index,
  canRemove,
  error,
  mobileOptimized = true,
  touchOptimized = true
}) => {
  const { isMobile, isTablet, touchSupport } = useViewport();
  const [lettersError, setLettersError] = useState<string>('');
  const [lengthError, setLengthError] = useState<string>('');
  const [lengthVsLettersError, setLengthVsLettersError] = useState<string>('');

  // Validate that target length doesn't exceed available letters
  const validateLengthVsLetters = useCallback((targetLength: number, availableLetters: string) => {
    if (targetLength > 0 && availableLetters.length > 0 && targetLength > availableLetters.length) {
      setLengthVsLettersError(`Target length (${targetLength}) cannot be greater than available letters (${availableLetters.length})`);
    } else {
      setLengthVsLettersError('');
    }
  }, []);

  const handleLengthChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = event.target.value;
    const newLength = parseInt(rawValue, 10);
    
    // Real-time validation
    const validationError = validateTargetLength(newLength);
    setLengthError(validationError?.message || '');
    
    // Validate target length vs available letters
    validateLengthVsLetters(isNaN(newLength) ? 0 : newLength, segment.availableLetters);
    
    // Update segment even if invalid (for real-time feedback)
    onChange({
      ...segment,
      targetLength: isNaN(newLength) ? 0 : newLength
    });
  }, [segment, onChange, validateLengthVsLetters]);

  const handleLettersChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const rawInput = event.target.value;
    
    // Real-time validation on raw input
    const validationError = validateAvailableLetters(rawInput);
    setLettersError(validationError?.message || '');
    
    // Normalize input (case normalization)
    const normalizedLetters = normalizeLetters(rawInput);
    
    // Validate target length vs available letters
    validateLengthVsLetters(segment.targetLength, normalizedLetters);
    
    onChange({
      ...segment,
      availableLetters: normalizedLetters
    });
  }, [segment, onChange, validateLengthVsLetters]);

  const formatLettersForInput = (letters: string): string => {
    return letters;
  };

  // Responsive layout classes based on viewport
  const containerClasses = isMobile 
    ? "card-modern p-3 hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500" 
    : "card-modern p-6 hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500";

  const headerClasses = isMobile 
    ? "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3" 
    : "flex items-center justify-between mb-5";

  const titleClasses = isMobile 
    ? "text-base font-bold text-slate-900 flex items-center" 
    : "text-lg font-bold text-slate-900 flex items-center";

  const gridClasses = isMobile 
    ? "flex flex-col gap-3" 
    : isTablet 
      ? "grid grid-cols-1 gap-4" 
      : "grid grid-cols-1 md:grid-cols-2 gap-6";

  // Touch target classes for accessibility with enhanced focus
  const buttonClasses = (touchSupport && touchOptimized)
    ? `${TOUCH_TARGET_PATTERNS.BUTTON} button-secondary text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 ${COMPONENT_FOCUS.button.danger}`
    : `button-secondary !py-2 !px-3 text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 ${COMPONENT_FOCUS.button.danger}`;

  const inputClasses = (touchSupport && mobileOptimized) 
    ? `input-modern font-mono min-h-11 text-base ${COMPONENT_FOCUS.form.input}` 
    : `input-modern font-mono h-12 ${COMPONENT_FOCUS.form.input}`;

  return (
    <div className={containerClasses}>
      <div className={headerClasses}>
        <h3 className={titleClasses}>
          <span className="w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-bold mr-3">
            {index + 1}
          </span>
          Segment {index + 1}
        </h3>
        {canRemove && (
          <button
            onClick={onRemove}
            className={buttonClasses}
            type="button"
            aria-label={`Remove segment ${index + 1}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
            </svg>
          </button>
        )}
      </div>

      <div className={gridClasses}>
        {/* Available Letters Input */}
        <div>
          <label 
            htmlFor={`segment-${index}-letters`}
            className={`block ${COMPONENT_TYPOGRAPHY.segmentInput.label} text-slate-700 mb-2 flex items-center`}
          >
            <svg className="w-4 h-4 mr-2 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            Available Letters
          </label>
          <input
            id={`segment-${index}-letters`}
            type="text"
            value={formatLettersForInput(segment.availableLetters)}
            onChange={handleLettersChange}
            className={`${inputClasses} ${
              lettersError 
                ? '!border-red-300 !ring-red-500 bg-red-50' 
                : ''
            }`}
            placeholder="aabbc"
            pattern="[a-zA-Z]*"
            aria-required="true"
            aria-invalid={!!lettersError}
            aria-describedby={`segment-${index}-letters-help ${lettersError ? `segment-${index}-letters-error` : ''}`.trim()}
            aria-label={`${SCREEN_READER_TEXT.wordFilter.availableLetters} for segment ${index + 1}`}
          />
          {lettersError && (
            <div 
              id={`segment-${index}-letters-error`}
              className={`mt-2 ${COMPONENT_TYPOGRAPHY.segmentInput.error} flex items-center bg-red-50 p-2 rounded-lg`}
              role="alert"
              aria-live="polite"
            >
              <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
              </svg>
              {lettersError}
            </div>
          )}
          <p id={`segment-${index}-letters-help`} className={`${COMPONENT_TYPOGRAPHY.segmentInput.counter} text-slate-500 mt-2 flex items-center`}>
            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            Possible letters
          </p>
        </div>

        {/* Target Length Input */}
        <div>
          <label 
            htmlFor={`segment-${index}-length`}
            className={`block ${COMPONENT_TYPOGRAPHY.segmentInput.label} text-slate-700 mb-2 flex items-center`}
          >
            <svg className="w-4 h-4 mr-2 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"/>
            </svg>
            Target Length
          </label>
          <input
            id={`segment-${index}-length`}
            type="number"
            min="1"
            max="15"
            value={segment.targetLength || ''}
            onChange={handleLengthChange}
            className={`${inputClasses} text-center ${
              lengthError || lengthVsLettersError
                ? '!border-red-300 !ring-red-500 bg-red-50' 
                : ''
            }`}
            placeholder="3"
            aria-required="true"
            aria-invalid={!!(lengthError || lengthVsLettersError)}
            aria-describedby={`segment-${index}-length-help ${lengthError ? `segment-${index}-length-error` : ''} ${lengthVsLettersError ? `segment-${index}-length-vs-letters-error` : ''}`.trim()}
            aria-label={`${SCREEN_READER_TEXT.wordFilter.targetLength} for segment ${index + 1}`}
            aria-valuemin={1}
            aria-valuemax={10}
          />
          {lengthError && (
            <div 
              id={`segment-${index}-length-error`}
              className="mt-2 text-sm text-red-600 flex items-center bg-red-50 p-2 rounded-lg"
              role="alert"
              aria-live="polite"
            >
              <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
              </svg>
              {lengthError}
            </div>
          )}
          {lengthVsLettersError && (
            <div 
              id={`segment-${index}-length-vs-letters-error`}
              className="mt-2 text-sm text-red-600 flex items-center bg-red-50 p-2 rounded-lg"
              role="alert"
              aria-live="polite"
            >
              <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
              </svg>
              {lengthVsLettersError}
            </div>
          )}
          <p id={`segment-${index}-length-help`} className={`${COMPONENT_TYPOGRAPHY.segmentInput.counter} text-slate-500 mt-2 flex items-center`}>
            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            Letters to use (1-15)
          </p>
        </div>
      </div>

      {/* General Error Display (for non-field-specific errors) */}
      {error && (
        <div className="mt-4 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 p-4 rounded-xl">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
            </svg>
            <div className="text-sm text-red-700 font-medium">{error}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SegmentInput;