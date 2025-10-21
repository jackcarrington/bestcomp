/**
 * Simple in-memory rate limiting for affiliate redirects
 * In production, this should use Redis or similar persistent store
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// In-memory store for rate limiting
const rateLimitStore = new Map<string, RateLimitEntry>();

/**
 * Check if IP address is rate limited for redirects
 * @param ip - Client IP address
 * @param limit - Maximum requests allowed
 * @param windowSeconds - Time window in seconds
 * @returns true if rate limited, false if allowed
 */
export function isRateLimited(ip: string, limit: number = 50, windowSeconds: number = 60): boolean {
  const key = `redirect:${ip}`;
  const now = Date.now();
  const windowMs = windowSeconds * 1000;

  const entry = rateLimitStore.get(key);

  if (!entry) {
    // First request from this IP
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + windowMs,
    });
    return false;
  }

  if (now > entry.resetTime) {
    // Window has expired, reset counter
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + windowMs,
    });
    return false;
  }

  if (entry.count >= limit) {
    // Rate limit exceeded
    return true;
  }

  // Increment counter
  entry.count++;
  rateLimitStore.set(key, entry);

  return false;
}

/**
 * Get current rate limit status for IP
 */
export function getRateLimitStatus(ip: string, limit: number = 50): { remaining: number; resetTime: number } | null {
  const key = `redirect:${ip}`;
  const entry = rateLimitStore.get(key);

  if (!entry || Date.now() > entry.resetTime) {
    return null;
  }

  return {
    remaining: Math.max(0, limit - entry.count),
    resetTime: entry.resetTime,
  };
}

/**
 * Clean up expired entries (should be called periodically)
 */
export function cleanupExpiredEntries(): void {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}
