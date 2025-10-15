/**
 * Performance optimization utilities for dictionary functionality
 */

/**
 * Debounce function for search input
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  waitMs: number
): (...args: Parameters<T>) => void {
  let timeoutId: number | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    timeoutId = setTimeout(() => {
      func(...args);
    }, waitMs);
  };
}

/**
 * Throttle function for rapid operations
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limitMs: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limitMs);
    }
  };
}

/**
 * Memoization for expensive computations
 */
export function memoize<TArgs extends any[], TReturn>(
  fn: (...args: TArgs) => TReturn,
  maxSize: number = 100
): (...args: TArgs) => TReturn {
  const cache = new Map<string, TReturn>();
  
  return (...args: TArgs): TReturn => {
    const key = JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key)!;
    }
    
    const result = fn(...args);
    
    // LRU eviction when cache is full
    if (cache.size >= maxSize) {
      const firstKey = cache.keys().next().value;
      if (firstKey !== undefined) {
        cache.delete(firstKey);
      }
    }
    
    cache.set(key, result);
    return result;
  };
}

/**
 * Optimized word search with binary search
 */
export class OptimizedWordSearch {
  private sortedWords: string[];
  private wordMap: Map<string, boolean> | null = null;
  private useMapThreshold = 10000; // Use Map for large dictionaries

  constructor(words: string[]) {
    this.sortedWords = [...words].sort();
    
    // Use Map for very large dictionaries for O(1) lookup
    if (words.length > this.useMapThreshold) {
      this.wordMap = new Map(words.map(word => [word, true]));
    }
  }

  hasWord(word: string): boolean {
    const normalizedWord = word.toLowerCase().trim();
    
    if (this.wordMap) {
      return this.wordMap.has(normalizedWord);
    }
    
    return this.binarySearch(normalizedWord);
  }

  private binarySearch(target: string): boolean {
    let left = 0;
    let right = this.sortedWords.length - 1;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      const midWord = this.sortedWords[mid];

      if (midWord === target) {
        return true;
      } else if (midWord < target) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }

    return false;
  }

  getWordsStartingWith(prefix: string, limit: number = 10): string[] {
    const normalizedPrefix = prefix.toLowerCase().trim();
    
    if (!normalizedPrefix) {
      return this.sortedWords.slice(0, limit);
    }

    const startIndex = this.findFirstMatch(normalizedPrefix);
    if (startIndex === -1) {
      return [];
    }

    const results: string[] = [];
    for (let i = startIndex; i < this.sortedWords.length && results.length < limit; i++) {
      const word = this.sortedWords[i];
      if (word.startsWith(normalizedPrefix)) {
        results.push(word);
      } else {
        break;
      }
    }

    return results;
  }

  private findFirstMatch(prefix: string): number {
    let left = 0;
    let right = this.sortedWords.length - 1;
    let result = -1;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      const midWord = this.sortedWords[mid];

      if (midWord.startsWith(prefix)) {
        result = mid;
        right = mid - 1; // Continue searching left for first occurrence
      } else if (midWord < prefix) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }

    return result;
  }
}

/**
 * Batch processing utility for large operations
 */
export async function batchProcess<T, R>(
  items: T[],
  processor: (batch: T[]) => Promise<R[]>,
  batchSize: number = 100,
  delayMs: number = 0
): Promise<R[]> {
  const results: R[] = [];
  
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await processor(batch);
    results.push(...batchResults);
    
    // Add delay between batches to prevent blocking
    if (delayMs > 0 && i + batchSize < items.length) {
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }
  
  return results;
}

/**
 * Performance monitoring utility
 */
export class PerformanceMonitor {
  private static measurements = new Map<string, number[]>();

  static startMeasurement(name: string): () => number {
    const startTime = performance.now();
    
    return () => {
      const duration = performance.now() - startTime;
      this.recordMeasurement(name, duration);
      return duration;
    };
  }

  static recordMeasurement(name: string, duration: number): void {
    if (!this.measurements.has(name)) {
      this.measurements.set(name, []);
    }
    
    const measurements = this.measurements.get(name)!;
    measurements.push(duration);
    
    // Keep only last 100 measurements
    if (measurements.length > 100) {
      measurements.shift();
    }
  }

  static getStats(name: string): {
    count: number;
    average: number;
    min: number;
    max: number;
    p95: number;
  } | null {
    const measurements = this.measurements.get(name);
    if (!measurements || measurements.length === 0) {
      return null;
    }

    const sorted = [...measurements].sort((a, b) => a - b);
    const count = sorted.length;
    const sum = sorted.reduce((a, b) => a + b, 0);
    const average = sum / count;
    const min = sorted[0];
    const max = sorted[count - 1];
    const p95Index = Math.floor(count * 0.95);
    const p95 = sorted[p95Index];

    return { count, average, min, max, p95 };
  }

  static getAllStats(): Record<string, ReturnType<typeof PerformanceMonitor.getStats>> {
    const stats: Record<string, any> = {};
    
    for (const [name] of this.measurements) {
      stats[name] = this.getStats(name);
    }
    
    return stats;
  }

  static clearStats(name?: string): void {
    if (name) {
      this.measurements.delete(name);
    } else {
      this.measurements.clear();
    }
  }
}

/**
 * Memory management utilities
 */
export class MemoryManager {
  static getMemoryInfo(): {
    used: number;
    total: number;
    available: number;
  } | null {
    const memory = (performance as any).memory;
    if (!memory) {
      return null;
    }

    return {
      used: memory.usedJSHeapSize,
      total: memory.totalJSHeapSize,
      available: memory.jsHeapSizeLimit
    };
  }

  static estimateStringMemory(str: string): number {
    // Rough estimation: 2 bytes per character in UTF-16
    return str.length * 2;
  }

  static estimateArrayMemory<T>(arr: T[], itemEstimator?: (item: T) => number): number {
    if (!itemEstimator) {
      // Basic estimation for array overhead + typical object references
      return arr.length * 8; // 8 bytes per reference
    }

    return arr.reduce((total, item) => total + itemEstimator(item), 0);
  }

  static checkMemoryPressure(): boolean {
    const info = this.getMemoryInfo();
    if (!info) {
      return false; // Can't determine, assume no pressure
    }

    const usageRatio = info.used / info.available;
    return usageRatio > 0.8; // 80% threshold
  }
}