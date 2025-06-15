#!/usr/bin/env bun
/**
 * Simple test to isolate the Name table parsing issue
 */

// First, let's see what happens when we parse different XML structures
import { parseStringPromise } from "xml2js";

async function testXMLParsing() {
  // Test case that might be causing the issue
  const problemXML = `<?xml version="1.0"?>
<export>
  <table>Name</table>
</export>`;

  console.log("=== Testing Problem XML ===");
  console.log("XML:", problemXML);
  
  const parsed = await parseStringPromise(problemXML, {
    explicitArray: false,
    ignoreAttrs: false,
    mergeAttrs: false,
  });
  
  console.log("\nParsed:", JSON.stringify(parsed, null, 2));
  
  // Check what happens when we access parsed.export.table
  if (parsed.export?.table) {
    console.log("\nparsed.export.table:", parsed.export.table);
    console.log("Type:", typeof parsed.export.table);
    console.log("Is Array?", Array.isArray(parsed.export.table));
    
    // If it's a string "Name", and we treat it as an array...
    if (typeof parsed.export.table === "string") {
      console.log("\nIt's a string! Value:", parsed.export.table);
      // This would cause it to be split into characters if we do Array operations on it
      console.log("As array:", [...parsed.export.table]);
      console.log("This explains the ['N', 'a', 'm', 'e'] issue!");
    }
  }
}

// Now let's trace through the extractRecords logic with this case
async function simulateExtractRecords() {
  const problemXML = `<?xml version="1.0"?>
<export>
  <table>Name</table>
</export>`;

  const parsed = await parseStringPromise(problemXML, {
    explicitArray: false,
    ignoreAttrs: false,
    mergeAttrs: false,
  });
  
  console.log("\n\n=== Simulating extractRecords ===");
  const table = "Name";
  
  // This is the problematic code path from parser.ts
  if (parsed.export?.table) {
    console.log("Found parsed.export.table");
    
    // The bug is here - if table is a string "Name" instead of an object
    const tables = Array.isArray(parsed.export.table)
      ? parsed.export.table
      : [parsed.export.table];
    
    console.log("tables:", tables);
    console.log("tables is now:", JSON.stringify(tables));
    
    // Now it tries to find a table with name="Name"
    const targetTable = tables.find(
      (t: any) => t.name === table || t.name === table.toLowerCase()
    );
    
    console.log("targetTable:", targetTable);
    
    // If targetTable is undefined (because "Name" string doesn't have a .name property)
    // it falls through to other cases...
  }
  
  // Then it checks for direct records under root
  const rootKey = table.toLowerCase(); // "name"
  console.log("\nChecking parsed['" + rootKey + "']");
  
  if (parsed[rootKey]) {
    console.log("Found parsed." + rootKey + ":", parsed[rootKey]);
    // This won't match in our problem case
  }
  
  // The real issue might be that MoneyWorks is returning unexpected XML
  // when there's an error or when the table name is "Name"
}

testXMLParsing()
  .then(() => simulateExtractRecords())
  .catch(console.error);