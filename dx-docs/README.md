# MoneyWorks Developer Documentation

> **SDK-first documentation** for building integrations with MoneyWorks accounting software.

## Quick Start

```typescript
import { createMoneyWorksClient } from '@moneyworks/data';

const client = createMoneyWorksClient({
  host: 'localhost',
  port: 6710,
  dataFile: 'Acme.moneyworks',
  username: 'admin',
  password: 'secret',
});

// Get all posted invoices
const invoices = await client.repositories.transaction.findPosted();

// Get invoice lines
const lines = await client.repositories.detail.findByParentSeq(invoice.SequenceNumber);

// Get customer details
const customer = await client.repositories.name.findByCode(invoice.NameCode);
```

## Entity Implementation Status

| Entity | Table | SDK Status | Primary Key | Documentation |
|--------|-------|------------|-------------|---------------|
| **Account** | `Account` | ✅ Implemented | `Code` | [accounts.md](entities/accounts.md) |
| **Contact** | `Contact` | ✅ Implemented | `SequenceNumber` | [contacts.md](entities/contacts.md) |
| **Detail** | `Detail` | ✅ Implemented | `ParentSeq + Sort` | [transactions.md](entities/transactions.md) |
| **Name** | `Name` | ✅ Implemented | `Code` | [names.md](entities/names.md) |
| **Product** | `Product` | ✅ Implemented | `Code` | [products.md](entities/products.md) |
| **TaxRate** | `TaxRate` | ✅ Implemented | `Code` | [taxrates.md](entities/taxrates.md) |
| **Transaction** | `Transaction` | ✅ Implemented | `SequenceNumber` | [transactions.md](entities/transactions.md) |
| Asset | `Asset` | 🔜 Upcoming | `Code` | [assets.md](entities/assets.md) |
| Build | `Build` | 🔜 Upcoming | `SequenceNumber` | [build-records.md](entities/build-records.md) |
| Job | `Job` | 🔜 Upcoming | `Code` | [jobs.md](entities/jobs.md) |
| Ledger | `Ledger` | 🔜 Upcoming | `AccountCode + Period` | [ledger.md](entities/ledger.md) |

## Documentation Structure

### [Concepts](concepts/)
High-level architectural patterns that apply across the system.

- **[Entity Relationships](concepts/relationships.md)** - How tables link together (FK relationships, Code vs SequenceNumber keys)
- **Transaction Lifecycle** - Unposted vs Posted states and their implications

### [Entity Reference](entities/)
Deep dives into core data tables with schemas, relationships, and business context.

**Core Financial:**
- [**Transactions**](entities/transactions.md) - Invoices, payments, journals (Header/Detail architecture)
- [**Accounts**](entities/accounts.md) - Chart of Accounts and GL structure
- [**TaxRates**](entities/taxrates.md) - GST/VAT configuration

**Parties:**
- [**Names**](entities/names.md) - Customers, suppliers, creditors
- [**Contacts**](entities/contacts.md) - Contact persons linked to Names

**Inventory:**
- [**Products**](entities/products.md) - Stock items, services, pricing
- [**Build Records**](entities/build-records.md) - Bill of Materials / recipes
- [**Inventory**](entities/inventory.md) - Stock levels and movements

**Project Management:**
- [**Jobs**](entities/jobs.md) - Projects, cost centers, WIP tracking

### [Reference Data](reference/)
Lookup tables and system codes.

- [**Transaction Types**](reference/transaction-types.md) - DII, CII, CP, CR, JN, etc.
- [**Status Codes**](reference/status-codes.md) - Flags and binary states

### [Scripting](scripting/)
MWScript automation and hooks.

- [**Object Model**](scripting/object-model.md) - Document objects and navigation
- [**Functions Reference**](scripting/functions-reference.md) - Built-in functions
- [**Context Hooks**](scripting/context-hooks.md) - Event-driven automation

### [Recipes](recipes/)
Common integration patterns and code examples.

- [**API Patterns**](recipes/api-patterns.md) - REST API best practices

---

## Key Architectural Concepts

### 1. Header/Detail Pattern

Transactions use a parent-child split:

```
Transaction (Header)              Detail (Lines)
├── SequenceNumber (PK)    ──►   ├── ParentSeq (FK)
├── NameCode                      ├── Sort (line order)
├── TransDate                     ├── Account
├── Gross (total)                 ├── StockCode
└── Status (P/U)                  └── Net (line amount)
```

**SDK Usage:**
```typescript
// Get transaction with its lines
const transaction = await transactionRepo.findBySequenceNumber(12345);
const lines = await detailRepo.findByParentSeq(transaction.SequenceNumber);
```

### 2. Code vs SequenceNumber Keys

| Key Type | Field Pattern | Example | Use Case |
|----------|---------------|---------|----------|
| **Code** | `*Code`, entity name | `NameCode`, `Account` | User-facing, changeable |
| **SequenceNumber** | `*Seq`, `*ID` | `ParentSeq`, `ProductSeq` | Internal, immutable |

**Rule of thumb:** If field ends in `Code` or is an entity name → string. If ends in `Seq`/`ID` → number.

### 3. Transaction Types

| Code | Name | Direction | Example |
|------|------|-----------|---------|
| `DII` | Debtor Invoice | Income | Sales invoice |
| `CII` | Creditor Invoice | Expense | Supplier bill |
| `CR` | Cash Receipt | Income | Cash sale |
| `CP` | Cash Payment | Expense | Direct payment |
| `JN` | Journal | Neutral | GL adjustment |

**SDK Usage:**
```typescript
// Get all sales invoices
const invoices = await transactionRepo.findByType('DII');

// Get unpaid invoices
const unpaid = await transactionRepo.findUnpaidInvoices();
```

### 4. Posted vs Unposted

| Status | Code | Can Edit | Affects GL | Affects Balances |
|--------|------|----------|------------|------------------|
| Unposted | `U` | ✅ Yes | ❌ No | ❌ No |
| Posted | `P` | ❌ No | ✅ Yes | ✅ Yes |

```typescript
// Get only posted transactions (safe for reporting)
const posted = await transactionRepo.findPosted();

// Get drafts that need review
const drafts = await transactionRepo.findUnposted();
```

---

## Common Queries

### Find Customer's Unpaid Invoices
```typescript
const unpaid = await transactionRepo.find({
  search: `Type="DII" and Status="P" and NameCode="${customerCode}" and BalanceDue<>0`,
});
```

### Get Invoice with Lines
```typescript
const invoice = await transactionRepo.findBySequenceNumber(seqNum);
const lines = await detailRepo.findByParentSeq(seqNum);

// Or use the convenience method
const lines = await detailRepo.findByTransaction(seqNum);
```

### Find Products Low on Stock
```typescript
const products = await productRepo.find({
  search: `Type="P" and StockOnHand < ReorderLevel`,
});
```

### Get Account Balances
```typescript
const accounts = await accountRepo.findBalanceSheetAccounts();
const plAccounts = await accountRepo.findProfitLossAccounts();
```

### Find Contacts by Role
```typescript
// Find all contacts who receive statements
const statementContacts = await contactRepo.findByRole(MoneyWorksContactRoles.STATEMENT);
```

---

## MoneyWorks Query Syntax

MoneyWorks uses its own query syntax (not SQL). Key patterns:

```typescript
// Equality
`NameCode="ACME"`

// Contains (text search)
`Description contains "widget"`

// Comparison
`Gross > 1000`
`TransDate >= "20240101"`

// Boolean AND/OR
`Type="DII" and Status="P"`
`Status="P" or Status="U"`

// Function-based
`left(Code, 2) = "BA"`  // Starts with "BA"
`year(TransDate) = 2024`

// Bitwise (for flag fields)
`(Role&#1)!=0`  // Has role bit 1 set
```

---

## Need Help?

- **Entity not implemented?** Check the [upcoming entities](#entity-implementation-status) or request via issue
- **Query syntax?** See [MoneyWorks Query Reference](reference/query-syntax.md)
- **Complex integration?** See [Recipes](recipes/) for patterns

---

## Contributing

This documentation is maintained alongside the SDK. To add or update:

1. Entity docs go in `dx-docs/entities/`
2. Concepts go in `dx-docs/concepts/`
3. Code examples should use SDK methods, not raw API calls
4. Keep MoneyWorks terminology canonical (GST not VAT, NameCode not customerId)
