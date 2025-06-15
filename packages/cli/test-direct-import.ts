#!/usr/bin/env bun

// Test direct import to see what's happening
try {
  console.log("Testing imports...");
  
  // Test individual imports
  console.log("1. Importing from @moneyworks/core/rest...");
  const { MoneyWorksRESTClient } = await import("@moneyworks/core/rest");
  console.log("✓ REST client imported");
  
  console.log("\n2. Importing from @moneyworks/core...");
  const core = await import("@moneyworks/core");
  console.log("✓ Core imported");
  console.log("Available exports:", Object.keys(core));
  
} catch (error) {
  console.error("Import error:", error);
}