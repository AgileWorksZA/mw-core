# Payment Receipt

> Shard of [moneyworks-data-import](SKILL.md) skill

Record a customer payment against an outstanding invoice - creates a Cash Receipt Debtor (CRD) transaction.

## Agent Protocol

When user asks to record a payment against an invoice:

### Step 1: Find the Unpaid Invoice

```typescript
// Find by invoice number
const invoices = await client.export("Transaction", {
  search: `Ourref="${invoiceNumber}" and Type="DII"`,
  limit: 1
});
const invoice = invoices[0];

// Verify it's unpaid (Amtpaid < Gross)
if (invoice.Amtpaid >= invoice.Gross) {
  throw new Error(`Invoice ${invoiceNumber} is already fully paid`);
}

const outstanding = invoice.Gross - invoice.Amtpaid;
```

### Step 2: Get Payment Details from User

Required:
- **Amount**: Full ($757.12) or partial payment
- **Date**: Payment date (YYYYMMDD)
- **Bank Account**: Which account receives money (e.g., "1000-")

Optional:
- **Reference**: Cheque number, transfer reference
- **Description**: Payment notes

### Step 3: Create Receipt Transaction

```typescript
const receipt = {
  Type: "CRD",                    // Cash Receipt Debtor
  Namecode: invoice.Namecode,     // Same customer
  Transdate: paymentDate,         // YYYYMMDD format
  Enterdate: toYYYYMMDD(new Date()),
  Period: invoice.Period,         // Same period or current
  Gross: paymentAmount,
  Contra: bankAccount,            // e.g., "1000-"
  Description: invoice.Ourref,    // Link to invoice number
  Status: "P",                    // Posted
};

await client.import("Transaction", [receipt], {
  mode: "create",
  workItOut: true
});
```

### Step 4: Get New Receipt Sequence

```typescript
const [newReceipt] = await client.export("Transaction", {
  search: `Type="CRD" and Namecode="${invoice.Namecode}"`,
  sort: "Sequencenumber desc",
  limit: 1
});
const receiptSeq = newReceipt.Sequencenumber;
```

### Step 5: Create Detail Lines (Double Entry)

```typescript
const details = [
  {
    Parentseq: receiptSeq,
    Sort: 1,
    Account: "1500-",           // Debtor Control - CREDIT
    Debit: 0,
    Credit: paymentAmount,
    Period: receipt.Period,
  },
  {
    Parentseq: receiptSeq,
    Sort: 2,
    Account: bankAccount,       // Bank - DEBIT
    Debit: paymentAmount,
    Credit: 0,
    Period: receipt.Period,
  }
];

await client.import("Detail", details, {
  mode: "create",
  workItOut: true
});
```

### Step 6: Update Original Invoice (if needed)

MoneyWorks may auto-update via `workItOut`, but if manual:

```typescript
const updatedInvoice = {
  Sequencenumber: invoice.Sequencenumber,
  Amtpaid: invoice.Amtpaid + paymentAmount,
  Datepaid: paymentAmount >= outstanding ? paymentDate : invoice.Datepaid,
};

await client.import("Transaction", [updatedInvoice], {
  mode: "update"
});
```

### Step 7: Create Payment Link Record

```typescript
// Payments table links receipts to invoices
const paymentLink = {
  Invoiceseq: invoice.Sequencenumber,    // Original invoice
  Cashtrans: receiptSeq,                  // Receipt transaction
  Amount: paymentAmount,
  Date: paymentDate,
};

await client.import("Payments", [paymentLink], {
  mode: "create"
});
```

### Step 8: Report Success

```typescript
return {
  success: true,
  message: `Recorded $${paymentAmount} payment on invoice ${invoice.Ourref}`,
  receipt: {
    ourref: newReceipt.Ourref,
    sequencenumber: receiptSeq,
    amount: paymentAmount,
    date: paymentDate,
    bankAccount: bankAccount
  },
  invoice: {
    ourref: invoice.Ourref,
    originalAmount: invoice.Gross,
    previouslyPaid: invoice.Amtpaid,
    thisPaid: paymentAmount,
    remaining: outstanding - paymentAmount
  }
};
```

## Complete Function

```typescript
interface RecordPaymentParams {
  invoiceNumber: string;      // Ourref of invoice
  amount: number;             // Payment amount
  date: string;               // YYYYMMDD
  bankAccount: string;        // e.g., "1000-"
  reference?: string;         // Optional reference
}

async function recordPayment(
  client: SmartMoneyWorksClient,
  params: RecordPaymentParams
) {
  // 1. Find invoice
  const [invoice] = await client.export("Transaction", {
    search: `Ourref="${params.invoiceNumber}" and Type="DII"`,
    limit: 1
  });
  if (!invoice) throw new Error(`Invoice ${params.invoiceNumber} not found`);

  const outstanding = invoice.Gross - (invoice.Amtpaid || 0);
  if (params.amount > outstanding) {
    throw new Error(`Payment $${params.amount} exceeds outstanding $${outstanding}`);
  }

  // 2. Create receipt transaction
  const receipt = {
    Type: "CRD",
    Namecode: invoice.Namecode,
    Transdate: params.date,
    Enterdate: toYYYYMMDD(new Date()),
    Period: invoice.Period,
    Gross: params.amount,
    Contra: params.bankAccount,
    Description: invoice.Ourref,
    Theirref: params.reference || "",
  };

  await client.import("Transaction", [receipt], { mode: "create", workItOut: true });

  // 3. Get new receipt
  const [newReceipt] = await client.export("Transaction", {
    search: `Type="CRD" and Namecode="${invoice.Namecode}" and Transdate="${params.date}"`,
    sort: "Sequencenumber desc",
    limit: 1
  });

  // 4. Create detail lines
  const details = [
    {
      Parentseq: newReceipt.Sequencenumber,
      Sort: 1,
      Account: "1500-",
      Credit: params.amount,
      Debit: 0,
      Period: receipt.Period,
    },
    {
      Parentseq: newReceipt.Sequencenumber,
      Sort: 2,
      Account: params.bankAccount,
      Debit: params.amount,
      Credit: 0,
      Period: receipt.Period,
    }
  ];

  await client.import("Detail", details, { mode: "create", workItOut: true });

  // 5. Return result
  const fullyPaid = params.amount >= outstanding;
  return {
    receiptNumber: newReceipt.Ourref,
    receiptSeq: newReceipt.Sequencenumber,
    invoiceNumber: invoice.Ourref,
    amountPaid: params.amount,
    fullyPaid,
    remaining: fullyPaid ? 0 : outstanding - params.amount
  };
}
```

## Transaction Types

| Type | Description | Use |
|------|-------------|-----|
| **CRD** | Cash Receipt Debtor | Customer payment |
| **CPD** | Cash Payment Debtor | Refund to customer |
| **CRC** | Cash Receipt Creditor | Refund from supplier |
| **CPC** | Cash Payment Creditor | Pay supplier |

## Double Entry for Customer Payment

```
DR  1000- Bank Account        $757.12  (money in)
CR  1500- Debtor Control      $757.12  (reduce receivables)
```

## Invoice Status After Payment

| Scenario | Amtpaid | Status |
|----------|---------|--------|
| Unpaid | 0 | P (Posted) |
| Partial payment | < Gross | P (Posted) |
| Fully paid | = Gross | P (Posted) |

**Note:** Status remains "P" (Posted). The `Amtpaid` field tracks payment progress.

## Partial Payment Example

```typescript
// Invoice: $1000, paying $400
await recordPayment(client, {
  invoiceNumber: "2131",
  amount: 400,
  date: "20250115",
  bankAccount: "1000-"
});

// Result:
// Invoice.Amtpaid: 400
// Invoice.Datepaid: null (not fully paid)
// Outstanding: $600
```

## Finding Unpaid Invoices

```typescript
// All unpaid debtor invoices
const unpaid = await client.export("Transaction", {
  search: `Type="DII" and Gross>Amtpaid`,
  sort: "Transdate"
});

// Unpaid for specific customer
const unpaidForCustomer = await client.export("Transaction", {
  search: `Type="DII" and Namecode="WHITE" and Gross>Amtpaid`
});
```

## Common Accounts

| Account | Purpose |
|---------|---------|
| 1000- | Main Bank / Cheque Account |
| 1010- | Savings Account |
| 1020- | Credit Card Account |
| 1500- | Debtor Control (Accounts Receivable) |
| 2000- | Creditor Control (Accounts Payable) |

## Verification

After recording payment:

```typescript
// Check invoice updated
const [updated] = await client.export("Transaction", {
  search: `Ourref="${invoiceNumber}"`
});
console.log("Paid:", updated.Amtpaid, "of", updated.Gross);

// Check receipt exists
const [receipt] = await client.export("Transaction", {
  search: `Type="CRD" and Description="${invoiceNumber}"`
});
console.log("Receipt:", receipt.Ourref);
```
