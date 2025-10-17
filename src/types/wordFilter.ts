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

/**
 * Real-time validation state for segment input components
 * Feature: 003-create-a-wordsegmentinput
 */
export interface SegmentValidationState {
  /** Index of the segment being validated */
  segmentIndex: number;
  /** Field-specific validation results */
  fieldErrors: {
    availableLetters?: string;
    targetLength?: string;
  };
  /** Whether this segment is currently valid */
  isValid: boolean;
}

/**
 * Component state for managing multiple segments with validation
 * Feature: 003-create-a-wordsegmentinput
 */
export interface SegmentCollectionState {
  /** Array of segments (1-6 segments allowed) */
  segments: Segment[];
  /** Total calculated length across all segments */
  totalLength: number;
  /** Collection-level validation state */
  isValid: boolean;
  /** Validation errors keyed by segment index */
  validationErrors: Record<number, SegmentValidationState>;
}

/**
 * Reset operation state management
 * Feature: 004-responsiveness-and-polish
 */
export interface ResetState {
  /** Indicates if reset operation is in progress */
  isResetting: boolean;
  /** Controls display of confirmation dialog */
  showConfirmation: boolean;
  /** Error message if reset operation fails */
  resetError: string | null;
  /** Timestamp of last successful reset */
  lastResetTimestamp: number | null;
}

/**
 * Reset action types for state management
 * Feature: 004-responsiveness-and-polish
 */
export type ResetAction = 
  | { type: 'RESET_REQUEST' }
  | { type: 'RESET_CONFIRM' }
  | { type: 'RESET_CANCEL' }
  | { type: 'RESET_SUCCESS'; payload: { timestamp: number } }
  | { type: 'RESET_ERROR'; payload: { errorMessage: string } }
  | { type: 'CLEAR_ERROR' };

/**
 * Configuration for reset operations
 * Feature: 004-responsiveness-and-polish
 */
export interface ResetConfig {
  /** Callback fired when reset completes successfully */
  onResetComplete?: () => void;
  /** Callback fired when reset encounters an error */
  onResetError?: (error: string) => void;
  /** Whether to preserve user preferences during reset */
  preserveSettings?: boolean;
  /** Custom confirmation message for reset dialog */
  confirmationMessage?: string;
}

/**
 * Extended filter state with reset capabilities
 * Feature: 004-responsiveness-and-polish
 */
export interface WordFilterState extends SegmentCollectionState {
  /** Current filter results */
  filterResult: FilterResult | null;
  /** Loading state for filter operations */
  isLoading: boolean;
  /** Reset operation state */
  resetState: ResetState;
}

/**
 * Reset operation context for error recovery
 * Feature: 004-responsiveness-and-polish
 */
export interface ResetContext {
  /** Previous state before reset attempt */
  previousState?: WordFilterState;
  /** Reason for reset operation */
  reason: 'user_request' | 'error_recovery' | 'timeout';
  /** Whether recovery is possible */
  canRecover: boolean;
}