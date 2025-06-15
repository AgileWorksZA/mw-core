#!/usr/bin/env bun

import { MoneyWorksRESTClient } from "@moneyworks/core";

const config = {
  host: "localhost",
  port: 6710,
  username: "Admin",
  password: "",
  dataFile: "Acme Widgets",
  debug: true
};

async function test() {
  const client = new MoneyWorksRESTClient(config);
  
  console.log("Testing Name export with xml-verbose...");
  const result = await client.export("Name", {
    format: "xml-verbose",
    limit: 1
  });
  
  console.log("\nResult type:", typeof result);
  console.log("Is array:", Array.isArray(result));
  
  if (typeof result === "string") {
    console.log("\nRaw XML (first 1000 chars):");
    console.log(result.substring(0, 1000));
  } else {
    console.log("\nParsed result:");
    console.log(JSON.stringify(result, null, 2));
  }
}

test().catch(console.error);