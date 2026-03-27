/**
 * MoneyWorks Tables Tool
 *
 * Lists all available MoneyWorks tables with descriptions and field counts.
 */

import type { Tool } from "@anthropic-ai/sdk/resources/messages";
import { MW_TABLES, getMoneyWorksClient, testConnection } from "../moneyworks-client.server";

/**
 * Tool definition for Anthropic API
 */
export const mwTablesToolDef: Tool = {
  name: "mw_tables",
  description: `List all available MoneyWorks tables with descriptions.

Returns a list of tables that can be queried using mw_query or inspected with mw_schema.

Common tables:
- Account: Chart of accounts (GL accounts)
- Transaction: All financial transactions
- Name: Customers, suppliers, contacts
- Product: Products and services
- TaxRate: Tax codes and rates
- Job: Projects for job costing
- Detail: Transaction line items

Use mw_schema to get field definitions for any table before querying.`,
  input_schema: {
    type: "object" as const,
    properties: {
      includeFieldCounts: {
        type: "boolean",
        description: "If true, fetch field count for each table (slower but more informative). Default: false",
      },
    },
    required: [],
  },
};

/**
 * Execute the mw_tables tool
 */
export async function runMwTables(input: { includeFieldCounts?: boolean }): Promise<string> {
  try {
    // First verify connection
    const connectionTest = await testConnection();
    if (!connectionTest.success) {
      return `Error: ${connectionTest.message}`;
    }

    const tables: Array<{
      name: string;
      description: string;
      fieldCount?: number;
    }> = [];

    if (input.includeFieldCounts) {
      // Fetch field counts (slower)
      const client = getMoneyWorksClient();

      for (const table of MW_TABLES) {
        try {
          const info = await client.getTableInfo(table.name);
          tables.push({
            name: table.name,
            description: table.description,
            fieldCount: info.fieldCount,
          });
        } catch {
          // Table might not exist in this file, skip
          tables.push({
            name: table.name,
            description: table.description,
            fieldCount: undefined,
          });
        }
      }
    } else {
      // Just return the static list (faster)
      for (const table of MW_TABLES) {
        tables.push({
          name: table.name,
          description: table.description,
        });
      }
    }

    return JSON.stringify(
      {
        connectionStatus: connectionTest.message,
        tableCount: tables.length,
        tables,
      },
      null,
      2
    );
  } catch (error) {
    return `Error listing tables: ${error instanceof Error ? error.message : String(error)}`;
  }
}
