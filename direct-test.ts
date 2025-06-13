#!/usr/bin/env bun
// Direct test bypassing CLI infrastructure
import { MoneyWorksRESTClient } from "./packages/core/src/rest/client";
import { writeFileSync } from "fs";

async function test() {
  const client = new MoneyWorksRESTClient({
    host: "localhost",
    port: 6710,
    dataFile: "acme.moneyworks",
    username: "Herman Geldenhuys",
    password: ""
  });

  try {
    console.log("Testing export with limit=1...");
    const result = await client.export("Transaction", {
      format: "json",
      limit: 1
    });
    
    if (Array.isArray(result)) {
      console.log(`Got ${result.length} records`);
      writeFileSync("direct-test-result.json", JSON.stringify(result, null, 2));
      console.log("Result saved to direct-test-result.json");
      
      if (result.length === 1) {
        console.log("✅ LIMIT WORKS CORRECTLY!");
      } else {
        console.log("❌ LIMIT NOT WORKING - got", result.length, "records instead of 1");
      }
    }
  } catch (error: any) {
    console.error("Error:", error.message);
  }
}

test();