/**
 * Typography accessibility audit utility
 * Scans components for accessibility issues and provides recommendations
 */

import { validateTypographyAccessibility, convertToAccessibleTypography } from './accessibleTypography.js';

export interface TypographyAuditResult {
  element: HTMLElement;
  tagName: string;
  className: string;
  isAccessible: boolean;
  issues: string[];
  recommendations: string[];
  suggestedClasses?: string;
}

export interface TypographyAuditSummary {
  totalElements: number;
  accessibleElements: number;
  problematicElements: number;
  compliance: number;
  results: TypographyAuditResult[];
  commonIssues: string[];
}

/**
 * Audit typography accessibility for all text elements in a container
 */
export const auditTypographyAccessibility = (
  container: HTMLElement = document.body
): TypographyAuditSummary => {
  // Target text-containing elements that should have accessible typography
  const textSelectors = [
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'p', 'span', 'div', 'button', 'a', 'label',
    'input', 'textarea', 'select', 'option',
    '[class*="text-"]'
  ].join(', ');
  
  const elements = container.querySelectorAll(textSelectors) as NodeListOf<HTMLElement>;
  const results: TypographyAuditResult[] = [];
  const issueMap = new Map<string, number>();
  
  elements.forEach(element => {
    // Skip empty or hidden elements
    if (!element.textContent?.trim() || 
        getComputedStyle(element).display === 'none' ||
        getComputedStyle(element).visibility === 'hidden') {
      return;
    }
    
    const className = element.className || '';
    const tagName = element.tagName.toLowerCase();
    
    const validation = validateTypographyAccessibility(className);
    
    // Track common issues
    validation.issues.forEach(issue => {
      issueMap.set(issue, (issueMap.get(issue) || 0) + 1);
    });
    
    let suggestedClasses: string | undefined;
    if (!validation.isAccessible) {
      suggestedClasses = convertToAccessibleTypography(className);
    }
    
    results.push({
      element,
      tagName,
      className,
      isAccessible: validation.isAccessible,
      issues: validation.issues,
      recommendations: validation.recommendations,
      suggestedClasses
    });
  });
  
  const totalElements = results.length;
  const accessibleElements = results.filter(r => r.isAccessible).length;
  const problematicElements = totalElements - accessibleElements;
  const compliance = totalElements > 0 ? (accessibleElements / totalElements) * 100 : 100;
  
  // Get most common issues
  const commonIssues = Array.from(issueMap.entries())
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([issue]) => issue);
  
  return {
    totalElements,
    accessibleElements,
    problematicElements,
    compliance,
    results,
    commonIssues
  };
};

/**
 * Generate a detailed typography accessibility report
 */
export const generateTypographyReport = (summary: TypographyAuditSummary): string => {
  const { 
    totalElements, 
    accessibleElements, 
    problematicElements, 
    compliance, 
    results, 
    commonIssues 
  } = summary;
  
  let report = `Typography Accessibility Audit Report\n`;
  report += `==========================================\n\n`;
  report += `📊 Summary:\n`;
  report += `  Total Text Elements: ${totalElements}\n`;
  report += `  Accessible Elements: ${accessibleElements}\n`;
  report += `  Problematic Elements: ${problematicElements}\n`;
  report += `  Compliance Rate: ${compliance.toFixed(1)}%\n\n`;
  
  if (commonIssues.length > 0) {
    report += `🔍 Most Common Issues:\n`;
    commonIssues.forEach((issue, index) => {
      report += `  ${index + 1}. ${issue}\n`;
    });
    report += `\n`;
  }
  
  if (problematicElements > 0) {
    report += `⚠️  Problematic Elements:\n`;
    report += `${'='.repeat(25)}\n`;
    
    const problematicResults = results.filter(r => !r.isAccessible);
    
    problematicResults.forEach((result, index) => {
      report += `\n${index + 1}. <${result.tagName}> element\n`;
      report += `   Current classes: "${result.className}"\n`;
      
      if (result.issues.length > 0) {
        report += `   Issues:\n`;
        result.issues.forEach(issue => {
          report += `     • ${issue}\n`;
        });
      }
      
      if (result.recommendations.length > 0) {
        report += `   Recommendations:\n`;
        result.recommendations.forEach(rec => {
          report += `     • ${rec}\n`;
        });
      }
      
      if (result.suggestedClasses) {
        report += `   Suggested: "${result.suggestedClasses}"\n`;
      }
    });
  } else {
    report += `✅ All text elements meet accessibility guidelines!\n`;
  }
  
  report += `\n📋 Best Practices:\n`;
  report += `  • Use text-base (16px) minimum on mobile to prevent iOS zoom\n`;
  report += `  • Apply responsive typography: text-base sm:text-sm\n`;
  report += `  • Ensure sufficient line height (1.5) for readability\n`;
  report += `  • Test with actual devices and screen readers\n`;
  
  return report;
};

/**
 * Log typography audit results to console with formatting
 */
export const auditAndLogTypography = (container?: HTMLElement): TypographyAuditSummary => {
  const summary = auditTypographyAccessibility(container);
  const report = generateTypographyReport(summary);
  
  if (summary.compliance === 100) {
    console.log('📝 Typography Audit:', report);
  } else {
    console.warn('📝 Typography Issues Found:', report);
  }
  
  return summary;
};

/**
 * Enable real-time typography monitoring during development
 */
export const enableTypographyMonitoring = (container?: HTMLElement): () => void => {
  if (process.env.NODE_ENV !== 'development') {
    return () => {}; // No-op in production
  }
  
  let timeoutId: ReturnType<typeof setTimeout>;
  
  const checkTypography = () => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      const summary = auditTypographyAccessibility(container);
      
      if (summary.problematicElements > 0) {
        console.warn(
          `📝 Typography Issues: ${summary.problematicElements} elements need attention (${summary.compliance.toFixed(1)}% compliant)`
        );
      }
    }, 2000); // Debounce checks
  };
  
  // Monitor DOM changes
  const observer = new MutationObserver(checkTypography);
  observer.observe(container || document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['class']
  });
  
  // Initial check
  checkTypography();
  
  // Return cleanup function
  return () => {
    clearTimeout(timeoutId);
    observer.disconnect();
  };
};

/**
 * Development helper to fix typography issues automatically (for testing)
 */
export const autoFixTypographyIssues = (
  container: HTMLElement = document.body,
  dryRun: boolean = true
): {
  totalFixed: number;
  changes: Array<{ element: HTMLElement; oldClass: string; newClass: string }>;
} => {
  if (process.env.NODE_ENV === 'production') {
    console.warn('Auto-fix should not be used in production');
    return { totalFixed: 0, changes: [] };
  }
  
  const summary = auditTypographyAccessibility(container);
  const changes: Array<{ element: HTMLElement; oldClass: string; newClass: string }> = [];
  
  summary.results.forEach(result => {
    if (!result.isAccessible && result.suggestedClasses) {
      const oldClass = result.className;
      const newClass = result.suggestedClasses;
      
      changes.push({
        element: result.element,
        oldClass,
        newClass
      });
      
      if (!dryRun) {
        result.element.className = newClass;
      }
    }
  });
  
  if (dryRun) {
    console.log(`🔧 Typography Auto-fix (DRY RUN): Would fix ${changes.length} elements`);
  } else {
    console.log(`🔧 Typography Auto-fix: Fixed ${changes.length} elements`);
  }
  
  return {
    totalFixed: changes.length,
    changes
  };
};