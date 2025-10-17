/**
 * Visual Design System for Clean Minimal UI
 * 
 * Provides centralized design tokens and styling patterns for consistent
 * visual hierarchy, groupings, and readability across components.
 * 
 * Design Principles:
 * - Clean and minimal aesthetic
 * - Strong visual hierarchy
 * - Improved content groupings
 * - Enhanced readability
 * - Consistent spacing and colors
 */

// Color palette for clean minimal design
export const DESIGN_COLORS = {
  // Neutral palette for minimal design
  neutral: {
    50: '#fafafa',   // Very light background
    100: '#f5f5f5',  // Light background
    200: '#e5e5e5',  // Subtle borders
    300: '#d4d4d4',  // Light borders
    400: '#a3a3a3',  // Medium gray text
    500: '#737373',  // Regular gray text
    600: '#525252',  // Dark gray text
    700: '#404040',  // Very dark gray
    800: '#262626',  // Near black
    900: '#171717',  // Black text
    white: '#ffffff',
    black: '#000000'
  },
  
  // Accent colors for interactive elements
  accent: {
    primary: '#2563eb',    // Blue for primary actions
    primaryHover: '#1d4ed8', // Darker blue for hover
    secondary: '#64748b',   // Slate for secondary actions
    secondaryHover: '#475569', // Darker slate for hover
    success: '#16a34a',    // Green for success states
    warning: '#ca8a04',    // Amber for warnings
    error: '#dc2626',      // Red for errors
    info: '#0891b2'        // Cyan for informational
  },
  
  // Semantic colors
  semantic: {
    background: '#ffffff',
    surface: '#fafafa',
    border: '#e5e5e5',
    divider: '#f5f5f5',
    overlay: 'rgba(0, 0, 0, 0.1)',
    shadow: 'rgba(0, 0, 0, 0.05)'
  }
} as const;

// Typography system for visual hierarchy
export const TYPOGRAPHY_HIERARCHY = {
  // Font families
  fontFamily: {
    sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
    mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'monospace']
  },
  
  // Font sizes with consistent scale
  fontSize: {
    xs: '0.75rem',     // 12px
    sm: '0.875rem',    // 14px
    base: '1rem',      // 16px
    lg: '1.125rem',    // 18px
    xl: '1.25rem',     // 20px
    '2xl': '1.5rem',   // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem'   // 36px
  },
  
  // Line heights for readability
  lineHeight: {
    tight: '1.25',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2'
  },
  
  // Font weights
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700'
  }
} as const;

// Spacing system for consistent layouts
export const SPACING_SYSTEM = {
  // Base spacing scale (rem values)
  space: {
    px: '1px',
    0: '0',
    1: '0.25rem',  // 4px
    2: '0.5rem',   // 8px
    3: '0.75rem',  // 12px
    4: '1rem',     // 16px
    5: '1.25rem',  // 20px
    6: '1.5rem',   // 24px
    8: '2rem',     // 32px
    10: '2.5rem',  // 40px
    12: '3rem',    // 48px
    16: '4rem',    // 64px
    20: '5rem',    // 80px
    24: '6rem'     // 96px
  },
  
  // Component-specific spacing patterns
  component: {
    // Container spacing
    containerPadding: {
      mobile: '1rem',    // 16px
      tablet: '1.5rem',  // 24px
      desktop: '2rem'    // 32px
    },
    
    // Section spacing
    sectionGap: {
      small: '1.5rem',   // 24px
      medium: '2rem',    // 32px
      large: '3rem'      // 48px
    },
    
    // Element spacing
    elementGap: {
      tight: '0.5rem',   // 8px
      normal: '1rem',    // 16px
      relaxed: '1.5rem'  // 24px
    }
  }
} as const;

// Visual grouping patterns
export const VISUAL_GROUPING = {
  // Card designs for content grouping
  card: {
    // Minimal card with subtle border
    minimal: {
      background: DESIGN_COLORS.semantic.background,
      border: `1px solid ${DESIGN_COLORS.semantic.border}`,
      borderRadius: '0.5rem',
      padding: '1.5rem',
      shadow: `0 1px 3px ${DESIGN_COLORS.semantic.shadow}`
    },
    
    // Elevated card for important content
    elevated: {
      background: DESIGN_COLORS.semantic.background,
      border: `1px solid ${DESIGN_COLORS.semantic.border}`,
      borderRadius: '0.75rem',
      padding: '2rem',
      shadow: `0 4px 6px ${DESIGN_COLORS.semantic.shadow}`
    },
    
    // Surface card for sections
    surface: {
      background: DESIGN_COLORS.semantic.surface,
      border: 'none',
      borderRadius: '0.5rem',
      padding: '1.5rem',
      shadow: 'none'
    }
  },
  
  // Section dividers
  divider: {
    // Subtle horizontal divider
    horizontal: {
      height: '1px',
      background: DESIGN_COLORS.semantic.divider,
      margin: '2rem 0'
    },
    
    // Spacer without visible line
    spacer: {
      height: '2rem',
      background: 'transparent'
    }
  },
  
  // Focus and interaction states
  interaction: {
    // Focus ring for accessibility
    focusRing: {
      outline: `2px solid ${DESIGN_COLORS.accent.primary}`,
      outlineOffset: '2px'
    },
    
    // Hover states
    hover: {
      scale: '1.02',
      transition: 'all 0.2s ease-in-out'
    }
  }
} as const;

// Button styling patterns
export const BUTTON_STYLES = {
  // Primary button
  primary: {
    background: DESIGN_COLORS.accent.primary,
    color: DESIGN_COLORS.neutral.white,
    border: 'none',
    borderRadius: '0.5rem',
    padding: '0.75rem 1.5rem',
    fontSize: TYPOGRAPHY_HIERARCHY.fontSize.base,
    fontWeight: TYPOGRAPHY_HIERARCHY.fontWeight.medium,
    transition: 'all 0.2s ease-in-out',
    hover: {
      background: DESIGN_COLORS.accent.primaryHover,
      transform: 'translateY(-1px)'
    }
  },
  
  // Secondary button
  secondary: {
    background: 'transparent',
    color: DESIGN_COLORS.accent.secondary,
    border: `1px solid ${DESIGN_COLORS.semantic.border}`,
    borderRadius: '0.5rem',
    padding: '0.75rem 1.5rem',
    fontSize: TYPOGRAPHY_HIERARCHY.fontSize.base,
    fontWeight: TYPOGRAPHY_HIERARCHY.fontWeight.medium,
    transition: 'all 0.2s ease-in-out',
    hover: {
      background: DESIGN_COLORS.semantic.surface,
      borderColor: DESIGN_COLORS.accent.secondary
    }
  },
  
  // Minimal button
  minimal: {
    background: 'transparent',
    color: DESIGN_COLORS.accent.secondary,
    border: 'none',
    borderRadius: '0.25rem',
    padding: '0.5rem 1rem',
    fontSize: TYPOGRAPHY_HIERARCHY.fontSize.sm,
    fontWeight: TYPOGRAPHY_HIERARCHY.fontWeight.normal,
    transition: 'all 0.2s ease-in-out',
    hover: {
      background: DESIGN_COLORS.semantic.surface,
      color: DESIGN_COLORS.accent.secondaryHover
    }
  }
} as const;

// Input field styling
export const INPUT_STYLES = {
  // Standard text input
  base: {
    background: DESIGN_COLORS.semantic.background,
    border: `1px solid ${DESIGN_COLORS.semantic.border}`,
    borderRadius: '0.5rem',
    padding: '0.75rem 1rem',
    fontSize: TYPOGRAPHY_HIERARCHY.fontSize.base,
    lineHeight: TYPOGRAPHY_HIERARCHY.lineHeight.normal,
    transition: 'all 0.2s ease-in-out',
    focus: {
      borderColor: DESIGN_COLORS.accent.primary,
      outline: `2px solid ${DESIGN_COLORS.accent.primary}33`,
      outlineOffset: '0'
    }
  },
  
  // Error state
  error: {
    borderColor: DESIGN_COLORS.accent.error,
    color: DESIGN_COLORS.accent.error
  },
  
  // Success state
  success: {
    borderColor: DESIGN_COLORS.accent.success,
    color: DESIGN_COLORS.accent.success
  }
} as const;

// Layout patterns for visual organization
export const LAYOUT_PATTERNS = {
  // Stack layout for vertical grouping
  stack: {
    display: 'flex',
    flexDirection: 'column',
    gap: SPACING_SYSTEM.component.elementGap.normal
  },
  
  // Grid layout for organized content
  grid: {
    display: 'grid',
    gap: SPACING_SYSTEM.component.elementGap.normal,
    gridTemplateColumns: {
      mobile: '1fr',
      tablet: 'repeat(2, 1fr)',
      desktop: 'repeat(auto-fit, minmax(250px, 1fr))'
    }
  },
  
  // Flex layout for horizontal grouping
  flex: {
    display: 'flex',
    alignItems: 'center',
    gap: SPACING_SYSTEM.component.elementGap.normal
  }
} as const;

// Utility functions for applying design system
export const designUtils = {
  /**
   * Generate Tailwind CSS classes for consistent styling
   */
  getTailwindClasses: (pattern: keyof typeof LAYOUT_PATTERNS) => {
    switch (pattern) {
      case 'stack':
        return 'flex flex-col gap-4';
      case 'grid':
        return 'grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-auto-fit';
      case 'flex':
        return 'flex items-center gap-4';
      default:
        return '';
    }
  },
  
  /**
   * Get responsive padding classes
   */
  getResponsivePadding: (size: 'small' | 'medium' | 'large' = 'medium') => {
    const sizeMap = {
      small: 'p-3 md:p-4',
      medium: 'p-4 md:p-6',
      large: 'p-6 md:p-8'
    };
    return sizeMap[size];
  },
  
  /**
   * Get responsive gap classes
   */
  getResponsiveGap: (size: 'tight' | 'normal' | 'relaxed' = 'normal') => {
    const sizeMap = {
      tight: 'gap-2 md:gap-3',
      normal: 'gap-4 md:gap-6',
      relaxed: 'gap-6 md:gap-8'
    };
    return sizeMap[size];
  },
  
  /**
   * Get card styling classes
   */
  getCardClasses: (variant: 'minimal' | 'elevated' | 'surface' = 'minimal') => {
    const variantMap = {
      minimal: 'bg-white border border-gray-200 rounded-lg shadow-sm',
      elevated: 'bg-white border border-gray-200 rounded-xl shadow-md',
      surface: 'bg-gray-50 rounded-lg'
    };
    return variantMap[variant];
  },
  
  /**
   * Get button styling classes
   */
  getButtonClasses: (variant: 'primary' | 'secondary' | 'minimal' = 'primary') => {
    const variantMap = {
      primary: 'bg-blue-600 text-white border-0 rounded-lg px-6 py-3 text-base font-medium transition-all hover:bg-blue-700 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
      secondary: 'bg-transparent text-slate-600 border border-gray-200 rounded-lg px-6 py-3 text-base font-medium transition-all hover:bg-gray-50 hover:border-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2',
      minimal: 'bg-transparent text-slate-600 border-0 rounded px-4 py-2 text-sm font-normal transition-all hover:bg-gray-50 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2'
    };
    return variantMap[variant];
  }
};

export default {
  DESIGN_COLORS,
  TYPOGRAPHY_HIERARCHY,
  SPACING_SYSTEM,
  VISUAL_GROUPING,
  BUTTON_STYLES,
  INPUT_STYLES,
  LAYOUT_PATTERNS,
  designUtils
};