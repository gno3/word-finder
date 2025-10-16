/**
 * TypeScript type definitions for Word Filtering Algorithm
 * Feature: 002-implement-a-word
 */

/**
 * Segment constraint specification for word filtering
 */
export interface Segment {
  /** Available letters that can be used to form this segment (frequency matters - each letter can only be used as many times as it appears here) */
  availableLetters: string;
  /** Required length of this segment in the final word (number of letters to use from availableLetters) */
  targetLength: number;
}

/**
 * Result of a word filtering operation
 */
export interface FilterResult {
  /** Successfully filtered words, sorted alphabetically */
  words: string[];
  /** Error information if filtering failed */
  error?: FilterError;
  /** Processing metadata for performance tracking */
  metadata: FilterMetadata;
}

/**
 * Performance metrics collected during filtering operations
 */
export interface FilterMetadata {
  /** Total processing time in milliseconds */
  processingTimeMs: number;
  /** Number of dictionary words examined */
  processedWords: number;
  /** Number of words that passed length pre-filtering */
  totalCandidates: number;
  /** Number of segments in the pattern */
  segmentCount: number;
}

/**
 * Structured error information with specific constraint details
 */
export interface FilterError {
  /** Error category for programmatic handling */
  type: 'validation' | 'constraint' | 'processing';
  /** Human-readable error message */
  message: string;
  /** Detailed context about the error */
  details: {
    /** Index of problematic segment (if applicable) */
    segmentIndex?: number;
    /** Specific constraint that failed */
    constraint?: string;
    /** Value that caused the error */
    providedValue?: any;
    /** Suggested fix or additional context */
    suggestion?: string;
  };
}

/**
 * Input structure for the filtering algorithm
 */
export interface FilterRequest {
  /** Segment constraints to apply */
  segments: Segment[];
  /** Optional configuration */
  options?: {
    /** Maximum number of results to return (default: unlimited) */
    maxResults?: number;
  };
}

/**
 * Outcome of segment constraint validation
 */
export interface ValidationResult {
  /** Whether the segment is valid */
  isValid: boolean;
  /** Validation error details (if invalid) */
  error?: FilterError;
  /** The validated segment (normalized) */
  normalizedSegment?: Segment;
}

/**
 * Internal structure for tracking segment-level validation outcomes
 */
export interface SegmentValidation {
  /** Whether this segment passes all constraints */
  isValid: boolean;
  /** Specific constraint violations (if any) */
  violations: {
    lengthMismatch?: boolean;
    unavailableLetters?: string[];
    excessLetterUsage?: string[];
  };
}

/**
 * Character frequency map for letter usage validation
 */
export interface CharacterFrequency {
  [char: string]: number;
}