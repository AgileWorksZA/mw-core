#!/usr/bin/env bun
// Workaround to count records using export metadata

import { MoneyWorksRESTClient } from "./packages/core/src/rest/client";

const client = new MoneyWorksRESTClient({
  host: "localhost",
  port: 6710,
  dataFile: "acme.moneyworks",
  username: "Herman Geldenhuys",
  password: ""
});

async function countRecords(table: string, filter?: string) {
  try {
    // Use curl to get XML response with count attribute
    const { exec } = require('child_process');
    const { promisify } = require('util');
    const execAsync = promisify(exec);
    
    let url = `http://Herman%20Geldenhuys:@localhost:6710/REST/acme.moneyworks/export/table=${table}&limit=0&format=xml-verbose`;
    if (filter) {
      url += `&search=${encodeURIComponent(filter)}`;
    }
    
    const { stdout } = await execAsync(`curl -s "${url}" | head -1`);
    
    // Extract count from XML
    const countMatch = stdout.match(/count="(\d+)"/);
    const foundMatch = stdout.match(/found="(\d+)"/);
    
    if (foundMatch) {
      console.log(`Total ${table} records${filter ? ' matching filter' : ''}: ${foundMatch[1]}`);
      return parseInt(foundMatch[1]);
    } else if (countMatch) {
      console.log(`Total ${table} records: ${countMatch[1]}`);
      return parseInt(countMatch[1]);
    } else {
      console.log("Could not extract count from response");
      return null;
    }
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}

// Test different counts
console.log("Testing record counts...\n");

await countRecords("Transaction");
await countRecords("Transaction", "Gross > 1000");
await countRecords("Account");
await countRecords("Name");