#!/usr/bin/env bun
/**
 * Debug the specific Name table parsing issue
 */

import { createConnection } from "@moneyworks/core";
import { parseStringPromise } from "xml2js";

const config = {
  host: "localhost", 
  port: 6710,
  username: "Admin",
  password: "Datafile", 
  dataFile: "Acme Gold",
};

async function debugNameParsing() {
  const connection = createConnection(config);
  
  try {
    // First, get the raw XML to see what MoneyWorks returns
    console.log("=== Getting raw XML response ===");
    const xmlString = await connection.export("Name", {
      format: "xml-terse",
      limit: 1,
    });
    
    console.log("Raw XML:");
    console.log(xmlString);
    console.log("\n");
    
    // Parse it manually to see the structure
    const parsed = await parseStringPromise(xmlString, {
      explicitArray: false,
      ignoreAttrs: false,
      mergeAttrs: false,
    });
    
    console.log("Parsed structure:");
    console.log(JSON.stringify(parsed, null, 2));
    console.log("\n");
    
    // Now let's trace through the extractRecords logic
    console.log("=== Tracing extractRecords logic ===");
    const table = "Name";
    
    // Check each possible structure
    console.log(`1. Checking parsed.table["${table.toLowerCase()}"]...`);
    if (parsed.table?.[table.toLowerCase()]) {
      console.log("   Found!", parsed.table[table.toLowerCase()]);
    } else {
      console.log("   Not found");
    }
    
    console.log(`\n2. Checking parsed.export.table...`);
    if (parsed.export?.table) {
      console.log("   Found export.table:", parsed.export.table);
      console.log("   Type:", typeof parsed.export.table);
      
      if (typeof parsed.export.table === "string") {
        console.log("   ⚠️  WARNING: export.table is a string, not an object!");
        console.log("   This might be causing the issue if the string is 'Name'");
      }
    } else {
      console.log("   Not found");
    }
    
    console.log(`\n3. Checking parsed["${table.toLowerCase()}"]...`);
    if (parsed[table.toLowerCase()]) {
      console.log("   Found!", parsed[table.toLowerCase()]);
      const data = parsed[table.toLowerCase()];
      console.log("   Type:", typeof data);
      
      if (typeof data === "string" && data === "Name") {
        console.log("   ⚠️  FOUND THE ISSUE!");
        console.log("   The parser is returning 'Name' as a string value");
        console.log("   When treated as an array, it becomes:", [...data]);
      }
    } else {
      console.log("   Not found");
    }
    
    // Now test with JSON format to see what the library returns
    console.log("\n=== Testing with JSON format ===");
    const jsonResult = await connection.export("Name", {
      format: "json",
      limit: 1,
    });
    
    console.log("JSON result:");
    console.log(JSON.stringify(jsonResult, null, 2));
    
    if (Array.isArray(jsonResult) && jsonResult.length === 4) {
      if (jsonResult[0] === "N" && jsonResult[1] === "a" && 
          jsonResult[2] === "m" && jsonResult[3] === "e") {
        console.log("\n⚠️  CONFIRMED: The library is returning ['N', 'a', 'm', 'e']!");
        console.log("This happens when the XML contains a string 'Name' that gets split.");
      }
    }
    
  } catch (error) {
    console.error("Error:", error);
    
    // Check if it's an authentication or connection error
    if (error instanceof Error) {
      console.error("\nError details:");
      console.error("Message:", error.message);
      
      // This might help identify if MoneyWorks is returning an error XML
      if (error.message.includes("parse") || error.message.includes("XML")) {
        console.error("\nThis might be a parsing error. The XML response might be malformed.");
      }
    }
  }
}

debugNameParsing();