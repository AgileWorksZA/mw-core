# Funds Transfer

## Overview
Funds Transfer moves money between bank accounts within the same entity. Creates a debit in one bank account and a matching credit in another.

## Access Points
- Navigator: Day-to-day → Funds Transfer icon in Cash and Banking
- Command menu: Transfer Funds... (⌘⇧F)

## Form Fields
| Field | Type | Description |
|-------|------|-------------|
| From Account | Dropdown | Source bank account |
| To Account | Dropdown | Destination bank account |
| Amount | Currency | Transfer amount |
| Date | Date | Transfer date |
| Reference | Text | Reference number |
| Description | Text | Transfer description |

## Business Rules
- Creates two linked journal entries (debit + credit)
- Both accounts must be bank-type accounts
- Updates both account balances on posting
- Appears in both accounts' Banking view
