/**
 * Test script to verify MoneyWorks Export REST API functionality
 */

import {
  ExportParser,
  XMLParser,
  createClient,
  exportFrom,
} from "./src/export-import";
import type { MoneyWorksConfig } from "./src/rest/client";

// Load config from mw-config.json
import config from "./mw-config.json";

async function testExportAPI() {
  console.log("Testing MoneyWorks Export REST API...\n");

  const mwConfig: MoneyWorksConfig = {
    host: config.host,
    port: config.port,
    dataFile: config.dataFile,
    username: config.username,
    password: config.password,
  };

  // Create client
  const client = createClient(mwConfig);

  try {
    // Test 1: Simple export of Names
    console.log("Test 1: Export Names as JSON...");
    const names = await client.export("Name", {
      format: "json",
      limit: 5,
    });
    console.log(`✓ Exported ${Array.isArray(names) ? names.length : 0} names`);
    if (Array.isArray(names) && names.length > 0) {
      console.log("  Sample:", names[0]);
    }

    // Test 2: Export with filters
    console.log("\nTest 2: Export filtered Transactions...");
    const transactions = await client.export("Transaction", {
      format: "json",
      filter: "Period=7",
      orderBy: "TransDate DESC",
      limit: 10,
    });
    console.log(
      `✓ Exported ${Array.isArray(transactions) ? transactions.length : 0} transactions`,
    );

    // Test 3: Export as XML
    console.log("\nTest 3: Export Products as XML...");
    const xmlData = await client.export("Product", {
      format: "xml-verbose",
      limit: 3,
    });
    console.log("✓ Exported XML data");

    // Parse the XML to verify it works
    if (typeof xmlData === "string") {
      const parsed = await XMLParser.parse(xmlData, "Product", "xml-verbose");
      console.log(`  Parsed ${parsed.length} products from XML`);
    }

    // Test 4: Export as TSV
    console.log("\nTest 4: Export Names as TSV...");
    const tsvData = await client.export("Name", {
      format: "tsv",
      limit: 3,
    });
    console.log("✓ Exported TSV data");

    // Parse TSV to verify
    if (typeof tsvData === "string") {
      const parsed = ExportParser.parseTSV(tsvData, "Name");
      console.log(`  Parsed ${parsed.length} names from TSV`);
    }

    // Test 5: Using export builder
    console.log("\nTest 5: Using export builder...");
    const builder = exportFrom("Transaction")
      .where("Period=7")
      .whereField("gross", ">", 100)
      .orderBy("transDate", "DESC")
      .limit(5);

    const results = await builder.execute(client);
    console.log(`✓ Exported ${results.length} transactions using builder`);

    // Test 6: Export with custom template
    console.log("\nTest 6: Export with custom template...");
    const template = `Invoice: [OurRef]
Customer: GetNameField([NameCode], "Name")
Date: [TransDate]
Total: $[Gross]`;

    const templateResult = await client.export("Transaction", {
      format: "template",
      template: template,
      limit: 1,
    });
    console.log("✓ Exported with custom template");
    if (typeof templateResult === "string") {
      console.log("  Result:", templateResult.split("\n")[0]);
    }

    console.log("\n✅ All tests passed!");
  } catch (error) {
    console.error("\n❌ Test failed:", error);
    if (error instanceof Error) {
      console.error("  Message:", error.message);
      console.error("  Stack:", error.stack);
    }
  }
}

// Run tests
testExportAPI().catch(console.error);
