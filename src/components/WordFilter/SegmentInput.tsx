import React from 'react';
import type { Segment } from '../../types/wordFilter.js';

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
  error
}) => {
  const handleLengthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newLength = parseInt(event.target.value, 10);
    if (!isNaN(newLength) && newLength > 0) {
      onChange({
        ...segment,
        targetLength: newLength
      });
    }
  };

  const handleLettersChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newLetters = event.target.value
      .toLowerCase()
      .replace(/[^a-z]/g, ''); // Only allow lowercase letters, keep duplicates for frequency
    
    onChange({
      ...segment,
      availableLetters: newLetters
    });
  };

  const formatLettersForInput = (letters: string): string => {
    return letters;
  };

  return (
    <div className="border border-gray-300 rounded-lg p-4 bg-white">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-medium text-gray-900">
          Segment {index + 1}
        </h3>
        {canRemove && (
          <button
            onClick={onRemove}
            className="text-red-600 hover:text-red-800 font-medium text-sm"
            type="button"
            aria-label={`Remove segment ${index + 1}`}
          >
            Remove
          </button>
        )}
      </div>

      <div className="space-y-4">
        {/* Target Length Input */}
        <div>
          <label 
            htmlFor={`segment-${index}-length`}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Target Length
          </label>
          <input
            id={`segment-${index}-length`}
            type="number"
            min="1"
            max="20"
            value={segment.targetLength}
            onChange={handleLengthChange}
            className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="3"
          />
          <p className="text-xs text-gray-500 mt-1">
            Number of letters in this segment
          </p>
        </div>

        {/* Available Letters Input */}
        <div>
          <label 
            htmlFor={`segment-${index}-letters`}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Available Letters
          </label>
          <input
            id={`segment-${index}-letters`}
            type="text"
            value={formatLettersForInput(segment.availableLetters)}
            onChange={handleLettersChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="aabbc"
            pattern="[a-zA-Z]*"
          />
          <p className="text-xs text-gray-500 mt-1">
            Letters available for this segment (frequency matters - enter 'aa' to use 'a' twice)
          </p>
        </div>

        {/* Validation Summary */}
        <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
          <div>Target: {segment.targetLength} letters to use</div>
          <div>Available: {segment.availableLetters.length} total letters</div>
          {segment.availableLetters.length > 0 && (
            <div>Pool: {segment.availableLetters.split('').join(', ')}</div>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="text-sm text-red-600 bg-red-50 p-2 rounded border border-red-200">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default SegmentInput;