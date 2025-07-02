#!/bin/bash

echo "Starting web1 development server..."

# Install dependencies first
echo "Installing dependencies..."
cd /Users/hgeldenhuys/WebstormProjects/mw-core/packages/web1

# Create a temporary package.json without workspace
cat > temp-package.json << 'EOF'
{
  "name": "moneyworks-web1-temp",
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "@tanstack/react-query": "^5.51.11",
    "lucide-react": "^0.408.0",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.1",
    "autoprefixer": "^10.4.19",
    "postcss": "^8.4.39",
    "tailwindcss": "^3.4.4",
    "typescript": "^5.5.3",
    "vite": "^5.3.3"
  }
}
EOF

# Backup original and use temp
mv package.json package.json.bak
mv temp-package.json package.json

# Clean and install
rm -rf node_modules bun.lockb
/Users/hgeldenhuys/.bun/bin/bun install

# Restore original
mv package.json temp-package.json
mv package.json.bak package.json

echo "Dependencies installed. Starting dev server..."
/Users/hgeldenhuys/.bun/bin/bunx vite --port 3001