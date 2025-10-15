# Data Model: Dictionary Loading Utility

**Date**: 2025-10-15  
**Feature**: Dictionary Loading Utility  
**Phase**: 1 - Data Design

## Core Entities

### Dictionary
**Description**: Primary data structure containing the word collection
**Storage**: Browser localStorage
**Format**: JSON-serialized string array

**Attributes**:
- `words: string[]` - Array of dictionary words, one per element
- `version: string` - Timestamp or hash for cache validation
- `source: string` - Source URL for tracking updates
- `loadedAt: number` - Unix timestamp of last successful load
- `size: number` - Number of words in dictionary

**Validation Rules**:
- Maximum 5MB total size when serialized
- Each word must be 1-50 characters
- Words must contain only alphabetic characters and hyphens
- No duplicate words allowed
- Minimum 1000 words for valid dictionary

**State Transitions**:
```
Empty → Loading → Loaded ✓
Empty → Loading → Error → Cached (if available)
Loaded → Refreshing → Updated
Loaded → Refreshing → Error → Loaded (keep existing)
```

### LoadingState
**Description**: Tracks the current status of dictionary operations
**Storage**: React component state (not persisted)

**Attributes**:
- `status: 'idle' | 'loading' | 'loaded' | 'error' | 'cached'` - Current operation status
- `progress?: number` - Loading progress percentage (0-100)
- `error?: DictionaryError` - Error details if operation failed
- `retryCount: number` - Number of retry attempts made
- `lastAttempt: number` - Timestamp of last load attempt

**Validation Rules**:
- Status transitions must follow defined state machine
- Progress only valid during 'loading' status
- Error only present during 'error' status
- Retry count resets on successful load

### DictionaryError
**Description**: Structured error information for failed operations
**Storage**: Temporary (part of LoadingState)

**Attributes**:
- `type: 'network' | 'validation' | 'storage' | 'size'` - Error category
- `message: string` - Human-readable error description
- `code?: string` - Specific error code for programmatic handling
- `retryable: boolean` - Whether operation can be retried
- `details?: Record<string, unknown>` - Additional error context

**Validation Rules**:
- Type must match predefined categories
- Message must be user-friendly
- Retryable flag determines retry behavior

## Storage Schema

### localStorage Keys
- `word-finder:dictionary:words` - Serialized dictionary data
- `word-finder:dictionary:metadata` - Cache metadata (version, timestamps)

### Cache Metadata Structure
```typescript
interface CacheMetadata {
  version: string;
  source: string;
  loadedAt: number;
  size: number;
  checksum: string;
}
```

## Relationships

```
Dictionary 1:1 CacheMetadata
LoadingState 1:1 DictionaryError (when error status)
Dictionary 1:* Word (conceptual - stored as string array)
```

## Data Flow

1. **Initial Load**:
   ```
   Check localStorage → If exists: Load cached → Validate → Use
   If missing/invalid: Fetch remote → Validate → Cache → Use
   ```

2. **Background Refresh**:
   ```
   Fetch remote → Compare with cached → If different: Update cache
   If fetch fails: Continue using cached data
   ```

3. **Error Recovery**:
   ```
   Network error → Retry with backoff → If all retries fail: Use cached
   Validation error → Clear cache → Retry fetch → If fails: Show error
   ```

## Performance Considerations

- **Memory Usage**: Large dictionary (~5MB) stored as single string array
- **Serialization**: JSON.stringify/parse for localStorage operations
- **Lookup Performance**: Linear search O(n) - acceptable for word verification
- **Cache Efficiency**: Check timestamp before unnecessary network requests

## Data Integrity

- **Checksum Validation**: Verify cached data hasn't been corrupted
- **Format Validation**: Ensure all words match expected patterns
- **Size Limits**: Enforce 5MB maximum before caching
- **Atomic Updates**: Replace cache completely on successful load