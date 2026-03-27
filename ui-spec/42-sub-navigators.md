# Sub-Navigator Views — Detailed Workflow Maps

## Overview
Each major functional area has a detailed sub-navigator view (beyond the simplified Day-to-day view) that reveals the complete workflow including secondary actions, adjustment paths, and cross-links.

## Sales and Income Sub-Navigator

### Primary Flow
`Quotes ↔ Sales Orders → Process Order → Sales Invoices → Receivables → Receipt Batch / One off Receipt`

### Secondary Entities
| Entity | Description |
|--------|-------------|
| Refund / Cancel Receipt | Reverse a receipt |
| Customers | Customer master data (+ to add new) |
| Order stock for pending sales → Purchasing | Cross-links to purchase workflow for stock |

### Invoice Adjustments Box
| Action | Description |
|--------|-------------|
| Credit Note/Return | Issue credit note against an invoice |
| Contra Credits | Offset credits against outstanding invoices |
| Cancel Invoice | Void/cancel an invoice |
| Write-off Invoice | Write off a bad debt |

### End-of-Period Actions
`Receivables → Print Statements → Age Debtors`

### Reports (Bottom)
| Category | Reports |
|----------|---------|
| Item Sales | Summary, by Month, by Customer |
| Customer Sales | Summary, by Month, by Item |
| Receivables | Aged Receivables |
| Enquiries | Customer Sales, Item Sales, Stock |

## Purchases and Expenses Sub-Navigator

### Primary Flow
`Products → Order Stock below reorder point → Purchase Orders → Purchase Invoices → Payables → Batch Payment / One off Payment`

### Secondary Paths
| Path | Description |
|------|-------------|
| Purchase Orders → Receive Invoice → Purchase Invoices | Direct invoice receipt |
| Purchase Orders → Receive Stock → Products and Inventory | Goods receipt updates stock |
| Refund / Cancel Payment | Reverse a payment |
| Suppliers | Supplier master data (+ to add new) |

### Invoice Adjustments Box
| Action | Description |
|--------|-------------|
| Credit Note/Return | Supplier credit note |
| Contra Credits | Offset credits |
| Cancel Invoice | Void a purchase invoice |
| Write-off Invoice | Write off the payable |

### Reports (Bottom)
| Category | Reports |
|----------|---------|
| Purchases | by Month, by Supplier |
| Payables | Aged Payables |
| Enquiries | Supplier Purchases, Item Purchases, Stock |

## Cash and Banking Sub-Navigator

### Flow
`Bank Accounts → Receipts → Banking` (deposit processing)
`Import Bank Statement → Auto-Allocations → Receipts/Payments`
`Funds Transfer` (inter-account)
`Bank Reconciliation` (standalone)

### Reports (Bottom)
| Category | Reports |
|----------|---------|
| Historic | Cash Flow |
| Current | Bank Balances |
| Forecast | Cash Projection, Cash Forecast |
| Enquiries | Account Enquiry, Bank Accounts |

## Key Insight for Web Client
The sub-navigators reveal **secondary actions** not visible in the Day-to-day view:
- Credit Notes/Returns, Contra Credits, Cancel Invoice, Write-off Invoice
- Refund/Cancel Receipt, Refund/Cancel Payment
- One off Receipt/Payment (vs batch)
- Order Stock below reorder point
- Auto-Allocations (for bank import rules)
- Receive Invoice (vs Receive Stock) — two paths from PO to PI

These are all distinct activities the web client needs to support.
