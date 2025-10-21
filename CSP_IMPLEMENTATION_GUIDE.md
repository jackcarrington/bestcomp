# Complete CSP Implementation Guide for Astro + Netlify

## Executive Summary

This comprehensive guide provides a definitive implementation strategy for Content Security Policy (CSP) in Astro applications deployed on Netlify. Based on extensive research of official documentation, security best practices, and real-world deployment patterns, this document presents the complete technical requirements, configuration options, and troubleshooting approaches for enterprise-grade security.

## Table of Contents

1. [Critical Security Issue Analysis](#critical-security-issue-analysis)
2. [Astro vs Netlify CSP Approaches](#astro-vs-netlify-csp-approaches)
3. [Recommended Implementation Strategy](#recommended-implementation-strategy)
4. [Complete Configuration Guide](#complete-configuration-guide)
5. [Header Conflicts and Resolution](#header-conflicts-and-resolution)
6. [Debugging and Troubleshooting](#debugging-and-troubleshooting)
7. [Security Implications](#security-implications)
8. [Production Deployment Checklist](#production-deployment-checklist)

---

## Critical Security Issue Analysis

### The Hash vs Nonce Paradigm

**Astro's Design Philosophy**: Astro chose a hash-based CSP approach over nonce-based implementation for universal compatibility across:

- Static hosting (GitHub Pages, Netlify, Vercel)
- Serverless functions (AWS Lambda, Cloudflare Workers)
- Server-Side Rendering (SSR)
- Single Page Applications (SPAs)

**Security Trade-offs**:

- **Hash-based**: More suitable for static content, cacheable, universal compatibility
- **Nonce-based**: More secure for dynamic content, requires server-side generation, smaller headers

**Astro's Rationale**: Both CSP and content can be static with hashes because hashes remain constant, making hash-based policies ideal for Astro's hybrid rendering architecture.

### Critical Understanding: No Blanket Removal Required

**Important**: There is **no blanket recommendation** to remove Netlify's dynamic CSP nonce integration. The choice depends on your specific architecture and security requirements.

#### When to Use Netlify's Dynamic CSP Nonce:

- ✅ **Not using Astro's experimental CSP feature**
- ✅ **Deploying static builds to Netlify**
- ✅ **SSR on Netlify without native nonce/hash handling**
- ✅ **Prefer dynamic nonce generation for enhanced security**

#### When to Prefer Astro's Built-in CSP:

- ✅ **Using Astro's experimental CSP feature**
- ✅ **Need tight coupling between script management and CSP**
- ✅ **Astro islands require specific hash coverage**
- ✅ **Want unified CSP management in Astro config**

#### Critical Recommendation:

**Choose ONE clear CSP solution** - Do not use both Astro CSP and Netlify's dynamic CSP in ways that cause overlapping or conflicting rules.

---

## Astro vs Netlify CSP Approaches

### Astro's Experimental CSP (Hash-Based)

**Added in**: Astro 5.9.0 (2024)

**Architecture**:

```javascript
// astro.config.mjs
export default defineConfig({
  experimental: {
    csp: {
      algorithm: 'SHA-256',
      directives: ["default-src 'self'", "img-src 'self' data: https://images.cdn.example.com"],
      styleDirective: {
        resources: ["'self'", 'https://fonts.googleapis.com'],
        strictDynamic: false,
      },
      scriptDirective: {
        resources: ["'self'"],
        strictDynamic: true,
      },
    },
  },
});
```

**Implementation Method**:

- Generates `<meta http-equiv="content-security-policy">` elements
- Calculates SHA-256/384/512 hashes of all scripts and styles
- Supports runtime CSP API for per-page customization

**Advantages**:

- ✅ Universal compatibility (static, SSR, SPA)
- ✅ Tight integration with Astro's rendering pipeline
- ✅ Automatic hash generation for Astro islands
- ✅ Cacheable CSP policies
- ✅ Works in development and production

**Limitations**:

- ❌ Not supported in `dev` mode (use `build` and `preview`)
- ❌ Inline scripts require manual hash provision
- ❌ No support for Astro View Transitions (`<ClientRouter />`)

### Netlify's Dynamic CSP Nonce

**Architecture**:

```toml
# netlify.toml
[[plugins]]
package = "@netlify/plugin-csp-nonce"
[plugins.inputs]
reportOnly = false
unsafeEval = false
strictDynamic = true
unsafeInline = false
self = true
```

**Implementation Method**:

- Edge Function generates cryptographically-secure nonces per request
- Dynamically injects nonces into `<script>` tags
- Sets `Content-Security-Policy` HTTP headers

**Advantages**:

- ✅ Dynamic nonce generation (enhanced security)
- ✅ Works with any framework/static site
- ✅ Handles snippets and Real User Metrics (RUM)
- ✅ Report-only mode for testing
- ✅ Traffic distribution controls

**Limitations**:

- ❌ Requires Edge Functions (Netlify-specific)
- ❌ May not understand Astro's inline script patterns
- ❌ Potential conflicts with Astro's CSP

### Official Astro Position on Netlify CSP

According to Astro documentation: **Using Netlify's CSP plugin alone is not considered optimal for Astro applications**.

**Reason**: Astro's built-in CSP can deeply integrate with script rendering and hashing in Astro islands, providing accurate CSP headers/meta tags that generic Netlify-level CSP integrations may not fully accommodate.

**Astro's Recommendation**: Use Astro's experimental CSP with `experimentalStaticHeaders` flag to ensure Astro-generated headers are used in Netlify's configuration.

---

## Recommended Implementation Strategy

### Option 1: Astro CSP with Netlify Static Headers (RECOMMENDED)

**When to Use**: New projects, full control over CSP, Astro islands heavy usage

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';

export default defineConfig({
  experimental: {
    csp: {
      algorithm: 'SHA-256',
      directives: [
        "default-src 'self'",
        "img-src 'self' data: https://images.unsplash.com",
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
  adapter: netlify({
    experimentalStaticHeaders: true,
  }),
});
```

**Configuration Steps**:

1. Enable Astro's experimental CSP
2. Enable `experimentalStaticHeaders` in Netlify adapter
3. Remove any existing Netlify CSP plugins
4. Remove CSP headers from `netlify.toml` or `_headers`

### Option 2: Netlify Dynamic CSP Only

**When to Use**: Legacy projects, prefer nonce-based security, minimal Astro islands

```toml
# netlify.toml
[[plugins]]
package = "@netlify/plugin-csp-nonce"
[plugins.inputs]
reportOnly = false
unsafeEval = false
strictDynamic = true
unsafeInline = false
self = true
excludedPath = [
  "/api/*"
]
```

**Configuration Steps**:

1. Ensure Astro experimental CSP is disabled
2. Install and configure Netlify CSP plugin
3. Test thoroughly with Astro islands

### Option 3: Hybrid Approach (ADVANCED)

**When to Use**: Complex requirements, need both static and dynamic CSP

```javascript
// astro.config.mjs - Minimal Astro CSP for core resources
export default defineConfig({
  experimental: {
    csp: {
      directives: ["default-src 'self'", "base-uri 'none'"],
    },
  },
  adapter: netlify({
    experimentalStaticHeaders: true,
  }),
});
```

```toml
# netlify.toml - Netlify handles script/style nonces
[[plugins]]
package = "@netlify/plugin-csp-nonce"
[plugins.inputs]
reportOnly = false
unsafeInline = false
# Let Astro handle base directives
excludedDirectives = ["default-src", "base-uri"]
```

---

## Complete Configuration Guide

### Astro CSP Runtime APIs

For per-page CSP customization:

```astro
---
// src/pages/special-page.astro
// Add external script source for this page only
Astro.csp.insertScriptResource('https://analytics.example.com');

// Add external style source
Astro.csp.insertStyleResource('https://fonts.googleapis.com');

// Add custom directive
Astro.csp.insertDirective("img-src 'self' https://images.cdn.example.com");

// Add specific hash for inline script
Astro.csp.insertScriptHash('sha256-abc123...');
---
```

### Netlify CSP Plugin Advanced Configuration

```toml
# netlify.toml
[[plugins]]
package = "@netlify/plugin-csp-nonce"
[plugins.inputs]
# Security settings
reportOnly = false              # Set to true for testing
unsafeEval = false              # Block eval()
strictDynamic = true            # Enhanced security
unsafeInline = false            # Block inline scripts/styles
self = true                     # Allow same-origin

# Path exclusions
excludedPath = [
  "/api/*",                     # API routes
  "**/*.json"                   # JSON responses
]

# Traffic distribution (0.0 to 1.0)
# Set CSP_NONCE_DISTRIBUTION environment variable
# Example: 0.25 = 25% of traffic gets CSP headers
```

### Environment Variables

```bash
# Netlify environment variables
CSP_NONCE_DISTRIBUTION=1.0      # 100% traffic coverage
NODE_ENV=production             # Ensure production mode

# Astro environment variables
ASTRO_TELEMETRY_DISABLED=1     # Disable telemetry for security
```

---

## Header Conflicts and Resolution

### Common Conflict Scenarios

1. **Duplicate CSP Headers**: Both Astro and Netlify set `Content-Security-Policy`
2. **Conflicting Directives**: Different `script-src` or `style-src` values
3. **Meta vs HTTP Headers**: Astro uses `<meta>`, Netlify uses HTTP headers
4. **Caching Issues**: Stale headers from previous deployments

### Resolution Strategies

#### 1. Header Source Audit

```bash
# Check for all CSP header sources
grep -r "Content-Security-Policy" .
find . -name "_headers" -exec cat {} \;
find . -name "netlify.toml" -exec grep -A 20 "headers" {} \;
```

#### 2. Browser DevTools Inspection

**Critical Debugging Steps**:

1. Open Network tab in DevTools
2. Reload page and select main document
3. Check Response Headers for:
   - `Content-Security-Policy`
   - `Content-Security-Policy-Report-Only`
4. Verify HTML `<meta>` tags in Elements tab

#### 3. CSP Conflict Resolution Matrix

| Scenario         | Astro CSP | Netlify CSP | Resolution                          |
| ---------------- | --------- | ----------- | ----------------------------------- |
| Both enabled     | ✅        | ✅          | **CONFLICT** - Choose one           |
| Hash + Nonce     | ✅        | ✅          | **CONFLICT** - Use Astro only       |
| Static + Dynamic | ✅        | ✅          | **ADVANCED** - Careful coordination |
| Neither working  | ❌        | ❌          | **BROKEN** - Check configuration    |

### Multi-CSP Header Behavior

**Browser Behavior**: When multiple CSP policies exist, browsers select the **most restrictive policy** for each directive.

**Example**:

```http
Content-Security-Policy: script-src 'self'
Content-Security-Policy: script-src 'self' 'unsafe-inline'
```

Result: Browser uses `script-src 'self'` (more restrictive)

---

## Debugging and Troubleshooting

### Systematic Debugging Approach

#### Phase 1: Header Presence Verification

```bash
# Check if CSP headers are sent
curl -I https://your-site.netlify.app/ | grep -i "content-security-policy"

# Check for report-only headers
curl -I https://your-site.netlify.app/ | grep -i "content-security-policy-report-only"
```

#### Phase 2: Configuration Validation

**Astro CSP Validation**:

```javascript
// Test in astro.config.mjs
console.log('CSP Config:', config.experimental?.csp);

// Test in component
console.log('CSP Available:', !!Astro.csp);
```

**Netlify Plugin Validation**:

```toml
# Add debug logging
[[plugins]]
package = "@netlify/plugin-csp-nonce"
[plugins.inputs]
debug = true  # Enable debug logging
```

#### Phase 3: Browser Console Analysis

**Key Console Checks**:

1. CSP violation errors
2. Blocked resource warnings
3. Script/style loading failures

**Common Error Patterns**:

```javascript
// CSP violation
'Refused to execute inline script because it violates the following Content Security Policy directive';

// Missing nonce
"Refused to execute inline script because it violates CSP directive: 'script-src 'self''";

// Hash mismatch
'Refused to execute inline script because its hash does not appear in the script-src directive';
```

### Known Issues and Solutions

#### Issue 1: Headers Not Appearing on Netlify

**Symptoms**: CSP configuration appears correct but no headers in response

**Solutions**:

1. Clear build cache: `netlify env:unset BUILD_CACHE`
2. Deploy fresh build
3. Check for conflicting plugins
4. Verify `netlify.toml` syntax

#### Issue 2: Report-Only Mode Stuck

**Symptoms**: Only `Content-Security-Policy-Report-Only` appears

**Solutions**:

1. Set `reportOnly = false` explicitly
2. Check environment variables
3. Verify traffic distribution settings

#### Issue 3: Astro Islands Breaking CSP

**Symptoms**: Astro components with client-side scripts blocked

**Solutions**:

1. Use Astro's CSP instead of generic Netlify CSP
2. Add specific hashes for custom scripts
3. Enable `strictDynamic` for dynamic script loading

---

## Security Implications

### Hash vs Nonce Security Analysis

**Hash-based Advantages**:

- ✅ Resistant to replay attacks (content must match exactly)
- ✅ Cacheable and static
- ✅ Works without server-side state

**Nonce-based Advantages**:

- ✅ Smaller header size
- ✅ Dynamic per-request security
- ✅ Better for frequently changing content

**W3C Security Note**: "Using a nonce to allow inline script or style is less secure than not using a nonce, as nonces override the restrictions in the directive in which they are present."

### CSP Directive Security Levels

**Most Secure** → **Least Secure**:

1. `'none'` - Block everything
2. `'self'` - Same origin only
3. `'sha256-hash'` - Specific content hash
4. `'nonce-value'` - Dynamic nonce
5. `https:` - HTTPS sources only
6. `*` - Allow all sources
7. `'unsafe-inline'` - Allow inline content
8. `'unsafe-eval'` - Allow eval()

### Astro-Specific Security Considerations

**Challenge**: Astro generates inline scripts for islands, requiring CSP accommodation

**Solutions**:

1. **Preferred**: Use Astro's CSP for automatic hash generation
2. **Alternative**: Carefully craft nonce/hash policies for Astro patterns
3. **Last Resort**: Use `'unsafe-inline'` with additional protections

---

## Production Deployment Checklist

### Pre-Deployment Testing

- [ ] Test CSP with `npm run build && npm run preview`
- [ ] Verify all Astro islands function correctly
- [ ] Check external resource loading (fonts, images, APIs)
- [ ] Test with browser extensions disabled
- [ ] Validate CSP syntax with online tools

### Deployment Configuration

- [ ] Choose single CSP approach (Astro OR Netlify)
- [ ] Remove conflicting CSP sources
- [ ] Enable appropriate experimental flags
- [ ] Set correct environment variables
- [ ] Configure error reporting endpoints

### Post-Deployment Verification

- [ ] Verify CSP headers in production responses
- [ ] Monitor browser console for violations
- [ ] Test critical user journeys
- [ ] Check CSP reporting endpoint for violations
- [ ] Validate performance impact

### Monitoring and Maintenance

- [ ] Set up CSP violation reporting
- [ ] Monitor browser compatibility
- [ ] Review and update policies regularly
- [ ] Test after Astro/Netlify updates
- [ ] Document any custom CSP modifications

---

## Conclusion

This comprehensive guide provides the complete technical foundation for implementing robust CSP in Astro applications deployed on Netlify. The key to success is choosing a single, coherent approach and thoroughly testing across your application's features.

**Primary Recommendation**: Use Astro's experimental CSP for new projects requiring maximum security and Astro integration.

**Alternative**: Use Netlify's dynamic CSP for simpler deployments or when Astro's experimental features are not suitable.

**Critical Success Factor**: Never mix both approaches without careful coordination and extensive testing.

---

_This guide is based on Astro 5.9+ and current Netlify platform capabilities as of 2025. Always consult the latest official documentation for the most current information._
