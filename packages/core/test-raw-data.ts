/**
 * Test to see raw data from MoneyWorks
 */

import config from "./mw-config.json";
import { createClient } from "./src/export-import";
import type { MoneyWorksConfig } from "./src/rest/client";

async function testRawData() {
  console.log("🔍 Testing MoneyWorks Raw Data Export...\n");

  const mwConfig: MoneyWorksConfig = {
    host: config.host,
    port: config.port,
    dataFile: config.dataFile,
    username: config.username,
    password: config.password,
    debug: true,
  };

  const client = createClient(mwConfig);

  try {
    // Export as JSON to see the actual field names
    console.log("Fetching raw JSON data...");
    const response = await fetch(
      "http://localhost:6710/REST/Herman%20Geldenhuys:spoon.1024@GeldenTech%2fGeldenTech.moneyworks/export?table=Transaction&format=json&limit=2",
      {
        headers: {
          Authorization: `Basic ${btoa("Herman Geldenhuys:spoon.1024")}`,
        },
      },
    );

    const jsonText = await response.text();
    console.log("\nRaw JSON response:");
    console.log(jsonText);

    // Try parsing it
    try {
      const data = JSON.parse(jsonText);
      console.log("\nParsed data:");
      console.log(JSON.stringify(data, null, 2));
    } catch (e) {
      console.log("Failed to parse as JSON");
    }

    // Also try XML format
    console.log("\n\nFetching raw XML data...");
    const xmlResponse = await fetch(
      "http://localhost:6710/REST/Herman%20Geldenhuys:spoon.1024@GeldenTech%2fGeldenTech.moneyworks/export?table=Transaction&format=xml-verbose&limit=1",
      {
        headers: {
          Authorization: `Basic ${btoa("Herman Geldenhuys:spoon.1024")}`,
        },
      },
    );

    const xmlText = await xmlResponse.text();
    console.log("\nRaw XML response (first 500 chars):");
    console.log(xmlText.substring(0, 500));
  } catch (error) {
    console.error("Error:", error);
  }
}

testRawData();
