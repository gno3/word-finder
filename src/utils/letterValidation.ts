/**
 * Letter usage validation utilities for character frequency mapping
 * Feature: 002-implement-a-word
 * 
 * Implements strict one-to-one letter mapping validation
 */

import type { CharacterFrequency } from '../types/wordFilter.js';

/**
 * Create character frequency map from available letters
 * 
 * @param availableLetters - String of available letters
 * @returns Character frequency map
 */
export function createCharacterFrequencyMap(availableLetters: string): CharacterFrequency {
  const frequencyMap: CharacterFrequency = {};
  
  for (const char of availableLetters.toLowerCase()) {
    frequencyMap[char] = (frequencyMap[char] || 0) + 1;
  }
  
  return frequencyMap;
}

/**
 * Validate that segment text uses only available letters with proper frequency mapping
 * Each letter can only be used as many times as it appears in availableLetters
 * 
 * @param segmentText - The segment text to validate
 * @param availableLetters - Available letters for this segment (frequency matters)
 * @returns Whether the segment satisfies the letter constraints
 */
export function validateSegmentLetterUsage(segmentText: string, availableLetters: string): boolean {
  // Create frequency maps for both available and used letters
  const availableFreq = createCharacterFrequencyMap(availableLetters);
  const usedFreq = createCharacterFrequencyMap(segmentText);
  
  // Check if all available letters are used exactly once
  for (const [char, availableCount] of Object.entries(availableFreq)) {
    const usedCount = usedFreq[char] || 0;
    
    if (usedCount !== availableCount) {
      return false; // Letter used wrong number of times
    }
  }
  
  // Check if any extra letters are used that weren't available
  for (const char of Object.keys(usedFreq)) {
    if (!(char in availableFreq)) {
      return false; // Used a letter that wasn't available
    }
  }
  
  return true;
}

/**
 * Get detailed validation information about letter usage
 * Useful for generating specific error messages
 * 
 * @param segmentText - The segment text to validate
 * @param availableLetters - Available letters for this segment
 * @returns Detailed validation result with specific violations
 */
export function getLetterUsageDetails(segmentText: string, availableLetters: string) {
  const availableFreq = createCharacterFrequencyMap(availableLetters);
  const usedFreq = createCharacterFrequencyMap(segmentText);
  
  const missingLetters: string[] = [];
  const excessLetters: string[] = [];
  const unavailableLetters: string[] = [];
  
  // Check for missing or excess letters
  for (const [char, availableCount] of Object.entries(availableFreq)) {
    const usedCount = usedFreq[char] || 0;
    
    if (usedCount < availableCount) {
      missingLetters.push(char);
    } else if (usedCount > availableCount) {
      excessLetters.push(char);
    }
  }
  
  // Check for unavailable letters
  for (const char of Object.keys(usedFreq)) {
    if (!(char in availableFreq)) {
      unavailableLetters.push(char);
    }
  }
  
  const isValid = missingLetters.length === 0 && 
                  excessLetters.length === 0 && 
                  unavailableLetters.length === 0;
  
  return {
    isValid,
    missingLetters,
    excessLetters,
    unavailableLetters,
    availableFreq,
    usedFreq
  };
}

/**
 * Check if a string contains only letters (no numbers, symbols, etc.)
 * 
 * @param text - Text to check
 * @returns Whether text contains only letters
 */
export function isValidLetterString(text: string): boolean {
  return /^[a-zA-Z]+$/.test(text);
}

/**
 * Validate that segment text uses only letters from available pool with proper frequency
 * and matches the target length (doesn't need to use ALL available letters)
 * 
 * @param segmentText - The segment text to validate
 * @param availableLetters - Available letters for this segment (frequency matters)
 * @param targetLength - Expected length of the segment
 * @returns Whether the segment satisfies the letter and length constraints
 */
export function validateSegmentWithLength(segmentText: string, availableLetters: string, targetLength: number): boolean {
  // Check length first
  if (segmentText.length !== targetLength) {
    return false;
  }

  // Create frequency maps
  const availableFreq = createCharacterFrequencyMap(availableLetters);
  const usedFreq = createCharacterFrequencyMap(segmentText);
  
  // Check if used letters exceed available quantities
  for (const [char, usedCount] of Object.entries(usedFreq)) {
    const availableCount = availableFreq[char] || 0;
    
    if (usedCount > availableCount) {
      return false; // Used more of this letter than available
    }
  }
  
  return true;
}

/**
 * Normalize letter string to lowercase and remove whitespace
 * 
 * @param letters - Letter string to normalize
 * @returns Normalized letter string
 */
export function normalizeLetters(letters: string): string {
  return letters.toLowerCase().replace(/\s+/g, '');
}