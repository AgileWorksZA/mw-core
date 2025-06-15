#!/usr/bin/env bun
/**
 * Test the Name table parsing fix
 */

import { createConnection } from "@moneyworks/core";

const config = {
  host: "localhost",
  port: 6710,
  username: "Admin",
  password: "Datafile",
  dataFile: "Acme Gold",
};

async function testNameFix() {
  const connection = createConnection(config);
  
  try {
    console.log("=== Testing Name table export after fix ===\n");
    
    // Test with JSON format (which uses XML internally)
    console.log("1. Testing with JSON format:");
    const jsonResult = await connection.export("Name", {
      format: "json",
      limit: 2,
    });
    
    console.log("Result type:", typeof jsonResult);
    console.log("Is array?", Array.isArray(jsonResult));
    
    if (Array.isArray(jsonResult)) {
      console.log("Number of records:", jsonResult.length);
      
      // Check if we got the character array bug
      if (jsonResult.length === 4 && 
          jsonResult[0] === "N" && jsonResult[1] === "a" && 
          jsonResult[2] === "m" && jsonResult[3] === "e") {
        console.log("❌ BUG STILL PRESENT: Got ['N', 'a', 'm', 'e']");
      } else if (jsonResult.length > 0) {
        console.log("✅ SUCCESS: Got proper records");
        console.log("First record:", jsonResult[0]);
      } else {
        console.log("⚠️  No records returned (might be empty or error)");
      }
    }
    
    // Test with TSV format as comparison
    console.log("\n2. Testing with TSV format:");
    const tsvResult = await connection.export("Name", {
      format: "tsv",
      limit: 2,
    });
    
    if (typeof tsvResult === "string") {
      const lines = tsvResult.trim().split("\n");
      console.log("TSV lines:", lines.length);
      if (lines.length > 0) {
        console.log("Headers:", lines[0]);
      }
    }
    
    // Test other tables to ensure we didn't break anything
    console.log("\n3. Testing Account table (sanity check):");
    const accounts = await connection.export("Account", {
      format: "json",
      limit: 2,
    });
    
    if (Array.isArray(accounts) && accounts.length > 0) {
      console.log("✅ Account export working:", accounts.length, "records");
    }
    
  } catch (error) {
    console.error("Error:", error);
    if (error instanceof Error) {
      console.error("Message:", error.message);
      console.error("Stack:", error.stack);
    }
  }
}

testNameFix();