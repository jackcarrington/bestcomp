# 🚨 CRITICAL: SSR/Hydration Consistency Issues - Prevention Guide

## Why We Keep Having Hydration Mismatches

### Root Cause Analysis

We're repeatedly encountering React hydration errors because **we're not following SSR/hydration best practices consistently**. This is a systemic issue, not isolated incidents.

### Common Patterns That Cause Hydration Errors

#### 1. **Date/Time Generation** ⚠️ MOST COMMON

```jsx
// ❌ WRONG - Will cause hydration mismatch
const currentDate = new Date().toLocaleDateString();

// ✅ CORRECT - Pass from server
function Component({ serverGeneratedDate }) {
  const currentDate = serverGeneratedDate || new Date().toLocaleDateString();
}
```

#### 2. **Random Values** ⚠️ HIGH RISK

```jsx
// ❌ WRONG - Different on server vs client
const randomId = Math.random();

// ✅ CORRECT - Generate on server, pass as prop
function Component({ serverId }) {
  const id = serverId || `fallback-${Date.now()}`;
}
```

#### 3. **Browser-Only APIs** ⚠️ MEDIUM RISK

```jsx
// ❌ WRONG - window undefined on server
const width = window.innerWidth;

// ✅ CORRECT - Check environment
const [width, setWidth] = useState(null);
useEffect(() => {
  setWidth(window.innerWidth);
}, []);
```

#### 4. **Environment Variables** ⚠️ MEDIUM RISK

```jsx
// ❌ WRONG - Different values server vs client
const isDev = process.env.NODE_ENV === 'development';

// ✅ CORRECT - Pass from Astro frontmatter
function Component({ environment }) {
  const isDev = environment === 'development';
}
```

### Why This Keeps Happening

1. **Convenience Over Correctness**: Using `new Date()` directly in components feels natural but breaks SSR
2. **Lack of Systematic Checking**: Not reviewing components for hydration-unsafe patterns
3. **Missing Development Warnings**: React's minified error messages hide the root cause
4. **Astro Islands Complexity**: Understanding when code runs server vs client side

### Mandatory Prevention Checklist

Before any React component with `client:*` directive:

- [ ] **No `new Date()` calls** - Pass dates from Astro frontmatter
- [ ] **No `Math.random()` calls** - Generate IDs on server side
- [ ] **No browser APIs** - Use `useEffect` or conditional rendering
- [ ] **No environment checks** - Pass environment as props
- [ ] **No external API calls** - Use Astro frontmatter or API routes
- [ ] **Test with React Dev Tools** - Check for hydration warnings

### Required Code Review Questions

1. Does this component generate any values that could differ between server and client?
2. Are we passing all dynamic/time-sensitive data as props from Astro?
3. Could any part of this component render differently on server vs client?
4. Have we tested this component for hydration errors?

### Astro-Specific Best Practices

#### ✅ CORRECT Pattern for Astro + React

```astro
---
// Generate consistent values in Astro frontmatter (server-side)
const serverDate = new Date().toLocaleDateString('en-GB', {
  year: 'numeric',
  month: 'long',
});
const serverId = `item-${Date.now()}`;
---

<MyComponent client:idle serverDate={serverDate} serverId={serverId} />
```

```jsx
// React component receives server-generated values
export default function MyComponent({ serverDate, serverId }) {
  // Use server values with fallbacks
  const displayDate = serverDate || new Date().toLocaleDateString('en-GB');
  const id = serverId || 'fallback-id';

  return <div id={id}>{displayDate}</div>;
}
```

### Tools for Detection

1. **React DevTools**: Shows hydration mismatches in development
2. **Astro Dev Server**: Logs hydration errors to console
3. **Production Testing**: Always test builds, not just dev server
4. **Browser Console**: Check for React error #423 specifically

### Emergency Response Plan

When hydration error occurs:

1. **Immediate**: Identify components with `client:*` directives
2. **Search**: Look for `new Date()`, `Math.random()`, browser APIs
3. **Fix**: Move dynamic generation to Astro frontmatter
4. **Pass**: Server-generated values as props to React components
5. **Test**: Build and preview to confirm fix
6. **Document**: Add to this guide for future prevention

### Recent Fixes (Learning Record)

- **2025-09-16**: HeroSection date mismatch - `new Date()` in component caused error #423
  - **PARTIAL FIX**: Added server date props but STILL SEEING ERRORS #418 + #423
  - **ROOT CAUSE**: Multiple components hydrating simultaneously causing cascade failure
  - **NEXT ACTION**: Must check if HeroSection props actually being passed correctly

### Critical Error Patterns

#### **Cascading Hydration Errors** 🚨 EMERGENCY

When you see multiple React errors (e.g., #418 repeating 12+ times + #423):

1. **Stop immediately** - Don't add more fixes, you'll make it worse
2. **Check component props** - Ensure server values are actually passed
3. **Test components individually** - Use `client:only` to isolate problems
4. **Verify in production** - Local dev vs production can behave differently

---

## 🎯 ACTION REQUIRED

**Every developer must:**

1. Read this guide before creating React components in Astro
2. Use the checklist for every `client:*` component
3. Update this document when new patterns are discovered
4. Review existing components for these anti-patterns

**Project Lead must:**

- Enforce checklist in code reviews
- Add hydration testing to CI/CD pipeline
- Schedule quarterly audit of all client components
