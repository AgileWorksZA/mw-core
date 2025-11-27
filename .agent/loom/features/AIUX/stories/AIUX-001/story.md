# AIUX-001: AI Chat UX Overhaul & Custom MoneyWorks Tools

## Why (Root Motivation)

**Enable Claude to answer MoneyWorks questions directly via SDK instead of reverse-engineering the codebase each time.**

The current implementation uses generic Claude Code tools (Read, Write, Bash, Grep, Glob) which force Claude to explore the filesystem to answer simple accounting questions. A query like "list all accounts" triggers 10+ tool calls as Claude reads package.json, greps for imports, reads client source code, then finally discovers how to query the API.

**5 Whys Analysis:**
1. Why? Generic tools require codebase exploration instead of direct data access
2. Why? Each exploration adds latency, cost, and UI noise with irrelevant technical details
3. Why? Accountants want answers ("What's my trial balance?") not code spelunking
4. Why? SmartMoneyWorksClient already has efficient methods - tools should expose the API directly
5. Root: **Bridge semantic gap between business questions and MoneyWorks data**

## Description

This story transforms the packages/ai chat from a code-exploring agent into a purpose-built MoneyWorks assistant by:

1. **Replacing generic tools with MoneyWorks-specific tools:**
   - `mw_query` - Query any table with optional search filter
   - `mw_report` - Generate standard reports (trial balance, aged receivables, P&L)
   - `mw_eval` - Evaluate MWScript expressions
   - `mw_tables` - List available tables
   - `mw_schema` - Get field definitions for a table

2. **Fixing critical UX issues:**
   - Make chat container scrollable (currently broken)
   - Improve markdown rendering for assistant responses
   - Add collapsible tool call visualization
   - Show loading states without blocking UI

3. **Adding observability:**
   - Log all tool calls with timing and size
   - Display session stats (tool calls, tokens, cost)
   - Enable debug mode for development analysis

## Acceptance Criteria

- [ ] **AC-001**: Chat container is scrollable with auto-scroll to latest message on new content
- [ ] **AC-002**: Assistant messages render markdown properly (headers, code blocks, lists, tables)
- [ ] **AC-003**: Tool calls are displayed in collapsible sections showing name, input, output, timing, and status
- [ ] **AC-004**: mw_query tool exists that queries any MoneyWorks table (Account, Transaction, Name, Product, etc.) with optional search filter
- [ ] **AC-005**: mw_report tool generates common MoneyWorks reports (trial balance, aged receivables, P&L) via MWScript eval
- [ ] **AC-006**: mw_eval tool evaluates arbitrary MWScript expressions for custom calculations
- [ ] **AC-007**: mw_tables tool lists all available MoneyWorks tables with field counts
- [ ] **AC-008**: mw_schema tool returns field definitions for a given table (name, type, description, constraints)
- [ ] **AC-009**: Generic Claude Code tools (Read, Write, Bash, Grep, Glob) are removed or disabled
- [ ] **AC-010**: Debug logging captures all tool calls with: name, input summary, output size, duration ms
- [ ] **AC-011**: UI displays session stats: total tool calls, total tokens used, estimated cost
- [ ] **AC-012**: Query 'list all accounts' results in 1-2 tool calls (mw_query or mw_tables + mw_query), not 10+ file operations
- [ ] **AC-013**: System prompt instructs Claude to use MoneyWorks tools for data queries, not file exploration
- [ ] **AC-014**: TypeScript compilation passes with zero errors for all new tool files
- [ ] **AC-015**: Dev server starts successfully and chat UI loads without errors
- [ ] **AC-016**: Loading state shows animated indicator without blocking UI interaction

## Weave Knowledge

**Patterns Applied:**
- `E:anthropic-toolrunner-pattern` - Use toolRunner for automatic tool execution loops
- `E:betatool-json-schema-pattern` - Use betaTool with JSON Schema (not Zod) for React Router compatibility
- `E:multi-format-export-pattern` - Support multiple export formats for query results

**Pain Points to Avoid:**
- `Q:react-radix-type-conflict-painpoint` - Use native HTML elements if Radix causes type conflicts

**Best Practices:**
- `Pi:tool-error-string-pattern` - Return errors as strings, not exceptions
- `Pi:loom-full-cycle-delegation` - Complete story with retrospective and Weave updates

**Reference Implementation:**
- AITOOLS-001 at `packages/ai/app/lib/tools/` - betaTool pattern to adapt for MW tools

## Technical Design

### MoneyWorks Tools

```typescript
// mw_query - Query any table
{
  name: "mw_query",
  inputSchema: {
    table: "string (required) - Table name: Account, Transaction, Name, Product, etc.",
    search: "string (optional) - MoneyWorks search expression e.g. 'Type=`CA`'",
    limit: "number (optional, default 100) - Max records to return",
    format: "string (optional, default 'full') - compact | compact-headers | full | schema"
  }
}

// mw_report - Generate reports
{
  name: "mw_report",
  inputSchema: {
    report: "string (required) - trial_balance | aged_receivables | aged_payables | profit_loss",
    asOf: "string (optional) - Date in YYYYMMDD format, defaults to today"
  }
}

// mw_eval - Evaluate MWScript
{
  name: "mw_eval",
  inputSchema: {
    expression: "string (required) - MWScript expression to evaluate"
  }
}

// mw_tables - List available tables
{
  name: "mw_tables",
  inputSchema: {}
}

// mw_schema - Get table schema
{
  name: "mw_schema",
  inputSchema: {
    table: "string (required) - Table name"
  }
}
```

### UX Fixes

1. **Scrollable Chat**: Fix ScrollArea height calculation, ensure parent has defined height
2. **Markdown Rendering**: Use react-markdown with remarkGfm for GFM support
3. **Tool Call Display**: Collapsible component with timing info
4. **Loading State**: Animated spinner in message list

### Debug Logging

```typescript
interface ToolCallLog {
  timestamp: string;
  toolName: string;
  inputSummary: string;
  outputSize: number;
  durationMs: number;
  status: "success" | "error";
}
```

## Complexity: Complex
- Multiple new tools with SDK integration
- UX fixes across multiple components
- Debug/observability infrastructure
- System prompt refinement

## Priority: High
- Current UX is broken (non-scrollable chat)
- Tool call explosion makes the app unusable
- Blocks practical use as accounting assistant
