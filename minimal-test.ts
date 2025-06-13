#!/usr/bin/env bun
// Minimal test - bypass CLI entirely
import { buildRESTUrl } from "./packages/core/src/rest/auth";

const config = {
  host: "localhost",
  port: 6710,
  dataFile: "acme.moneyworks",
  username: "Herman Geldenhuys",
  password: ""
};

// Test 1: Direct fetch with limit
console.log("Test 1: Fetching with limit=1...");
const url1 = buildRESTUrl(config, "/export/table=Transaction&limit=1&format=xml-verbose");
console.log("URL:", url1);

const response1 = await fetch(url1);
const xml1 = await response1.text();

// Count records in response
const recordCount1 = (xml1.match(/<transaction>/g) || []).length;
console.log("Records in response:", recordCount1);
console.log("First 500 chars:", xml1.substring(0, 500));

console.log("\n" + "=".repeat(50) + "\n");

// Test 2: With the problematic filter
console.log("Test 2: With user's filter...");
const filter = encodeURIComponent("TransDate >= '2024-01-01' and Amount > 1000");
const url2 = buildRESTUrl(config, `/export/table=Transaction&search=${filter}&limit=1&format=xml-verbose`);
console.log("URL:", url2);

try {
  const response2 = await fetch(url2);
  console.log("Status:", response2.status, response2.statusText);
  
  if (!response2.ok) {
    const error = await response2.text();
    console.log("Error response:", error);
  } else {
    const xml2 = await response2.text();
    const recordCount2 = (xml2.match(/<transaction>/g) || []).length;
    console.log("Records in response:", recordCount2);
  }
} catch (e: any) {
  console.log("Fetch error:", e.message);
}

console.log("\n✅ Direct API test complete");