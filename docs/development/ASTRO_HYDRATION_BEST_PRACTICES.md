# Astro Hydration Best Practices Guide

Based on official Astro documentation and real-world troubleshooting experience.

## Understanding Astro Hydration

### Core Principles

1. **Astro components (.astro)** are HTML-only templates that render on the server
2. **Framework components** (React, Vue, Svelte) can be hydrated with `client:*` directives
3. **Default behavior**: Framework components render as static HTML without JavaScript
4. **Hydration**: The process of making server-rendered components interactive on the client

### Critical Rule: SSR + Hydration = Potential Mismatches

> **With all client directives except `client:only`, your component will first render on the server to generate static HTML. Component JavaScript will be sent to the browser according to the directive you chose. The component will then hydrate and become interactive.**

This means server-rendered HTML must EXACTLY match client-rendered HTML, or you get hydration errors.

---

## Client Directives - Official Guidance

### `client:load` - Immediate Hydration

- **Priority**: High
- **Use for**: Critical interactive elements needed immediately
- **Timing**: JavaScript loads and hydrates immediately on page load
- **Best for**: Navigation, critical forms, essential UI controls

### `client:idle` - Deferred Hydration

- **Priority**: Medium
- **Use for**: Non-critical interactive elements
- **Timing**: Hydrates after page load completes and `requestIdleCallback` fires
- **Risk**: ⚠️ **HIGH HYDRATION MISMATCH RISK** - Components render server-side first, then hydrate later

### `client:visible` - Lazy Hydration

- **Priority**: Low
- **Use for**: Below-fold or resource-intensive components
- **Timing**: Hydrates when component enters viewport (IntersectionObserver)
- **Risk**: ⚠️ **MEDIUM HYDRATION MISMATCH RISK** - Still renders server-side initially

### `client:only="react"` - Client-Only Rendering

- **Priority**: Varies
- **Use for**: Components that CANNOT render server-side
- **Timing**: No server rendering, JavaScript-only in browser
- **Risk**: ✅ **NO HYDRATION MISMATCHES** - No server/client comparison

---

## Common Hydration Mismatch Causes

### 1. **State-Dependent Rendering**

```jsx
// ❌ BAD - useState causes server/client differences
function BadComponent() {
  const [isOpen, setIsOpen] = useState(false);
  return <div className={isOpen ? 'open' : 'closed'}>Content</div>;
}
```

**Why it fails**: Server renders with `isOpen: false`, client may initialize differently.

### 2. **Browser API Dependencies**

```jsx
// ❌ BAD - window/document undefined on server
function BadComponent() {
  const isMobile = window.innerWidth < 768;
  return <div>{isMobile ? 'Mobile' : 'Desktop'}</div>;
}
```

**Solution**: Use `useEffect` or `typeof window !== 'undefined'` checks.

### 3. **Dynamic CSS Classes Based on State**

```jsx
// ❌ BAD - CSS classes differ between server/client
const [expanded, setExpanded] = useState(false);
return <div className={`dropdown ${expanded ? 'max-h-[500px]' : 'max-h-0'}`}>Content</div>;
```

### 4. **Date/Time Rendering**

```jsx
// ❌ BAD - Server and client times may differ
function BadComponent() {
  const now = new Date().toLocaleDateString();
  return <span>{now}</span>;
}
```

**Solution**: Pass consistent server-generated dates as props.

---

## Troubleshooting React Errors #418 & #423

### Error #418: "Hydration failed because the initial UI..."

- **Cause**: Server HTML doesn't match client-rendered HTML
- **Solution**: Identify differing content between server/client renders

### Error #423: "There was an error while hydrating..."

- **Cause**: React hydration process failed during component mounting
- **Solution**: Check for browser API usage, state mismatches, or async rendering

### Debugging Steps from Official Docs

1. **Use Console Debugging**:

   ```astro
   ---
   console.log('Server-side data:', serverData); // Shows in terminal
   ---

   <script>
     console.log('Client-side data:', clientData); // Shows in browser
   </script>
   ```

2. **Use Astro Debug Component**:

   ```astro
   ---
   import { Debug } from 'astro:components';
   ---

   <Debug serverData={serverData} />
   ```

---

## Best Practice Patterns

### ✅ Safe Server + Hydration Pattern

```jsx
function SafeComponent({ serverCurrentDate }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Use server-provided data for consistent rendering
  const displayDate = serverCurrentDate;

  return (
    <div>
      <span>{displayDate}</span>
      {isClient && <InteractiveElement />}
    </div>
  );
}
```

### ✅ Browser API Safe Pattern

```jsx
function SafeBrowserComponent() {
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWindowWidth(window.innerWidth);
    }
  }, []);

  // Render consistently until hydrated
  return (
    <div>
      {
        windowWidth > 0 ? (windowWidth < 768 ? 'Mobile' : 'Desktop') : 'Loading...' // Consistent fallback
      }
    </div>
  );
}
```

### ✅ State-Safe Pattern

```jsx
function SafeStatefulComponent() {
  const [mounted, setMounted] = useState(false);
  const [userState, setUserState] = useState(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return server-side safe content
    return <div>Loading...</div>;
  }

  // Client-only interactive content
  return (
    <div>
      <button onClick={() => setUserState(!userState)}>Toggle</button>
      {userState && <InteractiveContent />}
    </div>
  );
}
```

---

## Client Directive Decision Matrix

| Component Type           | Recommended Directive          | Reasoning                       |
| ------------------------ | ------------------------------ | ------------------------------- |
| **Navigation menus**     | `client:load`                  | Immediate interactivity needed  |
| **Form inputs**          | `client:load`                  | User expects immediate response |
| **Modal triggers**       | `client:load`                  | Critical UI functionality       |
| **Filtering/sorting**    | `client:load` OR `client:only` | State-heavy, high mismatch risk |
| **Newsletter forms**     | `client:visible`               | Often below fold, not critical  |
| **Social media widgets** | `client:visible`               | External dependencies           |
| **Analytics/tracking**   | `client:idle`                  | Background functionality        |
| **Comments sections**    | `client:visible`               | Below fold, resource intensive  |

---

## Production Error Prevention

### Pre-Deployment Checklist

1. ✅ All stateful components tested with appropriate directives
2. ✅ No browser API usage without proper guards
3. ✅ Server-provided props for any dynamic data
4. ✅ Consistent fallback content for loading states
5. ✅ Build tested locally with `npm run build && npm run preview`

### When to Use `client:only`

- Components with complex state management
- Third-party widgets with browser dependencies
- Components that differ significantly between server/client
- **Trade-off**: Lose SEO benefits but gain hydration safety

### When to Use `client:load` vs `client:idle`

- **`client:load`**: User interaction expected immediately
- **`client:idle`**: Background/secondary functionality
- **Risk Assessment**: `client:idle` has higher mismatch risk due to server rendering

---

## Emergency Fixes

### Quick Fix for Persistent Hydration Errors

```astro
<!-- Change from client:idle to client:only to eliminate SSR -->
<ProblematicComponent client:only="react" />
```

### Gradual Fix Approach

1. Identify the exact component causing issues (use browser dev tools)
2. Change problematic component to `client:only` temporarily
3. Refactor component to be hydration-safe
4. Change back to appropriate `client:*` directive

---

## Summary

**Golden Rule**: If a component has state, browser dependencies, or dynamic behavior, choose directives carefully:

- **Low risk**: `client:only` (no SSR)
- **Medium risk**: `client:load` (immediate hydration)
- **High risk**: `client:idle`, `client:visible` (delayed hydration with SSR)

**Remember**: Every `client:*` directive (except `client:only`) means your component renders twice - once on server, once on client. They must match exactly.
