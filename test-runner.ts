#!/usr/bin/env bun

import { $ } from "bun";

async function runTests() {
  console.log("🧪 Running tests for @moneyworks/core...\n");
  
  try {
    // Run the simple auth test first
    console.log("Running simple auth test...");
    const authTest = await $`cd packages/core && bun test src/rest/__tests__/auth-simple.test.ts`.text();
    console.log(authTest);
    
    // If that passes, run all tests
    console.log("\nRunning all tests...");
    const allTests = await $`cd packages/core && bun test`.text();
    console.log(allTests);
    
  } catch (error: any) {
    console.error("❌ Test failed:");
    console.error(error.stdout || error.message);
    if (error.stderr) {
      console.error("STDERR:", error.stderr);
    }
    process.exit(1);
  }
}

runTests();