/**
 * Input validation utilities for segment structure validation
 * Feature: 002-implement-a-word
 * 
 * Note: This validates segment structure (not letter usage constraints)
 * Letter usage validation is handled by letterValidation.ts
 */

import type { Segment, FilterError } from '../types/wordFilter.js';

/**
 * Validate that a segment has the required structure and basic constraints
 * 
 * @param segment - Segment to validate
 * @param index - Index of segment in array (for error reporting)
 * @returns FilterError if invalid, null if valid
 */
export function validateSegmentStructure(segment: Segment, index: number): FilterError | null {
  // Check if segment exists
  if (!segment || typeof segment !== 'object') {
    return {
      type: 'validation',
      message: `Segment at index ${index} is not a valid object`,
      details: {
        segmentIndex: index,
        constraint: 'segment structure',
        providedValue: segment,
        suggestion: 'Provide a valid segment object with availableLetters and targetLength'
      }
    };
  }

  // Check availableLetters
  if (!segment.availableLetters || typeof segment.availableLetters !== 'string') {
    return {
      type: 'validation',
      message: `Segment at index ${index} has invalid availableLetters`,
      details: {
        segmentIndex: index,
        constraint: 'availableLetters must be non-empty string',
        providedValue: segment.availableLetters,
        suggestion: 'Provide a non-empty string of available letters'
      }
    };
  }

  if (segment.availableLetters.trim().length === 0) {
    return {
      type: 'validation',
      message: `Segment at index ${index} has empty availableLetters`,
      details: {
        segmentIndex: index,
        constraint: 'availableLetters must not be empty',
        providedValue: segment.availableLetters,
        suggestion: 'Provide at least one available letter'
      }
    };
  }

  // Check targetLength
  if (typeof segment.targetLength !== 'number' || !Number.isInteger(segment.targetLength)) {
    return {
      type: 'validation',
      message: `Segment at index ${index} has invalid targetLength`,
      details: {
        segmentIndex: index,
        constraint: 'targetLength must be positive integer',
        providedValue: segment.targetLength,
        suggestion: 'Provide a positive integer for target length'
      }
    };
  }

  if (segment.targetLength <= 0) {
    return {
      type: 'validation',
      message: `Segment at index ${index} has non-positive targetLength`,
      details: {
        segmentIndex: index,
        constraint: 'targetLength must be positive',
        providedValue: segment.targetLength,
        suggestion: 'Provide a positive integer greater than 0'
      }
    };
  }

  // Check if targetLength exceeds total available letters (including duplicates)
  const totalLetters = segment.availableLetters.toLowerCase().length;
  if (segment.targetLength > totalLetters) {
    return {
      type: 'validation',
      message: `Segment at index ${index}: targetLength (${segment.targetLength}) exceeds total available letters (${totalLetters})`,
      details: {
        segmentIndex: index,
        constraint: 'target length cannot exceed available letter count',
        providedValue: { targetLength: segment.targetLength, totalLetters },
        suggestion: 'Reduce target length or provide more letters'
      }
    };
  }

  return null; // Valid segment
}

/**
 * Validate an array of segments for structure and basic constraints
 * 
 * @param segments - Array of segments to validate
 * @returns Array of errors (empty if all segments are valid)
 */
export function validateSegmentsArray(segments: Segment[]): FilterError[] {
  const errors: FilterError[] = [];

  // Check if segments array exists and is an array
  if (!Array.isArray(segments)) {
    errors.push({
      type: 'validation',
      message: 'Segments must be an array',
      details: {
        constraint: 'segments array structure',
        providedValue: typeof segments,
        suggestion: 'Provide an array of segment objects'
      }
    });
    return errors;
  }

  // Check if segments array is empty
  if (segments.length === 0) {
    errors.push({
      type: 'validation',
      message: 'Segments array cannot be empty',
      details: {
        constraint: 'minimum segments required',
        providedValue: segments.length,
        suggestion: 'Provide at least one segment constraint'
      }
    });
    return errors;
  }

  // Check maximum segments limit (specification says up to 6)
  if (segments.length > 6) {
    errors.push({
      type: 'validation',
      message: `Too many segments: ${segments.length} (maximum 6 allowed)`,
      details: {
        constraint: 'maximum segments limit',
        providedValue: segments.length,
        suggestion: 'Reduce number of segments to 6 or fewer'
      }
    });
  }

  // Validate each segment structure
  for (let i = 0; i < segments.length; i++) {
    const segmentError = validateSegmentStructure(segments[i], i);
    if (segmentError) {
      errors.push(segmentError);
    }
  }

  return errors;
}

/**
 * Normalize segment by trimming whitespace and converting to lowercase
 * 
 * @param segment - Segment to normalize
 * @returns Normalized segment
 */
export function normalizeSegment(segment: Segment): Segment {
  return {
    availableLetters: segment.availableLetters.trim().toLowerCase(),
    targetLength: segment.targetLength
  };
}

/**
 * Normalize an array of segments
 * 
 * @param segments - Array of segments to normalize
 * @returns Array of normalized segments
 */
export function normalizeSegments(segments: Segment[]): Segment[] {
  return segments.map(normalizeSegment);
}