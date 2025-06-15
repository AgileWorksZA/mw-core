import { MoneyWorksRESTClient } from "./packages/core/src/rest/client";
import { readFileSync } from "fs";

// Load config
const configPath = "./mw-config.json";
const config = JSON.parse(readFileSync(configPath, "utf-8"));

// Enable debug to see URLs
config.debug = true;

// Create client and monkey-patch fetch to intercept URLs
const originalFetch = global.fetch;
let capturedUrl = "";

global.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
  capturedUrl = String(input);
  console.log("\n🎯 ACTUAL URL BEING CALLED:");
  console.log(capturedUrl);
  
  // Parse URL to show components
  try {
    const url = new URL(capturedUrl);
    console.log("\nURL Components:");
    console.log("  Protocol:", url.protocol);
    console.log("  Host:", url.host);
    console.log("  Pathname:", url.pathname);
    console.log("  Search:", url.search);
  } catch (e) {
    console.log("Could not parse URL");
  }
  
  // Don't actually make the request
  throw new Error("Intercepted for debugging");
};

async function testUrl() {
  const client = new MoneyWorksRESTClient(config);
  
  try {
    await client.export("Transaction", {
      limit: 1,
      filter: "TransDate >= '2024-01-01'",
      format: "json"
    });
  } catch (error) {
    // Expected - we're intercepting
  }
  
  console.log("\n\nExpected URL format per MoneyWorks docs:");
  console.log("http://server:port/REST/document/export/table=transaction&limit=1&format=xml-verbose");
  
  console.log("\n\nChecking if limit parameter is in the URL:");
  if (capturedUrl.includes("limit=1")) {
    console.log("✅ limit=1 is in the URL");
  } else {
    console.log("❌ limit=1 is NOT in the URL!");
  }
}

testUrl();