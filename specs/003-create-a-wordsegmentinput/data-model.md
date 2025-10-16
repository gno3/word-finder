# Data Model: WordSegmentInput Component Enhancement

**Feature**: WordSegmentInput Component  
**Date**: October 16, 2025  
**Source**: Extracted from feature specification and existing codebase analysis

## Core Entities

### Segment (Existing - Enhanced)
**Source**: `src/types/wordFilter.ts`  
**Purpose**: Represents a word segment with validation constraints

```typescript
interface Segment {
  /** Available letters for this segment (lowercase, validated) */
  availableLetters: string;
  /** Target length (1-10, validated) */
  targetLength: number;
}
```

**Validation Rules**:
- `availableLetters`: Must contain only a-z characters, automatically converted to lowercase
- `targetLength`: Must be positive integer between 1-10 inclusive

**State Transitions**:
- Creation: Empty segment with `availableLetters: ""`, `targetLength: 1`
- Validation: Invalid → Valid when both fields meet criteria
- Deletion: Any segment except when only one remains

### SegmentCollection (New)
**Purpose**: Manages array of segments with collection-level validation

```typescript
interface SegmentCollection {
  /** Array of segments (1-5 segments allowed) */
  segments: Segment[];
  /** Total calculated length across all segments */
  totalLength: number;
  /** Collection-level validation state */
  isValid: boolean;
}
```

**Constraints**:
- Minimum 1 segment (cannot remove last segment)
- Maximum 5 segments (add button disabled at limit)
- `totalLength` derived from sum of all `segment.targetLength` values

### SegmentValidationState (New)
**Purpose**: Tracks validation state for real-time feedback

```typescript
interface SegmentValidationState {
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
```

**Error Messages**:
- `availableLetters`: "Only letters (a-z) are allowed"
- `targetLength`: "Length must be between 1 and 10"

### ValidationError (Enhanced)
**Source**: Extends existing `FilterError` from `src/types/wordFilter.ts`  
**Purpose**: Structured error reporting for validation failures

```typescript
interface ValidationError {
  /** Error category */
  type: 'validation';
  /** User-friendly error message */
  message: string;
  /** Field that caused the error */
  field: 'availableLetters' | 'targetLength' | 'segmentCount';
  /** Segment index if applicable */
  segmentIndex?: number;
}
```

## Component State Structure

### Primary Component State
```typescript
interface SegmentInputState {
  /** Array of segments */
  segments: Segment[];
  /** Validation errors keyed by segment index */
  validationErrors: Record<number, SegmentValidationState>;
  /** Whether add segment button is enabled */
  canAddSegment: boolean;
  /** Derived total length */
  totalLength: number;
}
```

### State Management Patterns
- **Segments Array**: Managed with `useState<Segment[]>`
- **Validation**: Managed with `useState<Record<number, SegmentValidationState>>`
- **Derived Values**: Calculated with `useMemo` hooks
- **Real-time Updates**: Triggered on every `onChange` event

## Data Flow

### Input Validation Flow
1. User types in input field
2. `onChange` handler captures input
3. Validation function processes input immediately
4. Error state updated if validation fails
5. Parent component notified of valid/invalid state
6. UI updates to show validation feedback

### Segment Management Flow
1. **Add Segment**: 
   - Check count < 5
   - Add new empty segment to array
   - Initialize validation state for new segment
2. **Remove Segment**:
   - Check count > 1
   - Remove segment from array
   - Clean up validation state
   - Recalculate total length

### Case Normalization Flow
1. User enters mixed case letters (e.g., "AbC")
2. Input handler converts to lowercase ("abc")
3. Segment state updated with normalized value
4. Input field displays normalized value

## Validation Rules Implementation

### Available Letters Validation
```typescript
function validateAvailableLetters(input: string): ValidationError | null {
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
```

### Target Length Validation  
```typescript
function validateTargetLength(length: number): ValidationError | null {
  if (!Number.isInteger(length) || length < 1 || length > 10) {
    return {
      type: 'validation', 
      message: 'Length must be between 1 and 10',
      field: 'targetLength'
    };
  }
  return null;
}
```

### Segment Count Validation
```typescript  
function validateSegmentCount(count: number): ValidationError | null {
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
      message: 'Maximum 5 segments allowed',
      field: 'segmentCount'
    };
  }
  return null;
}
```

## Performance Considerations

### State Updates
- **Debouncing**: Not used - specification requires real-time validation
- **Memoization**: Used for derived calculations (total length)
- **Selective Rendering**: Component re-renders only affected segments

### Memory Management
- **Validation State**: Cleaned up when segments removed
- **Event Handlers**: Stable references using useCallback where beneficial
- **Derived State**: Calculated only when dependencies change

## Integration with Existing Types

### Compatibility
- Maintains existing `Segment` interface from `wordFilter.ts`
- Extends existing `FilterError` patterns
- Compatible with existing `useWordFilter` hook

### Migration Strategy
- No breaking changes to existing `Segment` interface
- New validation interfaces added alongside existing types
- Existing components continue to work unchanged