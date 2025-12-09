import React, { useRef } from 'react';
import type { Segment } from '../../types/wordFilter.js';
import { useWordFilter } from '../../hooks/useWordFilter.js';
import { useViewport } from '../../hooks/useViewport.js';
import { useTouchTargetValidation } from '../../hooks/useTouchTargetValidation.js';
import { WordFilterForm } from './WordFilterForm.js';
import { FilterResults } from './FilterResults.js';
import { COMPONENT_SPACING, PADDING_PATTERNS } from '../../utils/spacingSystem.js';
import { COMPONENT_TYPOGRAPHY } from '../../utils/typographySystem.js';
import { SCREEN_READER_TEXT } from '../../utils/ariaSystem.js';
import { useAccessibilityValidation } from '../../utils/accessibilityValidation.js';
import { usePerformanceMonitor, useWordFilterOptimizations } from '../../utils/performanceOptimizations.js';
import { useLayoutTransition, useOrientationTransition } from '../../utils/smoothTransitions.js';

/**
 * Main page component for the Word Filter feature
 * Integrates form, results, and state management
 */
export const WordFilter: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const {
    isLoading,
    result,
    error,
    filterWords,
    resetAll,
    canReset
  } = useWordFilter();
  
  const { isMobile } = useViewport();
  
  // Smooth transition hooks for responsive changes
  const { transitionClass: layoutTransitionClass } = useLayoutTransition([
    isMobile, result?.words?.length
  ]);
  
  const { transitionClass: orientationTransitionClass } = useOrientationTransition();

  // Performance monitoring for development
  const performanceMetrics = usePerformanceMonitor('WordFilter');
  
  // Performance optimizations
  const { 
    layoutConfig, 
    shouldRenderResults 
  } = useWordFilterOptimizations();

  // Touch target validation for development
  const { compliancePercentage, invalidElements } = useTouchTargetValidation({
    enabled: process.env.NODE_ENV === 'development',
    container: containerRef.current || undefined,
    realTimeMonitoring: true
  });
  
  // Accessibility validation for development
  const { isCompliant, score } = useAccessibilityValidation(containerRef as React.RefObject<Element>, {
    includeAria: true,
    includeKeyboard: true,
    includeScreenReader: true
  });

  // Log development metrics
  if (process.env.NODE_ENV === 'development') {
    if (invalidElements > 0) {
      console.info(`📱 Touch Target Status: ${compliancePercentage.toFixed(1)}% compliant, ${invalidElements} elements need attention`);
    }
    if (!isCompliant) {
      console.info(`♿ Accessibility Status: ${score}% compliant, ${isCompliant ? 'PASSED' : 'NEEDS ATTENTION'}`);
    }
    if (performanceMetrics.lastRenderTime > 16) {
      console.info(`⚡ Performance: Last render ${performanceMetrics.lastRenderTime.toFixed(2)}ms (avg: ${performanceMetrics.averageRenderTime.toFixed(2)}ms)`);
    }
  }

  // Accessible typography classes with enhanced visual hierarchy
  const titleClasses = COMPONENT_TYPOGRAPHY.wordFilter.title;
  const subtitleClasses = COMPONENT_TYPOGRAPHY.wordFilter.subtitle;

  const handleFilter = (segments: Segment[]) => {
    filterWords(segments);
  };

  // Apply consistent spacing system from T024 with performance optimizations
  const containerSpacing = layoutConfig.containerPadding || COMPONENT_SPACING.wordFilterForm.containerPadding;
  const formCardPadding = layoutConfig.containerPadding || COMPONENT_SPACING.wordFilterForm.containerPadding;
  
  // Header spacing following design system
  const headerPadding = PADDING_PATTERNS.content.responsive;
  const contentPadding = PADDING_PATTERNS.section.responsive;

  return (
    <main 
      ref={containerRef} 
      className={`min-h-screen bg-gray-50 ${containerSpacing} ${contentPadding}`}
      role="main"
      aria-label="Word Pattern Filter Application"
    >
      {/* Skip navigation for screen readers */}
      <a 
        href="#filter-form" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded"
      >
        {SCREEN_READER_TEXT.navigation.skipToMain}
      </a>

      {/* Main Container with Clean Layout and Smooth Transitions */}
      <div className={`max-w-4xl mx-auto ${layoutTransitionClass}`}>
        {/* Header Section with Improved Typography */}
        <header className={`text-center ${headerPadding} mb-8 ${orientationTransitionClass}`} role="banner">
          <h1 className={`${titleClasses} text-gray-900 mb-3 font-semibold tracking-tight`}>
            Word Pattern Filter
          </h1>
          <p className={`${subtitleClasses} text-gray-600 max-w-2xl mx-auto leading-relaxed`}>
            Create segments with specific letter pools and lengths to find matching words
          </p>
        </header>

        {/* Content Area with Visual Grouping and Smooth Transitions */}
        <div className="space-y-8">
          {/* Form Section - Clean Card Design with Transitions */}
          <section 
            className={`bg-white rounded-xl border border-gray-200 shadow-sm transition-all duration-300 hover:shadow-md`}
            aria-labelledby="form-heading"
          >
            <div className={formCardPadding}>
              <WordFilterForm
                onFilter={handleFilter}
                isLoading={isLoading}
                disabled={false}
                mobileOptimized={isMobile}
                onReset={resetAll}
                resetDisabled={!canReset}
              />
            </div>
          </section>

          {/* Results Section - Enhanced Visual Hierarchy with Performance Optimization */}
          <section 
            className="space-y-4"
            aria-labelledby="results-heading"
            aria-live="polite"
            aria-atomic="false"
          >
            {shouldRenderResults(result?.words?.length || 0) ? (
              <FilterResults
                result={result}
                isLoading={isLoading}
                error={error}
                gridLayout="auto"
                mobileColumns={layoutConfig.gridColumns}
                tabletColumns={2}
                desktopColumns={3}
              />
            ) : (
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm px-2 py-3 sm:p-6">
                <div className="text-center text-gray-600">
                  <p>Results are being optimized for performance...</p>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
  };

export default WordFilter;