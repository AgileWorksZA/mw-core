# Purchase Orders

## Overview
Purchase Orders are documents sent to suppliers to request goods or services. They track what has been ordered, received, and outstanding (backordered).

## Access Points
- Navigator: Day-to-day → Purchase Orders icon in Purchases and Expenses
- Transaction list sidebar: Orders → Purchase Orders

## List View
Standard transaction list filtered to Purchase Orders.

### Columns (Expected)
| Column | Description |
|--------|-------------|
| Order No. | PO number |
| Supplier | Supplier name |
| Description | Order description |
| Date | Order date |
| Due Date | Expected delivery |
| Gross | Order total |
| Status | Order status |

### Toolbar (Additional)
- **Receive** — Process goods receipt against this PO

## Purchase Order Form
Similar structure to Sales Order but supplier-focused:

### Header
| Field | Type | Description |
|-------|------|-------------|
| Supplier | Lookup | Supplier/creditor code |
| Order # | Text | PO number |
| Reference | Text | Supplier reference |
| To | Text | Delivery address |
| Description | Text | Order description |
| Date | Date | Order date |
| Due Date | Date | Expected delivery |
| Hold | Checkbox | Hold order |
| Make Recurring | Checkbox | Recurring setup |

### Line Items
| Column | Type | Description |
|--------|------|-------------|
| Item | Lookup | Item code |
| Order | Number | Quantity ordered |
| Received | Number | Quantity received so far |
| B/O | Number (display) | Backorder (Order - Received) |
| Description | Text | Line description |
| Unit Price | Currency | Purchase price |
| per | Text | Unit |
| Extension | Currency | Line total |
| TC | Dropdown | Tax code |

## Workflows
### Create PO
1. New → select Supplier → add items → OK

### Receive Goods
1. Select PO → click Receive (or use Receive Goods workflow)
2. Enter quantities received
3. Creates goods receipt and updates inventory

### Reorder
- Command → Reorder Products generates POs based on reorder levels
