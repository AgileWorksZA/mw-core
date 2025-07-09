# Railway Deployment Guide

This guide explains how to deploy MoneyWorks Core to Railway without Docker.

## Prerequisites

- Railway account
- Environment variables configured in Railway

## Deployment Options

### Option 1: Single Service (Web + API)

Use the default `railway.json` configuration which runs both services.

```bash
# Railway will use railway.json by default
railway up
```

### Option 2: Separate Services

Deploy web and API as separate Railway services for better scaling:

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

## Build Commands

The build process uses Bun and TypeScript:

1. **Dependencies Build**: `bun run build:deps`
   - Builds utilities → canonical → data packages in order

2. **API Build**: `bun run build:api`
   - Builds dependencies first, then API

3. **Web Build**: `bun run build:all`
   - Builds dependencies first, then web1

## Start Commands

- **Web**: `bun run start:web` (serves React Router build)
- **API**: `bun run start:api` (runs Elysia server)

## Nixpacks Configuration

The `nixpacks.toml` file ensures Bun is available in the Railway environment.

## Troubleshooting

### Build Failures

1. Check that all TypeScript packages build successfully:
   ```bash
   bun run build:deps
   ```

2. Verify no path mapping issues in production builds

3. Ensure all internal package imports use relative paths

### Runtime Issues

1. Check environment variables are set correctly
2. Verify MoneyWorks connection for API service
3. Check health endpoints:
   - API: `/api/v1/health`
   - Web: `/`

### TypeScript Errors

Production builds use `tsconfig.build.json` files which:
- Disable path mappings
- Use relative imports
- Exclude test files
- Generate declaration files

## Local Testing

Test the production build locally:

```bash
# Build everything
bun run build:all

# Test API
bun run start:api

# Test Web (in another terminal)
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