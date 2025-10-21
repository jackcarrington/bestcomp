# React Hydration Debug Guide

## How to Debug Hydration Errors

### 1. Run Development Mode

```bash
npm run dev
```

This now runs with `NODE_ENV=development` which enables:

- Detailed React error messages instead of minified error codes
- Debug logging from our hydration debug utility
- React development warnings

### 2. Check Browser Console

Look for these debug messages:

- `🐛 HYDRATION DEBUG: [ComponentName]` - Shows props for each component
- `🔄 RENDER: [ComponentName]` - Shows when components render
- `✅ HYDRATION MATCH: [description]` - Server/client values match
- `❌ HYDRATION MISMATCH: [description]` - Server/client values differ

### 3. Common Hydration Issues Fixed

#### HeroSection.jsx

- **Issue**: Date creation on client vs server
- **Fix**: Always use server-provided `serverCurrentDate` and `serverCurrentMonthYear`
- **Debug**: Added prop logging and server/client date comparison

#### CasinoList.jsx

- **Issue**: Initial state mismatches
- **Fix**: Use `initialCasinos` prop consistently, avoid derived state
- **Debug**: Added prop logging for initial casino data

#### FilterSort.jsx

- **Issue**: Window object access during SSR
- **Fix**: Already had `typeof window !== 'undefined'` checks
- **Debug**: Added state logging for initial values

### 4. What to Look For

**Error #418**: Server HTML ≠ Client expectations

- Check for different date/time values
- Look for conditional rendering based on client-only APIs
- Verify initial state matches server props

**Error #423**: React fell back to client-rendering

- Usually caused by Error #418
- Performance penalty - entire component tree re-rendered
- Check same issues as #418

### 5. Testing Checklist

1. **Development Mode**: Clear console, refresh page
2. **Check Debug Logs**: Look for mismatches in console
3. **Production Build**: Test with `npm run build && npm run preview`
4. **Different Browsers**: Test Chrome, Safari, Firefox
5. **Incognito Mode**: Avoid browser extension interference

### 6. Quick Fixes Applied

- ✅ Enabled React development mode with NODE_ENV
- ✅ Created hydration debug utility
- ✅ Fixed HeroSection date handling
- ✅ Removed render-time console.logs
- ✅ Added debug logging to all React components
- ✅ Cleaned up unused variables

### 7. If Issues Persist

1. Check for browser extensions modifying DOM
2. Look for race conditions in useEffect
3. Verify all props are serializable
4. Check for Memory issues with large datasets
5. Consider using `suppressHydrationWarning` for dynamic content

### 8. Monitoring

The debug utility only runs in development mode, so production performance is unaffected. Monitor console for hydration warnings after deploying fixes.
