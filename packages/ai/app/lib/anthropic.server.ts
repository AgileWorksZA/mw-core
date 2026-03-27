/**
 * Anthropic API Integration with MoneyWorks Tools
 *
 * Uses the raw Anthropic SDK with custom MoneyWorks tools.
 * Replaces the Claude Agent SDK which spawns subprocesses.
 */

import Anthropic from "@anthropic-ai/sdk";
import type { Message, ToolUseBlock, TextBlock, ToolResultBlockParam, MessageParam } from "@anthropic-ai/sdk/resources/messages";
import { allToolDefs, executeTool, toolDescriptions } from "./tools";
import { clearSessionLogs, getSessionStats, type SessionStats } from "./tool-logger.server";
import { getConnectionInfo } from "./moneyworks-client.server";
import type { Artifact } from "./artifacts/types";

/**
 * Default model to use for chat completions
 */
export const DEFAULT_MODEL = "claude-haiku-4-5";

/**
 * Type definitions for chat messages
 */
export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  toolCalls?: ToolCallInfo[];
}

/**
 * Information about a tool call for display
 */
export interface ToolCallInfo {
  id: string;
  name: string;
  input: Record<string, unknown>;
  output: string;
  status: "pending" | "success" | "error";
  durationMs?: number;
}

/**
 * Result from running a conversation with tools
 */
export interface RunWithToolsResult {
  response: string;
  toolCalls: ToolCallInfo[];
  stats: SessionStats;
  inputTokens: number;
  outputTokens: number;
  artifacts?: Artifact[];
}

/**
 * Create the Anthropic client
 */
function createClient(): Anthropic {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY environment variable is not set");
  }
  return new Anthropic({ apiKey });
}

/**
 * Build the system prompt for MoneyWorks assistant
 */
function buildSystemPrompt(): string {
  // Get connection info if available
  let connectionInfo = "";
  try {
    const info = getConnectionInfo();
    connectionInfo = `\nConnected to: ${info.dataFile} on ${info.host}:${info.port}`;
  } catch {
    connectionInfo = "\nMoneyWorks connection not yet established.";
  }

  return `You are a MoneyWorks accounting assistant. Your job is to help users query and understand their MoneyWorks accounting data.

${toolDescriptions}

IMPORTANT GUIDELINES:
1. ALWAYS use mw_schema before mw_query to understand available fields
2. Keep queries focused - use field selection to return only needed data
3. Use mw_report for standard financial reports instead of building queries manually
4. Format numbers as currency where appropriate
5. Explain what you found in plain language after showing data
6. If a query returns no results, suggest alternative approaches

CURRENT DATE: ${new Date().toISOString().split('T')[0]} (use YYYYMMDD format for queries, e.g., ${new Date().toISOString().split('T')[0].replace(/-/g, '')})
CONNECTION INFO:${connectionInfo}

## ARTIFACT GENERATION - CRITICAL

**ALWAYS emit artifacts for financial reports.** When users ask for reports, financial statements, or data visualizations, you MUST include a structured \`artifacts\` array. Do NOT just summarize in text - the UI relies on artifacts for rich rendering.

**MANDATORY artifact types:**
- Profit & Loss / P&L / income statement → emit \`department-pnl\` artifact
- Balance sheet / financial position → emit \`balance-sheet\` artifact
- Trial balance → emit \`trial-balance\` artifact
- Ledger / account history → emit \`ledger-report\` artifact
- Bank reconciliation status → emit \`bank-reconciliation-status\` artifact
- Transaction summaries → emit \`daily-transaction-summary\` artifact

Include a brief text explanation AND the artifact. Never respond with only text when an artifact type exists.

**Format:** Include a JSON code block with artifacts at the end of your response:
\`\`\`artifacts
[
  {
    "id": "unique-id",
    "title": "Title of artifact",
    "type": "metric|table|pie-chart|bar-chart|line-chart|balance-sheet|trial-balance|executive-summary|bank-reconciliation-status|daily-transaction-summary|ledger-report|department-pnl",
    "data": { ... type-specific data ... }
  }
]
\`\`\`

**Artifact Types and Data Structures:**

1. **metric** - Single KPI value
   \`{ "label": "Revenue", "value": 125000, "format": "currency", "trend": "up", "percentageChange": 12.5 }\`

2. **table** - Tabular data
   \`{ "columns": [{"key": "name", "label": "Account", "type": "string"}], "rows": [...], "sortable": true }\`

3. **pie-chart** - Categorical breakdown
   \`{ "data": [{"name": "Sales", "value": 45000}, {"name": "Services", "value": 30000}] }\`

4. **bar-chart** - Comparative data
   \`{ "data": [...], "xKey": "month", "yKeys": ["revenue", "expenses"], "stacked": false }\`

5. **line-chart** - Time series
   \`{ "data": [...], "xKey": "date", "yKeys": ["balance"], "curved": true }\`

6. **balance-sheet** - Standard balance sheet format
   \`{ "asOf": "2024-12-31", "totalAssets": 500000, "totalLiabilities": 200000, "totalEquity": 300000,
      "currentAssets": { "title": "Current Assets", "items": [...] }, ... }\`

7. **trial-balance** - Account balances
   \`{ "asOf": "2024-12-31", "items": [{"accountCode": "1000", "accountName": "Cash", "debit": 50000, "credit": 0}],
      "totalDebit": 100000, "totalCredit": 100000, "isBalanced": true }\`

8. **executive-summary** - High-level financial overview with health status, key metrics, and insights
   \`{ "asOf": "2024-12-31", "companyName": "Acme Corp", "period": "Q4 2024",
      "healthStatus": "good", "healthScore": 78,
      "metrics": [
        {"label": "Total Revenue", "value": 125000, "format": "currency", "trend": "up", "percentageChange": 12.5},
        {"label": "Net Profit", "value": 35000, "format": "currency", "trend": "up", "percentageChange": 8.2},
        {"label": "Cash Position", "value": 85000, "format": "currency"},
        {"label": "Debt Ratio", "value": 32, "format": "percentage", "trend": "down", "percentageChange": -5}
      ],
      "insights": [
        {"type": "positive", "text": "Revenue up 12.5% from last quarter"},
        {"type": "positive", "text": "Strong cash position maintained"},
        {"type": "warning", "text": "Receivables aging requires attention"}
      ],
      "breakdown": {"label": "Revenue by Category", "data": [{"name": "Sales", "value": 80000}, {"name": "Services", "value": 45000}]}
   }\`
   healthStatus options: "excellent" | "good" | "fair" | "poor" | "critical"

9. **bank-reconciliation-status** - Bank account reconciliation status overview
   \`{ "asOf": "2025-11-27", "companyName": "Acme Widgets Ltd",
      "accounts": [
        {"accountCode": "1000", "accountName": "Main Bank Account", "status": "reconciled",
         "reconciledAt": "2013-03-28", "statementNumber": 1, "statementDate": "2015-01-31",
         "openingBalance": 0, "closingBalance": 16183.73},
        {"accountCode": "1010", "accountName": "Unbanked", "status": "never"},
        {"accountCode": "2030", "accountName": "Visa", "status": "never"}
      ],
      "summary": {"totalAccounts": 4, "reconciledCount": 1, "neverReconciledCount": 3, "hasDiscrepancies": false}
   }\`
   status options: "reconciled" | "never" | "partial"

10. **daily-transaction-summary** - Full daily summary report with P&L, balance changes, and transaction breakdown
   \`{ "fromDate": "2015-05-11", "toDate": "2015-05-11", "createdAt": "2025-11-27T16:53:05.000Z",
      "currency": "NZD", "companyName": "Acme Widgets Ltd",
      "plSummary": {
        "totalSales": 1500.00, "totalCostOfSales": 800.00, "grossMargin": 700.00, "grossMarginPercent": 46.67,
        "totalOtherIncome": 50.00, "netIncome": 750.00, "totalExpenses": 200.00, "surplusDeficit": 550.00
      },
      "balanceChanges": [
        {"type": "bank", "label": "Bank balances", "change": 1200.00, "currentBalance": 8978.97},
        {"type": "receivables", "label": "Receivables", "change": -500.00, "currentBalance": 52681.57},
        {"type": "payables", "label": "Payables", "change": 300.00, "currentBalance": 13250.01}
      ],
      "summaryByType": [
        {"type": "BK", "typeName": "Bank Entry", "gross": 3232.04, "gst": 0.00, "nett": 3232.04, "count": 2},
        {"type": "CP", "typeName": "Creditor Payment", "gross": -2200.00, "gst": -60.00, "nett": -2140.00, "count": 2},
        {"type": "DR", "typeName": "Debtor Receipt", "gross": 1450.00, "gst": 0.00, "nett": 1450.00, "count": 3}
      ],
      "totals": {"gross": 2482.04, "gst": -60.00, "nett": 2542.04, "count": 7}
   }\`
   Includes: P&L Summary (Sales, Cost of Sales, Gross Margin, Income, Expenses, Surplus/Deficit),
   Balance Changes (Bank, Receivables, Payables with change and current balance),
   Transaction Summary by type (Gross, GST, Nett, Count)

11. **ledger-report** - General ledger showing all transactions for each account with running balances
   \`{ "reportTitle": "General Ledger Report", "fromDate": "2024-01-01", "toDate": "2024-12-31",
      "currency": "NZD", "companyName": "Acme Widgets Ltd",
      "accounts": [
        {
          "accountCode": "1000", "accountName": "Main Bank Account", "accountType": "CA",
          "openingBalance": 5000.00, "openingBalanceType": "DB",
          "entries": [
            {"index": 1, "type": "DR", "date": "2024-01-15", "reference": "INV-001", "description": "Customer A: Payment",
             "gst": 0, "taxCode": "", "debit": 1150.00, "credit": 0, "balance": 6150.00, "balanceType": "DB"},
            {"index": 2, "type": "CP", "date": "2024-01-20", "reference": "PAY-001", "description": "Supplier B: Invoice payment",
             "gst": 0, "taxCode": "", "debit": 0, "credit": 500.00, "balance": 5650.00, "balanceType": "DB"}
          ],
          "closingBalance": 5650.00, "closingBalanceType": "DB",
          "totalDebit": 1150.00, "totalCredit": 500.00
        }
      ]
   }\`
   Shows per-account sections with: opening balance, transaction details (Type, Date, Reference, Description, GST, TC, Debit, Credit, Balance with DB/CR indicator), closing balance.
   Balance coloring: green for normal balance (DB for assets, CR for liabilities), red for abnormal.

12. **department-pnl** - Multi-period Profit & Loss statement with optional department filtering
   \`{ "companyName": "Acme Widgets Ltd", "reportTitle": "Profit & Loss Statement",
      "periods": ["Nov:2022/23", "Nov:2023/24", "Nov:2024/25"],
      "department": null, "currency": "NZD", "generatedAt": "2025-11-27T12:00:00.000Z",
      "sections": {
        "sales": {
          "name": "SALES",
          "items": [
            {"code": "4000", "name": "Sales - Widgets", "values": [45000, 52000, 58000], "percentChange": 11.5},
            {"code": "4100", "name": "Sales - Services", "values": [15000, 18000, 22000], "percentChange": 22.2}
          ],
          "total": {"code": "", "name": "Total SALES", "values": [60000, 70000, 80000], "percentChange": 14.3, "isTotal": true}
        },
        "costOfSales": {
          "name": "COST OF SALES",
          "items": [{"code": "6000", "name": "Direct Materials", "values": [20000, 23000, 26000], "percentChange": 13.0}],
          "total": {"code": "", "name": "Total COST OF SALES", "values": [20000, 23000, 26000], "percentChange": 13.0, "isTotal": true}
        },
        "grossMargin": {"code": "", "name": "Gross Margin", "values": [40000, 47000, 54000], "percentChange": 14.9, "isCalculated": true},
        "otherIncome": {
          "name": "OTHER INCOME",
          "items": [],
          "total": {"code": "", "name": "Total OTHER INCOME", "values": [0, 0, 0], "isTotal": true}
        },
        "netIncome": {"code": "", "name": "Net Income", "values": [40000, 47000, 54000], "percentChange": 14.9, "isCalculated": true},
        "expenses": {
          "name": "EXPENSES",
          "items": [
            {"code": "7000", "name": "Wages", "values": [25000, 28000, 30000], "percentChange": 7.1},
            {"code": "7100", "name": "Rent", "values": [6000, 6000, 6500], "percentChange": 8.3}
          ],
          "total": {"code": "", "name": "Total EXPENSES", "values": [31000, 34000, 36500], "percentChange": 7.4, "isTotal": true}
        },
        "profitLoss": {"code": "", "name": "Profit / (Loss)", "values": [9000, 13000, 17500], "percentChange": 34.6, "isCalculated": true}
      }
   }\`
   Use mw_report with report="department_pnl", numberOfPeriods (default 3), optional department filter, and optional asOf date.
   Shows collapsible sections for Sales, COS, Other Income, Expenses with calculated Gross Margin, Net Income, and Profit/Loss rows.
   YoY percent change shown with color coding (green positive, red negative).

**When to Generate Artifacts:**
- Financial summaries: metrics + pie chart
- Account queries: table
- Trend analysis: line chart
- Comparisons: bar chart
- Financial reports: balance-sheet or trial-balance
- KPIs: metrics
- Executive overview / financial health: executive-summary
- Bank reconciliation status queries: bank-reconciliation-status
- Daily transaction queries / transaction summaries: daily-transaction-summary
- Ledger / general ledger / account transaction history: ledger-report
- Profit & Loss / P&L / income statement / department performance: department-pnl

Always provide text explanation BEFORE the artifacts block.

Be concise, helpful, and focused on answering accounting questions using the available tools.`;
}

/**
 * Convert API messages to Anthropic format
 */
function convertToAnthropicMessages(messages: ChatMessage[]): MessageParam[] {
  return messages.map((msg) => ({
    role: msg.role,
    content: msg.content,
  }));
}

/**
 * Parse artifacts from the AI response text
 * Looks for ```artifacts JSON code blocks
 */
function parseArtifacts(responseText: string): { text: string; artifacts: Artifact[] } {
  const artifactsRegex = /```artifacts\s*([\s\S]*?)```/g;
  let artifacts: Artifact[] = [];
  let cleanText = responseText;

  const matches = responseText.matchAll(artifactsRegex);
  for (const match of matches) {
    const jsonStr = match[1].trim();
    try {
      const parsed = JSON.parse(jsonStr);
      if (Array.isArray(parsed)) {
        artifacts = artifacts.concat(parsed);
      } else if (parsed && typeof parsed === 'object') {
        artifacts.push(parsed);
      }
      // Remove the artifacts block from the text
      cleanText = cleanText.replace(match[0], '').trim();
    } catch (e) {
      console.error('[Anthropic] Failed to parse artifacts JSON:', e);
    }
  }

  return { text: cleanText, artifacts };
}

/**
 * Run a conversation using the Anthropic SDK with custom tools
 */
export async function runWithTools(
  messages: ChatMessage[],
  onToolStart?: (name: string, id: string) => void,
  onToolComplete?: (info: ToolCallInfo) => void
): Promise<RunWithToolsResult> {
  // Clear session logs for fresh tracking
  clearSessionLogs();

  const client = createClient();
  const toolCalls: ToolCallInfo[] = [];
  let totalInputTokens = 0;
  let totalOutputTokens = 0;

  // Convert messages
  const anthropicMessages: MessageParam[] = convertToAnthropicMessages(messages);

  console.log("[Anthropic] Starting conversation with", messages.length, "messages");

  // Tool loop - keep going until we get a final response
  let iteration = 0;
  const maxIterations = 15;

  while (iteration < maxIterations) {
    iteration++;
    console.log(`[Anthropic] Iteration ${iteration}`);

    // Make the API call
    const response: Message = await client.messages.create({
      model: DEFAULT_MODEL,
      max_tokens: 4096,
      system: buildSystemPrompt(),
      messages: anthropicMessages,
      tools: allToolDefs,
    });

    // Track tokens
    totalInputTokens += response.usage.input_tokens;
    totalOutputTokens += response.usage.output_tokens;

    // Check stop reason
    if (response.stop_reason === "end_turn") {
      // Extract final text response
      let responseText = "";
      for (const block of response.content) {
        if (block.type === "text") {
          responseText += (block as TextBlock).text;
        }
      }

      // Parse artifacts from the response
      const { text: cleanText, artifacts } = parseArtifacts(responseText);

      const stats = getSessionStats();
      const responsePreview = cleanText.length > 300 ? cleanText.substring(0, 300) + "..." : cleanText;
      console.log(`[Anthropic] Complete. Tools: ${toolCalls.length}, Artifacts: ${artifacts.length}, Tokens: ${totalInputTokens}/${totalOutputTokens}`);
      console.log(`[Anthropic] Final response:`, responsePreview);

      return {
        response: cleanText || "I processed your request but have no text response.",
        toolCalls,
        stats,
        inputTokens: totalInputTokens,
        outputTokens: totalOutputTokens,
        artifacts: artifacts.length > 0 ? artifacts : undefined,
      };
    }

    // Handle tool use
    if (response.stop_reason === "tool_use") {
      // Add assistant message with tool calls to history
      anthropicMessages.push({
        role: "assistant",
        content: response.content,
      });

      // Process each tool use block
      const toolResults: ToolResultBlockParam[] = [];

      for (const block of response.content) {
        if (block.type === "tool_use") {
          const toolUse = block as ToolUseBlock;
          console.log(`[Anthropic] Tool call: ${toolUse.name}`, JSON.stringify(toolUse.input));

          // Track tool call
          const toolCall: ToolCallInfo = {
            id: toolUse.id,
            name: toolUse.name,
            input: toolUse.input as Record<string, unknown>,
            output: "",
            status: "pending",
          };
          toolCalls.push(toolCall);
          onToolStart?.(toolUse.name, toolUse.id);

          // Execute the tool
          const startTime = Date.now();
          const result = await executeTool(
            toolUse.name,
            toolUse.input as Record<string, unknown>
          );
          const durationMs = Date.now() - startTime;

          // Update tool call info
          toolCall.output = result;
          toolCall.durationMs = durationMs;
          toolCall.status = result.startsWith("Error") ? "error" : "success";
          onToolComplete?.(toolCall);

          const resultPreview = result.length > 200 ? result.substring(0, 200) + "..." : result;
          console.log(`[Anthropic] Tool ${toolUse.name} completed in ${durationMs}ms:`, resultPreview);

          // Add to results
          toolResults.push({
            type: "tool_result",
            tool_use_id: toolUse.id,
            content: result,
          });
        }
      }

      // Add tool results to message history
      anthropicMessages.push({
        role: "user",
        content: toolResults,
      });
    }
  }

  // If we hit max iterations, return what we have
  const stats = getSessionStats();
  return {
    response: "I reached the maximum number of tool iterations. Please try a simpler query.",
    toolCalls,
    stats,
    inputTokens: totalInputTokens,
    outputTokens: totalOutputTokens,
  };
}

/**
 * Stream event types for UI updates
 */
export type StreamEvent =
  | { type: "tool_start"; toolName: string; toolId: string }
  | { type: "tool_result"; toolId: string; result: string; status: "success" | "error"; durationMs?: number }
  | { type: "text"; text: string }
  | { type: "complete"; response: string; toolCalls: ToolCallInfo[]; stats: SessionStats };

/**
 * Run with streaming support
 * Note: This is a simplified version - full streaming with tools is complex
 */
export async function* runWithToolsStreaming(
  messages: ChatMessage[]
): AsyncGenerator<StreamEvent> {
  // For now, use the non-streaming version and emit events

  const result = await runWithTools(messages);

  // Emit tool events
  for (const tc of result.toolCalls) {
    yield { type: "tool_start", toolName: tc.name, toolId: tc.id };
    yield {
      type: "tool_result",
      toolId: tc.id,
      result: tc.output,
      status: tc.status === "error" ? "error" : "success",
      durationMs: tc.durationMs,
    };
  }

  // Emit text
  if (result.response) {
    yield { type: "text", text: result.response };
  }

  // Emit complete
  yield {
    type: "complete",
    response: result.response,
    toolCalls: result.toolCalls,
    stats: result.stats,
  };
}

/**
 * Estimate cost for a request
 * Claude 3.5 Sonnet pricing (as of 2024):
 * - Input: $3 per million tokens
 * - Output: $15 per million tokens
 */
export function estimateCost(inputTokens: number, outputTokens: number): number {
  const inputCost = (inputTokens / 1_000_000) * 3;
  const outputCost = (outputTokens / 1_000_000) * 15;
  return inputCost + outputCost;
}
