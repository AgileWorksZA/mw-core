#!/usr/bin/env bun
/**
 * Test edge cases for Name table parsing
 */

import { parseXML } from "@moneyworks/core/src/xml/parser";

// Test various XML structures that might cause issues
const testCases = [
  {
    name: "Empty Name table",
    xml: `<?xml version="1.0"?><names></names>`,
  },
  {
    name: "Name as string value",
    xml: `<?xml version="1.0"?><name>Name</name>`,
  },
  {
    name: "Export with string table",
    xml: `<?xml version="1.0"?><export><table>Name</table></export>`,
  },
  {
    name: "Valid single record",
    xml: `<?xml version="1.0"?>
<name>
  <Code>TEST</Code>
  <Name>Test Name</Name>
</name>`,
  },
  {
    name: "Valid multiple records",
    xml: `<?xml version="1.0"?>
<names>
  <name>
    <Code>TEST1</Code>
    <Name>Test One</Name>
  </name>
  <name>
    <Code>TEST2</Code>
    <Name>Test Two</Name>
  </name>
</names>`,
  },
  {
    name: "MoneyWorks attribute format",
    xml: `<?xml version="1.0"?>
<name>
  <Code _="TEST"/>
  <Name _="Test Name"/>
</name>`,
  },
];

async function runTests() {
  console.log("=== Testing Name Table Edge Cases ===\n");
  
  for (const testCase of testCases) {
    console.log(`Test: ${testCase.name}`);
    console.log(`XML: ${testCase.xml.replace(/\n/g, " ").substring(0, 100)}...`);
    
    try {
      const result = await parseXML(testCase.xml, "Name", "xml-terse");
      
      console.log(`Result: ${JSON.stringify(result)}`);
      
      // Check for the bug
      if (Array.isArray(result) && result.length === 4 &&
          result[0] === "N" && result[1] === "a" && 
          result[2] === "m" && result[3] === "e") {
        console.log("❌ BUG DETECTED: String 'Name' was split into characters!");
      } else if (Array.isArray(result) && result.length === 0) {
        console.log("✅ Correctly returned empty array for malformed XML");
      } else if (Array.isArray(result) && result.length > 0 && typeof result[0] === "object") {
        console.log("✅ Successfully parsed records");
      }
      
    } catch (error) {
      console.log(`Error: ${error instanceof Error ? error.message : error}`);
    }
    
    console.log("---\n");
  }
}

runTests();