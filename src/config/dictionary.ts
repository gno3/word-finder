/**
 * Dictionary Loading Utility Configuration
 * 
 * Central configuration constants for the dictionary service.
 * Based on specifications from spec.md clarifications and contracts.
 */

import type { DictionaryConfig } from '../types/dictionary.js';

/**
 * Default configuration for dictionary operations
 */
export const DEFAULT_DICTIONARY_CONFIG: DictionaryConfig = {
  /** Source URL for the dictionary file */
  sourceUrl: 'https://raw.githubusercontent.com/jesstess/Scrabble/master/scrabble/sowpods.txt',
  
  /** Maximum file size in bytes (5MB as per specification) */
  maxSize: 5 * 1024 * 1024, // 5MB
  
  /** Maximum retry attempts (3 as per clarifications) */
  maxRetries: 3,
  
  /** Initial retry delay in milliseconds (exponential backoff starting point) */
  initialRetryDelay: 1000, // 1 second
  
  /** Maximum retry delay in milliseconds (exponential backoff ceiling) */
  maxRetryDelay: 8000, // 8 seconds
  
  /** Cache key prefix for localStorage operations */
  cacheKeyPrefix: 'word-finder'
};

/**
 * localStorage cache keys
 */
export const CACHE_KEYS = {
  /** Key for storing dictionary words array */
  WORDS: `${DEFAULT_DICTIONARY_CONFIG.cacheKeyPrefix}:dictionary:words`,
  
  /** Key for storing cache metadata */
  METADATA: `${DEFAULT_DICTIONARY_CONFIG.cacheKeyPrefix}:dictionary:metadata`,
  
  /** Key for storing dictionary data */
  DICTIONARY_DATA: `${DEFAULT_DICTIONARY_CONFIG.cacheKeyPrefix}:dictionary:data`,
  
  /** Key for storing cache metadata */
  CACHE_METADATA: `${DEFAULT_DICTIONARY_CONFIG.cacheKeyPrefix}:dictionary:cache-metadata`
} as const;

/**
 * Performance and validation constants
 */
export const DICTIONARY_CONSTANTS = {
  /** Minimum number of words required for valid dictionary */
  MIN_WORD_COUNT: 1000,
  
  /** Maximum word length (characters) */
  MAX_WORD_LENGTH: 50,
  
  /** Minimum word length (characters) */
  MIN_WORD_LENGTH: 1,
  
  /** Maximum dictionary loading time in milliseconds (5 seconds as per success criteria) */
  MAX_LOAD_TIME: 5000,
  
  /** Maximum word lookup time in milliseconds (100ms as per success criteria) */
  MAX_LOOKUP_TIME: 100,
  
  /** Cache expiry time in milliseconds (24 hours) */
  CACHE_EXPIRY_MS: 24 * 60 * 60 * 1000,
  
  /** Cache version for invalidating old caches */
  CACHE_VERSION: '1.0.0',
  
  /** Regular expression pattern for valid words (alphabetic characters and hyphens) */
  WORD_PATTERN: /^[a-zA-Z-]+$/,
  
  /** Content type validation pattern for downloaded content */
  TEXT_CONTENT_PATTERN: /^[\x20-\x7E\s]*$/,  // Printable ASCII + whitespace
  
  /** Jitter factor for exponential backoff (to prevent thundering herd) */
  BACKOFF_JITTER: 0.1 // 10% random variation
} as const;

/**
 * Error messages for consistent user feedback
 */
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Unable to download dictionary. Please check your internet connection.',
  VALIDATION_ERROR: 'Downloaded dictionary file is not in the expected format.',
  STORAGE_ERROR: 'Unable to save dictionary to local storage. Please ensure sufficient storage space.',
  SIZE_ERROR: 'Dictionary file is too large. Maximum size is 5MB.',
  TIMEOUT_ERROR: 'Dictionary download timed out. Please try again.',
  CACHE_CORRUPTED: 'Cached dictionary data is corrupted and will be refreshed.',
  GENERIC_ERROR: 'An unexpected error occurred while loading the dictionary.'
} as const;

/**
 * Success messages for user feedback
 */
export const SUCCESS_MESSAGES = {
  LOADED: 'Dictionary loaded successfully',
  CACHED: 'Using cached dictionary',
  REFRESHED: 'Dictionary updated successfully'
} as const;

/**
 * HTTP status codes relevant to dictionary loading
 */
export const HTTP_STATUS = {
  OK: 200,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  NETWORK_ERROR: 0  // Browser network error
} as const;