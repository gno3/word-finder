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
      {/* Header Section */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-slate-900 mb-3">Word Pattern Filter</h2>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Create segments with specific letter pools and lengths to find matching words
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Left Column - Form */}
        <div className="space-y-6">
          <div className="card-modern p-6">
            <WordFilterForm
              onFilter={handleFilter}
              isLoading={isLoading}
              disabled={false}
            />
          </div>
        </div>

        {/* Right Column - Results */}
        <div className="space-y-6">
          <FilterResults
            result={result}
            isLoading={isLoading}
            error={error}
          />
        </div>
      </div>
    </div>
  );
  };

export default WordFilter;