# Component API Contracts: Mobile Responsiveness and UI Polish

**Feature**: Mobile Responsiveness and UI Polish  
**Date**: October 16, 2025  
**Purpose**: Define component interfaces and responsive behavior contracts

## Reset Functionality Contracts

### useResetState Hook

**Purpose**: Manages reset operation state and provides reset functionality to components

```typescript
interface UseResetStateReturn {
  // State
  isResetting: boolean;
  showConfirmation: boolean;
  resetError: string | null;
  
  // Actions
  initiateReset: () => void;
  confirmReset: () => Promise<void>;
  cancelReset: () => void;
  clearError: () => void;
}

interface UseResetStateConfig {
  onResetComplete?: () => void;
  onResetError?: (error: string) => void;
  preserveSettings?: boolean;
}

function useResetState(config?: UseResetStateConfig): UseResetStateReturn
```

**Behavior Contract**:
- `initiateReset()` sets `showConfirmation` to true
- `confirmReset()` executes reset logic and handles success/error states
- `cancelReset()` returns to idle state without changes
- `clearError()` clears error state allowing retry
- Hook manages all state transitions according to data model

### ResetButton Component

**Purpose**: Renders reset button with confirmation dialog and loading states

```typescript
interface ResetButtonProps {
  disabled?: boolean;
  className?: string;
  onResetComplete?: () => void;
  confirmationTitle?: string;
  confirmationMessage?: string;
}

function ResetButton(props: ResetButtonProps): JSX.Element
```

**Behavior Contract**:
- Button disabled during reset operation
- Shows confirmation dialog before executing reset
- Displays loading spinner during reset operation
- Shows error message if reset fails
- Positioned at bottom of segment form area per specification

## Responsive Design Contracts

### useViewport Hook

**Purpose**: Provides viewport information and responsive breakpoint data

```typescript
interface UseViewportReturn {
  width: number;
  height: number;
  breakpoint: 'mobile' | 'tablet' | 'desktop';
  orientation: 'portrait' | 'landscape';
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  touchSupport: boolean;
}

function useViewport(): UseViewportReturn
```

**Behavior Contract**:
- Updates on window resize (throttled to 100ms)
- Provides boolean helpers for common responsive checks
- Detects touch support capability
- Calculates breakpoints: mobile (<640px), tablet (640-1024px), desktop (>1024px)

### ResponsiveWrapper Component

**Purpose**: Wraps components with responsive behavior and touch target compliance

```typescript
interface ResponsiveWrapperProps {
  children: React.ReactNode;
  minTouchTarget?: boolean;
  mobileLayout?: React.ReactNode;
  tabletLayout?: React.ReactNode;
  desktopLayout?: React.ReactNode;
  className?: string;
}

function ResponsiveWrapper(props: ResponsiveWrapperProps): JSX.Element
```

**Behavior Contract**:
- Applies minimum 44px touch targets when `minTouchTarget` is true
- Renders appropriate layout based on current viewport
- Falls back to `children` if specific layout not provided
- Maintains accessibility compliance automatically

## Enhanced Component Contracts

### WordFilterForm (Enhanced)

**Purpose**: Main form component with reset functionality and mobile responsiveness

```typescript
interface WordFilterFormProps {
  // Existing props maintained
  segments: Segment[];
  onSegmentChange: (index: number, segment: Segment) => void;
  onAddSegment: () => void;
  onRemoveSegment: (index: number) => void;
  onSubmit: (segments: Segment[]) => void;
  
  // New responsive props
  onReset?: () => void;
  resetDisabled?: boolean;
  mobileOptimized?: boolean;
}
```

**Responsive Behavior Contract**:
- Stacks form elements vertically on mobile (<640px)
- Uses grid layout on tablet and desktop
- Reset button positioned at bottom of form area
- Touch targets minimum 44px on mobile devices
- Form validation adapted for mobile input patterns

### SegmentInput (Enhanced)

**Purpose**: Individual segment input with responsive layout and touch optimization

```typescript
interface SegmentInputProps {
  // Existing props maintained
  segment: Segment;
  onChange: (segment: Segment) => void;
  onRemove: () => void;
  index: number;
  canRemove: boolean;
  error?: string;
  
  // New responsive props
  mobileLayout?: boolean;
  touchOptimized?: boolean;
}
```

**Responsive Behavior Contract**:
- Input fields stack vertically on mobile
- Maintains 44px minimum touch target for all inputs
- Font size minimum 16px to prevent iOS zoom
- Error messages display below inputs on mobile
- Remove button sized appropriately for touch interaction

### FilterResults (Enhanced)

**Purpose**: Results display with responsive grid layout

```typescript
interface FilterResultsProps {
  // Existing props maintained
  result: FilterResult | null;
  isLoading: boolean;
  error: FilterError | null;
  
  // New responsive props
  gridLayout?: 'auto' | 'single' | 'grid';
  mobileColumns?: number;
  tabletColumns?: number;
  desktopColumns?: number;
}
```

**Responsive Behavior Contract**:
- Single column on mobile (320px-640px)
- 2-3 columns on tablet (640px-1024px)
- 4-5 columns on desktop (>1024px)
- Handles long words with text wrapping or truncation
- Maintains readable text size across all viewports

## Accessibility Contracts

### Touch Target Compliance

All interactive elements must meet:
- Minimum 44px x 44px touch target size
- Minimum 8px spacing between adjacent targets
- Appropriate focus indicators for keyboard navigation
- ARIA labels for screen reader compatibility

### Contrast Compliance

All text elements must meet:
- 4.5:1 contrast ratio for normal text (14-18px)
- 3:1 contrast ratio for large text (18px+ or bold 14px+)
- Color not used as only means of conveying information
- Focus indicators have sufficient contrast

### Responsive Text Requirements

Typography must maintain:
- Minimum 16px font size on mobile to prevent zoom
- Line height of 1.5 for readability
- Adequate spacing between lines and paragraphs
- Scalable text that adapts to user accessibility settings

## Error Handling Contracts

### Reset Error Handling

```typescript
interface ResetErrorState {
  hasError: boolean;
  errorMessage: string;
  canRetry: boolean;
  retryAction: () => void;
}
```

**Error Boundary Behavior**:
- Graceful degradation if reset fails
- Clear error messaging to users
- Preserve application state on reset failure
- Provide retry mechanism for transient failures

### Responsive Layout Error Handling

- Layout falls back to mobile-first approach on calculation errors
- Maintains minimum touch targets even if responsive calculations fail
- Provides default spacing and sizing when viewport detection fails
- Maintains accessibility compliance in all error states

## Testing Contracts

### Viewport Testing

Components must pass responsive testing at:
- 320px width (iPhone SE)
- 375px width (iPhone 12)
- 768px width (iPad)
- 1024px width (Desktop)
- 1440px width (Large Desktop)

### Touch Target Testing

All interactive elements verified for:
- 44px minimum size in all responsive states
- Adequate spacing between elements
- Proper touch event handling
- Accessibility tool compliance

### Reset Functionality Testing

Reset operations must be tested for:
- Successful completion with state clearing
- Error handling and recovery
- Confirmation dialog functionality
- Performance under various application states

This contract specification ensures consistent implementation of responsive design and reset functionality across all components while maintaining constitutional compliance and accessibility standards.