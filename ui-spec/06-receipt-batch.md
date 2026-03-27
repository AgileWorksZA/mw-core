# Receipt Batch

## Overview
Receipt Batch enables processing multiple customer payments in a single session. It streamlines the workflow of entering several receipts at once, typically when processing a bank deposit or batch of cheques.

## Access Points
- Navigator: Day-to-day → Receipt Batch icon (end of Sales and Income flow)
- Command menu: Batch Debtor Receipts (⌘⇧!)

## Workflow
1. Opens a batch entry interface
2. Select bank account for deposit
3. For each receipt:
   - Select customer/debtor
   - Enter amount received
   - Allocate against outstanding invoices
4. Save batch — creates individual Receipt transactions

## Business Rules
- Each entry in the batch creates a separate Receipt transaction
- Allocations update customer balances immediately on posting
- Bank account balance updates with total batch amount
- Useful for daily banking where multiple payments are deposited together
