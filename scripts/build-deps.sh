#!/bin/bash
set -e

echo "Building dependency packages..."

echo "Building @moneyworks/utilities..."
cd packages/utilities
bun run build
cd ../..

echo "Building @moneyworks/canonical..."
cd packages/canonical
bun run build
cd ../..

echo "Building @moneyworks/data..."
cd packages/data
bun run build
cd ../..

echo "All dependencies built successfully!"