#!/usr/bin/env bun
/**
 * Test script to debug Name table XML parsing issue
 * 
 * This script:
 * 1. Makes a raw HTTP request to get the XML response
 * 2. Logs the raw XML to see what MoneyWorks returns
 * 3. Traces through the parsing logic step by step
 */

import { createConnection } from "@moneyworks/core";

// Test configuration
const config = {
  host: "localhost",
  port: 6710,
  username: "Admin",
  password: "Datafile",
  dataFile: "Acme Gold",
};

async function testRawXMLResponse() {
  console.log("=== Testing Raw XML Response for Name Table ===\n");

  // Create a raw HTTP request to see what MoneyWorks returns
  const auth = Buffer.from(`${config.username}:${config.password}`).toString("base64");
  const url = `http://${config.host}:${config.port}/REST/${encodeURIComponent(config.dataFile)}/Name`;
  
  console.log("Request URL:", url);
  console.log("Auth header:", `Basic ${auth}`);
  console.log("\n");

  try {
    // Make raw fetch request
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Authorization": `Basic ${auth}`,
        "Accept": "text/xml",
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    if (!response.ok) {
      console.error("HTTP Error:", response.status, response.statusText);
      const text = await response.text();
      console.error("Response body:", text);
      return;
    }

    const xmlText = await response.text();
    console.log("=== Raw XML Response ===");
    console.log(xmlText);
    console.log("\n");

    // Now let's parse it step by step
    console.log("=== Parsing XML Step by Step ===\n");

    // Use xml2js directly to see what it produces
    const { parseStringPromise } = await import("xml2js");
    
    const parsed = await parseStringPromise(xmlText, {
      explicitArray: false,
      ignoreAttrs: false,
      mergeAttrs: false,
    });

    console.log("Parsed object structure:");
    console.log(JSON.stringify(parsed, null, 2));
    console.log("\n");

    // Check what keys are in the parsed object
    console.log("Top-level keys:", Object.keys(parsed));
    
    // If there's an export key, check its structure
    if (parsed.export) {
      console.log("Export keys:", Object.keys(parsed.export));
      if (parsed.export.table) {
        console.log("Table structure:", parsed.export.table);
        if (Array.isArray(parsed.export.table)) {
          console.log("Table is an array with", parsed.export.table.length, "elements");
          parsed.export.table.forEach((t: any, i: number) => {
            console.log(`Table ${i}:`, t);
          });
        }
      }
    }

    // If there's a table key at root
    if (parsed.table) {
      console.log("Root table keys:", Object.keys(parsed.table));
    }

    // Check for direct name key
    if (parsed.name) {
      console.log("Direct name value:", parsed.name);
      console.log("Type of name:", typeof parsed.name);
      if (Array.isArray(parsed.name)) {
        console.log("Name is an array:", parsed.name);
      }
    }

    // Check for names key
    if (parsed.names) {
      console.log("Names structure:", parsed.names);
    }

  } catch (error) {
    console.error("Error:", error);
  }
}

async function testWithCoreLibrary() {
  console.log("\n\n=== Testing with Core Library ===\n");

  try {
    const connection = createConnection(config);
    
    // Test with verbose format
    console.log("Testing with xml-verbose format:");
    const verboseResult = await connection.export("Name", {
      format: "xml-verbose",
      limit: 2,
    });
    console.log("Verbose result:", verboseResult);
    console.log("\n");

    // Test with terse format
    console.log("Testing with xml-terse format:");
    const terseResult = await connection.export("Name", {
      format: "xml-terse", 
      limit: 2,
    });
    console.log("Terse result:", terseResult);

  } catch (error) {
    console.error("Core library error:", error);
  }
}

// Run tests
async function main() {
  await testRawXMLResponse();
  await testWithCoreLibrary();
}

main().catch(console.error);