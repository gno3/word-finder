/**
 * Accessibility Validation Utility
 * 
 * Provides comprehensive accessibility testing and validation tools
 * to ensure WCAG AA compliance for the Word Filter application.
 * 
 * Features:
 * - Color contrast validation
 * - ARIA attribute checking
 * - Keyboard navigation validation
 * - Screen reader compatibility testing
 * - Focus management verification
 * - Semantic HTML structure validation
 */

import React from 'react';

// WCAG AA Contrast Requirements
export const CONTRAST_REQUIREMENTS = {
  normal: 4.5,     // Normal text (under 18pt or under 14pt bold)
  large: 3.0,      // Large text (18pt+ or 14pt+ bold)
  ui: 3.0          // UI components and graphical objects
} as const;

// Color contrast calculation utilities
export const contrastUtils = {
  /**
   * Calculate relative luminance of a color
   * @param color - RGB color values [r, g, b] (0-255)
   */
  getLuminance: (color: [number, number, number]): number => {
    const [r, g, b] = color.map(c => {
      const sRGB = c / 255;
      return sRGB <= 0.03928 ? sRGB / 12.92 : Math.pow((sRGB + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  },

  /**
   * Calculate contrast ratio between two colors
   * @param color1 - First color [r, g, b]
   * @param color2 - Second color [r, g, b]
   */
  getContrastRatio: (color1: [number, number, number], color2: [number, number, number]): number => {
    const lum1 = contrastUtils.getLuminance(color1);
    const lum2 = contrastUtils.getLuminance(color2);
    const lightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    return (lightest + 0.05) / (darkest + 0.05);
  },

  /**
   * Parse CSS color to RGB values
   * @param color - CSS color string (hex, rgb, etc.)
   */
  parseColor: (color: string): [number, number, number] | null => {
    // Create temporary element to get computed color
    const div = document.createElement('div');
    div.style.color = color;
    document.body.appendChild(div);
    const computedColor = window.getComputedStyle(div).color;
    document.body.removeChild(div);

    // Parse rgb/rgba format
    const match = computedColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (match) {
      return [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])];
    }
    return null;
  },

  /**
   * Check if contrast ratio meets WCAG AA requirements
   * @param ratio - Contrast ratio value
   * @param textSize - 'normal' | 'large' | 'ui'
   */
  meetsWCAG: (ratio: number, textSize: keyof typeof CONTRAST_REQUIREMENTS): boolean => {
    return ratio >= CONTRAST_REQUIREMENTS[textSize];
  }
};

// ARIA validation utilities
export const ariaUtils = {
  /**
   * Validate required ARIA attributes for common roles
   */
  validateAriaAttributes: (element: Element): string[] => {
    const errors: string[] = [];
    const role = element.getAttribute('role');
    const tagName = element.tagName.toLowerCase();

    // Button validation
    if (tagName === 'button' || role === 'button') {
      if (!element.getAttribute('aria-label') && !element.textContent?.trim()) {
        errors.push('Button must have accessible name (aria-label or text content)');
      }
    }

    // Form input validation
    if (['input', 'textarea', 'select'].includes(tagName)) {
      const hasLabel = element.getAttribute('aria-label') || 
                      element.getAttribute('aria-labelledby') ||
                      document.querySelector(`label[for="${element.id}"]`);
      
      if (!hasLabel) {
        errors.push('Form input must have associated label');
      }

      // Required field validation
      if (element.hasAttribute('required') || element.getAttribute('aria-required') === 'true') {
        if (!element.getAttribute('aria-required')) {
          errors.push('Required field should have aria-required="true"');
        }
      }
    }

    // Heading validation
    if (tagName.match(/^h[1-6]$/)) {
      if (!element.textContent?.trim()) {
        errors.push('Heading must have text content');
      }
    }

    // Link validation
    if (tagName === 'a') {
      if (!element.getAttribute('href') && !role) {
        errors.push('Link must have href attribute or appropriate role');
      }
      if (!element.textContent?.trim() && !element.getAttribute('aria-label')) {
        errors.push('Link must have accessible name');
      }
    }

    return errors;
  },

  /**
   * Check for proper ARIA live regions
   */
  validateLiveRegions: (container: Element): string[] => {
    const errors: string[] = [];
    const liveRegions = container.querySelectorAll('[aria-live]');

    liveRegions.forEach((region, index) => {
      const liveValue = region.getAttribute('aria-live');
      if (!['polite', 'assertive', 'off'].includes(liveValue || '')) {
        errors.push(`Live region ${index + 1}: aria-live must be 'polite', 'assertive', or 'off'`);
      }
    });

    return errors;
  },

  /**
   * Validate landmark structure
   */
  validateLandmarks: (container: Element): string[] => {
    const errors: string[] = [];

    // Check for main landmark
    const mainLandmarks = container.querySelectorAll('main, [role="main"]');
    if (mainLandmarks.length === 0) {
      errors.push('Page should have a main landmark');
    } else if (mainLandmarks.length > 1) {
      errors.push('Page should have only one main landmark');
    }

    return errors;
  }
};

// Keyboard navigation validation
export const keyboardUtils = {
  /**
   * Check if element is keyboard focusable
   */
  isFocusable: (element: Element): boolean => {
    const tagName = element.tagName.toLowerCase();
    const tabIndex = element.getAttribute('tabindex');
    
    // Naturally focusable elements
    const focusableElements = ['input', 'button', 'select', 'textarea', 'a'];
    if (focusableElements.includes(tagName) && !element.hasAttribute('disabled')) {
      return tabIndex !== '-1';
    }

    // Elements with positive tabindex
    if (tabIndex && parseInt(tabIndex) >= 0) {
      return true;
    }

    return false;
  },

  /**
   * Validate focus management
   */
  validateFocusManagement: (container: Element): string[] => {
    const errors: string[] = [];
    const interactiveElements = container.querySelectorAll('button, input, select, textarea, a[href], [tabindex]:not([tabindex="-1"])');

    interactiveElements.forEach((element, index) => {
      // Check for focus indicators
      const computedStyle = window.getComputedStyle(element, ':focus');
      const hasOutline = computedStyle.outline !== 'none' && computedStyle.outline !== '0px';
      const hasBoxShadow = computedStyle.boxShadow !== 'none';
      const hasBorder = computedStyle.borderWidth !== '0px';

      if (!hasOutline && !hasBoxShadow && !hasBorder) {
        errors.push(`Interactive element ${index + 1} (${element.tagName.toLowerCase()}) lacks visible focus indicator`);
      }

      // Check tabindex usage
      const tabIndex = element.getAttribute('tabindex');
      if (tabIndex && parseInt(tabIndex) > 0) {
        errors.push(`Interactive element ${index + 1}: Avoid positive tabindex values`);
      }
    });

    return errors;
  },

  /**
   * Test keyboard navigation flow
   */
  validateTabOrder: (container: Element): string[] => {
    const errors: string[] = [];
    const focusableElements = Array.from(container.querySelectorAll('button, input, select, textarea, a[href], [tabindex]:not([tabindex="-1"])'));

    // Sort by tab order
    const tabOrder = focusableElements.sort((a, b) => {
      const aTabIndex = parseInt(a.getAttribute('tabindex') || '0');
      const bTabIndex = parseInt(b.getAttribute('tabindex') || '0');
      return aTabIndex - bTabIndex;
    });

    // Check for logical tab order
    tabOrder.forEach((element, index) => {
      const rect = element.getBoundingClientRect();
      if (rect.width === 0 && rect.height === 0) {
        errors.push(`Focusable element ${index + 1} is not visible`);
      }
    });

    return errors;
  }
};

// Screen reader compatibility validation
export const screenReaderUtils = {
  /**
   * Validate semantic HTML structure
   */
  validateSemanticStructure: (container: Element): string[] => {
    const errors: string[] = [];

    // Check heading hierarchy
    const headings = Array.from(container.querySelectorAll('h1, h2, h3, h4, h5, h6'));
    let lastLevel = 0;

    headings.forEach((heading, index) => {
      const level = parseInt(heading.tagName.charAt(1));
      
      if (index === 0 && level !== 1) {
        errors.push('First heading should be h1');
      }
      
      if (level > lastLevel + 1) {
        errors.push(`Heading level ${level} skips levels (should not jump from h${lastLevel} to h${level})`);
      }
      
      lastLevel = level;
    });

    // Check for meaningful text alternatives
    const images = container.querySelectorAll('img');
    images.forEach((img, index) => {
      const alt = img.getAttribute('alt');
      const ariaLabel = img.getAttribute('aria-label');
      const role = img.getAttribute('role');
      
      if (role === 'presentation' || alt === '') {
        // Decorative images are ok
        return;
      }
      
      if (!alt && !ariaLabel) {
        errors.push(`Image ${index + 1} missing alt text or aria-label`);
      }
    });

    return errors;
  },

  /**
   * Validate form accessibility
   */
  validateFormAccessibility: (container: Element): string[] => {
    const errors: string[] = [];
    const forms = container.querySelectorAll('form');

    forms.forEach((form, formIndex) => {
      // Check for form labeling
      if (!form.getAttribute('aria-label') && !form.getAttribute('aria-labelledby')) {
        errors.push(`Form ${formIndex + 1} should have aria-label or aria-labelledby`);
      }

      // Check fieldsets and legends
      const fieldsets = form.querySelectorAll('fieldset');
      fieldsets.forEach((fieldset, fieldsetIndex) => {
        const legend = fieldset.querySelector('legend');
        if (!legend) {
          errors.push(`Fieldset ${fieldsetIndex + 1} in form ${formIndex + 1} missing legend`);
        }
      });

      // Check error messages
      const inputs = form.querySelectorAll('input, textarea, select');
      
      inputs.forEach((input, inputIndex) => {
        const hasError = input.getAttribute('aria-invalid') === 'true';
        const errorId = input.getAttribute('aria-describedby');
        
        if (hasError && !errorId) {
          errors.push(`Input ${inputIndex + 1} in form ${formIndex + 1} marked invalid but missing aria-describedby`);
        }
      });
    });

    return errors;
  }
};

// Main accessibility audit function
export interface AccessibilityAuditResult {
  passed: boolean;
  score: number;
  errors: Array<{
    category: string;
    message: string;
    severity: 'error' | 'warning';
    element?: Element;
  }>;
  summary: {
    totalTests: number;
    passedTests: number;
    failedTests: number;
    warningTests: number;
  };
}

/**
 * Comprehensive accessibility audit
 * @param container - Container element to audit (defaults to document.body)
 * @param options - Audit configuration options
 */
export const auditAccessibility = (
  container: Element = document.body,
  options: {
    includeAria?: boolean;
    includeKeyboard?: boolean;
    includeScreenReader?: boolean;
  } = {}
): AccessibilityAuditResult => {
  const {
    includeAria = true,
    includeKeyboard = true,
    includeScreenReader = true
  } = options;

  const errors: AccessibilityAuditResult['errors'] = [];

  // ARIA validation
  if (includeAria) {
    const elements = container.querySelectorAll('*');
    elements.forEach(element => {
      const ariaErrors = ariaUtils.validateAriaAttributes(element);
      ariaErrors.forEach(error => {
        errors.push({
          category: 'ARIA',
          message: error,
          severity: 'error',
          element
        });
      });
    });

    const liveRegionErrors = ariaUtils.validateLiveRegions(container);
    liveRegionErrors.forEach(error => {
      errors.push({
        category: 'ARIA',
        message: error,
        severity: 'warning'
      });
    });

    const landmarkErrors = ariaUtils.validateLandmarks(container);
    landmarkErrors.forEach(error => {
      errors.push({
        category: 'ARIA',
        message: error,
        severity: 'warning'
      });
    });
  }

  // Keyboard navigation validation
  if (includeKeyboard) {
    const keyboardErrors = keyboardUtils.validateFocusManagement(container);
    keyboardErrors.forEach(error => {
      errors.push({
        category: 'Keyboard',
        message: error,
        severity: 'error'
      });
    });

    const tabOrderErrors = keyboardUtils.validateTabOrder(container);
    tabOrderErrors.forEach(error => {
      errors.push({
        category: 'Keyboard',
        message: error,
        severity: 'warning'
      });
    });
  }

  // Screen reader validation
  if (includeScreenReader) {
    const semanticErrors = screenReaderUtils.validateSemanticStructure(container);
    semanticErrors.forEach(error => {
      errors.push({
        category: 'Screen Reader',
        message: error,
        severity: 'error'
      });
    });

    const formErrors = screenReaderUtils.validateFormAccessibility(container);
    formErrors.forEach(error => {
      errors.push({
        category: 'Screen Reader',
        message: error,
        severity: 'error'
      });
    });
  }

  // Calculate summary
  const errorCount = errors.filter(e => e.severity === 'error').length;
  const warningCount = errors.filter(e => e.severity === 'warning').length;
  const totalTests = errors.length;
  const passedTests = totalTests - errorCount - warningCount;

  const score = totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 100;
  const passed = errorCount === 0;

  return {
    passed,
    score,
    errors,
    summary: {
      totalTests,
      passedTests,
      failedTests: errorCount,
      warningTests: warningCount
    }
  };
};

// Development helper for logging accessibility results
export const logAccessibilityAudit = (result: AccessibilityAuditResult): void => {
  console.group('🔍 Accessibility Audit Results');
  
  console.log(`✅ Overall Score: ${result.score}% (${result.passed ? 'PASSED' : 'FAILED'})`);
  console.log(`📊 Tests: ${result.summary.passedTests} passed, ${result.summary.failedTests} errors, ${result.summary.warningTests} warnings`);
  
  if (result.errors.length > 0) {
    console.group('❌ Issues Found:');
    result.errors.forEach((error) => {
      const icon = error.severity === 'error' ? '🚫' : '⚠️';
      console.log(`${icon} [${error.category}] ${error.message}`);
      if (error.element) {
        console.log('   Element:', error.element);
      }
    });
    console.groupEnd();
  } else {
    console.log('🎉 No accessibility issues found!');
  }
  
  console.groupEnd();
};

// React hook for component accessibility validation
export const useAccessibilityValidation = (
  containerRef: React.RefObject<Element>,
  options?: Parameters<typeof auditAccessibility>[1]
) => {
  const [auditResult, setAuditResult] = React.useState<AccessibilityAuditResult | null>(null);

  const runAudit = React.useCallback(() => {
    if (containerRef.current) {
      const result = auditAccessibility(containerRef.current, options);
      setAuditResult(result);
      
      if (process.env.NODE_ENV === 'development') {
        logAccessibilityAudit(result);
      }
    }
  }, [containerRef, options]);

  React.useEffect(() => {
    // Run audit on mount and when dependencies change
    const timer = setTimeout(runAudit, 100); // Small delay for DOM to settle
    return () => clearTimeout(timer);
  }, [runAudit]);

  return {
    auditResult,
    runAudit,
    isCompliant: auditResult?.passed ?? true,
    score: auditResult?.score ?? 100
  };
};

export default {
  auditAccessibility,
  logAccessibilityAudit,
  useAccessibilityValidation,
  contrastUtils,
  ariaUtils,
  keyboardUtils,
  screenReaderUtils,
  CONTRAST_REQUIREMENTS
};