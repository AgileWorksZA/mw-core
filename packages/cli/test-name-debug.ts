#!/usr/bin/env bun
/**
 * Debug test for Name table parsing issue
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

async function testNameExport() {
  try {
    const connection = createConnection(config);
    
    // Get raw XML string
    console.log("=== Getting raw XML from MoneyWorks ===");
    const xmlString = await connection.export("Name", {
      format: "xml-terse",
      limit: 1,
    });

    console.log("Raw XML response:");
    console.log(xmlString);
    console.log("\n");

    // Parse it manually to see structure
    console.log("=== Parsing XML manually ===");
    const parsed = await parseStringPromise(xmlString, {
      explicitArray: false,
      ignoreAttrs: false,
      mergeAttrs: false,
    });

    console.log("Parsed structure:");
    console.log(JSON.stringify(parsed, null, 2));
    console.log("\n");

    // Try to get actual records using the library
    console.log("=== Using library parser (should return JSON) ===");
    const records = await connection.export("Name", {
      format: "json", // This will parse XML to JSON internally
      limit: 1,
    });

    console.log("Parsed records:");
    console.log(JSON.stringify(records, null, 2));
    console.log("\n");

    // Check if it's returning characters
    if (Array.isArray(records) && records.length > 0) {
      const firstRecord = records[0];
      console.log("First record type:", typeof firstRecord);
      console.log("First record:", firstRecord);
      
      // If it's a string split into characters, it would look like ["N", "a", "m", "e"]
      if (typeof firstRecord === "string") {
        console.log("ERROR: First record is a string, not an object!");
        console.log("String value:", firstRecord);
        console.log("Characters:", [...firstRecord]);
      }
    }

  } catch (error) {
    console.error("Error:", error);
  }
}

testNameExport();