/**
 * Test retrieving transactions from MoneyWorks
 */

import { createClient, exportFrom } from "./src/export-import";
import type { MoneyWorksConfig } from "./src/rest/client";
import type { TransactionCamel } from "./src/tables";

// Load config
import config from "./mw-config.json";

async function testTransactions() {
  console.log("🔍 Testing MoneyWorks Transaction Export...\n");

  // Check if password is configured
  if (!config.password) {
    console.log("⚠️  Warning: No password configured in mw-config.json");
    console.log(
      "Please update mw-config.json with your MoneyWorks credentials.\n",
    );
    console.log("For testing without real credentials, you can use:");
    console.log('  username: "test"');
    console.log('  password: "test"\n');
    return;
  }

  const mwConfig: MoneyWorksConfig = {
    host: config.host,
    port: config.port,
    dataFile: config.dataFile,
    username: config.username,
    password: config.password,
  };

  console.log(`📡 Connecting to ${mwConfig.host}:${mwConfig.port}`);
  console.log(`📁 Data file: ${mwConfig.dataFile}\n`);

  const client = createClient(mwConfig);

  try {
    // Test 1: Get recent transactions
    console.log("Test 1: Fetching recent transactions...");
    const recentTxns = await client.export("Transaction", {
      format: "json",
      orderBy: "TransDate DESC",
      limit: 10,
    });

    if (Array.isArray(recentTxns)) {
      console.log(`✅ Found ${recentTxns.length} transactions\n`);

      if (recentTxns.length > 0) {
        console.log("Sample transaction:");
        const txn = recentTxns[0] as TransactionCamel;
        console.log(`  Seq: ${txn.sequenceNumber}`);
        console.log(`  Date: ${txn.transDate}`);
        console.log(`  Reference: ${txn.ourRef}`);
        console.log(`  Name: ${txn.nameCode}`);
        console.log(`  Description: ${txn.description}`);
        console.log(`  Gross: $${txn.gross}`);
        console.log(`  Type: ${txn.typeCode}\n`);
      }
    }

    // Test 2: Get transactions for current period
    console.log("Test 2: Fetching current period transactions...");
    const periodTxns = await client.export("Transaction", {
      format: "json",
      filter: "Period=7",
      orderBy: "TransDate ASC",
    });

    if (Array.isArray(periodTxns)) {
      console.log(`✅ Found ${periodTxns.length} transactions in period 7\n`);
    }

    // Test 3: Get invoices only
    console.log("Test 3: Fetching invoices only...");
    const invoices = await exportFrom("Transaction")
      .whereField("typeCode", "=", "DI")
      .orderBy("transDate", "DESC")
      .limit(5)
      .execute(client);

    console.log(`✅ Found ${invoices.length} invoices\n`);

    if (invoices.length > 0) {
      console.log("Invoice summary:");
      let index = 0;
      for (const inv of invoices as TransactionCamel[]) {
        console.log(
          `  ${index + 1}. ${inv.ourRef} - ${inv.nameCode} - $${inv.gross}`,
        );
        index++;
      }
    }

    // Test 4: Get transactions with amount filter
    console.log("\nTest 4: Fetching large transactions...");
    const largeTxns = await exportFrom("Transaction")
      .whereField("gross", ">", 1000)
      .orderBy("gross", "DESC")
      .limit(5)
      .execute(client);

    console.log(`✅ Found ${largeTxns.length} transactions over $1000\n`);

    // Test 5: Export as TSV
    console.log("Test 5: Export as TSV format...");
    const tsvData = await client.export("Transaction", {
      format: "tsv",
      limit: 3,
    });

    if (typeof tsvData === "string") {
      console.log("✅ TSV export successful");
      console.log(
        "First line:",
        `${tsvData.split("\n")[0].substring(0, 100)}...\n`,
      );
    }

    // Test 6: Test error handling with bad filter
    console.log("Test 6: Testing error handling...");
    try {
      await client.export("Transaction", {
        format: "json",
        filter: "InvalidField=123",
      });
    } catch (error) {
      console.log("✅ Error handling works:", (error as Error).message);
    }

    console.log("\n🎉 All transaction tests completed!");
  } catch (error) {
    console.error("\n❌ Test failed:", error);
    if (error instanceof Error) {
      console.error("Details:", error.message);
      console.error("Stack:", error.stack);
    }
  }
}

// Run the test
testTransactions();
