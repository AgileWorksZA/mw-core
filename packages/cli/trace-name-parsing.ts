#!/usr/bin/env bun
/**
 * Trace through the Name table parsing issue step by step
 */

import { parseStringPromise } from "xml2js";

// Simulated XML responses we might get from MoneyWorks
const testCases = [
  {
    name: "Test 1: Direct name structure",
    xml: `<?xml version="1.0"?>
<name>
  <Code>CUST001</Code>
  <Name>John Doe</Name>
  <Phone>555-1234</Phone>
</name>`
  },
  {
    name: "Test 2: Export/table structure",
    xml: `<?xml version="1.0"?>
<export>
  <table name="Name">
    <name>
      <Code>CUST001</Code>
      <Name>John Doe</Name>
      <Phone>555-1234</Phone>
    </name>
  </table>
</export>`
  },
  {
    name: "Test 3: Table with lowercase name",
    xml: `<?xml version="1.0"?>
<table>
  <name>
    <Code>CUST001</Code>
    <Name>John Doe</Name>
    <Phone>555-1234</Phone>
  </name>
</table>`
  },
  {
    name: "Test 4: Names plural structure",
    xml: `<?xml version="1.0"?>
<names>
  <name>
    <Code>CUST001</Code>
    <Name>John Doe</Name>
    <Phone>555-1234</Phone>
  </name>
</names>`
  },
  {
    name: "Test 5: String value instead of object",
    xml: `<?xml version="1.0"?>
<export>
  <table>Name</table>
</export>`
  }
];

async function traceExtractRecords(parsed: any, table: string) {
  console.log(`\nTracing extractRecords for table: "${table}"`);
  console.log("Parsed object:", JSON.stringify(parsed, null, 2));
  
  // Simulate the extractRecords logic from parser.ts
  
  // Structure 1: <table><record>...</record></table>
  if (parsed.table?.[table.toLowerCase()]) {
    console.log(`Found: parsed.table["${table.toLowerCase()}"]`);
    const tableData = parsed.table[table.toLowerCase()];
    console.log("Table data:", tableData);
    console.log("Is array?", Array.isArray(tableData));
    return Array.isArray(tableData) ? tableData : [tableData];
  }

  // Structure 2: <export><table name="..."><record>...</record></table></export>
  if (parsed.export?.table) {
    console.log("Found: parsed.export.table");
    const tables = Array.isArray(parsed.export.table)
      ? parsed.export.table
      : [parsed.export.table];
    
    console.log("Tables:", tables);
    
    const targetTable = tables.find(
      (t: any) =>
        t.name === table ||
        t.name === table.toLowerCase(),
    );
    
    if (targetTable) {
      console.log("Found target table:", targetTable);
      const recordKey = table.toLowerCase();
      const records = targetTable[recordKey];
      console.log(`Records at key "${recordKey}":`, records);
      return Array.isArray(records)
        ? records
        : records
          ? [records]
          : [];
    }
  }

  // Structure 3: Direct records under root
  const rootKey = table.toLowerCase();
  if (parsed[rootKey]) {
    console.log(`Found: parsed["${rootKey}"]`);
    const data = parsed[rootKey];
    console.log("Data:", data);
    console.log("Type:", typeof data);
    
    // This is where the issue might be!
    if (typeof data === "string") {
      console.log("WARNING: Data is a string, not an object!");
      console.log("String value:", data);
      console.log("Split into characters:", [...data]);
    }
    
    return Array.isArray(data) ? data : [data];
  }

  // Structure 4: Records under plural form
  const pluralKey = `${rootKey}s`;
  const pluralData = parsed[pluralKey];
  if (pluralData && typeof pluralData === "object" && rootKey in pluralData) {
    console.log(`Found: parsed["${pluralKey}"]["${rootKey}"]`);
    const records = pluralData[rootKey];
    return Array.isArray(records) ? records : [records];
  }

  console.log("No records found");
  return [];
}

async function runTests() {
  for (const testCase of testCases) {
    console.log(`\n${"=".repeat(60)}`);
    console.log(testCase.name);
    console.log("=".repeat(60));
    console.log("XML:");
    console.log(testCase.xml);
    
    try {
      const parsed = await parseStringPromise(testCase.xml, {
        explicitArray: false,
        ignoreAttrs: false,
        mergeAttrs: false,
      });
      
      const records = await traceExtractRecords(parsed, "Name");
      console.log("\nExtracted records:", records);
      
      // Check if we got the problematic array
      if (Array.isArray(records) && records.length === 4 && 
          records[0] === "N" && records[1] === "a" && 
          records[2] === "m" && records[3] === "e") {
        console.log("\n⚠️  FOUND THE ISSUE! The string 'Name' was split into characters!");
      }
      
    } catch (error) {
      console.error("Error:", error);
    }
  }
}

runTests();