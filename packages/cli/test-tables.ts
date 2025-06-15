#!/usr/bin/env bun

import { MoneyWorksRESTClient } from "@moneyworks/core";

const config = {
  host: "localhost",
  port: 6710,
  username: "Admin",
  password: "",
  dataFile: "Acme Widgets",
  debug: false
};

async function testTable(tableName: string) {
  const client = new MoneyWorksRESTClient(config);
  
  console.log(`\nTesting ${tableName}:`);
  try {
    const result = await client.export(tableName as any, {
      format: "xml-verbose",
      limit: 1
    });
    
    console.log("- Type:", typeof result);
    console.log("- Is string:", typeof result === "string");
    if (typeof result === "string") {
      console.log("- Starts with '<':", result.trim().startsWith("<"));
      console.log("- First 100 chars:", result.substring(0, 100).replace(/\n/g, "\\n"));
    } else {
      console.log("- Is array:", Array.isArray(result));
      console.log("- Length:", Array.isArray(result) ? result.length : "N/A");
    }
  } catch (error) {
    console.log("- ERROR:", error instanceof Error ? error.message : error);
  }
}

async function test() {
  // Test various table names
  await testTable("Name");
  await testTable("Account");
  await testTable("Transaction");
  await testTable("Product");
}

test().catch(console.error);