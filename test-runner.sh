#!/bin/bash
cd packages/core
bun test --no-coverage > test-results.txt 2>&1
echo "Tests completed. Results saved to test-results.txt"
cat test-results.txt | grep -E "(pass|fail|error)" | tail -5