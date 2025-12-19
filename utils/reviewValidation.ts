/**
 * Validates review content to prevent spam and low-quality reviews
 */

/**
 * Check if content has too many repeated characters (spam detection)
 * Example: "gebre ghghghghgghg" would be detected
 * Now more lenient: only flags obvious spam patterns
 */
export function hasRepeatedCharacters(content: string, maxRepeats: number = 6): boolean {
  // Remove spaces and convert to lowercase for analysis
  const cleaned = content.replace(/\s+/g, '').toLowerCase();
  
  // Check for sequences of repeated characters (only very obvious spam)
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
 * More lenient: allows common words to repeat more
 */
export function hasRepeatedWords(content: string, maxRepeats: number = 5): boolean {
  const words = content.toLowerCase().split(/\s+/);
  const wordCounts = new Map<string, number>();
  const commonWords = new Set(['le', 'la', 'les', 'de', 'du', 'des', 'un', 'une', 'et', 'ou', 'est', 'sont', 'pour', 'avec', 'dans', 'sur', 'par', 'très', 'bien', 'très', 'plus', 'tout', 'tous', 'toutes', 'cette', 'ce', 'ces', 'the', 'a', 'an', 'and', 'or', 'is', 'are', 'for', 'with', 'in', 'on', 'by', 'very', 'well', 'more', 'all', 'this', 'that', 'these']);
  
  for (const word of words) {
    // Skip very short words and common words
    if (word.length <= 2 || commonWords.has(word)) {
      continue;
    }
    
    const count = (wordCounts.get(word) || 0) + 1;
    wordCounts.set(word, count);
    if (count >= maxRepeats) {
      return true; // Word repeated too many times
    }
  }
  
  return false;
}

/**
 * Check if content has too few unique characters (low diversity)
 * More lenient: only flags very obvious spam (like "aaaaa" or "ghghghgh")
 */
export function hasLowDiversity(content: string, minUniqueRatio: number = 0.2): boolean {
  const cleaned = content.replace(/\s+/g, '').toLowerCase();
  if (cleaned.length === 0) return true;
  
  // Only check if content is long enough (short content can have low diversity naturally)
  if (cleaned.length < 50) {
    return false; // Don't check diversity for short content
  }
  
  const uniqueChars = new Set(cleaned).size;
  const diversityRatio = uniqueChars / cleaned.length;
  
  // Only flag if diversity is extremely low (obvious spam)
  return diversityRatio < minUniqueRatio;
}

/**
 * Comprehensive review validation
 * More lenient to avoid false positives while still catching obvious spam
 */
export function validateReviewContent(content: string): { valid: boolean; error?: string } {
  // Check length
  if (content.length < 100) {
    return { valid: false, error: 'Le commentaire doit contenir au moins 100 caractères pour être valide.' };
  }
  
  // Trim whitespace for validation
  const trimmed = content.trim();
  if (trimmed.length < 100) {
    return { valid: false, error: 'Le commentaire doit contenir au moins 100 caractères (espaces exclus).' };
  }
  
  // Check for very obvious repeated characters (only flag extreme cases like "aaaaaaa" or "ghghghghghgh")
  if (hasRepeatedCharacters(trimmed, 7)) {
    return { valid: false, error: 'Le commentaire contient trop de caractères répétitifs. Veuillez écrire un avis plus constructif.' };
  }
  
  // Check for repeated words (more lenient - allows common repetition)
  if (hasRepeatedWords(trimmed, 6)) {
    return { valid: false, error: 'Le commentaire contient trop de répétitions. Veuillez varier votre vocabulaire.' };
  }
  
  // Check for very low diversity (only flag extreme spam)
  // Only check for longer comments to avoid false positives
  if (trimmed.length > 150 && hasLowDiversity(trimmed, 0.15)) {
    return { valid: false, error: 'Le commentaire semble être du spam. Veuillez écrire un avis plus détaillé et constructif.' };
  }
  
  return { valid: true };
}

