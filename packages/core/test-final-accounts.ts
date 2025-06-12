/**
 * Final test - Show accounts properly grouped by type
 */

import config from "./mw-config.json";
import { createClient } from "./src/export-import";
import type { MoneyWorksConfig } from "./src/rest/client";
import type { AccountCamel } from "./src/tables";

async function testFinalAccounts() {
  console.log("📊 MoneyWorks Account Summary\n");

  const mwConfig: MoneyWorksConfig = {
    host: config.host,
    port: config.port,
    dataFile: config.dataFile,
    username: config.username,
    password: config.password,
  };

  const client = createClient(mwConfig);

  try {
    // Get all accounts
    const allAccounts = await client.export("Account", {
      format: "json",
      orderBy: "code ASC",
    });

    if (!Array.isArray(allAccounts)) {
      console.log("No accounts found");
      return;
    }

    console.log(`Total accounts: ${allAccounts.length}\n`);

    // Group by type
    const accountsByType: Record<string, AccountCamel[]> = {};
    const typeNames: Record<string, string> = {
      CA: "Current Assets",
      FA: "Fixed Assets",
      CL: "Current Liabilities",
      TL: "Term Liabilities",
      SF: "Shareholders Funds",
      IN: "Income",
      EX: "Expenses",
      CS: "Cost of Sales",
    };

    // Group accounts
    for (const account of allAccounts as AccountCamel[]) {
      const type = account.accountType || "Unknown";
      if (!accountsByType[type]) {
        accountsByType[type] = [];
      }
      accountsByType[type].push(account);
    }

    // Display by type
    for (const [type, accounts] of Object.entries(accountsByType)) {
      const typeName = typeNames[type] || type;
      console.log(`\n${typeName} (${type}) - ${accounts.length} accounts:`);
      console.log("─".repeat(60));

      for (const account of accounts) {
        const code = String(account.code || "").padEnd(10);
        const name = String(account.name || "")
          .padEnd(35)
          .substring(0, 35);
        const balance = (account.balance || 0).toFixed(2).padStart(12);
        console.log(`${code} ${name} $${balance}`);
      }

      // Calculate total
      const total = accounts.reduce((sum, acc) => sum + (acc.balance || 0), 0);
      console.log("─".repeat(60));
      console.log(`${"".padEnd(45)} Total: $${total.toFixed(2).padStart(12)}`);
    }

    // Overall summary
    console.log("\n\nSUMMARY");
    console.log("═".repeat(60));

    let totalAssets = 0;
    let totalLiabilities = 0;
    let totalEquity = 0;

    for (const [type, accounts] of Object.entries(accountsByType)) {
      const total = accounts.reduce((sum, acc) => sum + (acc.balance || 0), 0);

      if (["CA", "FA"].includes(type)) {
        totalAssets += total;
      } else if (["CL", "TL"].includes(type)) {
        totalLiabilities += total;
      } else if (type === "SF") {
        totalEquity += total;
      }
    }

    console.log(`Total Assets:      $${totalAssets.toFixed(2).padStart(12)}`);
    console.log(
      `Total Liabilities: $${totalLiabilities.toFixed(2).padStart(12)}`,
    );
    console.log(`Total Equity:      $${totalEquity.toFixed(2).padStart(12)}`);
    console.log("═".repeat(60));
    console.log(
      `Net Assets:        $${(totalAssets - totalLiabilities).toFixed(2).padStart(12)}`,
    );
  } catch (error) {
    console.error("Error:", error);
  }
}

testFinalAccounts();
