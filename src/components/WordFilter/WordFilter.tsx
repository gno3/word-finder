import React from 'react';
import type { Segment } from '../../types/wordFilter.js';
import { useWordFilter } from '../../hooks/useWordFilter.js';
import { WordFilterForm } from './WordFilterForm.js';
import { FilterResults } from './FilterResults.js';

/**
 * Main page component for the Word Filter feature
 * Integrates form, results, and state management
 */
export const WordFilter: React.FC = () => {
  const {
    isLoading,
    result,
    error,
    filterWords
  } = useWordFilter();

  const handleFilter = (segments: Segment[]) => {
    filterWords(segments);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Form */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <WordFilterForm
                onFilter={handleFilter}
                isLoading={isLoading}
                disabled={false}
              />
            </div>

            {/* Help Section */}
            <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
              <h3 className="text-lg font-medium text-blue-900 mb-3">
                How to Use Word Filter
              </h3>
              <div className="space-y-3 text-sm text-blue-800">
                <div>
                  <strong>1. Configure Segments:</strong> Each segment represents a part of the word.
                  Set the target length and available letters for each segment.
                </div>
                <div>
                  <strong>2. Letter Pool:</strong> Available letters define what can be used.
                  Frequency matters - enter "aa" to use "a" twice in that segment.
                </div>
                <div>
                  <strong>3. Filter Words:</strong> Each segment uses exactly its target length
                  of letters from its available pool.
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-blue-100 rounded">
                <h4 className="font-medium text-blue-900 text-sm mb-2">Example:</h4>
                <div className="text-xs text-blue-800">
                  <div>Segment 1: 3 letters from "caat" → can use "cat", "act", "aat", etc.</div>
                  <div>Segment 2: 2 letters from "hee" → can use "he", "eh", "ee"</div>
                  <div>Result: 5-letter words using those exact letter counts</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Results */}
          <div className="space-y-6">
            <FilterResults
              result={result}
              isLoading={isLoading}
              error={error}
            />

            {/* Statistics */}
            {result && result.metadata && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Performance Statistics
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-gray-50 p-3 rounded">
                    <div className="font-medium text-gray-700">Dictionary Size</div>
                    <div className="text-2xl font-bold text-blue-600">
                      {result.metadata.processedWords.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">words processed</div>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded">
                    <div className="font-medium text-gray-700">Length Filter</div>
                    <div className="text-2xl font-bold text-green-600">
                      {result.metadata.totalCandidates.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">candidates found</div>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded">
                    <div className="font-medium text-gray-700">Processing Speed</div>
                    <div className="text-2xl font-bold text-purple-600">
                      {result.metadata.processingTimeMs.toFixed(1)}ms
                    </div>
                    <div className="text-xs text-gray-500">execution time</div>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded">
                    <div className="font-medium text-gray-700">Success Rate</div>
                    <div className="text-2xl font-bold text-orange-600">
                      {result.words.length > 0 
                        ? `${((result.words.length / result.metadata.totalCandidates) * 100).toFixed(1)}%`
                        : '0%'
                      }
                    </div>
                    <div className="text-xs text-gray-500">match rate</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

export default WordFilter;