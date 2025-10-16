# Component Interface Contracts

**Feature**: WordSegmentInput Component Enhancement  
**Date**: October 16, 2025  
**Type**: Component API Specification

## SegmentInput Component Interface

### Props Contract

```typescript
interface SegmentInputProps {
  /** Current segment configuration */
  segment: Segment;
  /** Called when segment configuration changes (real-time) */
  onChange: (segment: Segment) => void;
  /** Called when segment should be removed */
  onRemove: () => void;
  /** Display index for user-friendly labeling (0-based) */
  index: number;
  /** Whether the remove button should be disabled */
  canRemove: boolean;
  /** Validation error message for this segment */
  error?: string;
  /** Optional: Maximum segments allowed (for UI feedback) */
  maxSegments?: number;
}
```

### Event Contracts

#### onChange Event
**Trigger**: Immediately when user modifies input fields  
**Frequency**: Real-time (no debouncing)  
**Data**: Updated segment with validated/normalized values

```typescript
// Input transformation example
const handleLettersChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const rawInput = event.target.value;
  const normalizedInput = rawInput.toLowerCase().replace(/[^a-z]/g, '');
  
  onChange({
    ...segment,
    availableLetters: normalizedInput
  });
};
```

#### onRemove Event  
**Trigger**: User clicks remove button  
**Precondition**: `canRemove` must be true  
**Effect**: Parent removes segment from collection

```typescript
const handleRemove = () => {
  if (canRemove) {
    onRemove();
  }
};
```

### Validation Contract

#### Input Validation Rules
```typescript
interface ValidationRules {
  availableLetters: {
    pattern: /^[a-zA-Z]*$/;
    transform: (input: string) => input.toLowerCase();
    errorMessage: "Only letters (a-z) are allowed";
  };
  
  targetLength: {
    min: 1;
    max: 10;
    type: "integer";
    errorMessage: "Length must be between 1 and 10";
  };
}
```

#### Real-time Validation Flow
1. User input → Input handler
2. Input validation → Error state update  
3. Value normalization → Segment state update
4. Parent notification → onChange callback
5. UI feedback → Error message display

## Parent Component Integration

### WordFilterForm Integration

```typescript
interface WordFilterFormState {
  segments: Segment[];
  validationErrors: Record<number, string>;
  totalLength: number;
  canAddSegment: boolean;
}

// Parent component responsibilities
interface ParentComponentContract {
  /** Add new segment to collection */
  addSegment: () => void;
  
  /** Remove segment by index */
  removeSegment: (index: number) => void;
  
  /** Update specific segment */
  updateSegment: (index: number, segment: Segment) => void;
  
  /** Validate entire segment collection */
  validateCollection: () => boolean;
  
  /** Calculate total length across all segments */
  calculateTotalLength: () => number;
}
```

### State Management Contract

#### Segment Collection Management
```typescript
// Add segment constraint
function addSegment(segments: Segment[]): Segment[] | ValidationError {
  if (segments.length >= 5) {
    return { type: 'validation', message: 'Maximum 5 segments allowed' };
  }
  
  return [...segments, { availableLetters: '', targetLength: 1 }];
}

// Remove segment constraint  
function removeSegment(segments: Segment[], index: number): Segment[] | ValidationError {
  if (segments.length <= 1) {
    return { type: 'validation', message: 'At least one segment required' };
  }
  
  return segments.filter((_, i) => i !== index);
}
```

## Utility Function Contracts

### Validation Utilities

```typescript
interface ValidationUtilities {
  /** Validate letters input and return error if invalid */
  validateLetters: (input: string) => ValidationError | null;
  
  /** Validate length input and return error if invalid */
  validateLength: (length: number) => ValidationError | null;
  
  /** Normalize letter input (lowercase, alphabetic only) */
  normalizeLetters: (input: string) => string;
  
  /** Check if segment collection is valid */
  isCollectionValid: (segments: Segment[]) => boolean;
}
```

### Performance Contracts

#### Memoization Strategy
```typescript
// Derived state calculations
const totalLength = useMemo(() => 
  segments.reduce((sum, segment) => sum + segment.targetLength, 0), 
  [segments]
);

const canAddSegment = useMemo(() => 
  segments.length < 5, 
  [segments.length]
);

const validationState = useMemo(() => 
  segments.map((segment, index) => ({
    index,
    isValid: validateSegment(segment) === null
  })), 
  [segments]
);
```

#### Re-render Optimization
- **Stable callbacks**: Use `useCallback` for event handlers
- **Selective updates**: Only re-render changed segments  
- **Validation caching**: Cache validation results per segment

## Error Handling Contracts

### Error Display Strategy
```typescript
interface ErrorDisplayContract {
  /** Where to display validation errors */
  location: 'below-segment';
  
  /** When to show validation errors */
  trigger: 'real-time';
  
  /** Error message format */
  format: {
    type: 'text';
    styling: 'red-600 bg-red-50 border-red-200';
    accessibility: 'aria-describedby';
  };
}
```

### Error State Management
```typescript
interface ErrorState {
  /** Segment-specific errors keyed by index */
  segmentErrors: Record<number, string>;
  
  /** Collection-level errors */
  collectionErrors: string[];
  
  /** Whether search should be disabled */
  hasBlockingErrors: boolean;
}
```

## Accessibility Contracts

### ARIA Support
```typescript
interface AccessibilityContract {
  /** Labels for screen readers */
  labels: {
    segmentGroup: `Segment ${index + 1}`;
    lettersInput: `Available letters for segment ${index + 1}`;
    lengthInput: `Target length for segment ${index + 1}`;
    removeButton: `Remove segment ${index + 1}`;
    errorMessage: `Error for segment ${index + 1}`;
  };
  
  /** ARIA attributes */
  aria: {
    'aria-describedby': string; // Links input to error message
    'aria-invalid': boolean;    // Indicates validation state
    'aria-required': true;      // Both fields are required
  };
}
```

### Keyboard Navigation
- **Tab order**: Letters input → Length input → Remove button → Next segment
- **Enter key**: No special behavior (prevents accidental form submission)
- **Escape key**: No behavior (focused input handling only)

## Integration Testing Contracts

### Component Testing Interface
```typescript
interface TestingContract {
  /** Props for testing scenarios */
  testProps: {
    validSegment: Segment;
    invalidLettersSegment: Segment;  
    invalidLengthSegment: Segment;
    emptySegment: Segment;
  };
  
  /** Expected behaviors */
  expectations: {
    realTimeValidation: 'Error appears immediately on invalid input';
    caseNormalization: 'Mixed case input becomes lowercase';
    lengthConstraints: 'Length outside 1-10 range shows error';
    removeConstraints: 'Cannot remove last remaining segment';
  };
}
```