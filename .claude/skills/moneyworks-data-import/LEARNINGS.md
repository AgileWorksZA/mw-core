# MoneyWorks Data Import - Learnings

> Accumulated knowledge from mapping MoneyWorks Gold operations to API calls.

## Transaction Types

| Type | Name | Description |
|------|------|-------------|
| **DII** | Debtor Item Invoice | Sales invoice to customer |
| **DIC** | Debtor Item Credit | Credit note to customer |
| **CRD** | Cash Receipt Debtor | Customer payment received |
| **CPD** | Cash Payment Debtor | Refund to customer |
| **CII** | Creditor Item Invoice | Purchase invoice from supplier |
| **CIC** | Creditor Item Credit | Credit from supplier |
| **CRC** | Cash Receipt Creditor | Refund from supplier |
| **CPC** | Cash Payment Creditor | Payment to supplier |
| **CP** | Cash Payment | General cash payment |
| **JNL** | Journal | Manual journal entry |

## Transaction Status

| Status | Meaning | Behavior |
|--------|---------|----------|
| **U** | Unposted | Draft - doesn't affect ledger, stock, or balances |
| **P** | Posted | Live - affects GL, updates stock, updates customer/supplier balances |

**Critical**: Unposted transactions appear in "Unposted" view, not in "Receivables" or "Payables".

## Posting an Invoice

When an invoice is posted (Status U → P):

| Component | Change |
|-----------|--------|
| Transaction.Status | U → P |
| Transaction.Securitylevel | Set to current year (e.g., 2025) |
| Product.Stockonhand | Decreases by quantity sold |
| Name.DCurrent | Increases by invoice Gross |

## Recording a Payment (CRD)

Creates a new Cash Receipt Debtor transaction:

```
Transaction:
  Type: "CRD"
  Namecode: [customer code]
  Gross: [payment amount]
  Contra: "1000-" (bank account)
  Description: [invoice number being paid]

Detail Lines:
  1. CR 1500- Debtor Control (reduces receivables)
  2. DR 1000- Bank Account (money received)
```

**Updates to original invoice:**
- Amtpaid: Increases by payment amount
- Datepaid: Set to payment date (if fully paid)

## Credit Note / Reversal

**Key Discovery**: MoneyWorks "Reverse" does an **in-place modification**, not a new transaction.

| Field | Before | After |
|-------|--------|-------|
| Gross | 1121.06 | -1121.06 |
| Type | DII | DII (unchanged!) |
| Status | U/P | P |

**The Type stays DII** - MoneyWorks uses negative amounts to indicate credits, not a different transaction type.

### Detail Line Changes

| Line Type | Before | After |
|-----------|--------|-------|
| Sales Credits | Positive | Negative |
| Debtor Control Debit | Positive | Negative |
| GST Credits | Positive | Negative |
| Stock entries | May swap Debit/Credit columns |

### Side Effects

- **Product.Stockonhand**: Increases (stock returned)
- **Name.DCurrent**: Decreases by credit amount

## Date Formats

```typescript
// ✅ Correct - YYYYMMDD (no separators)
Transdate: "20250114"

// ❌ Will fail
Transdate: "2025-01-14"
```

## Field Naming

MoneyWorks fields are case-sensitive:

```typescript
// ✅ Correct
Sequencenumber  // lowercase 'n'
Parentseq       // no capital letters

// ❌ Incorrect
SequenceNumber  // wrong case
ParentSeq       // wrong case
```

## Parent-Child Relationships

| Parent Table | Child Table | Link Field |
|--------------|-------------|------------|
| Transaction | Detail | Detail.Parentseq = Transaction.Sequencenumber |
| Transaction | Payments | Payments.Invoiceseq / Payments.Cashtrans |

## Fields to Clear When Duplicating

When creating a new record from an existing one, clear these system fields:

```typescript
const fieldsToUnset = [
  "Sequencenumber",
  "_InternalId",
  "_Timestamp",
  "_primaryKey",
  "Securitylevel",
  "Amtpaid",
  "Datepaid"
];
```

## Fields to Update When Duplicating

```typescript
const fieldsToUpdate = {
  Transdate: newDate,           // YYYYMMDD format
  Enterdate: today,             // YYYYMMDD format
  Duedate: calculateDueDate(),  // YYYYMMDD format
  Period: newPeriod,            // Integer period number
  Status: "U",                  // Start as unposted draft
};
```

## Common Account Codes

| Account | Purpose |
|---------|---------|
| 1000- | Main Bank / Cheque Account |
| 1010- | Savings Account |
| 1020- | Credit Card Account |
| 1300- | Inventory |
| 1500- | Debtor Control (Accounts Receivable) |
| 2000- | Creditor Control (Accounts Payable) |
| 2400- | GST Output (collected from customers) |
| 4000- | Sales Revenue |
| 6000- | Cost of Goods Sold |

## Import Modes

| Mode | Use When |
|------|----------|
| `create` | Adding new records |
| `update` | Modifying existing records by Sequencenumber |
| `createOrUpdate` | Upsert - create if missing |

## Import Options

| Option | Effect |
|--------|--------|
| `workItOut: true` | MW auto-calculates derived fields |
| `calculated: true` | Include calculated fields in response |

## Querying Patterns

### Find Unpaid Invoices

```typescript
// All unpaid debtor invoices
const unpaid = await client.export("Transaction", {
  search: `Type="DII" and Gross>Amtpaid and Status="P"`
});
```

### Find Latest Transaction

```typescript
const [latest] = await client.export("Transaction", {
  search: `Namecode="${customerCode}"`,
  sort: "Sequencenumber desc",
  limit: 1
});
```

### Get Invoice Details

```typescript
const details = await client.export("Detail", {
  search: `Parentseq=${invoice.Sequencenumber}`
});
```

## Snapshot Diff Workflow

For mapping new operations:

```bash
# 1. Take baseline
bun packages/cli/src/index.ts snapshot baseline

# 2. Perform operation in MoneyWorks Gold

# 3. Take after snapshot
bun packages/cli/src/index.ts snapshot after-operation

# 4. Compare
bun packages/cli/src/index.ts diff baseline after-operation --tables Transaction,Detail,Product,Name
```

## Common Pitfalls

### 1. Unposted vs Unpaid
- **Unposted** (Status=U): Draft, doesn't affect anything
- **Unpaid** (Amtpaid < Gross): Posted but not yet paid

### 2. Credit Notes Don't Change Type
MoneyWorks in-place reversal keeps Type as DII with negative Gross.
Only manually created credit notes use Type DIC.

### 3. Detail Lines Need Parentseq
When importing details for a new transaction:
1. Import Transaction first
2. Query to get the new Sequencenumber
3. Set Parentseq on all Detail lines
4. Import Detail lines

### 4. Stock Only Changes When Posted
Product.Stockonhand only updates when transaction Status changes to P.

### 5. Customer Balance Only Updates When Posted
Name.DCurrent only updates when transaction is posted.

## Verified Workflows

| Workflow | Status | Shard |
|----------|--------|-------|
| Invoice Duplication | ✅ Mapped | [INVOICE-DUPLICATION.md](INVOICE-DUPLICATION.md) |
| Payment Receipt | ✅ Mapped | [PAYMENT-RECEIPT.md](PAYMENT-RECEIPT.md) |
| Credit Note (Reversal) | ✅ Mapped | [CREDIT-NOTE.md](CREDIT-NOTE.md) |
| Journal Entry | ⏳ TODO | - |
| PO → Receive → Invoice | ⏳ TODO | - |
| Stock Adjustment | ⏳ TODO | - |
| Customer/Supplier Import | ⏳ TODO | - |
| Product Import | ⏳ TODO | - |

## Snapshots Reference

| Snapshot | Description |
|----------|-------------|
| baseline-scenarios | Clean state before testing |
| after-post-invoice | Invoice 2131 posted (U→P) |
| after-payment | Receipt 351 recorded for invoice 2131 |
| after-credit-note | Invoice 2130 reversed |
