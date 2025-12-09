import React from 'react';
import type { FilterResult, FilterError } from '../../types/wordFilter.js';
import { useViewport } from '../../hooks/useViewport.js';
import { getResponsiveColumns } from '../../utils/responsive.js';
import { SkeletonLoader, LoadingSpinner } from '../EnhancedLoadingComponents.js';
import { COMPONENT_TYPOGRAPHY } from '../../utils/typographySystem.js';

interface FilterResultsProps {
  /** Result of the word filtering operation */
  result: FilterResult | null;
  /** Whether filtering is currently in progress */
  isLoading: boolean;
  /** Any error that occurred during filtering */
  error: FilterError | null;
  /** Grid layout preference */
  gridLayout?: 'auto' | 'single' | 'grid';
  /** Number of columns for mobile */
  mobileColumns?: number;
  /** Number of columns for tablet */
  tabletColumns?: number;
  /** Number of columns for desktop */
  desktopColumns?: number;
}

/**
 * Component for displaying word filter results, metadata, and error states
 */
export const FilterResults: React.FC<FilterResultsProps> = ({
  result,
  isLoading,
  error,
  gridLayout = 'auto',
  mobileColumns = 1,
  tabletColumns = 2,
  desktopColumns = 4
}) => {
  const { breakpoint } = useViewport();
  
  // Calculate responsive grid columns
  const getGridColumns = () => {
    if (gridLayout === 'single') return 1;
    if (gridLayout === 'grid') {
      switch (breakpoint) {
        case 'mobile': return mobileColumns;
        case 'tablet': return tabletColumns;
        case 'desktop': return desktopColumns;
        default: return getResponsiveColumns(breakpoint);
      }
    }
    // Auto layout based on content and viewport
    return getResponsiveColumns(breakpoint);
  };

  const gridCols = getGridColumns();
  const gridClasses = `grid gap-2 sm:gap-3 ${
    gridCols === 1 ? 'grid-cols-1' :
    gridCols === 2 ? 'grid-cols-2' :
    gridCols === 3 ? 'grid-cols-3' :
    gridCols === 4 ? 'grid-cols-4' :
    'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
  }`;

  // Loading state with enhanced skeleton UI
  if (isLoading) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm px-2 py-3 sm:p-6">
        {/* Loading header */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-3">
            <LoadingSpinner size="md" color="primary" />
            <span className="text-gray-700 font-medium">Filtering words...</span>
          </div>
        </div>
        
        {/* Skeleton content preview */}
        <div className="space-y-6">
          {/* Metadata skeleton */}
          <div className="flex justify-between items-center pb-4 border-b border-gray-100">
            <SkeletonLoader variant="text" lines={1} width="120px" />
            <SkeletonLoader variant="text" lines={1} width="80px" />
          </div>
          
          {/* Results grid skeleton */}
          <div className={gridClasses}>
            {Array.from({ length: Math.min(getGridColumns() * 3, 12) }).map((_, i) => (
              <div key={i} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <SkeletonLoader 
                  variant="custom" 
                  width="100%" 
                  height="32px"
                  className="rounded"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl px-2 py-3 sm:p-6">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <svg className="h-6 w-6 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-red-800 mb-2">
              {error.type === 'validation' && 'Validation Error'}
              {error.type === 'constraint' && 'No Matching Words'}
              {error.type === 'processing' && 'Processing Error'}
            </h3>
            <div className="text-red-700">
              <p className="leading-relaxed">{error.message}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // No results yet
  if (!result) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-xl px-2 py-6 sm:p-8 text-center">
        <div className="text-gray-500">
          <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <h3 className={`${COMPONENT_TYPOGRAPHY.filterResults.title} text-gray-900 mb-2 font-semibold`}>
            No filter applied yet
          </h3>
          <p className="text-gray-600 leading-relaxed">
            Configure your segments and click "Filter Words" to see results.
          </p>
        </div>
      </div>
    );
  }

  const { words } = result;

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
      {/* Results Header */}
      <div className="border-b border-gray-100 px-2 py-3 sm:p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-900">
            Filter Results
          </h3>
          {words.length > 0 && (
            <div className="text-sm text-gray-600 font-medium bg-gray-100 px-3 py-1 rounded-full">
              Found {words.length} word{words.length !== 1 ? 's' : ''}
            </div>
          )}
        </div>
      </div>

      {/* Results Content */}
      <div className="px-2 py-3 sm:p-6">
        {words.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0118 12a8 8 0 10-16 0 8 8 0 002 5.291z" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No words found</h3>
            <p className="text-gray-600 leading-relaxed">
              Try adjusting your segment constraints or available letters.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Words Grid */}
            <div className={`grid gap-3 ${gridClasses}`}>
              {words.map((word, index) => (
                <div
                  key={`${word}-${index}`}
                  className="bg-blue-50 text-blue-900 px-4 py-3 rounded-lg text-center font-semibold border border-blue-200 hover:bg-blue-100 hover:border-blue-300 transition-all duration-200 min-h-[48px] flex items-center justify-center shadow-sm"
                >
                  {word.toUpperCase()}
                </div>
              ))}
            </div>

            {/* Word Count Summary */}
            {words.length > 10 && (
              <div className="text-center">
                <div className="inline-flex items-center text-sm text-gray-600 bg-gray-100 px-4 py-2 rounded-lg border border-gray-200">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0118 12a8 8 0 10-16 0 8 8 0 002 5.291z" />
                  </svg>
                  Showing all {words.length} matching words
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterResults;