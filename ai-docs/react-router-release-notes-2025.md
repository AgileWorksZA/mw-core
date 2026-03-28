# React Router Release Notes - January 2025 Update

Generated: 2025-06-09  
Since: 2025-01-01

## React Router v7 - Major Version Overview

React Router v7 represents the merger of Remix v2 into React Router, making it both a full-stack React framework and a stand-alone routing library. This is a significant milestone in the project's evolution.

### v7 Key Information
- **Minimum Requirements**: Node.js 20+, React 18+, React DOM 18+, Vite 5+
- **Major Change**: Remix has been merged into React Router
- **Package Consolidation**: Most APIs moved from runtime-specific packages to `react-router`
- **Migration Path**: Largely non-breaking for apps with all Remix v2 future flags enabled

## Recent Updates (January 2025)

### Executive Summary
- **Current Version**: Your project uses v7.5.3 (latest stable as of early January)
- **Latest Release**: v7.6.2 (released ~January 21, 2025)
- **Security Fix**: Critical security vulnerability patched in v7.6.x
- **Action Required**: Update to v7.6.2 for security fix (CVE-2025-31137)
- **Risk Assessment**: Medium - Security vulnerability in current version
- **Breaking Changes**: None - v7.5.3 → v7.6.2 is a patch upgrade

## Version Progression

### v7.6.2 (January 21, 2025) 🔒

#### Security Fix
- **Critical**: Fixed URL manipulation vulnerability via Host and X-Forwarded-Host headers
- **CVE**: CVE-2025-31137 / GHSA-4q56-crqp-v477
- **Impact**: Potential cache pollution due to inadequate port sanitization

### v7.6.1 (January 2025)

- Bug fixes and stability improvements
- Better validation of x-forwarded-host header (#13309)

### v7.6.0 (January 2025) ✨

#### New Features
- **Lazy Middleware Support** (unstable):
  ```javascript
  // New unstable feature for lazy loading middleware
  route.unstable_lazyMiddleware = () => import('./middleware')
  ```
- Enhanced type safety for middleware functions (#13311)

### v7.5.3 (Your Current Version)

- Stable release with React 19 support
- SSG support via prerender config
- Enhanced TypeScript integration

## Migration Guide

### Immediate Action: Security Update

```bash
# Update to latest secure version
bun update react-router@7.6.2 react-router-dom@7.6.2 @react-router/dev@7.6.2
```

### Package Cleanup (Recommended)

Since v7, `react-router-dom` is deprecated. Update your imports:

```javascript
// Old (still works but deprecated)
import { Link, useNavigate } from "react-router-dom";

// New (recommended)
import { Link, useNavigate } from "react-router";
```

Automated migration script:
```bash
# Update all imports in your codebase
find ./app -name "*.tsx" -o -name "*.ts" -o -name "*.jsx" -o -name "*.js" \
  -exec sed -i '' 's/from "react-router-dom"/from "react-router"/g' {} +
```

### Your Project Status

Based on your `package.json`:
- ✅ Already on v7.5.3 (good!)
- ⚠️  Still using both `react-router` and `react-router-dom`
- ⚠️  Missing security patch from v7.6.2
- ✅ Using React 19.1.0 (compatible)

## Key Features Since v7.0

1. **Static Site Generation (SSG)**
   ```javascript
   // vite.config.js
   export default {
     plugins: [
       reactRouter({
         prerender: ["/", "/about", "/blog/*"]
       })
     ]
   }
   ```

2. **Enhanced Type Safety**
   - Automatic route typegen with `react-router typegen`
   - Better inference for params and search params

3. **Improved Performance**
   - Deduped lazy route loading
   - Better bundle splitting
   - Optimized server rendering

## Recent Bug Fixes (v7.5.x → v7.6.x)

- Dedupe calls to `route.lazy` functions (#13260)
- Fix path in prerender error messages (#13257)
- Fix typegen for virtual modules when `moduleDetection` is set (#13267)
- Security hardening for header validation

## Recommendations

### 1. Immediate Updates

```json
// Update your package.json
{
  "dependencies": {
    "react-router": "^7.6.2",
    // Remove this line after updating imports
    // "react-router-dom": "^7.5.3",
  },
  "devDependencies": {
    "@react-router/dev": "^7.6.2",
  }
}
```

### 2. Code Updates

1. **Update imports** from `react-router-dom` to `react-router`
2. **Run typegen** to ensure type safety: `bun run typecheck`
3. **Test SSG** if you have static pages that could benefit

### 3. New Features to Explore

- **Prerendering**: Add static page generation for better performance
- **Middleware** (unstable): Prepare for future middleware support
- **Type Safety**: Leverage improved TypeScript integration

## Testing Checklist

After updating:
1. ✓ Run `bun run typecheck`
2. ✓ Run `bun test`
3. ✓ Test authentication flows (security fix related)
4. ✓ Verify routing works correctly
5. ✓ Check for console warnings about deprecated imports

## Major v7 Breaking Changes from v6/Remix v2

### Response Helper Deprecations ⚠️
**Important**: The `json` and `defer` helper methods are deprecated in v7:

```javascript
// ❌ Old way (deprecated)
import { json, defer } from "react-router";

async function loader() {
  return json({ data: "hello" });
}

async function deferredLoader() {
  return defer({ data: fetchSlowData() });
}

// ✅ New way (recommended)
async function loader() {
  return { data: "hello" }; // Just return plain objects!
}

async function deferredLoader() {
  return { data: fetchSlowData() }; // Defer works automatically
}

// If you need actual JSON Response:
async function loader() {
  return Response.json({ data: "hello" }); // Use native Response.json()
}
```

**Migration**: Simply remove `json()` and `defer()` wrappers - React Router v7 handles serialization automatically.

### Package Name Changes
| Old Package (v6/Remix v2) | New Package (v7) |
|---------------------------|------------------|
| `@remix-run/node` | `@react-router/node` |
| `@remix-run/cloudflare` | `@react-router/cloudflare` |
| `@remix-run/react` | `react-router` |
| `@remix-run/dev` | `@react-router/dev` |
| `@remix-run/serve` | `@react-router/serve` |

### Component Renames
- `RemixServer` → `ServerRouter`
- `RemixBrowser` → `HydratedRouter`

### Configuration Changes
- New `react-router.config.ts` file required
- Vite plugin changes from `@remix-run/dev` to `@react-router/dev/vite`
- New `app/routes.ts` file for route configuration

### Script Updates
- `remix vite:dev` → `react-router dev`
- `remix vite:build` → `react-router build`
- `remix-serve` → `react-router-serve`

## Additional Resources

- [React Router v7 Changelog](https://reactrouter.com/changelog)
- [Security Advisory](https://github.com/advisories/GHSA-4q56-crqp-v477)
- [Upgrading from Remix v2](https://reactrouter.com/upgrading/remix)
- [Upgrading from React Router v6](https://reactrouter.com/upgrading/v6)
- [v7 Announcement](https://remix.run/blog/react-router-v7)

## Next Steps

1. **Immediate**: Update to v7.6.2 for security fix
2. **Short-term**: Migrate imports from react-router-dom
3. **Consider**: Implementing SSG for static pages
4. **Monitor**: Unstable middleware API for future features