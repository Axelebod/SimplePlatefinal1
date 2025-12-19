/**
 * Validates review content to prevent spam and low-quality reviews
 */

/**
 * Check if content has too many repeated characters (spam detection)
 * Example: "gebre ghghghghgghg" would be detected
 */
export function hasRepeatedCharacters(content: string, maxRepeats: number = 4): boolean {
  // Remove spaces and convert to lowercase for analysis
  const cleaned = content.replace(/\s+/g, '').toLowerCase();
  
  // Check for sequences of repeated characters
  let currentChar = '';
  let repeatCount = 0;
  
  for (let i = 0; i < cleaned.length; i++) {
    if (cleaned[i] === currentChar) {
      repeatCount++;
      if (repeatCount >= maxRepeats) {
        return true; // Found too many repeated characters
      }
    } else {
      currentChar = cleaned[i];
      repeatCount = 1;
    }
  }
  
  return false;
}

/**
 * Check if content has too many repeated words
 */
export function hasRepeatedWords(content: string, maxRepeats: number = 3): boolean {
  const words = content.toLowerCase().split(/\s+/);
  const wordCounts = new Map<string, number>();
  
  for (const word of words) {
    if (word.length > 2) { // Only check words longer than 2 characters
      const count = (wordCounts.get(word) || 0) + 1;
      wordCounts.set(word, count);
      if (count >= maxRepeats) {
        return true; // Word repeated too many times
      }
    }
  }
  
  return false;
}

/**
 * Check if content has too few unique characters (low diversity)
 */
export function hasLowDiversity(content: string, minUniqueRatio: number = 0.3): boolean {
  const cleaned = content.replace(/\s+/g, '').toLowerCase();
  if (cleaned.length === 0) return true;
  
  const uniqueChars = new Set(cleaned).size;
  const diversityRatio = uniqueChars / cleaned.length;
  
  return diversityRatio < minUniqueRatio;
}

/**
 * Comprehensive review validation
 */
export function validateReviewContent(content: string): { valid: boolean; error?: string } {
  // Check length
  if (content.length <= 100) {
    return { valid: false, error: 'Le commentaire doit contenir plus de 100 caractères' };
  }
  
  // Check for repeated characters (spam like "gebre ghghghghgghg")
  if (hasRepeatedCharacters(content, 5)) {
    return { valid: false, error: 'Le commentaire contient trop de caractères répétitifs. Veuillez écrire un avis plus constructif.' };
  }
  
  // Check for repeated words
  if (hasRepeatedWords(content, 4)) {
    return { valid: false, error: 'Le commentaire contient trop de mots répétés. Veuillez varier votre vocabulaire.' };
  }
  
  // Check for low diversity
  if (hasLowDiversity(content, 0.25)) {
    return { valid: false, error: 'Le commentaire semble être du spam. Veuillez écrire un avis plus détaillé et constructif.' };
  }
  
  return { valid: true };
}

