/**
 * Test account filtering
 */

import config from "./mw-config.json";
import { createClient, exportFrom } from "./src/export-import";
import type { MoneyWorksConfig } from "./src/rest/client";
import type { AccountCamel } from "./src/tables";

async function testAccountFilters() {
  console.log("🔍 Testing Account Filters...\n");

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
    // Test raw filter with MoneyWorks field names
    console.log("Test 1: Using raw filter with type field...");
    const rawFilter = await client.export("Account", {
      format: "json",
      filter: 'type="CA"', // Using lowercase field name
      limit: 5,
    });

    console.log(
      `Found ${Array.isArray(rawFilter) ? rawFilter.length : 0} accounts with type="CA"`,
    );

    // Test with Type field (uppercase)
    console.log("\nTest 2: Using raw filter with Type field...");
    const upperFilter = await client.export("Account", {
      format: "json",
      filter: 'Type="CA"',
      limit: 5,
    });

    console.log(
      `Found ${Array.isArray(upperFilter) ? upperFilter.length : 0} accounts with Type="CA"`,
    );

    // Show account types
    console.log("\nTest 3: Show unique account types...");
    const allAccounts = await client.export("Account", {
      format: "json",
    });

    if (Array.isArray(allAccounts)) {
      const types = new Set(
        (allAccounts as AccountCamel[]).map((acc) => acc.accountType),
      );
      console.log("Account types found:", Array.from(types));

      // Count by type
      const typeCounts: Record<string, number> = {};
      for (const acc of allAccounts as AccountCamel[]) {
        const type = acc.accountType || "unknown";
        typeCounts[type] = (typeCounts[type] || 0) + 1;
      }

      console.log("\nAccount counts by type:");
      for (const [type, count] of Object.entries(typeCounts)) {
        console.log(`  ${type}: ${count} accounts`);
      }
    }

    // Test balance filter
    console.log("\nTest 4: Accounts with non-zero balance...");
    const withBalance = await client.export("Account", {
      format: "json",
      filter: "Balance<>0",
    });

    console.log(
      `Found ${Array.isArray(withBalance) ? withBalance.length : 0} accounts with non-zero balance`,
    );
  } catch (error) {
    console.error("Error:", error);
  }
}

testAccountFilters();
