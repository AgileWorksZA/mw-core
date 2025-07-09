# Authentication Flow Documentation

## Overview

The web1 application uses Clerk for authentication with a specific flow to ensure proper user experience.

## Routes and Their Behaviors

### 1. Index Route (`/`)
- **Purpose**: Entry point that determines where to redirect users
- **Behavior**:
  - Shows loading state while Clerk initializes
  - Redirects unauthenticated users to `/welcome`
  - Redirects authenticated users to `/dashboard`
  - Supports `?fresh=true` parameter to force welcome page

### 2. Welcome Route (`/welcome`)
- **Purpose**: Landing page that shows appropriate options based on auth state
- **Behavior**:
  - For authenticated users: Shows welcome message with options to continue or sign out
  - For unauthenticated users: Shows sign in button
  - No automatic redirects - user must click to proceed

### 3. Sign In Route (`/sign-in`)
- **Purpose**: Clerk sign-in page
- **Behavior**:
  - Shows Clerk sign-in component
  - After successful sign-in, redirects to `/dashboard`
  - Respects `isLoggedOut` session flag to prevent auto-redirect

### 4. Dashboard Route (`/dashboard`)
- **Purpose**: Main authenticated area
- **Behavior**:
  - Protected by `AuthGuard` with `requireConnection={true}`
  - Redirects to `/onboarding` if user has no MoneyWorks connections
  - Shows main dashboard if user has connections

### 5. Onboarding Route (`/onboarding`)
- **Purpose**: First-time setup for MoneyWorks connection
- **Behavior**:
  - Protected by `AuthGuard` (requires authentication)
  - Guides user through setting up their first connection
  - Redirects to `/dashboard` after successful setup

## Authentication Flow for New Users

1. User visits https://app.moneyworks.ai/
2. Index route checks authentication state
3. If not authenticated → Redirect to `/welcome`
4. Welcome page shows "Sign In" button
5. User clicks "Sign In" → Goes to `/sign-in`
6. User authenticates with Clerk
7. Clerk redirects to `/dashboard`
8. Dashboard checks for connections
9. If no connections → Redirect to `/onboarding`
10. User sets up first connection
11. Success → Redirect to `/dashboard`

## Authentication Flow for Returning Users

1. User visits https://app.moneyworks.ai/
2. Index route checks authentication state
3. If authenticated → Redirect to `/dashboard`
4. Dashboard loads with existing connections

## Key Components

### AuthGuard Component
- Wraps protected routes
- Checks authentication state
- Optional `requireConnection` prop for routes that need MW connection
- Handles loading states gracefully

### useAuth Hook
- Wraps Clerk's useAuth with automation mode support
- Provides consistent auth interface
- Handles sign out with proper cleanup

## Troubleshooting

### User sees onboarding instead of login
This happens when:
1. User has an existing Clerk session (authenticated)
2. But has no MoneyWorks connections set up
3. Dashboard redirects to onboarding

**Solution**: Visit `/welcome` or sign out first to see login options.

### User stuck in redirect loop
- Check browser console for errors
- Ensure environment variables are set correctly
- Clear browser cookies/storage and try again

## Testing Authentication States

Visit these routes to test different states:
- `/debug-auth` - Shows current auth state and connections
- `/welcome` - Landing page with auth-aware content
- `/?fresh=true` - Force fresh visit behavior