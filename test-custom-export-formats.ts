#!/usr/bin/env bun
// Test custom export formats with MWScript expressions

import { MoneyWorksRESTClient } from "./packages/core/src/rest/client";

const client = new MoneyWorksRESTClient({
  host: "localhost",
  port: 6710,
  dataFile: "acme.moneyworks",
  username: "Herman Geldenhuys",
  password: "",
  debug: true
});

async function testCustomFormats() {
  console.log("=== Testing Custom Export Formats ===\n");
  
  try {
    // Test 1: Simple template with field placeholders
    console.log("1. Simple Template Format:");
    const simpleTemplate = await client.export("Transaction", {
      format: { template: "[OurRef]\t[TransDate]\t[Description]\t[Gross]" },
      limit: 3
    });
    console.log("Result:", simpleTemplate);
    console.log("\n---\n");
    
    // Test 2: Template with MWScript expressions
    console.log("2. Template with MWScript Expressions:");
    const expressionTemplate = await client.export("Transaction", {
      format: { 
        template: "[OurRef] - [Description] | GST: [Gross * 0.15] | Net: [Gross - (Gross * 0.15)]" 
      },
      limit: 3,
      filter: "Gross > 0"
    });
    console.log("Result:", expressionTemplate);
    console.log("\n---\n");
    
    // Test 3: Template with MoneyWorks functions
    console.log("3. Template with MoneyWorks Functions:");
    const functionTemplate = await client.export("Transaction", {
      format: { 
        template: "Invoice: [OurRef] | Customer: [GetNameField([NameCode], \"Name\")] | Due: [DateAdd([TransDate], 30)]" 
      },
      limit: 3,
      filter: "NameCode != ''"
    });
    console.log("Result:", functionTemplate);
    console.log("\n---\n");
    
    // Test 4: Template with conditional logic
    console.log("4. Template with Conditional Logic:");
    const conditionalTemplate = await client.export("Transaction", {
      format: { 
        template: "[OurRef]: [If([Status] = 1, \"Posted\", \"Unposted\")] - Amount: [If([Gross] > 0, \"Income\", \"Expense\")]: $[Abs([Gross])]" 
      },
      limit: 5
    });
    console.log("Result:", conditionalTemplate);
    console.log("\n---\n");
    
    // Test 5: Complex template with mixed text and expressions
    console.log("5. Complex Template with Mixed Content:");
    const complexTemplate = await client.export("Transaction", {
      format: { 
        template: `Transaction Report
====================
Reference: [OurRef]
Date: [TransDate]
Description: [Upper([Description])]
Total: $[Gross]
GST Component: $[Gross * 0.15]
Net Amount: $[Gross - (Gross * 0.15)]
Status: [If([Status] = 1, "✓ Posted", "⚠ Pending")]
---` 
      },
      limit: 2
    });
    console.log("Result:", complexTemplate);
    console.log("\n---\n");
    
    // Test 6: Template with subfile details (if supported)
    console.log("6. Template with Subfile Details:");
    const subfileTemplate = await client.export("Transaction", {
      format: { 
        template: `[OurRef] - [Description]
Details:
{[Detail.Account]: [Detail.Description] - $[Detail.Gross]}
Total: $[Gross]
---` 
      },
      limit: 2,
      filter: "OurRef BEGINSWITH 'INV'"
    });
    console.log("Result:", subfileTemplate);
    console.log("\n---\n");
    
    // Test 7: Script format (if different from template)
    console.log("7. Script Format:");
    const scriptFormat = await client.export("Transaction", {
      format: { 
        script: "ExportTransaction" // Assuming this is a predefined script in MoneyWorks
      },
      limit: 3
    });
    console.log("Result:", scriptFormat);
    
  } catch (error) {
    console.error("Error testing custom formats:", error);
  }
}

// Test field name discovery
async function testFieldDiscovery() {
  console.log("\n=== Testing Field Discovery ===\n");
  
  try {
    // Use evaluate to get field information
    const fields = await client.evaluate("GetDatabaseFields(\"Transaction\")");
    console.log("Transaction fields:", fields);
    
    // Test specific field info
    const fieldInfo = await client.evaluate("GetDatabaseFieldSize(\"Transaction\", \"OurRef\")");
    console.log("OurRef field info:", fieldInfo);
    
  } catch (error) {
    console.error("Error in field discovery:", error);
  }
}

// Run tests
async function main() {
  await testCustomFormats();
  await testFieldDiscovery();
}

main().catch(console.error);