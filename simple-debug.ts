#!/usr/bin/env bun

console.log("Script started");

try {
  console.log("About to import...");
  const { MoneyWorksRESTClient } = await import("./packages/core/src/rest/client");
  console.log("Import successful");
  
  console.log("Creating client...");
  const client = new MoneyWorksRESTClient({
    host: "localhost",
    port: 6710,
    dataFile: "acme.moneyworks",
    username: "Herman Geldenhuys",
    password: ""
  });
  console.log("Client created");
  
  console.log("Calling export...");
  const result = await client.export("Transaction", {
    format: "json",
    limit: 1
  });
  
  console.log("Export completed!");
  console.log("Result count:", Array.isArray(result) ? result.length : "not array");
  
} catch (error: any) {
  console.error("Error:", error.message);
}

process.exit(0);