/**
 * Get favicon URL for a given website URL
 * Uses Google's favicon service as a reliable fallback
 */
export function getFaviconUrl(url: string, size: number = 64): string {
  try {
    // Extract domain from URL
    const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
    const domain = urlObj.hostname;
    
    // Use Google's favicon service (reliable and fast)
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=${size}`;
  } catch (error) {
    // Fallback to a default icon if URL parsing fails
    return `https://www.google.com/s2/favicons?domain=example.com&sz=${size}`;
  }
}

/**
 * Get project image URL with fallback to favicon
 */
export function getProjectImageUrl(project: { url: string; logo_url?: string | null; screenshot_url?: string | null }): string | null {
  // Priority: logo_url > screenshot_url > favicon
  if (project.logo_url) {
    return project.logo_url;
  }
  if (project.screenshot_url) {
    return project.screenshot_url;
  }
  // Fallback to favicon
  return getFaviconUrl(project.url);
}

