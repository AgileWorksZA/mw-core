import { MoneyWorksRESTClient } from "./packages/core/src/rest/client";
import { readFileSync } from "fs";

const config = JSON.parse(readFileSync("./mw-config.json", "utf-8"));
const client = new MoneyWorksRESTClient(config);

async function test() {
  console.log("Testing CLI export with limit=1...\n");
  
  // Test 1: No filter
  console.log("Test 1: No filter");
  const result1 = await client.export("Transaction", {
    limit: 1,
    format: "json"
  });
  console.log(`Result: ${Array.isArray(result1) ? result1.length : 'not array'} records\n`);
  
  // Test 2: With working filter
  console.log("Test 2: With filter Gross > 1000");
  const result2 = await client.export("Transaction", {
    limit: 1,
    filter: "Gross > 1000",
    format: "json"
  });
  console.log(`Result: ${Array.isArray(result2) ? result2.length : 'not array'} records\n`);
  
  // Test 3: User's filter (will fail)
  console.log("Test 3: User's original filter");
  try {
    const result3 = await client.export("Transaction", {
      limit: 1,
      filter: "TransDate >= '2024-01-01' and Amount > 1000",
      format: "json"
    });
    console.log(`Result: ${Array.isArray(result3) ? result3.length : 'not array'} records`);
  } catch (error) {
    console.log("Error:", error.message);
    console.log("\nThe issue is that the filter syntax is incorrect:");
    console.log("1. 'Amount' should be 'Gross' (or another valid field)");
    console.log("2. Date format needs MoneyWorks syntax: {d'2024-01-01'}");
  }
}

test().catch(console.error);