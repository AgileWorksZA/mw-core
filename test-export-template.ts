#!/usr/bin/env bun
// Test export with custom template

import { MoneyWorksRESTClient } from "./packages/core/src/rest/client";

const client = new MoneyWorksRESTClient({
  host: "localhost",
  port: 6710,
  dataFile: "acme.moneyworks",
  username: "Herman Geldenhuys",
  password: ""
});

async function testTemplateExport() {
  try {
    // Export with a custom template that includes expressions
    const template = "[OurRef] - [Description] | Amount: $[Gross] | GST: $[Gross * 0.15] | Net: $[Gross - (Gross * 0.15)]";
    
    const result = await client.export("Transaction", {
      format: { template },
      limit: 5,
      filter: "Gross > 1000"
    });
    
    console.log("Template Export Result:");
    console.log(result);
    
  } catch (error) {
    console.error("Error:", error);
  }
}

testTemplateExport();