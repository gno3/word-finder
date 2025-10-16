import React, { useState, useCallback, useMemo } from 'react';
import type { Segment } from '../../types/wordFilter.js';
import { SegmentInput } from './SegmentInput.js';
import { isCollectionValid, validateSegmentCount } from '../../utils/segmentValidation.js';

interface WordFilterFormProps {
  /** Called when user initiates filtering with current segments */
  onFilter: (segments: Segment[]) => void;
  /** Whether filtering is currently in progress */
  isLoading: boolean;
  /** Whether the filter button should be disabled */
  disabled?: boolean;
  /** Validation errors by segment index */
  validationErrors?: Record<number, string>;
}

/**
 * Form component for managing word filter segments and initiating filtering
 */
export const WordFilterForm: React.FC<WordFilterFormProps> = ({
  onFilter,
  isLoading,
  disabled = false,
  validationErrors = {}
}) => {
  // Initialize with one empty segment
  const [segments, setSegments] = useState<Segment[]>([
    {
      availableLetters: '',
      targetLength: 3
    }
  ]);

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
  const canAddSegment = segments.length < 5; // Max 5 segments per specification

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

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 flex items-center">
            <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            Configure Segments
          </h2>
          <div className="bg-slate-100 px-3 py-1 rounded-full">
            <span className="text-sm font-medium text-slate-700">
              {segments.length} of 5 segments
            </span>
          </div>
        </div>

        {/* Segments List */}
        <div className="space-y-5">
          {segments.map((segment, index) => (
            <SegmentInput
              key={index}
              segment={segment}
              onChange={(newSegment) => handleSegmentChange(index, newSegment)}
              onRemove={() => handleRemoveSegment(index)}
              index={index}
              canRemove={canRemoveSegment}
              error={validationErrors[index]}
            />
          ))}
        </div>

        {/* Add Segment Button */}
        {canAddSegment && (
          <button
            type="button"
            onClick={handleAddSegment}
            className="w-full py-4 px-6 border-2 border-dashed border-slate-300 rounded-xl text-slate-600 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition-all duration-200 group"
          >
            <div className="flex items-center justify-center space-x-2">
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
              </svg>
              <span className="font-medium">Add Another Segment</span>
            </div>
          </button>
        )}
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
              <div className="text-sm text-amber-700">
                Each segment needs valid letters (a-z only) and length (1-10).
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <div className="flex justify-center pt-4">
        <button
          type="submit"
          disabled={disabled || isLoading || !isFormValid}
          className="button-primary px-12 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none disabled:hover:scale-100"
        >
          {isLoading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Filtering Words...
            </span>
          ) : (
            <span className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              Filter Words
            </span>
          )}
        </button>
      </div>
    </form>
  );
};

export default WordFilterForm;