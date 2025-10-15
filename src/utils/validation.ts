import { DICTIONARY_CONSTANTS, DEFAULT_DICTIONARY_CONFIG } from '../config/dictionary';

/**
 * Validation utilities for dictionary content and data integrity
 */
export class ValidationUtils {
  /**
   * Validate and parse dictionary content from raw text
   */
  static validateDictionaryContent(content: string): string[] {
    if (!content || typeof content !== 'string') {
      throw new Error('Invalid content: expected non-empty string');
    }

    // Check content size
    if (content.length === 0) {
      throw new Error('Dictionary content is empty');
    }

    // Validate content contains only printable ASCII characters and whitespace
    if (!DICTIONARY_CONSTANTS.TEXT_CONTENT_PATTERN.test(content)) {
      throw new Error('Dictionary content contains invalid characters');
    }

    // Split into lines and filter out empty lines
    const lines = content
      .split(/[\r\n]+/)
      .map(line => line.trim())
      .filter(line => line.length > 0);

    if (lines.length === 0) {
      throw new Error('No valid words found in dictionary content');
    }

    // Validate each word
    const validWords: string[] = [];
    const invalidWords: string[] = [];

    for (const line of lines) {
      // Split line by whitespace to handle multiple words per line
      const wordsInLine = line.split(/\s+/).filter(word => word.length > 0);
      
      for (const word of wordsInLine) {
        if (this.isValidWord(word)) {
          // Convert to lowercase for consistency
          validWords.push(word.toLowerCase());
        } else {
          invalidWords.push(word);
        }
      }
    }

    // Log invalid words for debugging (but don't fail)
    if (invalidWords.length > 0) {
      console.warn(`Found ${invalidWords.length} invalid words:`, 
        invalidWords.slice(0, 10)); // Log first 10 for debugging
    }

    // Check minimum word count
    if (validWords.length < DICTIONARY_CONSTANTS.MIN_WORD_COUNT) {
      throw new Error(
        `Insufficient valid words: found ${validWords.length}, minimum required ${DICTIONARY_CONSTANTS.MIN_WORD_COUNT}`
      );
    }

    // Remove duplicates while preserving order
    const uniqueWords = Array.from(new Set(validWords));

    return uniqueWords;
  }

  /**
   * Validate a single word against dictionary standards
   */
  static isValidWord(word: string): boolean {
    if (!word || typeof word !== 'string') {
      return false;
    }

    // Check length constraints
    if (word.length < DICTIONARY_CONSTANTS.MIN_WORD_LENGTH || 
        word.length > DICTIONARY_CONSTANTS.MAX_WORD_LENGTH) {
      return false;
    }

    // Check character pattern (letters and hyphens only)
    if (!DICTIONARY_CONSTANTS.WORD_PATTERN.test(word)) {
      return false;
    }

    // Additional validations
    // - Must not be only hyphens
    if (/^-+$/.test(word)) {
      return false;
    }

    // - Must not start or end with hyphen
    if (word.startsWith('-') || word.endsWith('-')) {
      return false;
    }

    // - Must not have consecutive hyphens
    if (word.includes('--')) {
      return false;
    }

    return true;
  }

  /**
   * Calculate checksum for data integrity validation
   */
  static calculateChecksum(words: string[]): string {
    if (!Array.isArray(words)) {
      throw new Error('Invalid input: expected array of words');
    }

    // Simple but effective checksum: hash of sorted words joined
    const sortedWords = [...words].sort();
    const content = sortedWords.join('|');
    
    // Simple hash function (djb2 algorithm)
    let hash = 5381;
    for (let i = 0; i < content.length; i++) {
      hash = ((hash << 5) + hash) + content.charCodeAt(i);
    }
    
    // Convert to unsigned 32-bit integer and then to hex
    return (hash >>> 0).toString(16);
  }

  /**
   * Validate file size against limits
   */
  static validateFileSize(size: number): boolean {
    if (typeof size !== 'number' || size < 0) {
      return false;
    }

    return size <= DEFAULT_DICTIONARY_CONFIG.maxSize;
  }

  /**
   * Validate response headers and content type
   */
  static validateResponseHeaders(response: Response): void {
    // Check if response is ok
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    // Check content type if available
    const contentType = response.headers.get('content-type');
    if (contentType && !contentType.includes('text/')) {
      console.warn('Unexpected content type:', contentType);
    }

    // Check content length if available
    const contentLength = response.headers.get('content-length');
    if (contentLength) {
      const size = parseInt(contentLength, 10);
      if (!this.validateFileSize(size)) {
        throw new Error(`File too large: ${size} bytes exceeds ${DEFAULT_DICTIONARY_CONFIG.maxSize} bytes`);
      }
    }
  }

  /**
   * Validate URL format and security
   */
  static validateSourceUrl(url: string): boolean {
    try {
      const parsedUrl = new URL(url);
      
      // Must be HTTPS for security
      if (parsedUrl.protocol !== 'https:') {
        return false;
      }

      // Must be a valid domain (basic check)
      if (!parsedUrl.hostname || parsedUrl.hostname.length < 4) {
        return false;
      }

      return true;
    } catch {
      return false;
    }
  }

  /**
   * Validate dictionary data structure
   */
  static validateDictionaryData(data: unknown): data is { words: string[]; metadata: object } {
    if (!data || typeof data !== 'object') {
      return false;
    }

    const dict = data as Record<string, unknown>;

    // Check words array
    if (!Array.isArray(dict.words)) {
      return false;
    }

    // Check all words are valid strings
    if (!dict.words.every(word => typeof word === 'string' && word.length > 0)) {
      return false;
    }

    // Check metadata exists
    if (!dict.metadata || typeof dict.metadata !== 'object') {
      return false;
    }

    return true;
  }

  /**
   * Sanitize and normalize word for lookup
   */
  static normalizeWord(word: string): string {
    if (!word || typeof word !== 'string') {
      return '';
    }

    return word.toLowerCase().trim();
  }

  /**
   * Get validation statistics for content
   */
  static getValidationStats(content: string): {
    totalLines: number;
    validWords: number;
    invalidWords: number;
    duplicates: number;
    contentSize: number;
  } {
    const lines = content.split(/[\r\n]+/).map(line => line.trim()).filter(line => line.length > 0);
    const allWords: string[] = [];
    let validCount = 0;
    let invalidCount = 0;

    for (const line of lines) {
      const wordsInLine = line.split(/\s+/).filter(word => word.length > 0);
      for (const word of wordsInLine) {
        allWords.push(word.toLowerCase());
        if (this.isValidWord(word)) {
          validCount++;
        } else {
          invalidCount++;
        }
      }
    }

    const uniqueWords = new Set(allWords);
    const duplicates = allWords.length - uniqueWords.size;

    return {
      totalLines: lines.length,
      validWords: validCount,
      invalidWords: invalidCount,
      duplicates,
      contentSize: content.length,
    };
  }
}