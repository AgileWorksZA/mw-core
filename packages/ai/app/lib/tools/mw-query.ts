/**
 * MoneyWorks Query Tool
 *
 * Query any MoneyWorks table with optional filtering, field selection, and limiting.
 */

import type { Tool } from "@anthropic-ai/sdk/resources/messages";
import { queryTable, testConnection, getErrorMessage } from "../moneyworks-client.server";

/**
 * Tool definition for Anthropic API
 */
export const mwQueryToolDef: Tool = {
  name: "mw_query",
  description: `Query a MoneyWorks table with optional filtering.

This is the primary tool for retrieving data from MoneyWorks. Use mw_schema first to understand available fields.

Parameters:
- table: Table name (Account, Transaction, Name, Product, TaxRate, Job, etc.)
- filter: MoneyWorks search expression (optional)
- fields: Array of field names to return (optional, returns all if not specified)
- limit: Maximum records to return (optional, default 100)
- sort: Field name to sort by (optional)

Filter syntax (MoneyWorks search expressions):
- Equals: Code='ACC001' or Code="ACC001"
- Contains: Name contains 'Smith'
- Greater/Less: Balance>1000, Date<20240101
- And/Or: Type='Asset' and Balance>0
- Boolean: IsActive=true

Examples:
- All accounts: { "table": "Account" }
- Active customers: { "table": "Name", "filter": "Type='Customer' and Hold=false" }
- Recent transactions: { "table": "Transaction", "filter": "OurRef contains 'INV'", "limit": 50 }
- Specific fields: { "table": "Account", "fields": ["Code", "Name", "Balance"] }`,
  input_schema: {
    type: "object" as const,
    properties: {
      table: {
        type: "string",
        description: "Table name to query (e.g., 'Account', 'Transaction', 'Name', 'Product', 'TaxRate')",
      },
      filter: {
        type: "string",
        description: "MoneyWorks search expression (e.g., \"Type='Asset'\", \"Balance>0\", \"Name contains 'Smith'\")",
      },
      fields: {
        type: "array",
        items: { type: "string" },
        description: "Specific fields to return. If not specified, returns all fields.",
      },
      limit: {
        type: "number",
        description: "Maximum number of records to return. Default: 100",
      },
      sort: {
        type: "string",
        description: "Field name to sort results by",
      },
    },
    required: ["table"],
  },
};

/**
 * Execute the mw_query tool
 */
export async function runMwQuery(input: {
  table: string;
  filter?: string;
  fields?: string[];
  limit?: number;
  sort?: string;
}): Promise<string> {
  try {
    // Verify connection first
    const connectionTest = await testConnection();
    if (!connectionTest.success) {
      return `Error: ${connectionTest.message}`;
    }

    // Set default limit
    const limit = input.limit ?? 100;

    const records = await queryTable(input.table, {
      filter: input.filter,
      fields: input.fields,
      limit,
      sort: input.sort,
    });

    // Format response
    const response = {
      table: input.table,
      recordCount: records.length,
      ...(input.filter && { filter: input.filter }),
      ...(limit < records.length && { limitReached: true }),
      records,
    };

    return JSON.stringify(response, null, 2);
  } catch (error) {
    const errorMessage = getErrorMessage(error);

    // Provide helpful hints for common errors
    if (errorMessage.includes("not found") || errorMessage.includes("unknown table")) {
      return `Error: Table '${input.table}' not found. Use mw_tables to see available tables.`;
    }

    if (errorMessage.includes("field") || errorMessage.includes("column")) {
      return `Error querying ${input.table}: ${errorMessage}. Use mw_schema to see available fields.`;
    }

    if (errorMessage.includes("syntax") || errorMessage.includes("parse")) {
      return `Error querying ${input.table}: Filter syntax error - ${errorMessage}. MoneyWorks filter syntax: use 'and'/'or', comparisons like Field>0, strings in single quotes.`;
    }

    return `Error querying ${input.table}: ${errorMessage}`;
  }
}
