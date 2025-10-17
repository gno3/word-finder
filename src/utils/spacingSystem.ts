/**
 * Consistent Spacing System
 * Part of T024 - Apply consistent spacing patterns using Tailwind CSS spacing scale
 * 
 * This module defines standardized spacing patterns for the word-finder application
 * following the 004-responsiveness-and-polish story requirements.
 */

/**
 * Standard spacing scale based on Tailwind CSS design system
 * Each level represents a consistent spacing increment
 */
export const SPACING_SCALE = {
  // Micro spacing (0.25rem increments)
  micro: {
    xs: 'space-x-1 space-y-1',    // 4px
    sm: 'space-x-2 space-y-2',    // 8px
    md: 'space-x-3 space-y-3',    // 12px
    lg: 'space-x-4 space-y-4',    // 16px
  },
  
  // Component spacing (0.5rem increments)
  component: {
    xs: 'space-x-2 space-y-2',    // 8px
    sm: 'space-x-3 space-y-3',    // 12px
    md: 'space-x-4 space-y-4',    // 16px
    lg: 'space-x-6 space-y-6',    // 24px
    xl: 'space-x-8 space-y-8',    // 32px
  },
  
  // Layout spacing (1rem increments)
  layout: {
    xs: 'space-x-4 space-y-4',    // 16px
    sm: 'space-x-6 space-y-6',    // 24px
    md: 'space-x-8 space-y-8',    // 32px
    lg: 'space-x-12 space-y-12',  // 48px
    xl: 'space-x-16 space-y-16',  // 64px
  }
} as const;

/**
 * Standard padding patterns for consistent internal spacing
 */
export const PADDING_PATTERNS = {
  // Content padding (text content, cards, panels)
  content: {
    mobile: 'p-3',      // 12px
    tablet: 'p-4',     // 16px  
    desktop: 'p-6',    // 24px
    responsive: 'p-3 sm:p-4 md:p-6',
  },
  
  // Form padding (inputs, buttons, interactive elements)
  form: {
    mobile: 'p-2',      // 8px
    tablet: 'p-3',     // 12px
    desktop: 'p-4',    // 16px
    responsive: 'p-2 sm:p-3 md:p-4',
  },
  
  // Container padding (main layout containers)
  container: {
    mobile: 'p-2',      // 8px
    tablet: 'p-4',     // 16px
    desktop: 'p-6',    // 24px
    responsive: 'p-2 sm:p-4 md:p-6',
  },
  
  // Section padding (major UI sections)
  section: {
    mobile: 'p-4',      // 16px
    tablet: 'p-6',     // 24px
    desktop: 'p-8',    // 32px
    responsive: 'p-4 sm:p-6 md:p-8',
  }
} as const;

/**
 * Standard margin patterns for consistent external spacing
 */
export const MARGIN_PATTERNS = {
  // Element margins (between related elements)
  element: {
    mobile: 'm-2',      // 8px
    tablet: 'm-3',     // 12px
    desktop: 'm-4',    // 16px
    responsive: 'm-2 sm:m-3 md:m-4',
  },
  
  // Component margins (between components)
  component: {
    mobile: 'm-3',      // 12px
    tablet: 'm-4',     // 16px
    desktop: 'm-6',    // 24px
    responsive: 'm-3 sm:m-4 md:m-6',
  },
  
  // Section margins (between major sections)
  section: {
    mobile: 'm-4',      // 16px
    tablet: 'm-6',     // 24px
    desktop: 'm-8',    // 32px
    responsive: 'm-4 sm:m-6 md:m-8',
  }
} as const;

/**
 * Standard gap patterns for flexbox and grid layouts
 */
export const GAP_PATTERNS = {
  // Tight gaps (related items)
  tight: {
    mobile: 'gap-1',    // 4px
    tablet: 'gap-2',   // 8px
    desktop: 'gap-3',  // 12px
    responsive: 'gap-1 sm:gap-2 md:gap-3',
  },
  
  // Normal gaps (standard spacing)
  normal: {
    mobile: 'gap-2',    // 8px
    tablet: 'gap-3',   // 12px
    desktop: 'gap-4',  // 16px
    responsive: 'gap-2 sm:gap-3 md:gap-4',
  },
  
  // Loose gaps (separated items)
  loose: {
    mobile: 'gap-3',    // 12px
    tablet: 'gap-4',   // 16px
    desktop: 'gap-6',  // 24px
    responsive: 'gap-3 sm:gap-4 md:gap-6',
  }
} as const;

/**
 * Component-specific spacing configurations
 */
export const COMPONENT_SPACING = {
  // Word filter form spacing
  wordFilterForm: {
    containerPadding: PADDING_PATTERNS.content.responsive,
    sectionSpacing: SPACING_SCALE.component.lg,
    buttonGap: GAP_PATTERNS.normal.responsive,
    segmentSpacing: SPACING_SCALE.component.md,
  },
  
  // Filter results spacing  
  filterResults: {
    containerPadding: PADDING_PATTERNS.content.responsive,
    gridGap: GAP_PATTERNS.normal.responsive,
    itemPadding: PADDING_PATTERNS.form.responsive,
    metadataSpacing: SPACING_SCALE.component.sm,
  },
  
  // Segment input spacing
  segmentInput: {
    containerPadding: PADDING_PATTERNS.form.responsive,
    labelSpacing: SPACING_SCALE.micro.md,
    inputSpacing: SPACING_SCALE.micro.lg,
    helpTextMargin: MARGIN_PATTERNS.element.responsive,
  },
  
  // Reset components spacing
  resetComponents: {
    buttonPadding: PADDING_PATTERNS.form.responsive,
    dialogPadding: PADDING_PATTERNS.content.responsive,
    confirmationSpacing: SPACING_SCALE.component.md,
    iconMargin: MARGIN_PATTERNS.element.responsive,
  },
  
  // Loading components spacing
  loadingComponents: {
    overlayPadding: PADDING_PATTERNS.section.responsive,
    spinnerMargin: MARGIN_PATTERNS.component.responsive,
    progressSpacing: SPACING_SCALE.component.sm,
    skeletonGap: GAP_PATTERNS.tight.responsive,
  }
} as const;

/**
 * Utility functions for dynamic spacing application
 */
export const SpacingUtils = {
  /**
   * Get responsive padding based on viewport
   */
  getResponsivePadding: (type: keyof typeof PADDING_PATTERNS, viewport?: 'mobile' | 'tablet' | 'desktop') => {
    if (viewport) {
      return PADDING_PATTERNS[type][viewport];
    }
    return PADDING_PATTERNS[type].responsive;
  },

  /**
   * Get responsive spacing based on component needs
   */
  getComponentSpacing: (component: keyof typeof COMPONENT_SPACING, property: string) => {
    const componentConfig = COMPONENT_SPACING[component];
    return componentConfig[property as keyof typeof componentConfig] || '';
  },

  /**
   * Combine spacing classes with validation
   */
  combineSpacing: (...spacingClasses: string[]) => {
    return spacingClasses.filter(Boolean).join(' ');
  },

  /**
   * Validate spacing consistency across breakpoints
   */
  validateSpacing: (className: string) => {
    const hasResponsiveSpacing = /\b(sm:|md:|lg:)/.test(className);
    const hasSpacing = /\b(p-|m-|space-|gap-)/.test(className);
    
    return {
      hasSpacing,
      hasResponsiveSpacing,
      isConsistent: hasSpacing && hasResponsiveSpacing
    };
  }
} as const;

/**
 * CSS Custom Properties for consistent spacing
 * These can be used in custom CSS when Tailwind classes are insufficient
 */
export const CSS_SPACING_VARS = {
  '--spacing-micro-xs': '0.25rem',   // 4px
  '--spacing-micro-sm': '0.5rem',    // 8px
  '--spacing-micro-md': '0.75rem',   // 12px
  '--spacing-micro-lg': '1rem',      // 16px
  
  '--spacing-component-xs': '0.5rem',  // 8px
  '--spacing-component-sm': '0.75rem', // 12px
  '--spacing-component-md': '1rem',    // 16px
  '--spacing-component-lg': '1.5rem',  // 24px
  '--spacing-component-xl': '2rem',    // 32px
  
  '--spacing-layout-xs': '1rem',     // 16px
  '--spacing-layout-sm': '1.5rem',   // 24px
  '--spacing-layout-md': '2rem',     // 32px
  '--spacing-layout-lg': '3rem',     // 48px
  '--spacing-layout-xl': '4rem',     // 64px
} as const;

/**
 * Type definitions for TypeScript support
 */
export type SpacingScale = keyof typeof SPACING_SCALE;
export type PaddingPattern = keyof typeof PADDING_PATTERNS;
export type MarginPattern = keyof typeof MARGIN_PATTERNS;
export type GapPattern = keyof typeof GAP_PATTERNS;
export type ComponentSpacing = keyof typeof COMPONENT_SPACING;