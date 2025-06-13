#!/usr/bin/env bun

// Test different limit parameter names
import { MoneyWorksRESTClient } from "@moneyworks/core";

const config = {
  host: "localhost",
  port: 6710,
  dataFile: "GeldenTech/GeldenTech.moneyworks",
  username: "Admin",
  password: "",
  debug: true
};

const client = new MoneyWorksRESTClient(config);

async function testLimitParam(paramName: string, value: string) {
  console.log(`\n=== Testing parameter: ${paramName}=${value} ===`);
  
  const params = new URLSearchParams({
    table: "Transaction",
    format: "xml-terse",
    filter: "TransDate >= '2024-01-01' and Amount > 1000",
    [paramName]: value
  });

  const url = `http://${config.host}:${config.port}/REST/${config.username}:@${config.dataFile}/export?${params}`;
  console.log("URL:", url);

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Basic ${btoa(config.username + ":")}`
      }
    });
    
    const text = await response.text();
    const lines = text.split('\n');
    console.log(`Response lines: ${lines.length}`);
    console.log(`First line: ${lines[0]}`);
    
    // Count actual records (look for lines with tabs)
    const recordLines = lines.filter(line => line.includes('\t'));
    console.log(`Record count: ${recordLines.length}`);
    
  } catch (error) {
    console.error("Error:", error);
  }
}

// Test different parameter names
async function main() {
  await testLimitParam("limit", "1");
  await testLimitParam("top", "1");
  await testLimitParam("count", "1");
  await testLimitParam("max", "1");
  await testLimitParam("maxrecords", "1");
  await testLimitParam("rows", "1");
}

main().catch(console.error);