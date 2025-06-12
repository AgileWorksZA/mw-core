#!/usr/bin/env bun

/**
 * Generate JSON Schemas
 *
 * Generates JSON Schema files from TypeScript interfaces.
 */

import { generateAllSchemas } from "../src/schemas/generator";

async function main() {
  console.log("🔧 Generating JSON Schemas for MoneyWorks tables...\n");

  try {
    await generateAllSchemas();
    console.log("\n✅ JSON Schema generation complete!");
    console.log("📁 Schemas saved to: packages/core/src/schemas/");
  } catch (error) {
    console.error("\n❌ Schema generation failed:", error);
    process.exit(1);
  }
}

main();
