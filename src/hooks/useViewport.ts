import { useOptimizedViewport } from '../utils/performanceOptimizations.js';
import { getBreakpoint } from '../utils/responsive.js';

/**
 * Hook for responsive design with optimized performance
 * Uses debounced resize handling and memoized calculations
 * Maintains compatibility with existing interface
 */
export const useViewport = () => {
  const optimizedViewport = useOptimizedViewport();
  
  // Convert to existing interface format
  return {
    ...optimizedViewport,
    breakpoint: getBreakpoint(optimizedViewport.width) as 'mobile' | 'tablet' | 'desktop',
    touchSupport: typeof window !== 'undefined' && 'ontouchstart' in window
  };
};