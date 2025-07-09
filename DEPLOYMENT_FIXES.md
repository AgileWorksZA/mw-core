# Deployment Fixes Summary

## API Deployment Fix

### Issue
The API was failing with "Failed to load MoneyWorks config" error because it was trying to load `mw-config.json` which is no longer needed with token-based authentication.

### Solution
1. Fixed syntax errors in `app.ts` (unescaped backticks in Swagger description)
2. Updated `loadConfig` in data package to handle missing config gracefully
3. Added `MW_API_MODE=token-auth` environment variable to Railway config

### Changes Made
- Fixed `/packages/api/src/app.ts` - removed backticks from Swagger description
- Updated `/packages/data/src/config/index.ts` - added fallback for missing config
- Updated `railway.api.json` - added MW_API_MODE environment variable

## Web1 Authentication Flow Fix

### Issue
New users visiting https://app.moneyworks.ai/ were being redirected to `/onboarding` instead of seeing the login screen first.

### Root Cause
When users have an existing Clerk session (from a previous visit or another Clerk app), they appear authenticated immediately, causing:
1. Index route → Dashboard (authenticated)
2. Dashboard → Onboarding (no connections)

### Solution
Created a proper authentication flow:
1. Index route now always redirects unauthenticated users to `/welcome`
2. Welcome page shows appropriate options based on auth state
3. Added explicit auth state checking with delays

### Changes Made
- Updated `/packages/web1/app/routes/_index.tsx` - improved auth checking
- Created `/packages/web1/app/routes/welcome.tsx` - landing page
- Added `/packages/web1/app/routes/debug-auth.tsx` - for debugging auth state
- Updated ClerkProvider with `afterSignOutUrl`
- Created `AUTH_FLOW.md` documentation

## Testing Instructions

### Test API Deployment
```bash
# Set environment variable locally
MW_API_MODE=token-auth bun --cwd packages/api start

# Or test without config file
cd packages/api && MW_API_MODE=token-auth bun src/index.ts
```

### Test Web1 Authentication Flow
1. Clear all cookies/session for the domain
2. Visit https://app.moneyworks.ai/ in incognito mode
3. Should see welcome page with "Sign In" button
4. Click sign in → authenticate → dashboard → onboarding (if no connections)

### Debug Routes
- `/welcome` - Landing page (always accessible)
- `/debug-auth` - Shows current auth state
- `/?fresh=true` - Forces fresh visit behavior (deprecated)

## Environment Variables

### API (Railway)
```env
PORT=3000
API_ENCRYPTION_SECRET=your-secret-key
MW_API_MODE=token-auth
```

### Web1 (Railway)
```env
VITE_CLERK_PUBLISHABLE_KEY=your-clerk-key
CLERK_SECRET_KEY=your-clerk-secret
VITE_API_URL=https://your-api.railway.app
```

## Deployment Commands

```bash
# Deploy API
railway up -c railway.api.json

# Deploy Web
railway up -c railway.web.json
```