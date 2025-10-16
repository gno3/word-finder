# API Contracts: Word Filtering Algorithm

**Date**: 2025-10-16  
**Purpose**: Define TypeScript interfaces and function signatures for word filtering functionality

## Core Function Contracts

### Primary Filtering Function

```typescript
/**
 * Filter dictionary words based on ordered segment constraints
 * Pure function with no side effects or logging
 * 
 * @param segments - Ordered array of segment constraints
 * @returns Promise resolving to filtered results with metadata
 * @throws Never - all errors returned in FilterResult.error
 */
declare function filterWordsBySegments(
  segments: Segment[]
): Promise<FilterResult>;
```

**Input Contract**:
- `segments`: Non-empty array of valid Segment objects
- Each segment must have non-empty `availableLetters` and positive `targetLength`
- Segments processed in exact order provided (no reordering)

**Output Contract**:
- Returns `FilterResult` with either `words` array or `error` object
- `words` array always sorted alphabetically (ascending)
- `metadata` always present with performance metrics
- Function never throws exceptions - all errors in result object

### Validation Function

```typescript
/**
 * Validate segment constraints without performing dictionary filtering
 * Used for early validation and error reporting
 * 
 * @param segments - Array of segments to validate
 * @returns Array of validation results (one per segment)
 */
declare function validateSegmentConstraints(
  segments: Segment[]
): ValidationResult[];
```

**Input Contract**:
- Accepts any array including empty array
- Individual segments may be invalid (validation catches this)
- Order preserved in results array

**Output Contract**:
- Returns array with same length as input
- Each ValidationResult corresponds to input segment at same index
- Invalid segments have detailed error information in result

## React Hook Contracts

### useWordFilter Hook

```typescript
/**
 * React hook for word filtering with state management
 * Integrates with existing useDictionary hook
 * 
 * @returns Hook result with filtering function and state
 */
declare function useWordFilter(): UseWordFilterResult;
```

**State Management Contract**:
- Hook manages loading state during filtering operations
- Errors cleared when new filtering operation starts
- Results persist until explicitly cleared or new operation
- Hook automatically integrates with dictionary loading state

**Function Contracts**:
```typescript
interface UseWordFilterResult {
  /**
   * Execute word filtering with loading state management
   * @param segments - Segment constraints to apply
   */
  filterWords: (segments: Segment[]) => Promise<void>;
  
  /**
   * Validate segments synchronously without filtering
   * @param segments - Segments to validate
   * @returns Validation results array
   */
  validateSegments: (segments: Segment[]) => ValidationResult[];
  
  /**
   * Clear current results and error state
   */
  reset: () => void;
  
  // State properties
  result: FilterResult | null;
  isLoading: boolean;
  error: FilterError | null;
  metrics: FilterResult['metadata'] | null;
}
```

## Service Layer Contracts

### WordFilterService Interface

```typescript
/**
 * Service interface for word filtering operations
 * Implements business logic for segment-based filtering
 */
interface WordFilterService {
  /**
   * Filter dictionary words using segment constraints
   * Core business logic implementation
   */
  filterWords(segments: Segment[]): Promise<FilterResult>;
  
  /**
   * Validate segment array for common issues
   * Provides detailed validation feedback
   */
  validateSegments(segments: Segment[]): ValidationResult[];
  
  /**
   * Calculate total expected word length from segments
   * Optimization utility for dictionary pre-filtering
   */
  calculateTotalLength(segments: Segment[]): number;
  
  /**
   * Split word into segments according to length pattern
   * Internal utility exposed for testing
   */
  splitWordIntoSegments(word: string, lengths: number[]): string[];
  
  /**
   * Validate single segment against available letters
   * Core validation logic for one-to-one letter mapping
   */
  validateSegmentLetters(
    segmentText: string, 
    availableLetters: string
  ): boolean;
}
```

## Error Handling Contracts

### Error Response Format

```typescript
/**
 * Standardized error format for all filtering operations
 * Provides structured information for debugging and user feedback
 */
interface FilterError {
  /** Error category for programmatic handling */
  type: 'validation' | 'constraint' | 'processing';
  
  /** Human-readable error message */
  message: string;
  
  /** Detailed error context */
  details: {
    segmentIndex?: number;    // Which segment caused the error
    constraint?: string;      // Specific constraint that failed
    providedValue?: any;      // Value that caused the failure
    suggestion?: string;      // Recommended fix
  };
}
```

**Error Type Contracts**:

**Validation Errors** (`type: 'validation'`):
- Empty segments array
- Segment with empty `availableLetters`
- Segment with zero or negative `targetLength`
- Segment where `targetLength` exceeds available letter count

**Constraint Errors** (`type: 'constraint'`):
- No dictionary words can satisfy the pattern
- Impossible letter combinations for given lengths
- Pattern too restrictive for dictionary content

**Processing Errors** (`type: 'processing'`):
- Dictionary not loaded
- Runtime errors during filtering
- Memory or performance limit exceeded

## Integration Contracts

### Dictionary Service Integration

```typescript
/**
 * Required interface from existing dictionary service
 * Word filtering depends on these existing capabilities
 */
interface RequiredDictionaryService {
  /** Get all loaded dictionary words */
  getAllWords(): string[];
  
  /** Check if dictionary is currently loaded */
  isLoaded(): boolean;
  
  /** Get loading state for UI coordination */
  getLoadingState(): {
    isLoading: boolean;
    error: string | null;
  };
}
```

### Component Integration Contracts

```typescript
/**
 * Props interface for word filter component
 * Defines how UI components interact with filtering logic
 */
interface WordFilterComponentProps {
  /** Initial segment configuration (optional) */
  initialSegments?: Segment[];
  
  /** Callback when filtering completes */
  onResults?: (result: FilterResult) => void;
  
  /** Callback when validation fails */
  onError?: (error: FilterError) => void;
  
  /** Maximum number of results to display */
  maxDisplayResults?: number;
  
  /** Enable performance metrics display */
  showMetrics?: boolean;
}
```

## Performance Contracts

### Response Time Requirements

```typescript
/**
 * Performance targets that implementation must meet
 * Based on success criteria in feature specification
 */
interface PerformanceTargets {
  /** Maximum response time for any filtering operation */
  maxResponseTimeMs: 500;
  
  /** Typical response time for simple patterns (2-3 segments) */
  simplePatternTargetMs: 100;
  
  /** Typical response time for complex patterns (4-6 segments) */
  complexPatternTargetMs: 300;
  
  /** Maximum memory usage during filtering */
  maxMemoryUsageMB: 50;
  
  /** Maximum concurrent filtering operations supported */
  maxConcurrentOperations: 10;
}
```

### Metrics Contract

```typescript
/**
 * Performance metrics collected during filtering operations
 * Included in FilterResult.metadata for monitoring
 */
interface PerformanceMetrics {
  /** Total processing time in milliseconds */
  processingTimeMs: number;
  
  /** Number of dictionary words examined */
  processedWords: number;
  
  /** Number of words that passed length pre-filtering */
  totalCandidates: number;
  
  /** Number of segments in the pattern */
  segmentCount: number;
  
  /** Peak memory usage during operation (if available) */
  peakMemoryUsageMB?: number;
}
```