// @ts-check
import { defineConfig } from 'astro/config';
// import react from '@astrojs/react'; // Removed - no React components in use
import tailwind from '@astrojs/tailwind';
import netlify from '@astrojs/netlify';
import sitemap from '@astrojs/sitemap';
import { visualizer } from 'rollup-plugin-visualizer';

// Disabled monitoring/debugging services for Google Ads compliance
// import sentry from '@sentry/astro';
// import spotlightjs from '@spotlightjs/astro';
// import cookieconsent from '@jop-software/astro-cookieconsent';

// Note: Environment validation is handled at runtime, not build time

// https://astro.build/config
export default defineConfig({
  site: 'https://findcasinosites.co.uk',
  // ✅ BEST PRACTICE: Static redirects using Astro's built-in system
  // These generate proper _redirects file for Netlify
  redirects: {
    // Legacy URL patterns
    '/casino': '/',
    '/casinos': '/',
    '/bonus': '/',
    '/bonuses': '/',
    // Common SEO patterns
    '/online-casino': '/',
    '/uk-casino': '/',
    '/casino-games': '/',
    // Prevent access to admin/internal paths
    '/admin': '/',
    '/api': '/',
    '/internal': '/',
  },
  // Experimental CSP enabled - Official Astro + Netlify integration
  // Uses hash-based CSP with Netlify static headers for maximum security
  experimental: {
    csp: {
      algorithm: 'SHA-256',
      directives: [
        "default-src 'self'",
        "img-src 'self' data: https://images.unsplash.com https://plus.unsplash.com",
        "font-src 'self' https://fonts.gstatic.com",
        "connect-src 'self'",
        "frame-src 'none'",
        "object-src 'none'",
        "base-uri 'none'",
      ],
      styleDirective: {
        resources: ["'self'", 'https://fonts.googleapis.com'],
      },
      scriptDirective: {
        resources: ["'self'"],
        strictDynamic: true,
      },
    },
  },
  // Optimize build for performance
  build: {
    inlineStylesheets: 'auto', // Inline small CSS files
    assets: '_astro', // Keep consistent asset naming
  },
  // Compress HTML output
  compressHTML: true,
  integrations: [
    tailwind({
      // Apply Tailwind to all files
      applyBaseStyles: false, // Keep false to avoid conflicts, we handle base styles in global.css
    }),
    sitemap({
      // Filter out test pages and internal routes from sitemap
      filter: page => !page.includes('/test-') && !page.includes('/api/') && !page.includes('/go/'),
      // Add dynamic landing pages for SEO
      customPages: [
        'https://findcasinosites.co.uk/casino-bonuses/',
        'https://findcasinosites.co.uk/casino-games/',
        'https://findcasinosites.co.uk/mobile-casinos/',
        'https://findcasinosites.co.uk/mobile-slots/',
        'https://findcasinosites.co.uk/online-casinos/',
        'https://findcasinosites.co.uk/online-slots/',
        'https://findcasinosites.co.uk/slot-machines/',
        'https://findcasinosites.co.uk/slots-games/',
        'https://findcasinosites.co.uk/slots-machines/',
        'https://findcasinosites.co.uk/uk-casinos/',
        'https://findcasinosites.co.uk/video-slots/',
      ],
    }),
  ],
  // Disabled for Google Ads compliance - monitoring/debugging services
  // sentry(), ...(process.env.NODE_ENV === 'development' ? [spotlightjs()] : []),
  // cookieconsent({...})
  output: 'server',
  security: {
    checkOrigin: false, // Disabled - no POST endpoints exist
  },
  adapter: netlify({
    // Cache on-demand rendered pages for better performance
    cacheOnDemandPages: true,
    // Enable CSP headers for prerendered pages (Astro 5.11+)
    experimentalStaticHeaders: true,
  }),
  vite: {
    // Prevent edge functions from being loaded during development
    define: {
      'process.env.NETLIFY_LOCAL': JSON.stringify('false'),
    },
    build: {
      // Optimize chunk splitting to reduce main bundle size
      rollupOptions: {
        output: {
          manualChunks: id => {
            // Separate vendor dependencies into smaller chunks
            if (id.includes('node_modules')) {
              if (id.includes('date-fns') || id.includes('clsx') || id.includes('class-variance-authority')) {
                return 'vendor-utils';
              }
              // Removed Sentry/Spotlight chunking for Google Ads compliance
              // if (id.includes('@sentry') || id.includes('spotlight')) {
              //   return 'vendor-sentry';
              // }
              // Group other vendor dependencies
              return 'vendor-other';
            }
          },
          // Optimize chunk size limits
          chunkFileNames: () => {
            return `assets/[name]-[hash].js`;
          },
        },
      },
      // Minify and optimize
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true, // Remove console.logs in production
          drop_debugger: true,
          pure_funcs: ['console.log', 'console.info', 'console.debug'],
        },
      },
      // More reasonable chunk size warning
      chunkSizeWarningLimit: 500,
    },
    plugins: [
      // Bundle analyzer - only run in development mode for security
      ...(process.env.NODE_ENV === 'development'
        ? [
            visualizer({
              emitFile: true,
              filename: 'stats.html',
              gzipSize: true,
              brotliSize: true,
            }),
          ]
        : []),
    ],
  },
});
