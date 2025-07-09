# Railway Deployment Guide

This guide explains how to deploy MoneyWorks Core to Railway without Docker or builds.

## Overview

MoneyWorks Core runs directly from TypeScript using Bun, eliminating the need for build steps. Only the web frontend requires building for production.

## Prerequisites

- Railway account
- Environment variables configured in Railway
- Bun runtime (provided by Railway Nixpacks)

## Deployment Architecture

### TypeScript-First Approach
- All packages run directly from TypeScript source
- No transpilation or bundling needed for API/backend services
- Only web1 (React Router) requires a production build
- Bun handles TypeScript execution natively

### Separate Services

Deploy web and API as separate Railway services:

#### Web Service
```bash
# Use railway.web.json
railway up -c railway.web.json
```

#### API Service
```bash
# Use railway.api.json
railway up -c railway.api.json
```

## Environment Variables

### Web Service
```env
# Clerk Authentication
VITE_CLERK_PUBLISHABLE_KEY=your-key
CLERK_SECRET_KEY=your-secret

# API Connection
VITE_API_URL=https://your-api.railway.app

# Optional - Enable automation mode
VITE_AUTOMATION=false
```

### API Service
```env
# MoneyWorks Connection
MW_USERNAME=your-username
MW_PASSWORD=your-password
MW_DATAFILE=your-datafile
MW_HOSTNAME=your-hostname
MW_PORT=6710

# Server Config
PORT=3000
NODE_ENV=production
```

## Build Process

Since we run TypeScript directly:

1. **API Service**: No build needed - runs directly from TypeScript
2. **Web Service**: Only requires `bun --cwd packages/web1 build` for React Router production build

## Start Commands

- **Web**: `bun run start:web` (serves React Router build)
- **API**: `bun run start:api` (runs Elysia server)

## Package Resolution

All packages use TypeScript path mappings pointing to source files:
- `@moneyworks/data` → `packages/data/src/index.ts`
- `@moneyworks/canonical` → `packages/canonical/src/index.ts`
- `@moneyworks/utilities` → `packages/utilities/src/index.ts`

## Troubleshooting

### Import Errors

1. Ensure all tsconfig.json files have correct path mappings
2. Verify package.json exports point to .ts source files
3. Check that Bun is running (not Node.js)

### Runtime Issues

1. Check environment variables are set correctly
2. Verify MoneyWorks connection for API service
3. Check health endpoints:
   - API: `/api/v1/health`
   - Web: `/`

## Local Testing

Test the deployment locally:

```bash
# Test API (runs directly from TypeScript)
bun run start:api

# Build and test Web (in another terminal)
bun --cwd packages/web1 build
bun run start:web
```

## Railway CLI

Install Railway CLI:
```bash
curl -fsSL https://railway.app/install.sh | sh
```

Deploy:
```bash
railway login
railway link
railway up
```