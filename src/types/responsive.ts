/**
 * TypeScript type definitions for responsive design and mobile accessibility
 */

// Re-export types from responsive utilities for convenience
export type { BreakpointName } from '../utils/responsive';

/**
 * Viewport state representation
 */
export interface ViewportState {
  width: number;
  height: number;
  breakpoint: 'mobile' | 'tablet' | 'desktop';
  orientation: 'portrait' | 'landscape';
  touchSupport: boolean;
}

/**
 * Touch target configuration and validation
 */
export interface TouchTarget {
  minWidth: number;    // Minimum width in pixels (44px per WCAG)
  minHeight: number;   // Minimum height in pixels (44px per WCAG)
  padding: number;     // Minimum spacing around target in pixels
  isAccessible: boolean; // Whether target meets accessibility standards
}

/**
 * Touch target validation result
 */
export interface TouchTargetValidation {
  isValid: boolean;
  width: number;
  height: number;
  errors: string[];
  recommendations: string[];
}

/**
 * Responsive configuration for components
 */
export interface ResponsiveConfig {
  breakpoints: {
    mobile: number;    // 640px
    tablet: number;    // 768px  
    desktop: number;   // 1024px
  };
  touchTargets: {
    minimum: number;   // 44px WCAG AA requirement
    recommended: number; // 48px recommended size
    spacing: number;   // 8px minimum spacing
  };
  typography: {
    minFontSize: number; // 16px minimum for mobile
    lineHeight: number;  // 1.5 recommended line height
    scaleRatio: {
      mobile: number;
      tablet: number;
      desktop: number;
    };
  };
}

/**
 * Responsive layout props for components
 */
export interface ResponsiveLayoutProps {
  mobileColumns?: number;
  tabletColumns?: number;
  desktopColumns?: number;
  gridGap?: 'sm' | 'md' | 'lg';
  alignment?: 'start' | 'center' | 'end';
}

/**
 * Component responsive behavior configuration
 */
export interface ResponsiveComponent {
  className?: string;
  mobileOptimized?: boolean;
  touchOptimized?: boolean;
  adaptiveLayout?: boolean;
}

/**
 * Orientation change event data
 */
export interface OrientationChangeEvent {
  orientation: 'portrait' | 'landscape';
  width: number;
  height: number;
  timestamp: number;
}

/**
 * Device capabilities detection
 */
export interface DeviceCapabilities {
  touchSupport: boolean;
  hoverSupport: boolean;
  maxTouchPoints: number;
  pixelRatio: number;
  colorScheme: 'light' | 'dark' | 'no-preference';
}

/**
 * Responsive grid configuration
 */
export interface ResponsiveGrid {
  columns: {
    mobile: number;
    tablet: number; 
    desktop: number;
  };
  gap: {
    mobile: string;
    tablet: string;
    desktop: string;
  };
  alignment: 'start' | 'center' | 'end' | 'stretch';
}

/**
 * Media query helper types
 */
export type MediaQuery = 'mobile' | 'tablet' | 'desktop' | 'touch' | 'hover';

/**
 * Responsive utility function types
 */
export type ResponsiveValue<T> = T | {
  mobile?: T;
  tablet?: T;
  desktop?: T;
};

/**
 * Breakpoint utilities return type
 */
export interface BreakpointUtils {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  current: 'mobile' | 'tablet' | 'desktop';
  matches: (breakpoint: 'mobile' | 'tablet' | 'desktop') => boolean;
}

/**
 * CSS class name mapping for responsive utilities
 */
export interface ResponsiveClassNames {
  container: string;
  grid: {
    mobile: string;
    tablet: string;
    desktop: string;
  };
  spacing: {
    mobile: string;
    tablet: string;
    desktop: string;
  };
  typography: {
    mobile: string;
    tablet: string;
    desktop: string;
  };
}

/**
 * Performance tracking for responsive operations
 */
export interface ResponsivePerformance {
  resizeEventCount: number;
  orientationChangeCount: number;
  lastUpdateTimestamp: number;
  averageUpdateTime: number;
}