#!/bin/bash

echo "Running MoneyWorks NOW Integration Tests..."
echo "=========================================="

# Ensure we're using Bun runtime
export BUN_RUNTIME=1

# Run the tests
bun test test/moneyworks-now.test.ts --timeout 30000

echo ""
echo "Test run complete!"