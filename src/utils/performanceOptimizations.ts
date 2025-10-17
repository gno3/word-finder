/**
 * Performance Optimization Utilities for Responsive Layouts
 * 
 * Provides optimization tools for responsive layout calculations,
 * viewport change handling, and component rendering performance.
 * 
 * Features:
 * - Debounced resize handling
 * - Memoized breakpoint calculations
 * - Optimized viewport change detection
 * - Lazy loading and virtual scrolling support
 * - Performance monitoring utilities
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

// Performance configuration constants
export const PERFORMANCE_CONFIG = {
  // Debounce delays (in milliseconds)
  RESIZE_DEBOUNCE: 150,
  SCROLL_DEBOUNCE: 16, // ~60fps
  ORIENTATION_DEBOUNCE: 100,
  
  // Throttle intervals
  VIEWPORT_THROTTLE: 100,
  LAYOUT_THROTTLE: 200,
  
  // Performance thresholds
  MAX_RENDER_TIME: 16, // 60fps = 16.67ms per frame
  MAX_LAYOUT_NODES: 1000,
  
  // Cache settings
  BREAKPOINT_CACHE_SIZE: 10,
  LAYOUT_CACHE_TTL: 5000 // 5 seconds
} as const;

// Debounce utility for performance optimization
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): T => {
  let timeoutId: NodeJS.Timeout;
  
  return ((...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  }) as T;
};

// Throttle utility for performance optimization
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  interval: number
): T => {
  let lastCall = 0;
  
  return ((...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= interval) {
      lastCall = now;
      return func(...args);
    }
  }) as T;
};

// Memoized breakpoint calculation
export const useMemoizedBreakpoint = (width: number) => {
  return useMemo(() => {
    if (width < 640) return 'mobile';
    if (width < 768) return 'tablet-sm';
    if (width < 1024) return 'tablet';
    if (width < 1280) return 'desktop';
    return 'desktop-lg';
  }, [width]);
};

// Optimized viewport hook with performance enhancements
export const useOptimizedViewport = () => {
  const [dimensions, setDimensions] = useState(() => ({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768
  }));
  
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>(() => {
    if (typeof window === 'undefined') return 'landscape';
    return window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
  });

  // Memoized breakpoint calculation
  const breakpoint = useMemoizedBreakpoint(dimensions.width);
  
  // Memoized derived values
  const derived = useMemo(() => ({
    isMobile: breakpoint === 'mobile',
    isTablet: breakpoint === 'tablet-sm' || breakpoint === 'tablet',
    isDesktop: breakpoint === 'desktop' || breakpoint === 'desktop-lg',
    aspectRatio: dimensions.width / dimensions.height,
    isLandscape: orientation === 'landscape',
    isPortrait: orientation === 'portrait'
  }), [breakpoint, dimensions.width, dimensions.height, orientation]);

  // Performance-optimized resize handler
  const handleResize = useCallback(
    debounce(() => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;
      const newOrientation = newWidth > newHeight ? 'landscape' : 'portrait';
      
      setDimensions({ width: newWidth, height: newHeight });
      
      // Only update orientation if it actually changed
      if (newOrientation !== orientation) {
        setOrientation(newOrientation);
      }
    }, PERFORMANCE_CONFIG.RESIZE_DEBOUNCE),
    [orientation]
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;

    window.addEventListener('resize', handleResize, { passive: true });
    
    // Also listen for orientation change events
    const handleOrientationChange = debounce(() => {
      // Small delay to let the browser finish orientation change
      setTimeout(() => {
        const newWidth = window.innerWidth;
        const newHeight = window.innerHeight;
        const newOrientation = newWidth > newHeight ? 'landscape' : 'portrait';
        
        setDimensions({ width: newWidth, height: newHeight });
        setOrientation(newOrientation);
      }, 100);
    }, PERFORMANCE_CONFIG.ORIENTATION_DEBOUNCE);

    window.addEventListener('orientationchange', handleOrientationChange, { passive: true });
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, [handleResize]);

  return {
    ...dimensions,
    ...derived,
    breakpoint,
    orientation
  };
};

// Performance monitoring hook
export const usePerformanceMonitor = (componentName: string) => {
  const renderStartTime = useRef<number>(0);
  const [metrics, setMetrics] = useState({
    renderCount: 0,
    averageRenderTime: 0,
    maxRenderTime: 0,
    lastRenderTime: 0
  });

  useEffect(() => {
    renderStartTime.current = performance.now();
  });

  useEffect(() => {
    const renderTime = performance.now() - renderStartTime.current;
    
    setMetrics(prev => {
      const newRenderCount = prev.renderCount + 1;
      const newAverageRenderTime = (prev.averageRenderTime * prev.renderCount + renderTime) / newRenderCount;
      const newMaxRenderTime = Math.max(prev.maxRenderTime, renderTime);
      
      // Log performance warnings in development
      if (process.env.NODE_ENV === 'development') {
        if (renderTime > PERFORMANCE_CONFIG.MAX_RENDER_TIME) {
          console.warn(`⚡ Performance Warning: ${componentName} render took ${renderTime.toFixed(2)}ms (target: <${PERFORMANCE_CONFIG.MAX_RENDER_TIME}ms)`);
        }
      }
      
      return {
        renderCount: newRenderCount,
        averageRenderTime: newAverageRenderTime,
        maxRenderTime: newMaxRenderTime,
        lastRenderTime: renderTime
      };
    });
  });

  return metrics;
};

// Optimized responsive grid calculations
export const useOptimizedGridLayout = (
  containerWidth: number,
  itemMinWidth: number = 250,
  gap: number = 16
) => {
  return useMemo(() => {
    const availableWidth = containerWidth - gap;
    const itemWidthWithGap = itemMinWidth + gap;
    const columns = Math.max(1, Math.floor(availableWidth / itemWidthWithGap));
    const itemWidth = (availableWidth - (gap * (columns - 1))) / columns;
    
    return {
      columns,
      itemWidth: Math.floor(itemWidth),
      gridTemplateColumns: `repeat(${columns}, 1fr)`
    };
  }, [containerWidth, itemMinWidth, gap]);
};

// Intersection Observer hook for lazy loading
export const useIntersectionObserver = (
  options: IntersectionObserverInit = {}
) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const targetRef = useRef<Element | null>(null);

  useEffect(() => {
    const target = targetRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, {
      threshold: 0.1,
      rootMargin: '50px',
      ...options
    });

    observer.observe(target);

    return () => {
      observer.unobserve(target);
    };
  }, [options]);

  return [targetRef, isIntersecting] as const;
};

// Optimized scroll handling
export const useOptimizedScroll = (callback: (scrollY: number) => void) => {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    const handleScroll = throttle(() => {
      callbackRef.current(window.scrollY);
    }, PERFORMANCE_CONFIG.SCROLL_DEBOUNCE);

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
};

// Component-specific optimizations for WordFilter
export const useWordFilterOptimizations = () => {
  const viewport = useOptimizedViewport();
  const performanceMetrics = usePerformanceMonitor('WordFilter');
  
  // Memoized layout calculations
  const layoutConfig = useMemo(() => ({
    // Grid configuration based on viewport
    gridColumns: viewport.isMobile ? 1 : viewport.isTablet ? 2 : 3,
    
    // Spacing optimizations
    containerPadding: viewport.isMobile ? '1rem' : '2rem',
    sectionGap: viewport.isMobile ? '1.5rem' : '2rem',
    
    // Touch targets
    minTouchTarget: 44,
    
    // Typography scaling
    baseFontSize: viewport.isMobile ? '0.875rem' : '1rem',
    headingScale: viewport.isMobile ? 1.25 : 1.5
  }), [viewport.isMobile, viewport.isTablet]);

  // Optimized form validation debouncing
  const debouncedValidation = useCallback(
    debounce((validationFn: () => void) => {
      validationFn();
    }, 300),
    []
  );

  // Optimized results rendering
  const shouldRenderResults = useCallback((resultCount: number) => {
    // Don't render huge result sets immediately
    if (resultCount > 100) {
      return false; // Could implement virtualization
    }
    return true;
  }, []);

  return {
    viewport,
    layoutConfig,
    performanceMetrics,
    debouncedValidation,
    shouldRenderResults,
    
    // Performance utilities
    debounce: useCallback(debounce, []),
    throttle: useCallback(throttle, [])
  };
};

// React.memo optimization helper
export const createMemoizedComponent = <T extends Record<string, any>>(
  Component: React.ComponentType<T>,
  propsAreEqual?: (prevProps: T, nextProps: T) => boolean
) => {
  return React.memo(Component, propsAreEqual);
};

// Default props equality checker for common responsive props
export const responsivePropsAreEqual = <T extends { isMobile?: boolean; isTablet?: boolean; breakpoint?: string }>(
  prevProps: T,
  nextProps: T
): boolean => {
  return (
    prevProps.isMobile === nextProps.isMobile &&
    prevProps.isTablet === nextProps.isTablet &&
    prevProps.breakpoint === nextProps.breakpoint
  );
};

// Performance-optimized CSS class generator
export const generateResponsiveClasses = (
  baseClasses: string,
  responsiveClasses: Record<string, string>,
  breakpoint: string
): string => {
  const classes = [baseClasses];
  
  if (responsiveClasses[breakpoint]) {
    classes.push(responsiveClasses[breakpoint]);
  }
  
  return classes.filter(Boolean).join(' ');
};

// Bundle size optimization - lazy load heavy components
export const createLazyComponent = <T extends Record<string, any>>(
  importFn: () => Promise<{ default: React.ComponentType<T> }>
) => {
  return React.lazy(importFn);
};

export default {
  useOptimizedViewport,
  usePerformanceMonitor,
  useOptimizedGridLayout,
  useIntersectionObserver,
  useOptimizedScroll,
  useWordFilterOptimizations,
  createMemoizedComponent,
  responsivePropsAreEqual,
  generateResponsiveClasses,
  createLazyComponent,
  debounce,
  throttle,
  PERFORMANCE_CONFIG
};