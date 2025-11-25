# MoneyWorks Entity Reference

This section documents the core data tables in MoneyWorks. Each entity guide includes:
- Schema definitions (fields, types, constraints)
- Relationships to other entities
- Business context and usage patterns
- SDK code examples

## Entity Map

```
┌─────────────────────────────────────────────────────────────────┐
│                        FINANCIAL CORE                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌──────────────┐         ┌──────────────┐                    │
│   │  Transaction │────────►│    Detail    │                    │
│   │   (Header)   │ 1:many  │   (Lines)    │                    │
│   └──────┬───────┘         └──────┬───────┘                    │
│          │                        │                             │
│          │NameCode                │Account      │StockCode      │
│          ▼                        ▼             ▼               │
│   ┌──────────────┐         ┌──────────────┐  ┌─────────────┐   │
│   │    Names     │         │   Accounts   │  │  Products   │   │
│   │ (Cust/Supp)  │         │    (GL)      │  │ (Inventory) │   │
│   └──────┬───────┘         └──────────────┘  └──────┬──────┘   │
│          │                                          │           │
│          │ParentSeq                                 │ProductSeq │
│          ▼                                          ▼           │
│   ┌──────────────┐                           ┌─────────────┐   │
│   │   Contacts   │                           │    Build    │   │
│   │  (Persons)   │                           │   (BOM)     │   │
│   └──────────────┘                           └─────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Entities by Category

### Core Financial

| Entity | Table | Description | SDK Status |
|--------|-------|-------------|------------|
| [**Transaction**](transactions.md) | `Transaction` | Financial events (invoices, payments, journals) | ✅ Implemented |
| [**Detail**](transactions.md#detail-lines) | `Detail` | Transaction line items | ✅ Implemented |
| [**Account**](accounts.md) | `Account` | Chart of Accounts / GL | ✅ Implemented |
| [**TaxRate**](taxrates.md) | `TaxRate` | GST/VAT rates | ✅ Implemented |
| [Ledger](ledger.md) | `Ledger` | Period-based GL balances | 🔜 Upcoming |

### Parties & Contacts

| Entity | Table | Description | SDK Status |
|--------|-------|-------------|------------|
| [**Name**](names.md) | `Name` | Customers, suppliers, creditors | ✅ Implemented |
| [**Contact**](contacts.md) | `Contact` | Contact persons (linked to Names) | ✅ Implemented |

### Inventory & Products

| Entity | Table | Description | SDK Status |
|--------|-------|-------------|------------|
| [**Product**](products.md) | `Product` | Items, services, pricing | ✅ Implemented |
| [Inventory](inventory.md) | `Inventory` | Stock levels by location | 🔜 Upcoming |
| [Build](build-records.md) | `Build` | Bill of Materials / recipes | 🔜 Upcoming |

### Project Management

| Entity | Table | Description | SDK Status |
|--------|-------|-------------|------------|
| [Job](jobs.md) | `Job` | Projects, cost centers | 🔜 Upcoming |

### System

| Entity | Table | Description | SDK Status |
|--------|-------|-------------|------------|
| [Asset](assets.md) | `Asset` | Fixed assets | 🔜 Upcoming |
| [Login](login.md) | `Login` | User accounts | 🔜 Upcoming |

---

## Key Relationships

### Transaction → Detail (Parent-Child)
```typescript
// Detail lines link to Transaction header via ParentSeq
const transaction = await transactionRepo.findBySequenceNumber(12345);
const lines = await detailRepo.findByParentSeq(transaction.SequenceNumber);
```

### Name → Contact (Parent-Child)
```typescript
// Contacts link to Names via ParentSeq
const customer = await nameRepo.findByCode('ACME');
const contacts = await contactRepo.findByParentSeq(customer.SequenceNumber);
```

### Transaction → Name (Foreign Key)
```typescript
// Transaction.NameCode → Name.Code
const invoice = await transactionRepo.findBySequenceNumber(12345);
const customer = await nameRepo.findByCode(invoice.NameCode);
```

### Detail → Account (Foreign Key)
```typescript
// Detail.Account → Account.Code
const lines = await detailRepo.findByParentSeq(12345);
for (const line of lines) {
  const account = await accountRepo.findByCode(line.Account);
}
```

### Detail → Product (Foreign Key)
```typescript
// Detail.StockCode → Product.Code
const lines = await detailRepo.findByParentSeq(12345);
for (const line of lines) {
  if (line.StockCode) {
    const product = await productRepo.findByCode(line.StockCode);
  }
}
```

---

## Primary Key Patterns

MoneyWorks uses two types of primary keys:

### Code-Based (User-Defined)
- **Pattern:** Alphanumeric, user-entered
- **Entities:** Name, Account, Product, TaxRate, Job
- **Lookup:** `findByCode(code: string)`

```typescript
const customer = await nameRepo.findByCode('ACME-001');
const account = await accountRepo.findByCode('4000');
```

### SequenceNumber-Based (Auto-Generated)
- **Pattern:** Integer, system-assigned
- **Entities:** Transaction, Contact, Build
- **Lookup:** `findBySequenceNumber(seq: number)`

```typescript
const transaction = await transactionRepo.findBySequenceNumber(12345);
const contact = await contactRepo.findBySequenceNumber(67890);
```

### Composite Keys
- **Detail:** `ParentSeq` + `Sort` (links to Transaction, ordered by line number)

---

## Quick Reference: Common Fields

| Field | Found In | Type | Description |
|-------|----------|------|-------------|
| `SequenceNumber` | Most entities | Number | Auto-generated primary key |
| `Code` | Name, Account, Product | String | User-defined primary key |
| `Description` | Most entities | String | Human-readable name |
| `NameCode` | Transaction | String | FK to Name.Code |
| `ParentSeq` | Detail, Contact | Number | FK to parent entity |
| `Account` | Detail | String | FK to Account.Code |
| `StockCode` | Detail | String | FK to Product.Code |
| `Status` | Transaction | `P`/`U` | Posted/Unposted |
| `Type` | Transaction, Product | String | Entity subtype code |
| `Flags` | Various | Number | Bitmask flags |
