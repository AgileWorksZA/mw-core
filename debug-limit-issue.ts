import { MoneyWorksRESTClient } from "./packages/core/src/rest/client";
import { readFileSync, writeFileSync } from "fs";
import axios from "axios";

// Load config
const configPath = "./mw-config.json";
const config = JSON.parse(readFileSync(configPath, "utf-8"));

// Enable debug
config.debug = true;

// Create client
const client = new MoneyWorksRESTClient(config);

// Monkey patch fetch to log URLs
const originalFetch = global.fetch;
global.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
  console.log("\n🔍 FETCH CALLED:");
  console.log("URL:", input);
  console.log("Method:", init?.method || "GET");
  
  const response = await originalFetch(input, init);
  const clonedResponse = response.clone();
  const text = await clonedResponse.text();
  
  console.log("Response status:", response.status);
  console.log("Response length:", text.length);
  
  // Count transaction elements
  const transactionCount = (text.match(/<t>/g) || []).length;
  console.log("Transaction elements found:", transactionCount);
  
  // Save raw response
  writeFileSync("debug-raw-response.xml", text);
  console.log("Raw response saved to debug-raw-response.xml");
  
  return response;
};

async function debugExport() {
  try {
    console.log("=== Testing MoneyWorks Export with limit=1 ===");
    
    const result = await client.export("Transaction", {
      limit: 1,
      filter: "TransDate >= '2024-01-01' and Amount > 1000",
      format: "json"
    });
    
    console.log("\n📊 RESULT:");
    console.log("Type:", typeof result);
    console.log("Is Array:", Array.isArray(result));
    
    if (Array.isArray(result)) {
      console.log("Length:", result.length);
      
      if (result.length > 1) {
        console.log("\n❌ ERROR: Got", result.length, "records when limit=1 was specified!");
        
        // Save the result
        writeFileSync("debug-result.json", JSON.stringify(result, null, 2));
        console.log("Result saved to debug-result.json");
        
        // Show first few records
        console.log("\nFirst 3 records:");
        result.slice(0, 3).forEach((r, i) => {
          console.log(`${i + 1}. Seq: ${r.sequenceNumber}, Ref: ${r.ourRef}, Date: ${r.transDate}`);
        });
      } else {
        console.log("\n✅ SUCCESS: Limit is working correctly!");
      }
    }
    
  } catch (error) {
    console.error("\n❌ ERROR:", error);
  }
}

// Also test direct HTTP request
async function testDirectRequest() {
  console.log("\n\n=== Testing Direct HTTP Request ===");
  
  const protocol = config.protocol || "http";
  const folderPathEncoded = encodeURIComponent(config.folderAuth.folderName).replace('/', '%2f');
  const docNameEncoded = encodeURIComponent(config.dataFile);
  
  // Build auth headers
  const documentCredentials = `${config.username}:Document:${config.password}`;
  const documentAuth = `Basic ${Buffer.from(documentCredentials).toString("base64")}`;
  
  const folderCredentials = `${config.folderAuth.folderName}:Datacentre:${config.folderAuth.password}`;
  const folderAuth = `Basic ${Buffer.from(folderCredentials).toString("base64")}`;
  
  const url = `${protocol}://${config.host}:${config.port}/REST/${folderPathEncoded}%2f${docNameEncoded}/export/table=transaction&search=${encodeURIComponent("TransDate >= '2024-01-01' and Amount > 1000")}&limit=1&format=xml-verbose`;
  
  console.log("Direct URL:", url);
  
  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: [folderAuth, documentAuth],
      },
      responseType: "text"
    });
    
    const transactionCount = (response.data.match(/<t>/g) || []).length;
    console.log("Direct request transaction count:", transactionCount);
    
    // Check the table attributes
    const tableMatch = response.data.match(/<table[^>]*>/);
    if (tableMatch) {
      console.log("Table element:", tableMatch[0]);
    }
    
    writeFileSync("debug-direct-response.xml", response.data);
    console.log("Direct response saved to debug-direct-response.xml");
    
  } catch (error) {
    console.error("Direct request error:", error.message);
  }
}

debugExport().then(() => testDirectRequest());