#!/bin/bash
set -e

echo "Building MoneyWorks packages for production..."

# Clean previous builds
echo "Cleaning previous builds..."
rm -rf packages/*/dist packages/*/tsconfig.tsbuildinfo

# Build utilities
echo "Building @moneyworks/utilities..."
cd packages/utilities
bun run build
cd ../..

# Build canonical (depends on utilities)
echo "Building @moneyworks/canonical..."
cd packages/canonical
bun run build
cd ../..

# Build data (depends on canonical and utilities)
echo "Building @moneyworks/data..."
cd packages/data
bun run build
cd ../..

echo "All packages built successfully!"