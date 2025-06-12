/**
 * Test to see actual account field names from MoneyWorks
 */

import config from "./mw-config.json";
import { createClient } from "./src/export-import";
import type { MoneyWorksConfig } from "./src/rest/client";

async function testAccountFields() {
  console.log("🔍 Testing MoneyWorks Account Fields...\n");

  const mwConfig: MoneyWorksConfig = {
    host: config.host,
    port: config.port,
    dataFile: config.dataFile,
    username: config.username,
    password: config.password,
  };

  const client = createClient(mwConfig);

  try {
    // Get raw XML to see field names
    console.log("Fetching raw XML data for accounts...");
    const response = await fetch(
      "http://localhost:6710/REST/Herman%20Geldenhuys:spoon.1024@GeldenTech%2fGeldenTech.moneyworks/export?table=Account&format=xml-verbose&limit=2",
      {
        headers: {
          Authorization: `Basic ${btoa("Herman Geldenhuys:spoon.1024")}`,
        },
      },
    );

    const xmlText = await response.text();
    console.log("\nRaw XML response (first 1000 chars):");
    console.log(xmlText.substring(0, 1000));
    console.log("...\n");

    // Also fetch as JSON to see parsed result
    console.log("Fetching as JSON format...");
    const accounts = await client.export("Account", {
      format: "json",
      limit: 2,
    });

    if (Array.isArray(accounts) && accounts.length > 0) {
      console.log("\nFirst account object:");
      console.log(JSON.stringify(accounts[0], null, 2));

      console.log("\nField names found:");
      console.log(Object.keys(accounts[0]));
    }

    // Try TSV to see column headers
    console.log("\n\nFetching TSV headers...");
    const tsvData = await client.export("Account", {
      format: "tsv",
      limit: 1,
    });

    if (typeof tsvData === "string") {
      const firstLine = tsvData.split("\n")[0];
      console.log("TSV Headers:");
      console.log(firstLine);

      console.log("\nColumn names:");
      const columns = firstLine.split("\t");
      for (let i = 0; i < columns.length; i++) {
        console.log(`  ${i + 1}. ${columns[i]}`);
      }
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

testAccountFields();
