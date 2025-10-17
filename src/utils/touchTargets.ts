/**
 * Touch target validation utilities for mobile accessibility compliance
 * Ensures all interactive elements meet WCAG AA touch target requirements
 */

import React from 'react';
import { TOUCH_TARGETS } from './responsive';
import type { TouchTarget, TouchTargetValidation } from '../types/responsive';

/**
 * Validate if element dimensions meet touch target requirements
 */
export function validateTouchTargetSize(
  width: number,
  height: number,
  minSize: number = TOUCH_TARGETS.MINIMUM
): TouchTargetValidation {
  const errors: string[] = [];
  const recommendations: string[] = [];

  // Check minimum width
  if (width < minSize) {
    errors.push(`Width ${width}px is below minimum ${minSize}px requirement`);
  }

  // Check minimum height  
  if (height < minSize) {
    errors.push(`Height ${height}px is below minimum ${minSize}px requirement`);
  }

  // Provide recommendations for improvement
  if (width < TOUCH_TARGETS.RECOMMENDED || height < TOUCH_TARGETS.RECOMMENDED) {
    recommendations.push(`Consider using ${TOUCH_TARGETS.RECOMMENDED}px for better usability`);
  }

  const isValid = errors.length === 0;

  return {
    isValid,
    width,
    height,
    errors,
    recommendations,
  };
}

/**
 * Create touch target configuration object
 */
export function createTouchTarget(
  minWidth: number = TOUCH_TARGETS.MINIMUM,
  minHeight: number = TOUCH_TARGETS.MINIMUM,
  padding: number = TOUCH_TARGETS.SPACING
): TouchTarget {
  const isAccessible = minWidth >= TOUCH_TARGETS.MINIMUM && 
                      minHeight >= TOUCH_TARGETS.MINIMUM &&
                      padding >= TOUCH_TARGETS.SPACING;

  return {
    minWidth,
    minHeight, 
    padding,
    isAccessible,
  };
}

/**
 * Generate Tailwind CSS classes for touch target compliance
 */
export function getTouchTargetClasses(
  size: 'minimum' | 'recommended' = 'minimum',
  includeSpacing: boolean = true
): string {
  const sizeValue = size === 'minimum' ? '11' : '12'; // 44px or 48px
  
  const classes = [
    `min-h-${sizeValue}`,
    `min-w-${sizeValue}`,
  ];

  if (includeSpacing) {
    classes.push(`p-2`); // 8px padding for spacing
  }

  return classes.join(' ');
}

/**
 * Calculate spacing between touch targets to prevent accidental activation
 */
export function calculateTouchTargetSpacing(
  target1: { x: number; y: number; width: number; height: number },
  target2: { x: number; y: number; width: number; height: number }
): {
  distance: number;
  isValidSpacing: boolean;
  minimumRequired: number;
} {
  // Calculate center-to-center distance
  const centerX1 = target1.x + target1.width / 2;
  const centerY1 = target1.y + target1.height / 2;
  const centerX2 = target2.x + target2.width / 2;
  const centerY2 = target2.y + target2.height / 2;

  const distance = Math.sqrt(
    Math.pow(centerX2 - centerX1, 2) + Math.pow(centerY2 - centerY1, 2)
  );

  const minimumRequired = TOUCH_TARGETS.MINIMUM + TOUCH_TARGETS.SPACING;
  const isValidSpacing = distance >= minimumRequired;

  return {
    distance,
    isValidSpacing,
    minimumRequired,
  };
}

/**
 * Validate touch target accessibility for a list of elements
 */
export function validateTouchTargetAccessibility(
  elements: Array<{ width: number; height: number; id: string }>
): {
  allValid: boolean;
  validElements: string[];
  invalidElements: Array<{ id: string; issues: string[] }>;
  summary: {
    total: number;
    valid: number;
    invalid: number;
  };
} {
  const validElements: string[] = [];
  const invalidElements: Array<{ id: string; issues: string[] }> = [];

  elements.forEach((element) => {
    const validation = validateTouchTargetSize(element.width, element.height);
    
    if (validation.isValid) {
      validElements.push(element.id);
    } else {
      invalidElements.push({
        id: element.id,
        issues: validation.errors,
      });
    }
  });

  return {
    allValid: invalidElements.length === 0,
    validElements,
    invalidElements,
    summary: {
      total: elements.length,
      valid: validElements.length,
      invalid: invalidElements.length,
    },
  };
}

/**
 * Helper to check if an element meets touch target requirements using DOM element
 */
export function checkElementTouchTarget(element: HTMLElement): TouchTargetValidation {
  const rect = element.getBoundingClientRect();
  return validateTouchTargetSize(rect.width, rect.height);
}

/**
 * CSS-in-JS styles for touch target compliance
 */
export function getTouchTargetStyles(
  size: 'minimum' | 'recommended' = 'minimum'
): React.CSSProperties {
  const targetSize = size === 'minimum' ? TOUCH_TARGETS.MINIMUM : TOUCH_TARGETS.RECOMMENDED;
  
  return {
    minWidth: `${targetSize}px`,
    minHeight: `${targetSize}px`,
    padding: `${TOUCH_TARGETS.SPACING}px`,
    cursor: 'pointer',
    // Ensure touch targets are properly positioned
    position: 'relative',
    // Improve touch response
    touchAction: 'manipulation',
  };
}

/**
 * Get touch target wrapper styles for React components
 */
export function getTouchTargetWrapperStyles(
  touchTargetSize: 'minimum' | 'recommended' = 'minimum'
): React.CSSProperties {
  const styles = getTouchTargetStyles(touchTargetSize);
  
  return {
    ...styles,
    display: 'inline-block',
    // Ensure proper wrapping behavior
    boxSizing: 'border-box',
  };
}

/**
 * Constants for common touch target patterns
 */
export const TOUCH_TARGET_PATTERNS = {
  BUTTON: getTouchTargetClasses('recommended', true),
  ICON_BUTTON: getTouchTargetClasses('minimum', true),
  LINK: getTouchTargetClasses('minimum', false),
  INPUT: getTouchTargetClasses('recommended', false),
  CHECKBOX: getTouchTargetClasses('minimum', true),
} as const;