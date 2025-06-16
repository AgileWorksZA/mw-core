#!/usr/bin/env bun

import { $ } from "bun";
import { promises as fs } from "fs";

async function runTests() {
  console.log("🧪 Running tests for @moneyworks/core...\n");
  
  try {
    // Change to core package directory
    process.chdir("packages/core");
    
    // Run all tests and capture output
    const result = await $`bun test --no-coverage`.quiet().text();
    
    // Write the output to a file for analysis
    await fs.writeFile("test-output.txt", result);
    
    // Count pass/fail
    const lines = result.split('\n');
    const summary = lines.find(line => line.includes('pass') && line.includes('fail'));
    
    console.log("Test Results:");
    console.log(summary || "No summary found");
    
    return result;
  } catch (error: any) {
    // Even if tests fail, we want the output
    const output = error.stdout || error.message;
    await fs.writeFile("test-output.txt", output);
    
    console.log("Test run completed with failures");
    return output;
  }
}

runTests().then(() => {
  console.log("\nTest output saved to test-output.txt");
});