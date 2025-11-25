# MoneyWorks Query Syntax Reference

MoneyWorks uses its own query language for searching and filtering records. This is **not SQL** - it has different syntax and operators.

## Basic Syntax

### Equality
```
Field = "value"
Field = 123
```

**Examples:**
```typescript
// String comparison (must use quotes)
await repo.find({ search: `NameCode = "ACME"` });

// Numeric comparison (no quotes)
await repo.find({ search: `SequenceNumber = 12345` });
```

### Inequality
```
Field <> "value"
Field != "value"
```

**Examples:**
```typescript
// Find non-zero balances
await repo.find({ search: `BalanceDue <> 0` });
```

### Comparison Operators
```
Field > value
Field >= value
Field < value
Field <= value
```

**Examples:**
```typescript
// Invoices over $1000
await repo.find({ search: `Gross > 1000` });

// Transactions from 2024 onwards
await repo.find({ search: `TransDate >= "20240101"` });
```

---

## Text Operations

### Contains
```
Field contains "text"
```

**Examples:**
```typescript
// Products with "widget" in description
await repo.find({ search: `Description contains "widget"` });
```

### Starts With (using left function)
```
left(Field, N) = "prefix"
```

**Examples:**
```typescript
// Accounts starting with "4" (revenue accounts)
await repo.find({ search: `left(Code, 1) = "4"` });

// Products with code starting with "PROD-"
await repo.find({ search: `left(Code, 5) = "PROD-"` });
```

### Case-Insensitive Search
```
lower(Field) = "lowercase"
upper(Field) = "UPPERCASE"
```

**Examples:**
```typescript
// Case-insensitive name search
await repo.find({ search: `lower(Description) contains "acme"` });
```

---

## Boolean Operators

### AND
```
condition1 and condition2
```

**Examples:**
```typescript
// Posted sales invoices
await repo.find({ search: `Type = "DII" and Status = "P"` });

// Active customers with balance
await repo.find({ search: `Hold = false and BalanceDue > 0` });
```

### OR
```
condition1 or condition2
```

**Examples:**
```typescript
// Sales or purchase invoices
await repo.find({ search: `Type = "DII" or Type = "CII"` });
```

### Grouping with Parentheses
```
(condition1 or condition2) and condition3
```

**Examples:**
```typescript
// Posted invoices (sales or purchase)
await repo.find({
  search: `(Type = "DII" or Type = "CII") and Status = "P"`
});
```

---

## Date Operations

### Date Comparison
Dates use `YYYYMMDD` format as strings:
```
DateField >= "20240101"
DateField <= "20241231"
```

**Examples:**
```typescript
// Transactions in January 2024
await repo.find({
  search: `TransDate >= "20240101" and TransDate <= "20240131"`
});
```

### Date Functions
```
year(DateField) = 2024
month(DateField) = 1
day(DateField) = 15
```

**Examples:**
```typescript
// All transactions in 2024
await repo.find({ search: `year(TransDate) = 2024` });

// Transactions on the 1st of any month
await repo.find({ search: `day(TransDate) = 1` });
```

### Today/Now
```
today
now
```

**Examples:**
```typescript
// Overdue invoices
await repo.find({ search: `DueDate < today and BalanceDue > 0` });
```

---

## Numeric Operations

### Arithmetic
```
Field1 + Field2
Field1 - Field2
Field1 * Field2
Field1 / Field2
```

**Examples:**
```typescript
// Invoices where payment < gross (partially paid)
await repo.find({ search: `AmtPaid < Gross and AmtPaid > 0` });
```

### Null/Empty Checks
```
Field = ""
Field <> ""
```

**Examples:**
```typescript
// Products with no category
await repo.find({ search: `Category = ""` });

// Names with email addresses
await repo.find({ search: `email <> ""` });
```

---

## Bitwise Operations (for Flag Fields)

MoneyWorks uses bitmask flags for roles and statuses.

### Check if Bit is Set
```
(Field & BitValue) != 0
(Field&#BitHex) != 0
```

**Examples:**
```typescript
// Contacts who receive statements (role bit 1)
await repo.find({ search: `(Role&#1) != 0` });

// Contacts who receive invoices (role bit 4)
await repo.find({ search: `(Role&#4) != 0` });

// Products that are inactive (flag bit)
await repo.find({ search: `(Flags&#1) != 0` });
```

### Common Role Bits (Contact entity)
| Bit | Hex | Role |
|-----|-----|------|
| 1 | `&#1` | Receives Statements |
| 2 | `&#2` | Receives Remittances |
| 4 | `&#4` | Receives Invoices |
| 8 | `&#8` | Receives Purchase Orders |
| 16 | `&#10` | Receives Quotes |

---

## Sorting

Use the `sort` parameter (not part of `search`):

```typescript
// Sort by date descending
await repo.find({
  search: `Type = "DII"`,
  sort: 'TransDate desc'
});

// Sort by multiple fields
await repo.find({
  search: `Status = "P"`,
  sort: 'NameCode, TransDate desc'
});
```

---

## Pagination

Use `limit` and `offset`:

```typescript
// First 50 records
await repo.find({ limit: 50 });

// Next 50 records (page 2)
await repo.find({ limit: 50, offset: 50 });

// Efficient pagination pattern
const pageSize = 50;
const page = 3;
await repo.find({
  limit: pageSize,
  offset: (page - 1) * pageSize
});
```

---

## Common Query Patterns

### Unpaid Sales Invoices
```typescript
await transactionRepo.find({
  search: `Type = "DII" and Status = "P" and BalanceDue <> 0`,
  sort: 'DueDate'
});
```

### Customer's Transaction History
```typescript
await transactionRepo.find({
  search: `NameCode = "${customerCode}" and Status = "P"`,
  sort: 'TransDate desc'
});
```

### Products Low on Stock
```typescript
await productRepo.find({
  search: `Type = "P" and StockOnHand < ReorderLevel`
});
```

### Active Balance Sheet Accounts
```typescript
await accountRepo.find({
  search: `left(Type, 1) <> "E" and left(Type, 1) <> "I"` // Not expense/income
});
```

### Recent Transactions
```typescript
const thirtyDaysAgo = format(subDays(new Date(), 30), 'yyyyMMdd');
await transactionRepo.find({
  search: `TransDate >= "${thirtyDaysAgo}"`,
  sort: 'TransDate desc'
});
```

---

## SDK Repository Methods vs Raw Queries

The SDK provides typed methods that abstract common queries:

| Raw Query | SDK Method |
|-----------|------------|
| `Type = "DII" and Status = "P"` | `transactionRepo.findByType('DII')` |
| `Status = "P"` | `transactionRepo.findPosted()` |
| `Status = "U"` | `transactionRepo.findUnposted()` |
| `NameCode = "ACME"` | `transactionRepo.findByNameCode('ACME')` |
| `ParentSeq = 123` | `detailRepo.findByParentSeq(123)` |
| `(Role&#4) != 0` | `contactRepo.findByRole(INVOICE_ROLE)` |

**Prefer SDK methods** when available - they're type-safe and easier to read.

---

## Troubleshooting

### Common Errors

| Error | Cause | Fix |
|-------|-------|-----|
| "Invalid expression" | Missing quotes around string | Use `Field = "value"` not `Field = value` |
| "Unknown field" | Wrong field name | Check entity schema for exact field names |
| No results | Date format wrong | Use `YYYYMMDD` format: `"20240115"` |
| Unexpected results | Boolean vs string | Use `Status = "P"` not `Status = P` |

### Debugging Queries

```typescript
// Log the query being sent
const search = `Type = "DII" and Status = "P"`;
console.log('Query:', search);

const results = await repo.find({ search });
console.log('Results:', results.length);
```
