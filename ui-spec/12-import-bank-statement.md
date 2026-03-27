# Import Bank Statement

## Overview
Imports electronic bank statement files (OFX, QIF, CSV formats) to auto-create transactions and assist with reconciliation.

## Access Points
- Navigator: Day-to-day → Import Bank Statement icon
- Command menu: Load Bank Statement...

## Workflow
1. Select bank account
2. Choose statement file (OFX, QIF, CSV)
3. System parses transactions
4. Review imported transactions — system attempts to match against existing records
5. For unmatched items: create new transactions or manually match
6. Confirm import

## Features
- Auto-matching against existing transactions
- Rule-based auto-allocation for recurring items
- Create receipts/payments directly from imported lines
- Supports standard banking file formats

## Business Rules
- Duplicate detection prevents importing same transaction twice
- Auto-allocation rules (Edit menu) can pre-assign accounts to recurring payees
- Unmatched items remain for manual review
- Imported transactions are created as unposted by default
