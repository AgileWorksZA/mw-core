# Purchase Invoices

## Overview
Purchase Invoices record supplier bills. They create payable entries and update cost of goods. Structure mirrors Sales Invoices but for the purchasing side.

## Access Points
- Navigator: Day-to-day → Purchase Invoices icon
- Transaction list sidebar: Transactions by Type → Purchase Invoices
- Created from Receive Goods process

## List View
Standard transaction list. Toolbar includes Adjust button.

### Columns
| Column | Description |
|--------|-------------|
| Status | Posted/Unposted |
| Invoice No. | Supplier's invoice number |
| Order No. | Related PO number |
| Name | Supplier name |
| Description | Invoice description |
| Period | Accounting period |
| Date | Invoice date |
| Gross | Invoice total |
| AmtPaid | Amount paid |

## Purchase Invoice Form
Mirror of Sales Invoice form with supplier-specific fields:

### Header
| Field | Type | Description |
|-------|------|-------------|
| Creditor | Lookup | Supplier/creditor code |
| Invoice # | Text | Supplier's invoice number |
| Order # | Text | Linked PO reference |
| From | Text | Supplier details |
| Description | Text | Invoice description |
| Period | Dropdown | Accounting period |
| Date | Date | Invoice date |
| Due Date | Date | Payment due date |
| Amount | Display | Invoice total |

### Line Items
Same dual-mode as Sales Invoice:
- **By Account**: Account, Account Name, Description, Net, TC, HST, Gross
- **By Item**: Item, Qty, Description, Unit Price, per, Disc.%, Extension, TC

### Footer
- Subtot, HST, Total
- No margin calculation (that's a sales concept)

## Business Rules
- Invoice # is the supplier's reference (not auto-generated)
- Due Date calculated from creditor payment terms
- Posted invoices create payable entries
- Payments can be allocated against purchase invoices
- Outstanding = Total - AmtPaid
