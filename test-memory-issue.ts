// Test if there's a memory issue when parsing
import { MoneyWorksRESTClient } from "./packages/core/src/rest/client";

const client = new MoneyWorksRESTClient({
  host: "localhost",
  port: 6710,
  dataFile: "acme.moneyworks",
  username: "Herman Geldenhuys",
  password: ""
});

async function test() {
  try {
    console.log("Testing with limit=1 and NO filter (should work)...");
    const result = await client.export("Transaction", {
      format: "json",
      limit: 1
    });
    
    console.log("Success! Got", Array.isArray(result) ? result.length : 0, "records");
    
    // Now test with the user's filter
    console.log("\nTesting with user's filter...");
    const result2 = await client.export("Transaction", {
      format: "json",
      limit: 1,
      filter: "TransDate >= '2024-01-01' and Amount > 1000"
    });
    
    console.log("Got", Array.isArray(result2) ? result2.length : 0, "records");
    
  } catch (error: any) {
    console.error("Error:", error.message);
  }
}

// Run with timeout to avoid hanging
const timeout = setTimeout(() => {
  console.error("\nTimeout! Process seems to be hanging...");
  process.exit(1);
}, 5000);

test().then(() => {
  clearTimeout(timeout);
  process.exit(0);
});