# Quotes

## Overview
Quotes are pre-sale documents that can be converted to Sales Orders or directly to Sales Invoices. They are part of the Sales and Income workflow and appear as the first step in the sales pipeline.

## Access Points
- Navigator: Day-to-day → Quotes icon in Sales and Income band
- Navigator: Sales and Income section
- Transaction list sidebar: Orders → Quotes
- Menu: (via New Transaction with Quote type selected)

## List View

### Columns (Default)
| Column | Description |
|--------|-------------|
| Quote No. | Sequential quote number |
| Name | Customer name |
| To (Description) | Description/attention line |
| Quote Date | Date quote was created |
| Expires | Expiry date of the quote |
| Analysis/Job | Job or analysis code |
| Gross | Gross total amount |

### Toolbar Actions
| Action | Icon | Description |
|--------|------|-------------|
| New | + icon | Create new quote |
| Modify | pencil | Edit selected quote |
| Duplicate | copy | Duplicate selected quote |
| Delete | trash | Delete selected quote |
| Export | export | Export selection |
| List | list | Toggle list/detail view |
| Related | link | View related transactions |
| Columns | grid | Customize visible columns |
| Details | document | Toggle detail pane |
| Process | gear | Process quote (convert to order/invoice) |
| Quote | document | Print/preview quote |
| Sum | Σ | Sum selected rows |

### Filter Sidebar
Shared transaction filter sidebar (see 01-app-shell.md), with "Quotes" pre-selected under Orders.

## Quote Form (New/Edit)

### Form Header
- **Type selector**: Dropdown on the document icon — allows switching transaction type
- **Reverse button**: Reverse the transaction
- **Info button**: View audit/history info
- **Fields toggle**: Show/hide additional fields
- **Add Note**: Attach a text note
- **Hold checkbox**: Mark quote as on hold
- **Image area**: Attach/view document image (top-right)

### Header Fields
| Field | Type | Description |
|-------|------|-------------|
| Customer | Lookup (autocomplete) | Customer code/name with search icon |
| Reference | Text | Auto-generated reference number (e.g., "0008") |
| Request # | Text | Customer's request/reference number |
| To | Text (expandable) | Attention/delivery address — has expand arrow |
| Description | Text | Free-text description |
| Date | Date | Quote date (defaults to today) |
| Due Date | Date | Due/expiry date |
| Colour | Dropdown | Colour tag (None, various colours) |
| Amount | Display | Calculated total (read-only display) |

### Line Items Grid
| Column | Type | Description |
|--------|------|-------------|
| Item | Lookup | Item code (lookup from Items register) |
| Qty | Number | Quantity (defaults to 1) |
| Description | Text | Line item description (auto-fills from item) |
| Unit Price | Currency | Unit price (auto-fills from item) |
| per | Text | Unit of measure |
| Disc.% | Percentage | Discount percentage |
| Extension | Currency | Calculated line total (Qty × Price - Discount) |
| TC | Dropdown | Tax code |

- Grid supports multiple rows with add/delete row buttons (+ and trash icons on right side)
- Tab navigation between cells
- Item lookup triggers auto-fill of Description, Unit Price, and TC

### Footer Section
| Field | Type | Description |
|-------|------|-------------|
| Freight Code | Lookup | Freight/shipping code |
| Docket | Text | Docket/shipping reference |
| Freight Amt | Currency | Freight amount |
| Subtot | Currency (display) | Subtotal before tax |
| HST | Currency (display) | Tax amount |
| Total | Currency (display) | Grand total |
| Total Cost of Goods | Currency (display) | COGS for quoted items |
| Total Margin | Currency (display) | Margin calculation |

### Process Bar (Bottom)
- **Status display**: "Process Quote: Enter Quote"
- **Process options** (radio buttons):
  - Quote — Save as quote
  - Sales Order — Convert to sales order
- **Navigation**: Prev, Next buttons (navigate between quotes)
- **Actions**: Cancel, OK buttons
- **Print button**: Print/preview (printer icon)

## Workflows

### Create Quote
1. Click New in toolbar or ⌘⇧N
2. Select/enter customer
3. Fill header fields (dates, description)
4. Add line items (item lookup, qty, price)
5. Click OK to save as quote

### Convert Quote to Sales Order
1. Open existing quote (double-click or Modify)
2. In Process bar, select "Sales Order" radio button
3. Click OK — quote is converted to a Sales Order

### Convert Quote to Invoice
1. Select quote in list
2. Click Process in toolbar
3. Follow processing wizard

### Duplicate Quote
1. Select quote in list
2. Click Duplicate or ⌘D
3. Modify as needed and save

## Business Rules
- Quote numbers are auto-generated sequentially
- Dates default to current date
- Line item amounts auto-calculate: Extension = Qty × Unit Price × (1 - Disc.%/100)
- Tax (HST) calculates based on tax code applied to each line
- Total = Subtot + HST + Freight Amt
- Margin = Subtot - Total Cost of Goods
- Quotes can be placed on Hold
- Quotes can be colour-coded for visual categorization
- Quotes can have notes attached
- Quotes can have document images attached
