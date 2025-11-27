/**
 * MoneyWorks Schema Tool
 *
 * Get field definitions for a MoneyWorks table.
 */

import type { Tool } from "@anthropic-ai/sdk/resources/messages";
import { getTableSchema, testConnection, type FieldInfo } from "../moneyworks-client.server";

/**
 * Tool definition for Anthropic API
 */
export const mwSchemaToolDef: Tool = {
  name: "mw_schema",
  description: `Get field definitions for a MoneyWorks table.

Returns field names, types, and constraints for the specified table. Essential for understanding what data can be queried before using mw_query.

Example output:
{
  "table": "Account",
  "fieldCount": 25,
  "fields": [
    { "name": "Code", "type": "string", "maxLength": 15 },
    { "name": "Name", "type": "string", "maxLength": 40 },
    { "name": "Type", "type": "string" },
    { "name": "Balance", "type": "number" }
  ]
}

Use this before mw_query to understand available fields and their types.`,
  input_schema: {
    type: "object" as const,
    properties: {
      table: {
        type: "string",
        description:
          "Table name to get schema for (e.g., 'Account', 'Transaction', 'Name', 'Product', 'TaxRate')",
      },
    },
    required: ["table"],
  },
};

/**
 * Format field info for display
 */
function formatFieldInfo(field: FieldInfo): Record<string, unknown> {
  return {
    name: field.name,
    type: field.dataType,
    position: field.position,
    ...(field.maxLength && { maxLength: field.maxLength }),
    ...(field.required && { required: true }),
    ...(field.description && { description: field.description }),
  };
}

/**
 * Execute the mw_schema tool
 */
export async function runMwSchema(input: { table: string }): Promise<string> {
  try {
    // Verify connection first
    const connectionTest = await testConnection();
    if (!connectionTest.success) {
      return `Error: ${connectionTest.message}`;
    }

    const structure = await getTableSchema(input.table);

    // Format the output
    const fields = structure.fields.map(formatFieldInfo);

    // Group fields by type for easier understanding
    const fieldsByType: Record<string, string[]> = {};
    for (const field of structure.fields) {
      const type = field.dataType;
      if (!fieldsByType[type]) {
        fieldsByType[type] = [];
      }
      fieldsByType[type].push(field.name);
    }

    return JSON.stringify(
      {
        table: input.table,
        fieldCount: structure.fields.length,
        fieldsByType,
        fields,
      },
      null,
      2
    );
  } catch (error) {
    return `Error getting schema for ${input.table}: ${error instanceof Error ? error.message : String(error)}`;
  }
}
