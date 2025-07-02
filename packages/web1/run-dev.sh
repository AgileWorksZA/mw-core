#!/bin/bash

echo "Starting Web1 Dev Server..."
echo ""
echo "NOTE: Due to workspace dependency conflicts, we're running vite directly."
echo "The dev server will start on http://localhost:3001"
echo ""

# Backup vite config temporarily
mv vite.config.ts vite.config.ts.bak 2>/dev/null

# Start vite
echo "Starting Vite dev server..."
vite --port 3001

# Restore config on exit
trap "mv vite.config.ts.bak vite.config.ts 2>/dev/null" EXIT