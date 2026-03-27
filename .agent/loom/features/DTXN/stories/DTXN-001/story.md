# DTXN-001: Daily Transaction Summary Report & Artifact

## Why (Root Motivation)

Enable instant daily financial pulse-check through the AI interface, reducing friction for real-time business insight without switching to MoneyWorks directly.

**5 Whys Analysis:**
1. Why? User wants a daily transaction summary report in the AI assistant.
2. Why? They need quick visibility into daily financial activity without opening MoneyWorks.
3. Why? The current workflow requires switching between apps, breaking productivity.
4. Why? Real-time financial awareness is critical for business decision-making.
5. Root: **Enable instant daily financial pulse-check through the AI interface**

## Description

Implement a new 'daily-transaction-summary' artifact type for the MoneyWorks AI assistant. This artifact displays a P&L-style daily summary with the following sections:

**Income Statement Sections:**
- Sales (revenue accounts)
- Less: Cost of Sales (COGS accounts)
- Gross Margin (with percentage)
- Other Income
- Net Income (before expenses)
- Expenses
- Surplus (Deficit) - bottom line

**Balance Position Changes:**
- Bank balances change (with ending balance)
- Receivables change (with ending balance)
- Payables change (with ending balance)

**Sample Output (from MoneyWorks):**
```
Acme Widgets Ltd
Daily summary report for all transactions entered on 2025-01-31

Sales
    Total Sales    $1,500.00

Less: Cost of Sales
    Total Cost of Sales    $750.00

    Gross Margin (50%)    $750.00

Other Income
    Total Other Income    $100.00

    Net Income    $850.00

Expenses
    Total Expenses    $200.00

Surplus (Deficit)        $650.00

        Balance (2025-01-31)
Bank balances increased by $500.00        $8,978.97
Receivables increased by $1,000.00        $52,681.57
Payables decreased by $350.00        $13,250.01
```

**Implementation Pattern:**
Follow the established artifact pattern from ARTF-001:
1. Add TypeScript types to `types.ts`
2. Create React component in `artifacts/`
3. Update `artifact-renderer.tsx`
4. Enhance `mw-report.ts` tool
5. Update system prompt documentation

## Acceptance Criteria

- [ ] **AC-001**: ArtifactType union in types.ts includes 'daily-transaction-summary'
- [ ] **AC-002**: DailyTransactionSummaryData interface defines all P&L sections with proper TypeScript types
- [ ] **AC-003**: DailyTransactionSummaryData includes balance change indicators for Bank, Receivables, Payables
- [ ] **AC-004**: isDailyTransactionSummaryData type guard function correctly identifies the data type
- [ ] **AC-005**: DailyTransactionSummary React component renders P&L-style summary matching MW format
- [ ] **AC-006**: Balance change section displays changes with visual indicators (arrows, colors)
- [ ] **AC-007**: ArtifactRenderer.tsx includes case for 'daily-transaction-summary' with type guard
- [ ] **AC-008**: mw_report tool includes 'daily_transaction_summary' in REPORT_DEFINITIONS
- [ ] **AC-009**: Report queries Transaction/Detail tables for specified date, aggregates by account type
- [ ] **AC-010**: Report calculates balance changes for bank, receivables, and payables
- [ ] **AC-011**: TypeScript compilation passes with zero errors
- [ ] **AC-012**: AI can generate and display artifact via natural language request

## Weave Knowledge

**Patterns Applied:**
- `E:discriminated-union-rendering-pattern` - Use discriminated union with type guards for type-safe artifact rendering
- `E:artifact-code-block-pattern` - AI returns artifact data in fenced code blocks, parsed by frontend
- `E:dual-entity-parent-child-pattern` - Transaction header + Detail line items require coordinated queries

**Best Practices to Follow:**
- `Q:multi-format-support` - Support multiple data representations
- `Q:preserve-canonical-dsl` - Use exact MoneyWorks terminology (e.g., Gross, RecAccount, PaidAccount)

**Reference Implementation:**
- `packages/ai/app/components/artifacts/executive-summary.tsx` - Similar P&L-style layout with metrics grid
- `packages/ai/app/lib/tools/mw-report.ts` - Existing report generation pattern with bank_reconciliation_status

## Technical Notes

**MoneyWorks Account Types for P&L:**
- Sales/Revenue: Type = 'IN' (Income)
- Cost of Sales: Type = 'CS' (Cost of Sales)
- Other Income: Type = 'OI' (Other Income)
- Expenses: Type = 'EX' (Expense)

**Balance Position Tracking:**
- Bank: Accounts with Type = 'BK' or 'CA' with bank account number
- Receivables: Sum of Detail postings to RecAccount
- Payables: Sum of Detail postings to PaidAccount

**Date Filtering:**
- Transaction.EntryDate = target date (YYYYMMDD format)
- Default to current date if not specified

## Complexity: Moderate (4-8h)

**Rationale:**
- 5 files to modify/create across types, component, renderer, tool
- Moderate data aggregation logic for P&L structure
- Pattern well-established from existing artifacts (low uncertainty)

## Priority: High

**Rationale:**
- High user value - quick daily financial insight
- Builds on proven artifact infrastructure
- Demonstrates AI assistant value for financial reporting
