# Screen-Level API Design — Bounded Context BFF Layer

## Overview
Design for a Backend-for-Frontend (BFF) API layer that provides screen-level bounded contexts. Each endpoint hydrates an entire screen with one GET call, and exposes POST endpoints for each action. This sits on top of the existing table-level CRUD API.

## Design Principles
1. **One GET = one screen render** — header, line items, lookups, related data in one call
2. **Action-oriented POSTs** — each button/form action is a distinct endpoint
3. **Optimistic UI** — return the expected new state with each action response
4. **Composable** — screens can reference shared lookup data via $ref or embedded

## Screen Endpoints

### Transactions Screen (Quotes, Orders, Invoices, Payments, Receipts)

#### GET `/screens/transactions`
Hydrate the transaction list view.
```
Query: ?type=DI&status=posted&period=Dec:2024/25&limit=50&offset=0
Response: {
  transactions: [...],       // Transaction records with computed fields
  filterOptions: {
    types: [{code, label, count}],
    statuses: [{code, label, count}],
    periods: [{code, label, dateRange}],
    orders: [{code, label, count}]
  },
  columns: [{field, label, type, width, sortable}],
  actions: ["new", "modify", "duplicate", "delete", "export", "post"],
  reports: [{id, name, description}],
  pagination: {total, limit, offset, hasMore}
}
```

#### GET `/screens/transactions/:id`
Hydrate a single transaction form for viewing/editing.
```
Response: {
  transaction: {
    header: {debtor, invoiceNo, orderNo, period, date, dueDate, ...},
    lineItems: [{item, qty, description, unitPrice, disc, extension, tc, ...}],
    totals: {subtotal, hst, total, costOfGoods, margin, marginPct},
    metadata: {status, posted, canEdit, canDelete, canReverse}
  },
  lookups: {
    customers: [{code, name, colour}],    // Or lazy-load with search
    items: [{code, description, price}],
    taxCodes: [{code, name, rate}],
    accounts: [{code, description, type}],
    periods: [{code, label, dateRange, isCurrent}],
    colours: [{value, label}],
    paymentMethods: [{value, label}]
  },
  relatedTransactions: [{id, type, reference, date}],
  processOptions: [{action, label, enabled}]  // e.g., "Convert to Sales Order"
}
```

#### POST `/screens/transactions/:id/actions`
Execute an action on a transaction.
```
Actions:
  POST /actions/post          — Post/unpost the transaction
  POST /actions/reverse       — Reverse (create credit note)
  POST /actions/duplicate     — Duplicate the transaction
  POST /actions/convert       — Convert type (e.g., Quote → Sales Order)
  POST /actions/process       — Process (e.g., ship an order)
  POST /actions/print         — Generate printable document
  POST /actions/hold          — Toggle hold status
  POST /actions/set-colour    — Set colour tag
```

### Names Screen (Customers/Suppliers)

#### GET `/screens/names`
```
Query: ?filter=customers&category=North&limit=50
Response: {
  names: [...],
  filterOptions: {
    types: ["all", "suppliers", "cashOnlySuppliers", "creditors", "customers", "cashOnlyCustomers", "debtors", "others"],
    categories: [{value, label, count}],
    regions: [{value, label, count}]
  },
  reports: [{id, name}],
  pagination: {...}
}
```

#### GET `/screens/names/:code`
```
Response: {
  name: {
    header: {code, name, colour, flags: {customer, supplier, debtor, creditor, other, template}},
    details: {mailing, delivery, phone, fax, email, webUrl, gstNo, ...},
    pricingTerms: {discount, priceCode, taxCode, currency, creditHold, salesPerson, debtorControl, creditorControl},
    bankEdi: {payBy, bank, branch, accountName, accountNumber, eInvoicingId, card},
    balances: {
      debtor: {threeOrMore, twoCycles, oneCycle, current, theyOwe},
      creditor: {weOwe},
      dateOfLastSale
    },
    contacts: [{name, role, salutation, position, phone, mobile, email, memo}],
    autocode: {...}
  },
  transactionHistory: [{status, type, ourRef, description, period, date, gross}],
  lookups: {
    priceCodes: [...],
    taxCodes: [...],
    currencies: [...],
    receivablesAccounts: [...],
    payablesAccounts: [...],
    paymentMethods: [...]
  }
}
```

### Items Screen

#### GET `/screens/items/:code`
```
Response: {
  item: {
    header: {code, name, class, material, size, style, category4, colour},
    details: {weBuy, weSell, weCount, weStock, controlAccounts, barcode, comment, customs, image},
    buyingInfo: {supplier, supplierCode, buyPrice, buyTaxCode, plussage, reorderLevel, reorderQty, leadTime},
    sellingInfo: {multiplePrices, priceTiers: [{name, price, unit, taxExcl}], overrideTaxCode, discount, itemWeight, margin},
    inventory: {stockOnHand, committed, available, onOrder, avgCost, lastCost, stockValue},
    costing: {method, standardCost},
    bom: [{itemCode, description, qty}]
  },
  salesHistory: [{period, qty, value, cost, margin, marginPct}],
  lookups: {
    accounts: [...],
    taxCodes: [...],
    suppliers: [...],
    itemClasses: [...]
  }
}
```

### Account Enquiry Screen

#### GET `/screens/account-enquiry/:code`
```
Query: ?from=Jan:2023/24&to=Jan:2024/25&includeUnposted=false
Response: {
  account: {code, description, type, currentBalance},
  balances: [{period, opening, thisPeriod, closing, budget, annualBudget, amtLeft}],
  movements: [{reference, type, date, status, period, description, analysis, tax, debit, credit}],
  graph: {
    labels: ["Jan", "Feb", ...],
    datasets: [{label: "Balance", data: [...]}],
    budget: [{label: "Budget", data: [...]}]
  }
}
```

### Customer/Item Sales Enquiry Screen

#### GET `/screens/sales-enquiry/customer/:code`
```
Query: ?metric=sales&from=...&to=...
Response: {
  customer: {code, name},
  monthly: [{period, value}],
  movements: [{status, invoice, name, description, period, date, value}],
  orders: [{orderNo, date, value, status}],
  graph: {labels, datasets}
}
```

#### GET `/screens/sales-enquiry/item/:code`
```
Response: {
  item: {code, name},
  monthly: [{period, qty, value, cost, margin, marginPct}],
  movements: [...],
  orders: [...],
  graph: {labels, datasets}
}
```

### Dashboard Screens

#### GET `/screens/dashboard/overview`
```
Response: {
  companyName, period,
  profit: {labels, income, expenses, profit},
  currentRatio: {labels, values},
  bankBalances: {labels, accounts: [{code, values}]},
  debtors: {buckets: [{label, value}]}
}
```

#### GET `/screens/dashboard/daily-summary`
```
Response: {
  date, companyName,
  transactionsEntered: {
    today: {sales, costOfSales, grossMargin, otherIncome, netIncome, otherExpenses, surplus, grossMarginPct, ordersBooked},
    previous7Days: {...},
    previous30Days: {...}
  },
  balances: {
    currentBank: {balance, today, sevenDay, thirtyDay},
    receivables: {balance, today, sevenDay, thirtyDay},
    payables: {balance, today, sevenDay, thirtyDay}
  }
}
```

### Setup Screens

#### GET `/screens/setup/tax-rates`
```
Response: {
  taxRates: [{code, name, rate, type, taxPaidAccount, taxReceivedAccount, rate1, changeover, rate2}],
  accounts: [...] // for lookups
}
```

#### GET `/screens/setup/preferences`
```
Response: {
  dataEntry: {colourNames, fieldLabels, paymentMethods, contactRoles},
  sequenceNumbers: {...},
  terms: {...},
  hst: {...},
  locale: {...},
  company: {...}
}
```

## Shared Lookup Endpoints

#### GET `/lookups/customers?search=whi&limit=10`
#### GET `/lookups/items?search=bronze&limit=10`
#### GET `/lookups/accounts?type=EX&limit=50`
#### GET `/lookups/tax-codes`
#### GET `/lookups/periods`
#### GET `/lookups/colours`
#### GET `/lookups/payment-methods`

These are lightweight endpoints for autocomplete/dropdown population in forms.

## Action Patterns

### Universal Transaction Actions
| Action | Endpoint | Method | Description |
|--------|----------|--------|-------------|
| Create | `/screens/transactions` | POST | Create new transaction |
| Update | `/screens/transactions/:id` | PUT | Update existing |
| Delete | `/screens/transactions/:id` | DELETE | Delete (unposted only) |
| Post | `/screens/transactions/:id/actions/post` | POST | Post to GL |
| Reverse | `/screens/transactions/:id/actions/reverse` | POST | Create reversal |
| Duplicate | `/screens/transactions/:id/actions/duplicate` | POST | Clone |
| Convert | `/screens/transactions/:id/actions/convert` | POST | Change type |
| Print | `/screens/transactions/:id/actions/print` | POST | Generate document |

### Batch Actions
| Action | Endpoint | Method |
|--------|----------|--------|
| Batch Post | `/screens/transactions/actions/batch-post` | POST |
| Batch Receipt | `/screens/receipts/actions/batch` | POST |
| Batch Payment | `/screens/payments/actions/batch` | POST |
| Age Debtors | `/screens/receivables/actions/age` | POST |
| Bank Reconciliation | `/screens/banking/reconciliation` | POST |
