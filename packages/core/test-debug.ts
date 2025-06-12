/**
 * Debug test for MoneyWorks connection
 */

import config from "./mw-config.json";
import { createClient } from "./src/export-import";
import type { MoneyWorksConfig } from "./src/rest/client";

async function debugConnection() {
  console.log("🔍 Debugging MoneyWorks Connection...\n");

  const mwConfig: MoneyWorksConfig = {
    host: config.host,
    port: config.port,
    dataFile: config.dataFile,
    username: config.username,
    password: config.password,
    // Only include folder auth if both values are present
    ...(config.folderName && config.folderPassword
      ? {
          folderPassword: config.folderPassword,
          folderName: config.folderName,
        }
      : {}),
    debug: true, // Enable debug mode
  };

  console.log("Configuration:");
  console.log(`  Host: ${mwConfig.host}:${mwConfig.port}`);
  console.log(`  Data file: ${mwConfig.dataFile}`);
  console.log(`  Username: ${mwConfig.username}`);
  console.log(`  Folder: ${mwConfig.folderName || "none"}`);
  console.log(`  Has folder password: ${!!mwConfig.folderPassword}\n`);

  const client = createClient(mwConfig);

  try {
    // First, try to get version
    console.log("Test 1: Getting server version...");
    const version = await client.getVersion();
    console.log("✅ Server version:", version);

    // Try listing available documents
    console.log("\nTest 2: Listing documents...");
    const documents = await client.listDocuments();
    console.log("✅ Available documents:", documents);

    // Now try a simple export
    console.log("\nTest 3: Simple export test...");
    const result = await client.export("Name", {
      format: "json",
      limit: 1,
    });
    console.log(
      "✅ Export successful, got",
      Array.isArray(result) ? result.length : 0,
      "records",
    );
  } catch (error) {
    console.error("\n❌ Debug failed:", error);
    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response headers:", error.response.headers);
      console.error("Response data:", error.response.data);
    }
  }
}

debugConnection();
