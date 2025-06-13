// Direct test to verify limit functionality
import { MoneyWorksRESTClient } from "./packages/core/src/rest/client";
import { writeFileSync } from "fs";

const client = new MoneyWorksRESTClient({
  host: "localhost",
  port: 6710,
  dataFile: "acme.moneyworks",
  username: "Herman Geldenhuys",
  password: ""
});

async function test() {
  console.log("Testing limit parameter...\n");
  
  // Test 1: Direct API call with curl (for comparison)
  console.log("1. Direct API response check:");
  const { exec } = require('child_process');
  const curlCmd = `curl -s "http://Herman%20Geldenhuys:@localhost:6710/REST/acme.moneyworks/export/table=transaction&limit=1&format=xml-verbose" | grep -E "count=|<transaction>" | head -5`;
  
  exec(curlCmd, (error: any, stdout: string) => {
    if (!error) {
      console.log("   Direct API response:", stdout.trim());
    }
  });
  
  // Wait a bit for curl to complete
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Test 2: Using the client
  console.log("\n2. Using MoneyWorksRESTClient:");
  
  try {
    const result = await client.export("Transaction", {
      limit: 1,
      format: "json"
    });
    
    if (Array.isArray(result)) {
      console.log(`   Result: ${result.length} records`);
      
      if (result.length === 1) {
        console.log("   ✅ SUCCESS: Client respects limit!");
        console.log("   First record:", {
          sequenceNumber: result[0].sequenceNumber,
          ourRef: result[0].ourRef,
          transDate: result[0].transDate,
          gross: result[0].gross
        });
      } else {
        console.log("   ❌ FAILED: Expected 1 record, got", result.length);
        
        // Save for debugging
        writeFileSync("debug-failed-limit.json", JSON.stringify(result, null, 2));
        console.log("\n   Full result saved to debug-failed-limit.json");
        console.log("   This suggests the parser is loading all records despite server returning only 1");
      }
    } else {
      console.log("   Result is not an array");
    }
  } catch (error: any) {
    console.error("   Error:", error.message);
  }
}

test().catch(console.error);