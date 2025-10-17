# Data Model: Mobile Responsiveness and UI Polish

**Feature**: Mobile Responsiveness and UI Polish  
**Date**: October 16, 2025  
**Purpose**: Define data structures and state management for responsive design and reset functionality

## Core Entities

### ResetState

Represents the application state management for reset operations.

**Purpose**: Manages the complete reset workflow including confirmation, execution, and error handling

**Fields**:
- `isResetting: boolean` - Indicates if reset operation is in progress
- `showConfirmation: boolean` - Controls display of confirmation dialog
- `resetError: string | null` - Error message if reset operation fails
- `lastResetTimestamp: number | null` - Timestamp of last successful reset

**Validation Rules**:
- `isResetting` must be false when `showConfirmation` is true (cannot reset while confirming)
- `resetError` must be cleared when new reset operation begins
- `lastResetTimestamp` must be updated only on successful reset completion
- Reset operation must handle up to 6 segments maximum
- Individual segments may contain up to 15 characters for pattern matching

**State Transitions**:
1. Idle → Confirming: User clicks reset button
2. Confirming → Resetting: User confirms action
3. Confirming → Idle: User cancels action
4. Resetting → Idle: Reset completes successfully
5. Resetting → Error: Reset fails
6. Error → Idle: User acknowledges error

### ViewportState

Represents current viewport configuration and responsive behavior state.

**Purpose**: Tracks viewport dimensions and responsive breakpoint information for layout decisions

**Fields**:
- `width: number` - Current viewport width in pixels
- `height: number` - Current viewport height in pixels
- `breakpoint: 'mobile' | 'tablet' | 'desktop'` - Current responsive breakpoint
- `orientation: 'portrait' | 'landscape'` - Device orientation
- `touchSupport: boolean` - Whether device supports touch interaction

**Validation Rules**:
- `width` must be positive integer
- `height` must be positive integer
- `breakpoint` derived from width: mobile (<640px), tablet (640-1024px), desktop (>1024px)
- `orientation` derived from width/height ratio

**Relationships**:
- Influences layout decisions in all UI components
- No persistent storage required (derived from browser viewport)

### TouchTarget

Represents interactive element sizing and spacing requirements for mobile accessibility.

**Purpose**: Ensures all interactive elements meet accessibility standards for touch interaction

**Fields**:
- `minWidth: number` - Minimum width in pixels (44px per spec)
- `minHeight: number` - Minimum height in pixels (44px per spec)
- `padding: number` - Minimum spacing around target in pixels
- `isAccessible: boolean` - Whether target meets accessibility standards

**Validation Rules**:
- `minWidth` must be >= 44 pixels
- `minHeight` must be >= 44 pixels
- `padding` must be >= 8 pixels for adequate separation
- `isAccessible` is true only when all size requirements met

**Usage Context**:
- Applied to buttons, input fields, clickable elements
- Validated during component rendering
- Used for responsive layout calculations

## Extended Types

### ResponsiveConfig

Configuration object for responsive behavior across components.

```typescript
interface ResponsiveConfig {
  breakpoints: {
    mobile: number;    // 320px minimum
    tablet: number;    // 768px
    desktop: number;   // 1024px
  };
  touchTargets: {
    minimum: number;   // 44px
    recommended: number; // 48px
  };
  typography: {
    minFontSize: number; // 16px
    lineHeight: number;  // 1.5
  };
  spacing: {
    mobile: number[];    // Tailwind spacing scale for mobile
    tablet: number[];    // Tailwind spacing scale for tablet
    desktop: number[];   // Tailwind spacing scale for desktop
  };
  segmentConstraints: {
    maxSegments: number;     // 6 segments maximum
    maxSegmentLength: number; // 15 characters maximum per segment
  };
}
```

### ResetAction

Action payload for reset operations in state management.

```typescript
interface ResetAction {
  type: 'RESET_REQUEST' | 'RESET_CONFIRM' | 'RESET_CANCEL' | 'RESET_SUCCESS' | 'RESET_ERROR';
  payload?: {
    preserveSettings?: boolean;
    errorMessage?: string;
    timestamp?: number;
    segmentCount?: number;        // Track number of segments being reset (max 6)
    hasComplexSegments?: boolean; // Track if segments exceed 10 characters (up to 15)
  };
}
```

## State Management Integration

### Hook Integration

The `useResetState` custom hook will manage:
- ResetState entity lifecycle
- Integration with existing word filter state
- Error boundary coordination
- Confirmation dialog state

### Component State Flow

1. **WordFilterForm Component**: 
   - Consumes ResetState from useResetState hook
   - Renders reset button based on state
   - Handles user interactions for reset initiation

2. **SegmentInput Components**:
   - Consume ViewportState for responsive layout
   - Apply TouchTarget requirements to interactive elements
   - Adapt layout based on breakpoint information

3. **FilterResults Component**:
   - Uses ViewportState for responsive grid layout
   - Adapts word display grid based on viewport size
   - Handles long word truncation on narrow screens

## Data Persistence

**Reset Functionality**: No persistence required - reset clears transient state only

**Viewport State**: No persistence required - derived from browser environment

**User Preferences**: Existing localStorage patterns maintained for any responsive preferences (if added in future)

## Validation Patterns

All responsive and reset-related data validation follows:
- Real-time validation during state transitions
- Type safety through TypeScript interfaces
- Error boundary pattern for graceful failure handling
- Accessibility compliance verification at component level
- Segment count validation (maximum 6 segments)
- Individual segment length validation (maximum 15 characters)
- Performance optimization for handling larger segment configurations

## Performance Considerations

- ViewportState updates throttled to prevent excessive re-renders during window resize
- ResetState kept minimal to reduce memory footprint
- Responsive calculations memoized where appropriate
- No unnecessary state persistence or API calls required

This data model supports the responsive design and reset functionality requirements while maintaining simplicity and performance aligned with constitutional principles.