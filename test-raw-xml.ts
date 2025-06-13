import axios from "axios";
import { readFileSync, writeFileSync } from "fs";
import { buildDocumentPath } from "./packages/core/src/rest/auth";

// Load config
const configPath = "./mw-config.json";
const config = JSON.parse(readFileSync(configPath, "utf-8"));

// Build auth headers
const documentCredentials = `${config.username}:Document:${config.password}`;
const documentAuth = `Basic ${Buffer.from(documentCredentials).toString("base64")}`;

const folderCredentials = `${config.folderAuth.folderName}:Datacentre:${config.folderAuth.password}`;
const folderAuth = `Basic ${Buffer.from(folderCredentials).toString("base64")}`;

async function testRawXML() {
  const protocol = config.protocol || "http";
  const docPath = buildDocumentPath(config);
  
  // Test with limit=1
  const url1 = `${protocol}://${config.host}:${config.port}/REST/${docPath}/export/table=transaction&limit=1&format=xml-verbose`;
  
  console.log("Testing URL with limit=1:");
  console.log(url1);
  
  try {
    const response = await axios.get(url1, {
      headers: {
        Authorization: [folderAuth, documentAuth],
      },
      responseType: "text"
    });
    
    // Save raw response
    writeFileSync("test-raw-limit1.xml", response.data);
    console.log("\nSaved to test-raw-limit1.xml");
    
    // Check table attributes
    const tableMatch = response.data.match(/<table[^>]*>/);
    if (tableMatch) {
      console.log("\nTable element:", tableMatch[0]);
    }
    
    // Count transaction elements
    const transactionCount = (response.data.match(/<t>/g) || []).length;
    console.log("Transaction elements found:", transactionCount);
    
    // Show file size
    console.log("Response size:", response.data.length, "bytes");
    
  } catch (error) {
    console.error("Error:", error.message);
  }
  
  // Also test with limit=5 to compare
  console.log("\n\nTesting with limit=5 for comparison...");
  const url5 = `${protocol}://${config.host}:${config.port}/REST/${docPath}/export/table=transaction&limit=5&format=xml-verbose`;
  
  try {
    const response = await axios.get(url5, {
      headers: {
        Authorization: [folderAuth, documentAuth],
      },
      responseType: "text"
    });
    
    const transactionCount = (response.data.match(/<t>/g) || []).length;
    console.log("Transaction elements with limit=5:", transactionCount);
    
    // Check table attributes
    const tableMatch = response.data.match(/<table[^>]*>/);
    if (tableMatch) {
      console.log("Table element:", tableMatch[0]);
    }
    
  } catch (error) {
    console.error("Error:", error.message);
  }
}

testRawXML();