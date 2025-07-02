#!/bin/bash

cd /Users/hgeldenhuys/WebstormProjects/mw-core/packages/web1

echo "🧹 Cleaning up..."
rm -rf node_modules bun.lockb package-lock.json yarn.lock

echo "📦 Installing dependencies..."
/Users/hgeldenhuys/.bun/bin/bun install

echo "✅ Installation complete"