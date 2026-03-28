# Transaction Write Operations — API Gaps and Solutions

## Current State
The Elysia API's `POST /tables/transaction/import` endpoint fails with "Content length bad or missing" from the MoneyWorks REST server when trying to create transactions. This is because MoneyWorks transactions are compound records (header + detail lines) that cannot be created via the simple table import mechanism.

## The Problem
Unlike simple tables (Name, Product, Account, TaxRate), Transactions require:
1. A header record (Transaction table)
2. One or more detail lines (Detail table) linked via SequenceNumber
3. Proper period assignment
4. Correct status flags
5. Tax calculation based on detail line tax codes
6. Running totals (Gross, TaxAmount, AmtPaid, Outstanding)

The MoneyWorks REST API has specific endpoints for transaction creation that differ from the generic import endpoint.

## MoneyWorks REST API Transaction Endpoints
Based on the MoneyWorks REST API documentation:

### Create Transaction
```
POST /REST/{datafile}/import/transaction
Content-Type: text/tab-separated-values

Header row + data rows in TSV format
Requires both transaction header fields AND detail line fields in specific order
```

### Post Transaction
```
POST /REST/{datafile}/docommand?command=post&search=SequenceNumber={seq}
```

### Key Insight: Compound Record Import
MoneyWorks requires transaction + detail import to be a single compound TSV:
- The TSV must include BOTH Transaction-level fields AND Detail-level fields
- Detail lines are encoded as sub-rows or special fields
- The `work_it_out=true` flag tells MW to calculate totals, tax, etc.

## Required API Additions for Web Client

### 1. Create Transaction Endpoint
```
POST /api/v1/transactions
Body: {
  header: {
    type: "DI",           // Transaction type
    namecode: "WHITE",    // Customer/supplier
    transdate: "2025-01-15",
    duedate: "2025-02-15",
    description: "Widget Sales",
    contra: "1000",       // Bank account
    colour: 0,
    hold: false
  },
  lines: [
    {
      account: "4000",       // Or stockCode for item-based
      stockCode: "BA100",    // Item code (for item-based lines)
      description: "Bronze Widget Medium",
      quantity: 10,
      unitPrice: 24.95,
      taxCode: "G",
      discount: 0
    },
    {
      account: "4000",
      stockCode: "CA100",
      description: "Chrome Widget Small",
      quantity: 5,
      unitPrice: 8.00,
      taxCode: "G",
      discount: 0
    }
  ],
  options: {
    post: false,            // Create as unposted
    workItOut: true,        // Let MW calculate totals/tax
    printAfter: false
  }
}

Response: {
  transaction: { ...full transaction record... },
  lines: [ ...detail records... ],
  totals: { subtotal, tax, gross, margin }
}
```

### 2. Update Transaction Endpoint
```
PUT /api/v1/transactions/:sequenceNumber
Body: { ...same structure as create... }
Constraints: Only unposted transactions can be updated
```

### 3. Post Transaction Endpoint
```
POST /api/v1/transactions/:sequenceNumber/post
Response: { transaction: { ...updated record with Status="P"... } }
Constraints: Cannot post already-posted transactions
```

### 4. Reverse Transaction Endpoint
```
POST /api/v1/transactions/:sequenceNumber/reverse
Response: {
  original: { ...original transaction... },
  reversal: { ...new reversal transaction... }
}
```

### 5. Convert Transaction Type
```
POST /api/v1/transactions/:sequenceNumber/convert
Body: { targetType: "SO" }  // e.g., Quote → Sales Order
Response: { transaction: { ...converted transaction... } }
```

### 6. Allocate Payment to Invoices
```
POST /api/v1/transactions/:sequenceNumber/allocate
Body: {
  allocations: [
    { invoiceSeq: 1234, amount: 250.00 },
    { invoiceSeq: 1235, amount: 150.00 }
  ]
}
```

## Transaction Repository Methods Available
The data layer already has comprehensive query methods:
- `findByType(type)` — Filter by DI, CI, CR, CP, JN, SO, PO, QU
- `findByNameCode(nameCode)` — Customer/supplier transactions
- `findByStatus(status)` — Posted (P) / Unposted (U)
- `findByDateRange(start, end)`
- `findByOurRef(ref)` — Find by invoice/receipt number
- `findByPeriod(period)` — Period format: 100*year + period_number
- `findByTypeAndStatus(type, status)` — Combined filter
- `findByTypeAndNameCode(type, nameCode)` — e.g., all invoices for customer
- `findOnHold()` — Held transactions
- `findRecurring()` — Recurring templates
- `findOutstandingInvoices(nameCode, isDebtor)` — Unpaid invoices

## Period Encoding
Period field uses format: `100 * year_number + period_number`
- Period 210 = Year 2, Period 10 (January in April-March fiscal year)
- Period 401 = Year 4, Period 1 (April)
- Current period for Acme: 401 (Jan:2024/25)

## Transaction Type Full Reference
| Type Code | Status | Description |
|-----------|--------|-------------|
| DI | I (Incomplete) | Sales Invoice (unpaid or partial) |
| DI | C (Complete) | Sales Invoice (fully paid) |
| CI | I | Purchase Invoice (unpaid) |
| CI | C | Purchase Invoice (fully paid) |
| CR | | Cash Receipt |
| CP | | Cash Payment |
| JN | | Journal Entry |
| SO | | Sales Order |
| PO | | Purchase Order |
| QU | | Quote |

Status field: P = Posted, U = Unposted (editable)

## Critical Findings from Live Testing

### 1. Compound Type Codes (NOT simple 2-letter)
The API validates against compound type codes that encode both entity type AND payment state:

| Code | Description |
|------|-------------|
| **DII** | Debtor Invoice Incomplete (unpaid/partial) |
| **DIC** | Debtor Invoice Complete (fully paid) |
| **CII** | Creditor Invoice Incomplete |
| **CIC** | Creditor Invoice Complete |
| **CR** | Cash Receipt |
| **CRC** | Cash Receipt Complete |
| **CRD** | Cash Receipt (deposit?) |
| **CP** | Cash Payment |
| **CPC** | Cash Payment Complete |
| **CPD** | Cash Payment (deposit?) |
| **JN** | Journal |
| **JNS** | Journal (system?) |
| **SOI** | Sales Order Incomplete |
| **SOC** | Sales Order Complete |
| **POI** | Purchase Order Incomplete |
| **POC** | Purchase Order Complete |
| **QU** | Quote |

The simple "DI" code from the desktop UI maps to DII or DIC in the API. The third character indicates payment completeness (I=Incomplete, C=Complete).

### 2. Unposted Transactions NOT Visible via REST API
**Critical limitation**: Transactions with Status="U" (unposted) are invisible through the MoneyWorks REST API. Only posted transactions (Status="P") appear in query results. This means:
- The web client cannot show a "draft" view of transactions created but not yet posted
- Any "Create Invoice" workflow in the web client would need to create AND post in one operation
- Or: a separate local store for draft transactions before they hit MoneyWorks

### 3. New Transactions May Require MW REST Server Refresh
After posting invoice #2129 in MoneyWorks Gold, the REST API (via our Elysia layer) still didn't return it. The highest DII OurRef was 2125. This suggests:
- The MW REST server may cache its view of the data file
- Transactions created via the desktop app may not be immediately visible to the REST API
- The REST connection may need to be re-established after data changes

### 4. Invoice Auto-Computation (Desktop Observations)
When creating Invoice #2129 for WHITE (White Contractors):
- **Auto-populated**: To address from customer record, Due Date from customer's payment terms
- **Line item entry**: Entering item code BA100 auto-fills Description, Unit Price (24.95), Unit (ea), Tax Code (G)
- **Auto-calculated**: Extension (Qty × Unit Price), HST (15% of net), Total (Net + HST)
- **Margin computed**: Cost of Goods ($13.27/unit), Total Margin ($11.68 / 47%), Line Item Margin
- **Amount field**: Auto-updates as lines are added (shows gross total)
- **Period**: Auto-assigned based on transaction date

### 5. By Account vs By Item Line Entry
The invoice form has two modes:
- **By Account**: Manual GL account + description + net amount + tax code (no item lookup)
- **By Item**: Item code → auto-populates from product master (price, description, cost, margin)
  - Columns: Item, Qty, Description, Unit Price, per (unit), Disc.%, Extension, TC
  - Footer: Total Cost of Goods, Total Margin, Line Item Margin

## Implementation Priority
1. **Read operations** — Already working via table export
2. **Create transaction (header + lines)** — Highest priority write operation
3. **Post/unpost** — Essential for workflow
4. **Reverse** — Required for corrections
5. **Allocate payments** — Required for receipt/payment processing
6. **Convert type** — Nice-to-have (Quote → Order → Invoice)
7. **Handle REST API caching** — May need connection refresh mechanism
