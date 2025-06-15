#!/usr/bin/env bun
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
  console.log("Testing export with limit=1...\n");
  
  try {
    const result = await client.export("Transaction", {
      format: "json",
      limit: 1
    });
    
    if (Array.isArray(result)) {
      console.log(`\nResult: ${result.length} records`);
      if (result.length === 1) {
        console.log("✅ SUCCESS: Limit works correctly!");
        console.log("\nFirst record:");
        console.log(JSON.stringify(result[0], null, 2));
      } else {
        console.log("❌ FAILED: Expected 1 record");
      }
    } else {
      console.log("Result is not an array:", typeof result);
    }
  } catch (error: any) {
    console.error("Error:", error.message);
    if (error.stack) {
      console.error("\nStack trace:");
      console.error(error.stack);
    }
  }
}

test();