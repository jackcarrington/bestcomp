/**
 * URL Sanitization Utilities - Security Enhancement
 * Prevents URL injection attacks in meta tags and redirects
 *
 * Note: Console statements are intentional for security monitoring
 */

const ALLOWED_PROTOCOLS = ['https:', 'http:'];
const TRUSTED_DOMAIN = 'findcasinosites.co.uk';

/**
 * Sanitize URL for meta tags to prevent injection attacks
 * @param url - URL to sanitize
 * @param fallbackPath - Safe fallback path if URL is invalid
 * @returns Sanitized URL or safe fallback
 */
export function sanitizeMetaUrl(url: string | URL, fallbackPath: string = '/'): string {
  try {
    const urlObj = typeof url === 'string' ? new URL(url) : url;

    // Only allow HTTPS/HTTP protocols
    if (!ALLOWED_PROTOCOLS.includes(urlObj.protocol)) {
      // Security logging removed for Google Ads compliance
      return `https://${TRUSTED_DOMAIN}${fallbackPath}`;
    }

    // Only allow trusted domain in production
    if (
      urlObj.hostname !== TRUSTED_DOMAIN &&
      urlObj.hostname !== 'localhost' &&
      !urlObj.hostname.includes('netlify.app')
    ) {
      // Security logging removed for Google Ads compliance
      return `https://${TRUSTED_DOMAIN}${fallbackPath}`;
    }

    return urlObj.href;
  } catch {
    // Security logging removed for Google Ads compliance
    return `https://${TRUSTED_DOMAIN}${fallbackPath}`;
  }
}

/**
 * Create canonical URL safely
 * @param requestUrl - Current request URL
 * @param overridePath - Optional path override
 * @returns Safe canonical URL
 */
export function createCanonicalUrl(requestUrl: URL, overridePath?: string): string {
  try {
    const path = overridePath || requestUrl.pathname;

    // Always use HTTPS for canonical URLs
    return `https://${TRUSTED_DOMAIN}${path}`;
  } catch {
    // Security logging removed for Google Ads compliance
    return `https://${TRUSTED_DOMAIN}/`;
  }
}

/**
 * Validate and sanitize redirect URLs
 * @param url - URL to validate for redirects
 * @returns true if safe, false if should block
 */
export function isSafeRedirectUrl(url: string | URL): boolean {
  try {
    const urlObj = typeof url === 'string' ? new URL(url) : url;

    // Block data: and javascript: schemes
    if (!ALLOWED_PROTOCOLS.includes(urlObj.protocol)) {
      return false;
    }

    // Allow same domain and casino affiliate domains
    const safeDomains = [
      TRUSTED_DOMAIN,
      'localhost',
      // Add your casino affiliate domains here
      'casino.com',
      'slots.com',
    ];

    return safeDomains.some(
      domain =>
        urlObj.hostname === domain || urlObj.hostname.endsWith(`.${domain}`) || urlObj.hostname.includes('netlify.app')
    );
  } catch {
    return false;
  }
}
