/**
 * Test fetching accounts from MoneyWorks
 */

import config from "./mw-config.json";
import { createClient, exportFrom } from "./src/export-import";
import type { MoneyWorksConfig } from "./src/rest/client";
import type { AccountCamel } from "./src/tables";

async function testAccounts() {
  console.log("📊 Testing MoneyWorks Account Export...\n");

  const mwConfig: MoneyWorksConfig = {
    host: config.host,
    port: config.port,
    dataFile: config.dataFile,
    username: config.username,
    password: config.password,
    debug: false,
  };

  const client = createClient(mwConfig);

  try {
    // Test 1: Get all accounts
    console.log("Test 1: Fetching all accounts...");
    const allAccounts = await client.export("Account", {
      format: "json",
      orderBy: "Code ASC",
    });

    if (Array.isArray(allAccounts)) {
      console.log(`✅ Found ${allAccounts.length} accounts\n`);

      // List first 10 accounts
      console.log("First 10 accounts:");
      console.log(
        "Code     | Name                           | Type     | Balance",
      );
      console.log(
        "---------|--------------------------------|----------|----------",
      );

      for (const account of allAccounts.slice(0, 10) as AccountCamel[]) {
        const code = String(account.code || "").padEnd(8);
        const name = String(account.name || "")
          .padEnd(30)
          .substring(0, 30);
        const type = String(account.accountType || "").padEnd(8);
        const balance = (account.balance || 0).toFixed(2).padStart(10);
        console.log(`${code} | ${name} | ${type} | ${balance}`);
      }
    }

    // Test 2: Get specific account types
    console.log("\n\nTest 2: Fetching asset accounts...");
    const assetBuilder = exportFrom("Account")
      .whereField("accountType", "=", "CA") // Current Assets
      .orderBy("code", "ASC");

    console.log("Filter:", assetBuilder.getOptions().filter);
    const assetAccounts = await assetBuilder.execute(client);

    console.log(`✅ Found ${assetAccounts.length} asset accounts`);

    // Test 3: Get liability accounts
    console.log("\nTest 3: Fetching liability accounts...");
    const liabilityAccounts = await exportFrom("Account")
      .whereField("accountType", "=", "CL") // Current Liabilities
      .orderBy("code", "ASC")
      .execute(client);

    console.log(`✅ Found ${liabilityAccounts.length} liability accounts`);

    // Test 4: Get income accounts
    console.log("\nTest 4: Fetching income accounts...");
    const incomeAccounts = await exportFrom("Account")
      .whereField("accountType", "=", "IN") // Income
      .orderBy("code", "ASC")
      .execute(client);

    console.log(`✅ Found ${incomeAccounts.length} income accounts`);

    // Test 5: Get expense accounts
    console.log("\nTest 5: Fetching expense accounts...");
    const expenseAccounts = await exportFrom("Account")
      .whereField("accountType", "=", "EX") // Expenses
      .orderBy("code", "ASC")
      .execute(client);

    console.log(`✅ Found ${expenseAccounts.length} expense accounts`);

    // Test 6: Show account summary by type
    console.log("\n\nAccount Summary by Type:");
    console.log("------------------------");

    const accountTypes: Record<string, string> = {
      CA: "Current Assets",
      FA: "Fixed Assets",
      CL: "Current Liabilities",
      TL: "Term Liabilities",
      SF: "Shareholders Funds",
      IN: "Income",
      EX: "Expenses",
      CS: "Cost of Sales",
    };

    for (const [typeCode, typeName] of Object.entries(accountTypes)) {
      const accounts = await exportFrom("Account")
        .whereField("accountType", "=", typeCode)
        .execute(client);

      if (accounts.length > 0) {
        const total = accounts.reduce(
          (sum, acc: AccountCamel) => sum + (acc.balance || 0),
          0,
        );
        console.log(
          `${typeName}: ${accounts.length} accounts, Total: $${total.toFixed(2)}`,
        );
      }
    }

    // Test 7: Get accounts with non-zero balances
    console.log("\n\nTest 7: Accounts with balances...");
    const accountsWithBalance = await exportFrom("Account")
      .whereField("balance", "!=", 0)
      .orderBy("balance", "DESC")
      .limit(10)
      .execute(client);

    console.log("\nTop 10 accounts by balance:");
    console.log("Code     | Name                           | Balance");
    console.log("---------|--------------------------------|----------------");

    for (const account of accountsWithBalance as AccountCamel[]) {
      const code = String(account.code || "").padEnd(8);
      const name = String(account.name || "")
        .padEnd(30)
        .substring(0, 30);
      const balance = (account.balance || 0).toFixed(2).padStart(15);
      console.log(`${code} | ${name} | $${balance}`);
    }

    // Test 8: Export as TSV for spreadsheet
    console.log("\n\nTest 8: Export as TSV...");
    const tsvData = await client.export("Account", {
      format: "tsv",
      limit: 5,
    });

    if (typeof tsvData === "string") {
      console.log("✅ TSV export successful");
      console.log("Preview (first line):");
      console.log(tsvData.split("\n")[0]);
    }

    console.log("\n\n🎉 All account tests completed!");
  } catch (error) {
    console.error("\n❌ Test failed:", error);
    if (error instanceof Error) {
      console.error("Details:", error.message);
    }
  }
}

// Run the test
testAccounts();
