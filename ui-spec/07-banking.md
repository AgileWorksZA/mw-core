# Banking (Deposit Processing)

## Overview
The Banking screen is specifically a **deposit slip processor** — it transfers receipts from a holding account (unbanked receipts) into the main bank account. This is NOT a general bank transaction viewer (that's the Account Enquiry Movements tab).

## Access Points
- Navigator: Day-to-day → Banking icon
- Command menu: Banking... (⌘B)

## Form Layout

### Header
| Field | Type | Description |
|-------|------|-------------|
| Deposit from | Dropdown | Source holding account (e.g., "1010: Unbanked: 0.00") |

### Transaction List
Shows unbanked receipt transactions waiting to be deposited.

| Column | Description |
|--------|-------------|
| Date | Transaction date |
| Description | Receipt description |
| Analysis | Analysis/job code |
| Reference | Receipt reference |
| Amount | Receipt amount |

Items can be selected (ticked) for inclusion in the deposit.

### Summary Section
| Field | Type | Description |
|-------|------|-------------|
| Amount Selected | Currency (display) | Sum of selected transactions |
| Transfer | Currency + checkbox | Cash transfer amount |
| of cash to | Dropdown | Target bank account (e.g., "1000: Main Bank Account: 8,221.85") |
| Transfer | Currency + checkbox | Deposit fees |
| deposit fees to | Account lookup | Fee account |
| **Net Deposit** | Currency (display) | Amount Selected - fees |
| to | Dropdown | Destination bank account |

### Actions
| Button | Description |
|--------|-------------|
| Print... | Print deposit slip |
| Cancel | Close without depositing |
| Deposit... | Execute the deposit (moves money from holding to bank account) |

## Workflow
1. Open Banking screen
2. Select holding/unbanked account
3. System shows pending receipts
4. Tick receipts to include in this deposit
5. Optionally set cash transfer amount and deposit fees
6. Click Deposit to process
7. Creates journal entry: Debit Bank Account, Credit Holding Account

## Business Rules
- Only shows transactions in the selected holding account
- Receipts-for-Banking holding accounts (configured in Account > Bank Settings) feed into this
- Net Deposit = Amount Selected - fees
- Deposit creates a journal transferring funds
- Deposit slip can be printed for the bank
