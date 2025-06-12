/**
 * Test account counts with different filters
 */

import config from "./mw-config.json";
import { createClient } from "./src/export-import";
import type { MoneyWorksConfig } from "./src/rest/client";
import type { AccountCamel } from "./src/tables";

async function testAccountCount() {
  const mwConfig: MoneyWorksConfig = {
    host: config.host,
    port: config.port,
    dataFile: config.dataFile,
    username: config.username,
    password: config.password,
  };

  const client = createClient(mwConfig);

  console.log("Testing account counts with filters...\n");

  // Test each account type
  const types = ["CA", "FA", "CL", "TL", "SF", "IN", "EX", "CS"];

  for (const type of types) {
    const accounts = await client.export("Account", {
      format: "json",
      filter: `type="${type}"`,
    });

    const count = Array.isArray(accounts) ? accounts.length : 0;
    console.log(`Type ${type}: ${count} accounts`);
  }

  // Test no filter
  console.log("\nNo filter:");
  const allAccounts = await client.export("Account", {
    format: "json",
  });
  console.log(
    `Total: ${Array.isArray(allAccounts) ? allAccounts.length : 0} accounts`,
  );

  // Verify the types in all accounts
  if (Array.isArray(allAccounts)) {
    const typeCounts: Record<string, number> = {};
    for (const acc of allAccounts as AccountCamel[]) {
      const type = acc.accountType || "unknown";
      typeCounts[type] = (typeCounts[type] || 0) + 1;
    }

    console.log("\nActual distribution:");
    for (const [type, count] of Object.entries(typeCounts)) {
      console.log(`  ${type}: ${count}`);
    }
  }
}

testAccountCount();
