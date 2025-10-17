/**
 * Smooth Transition System for Responsive Layout Changes
 * 
 * Provides smooth, accessible transitions for viewport changes,
 * orientation adjustments, and responsive layout modifications.
 * 
 * Features:
 * - Orientation change transitions
 * - Viewport size adjustment animations
 * - Layout reflow smoothing
 * - Accessibility-aware motion controls
 * - Performance-optimized animations
 */

import React from 'react';

// Transition configuration constants
export const TRANSITION_CONFIG = {
  // Duration presets (in milliseconds)
  duration: {
    fast: 150,
    normal: 250,
    slow: 400,
    orientation: 300
  },
  
  // Easing functions
  easing: {
    easeOut: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    easeInOut: 'cubic-bezier(0.42, 0, 0.58, 1)',
    spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    smooth: 'cubic-bezier(0.4, 0.0, 0.2, 1)'
  },
  
  // Animation properties
  properties: {
    layout: ['width', 'height', 'padding', 'margin', 'gap'],
    transform: ['transform', 'opacity'],
    color: ['background-color', 'border-color', 'color'],
    all: ['all']
  }
} as const;

// CSS custom properties for dynamic transitions
export const TRANSITION_CSS_VARS = {
  '--transition-duration-fast': `${TRANSITION_CONFIG.duration.fast}ms`,
  '--transition-duration-normal': `${TRANSITION_CONFIG.duration.normal}ms`,
  '--transition-duration-slow': `${TRANSITION_CONFIG.duration.slow}ms`,
  '--transition-duration-orientation': `${TRANSITION_CONFIG.duration.orientation}ms`,
  '--transition-easing-smooth': TRANSITION_CONFIG.easing.smooth,
  '--transition-easing-spring': TRANSITION_CONFIG.easing.spring
} as const;

// Responsive transition utilities
export const transitionUtils = {
  /**
   * Generate CSS transition string
   */
  createTransition: (
    properties: string[],
    duration: number = TRANSITION_CONFIG.duration.normal,
    easing: string = TRANSITION_CONFIG.easing.smooth
  ): string => {
    return properties
      .map(prop => `${prop} ${duration}ms ${easing}`)
      .join(', ');
  },

  /**
   * Get optimized transition for layout changes
   */
  getLayoutTransition: (includeTransform: boolean = false): string => {
    const props: string[] = ['width', 'height', 'padding', 'margin', 'gap'];
    if (includeTransform) {
      props.push('transform', 'opacity');
    }
    return transitionUtils.createTransition(props, TRANSITION_CONFIG.duration.normal);
  },

  /**
   * Get transition for color changes
   */
  getColorTransition: (): string => {
    const colorProps: string[] = ['background-color', 'border-color', 'color'];
    return transitionUtils.createTransition(colorProps, TRANSITION_CONFIG.duration.fast);
  },

  /**
   * Get smooth transform transition
   */
  getTransformTransition: (): string => {
    const transformProps: string[] = ['transform', 'opacity'];
    return transitionUtils.createTransition(
      transformProps,
      TRANSITION_CONFIG.duration.normal,
      TRANSITION_CONFIG.easing.spring
    );
  }
};

// Tailwind CSS classes for common transitions
export const TRANSITION_CLASSES = {
  // Layout transitions
  layout: 'transition-all duration-300 ease-out',
  layoutFast: 'transition-all duration-150 ease-out',
  layoutSlow: 'transition-all duration-500 ease-out',
  
  // Transform transitions
  transform: 'transition-transform duration-300 ease-spring',
  hover: 'transition-transform duration-200 hover:scale-105',
  
  // Color transitions
  colors: 'transition-colors duration-200 ease-out',
  
  // Opacity transitions
  opacity: 'transition-opacity duration-300 ease-out',
  
  // Comprehensive transitions
  smooth: 'transition-all duration-300 ease-[cubic-bezier(0.4,0.0,0.2,1)]',
  responsive: 'transition-[width,height,padding,margin,gap] duration-300 ease-out'
} as const;

// Motion preference detection and accessibility
export const motionUtils = {
  /**
   * Check if user prefers reduced motion
   */
  prefersReducedMotion: (): boolean => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  },

  /**
   * Get accessible transition duration
   */
  getAccessibleDuration: (defaultDuration: number): number => {
    return motionUtils.prefersReducedMotion() ? 0 : defaultDuration;
  },

  /**
   * Create accessible transition classes
   */
  getAccessibleTransitionClass: (baseClass: string): string => {
    if (motionUtils.prefersReducedMotion()) {
      return 'motion-reduce:transition-none';
    }
    return baseClass;
  }
};

// React hook for smooth orientation transitions
export const useOrientationTransition = () => {
  const [isTransitioning, setIsTransitioning] = React.useState(false);
  const [orientation, setOrientation] = React.useState<'portrait' | 'landscape'>(() => {
    if (typeof window === 'undefined') return 'landscape';
    return window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
  });

  React.useEffect(() => {
    const handleOrientationChange = () => {
      setIsTransitioning(true);
      
      // Determine new orientation
      const newOrientation = window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
      
      // Only update if orientation actually changed
      if (newOrientation !== orientation) {
        setOrientation(newOrientation);
        
        // End transition after animation completes
        const duration = motionUtils.getAccessibleDuration(TRANSITION_CONFIG.duration.orientation);
        setTimeout(() => {
          setIsTransitioning(false);
        }, duration);
      } else {
        setIsTransitioning(false);
      }
    };

    window.addEventListener('orientationchange', handleOrientationChange);
    window.addEventListener('resize', handleOrientationChange);

    return () => {
      window.removeEventListener('orientationchange', handleOrientationChange);
      window.removeEventListener('resize', handleOrientationChange);
    };
  }, [orientation]);

  return {
    orientation,
    isTransitioning,
    transitionClass: motionUtils.getAccessibleTransitionClass(TRANSITION_CLASSES.responsive)
  };
};

// React hook for smooth viewport transitions
export const useViewportTransition = () => {
  const [previousBreakpoint, setPreviousBreakpoint] = React.useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = React.useState(false);

  const handleBreakpointChange = React.useCallback((newBreakpoint: string) => {
    if (previousBreakpoint && newBreakpoint !== previousBreakpoint) {
      setIsTransitioning(true);
      
      const duration = motionUtils.getAccessibleDuration(TRANSITION_CONFIG.duration.normal);
      setTimeout(() => {
        setIsTransitioning(false);
      }, duration);
    }
    setPreviousBreakpoint(newBreakpoint);
  }, [previousBreakpoint]);

  return {
    handleBreakpointChange,
    isTransitioning,
    transitionClass: motionUtils.getAccessibleTransitionClass(TRANSITION_CLASSES.layout)
  };
};

// React hook for smooth layout transitions
export const useLayoutTransition = (dependencies: any[] = []) => {
  const [isAnimating, setIsAnimating] = React.useState(false);

  React.useEffect(() => {
    if (dependencies.length > 0) {
      setIsAnimating(true);
      
      const duration = motionUtils.getAccessibleDuration(TRANSITION_CONFIG.duration.normal);
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, dependencies);

  return {
    isAnimating,
    transitionClass: motionUtils.getAccessibleTransitionClass(TRANSITION_CLASSES.layout),
    smoothClass: motionUtils.getAccessibleTransitionClass(TRANSITION_CLASSES.smooth)
  };
};

// Transition class utilities for components
export const getTransitionClasses = (
  transitionType: 'layout' | 'transform' | 'colors' | 'smooth' = 'smooth',
  disabled: boolean = false
): string => {
  if (disabled) return '';
  return motionUtils.getAccessibleTransitionClass(TRANSITION_CLASSES[transitionType]);
};

// Optimized transition utilities
export const createOptimizedTransitionClasses = (
  show: boolean,
  duration: number = TRANSITION_CONFIG.duration.normal,
  className: string = ''
): string => {
  const transitionClass = motionUtils.getAccessibleTransitionClass(
    `transition-opacity duration-${duration}`
  );
  const opacityClass = show ? 'opacity-100' : 'opacity-0';
  return `${transitionClass} ${opacityClass} ${className}`;
};

// Grid transition utility for responsive grids
export const useGridTransition = (columns: number) => {
  const [previousColumns, setPreviousColumns] = React.useState(columns);
  const [isTransitioning, setIsTransitioning] = React.useState(false);

  React.useEffect(() => {
    if (columns !== previousColumns) {
      setIsTransitioning(true);
      setPreviousColumns(columns);
      
      const duration = motionUtils.getAccessibleDuration(TRANSITION_CONFIG.duration.normal);
      setTimeout(() => {
        setIsTransitioning(false);
      }, duration);
    }
  }, [columns, previousColumns]);

  return {
    isTransitioning,
    transitionStyle: {
      transition: motionUtils.prefersReducedMotion() 
        ? 'none' 
        : transitionUtils.getLayoutTransition(),
      gridTemplateColumns: `repeat(${columns}, 1fr)`
    }
  };
};

// CSS-in-JS styles for complex transitions
export const transitionStyles = {
  /**
   * Smooth container resize
   */
  smoothResize: {
    transition: transitionUtils.getLayoutTransition(),
    willChange: 'width, height',
    transform: 'translateZ(0)' // Force hardware acceleration
  },

  /**
   * Orientation change transition
   */
  orientationChange: {
    transition: transitionUtils.createTransition(
      ['width', 'height', 'transform'],
      TRANSITION_CONFIG.duration.orientation,
      TRANSITION_CONFIG.easing.easeInOut
    )
  },

  /**
   * Card hover effect
   */
  cardHover: {
    transition: transitionUtils.getTransformTransition(),
    '&:hover': {
      transform: 'translateY(-2px) scale(1.02)',
      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)'
    }
  },

  /**
   * Button press effect
   */
  buttonPress: {
    transition: transitionUtils.getTransformTransition(),
    '&:active': {
      transform: 'scale(0.98)',
      transition: transitionUtils.createTransition(
        ['transform'],
        TRANSITION_CONFIG.duration.fast
      )
    }
  }
};

// Default export
export default {
  TRANSITION_CONFIG,
  TRANSITION_CSS_VARS,
  TRANSITION_CLASSES,
  transitionUtils,
  motionUtils,
  useOrientationTransition,
  useViewportTransition,
  useLayoutTransition,
  useGridTransition,
  getTransitionClasses,
  createOptimizedTransitionClasses,
  transitionStyles
};