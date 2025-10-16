/**
 * Word splitting utilities for segment-based processing
 * Feature: 002-implement-a-word
 */

/**
 * Split a word into segments according to specified lengths
 * 
 * @param word - Word to split
 * @param lengths - Array of segment lengths (must sum to word length)
 * @returns Array of word segments
 * @throws Error if lengths don't match word length
 */
export function splitWordIntoSegments(word: string, lengths: number[]): string[] {
  // Validate inputs
  if (!word || typeof word !== 'string') {
    throw new Error('Word must be a non-empty string');
  }
  
  if (!Array.isArray(lengths) || lengths.length === 0) {
    throw new Error('Lengths must be a non-empty array');
  }
  
  const totalLength = lengths.reduce((sum, length) => sum + length, 0);
  if (totalLength !== word.length) {
    throw new Error(`Sum of lengths (${totalLength}) does not match word length (${word.length})`);
  }
  
  // Split word into segments
  const segments: string[] = [];
  let currentIndex = 0;
  
  for (const length of lengths) {
    if (length <= 0) {
      throw new Error(`Invalid segment length: ${length}. All lengths must be positive`);
    }
    
    const segment = word.substring(currentIndex, currentIndex + length);
    segments.push(segment);
    currentIndex += length;
  }
  
  return segments;
}

/**
 * Validate that segment lengths are valid for word splitting
 * 
 * @param lengths - Array of segment lengths to validate
 * @returns Object with validation result and details
 */
export function validateSegmentLengths(lengths: number[]) {
  const errors: string[] = [];
  
  if (!Array.isArray(lengths)) {
    errors.push('Lengths must be an array');
    return { isValid: false, errors, totalLength: 0 };
  }
  
  if (lengths.length === 0) {
    errors.push('Lengths array cannot be empty');
    return { isValid: false, errors, totalLength: 0 };
  }
  
  let totalLength = 0;
  
  for (let i = 0; i < lengths.length; i++) {
    const length = lengths[i];
    
    if (typeof length !== 'number' || !Number.isInteger(length)) {
      errors.push(`Length at index ${i} is not an integer: ${length}`);
      continue;
    }
    
    if (length <= 0) {
      errors.push(`Length at index ${i} is not positive: ${length}`);
      continue;
    }
    
    totalLength += length;
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    totalLength
  };
}

/**
 * Create segment lengths array from an array of segments
 * 
 * @param segments - Array of segment objects with targetLength property
 * @returns Array of target lengths
 */
export function extractSegmentLengths(segments: Array<{ targetLength: number }>): number[] {
  return segments.map(segment => segment.targetLength);
}

/**
 * Check if a word can be split according to the given segment lengths
 * 
 * @param word - Word to check
 * @param lengths - Array of segment lengths
 * @returns Whether the word can be split according to the lengths
 */
export function canSplitWord(word: string, lengths: number[]): boolean {
  try {
    const lengthValidation = validateSegmentLengths(lengths);
    if (!lengthValidation.isValid) {
      return false;
    }
    
    return word.length === lengthValidation.totalLength;
  } catch {
    return false;
  }
}

/**
 * Split multiple words into segments using the same length pattern
 * 
 * @param words - Array of words to split
 * @param lengths - Array of segment lengths
 * @returns Array of segment arrays (one per word)
 * @throws Error if any word cannot be split according to lengths
 */
export function splitWordsIntoSegments(words: string[], lengths: number[]): string[][] {
  return words.map(word => splitWordIntoSegments(word, lengths));
}