# Receivables

## Overview
Receivables tracks amounts owed by customers (debtors). It provides aging analysis, overdue tracking, and links to receipt processing. The main view shows outstanding Sales Invoices filtered to those with unpaid balances.

## Access Points
- Navigator: Day-to-day → Receivables icon (shows overdue count badge, e.g., "96 overdue")
- Transaction list sidebar: Transactions by Status → Receivable

## List View
Uses the standard transaction list filtered to show receivable (unpaid) Sales Invoices.

### Key Columns
| Column | Description |
|--------|-------------|
| Status | Posted status |
| Invoice No. | Invoice number |
| Name | Customer name |
| Date | Invoice date |
| Due Date | Payment due date |
| Gross | Invoice total |
| AmtPaid | Amount received |
| Outstanding | Remaining balance (Gross - AmtPaid) |

### Visual Indicators
- **Red text**: Overdue items (past due date)
- **Badge on navigator**: Shows count of overdue invoices

## Related Functions
- **Age Debtor Balances**: Command menu — recalculates aging buckets
- **Print Statements**: Command menu — generate customer statements
- **Batch Debtor Receipts**: Command menu — process multiple receipts
- **Aged Receivables report**: From Names filter sidebar

## Business Rules
- Receivable = Posted Sales Invoice with Outstanding > 0
- Aging calculated from Due Date: Current, 1 cycle (30 days), 2 cycles (60 days), 3+ months
- Overdue = past Due Date and not fully paid
- Receipt allocation reduces Outstanding amount
- Fully paid invoices drop off the receivables list
