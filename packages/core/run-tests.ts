#!/usr/bin/env bun

import { $ } from "bun";
import { join } from "path";

async function runTests() {
  console.log("Running unit tests for @moneyworks/core...");
  console.log("========================================");
  
  try {
    // Change to the correct directory
    process.chdir(join(import.meta.dir));
    
    // Run the tests
    const result = await $`bun test`.quiet();
    
    if (result.exitCode === 0) {
      console.log("\n✅ All tests passed!");
      console.log(result.stdout.toString());
    } else {
      console.log("\n❌ Tests failed:");
      console.log(result.stdout.toString());
      console.error(result.stderr.toString());
      process.exit(1);
    }
  } catch (error) {
    console.error("Error running tests:", error);
    process.exit(1);
  }
}

runTests();