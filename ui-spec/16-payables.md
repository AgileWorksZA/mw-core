# Payables

## Overview
Payables tracks amounts owed to suppliers (creditors). Shows outstanding Purchase Invoices and provides aging analysis. Badge on navigator shows overdue count.

## Access Points
- Navigator: Day-to-day → Payables icon (shows "17 overdue" badge)
- Transaction list sidebar: Transactions by Status → Payable

## List View
Standard transaction list filtered to payable Purchase Invoices.

### Visual Indicators
- **Red text**: Overdue items
- **Badge**: Count of overdue payables on navigator icon

## Related Functions
- **Batch Creditor Payments** (⌘Y): Generate batch payment run
- **Electronic Payments**: Generate e-payment file
- **Aged Payables report**: From Names filter sidebar
- **Age Debtor Balances**: Recalculate aging

## Business Rules
- Payable = Posted Purchase Invoice with Outstanding > 0
- Aging from Due Date: Current, 1 month, 2 months, 3+ months
- Payment allocation reduces outstanding
- Fully paid invoices drop off payables list
