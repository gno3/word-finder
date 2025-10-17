/**
 * Typography Design System
 * Part of T025 - Visual hierarchy enhancement for User Story 3
 * 
 * Provides consistent typography scales, visual weight, and responsive behavior
 * following modern design system principles and WCAG accessibility guidelines.
 */

// Typography Scale following modular scale (1.25 - Major Third)
export const TYPOGRAPHY_SCALE = {
  // Display levels for hero content
  display: {
    xl: 'text-6xl sm:text-7xl lg:text-8xl', // 60px -> 72px -> 96px
    lg: 'text-5xl sm:text-6xl lg:text-7xl', // 48px -> 60px -> 72px
    md: 'text-4xl sm:text-5xl lg:text-6xl', // 36px -> 48px -> 60px
    sm: 'text-3xl sm:text-4xl lg:text-5xl', // 30px -> 36px -> 48px
  },
  
  // Heading levels for content hierarchy
  heading: {
    xl: 'text-3xl sm:text-4xl lg:text-5xl', // 30px -> 36px -> 48px
    lg: 'text-2xl sm:text-3xl lg:text-4xl', // 24px -> 30px -> 36px
    md: 'text-xl sm:text-2xl lg:text-3xl',  // 20px -> 24px -> 30px
    sm: 'text-lg sm:text-xl lg:text-2xl',   // 18px -> 20px -> 24px
    xs: 'text-base sm:text-lg lg:text-xl',  // 16px -> 18px -> 20px
  },
  
  // Body text for content
  body: {
    xl: 'text-xl sm:text-xl lg:text-2xl',   // 20px -> 20px -> 24px
    lg: 'text-lg sm:text-lg lg:text-xl',    // 18px -> 18px -> 20px
    md: 'text-base sm:text-base lg:text-lg', // 16px -> 16px -> 18px
    sm: 'text-sm sm:text-base lg:text-base', // 14px -> 16px -> 16px
    xs: 'text-xs sm:text-sm lg:text-sm',    // 12px -> 14px -> 14px
  },
  
  // UI elements and labels
  ui: {
    lg: 'text-base sm:text-base lg:text-lg', // 16px -> 16px -> 18px
    md: 'text-sm sm:text-base lg:text-base', // 14px -> 16px -> 16px
    sm: 'text-xs sm:text-sm lg:text-sm',     // 12px -> 14px -> 14px
    xs: 'text-xs sm:text-xs lg:text-xs',     // 12px -> 12px -> 12px
  }
} as const;

// Font Weight Scale for visual hierarchy
export const FONT_WEIGHT = {
  hairline: 'font-thin',     // 100
  extraLight: 'font-extralight', // 200
  light: 'font-light',       // 300
  normal: 'font-normal',     // 400
  medium: 'font-medium',     // 500
  semibold: 'font-semibold', // 600
  bold: 'font-bold',         // 700
  extrabold: 'font-extrabold', // 800
  black: 'font-black',       // 900
} as const;

// Line Height for optimal readability
export const LINE_HEIGHT = {
  none: 'leading-none',      // 1
  tight: 'leading-tight',    // 1.25
  snug: 'leading-snug',      // 1.375
  normal: 'leading-normal',  // 1.5
  relaxed: 'leading-relaxed', // 1.625
  loose: 'leading-loose',    // 2
} as const;

// Letter Spacing for fine typography control
export const LETTER_SPACING = {
  tighter: 'tracking-tighter', // -0.05em
  tight: 'tracking-tight',     // -0.025em
  normal: 'tracking-normal',   // 0em
  wide: 'tracking-wide',       // 0.025em
  wider: 'tracking-wider',     // 0.05em
  widest: 'tracking-widest',   // 0.1em
} as const;

// Typography Patterns for specific use cases
export const TYPOGRAPHY_PATTERNS = {
  // Page titles and main headings
  pageTitle: {
    mobile: `${TYPOGRAPHY_SCALE.heading.xl} ${FONT_WEIGHT.bold} ${LINE_HEIGHT.tight} ${LETTER_SPACING.tight}`,
    desktop: `${TYPOGRAPHY_SCALE.display.sm} ${FONT_WEIGHT.bold} ${LINE_HEIGHT.tight} ${LETTER_SPACING.tight}`,
    responsive: `${TYPOGRAPHY_SCALE.heading.xl} ${FONT_WEIGHT.bold} ${LINE_HEIGHT.tight} ${LETTER_SPACING.tight}`,
  },
  
  // Section headings
  sectionTitle: {
    mobile: `${TYPOGRAPHY_SCALE.heading.lg} ${FONT_WEIGHT.semibold} ${LINE_HEIGHT.snug} ${LETTER_SPACING.normal}`,
    desktop: `${TYPOGRAPHY_SCALE.heading.xl} ${FONT_WEIGHT.semibold} ${LINE_HEIGHT.snug} ${LETTER_SPACING.normal}`,
    responsive: `${TYPOGRAPHY_SCALE.heading.lg} ${FONT_WEIGHT.semibold} ${LINE_HEIGHT.snug} ${LETTER_SPACING.normal}`,
  },
  
  // Card and component titles
  componentTitle: {
    mobile: `${TYPOGRAPHY_SCALE.heading.sm} ${FONT_WEIGHT.medium} ${LINE_HEIGHT.snug} ${LETTER_SPACING.normal}`,
    desktop: `${TYPOGRAPHY_SCALE.heading.md} ${FONT_WEIGHT.medium} ${LINE_HEIGHT.snug} ${LETTER_SPACING.normal}`,
    responsive: `${TYPOGRAPHY_SCALE.heading.sm} ${FONT_WEIGHT.medium} ${LINE_HEIGHT.snug} ${LETTER_SPACING.normal}`,
  },
  
  // Body content
  bodyText: {
    mobile: `${TYPOGRAPHY_SCALE.body.sm} ${FONT_WEIGHT.normal} ${LINE_HEIGHT.relaxed} ${LETTER_SPACING.normal}`,
    desktop: `${TYPOGRAPHY_SCALE.body.md} ${FONT_WEIGHT.normal} ${LINE_HEIGHT.relaxed} ${LETTER_SPACING.normal}`,
    responsive: `${TYPOGRAPHY_SCALE.body.sm} ${FONT_WEIGHT.normal} ${LINE_HEIGHT.relaxed} ${LETTER_SPACING.normal}`,
  },
  
  // Supporting text and descriptions
  supportingText: {
    mobile: `${TYPOGRAPHY_SCALE.body.xs} ${FONT_WEIGHT.normal} ${LINE_HEIGHT.normal} ${LETTER_SPACING.normal}`,
    desktop: `${TYPOGRAPHY_SCALE.body.sm} ${FONT_WEIGHT.normal} ${LINE_HEIGHT.normal} ${LETTER_SPACING.normal}`,
    responsive: `${TYPOGRAPHY_SCALE.body.xs} ${FONT_WEIGHT.normal} ${LINE_HEIGHT.normal} ${LETTER_SPACING.normal}`,
  },
  
  // Button and UI text
  buttonText: {
    mobile: `${TYPOGRAPHY_SCALE.ui.md} ${FONT_WEIGHT.medium} ${LINE_HEIGHT.none} ${LETTER_SPACING.normal}`,
    desktop: `${TYPOGRAPHY_SCALE.ui.lg} ${FONT_WEIGHT.medium} ${LINE_HEIGHT.none} ${LETTER_SPACING.normal}`,
    responsive: `${TYPOGRAPHY_SCALE.ui.md} ${FONT_WEIGHT.medium} ${LINE_HEIGHT.none} ${LETTER_SPACING.normal}`,
  },
  
  // Form labels and inputs
  formLabel: {
    mobile: `${TYPOGRAPHY_SCALE.ui.sm} ${FONT_WEIGHT.medium} ${LINE_HEIGHT.normal} ${LETTER_SPACING.normal}`,
    desktop: `${TYPOGRAPHY_SCALE.ui.md} ${FONT_WEIGHT.medium} ${LINE_HEIGHT.normal} ${LETTER_SPACING.normal}`,
    responsive: `${TYPOGRAPHY_SCALE.ui.sm} ${FONT_WEIGHT.medium} ${LINE_HEIGHT.normal} ${LETTER_SPACING.normal}`,
  },
  
  // Caption and small text
  caption: {
    mobile: `${TYPOGRAPHY_SCALE.ui.xs} ${FONT_WEIGHT.normal} ${LINE_HEIGHT.tight} ${LETTER_SPACING.wide}`,
    desktop: `${TYPOGRAPHY_SCALE.ui.sm} ${FONT_WEIGHT.normal} ${LINE_HEIGHT.tight} ${LETTER_SPACING.wide}`,
    responsive: `${TYPOGRAPHY_SCALE.ui.xs} ${FONT_WEIGHT.normal} ${LINE_HEIGHT.tight} ${LETTER_SPACING.wide}`,
  },
} as const;

// Component-specific typography configurations
export const COMPONENT_TYPOGRAPHY = {
  // WordFilter main component
  wordFilter: {
    title: TYPOGRAPHY_PATTERNS.pageTitle.responsive,
    subtitle: TYPOGRAPHY_PATTERNS.supportingText.responsive,
  },
  
  // WordFilterForm component
  wordFilterForm: {
    sectionTitle: TYPOGRAPHY_PATTERNS.componentTitle.responsive,
    segmentCounter: TYPOGRAPHY_PATTERNS.caption.responsive,
    addButton: TYPOGRAPHY_PATTERNS.buttonText.responsive,
    submitButton: TYPOGRAPHY_PATTERNS.buttonText.responsive,
    resetButton: `${TYPOGRAPHY_PATTERNS.buttonText.responsive.replace(FONT_WEIGHT.medium, FONT_WEIGHT.normal)}`,
    helpText: TYPOGRAPHY_PATTERNS.supportingText.responsive,
  },
  
  // SegmentInput component  
  segmentInput: {
    label: TYPOGRAPHY_PATTERNS.formLabel.responsive,
    input: TYPOGRAPHY_PATTERNS.bodyText.responsive,
    counter: TYPOGRAPHY_PATTERNS.caption.responsive,
    error: `${TYPOGRAPHY_PATTERNS.caption.responsive} text-red-600`,
    removeButton: TYPOGRAPHY_PATTERNS.caption.responsive,
  },
  
  // FilterResults component
  filterResults: {
    title: TYPOGRAPHY_PATTERNS.componentTitle.responsive,
    wordCount: TYPOGRAPHY_PATTERNS.caption.responsive,
    wordItem: TYPOGRAPHY_PATTERNS.bodyText.responsive,
    emptyState: TYPOGRAPHY_PATTERNS.supportingText.responsive,
  },
  
  // Loading and error states
  loading: {
    title: TYPOGRAPHY_PATTERNS.componentTitle.responsive,
    message: TYPOGRAPHY_PATTERNS.supportingText.responsive,
  },
  
  // Dialogs and modals
  dialog: {
    title: TYPOGRAPHY_PATTERNS.sectionTitle.responsive,
    message: TYPOGRAPHY_PATTERNS.bodyText.responsive,
    buttonPrimary: TYPOGRAPHY_PATTERNS.buttonText.responsive,
    buttonSecondary: `${TYPOGRAPHY_PATTERNS.buttonText.responsive.replace(FONT_WEIGHT.medium, FONT_WEIGHT.normal)}`,
  },
} as const;

// Typography utility functions
export const typographyUtils = {
  /**
   * Get typography classes for a specific pattern
   */
  getPattern: (pattern: keyof typeof TYPOGRAPHY_PATTERNS, variant: 'mobile' | 'desktop' | 'responsive' = 'responsive') => {
    return TYPOGRAPHY_PATTERNS[pattern][variant];
  },
  
  /**
   * Get component-specific typography
   */
  getComponent: (component: keyof typeof COMPONENT_TYPOGRAPHY, element: string) => {
    const componentTypography = COMPONENT_TYPOGRAPHY[component] as Record<string, string>;
    return componentTypography[element] || TYPOGRAPHY_PATTERNS.bodyText.responsive;
  },
  
  /**
   * Combine typography classes with custom classes
   */
  combine: (basePattern: string, customClasses: string = '') => {
    return `${basePattern} ${customClasses}`.trim();
  },
  
  /**
   * Create heading with appropriate semantic level and styling
   */
  heading: (level: 1 | 2 | 3 | 4 | 5 | 6, visualLevel: keyof typeof TYPOGRAPHY_SCALE.heading = 'md') => {
    const semanticTag = `h${level}` as const;
    const visualClasses = TYPOGRAPHY_SCALE.heading[visualLevel];
    return {
      tag: semanticTag,
      classes: `${visualClasses} ${FONT_WEIGHT.semibold} ${LINE_HEIGHT.snug}`,
    };
  },
  
  /**
   * Ensure minimum font size for accessibility (16px on mobile)
   */
  ensureAccessible: (classes: string) => {
    // Replace any text size smaller than base on mobile
    return classes.replace(/text-xs|text-sm(?!\s|$)/, 'text-sm sm:text-base');
  },
} as const;

// Export types for TypeScript support
export type TypographyScale = typeof TYPOGRAPHY_SCALE;
export type TypographyPattern = keyof typeof TYPOGRAPHY_PATTERNS;
export type ComponentTypography = keyof typeof COMPONENT_TYPOGRAPHY;
export type FontWeight = keyof typeof FONT_WEIGHT;
export type LineHeight = keyof typeof LINE_HEIGHT;
export type LetterSpacing = keyof typeof LETTER_SPACING;