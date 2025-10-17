/**
 * Segment validation utilities for WordSegmentInput component
 * Feature: 003-create-a-wordsegmentinput
 */

/**
 * Validation error structure for segment validation
 */
export interface ValidationError {
  /** Error category */
  type: 'validation';
  /** User-friendly error message */
  message: string;
  /** Field that caused the error */
  field: 'availableLetters' | 'targetLength' | 'segmentCount';
  /** Segment index if applicable */
  segmentIndex?: number;
}

/**
 * Validate available letters input
 * @param input - Raw input string
 * @returns ValidationError if invalid, null if valid
 */
export function validateAvailableLetters(input: string): ValidationError | null {
  // Check for non-alphabetic characters
  if (!/^[a-zA-Z]*$/.test(input)) {
    return {
      type: 'validation',
      message: 'Only letters (a-z) are allowed',
      field: 'availableLetters'
    };
  }
  return null;
}

/**
 * Validate target length input
 * @param length - Length value to validate
 * @returns ValidationError if invalid, null if valid
 */
export function validateTargetLength(length: number): ValidationError | null {
  if (!Number.isInteger(length) || length < 1 || length > 15) {
    return {
      type: 'validation', 
      message: 'Length must be between 1 and 15',
      field: 'targetLength'
    };
  }
  return null;
}

/**
 * Normalize letters input to lowercase and remove non-alphabetic characters
 * @param input - Raw input string
 * @returns Normalized string (lowercase, alphabetic only)
 */
export function normalizeLetters(input: string): string {
  return input.toLowerCase().replace(/[^a-z]/g, '');
}

/**
 * Validate segment count constraints
 * @param count - Number of segments
 * @returns ValidationError if invalid, null if valid
 */
export function validateSegmentCount(count: number): ValidationError | null {
  if (count < 1) {
    return {
      type: 'validation',
      message: 'At least one segment is required', 
      field: 'segmentCount'
    };
  }
  if (count > 5) {
    return {
      type: 'validation',
      message: 'Maximum 6 segments allowed',
      field: 'segmentCount'
    };
  }
  return null;
}

/**
 * Check if segment collection is valid
 * @param segments - Array of segments to validate
 * @returns true if all segments are valid, false otherwise
 */
export function isCollectionValid(segments: Array<{availableLetters: string; targetLength: number}>): boolean {
  // Check segment count
  const countError = validateSegmentCount(segments.length);
  if (countError) return false;
  
  // Check each segment
  for (const segment of segments) {
    const lettersError = validateAvailableLetters(segment.availableLetters);
    const lengthError = validateTargetLength(segment.targetLength);
    
    if (lettersError || lengthError) {
      return false;
    }
  }
  
  return true;
}