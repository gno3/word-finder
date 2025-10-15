/**
 * Dictionary Loading Utility Types
 * 
 * Core TypeScript interfaces and types for the dictionary loading functionality.
 * Based on data-model.md and contracts/dictionary-api.md specifications.
 */

/**
 * Current status of dictionary operations
 */
export type DictionaryStatus = 'idle' | 'loading' | 'loaded' | 'error' | 'cached';

/**
 * Category of dictionary operation errors
 */
export type DictionaryErrorType = 'network' | 'validation' | 'storage' | 'size';

/**
 * Structured error information for failed dictionary operations
 */
export interface DictionaryError {
  /** Error category for programmatic handling */
  type: DictionaryErrorType;
  /** Human-readable error description */
  message: string;
  /** Specific error code for detailed handling */
  code?: string;
  /** Whether the operation can be retried */
  retryable: boolean;
  /** Additional error context */
  details?: Record<string, unknown>;
}

/**
 * Loading state tracking for dictionary operations
 */
export interface LoadingState {
  /** Current operation status */
  status: DictionaryStatus;
  /** Loading progress percentage (0-100) */
  progress?: number;
  /** Error details if operation failed */
  error?: DictionaryError;
  /** Number of retry attempts made */
  retryCount: number;
  /** Timestamp of last load attempt */
  lastAttempt: number;
}

/**
 * Cache metadata for dictionary validation and tracking
 */
export interface CacheMetadata {
  /** Version identifier (timestamp or hash) */
  version: string;
  /** Source URL for tracking updates */
  source: string;
  /** Unix timestamp of last successful load */
  loadedAt: number;
  /** Number of words in dictionary */
  size: number;
  /** Checksum for data integrity validation */
  checksum: string;
}

/**
 * Complete dictionary data structure
 */
export interface DictionaryData {
  /** Array of dictionary words */
  words: string[];
  /** Cache metadata */
  metadata: CacheMetadata;
}

/**
 * Configuration options for dictionary service
 */
export interface DictionaryConfig {
  /** URL of the dictionary source */
  sourceUrl: string;
  /** Maximum file size in bytes (default: 5MB) */
  maxSize: number;
  /** Maximum retry attempts (default: 3) */
  maxRetries: number;
  /** Initial retry delay in milliseconds (default: 1000) */
  initialRetryDelay: number;
  /** Maximum retry delay in milliseconds (default: 8000) */
  maxRetryDelay: number;
  /** Cache key prefix for localStorage (default: "word-finder") */
  cacheKeyPrefix: string;
}

/**
 * Dictionary service interface contract
 */
export interface IDictionaryService {
  /** Initialize dictionary loading on application start */
  initialize(): Promise<void>;
  /** Get current dictionary words array */
  getWords(): string[] | null;
  /** Check if a specific word exists in the dictionary */
  hasWord(word: string): boolean;
  /** Get current loading state */
  getLoadingState(): LoadingState;
  /** Manually trigger dictionary refresh */
  refresh(): Promise<void>;
  /** Clear cached dictionary data */
  clearCache(): Promise<void>;
}

/**
 * Return type for useDictionary React hook
 */
export interface UseDictionaryReturn {
  /** Array of dictionary words (null if not loaded) */
  words: string[] | null;
  /** Current loading state */
  loadingState: LoadingState;
  /** Check if dictionary is currently loading */
  isLoading: boolean;
  /** Check if dictionary is loaded and ready */
  isReady: boolean;
  /** Check if there's an error */
  hasError: boolean;
  /** Function to check if word exists */
  hasWord: (word: string) => boolean;
  /** Function to manually refresh dictionary */
  refresh: () => Promise<void>;
  /** Function to retry failed load */
  retry: () => Promise<void>;
}

/**
 * Dictionary events for monitoring operations
 */
export type DictionaryEvent = 
  | 'loading-started'
  | 'loading-progress'
  | 'loading-completed'
  | 'loading-failed'
  | 'cache-updated'
  | 'cache-cleared';

/**
 * Event data structure for dictionary operations
 */
export interface DictionaryEventData {
  type: DictionaryEvent;
  timestamp: number;
  data?: {
    progress?: number;
    error?: DictionaryError;
    wordCount?: number;
  };
}

/**
 * Storage utility interface
 */
export interface IStorageUtils {
  saveDictionary(data: DictionaryData): Promise<void>;
  loadDictionary(): Promise<DictionaryData | null>;
  clearDictionary(): Promise<void>;
  getCacheSize(): number;
  validateCache(metadata: CacheMetadata): boolean;
}

/**
 * Validation utility interface
 */
export interface IValidationUtils {
  validateDictionaryContent(content: string): string[];
  isValidWord(word: string): boolean;
  calculateChecksum(words: string[]): string;
  validateFileSize(size: number): boolean;
}

/**
 * Retry utility interface
 */
export interface IRetryUtils {
  withExponentialBackoff<T>(
    fn: () => Promise<T>,
    maxRetries?: number,
    initialDelay?: number,
    maxDelay?: number
  ): Promise<T>;
}