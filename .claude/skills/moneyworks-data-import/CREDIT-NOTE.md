# Credit Note (Reverse Invoice)

> Shard of [moneyworks-data-import](SKILL.md) skill

Convert an existing invoice to a credit note by reversing all amounts - cancels sales, returns stock, reduces customer balance.

## Key Discovery

MoneyWorks "Reverse" operation performs an **in-place modification** of the original transaction. It does NOT create a new transaction - it converts the existing one.

## Agent Protocol

When user asks to create a credit note or reverse an invoice:

### Step 1: Find the Invoice to Reverse

```typescript
// Find by invoice number
const [invoice] = await client.export("Transaction", {
  search: `Ourref="${invoiceNumber}" and Type="DII"`,
  limit: 1
});

if (!invoice) {
  throw new Error(`Invoice ${invoiceNumber} not found`);
}

// Get invoice details
const details = await client.export("Detail", {
  search: `Parentseq=${invoice.Sequencenumber}`
});
```

### Step 2: Get Confirmation from User

Required:
- **Invoice Number**: Which invoice to reverse
- **Reason**: Why creating credit note (optional but recommended)

Confirm with user:
- Amount being credited: $X
- Customer: [Name]
- Line items being reversed

### Step 3: Reverse Transaction Header

```typescript
const reversedTransaction = {
  Sequencenumber: invoice.Sequencenumber,  // Same record
  Gross: -Math.abs(invoice.Gross),          // Flip to negative
  Status: "P",                               // Post immediately
  // Type stays as DII - MoneyWorks uses negative amounts
};

await client.import("Transaction", [reversedTransaction], {
  mode: "update"
});
```

### Step 4: Reverse Detail Lines

For each detail line, flip the signs:

```typescript
const reversedDetails = details.map(detail => ({
  Sequencenumber: detail.Sequencenumber,  // Update existing
  Gross: -detail.Gross,                    // Flip gross
  Debit: -detail.Debit,                    // Flip debit
  Credit: -detail.Credit,                  // Flip credit
}));

await client.import("Detail", reversedDetails, {
  mode: "update"
});
```

### Step 5: Verify Changes

```typescript
// Check transaction was reversed
const [updated] = await client.export("Transaction", {
  search: `Sequencenumber=${invoice.Sequencenumber}`
});

console.log("Gross:", updated.Gross);  // Should be negative

// Check customer balance reduced
const [customer] = await client.export("Name", {
  search: `Code="${invoice.Namecode}"`
});

console.log("Customer balance:", customer.DCurrent);
```

### Step 6: Report Success

```typescript
return {
  success: true,
  message: `Reversed invoice ${invoice.Ourref} for $${Math.abs(invoice.Gross)}`,
  creditNote: {
    ourref: invoice.Ourref,
    sequencenumber: invoice.Sequencenumber,
    originalAmount: Math.abs(originalGross),
    creditedAmount: Math.abs(updated.Gross),
    customer: invoice.Namecode
  }
};
```

## Complete Function

```typescript
interface ReverseInvoiceParams {
  invoiceNumber: string;  // Ourref of invoice to reverse
  reason?: string;        // Optional reversal reason
}

async function reverseInvoice(
  client: SmartMoneyWorksClient,
  params: ReverseInvoiceParams
) {
  // 1. Find invoice
  const [invoice] = await client.export("Transaction", {
    search: `Ourref="${params.invoiceNumber}" and Type="DII"`,
    limit: 1
  });

  if (!invoice) {
    throw new Error(`Invoice ${params.invoiceNumber} not found`);
  }

  if (invoice.Gross < 0) {
    throw new Error(`Invoice ${params.invoiceNumber} is already reversed`);
  }

  // Store original amount for reporting
  const originalGross = invoice.Gross;

  // 2. Get detail lines
  const details = await client.export("Detail", {
    search: `Parentseq=${invoice.Sequencenumber}`
  });

  // 3. Reverse transaction header
  const reversedTxn = {
    Sequencenumber: invoice.Sequencenumber,
    Gross: -Math.abs(invoice.Gross),
    Status: "P",
    Description: params.reason
      ? `${invoice.Description} [REVERSED: ${params.reason}]`
      : `${invoice.Description} [REVERSED]`
  };

  await client.import("Transaction", [reversedTxn], { mode: "update" });

  // 4. Reverse detail lines
  const reversedDetails = details.map(d => ({
    Sequencenumber: d.Sequencenumber,
    Gross: -d.Gross,
    Debit: -d.Debit,
    Credit: -d.Credit
  }));

  await client.import("Detail", reversedDetails, { mode: "update" });

  // 5. Return result
  return {
    success: true,
    invoiceNumber: invoice.Ourref,
    originalAmount: originalGross,
    creditedAmount: -originalGross,
    customer: invoice.Namecode,
    detailLinesReversed: details.length
  };
}
```

## What Changes During Reversal

### Transaction

| Field | Before | After |
|-------|--------|-------|
| Gross | 1121.06 | -1121.06 |
| Type | DII | DII (unchanged!) |
| Status | U or P | P |
| Sequencenumber | X | X (same record) |

**Key Insight**: Type stays as `DII`. MoneyWorks uses negative amounts to indicate credit notes, not a different transaction type.

### Detail Lines

| Line Type | Before | After |
|-----------|--------|-------|
| Sales (4000-) | Credit: 93.91 | Credit: -93.91 |
| Debtor Control (1500-) | Debit: 1121.06 | Debit: -1121.06 |
| GST (2400-) | Credit: 146.22 | Credit: -146.22 |
| Stock (1300-) | Credit: 323.82 | Debit: 323.82 |
| COGS (6000-) | Debit: 323.82 | Credit: 323.82 |

**Note**: Stock and COGS lines swap Debit/Credit rather than just negating.

### Product (Inventory)

Stock is returned:
```
BB200: -56 → -53 (+3 units returned)
BC200: 98 → 105 (+7 units returned)
CB100: 15 → 25 (+10 units returned)
```

### Name (Customer Balance)

Customer balance decreases by invoice amount:
```
ROSE DCurrent: 14666.44 → 13545.38 (-$1121.06)
```

## Alternative: Create Separate Credit Note

Instead of in-place reversal, create a new credit note transaction:

```typescript
async function createCreditNote(
  client: SmartMoneyWorksClient,
  invoiceNumber: string
) {
  // 1. Get original invoice
  const [invoice] = await client.export("Transaction", {
    search: `Ourref="${invoiceNumber}" and Type="DII"`
  });

  // 2. Create new credit note transaction
  const creditNote = {
    Type: "DIC",                              // Debtor Item Credit
    Namecode: invoice.Namecode,
    Transdate: toYYYYMMDD(new Date()),
    Period: getCurrentPeriod(),
    Gross: Math.abs(invoice.Gross),           // Positive gross
    Description: `Credit for invoice ${invoice.Ourref}`,
    Status: "P",
  };

  await client.import("Transaction", [creditNote], { mode: "create" });

  // 3. Get new sequence and create detail lines
  const [newCreditNote] = await client.export("Transaction", {
    search: `Type="DIC" and Namecode="${invoice.Namecode}"`,
    sort: "Sequencenumber desc",
    limit: 1
  });

  // 4. Create reversed detail lines
  const originalDetails = await client.export("Detail", {
    search: `Parentseq=${invoice.Sequencenumber}`
  });

  const creditDetails = originalDetails.map((d, i) => ({
    Parentseq: newCreditNote.Sequencenumber,
    Sort: i + 1,
    Account: d.Account,
    // Swap debits and credits
    Debit: d.Credit,
    Credit: d.Debit,
    Period: newCreditNote.Period
  }));

  await client.import("Detail", creditDetails, { mode: "create" });

  return {
    creditNoteNumber: newCreditNote.Ourref,
    originalInvoice: invoice.Ourref,
    amount: invoice.Gross
  };
}
```

## Transaction Types Reference

| Type | Description | Gross Sign |
|------|-------------|------------|
| **DII** | Debtor Item Invoice | Positive (or negative if reversed) |
| **DIC** | Debtor Item Credit | Positive |
| **CII** | Creditor Item Invoice (purchase) | Positive |
| **CIC** | Creditor Item Credit (purchase return) | Positive |

## Double Entry for Credit Note

```
Original Invoice:
DR  1500- Debtor Control    $1121.06
CR  4000- Sales              $974.84
CR  2400- GST Output         $146.22

Credit Note (Reversal):
DR  4000- Sales              $974.84  (reverse the sale)
DR  2400- GST Output         $146.22  (reverse the GST)
CR  1500- Debtor Control    $1121.06  (reduce receivables)
```

Plus inventory returned:
```
DR  1300- Inventory          $323.82  (stock returned)
CR  6000- Cost of Goods Sold $323.82  (reverse COGS)
```

## Partial Credit Notes

For partial credit (e.g., return some items):

```typescript
async function createPartialCreditNote(
  client: SmartMoneyWorksClient,
  invoiceNumber: string,
  linesToCredit: { sort: number; quantity?: number }[]
) {
  // Get original invoice and details
  const [invoice] = await client.export("Transaction", {
    search: `Ourref="${invoiceNumber}"`
  });

  const details = await client.export("Detail", {
    search: `Parentseq=${invoice.Sequencenumber}`
  });

  // Create new credit note with only selected lines
  const creditNote = {
    Type: "DIC",
    Namecode: invoice.Namecode,
    Transdate: toYYYYMMDD(new Date()),
    Period: getCurrentPeriod(),
    Description: `Partial credit for invoice ${invoice.Ourref}`,
    Status: "P",
    Gross: 0  // Will be calculated from details
  };

  // ... import and calculate total from selected lines
}
```

## Verification Queries

```typescript
// All credit notes for a customer
const creditNotes = await client.export("Transaction", {
  search: `Namecode="${customerCode}" and Gross<0 and Type="DII"`
});

// Or using DIC type (if separate credit note)
const separateCreditNotes = await client.export("Transaction", {
  search: `Namecode="${customerCode}" and Type="DIC"`
});

// Check if invoice has been reversed
const [invoice] = await client.export("Transaction", {
  search: `Ourref="${invoiceNumber}"`
});
const isReversed = invoice.Gross < 0;
```
