#!/usr/bin/env bun

import { $ } from "bun";

async function runAllTests() {
  console.log("🧪 Running all tests for @moneyworks/core...\n");
  
  try {
    // Change to core package directory
    process.chdir("packages/core");
    
    // Run all tests
    const result = await $`bun test`.text();
    console.log(result);
    
    // Also show a summary
    const lines = result.split('\n');
    const testLine = lines.find(line => line.includes('test files'));
    const passLine = lines.find(line => line.includes('pass'));
    const failLine = lines.find(line => line.includes('fail'));
    
    console.log("\n📊 Test Summary:");
    if (testLine) console.log(`   ${testLine.trim()}`);
    if (passLine) console.log(`   ✅ ${passLine.trim()}`);
    if (failLine) console.log(`   ❌ ${failLine.trim()}`);
    
  } catch (error: any) {
    console.error("❌ Tests failed:");
    console.error(error.stdout || error.message);
    if (error.stderr) {
      console.error("STDERR:", error.stderr);
    }
    process.exit(1);
  }
}

runAllTests();