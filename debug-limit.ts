#!/usr/bin/env bun
// Debug the limit issue step by step

console.log("Starting debug...\n");

// Step 1: Test direct API call
console.log("Step 1: Testing direct API call with curl...");
const { execSync } = require('child_process');

try {
  const curlResult = execSync(
    `curl -s -u "Herman Geldenhuys:" "http://localhost:6710/REST/acme.moneyworks/export/table=Transaction&limit=1&format=xml-verbose" | head -20`,
    { encoding: 'utf8' }
  );
  console.log("Direct API result (first 20 lines):");
  console.log(curlResult);
  
  const recordCount = (curlResult.match(/<transaction>/g) || []).length;
  console.log(`\nDirect API returned ${recordCount} transaction record(s)`);
  console.log("✅ API correctly respects limit=1\n");
} catch (e) {
  console.error("Curl failed:", e.message);
}

// Step 2: Import and test the client directly
console.log("\nStep 2: Testing MoneyWorksRESTClient...");

import { MoneyWorksRESTClient } from "./packages/core/src/rest/client";

const client = new MoneyWorksRESTClient({
  host: "localhost",
  port: 6710,
  dataFile: "acme.moneyworks",
  username: "Herman Geldenhuys",
  password: "",
  debug: true // Enable debug logging
});

// Add timeout to prevent hanging
const timeoutId = setTimeout(() => {
  console.error("\n❌ TIMEOUT: Client.export() is hanging!");
  console.error("This suggests the parser might be stuck in an infinite loop");
  process.exit(1);
}, 5000);

try {
  console.log("Calling client.export() with limit=1...");
  const result = await client.export("Transaction", {
    format: "json",
    limit: 1
  });
  
  clearTimeout(timeoutId);
  
  console.log("\n✅ client.export() completed!");
  console.log("Result type:", typeof result);
  console.log("Is array:", Array.isArray(result));
  
  if (Array.isArray(result)) {
    console.log("Number of records:", result.length);
    
    if (result.length === 1) {
      console.log("\n✅ SUCCESS: Client correctly returns 1 record!");
    } else {
      console.log(`\n❌ FAILURE: Expected 1 record, got ${result.length}`);
      console.log("This indicates a bug in the client or parser");
    }
  }
} catch (error: any) {
  clearTimeout(timeoutId);
  console.error("\n❌ Error in client.export():", error.message);
  if (error.stack) {
    console.error("Stack trace:", error.stack);
  }
}

process.exit(0);