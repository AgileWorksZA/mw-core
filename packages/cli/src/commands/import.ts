import type { MoneyWorksRESTClient, TableName, TableMapCamel } from "@moneyworks/core";
import { parseArgs } from "util";
import { readFile } from "node:fs/promises";

export async function importCommand(
  client: MoneyWorksRESTClient,
  args: string[],
  _globalOptions: Record<string, unknown>
): Promise<void> {
  if (args.length < 2) {
    console.error("Usage: mw import <table> <file> [options]");
    console.error("Example: mw import Account accounts.json");
    process.exit(1);
  }

  const table = args[0] as TableName;
  const filePath = args[1];

  // Parse import-specific options
  const { values } = parseArgs({
    args: args.slice(2),
    options: {
      mode: {
        type: "string",
        short: "m",
        default: "create",
      },
      workItOut: {
        type: "boolean",
        short: "w",
      },
      calculated: {
        type: "boolean",
      },
    },
    strict: false,
  });

  try {
    console.log(`Importing ${table} records from ${filePath}...`);

    // Read file
    const fileContent = await readFile(filePath, "utf-8");
    const records = JSON.parse(fileContent) as Partial<TableMapCamel[typeof table]>[];

    if (!Array.isArray(records)) {
      throw new Error("File must contain an array of records");
    }

    console.log(`Found ${records.length} records to import`);

    // Import records
    const result = await client.import(table, records, {
      mode: values.mode as "create" | "update" | "createOrUpdate",
      workItOut: values.workItOut as boolean,
      calculated: values.calculated as boolean,
    });

    console.log(`Import complete:`);
    console.log(`  Processed: ${result.processed}`);
    console.log(`  Created: ${result.created}`);
    console.log(`  Updated: ${result.updated}`);
    console.log(`  Errors: ${result.errors}`);

    if (result.errorDetails && result.errorDetails.length > 0) {
      console.error("\\nErrors:");
      for (const error of result.errorDetails) {
        console.error(`  Record ${error.record}: ${error.message}`);
      }
    }
  } catch (error) {
    console.error("Import failed:", error instanceof Error ? error.message : error);
    process.exit(1);
  }
}