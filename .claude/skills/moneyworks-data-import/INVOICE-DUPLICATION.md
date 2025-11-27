# Invoice Duplication

> Shard of [moneyworks-data-import](SKILL.md) skill

Duplicate an existing MoneyWorks invoice for a new period - replicates the "Duplicate" feature from MoneyWorks Gold.

## Agent Protocol

When user asks to duplicate an invoice:

### Step 1: Identify Source Invoice

Get the invoice reference from user:
- Invoice number (Ourref): "2131"
- Or customer code (Namecode): "WHITE"
- Or sequence number: 986

### Step 2: Read Source Transaction

```typescript
// By invoice number
const transactions = await client.export("Transaction", {
  search: `Ourref="${invoiceNumber}"`,
  limit: 1
});
const sourceTransaction = transactions[0];

// Or by sequence
const transactions = await client.export("Transaction", {
  search: `Sequencenumber=${sequenceNumber}`,
  limit: 1
});
```

### Step 3: Read Source Detail Lines

```typescript
const details = await client.export("Detail", {
  search: `Parentseq=${sourceTransaction.Sequencenumber}`
});

// Filter to item lines only (exclude auto-generated control postings)
const itemLines = details.filter(d =>
  d.Stockcode && d.Stockcode.trim() !== ""
);
```

### Step 4: Get Target Period/Date

Ask user or calculate:
```typescript
const newDate = "20250115";  // YYYYMMDD format
const newPeriod = calculatePeriod(newDate); // or ask user
```

### Step 5: Prepare New Transaction

```typescript
const newTransaction = {
  // Copy from source
  Type: sourceTransaction.Type,
  Namecode: sourceTransaction.Namecode,
  Tofrom: sourceTransaction.Tofrom,
  Description: sourceTransaction.Description,
  Gross: sourceTransaction.Gross,
  Taxamount: sourceTransaction.Taxamount,
  Contra: sourceTransaction.Contra,
  Mailingaddress: sourceTransaction.Mailingaddress,
  Deliveryaddress: sourceTransaction.Deliveryaddress,

  // Update for new period
  Transdate: newDate,
  Enterdate: todayYYYYMMDD(),
  Duedate: calculateDueDate(newDate, 37), // 37 days terms
  Period: newPeriod,

  // Reset status
  Status: "U",
  Amtpaid: 0,
  Datepaid: null,

  // Clear (don't set - MW assigns)
  // Sequencenumber, Ourref, _InternalId, _Timestamp
};
```

### Step 6: Import Transaction

```typescript
const txnResult = await client.import("Transaction", [newTransaction], {
  mode: "create",
  workItOut: true
});
```

### Step 7: Get New Sequence Number

```typescript
// Query for the new transaction
const newTxns = await client.export("Transaction", {
  search: `Namecode="${newTransaction.Namecode}" and Transdate="${newDate}"`,
  sort: "Sequencenumber desc",
  limit: 1
});
const newSeq = newTxns[0].Sequencenumber;
const newOurref = newTxns[0].Ourref;
```

### Step 8: Import Detail Lines

```typescript
const newDetails = itemLines.map((d, i) => ({
  Parentseq: newSeq,
  Sort: i + 1,
  Account: d.Account,
  TaxCode: d.TaxCode,
  Gross: d.Gross,
  Tax: d.Tax,
  Debit: d.Debit,
  Credit: d.Credit,
  Description: d.Description,
  Stockcode: d.Stockcode,
  Stockqty: d.Stockqty,
  Costprice: d.Costprice,
  Unitprice: d.Unitprice,
  Saleunit: d.Saleunit,
  Period: newPeriod,
  Transactiontype: d.Transactiontype,
  // Don't copy: Sequencenumber, _InternalId
}));

await client.import("Detail", newDetails, {
  mode: "create",
  workItOut: true
});
```

### Step 9: Report Success

```typescript
return {
  success: true,
  message: `Duplicated invoice ${sourceTransaction.Ourref} → ${newOurref}`,
  newInvoice: {
    ourref: newOurref,
    sequencenumber: newSeq,
    customer: newTransaction.Namecode,
    date: newDate,
    gross: newTransaction.Gross,
    lines: newDetails.length
  }
};
```

## Complete Function

```typescript
interface DuplicateInvoiceParams {
  sourceInvoice: string | number;  // Ourref or Sequencenumber
  newDate: string;                 // YYYYMMDD
  newPeriod: number;
}

async function duplicateInvoice(
  client: SmartMoneyWorksClient,
  params: DuplicateInvoiceParams
) {
  // 1. Find source transaction
  const search = typeof params.sourceInvoice === "number"
    ? `Sequencenumber=${params.sourceInvoice}`
    : `Ourref="${params.sourceInvoice}"`;

  const [source] = await client.export("Transaction", { search, limit: 1 });
  if (!source) throw new Error(`Invoice not found: ${params.sourceInvoice}`);

  // 2. Get item lines
  const details = await client.export("Detail", {
    search: `Parentseq=${source.Sequencenumber}`
  });
  const items = details.filter(d => d.Stockcode?.trim());

  // 3. Create new transaction
  const newTxn = {
    Type: source.Type,
    Namecode: source.Namecode,
    Tofrom: source.Tofrom,
    Description: source.Description,
    Gross: source.Gross,
    Taxamount: source.Taxamount,
    Contra: source.Contra,
    Transdate: params.newDate,
    Enterdate: toYYYYMMDD(new Date()),
    Period: params.newPeriod,
    Status: "U",
    Amtpaid: 0,
  };

  await client.import("Transaction", [newTxn], { mode: "create", workItOut: true });

  // 4. Get new sequence
  const [created] = await client.export("Transaction", {
    search: `Namecode="${newTxn.Namecode}" and Transdate="${params.newDate}"`,
    sort: "Sequencenumber desc",
    limit: 1
  });

  // 5. Import detail lines
  const newDetails = items.map((d, i) => ({
    Parentseq: created.Sequencenumber,
    Sort: i + 1,
    Account: d.Account,
    TaxCode: d.TaxCode,
    Gross: d.Gross,
    Tax: d.Tax,
    Description: d.Description,
    Stockcode: d.Stockcode,
    Stockqty: d.Stockqty,
    Unitprice: d.Unitprice,
    Period: params.newPeriod,
  }));

  await client.import("Detail", newDetails, { mode: "create", workItOut: true });

  return {
    sourceInvoice: source.Ourref,
    newInvoice: created.Ourref,
    newSequence: created.Sequencenumber,
    linesCreated: newDetails.length
  };
}
```

## Helper Functions

```typescript
function toYYYYMMDD(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}${m}${d}`;
}

function calculateDueDate(transdate: string, termsDays: number): string {
  const y = parseInt(transdate.substring(0, 4));
  const m = parseInt(transdate.substring(4, 6)) - 1;
  const d = parseInt(transdate.substring(6, 8));
  const date = new Date(y, m, d);
  date.setDate(date.getDate() + termsDays);
  return toYYYYMMDD(date);
}
```

## Transaction Types

| Type | Description |
|------|-------------|
| DII | Debtor Item Invoice (sales invoice) |
| DIC | Debtor Item Credit (sales credit note) |
| CII | Creditor Item Invoice (purchase invoice) |
| CIC | Creditor Item Credit |

## Fields Reference

### Transaction - Copy These

| Field | Description |
|-------|-------------|
| Type | Transaction type (DII, CII, etc.) |
| Namecode | Customer/supplier code |
| Tofrom | Customer/supplier name |
| Description | Invoice description |
| Gross | Total including tax |
| Taxamount | Tax amount |
| Contra | Control account (1500- for debtors) |

### Transaction - Update These

| Field | New Value |
|-------|-----------|
| Transdate | New invoice date (YYYYMMDD) |
| Enterdate | Today's date |
| Duedate | Transdate + terms |
| Period | New financial period |
| Status | "U" (unpaid) |
| Amtpaid | 0 |

### Transaction - Don't Set (MW Assigns)

- Sequencenumber
- Ourref
- _InternalId
- _Timestamp
- LastModifiedTime

### Detail - Copy These

| Field | Description |
|-------|-------------|
| Account | GL account code |
| TaxCode | Tax code (G, Z, etc.) |
| Gross, Tax, Debit, Credit | Amounts |
| Description | Line description |
| Stockcode | Product code |
| Stockqty | Quantity |
| Unitprice | Unit price |

### Detail - Update These

| Field | New Value |
|-------|-----------|
| Parentseq | New Transaction.Sequencenumber |
| Sort | Line order (1, 2, 3...) |
| Period | New financial period |

## Line Filtering

Only duplicate actual item lines, not auto-generated postings:

```typescript
// ✅ Include: Product lines
d.Stockcode && d.Stockcode.trim() !== ""

// ❌ Exclude: Control postings
// Account 1500- (debtor control)
// Account 2400- (GST collected)
// Account 1300- (inventory)
// Account 6000- (COGS)
```

MW regenerates control and tax postings automatically via `workItOut: true`.

## Period Calculation

Period numbers are document-specific. To find the correct period:

```typescript
// Query existing transaction from target month
const reference = await client.export("Transaction", {
  search: `Transdate>="${targetMonthStart}" and Transdate<="${targetMonthEnd}"`,
  limit: 1
});
const period = reference[0]?.Period;
```

Or ask the user for the period number if uncertain.
