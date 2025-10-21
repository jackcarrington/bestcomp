# UK Casino Comparison Site

Astro-based casino comparison website with advanced features including SSR, CSP security, and optimized performance.

## Technology Stack

- **Framework**: Astro 5.x with SSR
- **Styling**: Tailwind CSS
- **Deployment**: Netlify
- **Security**: Content Security Policy (CSP) with hash-based validation
- **Database**: Drizzle ORM (configured)

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
bestcomp/
├── src/
│   ├── components/     # Reusable Astro components
│   ├── layouts/        # Page layouts
│   ├── pages/          # Route pages
│   ├── styles/         # Global styles
│   └── utils/          # Utility functions
├── public/             # Static assets
├── docs/               # Project documentation
└── scripts/            # Build and utility scripts
```

## Documentation

See `docs/` directory for comprehensive documentation:
- **Development**: Astro patterns, hydration best practices
- **Security**: CSP implementation, security headers
- **Deployment**: Netlify configuration, deployment workflows

See also: `CLAUDE.md` for AI assistant context and project guidelines.

## Development Guidelines

- Follow Astro best practices for component architecture
- Use TypeScript for type safety
- Implement CSP-compliant code (no `unsafe-inline`)
- Test builds locally with `npm run preview` before deploying
- Document significant changes in appropriate docs/ files

## Key Features

- Server-Side Rendering (SSR) on Netlify
- Content Security Policy with automatic hash generation
- Mobile-responsive design
- Optimized performance and SEO
- Clean URL structure with redirects

## Configuration Files

- `astro.config.mjs` - Astro configuration with experimental features
- `tailwind.config.ts` - Tailwind CSS configuration
- `netlify.toml` - Netlify deployment settings
- `drizzle.config.ts` - Database configuration

## Scripts

See `scripts/` directory for utility scripts:
- Build automation
- Content generation
- Optimization tools

## Related Documentation

- **Parent Project**: `@../docs/` - Server and infrastructure docs
- **Module Context**: `CLAUDE.md` - AI assistant guidelines
- **Detailed Docs**: `docs/` - Technical documentation

---
*Last updated: October 21, 2025*
