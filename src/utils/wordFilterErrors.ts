/**
 * Word filter specific error handling and structured error creation utilities
 * Feature: 002-implement-a-word
 */

import type { FilterError } from '../types/wordFilter.js';

/**
 * Create a validation error with structured details
 * 
 * @param message - Error message
 * @param details - Additional error context
 * @returns FilterError object
 */
export function createValidationError(
  message: string,
  details: {
    segmentIndex?: number;
    constraint?: string;
    providedValue?: any;
    suggestion?: string;
  } = {}
): FilterError {
  return {
    type: 'validation',
    message,
    details
  };
}

/**
 * Create a constraint error when no words match the pattern
 * 
 * @param message - Error message
 * @param details - Additional error context
 * @returns FilterError object
 */
export function createConstraintError(
  message: string,
  details: {
    constraint?: string;
    suggestion?: string;
    providedValue?: any;
  } = {}
): FilterError {
  return {
    type: 'constraint',
    message,
    details
  };
}

/**
 * Create a processing error for runtime issues
 * 
 * @param message - Error message
 * @param details - Additional error context
 * @returns FilterError object
 */
export function createProcessingError(
  message: string,
  details: {
    constraint?: string;
    suggestion?: string;
    providedValue?: any;
  } = {}
): FilterError {
  return {
    type: 'processing',
    message,
    details
  };
}

/**
 * Standard error messages for common validation failures
 */
export const FilterErrorMessages = {
  EMPTY_SEGMENTS: 'Segments array cannot be empty',
  INVALID_SEGMENT: 'Invalid segment structure',
  EMPTY_AVAILABLE_LETTERS: 'Available letters cannot be empty',
  INVALID_TARGET_LENGTH: 'Target length must be a positive integer',
  TARGET_LENGTH_EXCEEDS_LETTERS: 'Target length exceeds available unique letters',
  TOO_MANY_SEGMENTS: 'Too many segments (maximum 10 allowed)',
  DICTIONARY_NOT_LOADED: 'Dictionary not loaded',
  NO_MATCHING_WORDS: 'No dictionary words satisfy the provided segment constraints',
  PROCESSING_ERROR: 'Unexpected error during word filtering'
} as const;

/**
 * Standard suggestions for common error scenarios
 */
export const FilterErrorSuggestions = {
  PROVIDE_SEGMENTS: 'Provide at least one segment constraint',
  CHECK_SEGMENT_STRUCTURE: 'Provide a valid segment object with availableLetters and targetLength',
  PROVIDE_LETTERS: 'Provide at least one available letter',
  USE_POSITIVE_LENGTH: 'Provide a positive integer for target length',
  REDUCE_LENGTH_OR_ADD_LETTERS: 'Reduce target length or provide more unique letters',
  REDUCE_SEGMENT_COUNT: 'Reduce number of segments to 10 or fewer',
  WAIT_FOR_DICTIONARY: 'Wait for dictionary to load before filtering',
  ADJUST_CONSTRAINTS: 'Try adjusting available letters or segment lengths',
  CHECK_INPUT: 'Check input data and try again',
  RETRY_OPERATION: 'Retry the operation or refresh the page'
} as const;

/**
 * Create a structured error for no matching words
 */
export function createNoMatchingWordsError(): FilterError {
  return createConstraintError(FilterErrorMessages.NO_MATCHING_WORDS, {
    constraint: 'segment pattern matching',
    suggestion: FilterErrorSuggestions.ADJUST_CONSTRAINTS
  });
}

/**
 * Create a structured error for dictionary not loaded
 */
export function createDictionaryNotLoadedError(): FilterError {
  return createProcessingError(FilterErrorMessages.DICTIONARY_NOT_LOADED, {
    constraint: 'dictionary availability',
    suggestion: FilterErrorSuggestions.WAIT_FOR_DICTIONARY
  });
}

/**
 * Create a structured error for unexpected processing errors
 */
export function createUnexpectedProcessingError(originalError?: any): FilterError {
  return createProcessingError(FilterErrorMessages.PROCESSING_ERROR, {
    constraint: 'processing error',
    providedValue: originalError instanceof Error ? originalError.message : String(originalError),
    suggestion: FilterErrorSuggestions.CHECK_INPUT
  });
}

/**
 * Check if an error is a FilterError
 */
export function isFilterError(error: any): error is FilterError {
  return (
    error &&
    typeof error === 'object' &&
    'type' in error &&
    'message' in error &&
    'details' in error &&
    ['validation', 'constraint', 'processing'].includes(error.type)
  );
}

/**
 * Extract a user-friendly message from any error
 */
export function extractErrorMessage(error: any): string {
  if (isFilterError(error)) {
    return error.message;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  return FilterErrorMessages.PROCESSING_ERROR;
}