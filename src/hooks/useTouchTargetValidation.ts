/**
 * React hook for touch target validation and accessibility monitoring
 */

import { useEffect, useRef, useState } from 'react';
import { 
  validateContainerTouchTargets,
  enableTouchTargetMonitoring,
  type ValidationSummary 
} from '../utils/touchTargetValidation.js';

export interface UseTouchTargetValidationOptions {
  enabled?: boolean;
  container?: HTMLElement;
  realTimeMonitoring?: boolean;
  onValidationChange?: (summary: ValidationSummary) => void;
}

export interface UseTouchTargetValidationReturn {
  validation: ValidationSummary | null;
  isCompliant: boolean;
  compliancePercentage: number;
  revalidate: () => void;
  invalidElements: number;
}

/**
 * Hook to validate and monitor touch target accessibility compliance
 */
export const useTouchTargetValidation = ({
  enabled = process.env.NODE_ENV === 'development',
  container,
  realTimeMonitoring = false,
  onValidationChange
}: UseTouchTargetValidationOptions = {}): UseTouchTargetValidationReturn => {
  const [validation, setValidation] = useState<ValidationSummary | null>(null);
  const cleanupRef = useRef<(() => void) | null>(null);
  
  const revalidate = () => {
    if (!enabled) return;
    
    try {
      const summary = validateContainerTouchTargets(container);
      setValidation(summary);
      
      if (onValidationChange) {
        onValidationChange(summary);
      }
      
      // Log validation results in development
      if (process.env.NODE_ENV === 'development') {
        if (summary.compliance === 100) {
          console.log(`✅ Touch Target Compliance: ${summary.compliance}%`, summary);
        } else {
          console.warn(`⚠️ Touch Target Issues: ${summary.invalidElements} of ${summary.totalElements} elements need attention`, summary);
        }
      }
    } catch (error) {
      console.error('Touch target validation failed:', error);
    }
  };
  
  useEffect(() => {
    if (!enabled) return;
    
    // Initial validation
    revalidate();
    
    // Setup real-time monitoring if requested
    if (realTimeMonitoring) {
      cleanupRef.current = enableTouchTargetMonitoring(container);
    }
    
    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }
    };
  }, [enabled, container, realTimeMonitoring]);
  
  // Update validation when container changes
  useEffect(() => {
    if (enabled && container) {
      revalidate();
    }
  }, [container]);
  
  const isCompliant = validation?.compliance === 100 || false;
  const compliancePercentage = validation?.compliance || 0;
  const invalidElements = validation?.invalidElements || 0;
  
  return {
    validation,
    isCompliant,
    compliancePercentage,
    revalidate,
    invalidElements
  };
};

/**
 * Hook for validating specific component's touch targets
 */
export const useComponentTouchTargetValidation = (
  componentRef: React.RefObject<HTMLElement>,
  options: Omit<UseTouchTargetValidationOptions, 'container'> = {}
) => {
  return useTouchTargetValidation({
    ...options,
    container: componentRef.current || undefined
  });
};