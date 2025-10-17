/**
 * Touch target validation utilities for accessibility compliance
 * Ensures interactive elements meet 44px minimum touch target requirement per WCAG 2.1 AA
 */

import { validateTouchTargetSize } from './touchTargets.js';

export interface TouchTargetValidationResult {
  isValid: boolean;
  element: HTMLElement;
  dimensions: {
    width: number;
    height: number;
  };
  recommendations?: string[];
}

export interface ValidationSummary {
  totalElements: number;
  validElements: number;
  invalidElements: number;
  compliance: number; // percentage
  results: TouchTargetValidationResult[];
}

/**
 * Validate a single element's touch target size
 */
export const validateElementTouchTarget = (element: HTMLElement): TouchTargetValidationResult => {
  const rect = element.getBoundingClientRect();
  const computedStyle = getComputedStyle(element);
  
  // Get effective touch target size including padding
  const paddingTop = parseFloat(computedStyle.paddingTop);
  const paddingBottom = parseFloat(computedStyle.paddingBottom);
  const paddingLeft = parseFloat(computedStyle.paddingLeft);
  const paddingRight = parseFloat(computedStyle.paddingRight);
  
  const effectiveWidth = rect.width + paddingLeft + paddingRight;
  const effectiveHeight = rect.height + paddingTop + paddingBottom;
  
  const validation = validateTouchTargetSize(effectiveWidth, effectiveHeight);
  const isValid = validation.isValid;
  
  const recommendations: string[] = [];
  
  // Use validation errors and recommendations from the touch target utility
  if (validation.errors.length > 0) {
    recommendations.push(...validation.errors);
  }
  
  if (validation.recommendations.length > 0) {
    recommendations.push(...validation.recommendations);
  }
  
  if (!isValid) {
    recommendations.push('Consider using min-h-11 min-w-11 classes for Tailwind compliance');
  }
  
  return {
    isValid,
    element,
    dimensions: {
      width: effectiveWidth,
      height: effectiveHeight
    },
    recommendations: recommendations.length > 0 ? recommendations : undefined
  };
};

/**
 * Validate touch targets for all interactive elements within a container
 */
export const validateContainerTouchTargets = (
  container: HTMLElement = document.body
): ValidationSummary => {
  // Interactive element selectors that should meet touch target requirements
  const interactiveSelectors = [
    'button',
    'a[href]',
    'input[type="button"]',
    'input[type="submit"]',
    'input[type="reset"]',
    'input[type="checkbox"]',
    'input[type="radio"]',
    'input[type="file"]',
    'select',
    'textarea',
    'input[type="text"]',
    'input[type="email"]',
    'input[type="password"]',
    'input[type="search"]',
    'input[type="tel"]',
    'input[type="url"]',
    'input[type="number"]',
    '[role="button"]',
    '[role="link"]',
    '[role="menuitem"]',
    '[role="tab"]',
    '[tabindex]',
    '.clickable',
    '.touch-target'
  ].join(', ');
  
  const elements = container.querySelectorAll(interactiveSelectors) as NodeListOf<HTMLElement>;
  const results: TouchTargetValidationResult[] = [];
  let validElements = 0;
  
  elements.forEach(element => {
    // Skip hidden or disabled elements
    const style = getComputedStyle(element);
    if (style.display === 'none' || style.visibility === 'hidden' || element.hasAttribute('disabled')) {
      return;
    }
    
    const validation = validateElementTouchTarget(element);
    results.push(validation);
    
    if (validation.isValid) {
      validElements++;
    }
  });
  
  const totalElements = results.length;
  const invalidElements = totalElements - validElements;
  const compliance = totalElements > 0 ? (validElements / totalElements) * 100 : 100;
  
  return {
    totalElements,
    validElements,
    invalidElements,
    compliance,
    results
  };
};

/**
 * Generate accessibility report for touch targets
 */
export const generateTouchTargetReport = (summary: ValidationSummary): string => {
  const { totalElements, validElements, invalidElements, compliance, results } = summary;
  
  let report = `Touch Target Accessibility Report\n`;
  report += `=====================================\n\n`;
  report += `Total Interactive Elements: ${totalElements}\n`;
  report += `Valid Touch Targets: ${validElements}\n`;
  report += `Invalid Touch Targets: ${invalidElements}\n`;
  report += `Compliance Rate: ${compliance.toFixed(1)}%\n\n`;
  
  if (invalidElements > 0) {
    report += `Issues Found:\n`;
    report += `-------------\n`;
    
    results
      .filter(result => !result.isValid)
      .forEach((result, index) => {
        const tagName = result.element.tagName.toLowerCase();
        const className = result.element.className || 'no-class';
        const { width, height } = result.dimensions;
        
        report += `${index + 1}. ${tagName}.${className}\n`;
        report += `   Size: ${width.toFixed(1)}px × ${height.toFixed(1)}px\n`;
        
        if (result.recommendations) {
          result.recommendations.forEach(rec => {
            report += `   • ${rec}\n`;
          });
        }
        report += `\n`;
      });
  } else {
    report += `🎉 All interactive elements meet touch target requirements!\n`;
  }
  
  return report;
};

/**
 * Development helper to validate touch targets and log results
 */
export const validateAndLogTouchTargets = (container?: HTMLElement): ValidationSummary => {
  const summary = validateContainerTouchTargets(container);
  const report = generateTouchTargetReport(summary);
  
  if (summary.compliance === 100) {
    console.log('✅ Touch Target Validation:', report);
  } else {
    console.warn('⚠️ Touch Target Issues Found:', report);
  }
  
  return summary;
};

/**
 * Real-time touch target monitoring for development
 */
export const enableTouchTargetMonitoring = (container?: HTMLElement): () => void => {
  let timeoutId: ReturnType<typeof setTimeout>;
  
  const checkTargets = () => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      validateAndLogTouchTargets(container);
    }, 1000);
  };
  
  // Monitor DOM changes
  const observer = new MutationObserver(checkTargets);
  observer.observe(container || document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['class', 'style']
  });
  
  // Monitor resize events
  const resizeHandler = () => checkTargets();
  window.addEventListener('resize', resizeHandler);
  
  // Initial check
  checkTargets();
  
  // Return cleanup function
  return () => {
    clearTimeout(timeoutId);
    observer.disconnect();
    window.removeEventListener('resize', resizeHandler);
  };
};