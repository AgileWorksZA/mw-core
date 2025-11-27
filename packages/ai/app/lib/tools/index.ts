/**
 * MoneyWorks Tools Registry
 *
 * Exports all MoneyWorks-specific tools for the AI assistant.
 * These tools provide direct access to MoneyWorks data instead of
 * generic file exploration tools.
 */

import type { Tool } from "@anthropic-ai/sdk/resources/messages";

// Export tool definitions and run functions
export { mwTablesToolDef, runMwTables } from "./mw-tables";
export { mwSchemaToolDef, runMwSchema } from "./mw-schema";
export { mwQueryToolDef, runMwQuery } from "./mw-query";
export { mwEvalToolDef, runMwEval } from "./mw-eval";
export { mwReportToolDef, runMwReport } from "./mw-report";

// Import for aggregation
import { mwTablesToolDef, runMwTables } from "./mw-tables";
import { mwSchemaToolDef, runMwSchema } from "./mw-schema";
import { mwQueryToolDef, runMwQuery } from "./mw-query";
import { mwEvalToolDef, runMwEval } from "./mw-eval";
import { mwReportToolDef, runMwReport } from "./mw-report";

/**
 * Tool registry with definitions and run functions
 */
export interface ToolEntry {
  def: Tool;
  run: (input: Record<string, unknown>) => Promise<string>;
}

/**
 * All available tools
 */
export const toolRegistry: Record<string, ToolEntry> = {
  mw_tables: { def: mwTablesToolDef, run: runMwTables as (input: Record<string, unknown>) => Promise<string> },
  mw_schema: { def: mwSchemaToolDef, run: runMwSchema as (input: Record<string, unknown>) => Promise<string> },
  mw_query: { def: mwQueryToolDef, run: runMwQuery as (input: Record<string, unknown>) => Promise<string> },
  mw_eval: { def: mwEvalToolDef, run: runMwEval as (input: Record<string, unknown>) => Promise<string> },
  mw_report: { def: mwReportToolDef, run: runMwReport as (input: Record<string, unknown>) => Promise<string> },
};

/**
 * All tool definitions for Anthropic API
 */
export const allToolDefs: Tool[] = Object.values(toolRegistry).map((entry) => entry.def);

/**
 * Tool names for reference
 */
export const toolNames = [
  "mw_tables",
  "mw_schema",
  "mw_query",
  "mw_eval",
  "mw_report",
] as const;

export type ToolName = (typeof toolNames)[number];

/**
 * Execute a tool by name
 */
export async function executeTool(name: string, input: Record<string, unknown>): Promise<string> {
  const entry = toolRegistry[name];
  if (!entry) {
    return `Error: Unknown tool '${name}'`;
  }
  return entry.run(input);
}

/**
 * Tool descriptions for system prompt
 */
export const toolDescriptions = `
You have access to MoneyWorks tools for querying financial data:

## TOOL REFERENCE

**mw_tables** - List all available MoneyWorks tables
→ Use when: "What tables exist?", "What data is available?"

**mw_schema** - Get field definitions for a table
→ Use when: You need to know what fields a table has
→ ALWAYS use before mw_query if unsure about field names

**mw_query** - Query any table (THE MAIN TOOL FOR DATA RETRIEVAL)
→ Use when: "Show me accounts", "List customers", "Get transactions"
→ Parameters: table, filter (optional), fields (optional), limit, sort
→ Examples:
  - Chart of accounts: {"table": "Account"}
  - Customers only: {"table": "Name", "filter": "CustomerType>0"}
  - Bank accounts: {"table": "Account", "filter": "Type='BK'"}
  - Sales invoices: {"table": "Transaction", "filter": "Type='DI'"}

**mw_report** - Generate standard financial reports
→ Use when: "balance sheet", "trial balance", "aged receivables", "P&L"
→ Types: balance_sheet, trial_balance, aged_receivables, aged_payables, account_balances, customer_list, supplier_list, product_list, tax_summary

**mw_eval** - Evaluate MWScript (ADVANCED - rarely needed)
→ Use ONLY for: custom calculations, aggregates like sum(), count()
→ NOT for listing data - use mw_query instead

## MONEYWORKS TRANSACTION TYPE CODES
Standard codes:
- DI = Debtor Invoice (Sales Invoice)
- DC = Debtor Credit (Sales Credit Note)
- DR = Debtor Receipt (Payment received from customer)
- CI = Creditor Invoice (Purchase Invoice)
- CC = Creditor Credit (Purchase Credit Note)
- CP = Creditor Payment (Payment to supplier)
- JN = Journal Entry
- BK = Bank Entry
- CR = Cash Receipt

Variant codes (some systems use these):
- DII = Debtor Invoice (Item-based)
- DIC = Debtor Invoice Credit
- CII = Creditor Invoice (Item-based)
- CIC = Creditor Invoice Credit
- CPC = Creditor Payment Credit
- CRD = Cash Receipt Deposit

TIP: Query transaction types first to see what's in the database: mw_query(table: "Transaction", fields: ["Type"], limit: 100)

## COMMON QUERIES → TOOL MAPPING

"Show chart of accounts" → mw_query(table: "Account")
"List all customers" → mw_query(table: "Name", filter: "CustomerType>0")
"List all suppliers" → mw_query(table: "Name", filter: "SupplierType>0")
"What tables are available" → mw_tables()
"Balance sheet" → mw_report(report: "balance_sheet")
"Trial balance" → mw_report(report: "trial_balance")
"Aged receivables" → mw_report(report: "aged_receivables")
"Aged payables" → mw_report(report: "aged_payables")
"Unpaid invoices" → mw_report(report: "aged_receivables") THEN mw_report(report: "aged_payables")
"What do customers owe" → mw_report(report: "aged_receivables")
"What do we owe suppliers" → mw_report(report: "aged_payables")
"Sales invoices" → mw_query(table: "Transaction", filter: "Type='DI' or Type='DII'")
"Purchase invoices" → mw_query(table: "Transaction", filter: "Type='CI' or Type='CII'")
"Payments" → mw_query(table: "Transaction", filter: "Type='CP'")
"Customer receipts" → mw_query(table: "Transaction", filter: "Type='DR' or Type='CR'")
"Journals" → mw_query(table: "Transaction", filter: "Type='JN'")

## IMPORTANT RULES
1. Use mw_query for retrieving data (90% of queries)
2. Use mw_report for financial summaries
3. Use mw_eval ONLY for calculations, NOT for listing records
4. The Account table is the chart of accounts
5. The Name table contains both customers (CustomerType>0) and suppliers (SupplierType>0)
6. For unpaid items: filter with "Gross>Amtpaid" (no Outstanding field exists)
7. Transaction type codes are 2-letter strings: 'DI', 'CI', 'CP', 'DR', 'JN', 'BK'
`;
