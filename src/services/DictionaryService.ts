import type { 
  IDictionaryService, 
  DictionaryData, 
  LoadingState, 
  DictionaryConfig,
  CacheMetadata 
} from '../types/dictionary';
import { DEFAULT_DICTIONARY_CONFIG } from '../config/dictionary';
import { StorageUtils } from '../utils/storage';
import { ValidationUtils } from '../utils/validation';
import { RetryUtils } from '../utils/retry';

/**
 * Base dictionary service class implementing core functionality
 */
export class DictionaryService implements IDictionaryService {
  private config: DictionaryConfig;
  private currentData: DictionaryData | null = null;
  private loadingState: LoadingState;
  private eventListeners: Map<string, Function[]> = new Map();

  constructor(config: Partial<DictionaryConfig> = {}) {
    this.config = { ...DEFAULT_DICTIONARY_CONFIG, ...config };
    this.loadingState = {
      status: 'idle',
      retryCount: 0,
      lastAttempt: 0
    };
  }

  /**
   * Initialize dictionary loading on application start
   */
  async initialize(): Promise<void> {
    console.info('Initializing dictionary service...');
    
    try {
      // Check for valid cached data first
      if (StorageUtils.isCacheValid()) {
        const cachedData = StorageUtils.getDictionaryData();
        if (cachedData) {
          this.currentData = cachedData;
          this.updateLoadingState({
            status: 'cached',
            retryCount: 0,
            lastAttempt: Date.now()
          });
          this.emitEvent('cache-loaded', { wordCount: cachedData.words.length });
          console.info('Using cached dictionary data');
          return;
        }
      }

      // Load fresh data if no valid cache
      await this.loadDictionary();
    } catch (error) {
      console.error('Dictionary initialization failed:', error);
      const dictionaryError = RetryUtils.createDictionaryError(error, 'initialization');
      this.updateLoadingState({
        status: 'error',
        error: dictionaryError,
        retryCount: 0,
        lastAttempt: Date.now()
      });
      this.emitEvent('loading-failed', { error: dictionaryError });
    }
  }

  /**
   * Get current dictionary words array
   */
  getWords(): string[] | null {
    return this.currentData?.words || null;
  }

  /**
   * Check if a specific word exists in the dictionary
   */
  hasWord(word: string): boolean {
    if (!this.currentData) {
      return false;
    }

    const normalizedWord = ValidationUtils.normalizeWord(word);
    if (!normalizedWord) {
      return false;
    }

    // Use binary search for O(log n) lookup if words are sorted
    const words = this.currentData.words;
    return this.binarySearchWord(words, normalizedWord);
  }

  /**
   * Get current loading state
   */
  getLoadingState(): LoadingState {
    return { ...this.loadingState };
  }

  /**
   * Manually trigger dictionary refresh
   */
  async refresh(): Promise<void> {
    console.info('Refreshing dictionary data...');
    
    // Clear cache first
    await this.clearCache();
    
    // Load fresh data
    await this.loadDictionary();
  }

  /**
   * Clear cached dictionary data
   */
  async clearCache(): Promise<void> {
    console.info('Clearing dictionary cache...');
    
    try {
      StorageUtils.clearDictionaryData();
      this.currentData = null;
      this.updateLoadingState({
        status: 'idle',
        retryCount: 0,
        lastAttempt: 0
      });
      this.emitEvent('cache-cleared');
    } catch (error) {
      console.error('Failed to clear cache:', error);
      throw RetryUtils.createDictionaryError(error, 'cache clearing');
    }
  }

  /**
   * Core dictionary loading logic
   */
  private async loadDictionary(): Promise<void> {
    this.updateLoadingState({
      status: 'loading',
      progress: 0,
      retryCount: 0,
      lastAttempt: Date.now()
    });

    this.emitEvent('loading-started');

    try {
      const retryableFetch = RetryUtils.createRetryableFetch();
      
      const loadOperation = RetryUtils.withRetryContext(async () => {
        // Update progress
        this.updateLoadingState({ ...this.loadingState, progress: 10 });
        
        // Validate URL
        if (!ValidationUtils.validateSourceUrl(this.config.sourceUrl)) {
          throw new Error(`Invalid source URL: ${this.config.sourceUrl}`);
        }

        // Fetch dictionary content
        this.updateLoadingState({ ...this.loadingState, progress: 30 });
        const response = await retryableFetch(this.config.sourceUrl);
        
        // Validate response
        ValidationUtils.validateResponseHeaders(response);
        
        // Get content
        this.updateLoadingState({ ...this.loadingState, progress: 50 });
        const content = await response.text();
        
        // Validate and parse content
        this.updateLoadingState({ ...this.loadingState, progress: 70 });
        const words = ValidationUtils.validateDictionaryContent(content);
        
        // Create metadata
        const metadata: CacheMetadata = {
          version: this.generateVersion(),
          source: this.config.sourceUrl,
          loadedAt: Date.now(),
          size: words.length,
          checksum: ValidationUtils.calculateChecksum(words)
        };

        // Create dictionary data
        const dictionaryData: DictionaryData = {
          words: words.sort(), // Sort for efficient lookups
          metadata
        };

        // Store in cache
        this.updateLoadingState({ ...this.loadingState, progress: 90 });
        const stored = StorageUtils.storeDictionaryData(dictionaryData);
        if (!stored) {
          console.warn('Failed to store dictionary in cache, but continuing...');
        }

        // Update internal state
        this.currentData = dictionaryData;
        this.updateLoadingState({
          status: 'loaded',
          progress: 100,
          retryCount: 0,
          lastAttempt: Date.now()
        });

        this.emitEvent('loading-completed', { 
          wordCount: words.length,
          cached: stored 
        });

        console.info(`Dictionary loaded successfully: ${words.length} words`);
        return dictionaryData;
      }, 'dictionary loading');

      // Execute with retry logic
      await RetryUtils.withExponentialBackoff(
        loadOperation,
        this.config.maxRetries,
        this.config.initialRetryDelay,
        this.config.maxRetryDelay
      );

    } catch (error) {
      console.error('Dictionary loading failed:', error);
      const dictionaryError = RetryUtils.createDictionaryError(error, 'loading');
      
      this.updateLoadingState({
        status: 'error',
        error: dictionaryError,
        retryCount: this.loadingState.retryCount + 1,
        lastAttempt: Date.now()
      });

      this.emitEvent('loading-failed', { error: dictionaryError });
      throw dictionaryError;
    }
  }

  /**
   * Binary search for word lookup (assumes sorted array)
   */
  private binarySearchWord(words: string[], target: string): boolean {
    let left = 0;
    let right = words.length - 1;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      const midWord = words[mid];

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

  /**
   * Generate version identifier for cache validation
   */
  private generateVersion(): string {
    // Use timestamp as simple version identifier
    return Date.now().toString();
  }

  /**
   * Update loading state and emit progress events
   */
  private updateLoadingState(updates: Partial<LoadingState>): void {
    this.loadingState = { ...this.loadingState, ...updates };
    
    if (updates.progress !== undefined) {
      this.emitEvent('loading-progress', { progress: updates.progress });
    }
  }

  /**
   * Add event listener
   */
  addEventListener(event: string, listener: Function): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(listener);
  }

  /**
   * Remove event listener
   */
  removeEventListener(event: string, listener: Function): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  /**
   * Emit event to all listeners
   */
  private emitEvent(event: string, data?: any): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(listener => {
        try {
          listener(data);
        } catch (error) {
          console.error('Error in event listener:', error);
        }
      });
    }
  }

  /**
   * Get service statistics
   */
  getStats(): {
    wordCount: number;
    loadingState: LoadingState;
    cacheSize: number;
    lastLoaded: number;
    source: string;
  } {
    return {
      wordCount: this.currentData?.words.length || 0,
      loadingState: this.getLoadingState(),
      cacheSize: StorageUtils.getCacheSize(),
      lastLoaded: this.currentData?.metadata.loadedAt || 0,
      source: this.config.sourceUrl
    };
  }
}