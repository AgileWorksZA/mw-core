# Sales Orders

## Overview
Sales Orders are confirmed customer orders that track fulfillment status. They sit between Quotes and Sales Invoices in the sales pipeline and add inventory management (stock on hand, backorders, shipping).

## Access Points
- Navigator: Day-to-day → Sales Orders icon
- Transaction list sidebar: Orders → Sales Orders
- Converted from a Quote

## List View

### Columns (Default)
| Column | Description |
|--------|-------------|
| Quote No. | Original quote number (if converted from quote) |
| Order No. | Sales order number |
| Name | Customer name |
| To (Description) | Description/attention line |
| Date | Order date |
| Gross | Gross total |

### Toolbar Actions
Same as Quotes, plus:
| Action | Icon | Description |
|--------|------|-------------|
| Ship | truck | Ship/fulfill order lines |
| Reorder | refresh | Generate reorder for stock items |
| Order | document | Print/preview order document |

## Sales Order Form

### Header (Differences from Quote)
| Field | Type | Description |
|-------|------|-------------|
| Customer | Lookup | Customer code/name |
| Quote/SO # | Text | Quote reference (if converted) |
| Order # | Text | Customer's order number |
| To | Text (expandable) | Delivery/attention |
| Description | Text | Free-text description |
| Date | Date | Order date |
| Due Date | Date | Expected delivery date |
| Colour | Dropdown | Colour tag |
| Order Total | Display | Calculated order total |
| **Hold** | Checkbox | Place order on hold |
| **Make Recurring** | Checkbox | Set up as recurring order |
| **Setup** | Button | Configure recurring settings |

### Line Items Grid (Extended from Quote)
| Column | Type | Description |
|--------|------|-------------|
| Item | Lookup | Item code |
| Order | Number | Quantity ordered |
| SOH | Number (display) | Stock on Hand (read-only) |
| Ship | Number | Quantity to ship this time |
| B/O | Number (display) | Backorder quantity |
| Done | Number (display) | Quantity already shipped |
| Description | Text | Line description |
| Unit Price | Currency | Unit price |
| per | Text | Unit of measure |
| Disc.% | Percentage | Discount |
| Extension | Currency | Line total |
| TC | Dropdown | Tax code |

### Tab Views
- **All Order Lines** — Shows all line items
- **Backorders** — Filters to show only backordered items

### Footer (Differences from Quote)
| Field | Type | Description |
|-------|------|-------------|
| Freight Code | Lookup | Freight/shipping code |
| Docket | Text | Docket/shipping reference |
| Freight Amt | Currency | Freight charge |
| Subtot | Currency (display) | Subtotal |
| HST | Currency (display) | Tax |
| **Shipment Total** | Currency (display) | Total for current shipment (replaces "Total") |
| Total Cost of Goods | Currency (display) | COGS |
| Total Margin | Currency (display) | Margin |

### Process Bar
- **Status**: "Process Order: Enter Order"
- **Options** (radio buttons):
  - Quote — Convert back to quote
  - Sales Order — Save as sales order

## Workflows

### Create Sales Order
1. New → fill customer, items, quantities
2. OK saves as Sales Order

### Ship Order
1. Select order → Ship button in toolbar
2. Or: Open order, set Ship quantities for each line
3. Creates corresponding Sales Invoice for shipped items

### Partial Shipment
- Set Ship quantity less than Order quantity
- Remaining goes to B/O (backorder)
- Order remains open until fully shipped

### Make Recurring
1. Check "Make Recurring" checkbox
2. Click Setup to configure frequency, next date, etc.
3. System auto-generates orders on schedule

## Business Rules
- SOH (Stock on Hand) shows live inventory at time of viewing
- B/O = Order - Ship - Done
- Order is complete when all lines have Done = Order qty
- Shipment Total reflects only the current shipment value
- Backorders tab provides quick view of unfulfilled items
- Orders can be placed on Hold
- Recurring orders auto-generate on schedule
