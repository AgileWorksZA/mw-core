# Sales Invoices

## Overview
Sales Invoices are the core revenue document. They record sales to customers, calculate tax, and create receivable entries. Posted invoices update the general ledger and debtor balances.

## Access Points
- Navigator: Day-to-day → Sales Invoices icon
- Transaction list sidebar: Transactions by Type → Sales Invoices
- Created from shipping a Sales Order
- Created directly via New

## List View

### Columns (Default)
| Column | Description |
|--------|-------------|
| Status | P (Posted), U (Unposted) |
| P | Posted indicator |
| Invoice No. | Sequential invoice number |
| Order No. | Linked order number |
| Name | Customer name (colour-coded by customer colour) |
| To (Description) | Description line |
| Period | Accounting period (e.g., "Dec") |
| Date | Invoice date |
| Gross | Gross total |
| AmtPaid | Amount paid against this invoice |

### Visual Indicators
- **Red text**: Overdue invoices (past due date with outstanding balance)
- **Colour-coded names**: Customer name shown in their assigned colour
- **Status column**: P = Posted, blank/U = Unposted

### Toolbar Actions
| Action | Icon | Description |
|--------|------|-------------|
| New | + | Create new invoice |
| Modify | pencil | Edit selected |
| Duplicate | copy | Duplicate invoice |
| Delete | trash | Delete (unposted only) |
| Export | export | Export selection |
| List | list | Toggle view |
| Related | link | View related records |
| Columns | grid | Customize columns |
| Details | document | Toggle detail pane |
| Invoice | document | Print/preview invoice |
| Sum | Σ | Sum selection |
| Adjust | wrench | Adjustments |

## Sales Invoice Form

### Header
| Field | Type | Description |
|-------|------|-------------|
| **Debtor** | Lookup (autocomplete) | Customer/debtor code with search icon |
| Invoice # | Text | Auto-generated invoice number |
| Order # | Text | Linked order reference |
| To | Text (expandable) | Delivery/attention address |
| Description | Text | Invoice description |
| **Period** | Dropdown | Accounting period (e.g., "Dec:2024/25 ends 2024-12-31") with navigation arrows |
| Date | Date | Invoice date |
| Due Date | Date | Payment due date |
| Amount | Display | Invoice total (read-only) |
| Colour | Dropdown | Colour tag |
| **Hold** | Checkbox | Hold invoice |
| **Make Recurring** | Checkbox | Set up recurring |
| **Setup** | Button | Recurring configuration |

### Posted Indicator
- When posted: Shows a "POSTED" rubber stamp graphic overlay on the form
- Posted invoices cannot be edited (fields are read-only)

### Image Area
- Top-right corner: Area to attach/view scanned document image

### Line Items — Two View Modes

#### By Account View
| Column | Type | Description |
|--------|------|-------------|
| Account | Lookup | GL account code |
| Account Name | Display | Account name (auto-fills) |
| Description | Text | Line description |
| Net | Currency | Net amount (excl. tax) |
| TC | Dropdown | Tax code |
| HST | Currency (display) | Tax amount |
| Gross | Currency (display) | Gross amount (incl. tax) |

#### By Item View
| Column | Type | Description |
|--------|------|-------------|
| Item | Lookup | Item code |
| Qty | Number | Quantity |
| Description | Text | Line description |
| Unit Price | Currency | Unit price |
| per | Text | Unit of measure |
| Disc.% | Percentage | Discount |
| Extension | Currency | Line total |
| TC | Dropdown | Tax code |

### Footer
| Field | Type | Description |
|-------|------|-------------|
| Total Cost of Goods | Currency (display) | COGS for invoiced items |
| Total Margin | Currency/Percentage (display) | e.g., "$651.02 / 67%" |
| Subtot | Currency (display) | Subtotal before tax |
| HST | Currency (display) | Tax total |
| Total | Currency (display) | Grand total |

### Navigation
- Prev / Next buttons to navigate between invoices
- Cancel / OK buttons
- Print button (printer icon)

## Workflows

### Create Invoice Directly
1. Click New in toolbar
2. Select Debtor (customer)
3. Choose By Account or By Item mode
4. Enter line items
5. OK to save (unposted)
6. Post via Command → Post/Ship/Receive (⌘K)

### Create from Sales Order
- Shipping a sales order automatically creates a sales invoice

### Post Invoice
- Posting updates GL, creates receivable entry
- Posted invoices show "POSTED" stamp
- Posted invoices cannot be edited

### Reverse Invoice
- Use Reverse button to create a credit note / reversal

### Recurring Invoices
- Check "Make Recurring" and configure via Setup
- System generates invoices automatically

## Business Rules
- Invoice numbers are auto-generated sequentially
- Period defaults to current open period
- Due Date calculated from customer's payment terms
- Margin = Subtot - Total Cost of Goods
- Margin percentage = Margin / Subtot × 100
- Unposted invoices can be edited/deleted
- Posted invoices are locked — must be reversed to correct
- AmtPaid tracks payments received against the invoice
- Outstanding = Total - AmtPaid
