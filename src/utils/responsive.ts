/**
 * Responsive utility functions for mobile-first design
 * Supports touch targets, viewport detection, and responsive calculations
 */

export interface ResponsiveBreakpoints {
  mobile: number;
  tablet: number;
  desktop: number;
}

export const BREAKPOINTS: ResponsiveBreakpoints = {
  mobile: 640,   // sm breakpoint
  tablet: 768,   // md breakpoint  
  desktop: 1024, // lg breakpoint
};

export type BreakpointName = 'mobile' | 'tablet' | 'desktop';

/**
 * Determine current breakpoint based on viewport width
 */
export function getBreakpoint(width: number): BreakpointName {
  if (width < BREAKPOINTS.mobile) {
    return 'mobile';
  } else if (width < BREAKPOINTS.desktop) {
    return 'tablet';
  } else {
    return 'desktop';
  }
}

/**
 * Check if current viewport is mobile
 */
export function isMobile(width: number): boolean {
  return width < BREAKPOINTS.mobile;
}

/**
 * Check if current viewport is tablet
 */
export function isTablet(width: number): boolean {
  return width >= BREAKPOINTS.mobile && width < BREAKPOINTS.desktop;
}

/**
 * Check if current viewport is desktop
 */
export function isDesktop(width: number): boolean {
  return width >= BREAKPOINTS.desktop;
}

/**
 * Touch target size constants for accessibility compliance
 */
export const TOUCH_TARGETS = {
  MINIMUM: 44,     // WCAG AA minimum touch target size
  RECOMMENDED: 48, // Recommended touch target size
  SPACING: 8,      // Minimum spacing between touch targets
} as const;

/**
 * Validate if an element meets touch target requirements
 */
export function validateTouchTarget(
  width: number,
  height: number,
  minSize: number = TOUCH_TARGETS.MINIMUM
): boolean {
  return width >= minSize && height >= minSize;
}

/**
 * Get responsive grid columns based on breakpoint
 */
export function getResponsiveColumns(breakpoint: BreakpointName): number {
  switch (breakpoint) {
    case 'mobile':
      return 1;
    case 'tablet':
      return 2;
    case 'desktop':
      return 4;
    default:
      return 1;
  }
}

/**
 * Detect device orientation from viewport dimensions
 */
export function getOrientation(width: number, height: number): 'portrait' | 'landscape' {
  return height > width ? 'portrait' : 'landscape';
}

/**
 * Detect if device supports touch events
 */
export function supportsTouchEvents(): boolean {
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    // @ts-expect-error - msMaxTouchPoints is IE specific
    navigator.msMaxTouchPoints > 0
  );
}

/**
 * Typography utilities for responsive design
 */
export const RESPONSIVE_TYPOGRAPHY = {
  MIN_FONT_SIZE: 16,    // Minimum font size for mobile (prevents iOS zoom)
  LINE_HEIGHT: 1.5,     // Recommended line height for readability
  HEADING_SCALE: {
    mobile: 1.2,
    tablet: 1.3,
    desktop: 1.4,
  },
} as const;

/**
 * Get appropriate font size based on breakpoint
 */
export function getResponsiveFontSize(
  baseFontSize: number,
  breakpoint: BreakpointName
): number {
  const minSize = RESPONSIVE_TYPOGRAPHY.MIN_FONT_SIZE;
  const scaledSize = baseFontSize * RESPONSIVE_TYPOGRAPHY.HEADING_SCALE[breakpoint];
  
  return Math.max(minSize, scaledSize);
}

/**
 * Throttle function for performance optimization of resize events
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let lastExecTime = 0;
  
  return (...args: Parameters<T>) => {
    const currentTime = Date.now();
    
    if (currentTime - lastExecTime > delay) {
      func(...args);
      lastExecTime = currentTime;
    } else {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      
      timeoutId = setTimeout(() => {
        func(...args);
        lastExecTime = Date.now();
      }, delay - (currentTime - lastExecTime));
    }
  };
}

/**
 * Debounce function for resize events
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    timeoutId = setTimeout(() => func(...args), delay);
  };
}