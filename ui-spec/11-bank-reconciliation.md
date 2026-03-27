# Bank Reconciliation

## Overview
Bank Reconciliation matches transactions in MoneyWorks against a bank statement to verify the bank balance. Two-phase workflow: setup dialog then interactive reconciliation screen.

## Access Points
- Navigator: Day-to-day → Bank Reconciliation icon
- Command menu: Bank Reconciliation...
- To Do board: Regular column → Bank Reconciliation

## Phase 1: Setup Dialog

### Fields
| Field | Type | Description |
|-------|------|-------------|
| Bank | Dropdown | Bank account (e.g., "1000: Main Bank Account: 8,221.85" — shows current balance) |
| Statement Date | Date | Closing date of the bank statement |
| Statement Number | Number | Statement sequence number (auto-increments) |
| Opening Balance | Currency + Change... button | Opening balance (carried from previous reconciliation) |
| Closing Balance | Currency | Closing balance per the bank statement |
| Include Unposted Transactions | Checkbox | Whether to include unposted items |

### Actions
- **Load Old...** — Load a previously saved reconciliation
- **Cancel** — Abort
- **Reconcile...** — Proceed to reconciliation screen

## Phase 2: Reconciliation Screen

### Header
- Account name and number (e.g., "1000: Main Bank Account")
- "Page 2, transactions entered before: 2015-01-31"
- Statement Open: amount

### Top Panel — Statement Items
Items from the bank statement (if imported), or manual entry area.

| Column | Description |
|--------|-------------|
| Type | Transaction type |
| Date | Transaction date |
| Analysis | Analysis/job code |
| Stat | Status |
| Reference | Reference number |
| Deposit | Deposit amount |
| Withdrawal | Withdrawal amount |
| Balance | Running balance |

### Summary Section
| Field | Description |
|-------|-------------|
| Amount Processed | Total of matched/ticked items |
| Calculated Closing | Opening + processed = expected closing |
| Statement Close | Target closing balance |
| **Difference** | Statement Close - Calculated Closing (**target: 0.00**) |

### Bottom Panel — Unreconciled Transactions
MoneyWorks transactions not yet matched to the statement.

| Column | Description |
|--------|-------------|
| OK | Checkbox — tick to mark as reconciled |
| Type | Transaction type |
| Date | Transaction date |
| Description | Transaction description |
| Analysis | Analysis/job code |
| Stat | Status |
| Reference | Reference number |
| Amount | Transaction amount |

### Mode Toggle (Bottom-right)
- **Select** — Click to select items
- **Reconcile** — Click to tick/reconcile items

### Actions (Right side)
| Button | Description |
|--------|-------------|
| Start Over | Reset all reconciliation progress |
| Finish Later | Save current progress and exit |
| Cancel | Abort without saving |
| Print | Print reconciliation report |
| Finish | Complete reconciliation (only when Difference = 0.00) |

## Workflow
1. Enter bank statement details (date, closing balance)
2. System shows unreconciled MW transactions in bottom panel
3. Tick items that appear on the bank statement
4. Amount Processed updates, Difference recalculates
5. Goal: Difference = 0.00
6. If using Import Bank Statement, items auto-populate top panel for matching
7. Click Finish when balanced

## Business Rules
- Only bank accounts with "Must be Reconciled" flag appear
- Opening balance carries forward from previous reconciliation
- Statement Number auto-increments
- "Finish Later" saves progress — can resume later via "Load Old..."
- Difference must be 0.00 to Finish (cannot close an unbalanced reconciliation)
- Reconciled items are permanently marked
- Transactions after the statement date are excluded
