#!/usr/bin/env bun

import { MoneyWorksRESTClient } from "@moneyworks/core";

const config = {
  host: "localhost",
  port: 6710,
  username: "Admin",
  password: "",
  dataFile: "Acme Widgets"
};

async function test() {
  const client = new MoneyWorksRESTClient(config);
  
  console.log("Testing XML export...");
  
  // Test 1: Export with explicit xml-verbose format
  console.log("\n1. Testing explicit xml-verbose format:");
  const xmlResult = await client.export("Account", {
    format: "xml-verbose",
    limit: 1
  });
  
  console.log("Result type:", typeof xmlResult);
  if (typeof xmlResult === "string") {
    console.log("First 300 chars of XML:");
    console.log(xmlResult.substring(0, 300));
  } else {
    console.log("ERROR: Expected string, got:", xmlResult);
  }
  
  // Test 2: Export with JSON format (default)
  console.log("\n2. Testing JSON format (default):");
  const jsonResult = await client.export("Account", {
    limit: 1
  });
  
  console.log("Result type:", typeof jsonResult);
  console.log("Is array:", Array.isArray(jsonResult));
  if (Array.isArray(jsonResult)) {
    console.log("First record:", JSON.stringify(jsonResult[0], null, 2));
  }
  
  // Test 3: Export Name table with XML
  console.log("\n3. Testing Name table with xml-verbose:");
  const nameResult = await client.export("Name", {
    format: "xml-verbose",
    limit: 1
  });
  
  console.log("Result type:", typeof nameResult);
  if (typeof nameResult === "string") {
    console.log("First 300 chars of XML:");
    console.log(nameResult.substring(0, 300));
  }
}

test().catch(console.error);