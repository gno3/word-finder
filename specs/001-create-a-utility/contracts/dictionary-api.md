# Dictionary Service API Contract

**Version**: 1.0.0  
**Date**: 2025-10-15  
**Feature**: Dictionary Loading Utility

## Service Interface

### DictionaryService

Primary service class for dictionary operations.

```typescript
interface DictionaryService {
  /**
   * Initialize dictionary loading on application start
   * @returns Promise that resolves when initialization is complete
   */
  initialize(): Promise<void>;

  /**
   * Get current dictionary words array
   * @returns Array of dictionary words or null if not loaded
   */
  getWords(): string[] | null;

  /**
   * Check if a specific word exists in the dictionary
   * @param word - Word to search for (case-insensitive)
   * @returns True if word exists, false otherwise
   */
  hasWord(word: string): boolean;

  /**
   * Get current loading state
   * @returns Current loading state object
   */
  getLoadingState(): LoadingState;

  /**
   * Manually trigger dictionary refresh
   * @returns Promise that resolves when refresh is complete
   */
  refresh(): Promise<void>;

  /**
   * Clear cached dictionary data
   * @returns Promise that resolves when cache is cleared
   */
  clearCache(): Promise<void>;
}
```

## React Hook Interface

### useDictionary Hook

React hook for accessing dictionary functionality in components.

```typescript
interface UseDictionaryReturn {
  /**
   * Array of dictionary words (null if not loaded)
   */
  words: string[] | null;

  /**
   * Current loading state
   */
  loadingState: LoadingState;

  /**
   * Check if dictionary is currently loading
   */
  isLoading: boolean;

  /**
   * Check if dictionary is loaded and ready
   */
  isReady: boolean;

  /**
   * Check if there's an error
   */
  hasError: boolean;

  /**
   * Function to check if word exists
   */
  hasWord: (word: string) => boolean;

  /**
   * Function to manually refresh dictionary
   */
  refresh: () => Promise<void>;

  /**
   * Function to retry failed load
   */
  retry: () => Promise<void>;
}

function useDictionary(): UseDictionaryReturn;
```

## Type Definitions

### Core Types

```typescript
interface LoadingState {
  status: 'idle' | 'loading' | 'loaded' | 'error' | 'cached';
  progress?: number;
  error?: DictionaryError;
  retryCount: number;
  lastAttempt: number;
}

interface DictionaryError {
  type: 'network' | 'validation' | 'storage' | 'size';
  message: string;
  code?: string;
  retryable: boolean;
  details?: Record<string, unknown>;
}

interface CacheMetadata {
  version: string;
  source: string;
  loadedAt: number;
  size: number;
  checksum: string;
}

interface DictionaryData {
  words: string[];
  metadata: CacheMetadata;
}
```

### Configuration Types

```typescript
interface DictionaryConfig {
  /**
   * URL of the dictionary source
   */
  sourceUrl: string;

  /**
   * Maximum file size in bytes (default: 5MB)
   */
  maxSize: number;

  /**
   * Maximum retry attempts (default: 3)
   */
  maxRetries: number;

  /**
   * Initial retry delay in milliseconds (default: 1000)
   */
  initialRetryDelay: number;

  /**
   * Maximum retry delay in milliseconds (default: 8000)
   */
  maxRetryDelay: number;

  /**
   * Cache key prefix for localStorage (default: "word-finder")
   */
  cacheKeyPrefix: string;
}
```

## Error Handling

### Error Types

1. **NetworkError**: Network connectivity issues
   - HTTP errors (404, 500, etc.)
   - Timeout errors
   - Connection failures

2. **ValidationError**: Content format issues
   - Invalid file format
   - Corrupted data
   - Size limit exceeded

3. **StorageError**: Browser storage issues
   - localStorage quota exceeded
   - Storage API unavailable
   - Serialization failures

4. **SizeError**: File size issues
   - File exceeds 5MB limit
   - Insufficient storage space

### Error Response Format

```typescript
interface ErrorResponse {
  success: false;
  error: DictionaryError;
  timestamp: number;
  retryAfter?: number; // Suggested retry delay in milliseconds
}
```

## Event Interface

### Dictionary Events

Optional event system for monitoring dictionary operations.

```typescript
type DictionaryEvent = 
  | 'loading-started'
  | 'loading-progress'
  | 'loading-completed'
  | 'loading-failed'
  | 'cache-updated'
  | 'cache-cleared';

interface DictionaryEventData {
  type: DictionaryEvent;
  timestamp: number;
  data?: {
    progress?: number;
    error?: DictionaryError;
    wordCount?: number;
  };
}
```

## Configuration Constants

```typescript
const DEFAULT_CONFIG: DictionaryConfig = {
  sourceUrl: 'https://raw.githubusercontent.com/jesstess/Scrabble/master/scrabble/sowpods.txt',
  maxSize: 5 * 1024 * 1024, // 5MB
  maxRetries: 3,
  initialRetryDelay: 1000,
  maxRetryDelay: 8000,
  cacheKeyPrefix: 'word-finder'
};
```

## Usage Examples

### Basic Usage in Component

```typescript
function WordLookupComponent() {
  const { words, isReady, hasWord, loadingState } = useDictionary();

  if (!isReady) {
    return <div>Loading dictionary...</div>;
  }

  return (
    <div>
      <p>Dictionary loaded with {words?.length} words</p>
      <button onClick={() => console.log(hasWord('example'))}>
        Check 'example'
      </button>
    </div>
  );
}
```

### Service Usage

```typescript
// Initialize dictionary service
const dictionaryService = new DictionaryService();
await dictionaryService.initialize();

// Check word existence
const exists = dictionaryService.hasWord('hello');

// Get all words
const allWords = dictionaryService.getWords();
```