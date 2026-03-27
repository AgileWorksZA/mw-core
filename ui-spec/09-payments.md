# Payments

## Overview
Payments record money paid to suppliers (or other payees). They debit the payables account and credit the bank. Can be allocated against outstanding purchase invoices.

## Access Points
- Navigator: Day-to-day → Payments icon in Cash and Banking
- Transaction list sidebar: Transactions by Type → Payments

## List View

### Columns (Default)
| Column | Description |
|--------|-------------|
| Status | Posted/Unposted |
| Reference | Cheque/payment reference |
| Bank | Bank account code |
| Name | Supplier name |
| To (Description) | Description |
| Period | Accounting period |
| Date | Payment date |
| Gross | Payment amount |
| Type | Transaction type (e.g., "Payment") |

### Toolbar Actions
| Action | Icon | Description |
|--------|------|-------------|
| New | + | New payment |
| Modify | pencil | Edit |
| Duplicate | copy | Duplicate |
| Delete | trash | Delete |
| Export | export | Export |
| List | list | Toggle view |
| Related | link | Related records |
| Columns | grid | Customize |
| Details | document | Detail pane |
| Sum | Σ | Sum |
| Cancel | X | Cancel/void payment |

## Payment Form

### Header
| Field | Type | Description |
|-------|------|-------------|
| Supplier | Lookup | Supplier/creditor code (checkbox to left) |
| Cheque # | Text | Cheque number or payment reference |
| Bank | Dropdown | Bank account (shows code: name: balance, e.g., "1000: Main Bank Account: 8,221.85") |
| To | Text (expandable) | Payee details |
| Description | Text | Payment description |
| Period | Dropdown | Accounting period with date range |
| Date | Date | Payment date |
| Amount | Display | Payment total |
| Paid By | Dropdown | Payment method (None, etc.) |
| Colour | Dropdown | Colour tag |
| Hold | Checkbox | Hold payment |
| Make Recurring | Checkbox | Recurring setup |
| Setup | Button | Recurring configuration |

### Line Items — By Account View
| Column | Type | Description |
|--------|------|-------------|
| Account | Lookup | GL account code |
| Account Name | Display | Account name (auto-fills) |
| Description | Text | Line description |
| Net | Currency | Net amount |
| TC | Dropdown | Tax code |
| HST | Currency | Tax amount |
| Gross | Currency | Gross amount |

### Line Items — By Item View
Standard item grid layout.

### Footer
| Field | Type | Description |
|-------|------|-------------|
| Total (Net) | Currency (display) | Sum of Net |
| Total (HST) | Currency (display) | Sum of HST |
| Total (Gross) | Currency (display) | Sum of Gross |

## Workflows

### Pay Supplier
1. New → select Supplier
2. System shows outstanding purchase invoices
3. Allocate payment against invoices
4. OK to save

### General Payment (Expense)
1. New → leave Supplier blank
2. Enter account lines (e.g., rent, utilities)
3. Specify bank account
4. Post

### Batch Creditor Payments
- Command → Batch Creditor Payments (⌘Y)
- Select suppliers to pay, system generates payment batch

### Electronic Payments
- Command → Electronic Payments
- Generates e-payment file for bank upload

## Business Rules
- Bank dropdown shows current account balance
- Cheque # auto-increments for cheque-based payments
- Payments reduce bank balance and supplier outstanding
- Can allocate against specific purchase invoices
- Unallocated payments sit as credits on supplier account
- Recurring payments generate automatically
