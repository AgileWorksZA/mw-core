# MCP Workspace Alignment Fix

## Issue
The MCP bun-scripts tool was failing to recognize the web package because:
- The package name in `packages/web/package.json` was `"openapi-client"`
- The MCP tool expected it to be `"@moneyworks/web"` to match the monorepo convention

## Solution Applied

1. **Updated package name** in `packages/web/package.json`:
   ```json
   {
     "name": "@moneyworks/web",  // Changed from "openapi-client"
     ...
   }
   ```

2. **Added web scripts** to root `package.json`:
   ```json
   {
     "scripts": {
       "dev:web": "bun --cwd packages/web dev",
       "build:web": "bun --cwd packages/web build",
       // Also added build:web to the build script chain
     }
   }
   ```

3. **Updated README.md** to include web development instructions

## Usage

Now you can use either method to start the web app:

### Via MCP Tool:
```bash
# In Claude Code
mcp__bun-scripts__run_script scriptName="dev" workspace="@moneyworks/web"
```

### Via Command Line:
```bash
# From project root
bun run dev:web
```

## Benefits
- Consistent workspace naming across the monorepo
- MCP tools work on first attempt
- Simplified developer experience
- Better alignment with monorepo conventions