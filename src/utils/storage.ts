import type { CacheMetadata, DictionaryData } from '../types/dictionary';
import { CACHE_KEYS, DICTIONARY_CONSTANTS } from '../config/dictionary';

/**
 * Storage utility for dictionary data with localStorage caching
 */
export class StorageUtils {
  /**
   * Store dictionary data in localStorage with metadata
   */
  static storeDictionaryData(data: DictionaryData): boolean {
    try {
      // Store the dictionary data
      localStorage.setItem(CACHE_KEYS.DICTIONARY_DATA, JSON.stringify(data));
      
      return true;
    } catch (error) {
      console.warn('Failed to store dictionary data:', error);
      return false;
    }
  }

  /**
   * Retrieve dictionary data from localStorage
   */
  static getDictionaryData(): DictionaryData | null {
    try {
      const dataString = localStorage.getItem(CACHE_KEYS.DICTIONARY_DATA);
      if (!dataString) {
        return null;
      }

      const data = JSON.parse(dataString) as DictionaryData;
      
      // Validate the structure
      if (!data.words || !Array.isArray(data.words) || !data.metadata) {
        console.warn('Invalid dictionary data structure in cache');
        this.clearDictionaryData();
        return null;
      }

      return data;
    } catch (error) {
      console.warn('Failed to retrieve dictionary data:', error);
      this.clearDictionaryData();
      return null;
    }
  }

  /**
   * Get cache metadata
   */
  static getCacheMetadata(): CacheMetadata | null {
    const data = this.getDictionaryData();
    return data?.metadata || null;
  }

  /**
   * Check if cached data is valid and not expired
   */
  static isCacheValid(): boolean {
    const data = this.getDictionaryData();
    if (!data || !data.metadata) {
      return false;
    }

    const now = Date.now();
    const age = now - data.metadata.loadedAt;
    const maxAge = DICTIONARY_CONSTANTS.CACHE_EXPIRY_MS;

    // Check if cache is expired
    if (age > maxAge) {
      console.info('Dictionary cache expired');
      return false;
    }

    // Check if version matches
    if (data.metadata.version !== DICTIONARY_CONSTANTS.CACHE_VERSION) {
      console.info('Dictionary cache version mismatch');
      return false;
    }

    return true;
  }

  /**
   * Check available localStorage space
   */
  static getAvailableSpace(): number {
    try {
      const testKey = '__storage_test__';
      const testData = 'x'.repeat(1024); // 1KB chunks
      let used = 0;

      // Test by writing 1KB chunks until we hit the limit
      try {
        for (let i = 0; i < 10240; i++) { // Test up to ~10MB
          localStorage.setItem(testKey + i, testData);
          used += 1024;
        }
      } catch {
        // Hit storage limit
      } finally {
        // Clean up test data
        for (let i = 0; i < 10240; i++) {
          localStorage.removeItem(testKey + i);
        }
      }

      return used;
    } catch {
      return 0;
    }
  }

  /**
   * Check if there's enough space for dictionary storage
   */
  static hasEnoughSpace(dataSize: number): boolean {
    const availableSpace = this.getAvailableSpace();
    const requiredSpace = dataSize + 10240; // Add 10KB buffer
    
    return availableSpace >= requiredSpace;
  }

  /**
   * Get current cache size
   */
  static getCacheSize(): number {
    try {
      const data = localStorage.getItem(CACHE_KEYS.DICTIONARY_DATA);
      
      let size = 0;
      if (data) size += data.length * 2; // UTF-16 encoding
      
      return size;
    } catch {
      return 0;
    }
  }

  /**
   * Clear dictionary data from cache
   */
  static clearDictionaryData(): void {
    try {
      localStorage.removeItem(CACHE_KEYS.DICTIONARY_DATA);
    } catch (error) {
      console.warn('Failed to clear dictionary data:', error);
    }
  }

  /**
   * Get storage statistics
   */
  static getStorageStats(): {
    cacheSize: number;
    availableSpace: number;
    isValid: boolean;
    metadata: CacheMetadata | null;
  } {
    return {
      cacheSize: this.getCacheSize(),
      availableSpace: this.getAvailableSpace(),
      isValid: this.isCacheValid(),
      metadata: this.getCacheMetadata(),
    };
  }
}