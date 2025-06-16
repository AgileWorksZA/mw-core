#!/bin/bash

# Script to run tests in the core package

cd packages/core

echo "Running unit tests for @moneyworks/core..."
echo "========================================"

# Run tests
bun test

# Check if tests passed
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ All tests passed!"
else
    echo ""
    echo "❌ Tests failed. Please fix the errors above."
    exit 1
fi