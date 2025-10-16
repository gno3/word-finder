# Quickstart: Word Filtering Algorithm Implementation

**Date**: 2025-10-16  
**Purpose**: Step-by-step implementation guide for segment-based word filtering

## Overview

This guide walks through implementing a word filtering algorithm that takes ordered segment constraints and returns matching dictionary words. The implementation extends the existing dictionary utility (feature 001) with new filtering capabilities.

## Prerequisites

- Existing dictionary service from feature 001 (DictionaryService, useDictionary hook)
- TypeScript 5.9.3+ with React 19.1.1+
- Vite 7.1.7+ build system
- Tailwind CSS for styling

## Implementation Steps

### Step 1: Create Type Definitions

Create `/src/types/wordFilter.ts`:

```typescript
export interface Segment {
  availableLetters: string;
  targetLength: number;
}

export interface FilterResult {
  words: string[];
  error?: FilterError;
  metadata: {
    processedWords: number;
    processingTimeMs: number;
    totalCandidates: number;
  };
}

export interface FilterError {
  type: 'validation' | 'constraint' | 'processing';
  message: string;
  details: {
    segmentIndex?: number;
    constraint?: string;
    providedValue?: any;
    suggestion?: string;
  };
}
```

### Step 2: Implement Core Algorithm

Create `/src/services/wordFilterService.ts`:

```typescript
import { Segment, FilterResult, FilterError } from '../types/wordFilter';

export class WordFilterService {
  /**
   * Filter dictionary words by segment constraints
   */
  public async filterWords(
    segments: Segment[], 
    dictionary: string[]
  ): Promise<FilterResult> {
    const startTime = performance.now();
    
    // Validate input
    const validation = this.validateSegments(segments);
    const invalidSegment = validation.find(v => !v.isValid);
    if (invalidSegment?.error) {
      return { words: [], error: invalidSegment.error, metadata: this.createMetadata(0, 0, startTime) };
    }
    
    // Calculate total length for pre-filtering
    const totalLength = this.calculateTotalLength(segments);
    
    // Pre-filter by length
    const candidates = dictionary.filter(word => word.length === totalLength);
    
    // Filter by segment constraints
    const matchingWords: string[] = [];
    
    for (const word of candidates) {
      if (this.wordMatchesSegments(word, segments)) {
        matchingWords.push(word);
      }
    }
    
    // Sort alphabetically
    matchingWords.sort();
    
    const endTime = performance.now();
    return {
      words: matchingWords,
      metadata: this.createMetadata(dictionary.length, candidates.length, startTime, endTime)
    };
  }
  
  private wordMatchesSegments(word: string, segments: Segment[]): boolean {
    // Implementation details in Step 3
  }
}
```

### Step 3: Implement Segment Validation Logic

Add to `WordFilterService`:

```typescript
private wordMatchesSegments(word: string, segments: Segment[]): boolean {
  const segmentLengths = segments.map(s => s.targetLength);
  const wordSegments = this.splitWordIntoSegments(word, segmentLengths);
  
  for (let i = 0; i < segments.length; i++) {
    if (!this.validateSegmentLetters(wordSegments[i], segments[i].availableLetters)) {
      return false;
    }
  }
  
  return true;
}

private splitWordIntoSegments(word: string, lengths: number[]): string[] {
  const segments: string[] = [];
  let currentIndex = 0;
  
  for (const length of lengths) {
    segments.push(word.substring(currentIndex, currentIndex + length));
    currentIndex += length;
  }
  
  return segments;
}

private validateSegmentLetters(segmentText: string, availableLetters: string): boolean {
  // Create frequency map of available letters
  const availableFreq: Record<string, number> = {};
  for (const char of availableLetters.toLowerCase()) {
    availableFreq[char] = (availableFreq[char] || 0) + 1;
  }
  
  // Check if segment can be formed with available letters
  const usedFreq: Record<string, number> = {};
  for (const char of segmentText.toLowerCase()) {
    usedFreq[char] = (usedFreq[char] || 0) + 1;
    
    if (!availableFreq[char] || usedFreq[char] > availableFreq[char]) {
      return false;
    }
  }
  
  // Verify exact usage (strict one-to-one mapping)
  return Object.keys(usedFreq).length === Object.keys(availableFreq).length &&
         Object.entries(usedFreq).every(([char, count]) => availableFreq[char] === count);
}
```

### Step 4: Create React Hook

Create `/src/hooks/useWordFilter.ts`:

```typescript
import { useState, useCallback } from 'react';
import { useDictionary } from './useDictionary';
import { WordFilterService } from '../services/wordFilterService';
import { Segment, FilterResult, FilterError } from '../types/wordFilter';

export function useWordFilter() {
  const { words: dictionary, isLoading: dictionaryLoading, error: dictionaryError } = useDictionary();
  const [result, setResult] = useState<FilterResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<FilterError | null>(null);
  
  const filterService = new WordFilterService();
  
  const filterWords = useCallback(async (segments: Segment[]) => {
    if (!dictionary || dictionary.length === 0) {
      setError({
        type: 'processing',
        message: 'Dictionary not loaded',
        details: { suggestion: 'Wait for dictionary to load before filtering' }
      });
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const filterResult = await filterService.filterWords(segments, dictionary);
      setResult(filterResult);
      
      if (filterResult.error) {
        setError(filterResult.error);
      }
    } catch (err) {
      setError({
        type: 'processing',
        message: 'Unexpected error during filtering',
        details: { providedValue: err }
      });
    } finally {
      setIsLoading(false);
    }
  }, [dictionary, filterService]);
  
  const reset = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);
  
  return {
    filterWords,
    validateSegments: filterService.validateSegments.bind(filterService),
    result,
    isLoading: isLoading || dictionaryLoading,
    error: error || (dictionaryError ? { type: 'processing' as const, message: dictionaryError, details: {} } : null),
    metrics: result?.metadata || null,
    reset
  };
}
```

### Step 5: Create UI Component

Create `/src/components/WordFilter.tsx`:

```typescript
import React, { useState } from 'react';
import { useWordFilter } from '../hooks/useWordFilter';
import { Segment } from '../types/wordFilter';

export function WordFilter() {
  const [segments, setSegments] = useState<Segment[]>([
    { availableLetters: '', targetLength: 1 }
  ]);
  
  const { filterWords, result, isLoading, error, reset } = useWordFilter();
  
  const handleFilter = async () => {
    await filterWords(segments);
  };
  
  const addSegment = () => {
    setSegments([...segments, { availableLetters: '', targetLength: 1 }]);
  };
  
  const updateSegment = (index: number, field: keyof Segment, value: string | number) => {
    const updated = [...segments];
    updated[index] = { ...updated[index], [field]: value };
    setSegments(updated);
  };
  
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Word Pattern Filter</h2>
      
      {/* Segment Configuration */}
      <div className="space-y-4 mb-6">
        {segments.map((segment, index) => (
          <div key={index} className="flex gap-4 items-center">
            <label className="text-sm font-medium">Segment {index + 1}:</label>
            <input
              type="text"
              placeholder="Available letters"
              value={segment.availableLetters}
              onChange={(e) => updateSegment(index, 'availableLetters', e.target.value)}
              className="border rounded px-3 py-2 flex-1"
            />
            <input
              type="number"
              min="1"
              value={segment.targetLength}
              onChange={(e) => updateSegment(index, 'targetLength', parseInt(e.target.value) || 1)}
              className="border rounded px-3 py-2 w-20"
            />
          </div>
        ))}
        
        <button
          onClick={addSegment}
          className="text-blue-600 hover:text-blue-800 text-sm"
        >
          + Add Segment
        </button>
      </div>
      
      {/* Filter Button */}
      <button
        onClick={handleFilter}
        disabled={isLoading}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {isLoading ? 'Filtering...' : 'Find Words'}
      </button>
      
      {/* Results */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded">
          <p className="text-red-800 font-medium">{error.message}</p>
          {error.details.suggestion && (
            <p className="text-red-600 text-sm mt-1">{error.details.suggestion}</p>
          )}
        </div>
      )}
      
      {result && !error && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3">
            Found {result.words.length} words
          </h3>
          
          {result.words.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {result.words.map((word, index) => (
                <div key={index} className="bg-gray-100 rounded px-3 py-2 text-center">
                  {word}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No words match the specified pattern.</p>
          )}
          
          {/* Performance Metrics */}
          <div className="mt-4 text-sm text-gray-500">
            Processed {result.metadata.processedWords} words in {result.metadata.processingTimeMs.toFixed(0)}ms
          </div>
        </div>
      )}
    </div>
  );
}
```

### Step 6: Integration

Add the component to your main App:

```typescript
// In src/App.tsx
import { WordFilter } from './components/WordFilter';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <WordFilter />
    </div>
  );
}
```

## Testing

### Unit Tests Example

Create `/src/services/__tests__/wordFilterService.test.ts`:

```typescript
import { WordFilterService } from '../wordFilterService';

describe('WordFilterService', () => {
  const service = new WordFilterService();
  const testDictionary = ['cat', 'dog', 'hello', 'world', 'test'];
  
  test('filters words by single segment', async () => {
    const segments = [{ availableLetters: 'tac', targetLength: 3 }];
    const result = await service.filterWords(segments, testDictionary);
    
    expect(result.words).toContain('cat');
    expect(result.words).not.toContain('dog');
  });
  
  test('filters words by multiple segments', async () => {
    const segments = [
      { availableLetters: 'he', targetLength: 2 },
      { availableLetters: 'llo', targetLength: 3 }
    ];
    const result = await service.filterWords(segments, testDictionary);
    
    expect(result.words).toContain('hello');
  });
  
  test('returns validation error for invalid segments', async () => {
    const segments = [{ availableLetters: '', targetLength: 3 }];
    const result = await service.filterWords(segments, testDictionary);
    
    expect(result.error?.type).toBe('validation');
  });
});
```

## Performance Optimization

1. **Dictionary Pre-filtering**: Filter by total length before segment validation
2. **Early Termination**: Stop segment validation on first failure
3. **Memory Efficiency**: Process words one at a time, don't store intermediate results
4. **Character Map Caching**: Reuse character frequency maps where possible

## Next Steps

1. Run tests to verify implementation
2. Add error boundary for production error handling
3. Implement performance monitoring
4. Add accessibility features (keyboard navigation, screen reader support)
5. Consider adding result export functionality

## Common Issues

- **Dictionary not loaded**: Ensure `useDictionary` hook is properly integrated
- **Performance issues**: Check that total length pre-filtering is working
- **Incorrect results**: Verify one-to-one letter mapping logic
- **Type errors**: Ensure all interfaces match between service and components