/**
 * MoneyWorks Eval Tool
 *
 * Evaluate MWScript expressions for custom calculations and data retrieval.
 */

import type { Tool } from "@anthropic-ai/sdk/resources/messages";
import { evaluateExpression, testConnection, getErrorMessage } from "../moneyworks-client.server";

/**
 * Tool definition for Anthropic API
 */
export const mwEvalToolDef: Tool = {
  name: "mw_eval",
  description: `Evaluate a MWScript expression for CALCULATIONS ONLY.

⚠️ RARELY NEEDED - Use mw_query instead for listing/retrieving data.

Valid functions:
- Math: 1 + 1, (100 * 0.15)
- Aggregates: sum(Table.Field[filter]), count(Table[filter])
- Lookups: Table.Field[Code="X"] - returns single value
- Dates: today(), year(today()), monthname(today())

Examples:
- "1 + 1" → 2
- "count(Name[CustomerType>0])" → customer count
- "sum(Account.Balance[Type='BK'])" → total bank balance
- "Account.Name[Code='1000']" → single account name

NOT SUPPORTED (use mw_query instead):
- unique() - not valid MWScript
- distinct() - not valid MWScript
- list() - not valid MWScript
- Listing multiple records - use mw_query

Only use for single-value calculations, NOT for retrieving multiple records.`,
  input_schema: {
    type: "object" as const,
    properties: {
      expression: {
        type: "string",
        description: "MWScript expression to evaluate",
      },
    },
    required: ["expression"],
  },
};

/**
 * Execute the mw_eval tool
 */
export async function runMwEval(input: { expression: string }): Promise<string> {
  try {
    // Verify connection first
    const connectionTest = await testConnection();
    if (!connectionTest.success) {
      return `Error: ${connectionTest.message}`;
    }

    const result = await evaluateExpression(input.expression);

    return JSON.stringify(
      {
        expression: input.expression,
        result: result.trim(),
      },
      null,
      2
    );
  } catch (error) {
    const errorMessage = getErrorMessage(error);

    // Provide helpful hints
    if (errorMessage.includes("syntax")) {
      return `MWScript syntax error: ${errorMessage}. Check expression syntax - strings need double quotes.`;
    }

    return `Error evaluating expression: ${errorMessage}`;
  }
}
