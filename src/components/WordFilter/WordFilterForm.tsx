import React, { useState, useCallback } from 'react';
import type { Segment } from '../../types/wordFilter.js';
import { SegmentInput } from './SegmentInput.js';

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

  const handleSubmit = useCallback((event: React.FormEvent) => {
    event.preventDefault();
    
    // Basic validation before submitting
    const hasValidSegments = segments.length > 0 && segments.every(segment => 
      segment.targetLength > 0 && segment.availableLetters.length > 0
    );

    if (hasValidSegments && !disabled && !isLoading) {
      onFilter(segments);
    }
  }, [segments, onFilter, disabled, isLoading]);

  const canRemoveSegment = segments.length > 1;
  const canAddSegment = segments.length < 10; // Reasonable upper limit

  const isFormValid = segments.length > 0 && segments.every(segment => 
    segment.targetLength > 0 && 
    segment.availableLetters.length > 0 &&
    segment.availableLetters.length >= segment.targetLength
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            Configure Segments
          </h2>
          <div className="text-sm text-gray-600">
            {segments.length} segment{segments.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Segments List */}
        <div className="space-y-4">
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
            className="w-full py-2 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            + Add Another Segment
          </button>
        )}
      </div>

      {/* Form Summary */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="text-sm font-medium text-blue-900 mb-2">Filter Summary</h3>
        <div className="text-sm text-blue-800">
          <div>Segments: {segments.length}</div>
          <div>
            Total word length: {segments.reduce((sum, seg) => sum + seg.targetLength, 0)} letters
          </div>
          <div>
            Pattern: {segments.map((seg) => 
              `${seg.targetLength} letters from [${seg.availableLetters}]`
            ).join(' + ')}
          </div>
        </div>
      </div>

      {/* Validation Messages */}
      {!isFormValid && segments.some(seg => seg.availableLetters.length > 0) && (
        <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
          <div className="text-sm text-yellow-800">
            <div className="font-medium mb-1">Form Validation Issues:</div>
            <ul className="list-disc list-inside space-y-1">
              {segments.map((segment, index) => {
                const issues = [];
                if (segment.targetLength <= 0) {
                  issues.push('Target length must be greater than 0');
                }
                if (segment.availableLetters.length === 0) {
                  issues.push('Must specify available letters');
                }
                if (segment.availableLetters.length < segment.targetLength) {
                  issues.push('Need at least as many total letters as target length');
                }
                
                if (issues.length > 0) {
                  return (
                    <li key={index}>
                      Segment {index + 1}: {issues.join(', ')}
                    </li>
                  );
                }
                return null;
              }).filter(Boolean)}
            </ul>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <div className="flex justify-center">
        <button
          type="submit"
          disabled={disabled || isLoading || !isFormValid}
          className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Filtering Words...
            </span>
          ) : (
            'Filter Words'
          )}
        </button>
      </div>
    </form>
  );
};

export default WordFilterForm;