/**
 * First-party URL shortening utilities for clean, Google Ads-compliant affiliate links
 *
 * Generates clean /go/casino-name URLs that redirect to actual affiliate links
 * This approach is safer and more transparent than third-party shorteners
 *
 * Console statements removed for Google Ads compliance
 */

interface Casino {
  id?: number;
  casinoName: string;
  name?: string;
  actionButtonLink?: string;
  slug?: string;
}

/**
 * Generate a clean URL slug from casino name
 */
export function generateCasinoSlug(casinoName: string): string {
  return casinoName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '') // Remove all non-alphanumeric characters
    .substring(0, 20); // Limit length for URL safety
}

/**
 * Generate clean first-party redirect URL
 * Example: generateCleanUrl('PlayOJO') -> '/go/playojo'
 */
export function generateCleanUrl(casino: Casino, baseUrl?: string): string {
  const slug = casino.slug || generateCasinoSlug(casino.casinoName || casino.name || '');
  const cleanPath = `/go/${slug}`;

  if (baseUrl) {
    return new URL(cleanPath, baseUrl).toString();
  }

  return cleanPath;
}

/**
 * Get the base domain for URL generation
 */
export function getBaseDomain(): string {
  // Production domain
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }

  // Server-side fallback
  return process.env.SITE_URL || 'https://findcasinosites.co.uk';
}

/**
 * Generate clean URL with full domain
 */
export function generateFullCleanUrl(casino: Casino): string {
  return generateCleanUrl(casino, getBaseDomain());
}

/**
 * Get casino slug mappings from environment or fallback defaults
 * These should match the database slug values
 */
function getCasinoSlugMapping(): Record<string, string> {
  // Try to load from environment variable first
  const envMapping = process.env.CASINO_SLUG_MAPPING;
  if (envMapping) {
    try {
      return JSON.parse(envMapping);
    } catch {
      // Invalid JSON warning removed for Google Ads compliance
    }
  }

  // Fallback to default mappings
  return {
    PlayOJO: 'playojo',
    'All British Casino': 'allbritish',
    'Pub Casino': 'pubcasino',
    Videoslots: 'videoslots',
    'Mr Green': 'mrgreen',
    LeoVegas: 'leovegas',
    Casumo: 'casumo',
    Rizk: 'rizk',
    'Casino Joy': 'casinojoy',
  };
}

/**
 * Casino slug mappings for consistent URLs
 * These should match the database slug values
 */
export const CASINO_SLUG_MAPPING = getCasinoSlugMapping();

/**
 * Get predefined slug or generate one
 */
export function getCasinoSlug(casinoName: string): string {
  const mapping = getCasinoSlugMapping();
  return mapping[casinoName] || generateCasinoSlug(casinoName);
}

/**
 * Get trusted affiliate domains from environment - no fallback defaults for security
 */
function getTrustedDomains(): string[] {
  const envDomains = process.env.TRUSTED_AFFILIATE_DOMAINS;
  if (!envDomains) {
    // Environment error removed for Google Ads compliance
    return [];
  }

  try {
    return JSON.parse(envDomains);
  } catch {
    // JSON format error removed for Google Ads compliance
    return [];
  }
}

/**
 * Validate if URL is a trusted affiliate domain with enhanced security checks
 */
export function isValidAffiliateUrl(url: string): boolean {
  const trustedDomains = getTrustedDomains();

  try {
    const urlObj = new URL(url);

    // ✅ Protocol validation - only allow HTTP/HTTPS
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      // Protocol warning removed for Google Ads compliance
      return false;
    }

    // ✅ Path traversal protection
    if (urlObj.pathname.includes('..') || urlObj.pathname.includes('//')) {
      // Path traversal warning removed for Google Ads compliance
      return false;
    }

    // ✅ Domain validation against whitelist
    return trustedDomains.some(domain => urlObj.hostname === domain || urlObj.hostname.endsWith('.' + domain));
  } catch {
    // URL validation warning removed for Google Ads compliance
    return false;
  }
}
