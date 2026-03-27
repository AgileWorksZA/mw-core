# Account Enquiry

## Overview
Account Enquiry provides a detailed drill-down into any GL account, showing transactions, balances, and movements for selected periods.

## Access Points
- Right sidebar: Account Enquiry icon
- Enquiries menu: Account Enquiry (⌘E)
- Chart of Accounts navigator: Account Enquiry icon
- Accounts list toolbar: Enquiry button

## Features
- Select account by code or name
- View transactions for a specific period or date range
- Opening balance, movements (debits/credits), closing balance
- Drill down to individual transactions
- Navigate between periods

## Layout (Expected)
| Section | Description |
|---------|-------------|
| Account selector | Dropdown/lookup for GL account |
| Period selector | Period dropdown or date range |
| Opening Balance | Balance at start of period |
| Transaction list | Date, Reference, Name, Description, Debit, Credit, Balance |
| Closing Balance | Balance at end of period |
| Total Debits / Credits | Period totals |

## Business Rules
- Shows only posted transactions
- Running balance calculated from opening balance
- Can navigate forward/back through periods
- Double-click transaction to open source record
