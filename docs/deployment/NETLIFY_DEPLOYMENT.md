# Netlify Deployment Guide

## Setup Steps

### 1. Environment Variables

In your Netlify dashboard, set these environment variables:

- `DATABASE_URL`: Your PostgreSQL connection string (e.g., from Neon Database)
- `SENDGRID_API_KEY`: Your SendGrid API key for newsletter functionality
- `NODE_ENV`: Set to `production`

### 2. Build Settings

- **Build command**: `npm run build:netlify`
- **Publish directory**: `dist/public`
- **Functions directory**: `netlify/functions`

### 3. Domain Configuration

Update the canonical URL in `/netlify/functions/ssr.ts` (line 73):

```typescript
const currentUrl = `https://your-domain.com${url}`;
```

### 4. Deploy

1. Connect your GitHub repository to Netlify
2. Set the build settings above
3. Add environment variables
4. Deploy!

## How It Works

### API Routes

- All `/api/*` requests are handled by `/.netlify/functions/api`
- This serverless function wraps your existing Express routes

### Server-Side Rendering

- All page requests are handled by `/.netlify/functions/ssr`
- This function renders React server-side with your casino data
- Dynamic meta tags are injected for landing pages
- SEO-optimized HTML is served to all visitors

### Database

- Optimized for serverless with Neon Database
- Connection pooling configured for Netlify Functions
- All existing database operations work unchanged

## Benefits

- ✅ True server-side rendering for all pages
- ✅ SEO-friendly with proper meta tags
- ✅ Fast global CDN distribution
- ✅ Automatic HTTPS
- ✅ Zero server maintenance
- ✅ Pay-per-request pricing

## Testing

After deployment, verify:

1. Homepage loads with SSR
2. Landing pages have correct meta tags
3. Affiliate redirects work correctly
4. Newsletter signup functions
5. All API endpoints respond correctly
