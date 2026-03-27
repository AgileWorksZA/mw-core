# Customers and Suppliers (Names)

## Overview
MoneyWorks uses a unified "Names" register for both Customers and Suppliers. Each name record can be flagged as Customer, Supplier, or both. The same record can be a Debtor (credit customer) and/or Creditor (credit supplier).

## Access Points
- Navigator: Customers and Suppliers
- Right sidebar: Customers icon, Suppliers icon
- Name lookups from any transaction form

## List View (Names)

### Columns (Default)
| Column | Description |
|--------|-------------|
| Code | Unique name code (e.g., "AUTUMN", "BROWN") |
| Name | Full business/person name |
| Category | Category classification |
| Phone | Phone number |

### Visual Indicators
- **Colour-coded rows**: Names in red indicate overdue balances
- **Yellow highlight**: Selected record

### Toolbar
| Action | Icon | Description |
|--------|------|-------------|
| New | + | Create new name |
| Modify | pencil | Edit selected |
| Duplicate | copy | Duplicate |
| Delete | trash | Delete |
| Export | export | Export |
| List | list | Toggle view |
| Related | link | Related records |
| Columns | grid | Customize columns |

### Filter Sidebar
| Section | Items |
|---------|-------|
| **All** | Show all names |
| **Suppliers** | Cash-only Suppliers, Creditors (Credit Suppliers) |
| **Customers** | Cash-only Customers, Debtors (Credit Customers), Others |
| **Report on selection...** | |
| Age by Due Date | Aging report |
| Aged Payables | Supplier aging |
| Aged Receivables | Customer aging |
| Address List | Address report |
| Backorders by Customer | Outstanding orders |
| **Customer Sales** | |
| Customer Sales by Item | Sales breakdown by item per customer |
| Customer Sales by Month | Monthly sales per customer |
| Customer Sales Summary | Summary per customer |
| Individual Price List | Customer-specific pricing |
| **Supplier Purchases** | |
| Item by Supplier | Purchase analysis by supplier |
| Purchases over Time | Purchase trend |

## Name Record Form

### Header
| Field | Type | Description |
|-------|------|-------------|
| Type checkboxes | Checkboxes | Customer, Supplier, Debtor (we give credit), Creditor (they give credit), Other, Template |
| Code | Text | Unique code (e.g., "AUTUMN") |
| Name | Text | Full name |
| Colour | Dropdown with colour swatch | Colour tag (e.g., Orange) |

### Tabs

#### Balances Tab (Default view when opening existing record)
| Section | Fields |
|---------|--------|
| **Debtor aging** | 3 or more, 2 cycles, 1 cycle, Current, THEY OWE (all currency display) |
| **Creditor** | WE OWE (currency display) |
| Date of Last Sale | Date display |
| **Transaction History** | Table: Status, Type, OurRef, Description, Period, Date, Gross |
| Incomplete Only | Checkbox to filter transaction history |

#### Details Tab
| Field | Type | Description |
|-------|------|-------------|
| **Mailing Address** | Multi-line text | Street address (multiple lines) |
| **Delivery Address** | Multi-line text | Separate delivery address (copy button ">" to copy from mailing) |
| City | Text | City (both mailing and delivery) |
| Province | Text | Province/state |
| Post Code | Text | Postal/zip code |
| Country | Text | Country |
| Phone | Text | Phone number |
| Fax | Text | Fax number |
| Web URL | Text + Go button | Website URL with "Go" button to open in browser |
| GST# | Text | Tax registration number |
| Their Ref | Text | Customer's reference for us |
| Comment | Text area | Free-text notes |
| Region | Text | Geographic region (e.g., "North") |
| Type | Text | Customer type (e.g., "Retail") |
| Category3 | Text | Custom category |
| Category4 | Text | Custom category |
| Custom1-8 | Text | Eight custom fields |

#### Pricing & Terms Tab
| Section | Fields |
|---------|--------|
| **Pricing/Tax** | |
| Customer Discount | Percentage |
| Price Code | Dropdown (e.g., "Retail") |
| Override Tax Code | Dropdown (default: "No") |
| Currency | Dropdown (e.g., "CAD") |
| **Credit Hold** | Checkbox — "Puts all new transactions for this Name on hold" |
| SalesPerson | Text |
| **Debtor Control** | |
| Terms | Dropdown (e.g., "Next Month") + day-of-month spinner |
| Requires Order Number | Checkbox |
| Credit Limit | Currency |
| Receivables Acct | Lookup (account code, e.g., "1500") |
| **Prompt Payment Discount** | Dropdown (None) + days + Discount % |
| **Creditor Control** | |
| Terms | Dropdown + day-of-month |
| Payables Control | Lookup (account code) |
| Payment Method | Dropdown (e.g., "None") |
| Prompt Payment Discount | Dropdown + days + Discount % |

#### Bank and EDI Tab
| Field | Type | Description |
|-------|------|-------------|
| They pay by | Dropdown | Payment method (e.g., "Unknown") |
| Bank | Text | Bank name |
| Branch | Text | Branch name |
| Account Name | Text | Account holder name |
| **Electronic banking** | | |
| Account Number | Text | Bank account number for e-payments |
| E-Invoicing ID | Text | Electronic invoicing identifier |
| **Card details** | | |
| Card Number | Text | Credit/debit card number |
| Name | Text | Cardholder name |
| Expiry | Text | Card expiry date |

#### Contacts Tab
| Section | Description |
|---------|-------------|
| **Contact list** | Table with Name, Role columns — multiple contacts per name |
| **Contact detail** | Role (dropdown), Name, Salutation, Position, Phone/DDI, Mobile, After Hours, email (with action button), Memo |
| **Activity log** | Table with Date, Memo, Recall Date — for tracking interactions |

#### Autocode Tab
- Configuration for automatic code generation rules

## Business Rules
- Code must be unique across all names
- A name can be both Customer and Supplier simultaneously
- Debtor flag enables credit terms and receivables tracking
- Creditor flag enables payables tracking
- Credit Hold prevents new transactions
- Customer colour propagates to transaction lists (colour-coded rows)
- Aging buckets auto-calculate from outstanding invoices
- Transaction History shows all related transactions
- Multiple contacts can be stored per name
- Activity log supports CRM-style interaction tracking
