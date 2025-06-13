#!/usr/bin/env bun

import { MoneyWorksRESTClient } from "./packages/core/src/rest/client";
import { readFileSync } from "fs";

const config = JSON.parse(readFileSync("./mw-config.json", "utf-8"));
config.debug = true;

const client = new MoneyWorksRESTClient(config);

async function testLimit() {
  console.log("=== Test 1: Export with limit=1 (no filter) ===");
  try {
    const result1 = await client.export("Transaction", {
      limit: 1,
      format: "json"
    });
    
    console.log("Result is array:", Array.isArray(result1));
    if (Array.isArray(result1)) {
      console.log("Number of records returned:", result1.length);
      if (result1.length === 1) {
        console.log("✅ SUCCESS: Limit working!");
      } else {
        console.log("❌ FAILED: Got", result1.length, "records");
      }
    }
  } catch (error) {
    console.error("Error:", error.message);
  }

  console.log("\n=== Test 2: Export with limit=1 and filter ===");
  try {
    const result2 = await client.export("Transaction", {
      filter: "Gross > 1000",
      limit: 1,
      format: "json"
    });
    
    if (Array.isArray(result2)) {
      console.log("Number of records returned:", result2.length);
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
}

testLimit().catch(console.error);