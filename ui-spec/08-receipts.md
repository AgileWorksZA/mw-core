# Receipts

## Overview
Receipts record money received from customers (or other sources). They can be allocated against outstanding invoices or posted as general receipts to a bank account.

## Access Points
- Navigator: Day-to-day → Receipts icon in Cash and Banking
- Transaction list sidebar: Transactions by Type → Receipts

## List View

### Columns (Default)
| Column | Description |
|--------|-------------|
| Status | Posted/Unposted |
| Reference | Receipt reference number |
| Bank | Bank account code |
| Name | Payer name (colour-coded) |
| From (Description) | Description / invoice references |
| Period | Accounting period |
| Date | Receipt date |
| Gross | Receipt amount |

### Visual Indicators
- **Red/blue text**: Colour-coded by customer colour
- **Description shows invoice numbers**: e.g., "Brown Suppliers (1871, 1875, 1880, 1884)" indicates which invoices the receipt was allocated against

### Toolbar Actions
| Action | Icon | Description |
|--------|------|-------------|
| New | + | New receipt |
| Modify | pencil | Edit |
| Duplicate | copy | Duplicate |
| Delete | trash | Delete |
| Export | export | Export |
| List | list | Toggle view |
| Related | link | Related records |
| Columns | grid | Customize |
| Details | document | Detail pane |
| Sum | Σ | Sum selection |
| Receipt | document | Print receipt |
| Cancel | X | Cancel/void receipt |

## Receipt Form

### Header
| Field | Type | Description |
|-------|------|-------------|
| Debtor | Lookup | Customer/debtor code |
| Reference | Text | Receipt reference / cheque number |
| Bank | Dropdown | Bank account (shows code + name + balance) |
| To | Text (expandable) | Payer details |
| Description | Text | Description |
| Period | Dropdown | Accounting period |
| Date | Date | Receipt date |
| Amount | Display | Receipt total |
| Paid By | Dropdown | Payment method (None, etc.) |
| Colour | Dropdown | Colour tag |
| Hold | Checkbox | Hold receipt |
| Make Recurring | Checkbox | Recurring setup |
| Setup | Button | Recurring configuration |

### Line Items — By Account View
| Column | Type | Description |
|--------|------|-------------|
| Account | Lookup | GL account code |
| Account Name | Display | Account name |
| Description | Text | Line description |
| Net | Currency | Net amount |
| TC | Dropdown | Tax code |
| HST | Currency | Tax amount |
| Gross | Currency | Gross amount |

### Line Items — By Item View
Same as Sales Invoice By Item view.

### Footer
| Field | Type | Description |
|-------|------|-------------|
| Total (Net) | Currency (display) | Total net |
| Total (HST) | Currency (display) | Total tax |
| Total (Gross) | Currency (display) | Total gross |

## Workflows

### Record Customer Payment
1. New receipt → select Debtor
2. System shows outstanding invoices for allocation
3. Enter amount and allocate against specific invoices
4. OK to save

### General Receipt
1. New receipt (no debtor)
2. Enter line items by Account
3. Post to bank account

### Batch Debtor Receipts
- Command → Batch Debtor Receipts
- Process multiple customer payments in one session

## Business Rules
- Bank account balance updates when receipt is posted
- Receipts can be allocated against specific invoices
- Description auto-populates with allocated invoice numbers
- Unallocated receipts sit as credits on customer account
