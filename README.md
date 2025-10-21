# UK Casino Comparison Site

A comprehensive UK casino comparison platform built with Astro, React, and PostgreSQL.

## Features

- 🎰 Real-time casino offers and bonuses
- 🔍 Interactive filtering and sorting
- 📱 Responsive mobile-first design
- 🎯 Dynamic PPC landing pages
- 🔒 Content Security Policy (CSP) implementation
- 💰 Affiliate tracking integration

## Tech Stack

- **Frontend**: Astro 5, React 18, TypeScript
- **Styling**: Tailwind CSS, Shadcn/UI
- **Database**: PostgreSQL (Neon), Drizzle ORM
- **Deployment**: Netlify with Edge Functions
- **Authentication**: JWT with HTTP-only cookies

## Quick Start

```bash
# Install dependencies
npm install

# Start development server (recommended)
netlify dev

# Or use basic Astro dev server
npm run dev

# Build for production
npm run build
```

## Database Setup

```bash
# Apply schema changes
npm run db:push

# Seed casino data
npm run db:seed-casinos

# Seed landing pages
npm run db:seed-landing
```

## Development

See `CLAUDE.md` for comprehensive technical documentation and development guidelines.

## Security

This project implements Content Security Policy (CSP) following Astro best practices:

- No `unsafe-inline` directives
- External resources properly configured
- CSS classes instead of inline styles

## Compliance

Built for UK gambling advertising standards with:

- 18+ age verification prompts
- Responsible gambling information
- Comprehensive terms and conditions
- Regulatory compliance features
