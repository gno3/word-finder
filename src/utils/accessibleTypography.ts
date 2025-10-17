/**
 * Responsive typography utilities for mobile accessibility
 * Ensures 16px minimum font sizes on mobile to prevent iOS zoom
 */

// No imports needed for this utility

/**
 * Typography scale with mobile-first responsive classes
 * All sizes meet 16px minimum on mobile
 */
export const RESPONSIVE_TYPOGRAPHY = {
  // Base content text (16px minimum)
  BODY: 'text-base sm:text-base',  // 16px on all sizes
  BODY_LARGE: 'text-base sm:text-lg',  // 16px -> 18px
  
  // Headings with proper scaling
  HEADING_XL: 'text-xl sm:text-2xl lg:text-3xl',  // 20px -> 24px -> 30px
  HEADING_LARGE: 'text-lg sm:text-xl lg:text-2xl',  // 18px -> 20px -> 24px
  HEADING_MEDIUM: 'text-base sm:text-lg lg:text-xl',  // 16px -> 18px -> 20px
  HEADING_SMALL: 'text-base sm:text-base lg:text-lg',  // 16px -> 16px -> 18px
  
  // Labels and secondary text (16px minimum)
  LABEL: 'text-base sm:text-sm',  // 16px -> 14px (desktop only)
  LABEL_SMALL: 'text-base sm:text-sm',  // 16px -> 14px
  
  // Interactive elements (button text, links)
  BUTTON: 'text-base sm:text-base',  // 16px consistent
  BUTTON_LARGE: 'text-base sm:text-lg',  // 16px -> 18px
  
  // Meta text (maintains readability)
  META: 'text-base sm:text-sm',  // 16px -> 14px
  CAPTION: 'text-base sm:text-sm',  // 16px -> 14px
  
  // Special cases where smaller text is acceptable on larger screens
  FINE_PRINT: 'text-base sm:text-xs',  // 16px -> 12px (desktop only)
} as const;

/**
 * Get responsive typography class based on breakpoint and text role
 */
export const getResponsiveTypography = (
  role: keyof typeof RESPONSIVE_TYPOGRAPHY,
  breakpoint?: 'mobile' | 'tablet' | 'desktop'
): string => {
  const classes = RESPONSIVE_TYPOGRAPHY[role];
  
  // On mobile, ensure we use the mobile-first class
  if (breakpoint === 'mobile') {
    return classes.split(' ')[0]; // Return first class (mobile/base)
  }
  
  return classes;
};

/**
 * Typography roles for semantic text classification
 */
export type TypographyRole = 
  | 'heading-xl'      // Main page titles
  | 'heading-large'   // Section headers  
  | 'heading-medium'  // Subsection headers
  | 'heading-small'   // Component headers
  | 'body'           // Main content text
  | 'body-large'     // Emphasized body text
  | 'label'          // Form labels, captions
  | 'label-small'    // Small labels, helper text
  | 'button'         // Button text
  | 'button-large'   // Large button text
  | 'meta'           // Metadata, timestamps
  | 'caption'        // Image captions, footnotes
  | 'fine-print';    // Legal text, disclaimers

/**
 * Get typography classes for a specific role with accessibility compliance
 */
export const getAccessibleTypography = (role: TypographyRole): string => {
  const roleMap: Record<TypographyRole, keyof typeof RESPONSIVE_TYPOGRAPHY> = {
    'heading-xl': 'HEADING_XL',
    'heading-large': 'HEADING_LARGE', 
    'heading-medium': 'HEADING_MEDIUM',
    'heading-small': 'HEADING_SMALL',
    'body': 'BODY',
    'body-large': 'BODY_LARGE',
    'label': 'LABEL',
    'label-small': 'LABEL_SMALL',
    'button': 'BUTTON',
    'button-large': 'BUTTON_LARGE',
    'meta': 'META',
    'caption': 'CAPTION',
    'fine-print': 'FINE_PRINT'
  };
  
  return RESPONSIVE_TYPOGRAPHY[roleMap[role]];
};

/**
 * Validate typography accessibility for mobile devices
 */
export const validateTypographyAccessibility = (className: string): {
  isAccessible: boolean;
  issues: string[];
  recommendations: string[];
} => {
  const issues: string[] = [];
  const recommendations: string[] = [];
  
  // Check for problematic small text classes on mobile
  const problematicClasses = ['text-xs', 'text-sm'];
  const hasProblematicClass = problematicClasses.some(cls => className.includes(cls));
  
  if (hasProblematicClass && !className.includes('sm:text-')) {
    issues.push('Text may be too small on mobile devices (iOS zoom trigger)');
    recommendations.push('Use responsive typography: text-base sm:text-sm');
  }
  
  // Check for missing responsive scaling
  if (!className.includes('sm:text-') && !className.includes('md:text-') && !className.includes('lg:text-')) {
    recommendations.push('Consider adding responsive typography scaling');
  }
  
  const isAccessible = issues.length === 0;
  
  return {
    isAccessible,
    issues,
    recommendations
  };
};

/**
 * Convert legacy typography classes to accessible responsive versions
 */
export const convertToAccessibleTypography = (className: string): string => {
  const conversions: Record<string, string> = {
    'text-xs': RESPONSIVE_TYPOGRAPHY.FINE_PRINT,
    'text-sm': RESPONSIVE_TYPOGRAPHY.LABEL,
    'text-base': RESPONSIVE_TYPOGRAPHY.BODY,
    'text-lg': RESPONSIVE_TYPOGRAPHY.BODY_LARGE,
    'text-xl': RESPONSIVE_TYPOGRAPHY.HEADING_SMALL,
    'text-2xl': RESPONSIVE_TYPOGRAPHY.HEADING_MEDIUM,
    'text-3xl': RESPONSIVE_TYPOGRAPHY.HEADING_LARGE,
    'text-4xl': RESPONSIVE_TYPOGRAPHY.HEADING_XL,
  };
  
  let converted = className;
  
  Object.entries(conversions).forEach(([legacy, modern]) => {
    // Replace if it's the exact class or part of a larger class string
    const regex = new RegExp(`\\b${legacy}\\b`, 'g');
    converted = converted.replace(regex, modern);
  });
  
  return converted;
};

/**
 * Line height utilities for responsive typography
 */
export const RESPONSIVE_LINE_HEIGHT = {
  TIGHT: 'leading-tight sm:leading-tight',        // 1.25
  NORMAL: 'leading-normal sm:leading-normal',      // 1.5
  RELAXED: 'leading-relaxed sm:leading-relaxed',   // 1.625
  LOOSE: 'leading-loose sm:leading-loose',         // 2.0
} as const;

/**
 * Utility for creating accessible typography components
 */
export const createAccessibleTextClasses = (
  role: TypographyRole,
  additionalClasses: string = ''
): string => {
  const typographyClasses = getAccessibleTypography(role);
  const lineHeight = role.includes('heading') ? RESPONSIVE_LINE_HEIGHT.TIGHT : RESPONSIVE_LINE_HEIGHT.NORMAL;
  
  return `${typographyClasses} ${lineHeight} ${additionalClasses}`.trim();
};