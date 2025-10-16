/**
 * Word Filter Service - Core business logic for segment-based word filtering
 * Feature: 002-implement-a-word
 */

import type { 
  Segment, 
  FilterResult, 
  ValidationResult,
  FilterMetadata 
} from '../types/wordFilter.js';
import { validateSegmentsArray, normalizeSegments } from '../utils/inputValidation.js';
import { validateSegmentWithLength } from '../utils/letterValidation.js';
import { splitWordIntoSegments } from '../utils/wordSplitting.js';
import { createNoMatchingWordsError, createUnexpectedProcessingError } from '../utils/wordFilterErrors.js';

/**
 * Service class for word filtering operations
 * Implements pure functions for segment-based dictionary filtering
 */
export class WordFilterService {
  /**
   * Filter dictionary words using segment constraints
   * Core business logic implementation
   * 
   * @param segments - Array of segment constraints
   * @param dictionary - Array of dictionary words to filter
   * @returns Promise resolving to filtered results with metadata
   */
  public async filterWords(segments: Segment[], dictionary: string[]): Promise<FilterResult> {
    const startTime = performance.now();
    
    try {
      // Validate input segments first
      const validationResults = this.validateSegments(segments);
      const validationErrors = validationResults.filter(result => !result.isValid);
      
      if (validationErrors.length > 0) {
        // Return first validation error
        const firstError = validationErrors[0].error!;
        return {
          words: [],
          error: firstError,
          metadata: this.createMetadata(0, 0, segments.length, startTime)
        };
      }

      // Calculate total expected word length for pre-filtering
      const totalLength = this.calculateTotalLength(segments);
      
      // Pre-filter dictionary by exact length match (optimization)
      const candidates = dictionary.filter(word => word.length === totalLength);
      
      // Filter candidates by segment constraints
      const matchingWords: string[] = [];
      const segmentLengths = segments.map(segment => segment.targetLength);
      
      for (const word of candidates) {
        if (this.wordMatchesSegments(word.toLowerCase(), segments, segmentLengths)) {
          matchingWords.push(word);
        }
      }
      
      // Sort results alphabetically
      matchingWords.sort();
      
      const endTime = performance.now();
      
      // Return empty array with constraint error if no matches found
      if (matchingWords.length === 0) {
        return {
          words: [],
          error: createNoMatchingWordsError(),
          metadata: this.createMetadata(dictionary.length, candidates.length, segments.length, startTime, endTime)
        };
      }
      
      return {
        words: matchingWords,
        metadata: this.createMetadata(dictionary.length, candidates.length, segments.length, startTime, endTime)
      };
      
    } catch (error) {
      return {
        words: [],
        error: createUnexpectedProcessingError(error),
        metadata: this.createMetadata(0, 0, segments.length, startTime)
      };
    }
  }

  /**
   * Check if a word matches all segment constraints
   * 
   * @param word - Word to check (should be lowercase)
   * @param segments - Array of segment constraints
   * @param segmentLengths - Pre-calculated segment lengths for efficiency
   * @returns Whether the word matches all constraints
   */
  private wordMatchesSegments(word: string, segments: Segment[], segmentLengths: number[]): boolean {
    // Split word into segments according to length pattern
    const wordSegments = this.splitWordIntoSegments(word, segmentLengths);
    
    // Validate each segment against its constraints
    for (let i = 0; i < segments.length; i++) {
      if (!this.validateSegmentLetters(wordSegments[i], segments[i].availableLetters.toLowerCase(), segments[i].targetLength)) {
        return false; // Early termination on first failure
      }
    }
    
    return true;
  }

  /**
   * Validate segment array for common issues
   * Provides detailed validation feedback
   * 
   * @param segments - Array of segments to validate
   * @returns Array of validation results (one per segment)
   */
  public validateSegments(segments: Segment[]): ValidationResult[] {
    // Use input validation utilities to check segment structure
    const structuralErrors = validateSegmentsArray(segments);
    
    // If there are structural errors, return them as validation results
    if (structuralErrors.length > 0) {
      return structuralErrors.map(error => ({
        isValid: false,
        error
      }));
    }
    
    // Normalize segments for consistent processing
    const normalizedSegments = normalizeSegments(segments);
    
    // Validate each segment individually
    const results: ValidationResult[] = [];
    
    for (let i = 0; i < normalizedSegments.length; i++) {
      const segment = normalizedSegments[i];
      
      // All structural validation is already done, so segments are valid
      results.push({
        isValid: true,
        normalizedSegment: segment
      });
    }
    
    return results;
  }

  /**
   * Calculate total expected word length from segments
   * Optimization utility for dictionary pre-filtering
   * 
   * @param segments - Array of segments
   * @returns Total expected word length
   */
  public calculateTotalLength(segments: Segment[]): number {
    return segments.reduce((total, segment) => total + segment.targetLength, 0);
  }

  /**
   * Split word into segments according to length pattern
   * Internal utility exposed for testing
   * 
   * @param word - Word to split
   * @param lengths - Array of segment lengths
   * @returns Array of word segments
   */
  public splitWordIntoSegments(word: string, lengths: number[]): string[] {
    return splitWordIntoSegments(word, lengths);
  }

  /**
   * Validate single segment against available letters and target length
   * Core validation logic for letter frequency and length constraints
   * 
   * @param segmentText - The segment text to validate
   * @param availableLetters - Available letters for this segment (frequency matters)
   * @param targetLength - Expected length of the segment
   * @returns Whether the segment is valid
   */
  public validateSegmentLetters(segmentText: string, availableLetters: string, targetLength: number): boolean {
    return validateSegmentWithLength(segmentText, availableLetters, targetLength);
  }

  /**
   * Create performance metadata for filtering operation
   * 
   * @param processedWords - Number of words processed
   * @param totalCandidates - Number of candidate words after pre-filtering
   * @param segmentCount - Number of segments in pattern
   * @param startTime - Processing start time
   * @param endTime - Processing end time (optional, defaults to now)
   * @returns FilterMetadata object
   */
  protected createMetadata(
    processedWords: number,
    totalCandidates: number,
    segmentCount: number,
    startTime: number,
    endTime?: number
  ): FilterMetadata {
    const endTimeMs = endTime ?? performance.now();
    return {
      processingTimeMs: endTimeMs - startTime,
      processedWords,
      totalCandidates,
      segmentCount
    };
  }
}