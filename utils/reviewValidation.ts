/**
 * Validates review content to prevent spam and low-quality reviews
 * Simple rule: if 75% of characters are the same, it's spam
 */

/**
 * Check if a single character represents more than 75% of the content
 */
export function hasTooManySameCharacters(content: string, maxPercentage: number = 0.75): boolean {
  // Remove spaces and convert to lowercase for analysis
  const cleaned = content.replace(/\s+/g, '').toLowerCase();
  if (cleaned.length === 0) return true;
  
  // Count occurrences of each character
  const charCounts = new Map<string, number>();
  for (const char of cleaned) {
    charCounts.set(char, (charCounts.get(char) || 0) + 1);
  }
  
  // Check if any single character represents more than 75% of the content
  for (const [char, count] of charCounts) {
    const percentage = count / cleaned.length;
    if (percentage > maxPercentage) {
      return true; // This character represents more than 75% of the content
    }
  }
  
  return false;
}

/**
 * Simple review validation
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
  
  // Check if 75% of characters are the same (spam detection)
  if (hasTooManySameCharacters(trimmed, 0.75)) {
    return { valid: false, error: 'Le commentaire semble être du spam. Veuillez écrire un avis plus détaillé et constructif.' };
  }
  
  return { valid: true };
}

