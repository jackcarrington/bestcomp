// Environment variable validation for security
// Console statements removed for Google Ads compliance
/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DATABASE_URL: z.string().optional(),
  NETLIFY_DATABASE_URL: z.string().optional(),
  NETLIFY_DATABASE_URL_UNPOOLED: z.string().optional(),
  SENDGRID_API_KEY: z.string().optional(),
  CONTEXT7_API_KEY: z.string().optional(),
});

export function validateEnvironment() {
  try {
    const env = envSchema.parse(process.env);

    // Additional runtime checks that don't block build
    const hasDbConnection = env.DATABASE_URL || env.NETLIFY_DATABASE_URL;

    if (!hasDbConnection && process.env.NODE_ENV === 'production') {
      throw new Error('Database URL must be provided in production');
    }

    if (!hasDbConnection) {
      // Database warning removed for Google Ads compliance
    } else {
      // Validation success removed for Google Ads compliance
    }

    return env;
  } catch {
    // Environment error removed for Google Ads compliance
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Invalid environment configuration');
    }
    // Development warning removed for Google Ads compliance
    return process.env;
  }
}

// Export lazy validation - will be called when needed, not at module load
export const env = (() => {
  let cached: any = null;
  return () => {
    if (!cached) {
      cached = validateEnvironment();
    }
    return cached;
  };
})();
