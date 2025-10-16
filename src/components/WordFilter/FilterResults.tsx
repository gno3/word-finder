import React from 'react';
import type { FilterResult, FilterError } from '../../types/wordFilter.js';

interface FilterResultsProps {
  /** Result of the word filtering operation */
  result: FilterResult | null;
  /** Whether filtering is currently in progress */
  isLoading: boolean;
  /** Any error that occurred during filtering */
  error: FilterError | null;
}

/**
 * Component for displaying word filter results, metadata, and error states
 */
export const FilterResults: React.FC<FilterResultsProps> = ({
  result,
  isLoading,
  error
}) => {
  // Loading state
  if (isLoading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-center">
          <div className="flex items-center space-x-3">
            <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-gray-700">Filtering words...</span>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              {error.type === 'validation' && 'Validation Error'}
              {error.type === 'constraint' && 'No Matching Words'}
              {error.type === 'processing' && 'Processing Error'}
            </h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error.message}</p>
              {error.details && (
                <div className="mt-2 text-xs bg-red-100 p-2 rounded">
                  <pre className="whitespace-pre-wrap">{JSON.stringify(error.details, null, 2)}</pre>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // No results yet
  if (!result) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
        <div className="text-gray-500">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No filter applied yet</h3>
          <p className="mt-1 text-sm text-gray-500">
            Configure your segments and click "Filter Words" to see results.
          </p>
        </div>
      </div>
    );
  }

  const { words, metadata } = result;

  return (
    <div className="bg-white border border-gray-200 rounded-lg">
      {/* Results Header with Metadata */}
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">
            Filter Results
          </h3>
          <div className="text-sm text-gray-500">
            {words.length} word{words.length !== 1 ? 's' : ''} found
          </div>
        </div>
        
        {metadata && (
          <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-gray-600">
            <div>
              <div className="font-medium">Words Processed</div>
              <div>{metadata.processedWords?.toLocaleString() || 0}</div>
            </div>
            <div>
              <div className="font-medium">Candidates</div>
              <div>{metadata.totalCandidates?.toLocaleString() || 0}</div>
            </div>
            <div>
              <div className="font-medium">Processing Time</div>
              <div>{metadata.processingTimeMs?.toFixed(1) || 0}ms</div>
            </div>
            <div>
              <div className="font-medium">Efficiency</div>
              <div>
                {metadata.processedWords > 0 
                  ? `${((metadata.totalCandidates / metadata.processedWords) * 100).toFixed(1)}%`
                  : '0%'
                }
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results Content */}
      <div className="p-4">
        {words.length === 0 ? (
          <div className="text-center py-8">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0118 12a8 8 0 10-16 0 8 8 0 002 5.291z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No words found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your segment constraints or available letters.
            </p>
          </div>
        ) : (
          <div>
            {/* Words Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
              {words.map((word, index) => (
                <div
                  key={`${word}-${index}`}
                  className="bg-blue-50 text-blue-900 px-3 py-2 rounded text-center font-medium text-sm border border-blue-200 hover:bg-blue-100 transition-colors"
                >
                  {word.toUpperCase()}
                </div>
              ))}
            </div>

            {/* Word Count Summary */}
            {words.length > 10 && (
              <div className="mt-4 text-center text-sm text-gray-600 bg-gray-50 p-2 rounded">
                Showing all {words.length} matching words
              </div>
            )}
          </div>
        )}
      </div>

      {/* Performance Information */}
      {metadata && metadata.processingTimeMs > 100 && (
        <div className="border-t border-gray-200 p-4 bg-yellow-50">
          <div className="text-sm text-yellow-800">
            <div className="font-medium">Performance Notice</div>
            <div className="mt-1">
              This search took {metadata.processingTimeMs.toFixed(0)}ms. 
              Consider using more specific constraints for faster results.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterResults;