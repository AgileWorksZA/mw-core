# Items and Inventory

## Overview
The Items register manages products, resources, time entries, shipping methods, and other sellable/purchasable items. Items link to GL accounts for automated posting and support multi-tier pricing, inventory tracking, and bill of materials.

## Access Points
- Navigator: Items and Inventory
- Right sidebar: Items icon
- Item lookups from transaction line items

## List View

### Columns (Default)
| Column | Description |
|--------|-------------|
| Code | Item code (e.g., "BA100") |
| Description | Item description |
| Unit Price | Selling price |
| (unit) | Unit of measure (e.g., "ea") |
| Stock on Hand | Current stock quantity |

### Toolbar
| Action | Icon | Description |
|--------|------|-------------|
| New | + | Create new item |
| Modify | pencil | Edit selected |
| Duplicate | copy | Duplicate |
| Delete | trash | Delete |
| Export | export | Export |
| List | list | Toggle view |
| Related | link | Related records |

### Filter Sidebar
| Section | Items |
|---------|-------|
| **All Items** | Show all |
| Products | Physical products |
| Resources | Service/resource items |
| Time | Time-based items |
| Ship Methods | Shipping/freight methods |
| Other | Miscellaneous |
| **Stocktake** | Inventory count tools |
| **Report on selection...** | |
| Backorders by Product | Outstanding orders report |
| Item Sales | Sales analysis by item |

## Item Record Form

### Header
| Field | Type | Description |
|-------|------|-------------|
| Product Code | Text | Unique item code |
| Name | Text | Item name/description |
| Class | Dropdown | Product, Resource, Time, Ship Method, Other |
| Material | Text | Material category field |
| Size | Text | Size attribute |
| Style | Text | Style attribute (e.g., "Plain") |
| Category4 | Text | Custom category |
| Colour | Dropdown | Colour tag |
| Image | Image area | Product photo (drag to add) |

### Tabs

#### Details Tab
| Section | Fields |
|---------|--------|
| **Flags** | |
| We Buy This | Checkbox — item appears in purchase transactions |
| We Sell It | Checkbox — item appears in sales transactions |
| We Count It | Checkbox — physical inventory counting |
| We Stock It and treat inventory as asset | Checkbox — track as inventory asset |
| **Control Accounts** | |
| Cost-of-Goods Expense Acct | Account lookup (e.g., "6000") → Purchases |
| Income Account when Selling | Account lookup (e.g., "4000") → Sales |
| Asset Account for Stock | Account lookup (e.g., "1300") → Stock On Hand |
| Append Salesperson (Purchases) | Checkbox |
| Append Salesperson (Sales) | Checkbox |
| **Other** | |
| Comment | Text area |
| Barcode | Text |
| Image | Drag-and-drop area — "no picture, drag an image..." |
| Custom1-8 | Eight custom text fields |

#### Buying Info Tab
| Field | Type | Description |
|-------|------|-------------|
| Supplier | Lookup | Default supplier |
| Supplier's Code | Text | Supplier's item code |
| Buy Price | Currency | Default purchase price |
| per | Text | Purchase unit |
| Buy Tax Code | Dropdown | Purchase tax code |
| Plussage | Currency | Additional cost per unit (landed cost) |
| Reorder Level | Number | Minimum stock before reorder |
| Reorder Quantity | Number | Default reorder quantity |
| Lead Time | Number | Days lead time |

#### Selling Info Tab
| Section | Fields |
|---------|--------|
| **Selling Prices** | |
| Multiple Prices | Checkbox — enable multiple price tiers |
| Quantity price breaks | Checkbox — volume discounts |
| Additional units only | Checkbox |
| **Price Tiers** (when Multiple Prices enabled) | |
| Retail | Price, per, Unit, Tax Excl/Incl toggle |
| Wholesale | Price, per, Unit, Tax Excl/Incl toggle |
| Price C | Price, per, Unit, Tax Excl/Incl toggle |
| Price D | Price, per, Unit, Tax Excl/Incl toggle |
| Price E | Price, per, Unit, Tax Excl/Incl toggle |
| Unused | Price, per, Unit, Tax Excl/Incl toggle |
| Override Tax Code | Dropdown |
| **Discount** | |
| Discount | Dropdown (None) + percentage — optional discount |
| Item weight | Number |
| **Margin** | |
| Buy is | Currency display — current buy price |
| Plussage | Currency display |
| Markup for sell price A | Percentage display |
| Warn if Markup less than | Dropdown (Markup) + percentage threshold |

#### Inventory Tab
| Field | Type | Description |
|-------|------|-------------|
| Stock on Hand | Number display |
| Committed | Number display — allocated to orders |
| Available | Number display — SOH minus committed |
| On Order | Number display — on purchase orders |
| Average Cost | Currency display |
| Last Cost | Currency display |
| Stock Value | Currency display |

#### History Tab
- Transaction history showing all sales and purchases of this item
- Columns: Date, Type, Reference, Customer/Supplier, Qty, Price, Total

#### Costing Tab
| Field | Type | Description |
|-------|------|-------------|
| Costing Method | Dropdown | Average, FIFO, Standard, etc. |
| Standard Cost | Currency | For standard costing |

#### BOM (Bill of Materials) Tab
- Component list for manufactured/assembled items
- Columns: Item Code, Description, Quantity
- Used with Command → Build Product

## Business Rules
- Item codes must be unique
- Class determines behavior (Product tracks stock, Time tracks hours, etc.)
- Control accounts auto-post journal entries on transactions
- Price Code on customer record selects which price tier applies
- Multiple Prices enables up to 6 named price tiers
- SOH decreases on Sales Invoice post, increases on Purchase Invoice post
- Negative SOH is allowed (for items not yet received)
- Margin warnings trigger when sell price falls below threshold
- BOM enables manufacturing/assembly builds
