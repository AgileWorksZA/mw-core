/**
 * Simple test to get one account type
 */

import config from "./mw-config.json";
import { createClient } from "./src/export-import";
import type { MoneyWorksConfig } from "./src/rest/client";
import type { AccountCamel } from "./src/tables";

async function testSingleAccount() {
  const mwConfig: MoneyWorksConfig = {
    host: config.host,
    port: config.port,
    dataFile: config.dataFile,
    username: config.username,
    password: config.password,
    debug: true,
  };

  const client = createClient(mwConfig);

  // Direct export with filter
  console.log("Test: Direct export with type filter...\n");
  const result = await client.export("Account", {
    format: "json",
    filter: 'type="CA"',
    limit: 5,
  });

  console.log(`Found ${Array.isArray(result) ? result.length : 0} accounts\n`);

  if (Array.isArray(result)) {
    for (const acc of result as AccountCamel[]) {
      console.log(
        `Code: ${acc.code}, Name: ${acc.name}, Type: ${acc.accountType}`,
      );
    }
  }
}

testSingleAccount();
