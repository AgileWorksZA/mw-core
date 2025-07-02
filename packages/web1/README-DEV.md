# Web1 Development Instructions

## Current Status

The web1 package has dependency conflicts due to the monorepo workspace setup. Other packages (web2, web3) have conflicting dependency versions that prevent clean installation.

## How to Run the Dev Server

### Option 1: Use the provided script (Recommended)
```bash
./run-dev.sh
```

This will:
1. Temporarily rename vite.config.ts to avoid React Router dependencies
2. Start vite dev server on port 3001
3. Restore the config when you exit

### Option 2: Manual steps
```bash
# 1. Rename the vite config temporarily
mv vite.config.ts vite.config.ts.bak

# 2. Run vite (assuming it's installed globally)
vite --port 3001

# 3. Open http://localhost:3001/index-cdn.html in your browser

# 4. When done, restore the config
mv vite.config.ts.bak vite.config.ts
```

## Available Test Files

- `/index-cdn.html` - Working React app using CDN (no build required)
- `/test-standalone.html` - Standalone HTML test file
- `/main.tsx` - React component (requires dependencies to work)

## API Endpoints

Make sure the API server is running on port 3000:
```bash
cd packages/api
bun dev
```

## Known Issues

1. **Dependency conflicts**: `@clerk/react`, `tailwindcss`, `isbot`, and `tailwind-merge` have version conflicts from other workspace packages
2. **React Router 7**: The full React Router setup requires dependencies that conflict with the workspace
3. **Bun workspace**: The monorepo setup causes bun to try installing all workspace dependencies

## Solution

For now, use the CDN-based HTML files or run vite without the React Router config. A proper fix would require:
- Separate the web packages into independent projects, OR
- Align all dependency versions across web1, web2, and web3, OR
- Use a different package manager setup that isolates workspace dependencies better