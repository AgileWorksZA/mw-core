---
name: Importing Data into MoneyWorks
description: Import records into MoneyWorks via REST API. Covers Transaction/Invoice creation, Name (customer/supplier), Product, and other entities. Use when user asks to create invoices, add customers, duplicate transactions, import data, or automate recurring entries.
---

# Importing Data into MoneyWorks

Create and update records in MoneyWorks programmatically via the REST API.

## Agent Protocol

When user requests data import into MoneyWorks:

### 1. Identify Import Type

| User Request | Table | Shard to Load |
|--------------|-------|---------------|
| "Create/duplicate invoice" | Transaction + Detail | [INVOICE-DUPLICATION.md](INVOICE-DUPLICATION.md) |
| "Record payment" / "Receive money" | Transaction + Detail + Payments | [PAYMENT-RECEIPT.md](PAYMENT-RECEIPT.md) |
| "Credit note" / "Reverse invoice" | Transaction + Detail | [CREDIT-NOTE.md](CREDIT-NOTE.md) |
| "Add customer/supplier" | Name | NAME-IMPORT.md (TODO) |
| "Add product" | Product | PRODUCT-IMPORT.md (TODO) |
| "Create recurring invoice" | Transaction + Detail | RECURRING.md (TODO) |

### 2. Get MoneyWorks Client

```typescript
import { createSmartClient } from "@moneyworks/data";

const client = await createSmartClient();
// or from existing config
import config from "../../mw-config.json";
const client = await createSmartClient(config);
```

### 3. Prepare Record Data

- Use field mappings from `getTSVFieldMapping(tableName)`
- Format dates as YYYYMMDD (no dashes)
- Clear system fields: Sequencenumber, _InternalId, _Timestamp

### 4. Execute Import

```typescript
const result = await client.import(tableName, records, {
  mode: "create",  // or "update", "createOrUpdate"
  workItOut: true  // let MW calculate derived fields
});
```

### 5. Report Result

```typescript
if (result.success) {
  return `Created ${result.created} records`;
} else {
  return `Import failed: ${result.errorDetails.map(e => e.message).join(", ")}`;
}
```

## API Reference

### Import Endpoint

```
POST /REST/{user}:{pass}@{file}/import?table={table}&mode={mode}
Content-Type: text/plain
Body: TSV data (tab-separated, no headers)
```

### Import Modes

| Mode | Use When |
|------|----------|
| `create` | Adding new records |
| `update` | Modifying existing records by key |
| `createOrUpdate` | Upsert - create if missing |

### Key Options

| Option | Effect |
|--------|--------|
| `workItOut: true` | MW auto-populates calculated fields |
| `calculated: true` | Include calculated fields in response |

## Field Requirements

### Date Format

```typescript
// ✅ YYYYMMDD (no separators)
Transdate: "20250114"

// ❌ Will fail
Transdate: "2025-01-14"
```

### Required Fields by Table

| Table | Required Fields |
|-------|-----------------|
| Transaction | Type, Transdate, Period, Namecode |
| Detail | Parentseq, Account, Sort |
| Name | Code, Name |
| Product | Code |

## Parent-Child Import Pattern

For Transaction + Detail (invoices, bills):

```typescript
// Step 1: Import Transaction header
const txnResult = await client.import("Transaction", [newTransaction], {
  mode: "create"
});

// Step 2: Query for new SequenceNumber
const latestTxn = await client.export("Transaction", {
  search: `Namecode="${newTransaction.Namecode}"`,
  sort: "Sequencenumber desc",
  limit: 1
});
const newSeq = latestTxn[0].Sequencenumber;

// Step 3: Import Detail lines with Parentseq
const detailsWithParent = details.map(d => ({
  ...d,
  Parentseq: newSeq
}));
await client.import("Detail", detailsWithParent, { mode: "create" });
```

## Available Import Scenarios

### [Invoice Duplication](INVOICE-DUPLICATION.md)
Duplicate an existing invoice for a new period.
- Read source Transaction + Details
- Adjust dates, period, clear system fields
- Import as new invoice

### [Payment Receipt](PAYMENT-RECEIPT.md)
Record customer payment against invoice.
- Create CRD (Cash Receipt Debtor) transaction
- Double entry: DR Bank, CR Debtor Control
- Updates invoice Amtpaid and Datepaid

### [Credit Note](CREDIT-NOTE.md)
Reverse an invoice to create a credit note.
- In-place modification: Flips Gross to negative
- Type stays DII (negative amount indicates credit)
- Returns stock, reduces customer balance
- Or create separate DIC transaction

### Customer/Supplier Import (TODO)
Bulk import into Name table.

### Product Import (TODO)
Import product catalog.

## Reference Documentation

- **[LEARNINGS.md](LEARNINGS.md)** - Accumulated knowledge about MoneyWorks behavior, field names, transaction types, and common pitfalls

## Implementation Locations

| Component | File |
|-----------|------|
| REST Client | `packages/data/src/client/moneyworks-rest-client.ts` |
| Smart Client | `packages/data/src/client/moneyworks-smart-client.ts` |
| Field Mappings | `packages/data/src/parsers/moneyworks-field-mappings.ts` |
| Validator | `packages/data/src/validators/import-validator.ts` |
| CLI Command | `packages/cli/src/commands/import.ts` |

## Error Handling

```typescript
try {
  const result = await client.import(table, records, options);
  if (result.errors > 0) {
    // Partial failure - some records imported
    console.error("Errors:", result.errorDetails);
  }
  return result;
} catch (error) {
  if (error.code === "MW_HTTP_400") {
    throw new Error("Invalid data format: " + error.message);
  }
  if (error.code === "MW_HTTP_403") {
    throw new Error("Permission denied for import");
  }
  throw error;
}
```

## Verification

After import, verify via snapshot diff:

```bash
bun packages/cli/src/index.ts snapshot after-import
bun packages/cli/src/index.ts diff before after-import --tables Transaction,Detail
```

Or query directly:

```typescript
const newRecords = await client.export(table, {
  search: `Sequencenumber>${lastKnownSeq}`,
  limit: 10
});
```
