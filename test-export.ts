#!/usr/bin/env bun

import { MoneyWorksRESTClient } from "./packages/core/src/rest/client";
import type { MoneyWorksConfig } from "./packages/core/src/rest/types";

const config: MoneyWorksConfig = {
  host: "localhost",
  port: 6710,
  username: "Admin", 
  password: "",
  dataFile: "Acme Widgets"
};

async function test() {
  try {
    const client = new MoneyWorksRESTClient(config);
    
    console.log("Testing XML export...");
    const result = await client.export("Name", {
      format: "xml-verbose",
      limit: 1
    });
    
    console.log("\nResult type:", typeof result);
    if (typeof result === "string") {
      console.log("XML output (first 500 chars):");
      console.log(result.substring(0, 500));
    } else {
      console.log("JSON output:");
      console.log(JSON.stringify(result, null, 2));
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

test();