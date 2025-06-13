#!/usr/bin/env bun
// Trace through the exact issue
import { MoneyWorksRESTClient } from "./packages/core/src/rest/client";

// Patch fetch to log requests
const originalFetch = global.fetch;
let requestCount = 0;

global.fetch = async (url: any, options: any) => {
  requestCount++;
  console.log(`\n[REQUEST ${requestCount}] ${options?.method || 'GET'} ${url}`);
  
  const response = await originalFetch(url, options);
  const clonedResponse = response.clone();
  
  if (!response.ok) {
    console.log(`[RESPONSE ${requestCount}] Status: ${response.status}`);
    const text = await clonedResponse.text();
    console.log(`[RESPONSE ${requestCount}] Body: ${text.substring(0, 200)}`);
  } else {
    console.log(`[RESPONSE ${requestCount}] Status: ${response.status} OK`);
  }
  
  return response;
};

const client = new MoneyWorksRESTClient({
  host: "localhost",
  port: 6710,
  dataFile: "acme.moneyworks",
  username: "Herman Geldenhuys",
  password: ""
});

async function test() {
  console.log("=== Testing with invalid filter ===");
  
  try {
    const result = await client.export("Transaction", {
      format: "json",
      limit: 1,
      filter: "Amount > 1000"  // Invalid field
    });
    
    console.log("\nUnexpected success!");
    console.log("Result count:", Array.isArray(result) ? result.length : "not array");
    
  } catch (error: any) {
    console.log("\nCaught error:", error.message);
    console.log("Total requests made:", requestCount);
  }
}

test();