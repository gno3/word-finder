# Data Model: Word Filtering Algorithm

**Date**: 2025-10-16  
**Purpose**: Define TypeScript interfaces and data structures for segment-based word filtering

## Core Entities

### Segment
Represents a single constraint specification in the word pattern.

```typescript
interface Segment {
  /** Available letters that can be used to form this segment */
  availableLetters: string;
  /** Required length of this segment in the final word */
  targetLength: number;
}
```

**Validation Rules**:
- `availableLetters` must be non-empty string
- `targetLength` must be positive integer
- `targetLength` must not exceed `availableLetters.length` for strict one-to-one mapping

**State Transitions**: Immutable - segments are validated at creation and remain unchanged

### Word Pattern
Complete sequence of segments defining the filtering criteria.

```typescript
interface WordPattern {
  /** Ordered array of segment constraints */
  segments: Segment[];
  /** Total expected word length (sum of all segment lengths) */
  totalLength: number;
}
```

**Derived Fields**:
- `totalLength`: Calculated as sum of all `segment.targetLength` values
- Automatically computed to optimize dictionary pre-filtering

### Filter Result
Contains the filtering operation outcome with words or error information.

```typescript
interface FilterResult {
  /** Successfully filtered words, sorted alphabetically */
  words: string[];
  /** Error information if filtering failed */
  error?: FilterError;
  /** Processing metadata */
  metadata: {
    processedWords: number;
    processingTimeMs: number;
    totalCandidates: number;
  };
}
```

**Business Rules**:
- `words` array is always sorted alphabetically
- `words` is empty array when no matches found (not null/undefined)
- `error` is present only when validation or processing fails
- `metadata` provides transparency into algorithm performance

### Filter Error
Structured error information with specific constraint details.

```typescript
interface FilterError {
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
```

**Error Categories**:
- `validation`: Input validation failures (empty letters, zero length, etc.)
- `constraint`: Impossible constraints (no dictionary words can satisfy pattern)
- `processing`: Runtime errors during filtering execution

## Letter Usage Validation

### Character Frequency Map
Internal data structure for tracking letter usage within segments.

```typescript
interface CharacterFrequency {
  [char: string]: number;
}
```

**Usage Pattern**:
1. Create frequency map from `segment.availableLetters`
2. Decrement count for each character used in word segment
3. Validation succeeds if all counts reach exactly zero

### Segment Validation Result
Internal structure for tracking segment-level validation outcomes.

```typescript
interface SegmentValidation {
  /** Whether this segment passes all constraints */
  isValid: boolean;
  /** Specific constraint violations (if any) */
  violations: {
    lengthMismatch?: boolean;
    unavailableLetters?: string[];
    excessLetterUsage?: string[];
  };
}
```

## API Integration Types

### Filter Request
Input structure for the filtering algorithm.

```typescript
interface FilterRequest {
  /** Segment constraints to apply */
  segments: Segment[];
  /** Optional configuration */
  options?: {
    /** Maximum number of results to return (default: unlimited) */
    maxResults?: number;
    /** Case sensitivity handling (always canonical lowercase) */
    caseSensitive?: boolean; // Deprecated - always false
  };
}
```

### Filter Service Interface
Contract for the word filtering service implementation.

```typescript
interface WordFilterService {
  /** 
   * Filter dictionary words based on segment constraints
   * Pure function - no side effects or logging
   */
  filterWords(request: FilterRequest): Promise<FilterResult>;
  
  /**
   * Validate segment constraints without filtering
   * Returns detailed validation results
   */
  validateSegments(segments: Segment[]): ValidationResult[];
  
  /**
   * Calculate total expected word length from segments
   * Utility function for pre-filtering optimization
   */
  calculateTotalLength(segments: Segment[]): number;
}
```

### Validation Result
Outcome of segment constraint validation.

```typescript
interface ValidationResult {
  /** Whether the segment is valid */
  isValid: boolean;
  /** Validation error details (if invalid) */
  error?: FilterError;
  /** The validated segment (normalized) */
  normalizedSegment?: Segment;
}
```

## React Hook Integration

### Hook State Interface
State structure for the `useWordFilter` React hook.

```typescript
interface UseWordFilterState {
  /** Current filtering results */
  result: FilterResult | null;
  /** Loading state during filtering operation */
  isLoading: boolean;
  /** Last error encountered */
  error: FilterError | null;
  /** Performance metrics from last operation */
  lastMetrics: FilterResult['metadata'] | null;
}
```

### Hook Return Interface
Public interface returned by the `useWordFilter` hook.

```typescript
interface UseWordFilterResult {
  /** Execute filtering with given segments */
  filterWords: (segments: Segment[]) => Promise<void>;
  /** Validate segments without filtering */
  validateSegments: (segments: Segment[]) => ValidationResult[];
  /** Current state */
  result: FilterResult | null;
  isLoading: boolean;
  error: FilterError | null;
  /** Performance monitoring */
  metrics: FilterResult['metadata'] | null;
  /** Clear current results and errors */
  reset: () => void;
}
```

## Data Flow

### Input Processing Flow
1. `FilterRequest` → Segment validation → Normalized segments
2. Normalized segments → Total length calculation → Dictionary pre-filtering
3. Pre-filtered words → Segment-by-segment validation → Results

### Error Propagation Flow
1. Input validation errors → `FilterError` with `validation` type
2. Constraint impossibility → `FilterError` with `constraint` type  
3. Runtime processing errors → `FilterError` with `processing` type
4. All errors include detailed context in `details` object

### State Management Flow
1. User input → `FilterRequest` creation
2. Request validation → Early error return or processing continuation
3. Dictionary filtering → Progressive result building
4. Result finalization → Alphabetical sorting and metadata attachment