#!/usr/bin/env bun
// Test what happens with an invalid filter
import { MoneyWorksRESTClient } from "./packages/core/src/rest/client";

const client = new MoneyWorksRESTClient({
  host: "localhost",
  port: 6710,
  dataFile: "acme.moneyworks",
  username: "Herman Geldenhuys",
  password: "",
  debug: true
});

async function test() {
  console.log("Testing with INVALID filter (should get error)...\n");
  
  try {
    const result = await client.export("Transaction", {
      format: "json",
      limit: 1,
      filter: "Amount > 1000"  // Invalid field name
    });
    
    console.log("Unexpected success! Got", Array.isArray(result) ? result.length : 0, "records");
    console.log("This suggests the error is being ignored and all records returned");
    
  } catch (error: any) {
    console.log("✅ Got expected error:", error.message);
    console.log("Error code:", error.code);
  }
  
  console.log("\n\nTesting with VALID filter...\n");
  
  try {
    const result2 = await client.export("Transaction", {
      format: "json", 
      limit: 1,
      filter: "Gross > 1000"  // Valid field name
    });
    
    console.log("Success! Got", Array.isArray(result2) ? result2.length : 0, "records");
    
  } catch (error: any) {
    console.log("Error:", error.message);
  }
}

test();