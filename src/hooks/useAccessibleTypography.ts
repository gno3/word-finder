/**
 * React hook for accessible responsive typography
 */

import { useMemo } from 'react';
import { useViewport } from './useViewport.js';
import { 
  getAccessibleTypography,
  createAccessibleTextClasses,
  validateTypographyAccessibility,
  type TypographyRole 
} from '../utils/accessibleTypography.js';

export interface UseAccessibleTypographyOptions {
  role: TypographyRole;
  additionalClasses?: string;
  validate?: boolean;
}

export interface UseAccessibleTypographyReturn {
  typographyClasses: string;
  isAccessible: boolean;
  warnings: string[];
  recommendations: string[];
}

/**
 * Hook for generating accessible typography classes with responsive scaling
 */
export const useAccessibleTypography = ({
  role,
  additionalClasses = '',
  validate = process.env.NODE_ENV === 'development'
}: UseAccessibleTypographyOptions): UseAccessibleTypographyReturn => {
  // Future enhancement: Could use breakpoint for dynamic scaling
  // const { breakpoint } = useViewport();
  
  const typographyClasses = useMemo(() => {
    return createAccessibleTextClasses(role, additionalClasses);
  }, [role, additionalClasses]);
  
  const validation = useMemo(() => {
    if (!validate) {
      return {
        isAccessible: true,
        issues: [],
        recommendations: []
      };
    }
    
    return validateTypographyAccessibility(typographyClasses);
  }, [typographyClasses, validate]);
  
  // Development warnings
  if (validate && !validation.isAccessible) {
    console.warn(`Typography accessibility issues for role "${role}":`, validation.issues);
  }
  
  return {
    typographyClasses,
    isAccessible: validation.isAccessible,
    warnings: validation.issues,
    recommendations: validation.recommendations
  };
};

/**
 * Simple hook for getting typography classes by role
 */
export const useTypographyClasses = (role: TypographyRole): string => {
  return getAccessibleTypography(role);
};

/**
 * Hook for responsive text sizing based on viewport
 */
export const useResponsiveText = (baseSize: TypographyRole, mobileRole?: TypographyRole) => {
  const { isMobile } = useViewport();
  const role = isMobile && mobileRole ? mobileRole : baseSize;
  return useTypographyClasses(role);
};