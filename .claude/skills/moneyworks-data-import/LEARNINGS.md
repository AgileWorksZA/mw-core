# MoneyWorks Data Import - Learnings

> Accumulated knowledge from mapping MoneyWorks Gold operations to API calls.
> Updated: 2025-11-27 with manual extracts

---

## Transaction Type Convention

MoneyWorks uses a **3-letter code system**:
- **First 2 letters** = Transaction type (DI, CI, CR, CP, etc.)
- **3rd letter** = Status suffix:
  - **I** = Incomplete (Unpaid/Part-paid)
  - **C** = Complete (Fully Paid)

## Complete Transaction Reference

| Code | Full Name | Category | Description |
|------|-----------|----------|-------------|
| **DI** (DII, DIC) | Debtor Invoice | Sales | Invoice to customer. DII=Unpaid, DIC=Paid |
| **CI** (CII, CIC) | Creditor Invoice | Purchasing | Invoice from supplier. CII=Unpaid, CIC=Paid |
| **CR** | Cash Receipt | Cash | Direct sale/income received immediately |
| **CP** | Cash Payment | Cash | Direct expense payment |
| **CRD** | Receipt on Invoice | Sales/Cash | Payment received from debtor for specific invoices |
| **CPC** | Payment on Invoice | Purchasing/Cash | Payment to creditor for specific invoices |
| **JN** | General Journal | GL | Adjustments, accruals, depreciation |
| **JNS** | Stock Journal | Inventory | Stock adjustments (Make, Break, WriteOff, Create, Revalue, Transfer) |
| **SO** (SOI, SOC) | Sales Order | Sales | Non-accounting until processed |
| **PO** (POI, POC) | Purchase Order | Purchasing | Non-accounting until received |
| **QU** | Quote | Sales | Price quotation (non-accounting) |
| **CPD** | Returned Refund | Adjustment | Refund TO customer (clears AR overpayments) |
| **CRC** | Refund from Creditor | Adjustment | Refund FROM supplier (clears AP overpayments) |

### Credit Notes via Negative Amounts

**Key Discovery**: Credit notes are created by using **negative Gross amounts**:
- **DI with negative Gross** = Debtor Credit Note
- **CI with negative Gross** = Creditor Credit Note
- No separate DIC/CIC transaction types needed!

### Non-Accounting Transactions

These don't hit the GL until converted:
- **QU** (Quote) - until converted to SO or Job
- **SO** (Sales Order) - until shipped/invoiced
- **PO** (Purchase Order) - until received/invoiced

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

---

## REST API Reference

### Base URL Structure
```
http://server_address:port/REST/Document_Name/command
Example: http://myserver:6710/REST/Acme%20Widgets/export/...
```

### Authentication
- **Method**: Basic Authentication
- **Credentials**: Username and password for the specific document

### Endpoints

| Command | Description | Parameters |
|---------|-------------|------------|
| **export** | Retrieves data from a table | `table=<name>`, `search=<expr>`, `format=xml`, `sort=<field>` |
| **import** | Submits new records | Body: XML data. Returns: Success or error list |
| **post** | Posts a transaction | `seqnum=<sequence_number>` |
| **doform** | Generates PDF of form | `form=<form_name>`, `search=<expression>` |
| **image** | Get/update attached image | `ident=<product_code>` |
| **evaluate** | Evaluates MW expression | `expr=<expression>` |

### Data Format Limitation
| Direction | Format |
|-----------|--------|
| Export | XML, HTML, Text, JSON (via custom reports) |
| Import | **XML only** |

---

## Payments Table Architecture

**Table Name**: `Payments` (Internal join table)
**Relationship**: Many-to-Many

| Field Name | Data Type | Description |
|------------|-----------|-------------|
| **CashTrans** | Number | SequenceNumber of Payment (CP/CPC) or Receipt (CR/CRD) |
| **InvoiceID** | Number | SequenceNumber of Invoice (DI/CI) being paid |
| **Amount** | Number | Amount allocated to this invoice |
| **Date** | Date | Date of payment/receipt |

### Key Behaviors
- **Partial Payments**: Creates Payments record where Amount < Invoice Total. Invoice remains "Open"
- **AmtPaid Field**: **Calculated** - sums all related Payments records (not stored!)
- **Overpayments**: Surplus credits to debtor's account (stored in Name record balances)

---

## Date Formats

| Interface | Format | Notes |
|-----------|--------|-------|
| **Import (XML/REST)** | `YYYYMMDD` | **Strictly enforced**. Big-endian. |
| **Import (Text/CSV)** | `dd/mm/yy` | Locale-dependent. |
| **Display (UI)** | `dd/mm/yy` | OS Locale settings. |

```typescript
// ✅ Correct - YYYYMMDD (no separators)
Transdate: "20250114"

// ❌ Will fail
Transdate: "2025-01-14"
```

### Period Formula
```
Period = (Year * 100) + PeriodNumber
Example: 202301 = January 2023 (1st period of year 2023)
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

---

## MWScript / Expressions

### Basic Syntax

| Data Type | Syntax | Example |
|-----------|--------|---------|
| Text | Double quotes | `NameCode = "ACME"` |
| Numbers | Raw digits | `Gross > 1000.00` |
| Dates | Single quotes | `TransDate >= '01/04/23'` |
| Booleans | 1/0 | `Hold = 1` |

### Operators

| Symbol | Function | Example |
|--------|----------|---------|
| `=` | Equals | `Type = "DI"` |
| `<>` or `!=` | Not Equals | `Status <> "P"` |
| `>`, `<`, `>=`, `<=` | Comparison | `Gross > 500` |
| `&` or `AND` | Logical AND | `Type="DI" & Gross > 0` |
| `\|` or `OR` | Logical OR | `Type="DI" \| Type="CI"` |
| `!` or `NOT` | Logical NOT | `!Hold` |
| `( )` | Grouping | `(Gross > 100 OR Tax > 10) AND Type="DI"` |

### Wildcards

| Symbol | Function | Example | Matches |
|--------|----------|---------|---------|
| `@` | Starts With | `NameCode = "ABC@"` | ABCD, ABCE |
| `@...@` | Contains | `Description = "@service@"` | Any containing "service" |
| `?` | Single Char | `Code = "A?C"` | ABC, ADC, AXC |

### Relational Searches

Search related tables with: `[Table: Expression]`

| Goal | Formula |
|------|---------|
| Find by Detail Line | `[Detail: StockCode="WIDGET"]` |
| Find by Customer Location | `[Name: City="Auckland"]` |
| Find by Job | `[Detail: JobCode="JOB101"]` |

**Chained**: `[Name: [Transaction: [Detail: StockCode="Product X"]]]`
**Negated**: `[Transaction: [Detail: StockCode="Product X"]][!]` (Never bought)

### Meta Keywords

| Keyword | Description |
|---------|-------------|
| `*highlighted` | Currently selected records |
| `*found` | Current found set |
| `*foundorall` | Found set or all if no search active |

---

## URL Encoding for REST API

### Two Layers of Escaping
1. **MoneyWorks Expression Escaping**
2. **URL Encoding**

### String Delimiters

| Delimiter | Use Case |
|-----------|----------|
| `"` (double quotes) | Standard |
| `` ` `` (backticks) | When value contains quotes |

### Escape Sequences

| Character | Escape |
|-----------|--------|
| `"` | `\"` |
| `\` | `\\` |
| `` ` `` | `` \` `` |

### URL Encoding Reference

| Char | Encoded |
|------|---------|
| Space | `%20` |
| `"` | `%22` |
| `` ` `` | `%60` |
| `=` | `%3D` |
| `\` | `%5C` |
| `'` | `%27` |

### Examples

**Simple**: `NameCode="ACME"` → `NameCode%3D%22ACME%22`
**With Spaces**: `Name="Acme Widgets"` → `Name%3D%22Acme%20Widgets%22`
**Date**: `TransDate='20230131'` → `TransDate%3D%2720230131%27`

---

## Keyboard Shortcuts (macOS)

### Navigation / Lists
| Shortcut | Function |
|----------|----------|
| **Cmd+0** | Navigator |
| Cmd+1 | Accounts List |
| Cmd+2 | Names List |
| Cmd+3 | Items/Products List |
| Cmd+4 | Jobs List |
| Cmd+5 | Job Sheet Items |
| Cmd+6 | Budgets |
| Cmd+7 | Product Sales Enquiry |
| Cmd+8 | Customer Sales Enquiry |
| Cmd+9 | Stock Enquiry |
| **Cmd+T** | Transactions List |
| **Cmd+E** | Account Enquiry |

### Transaction Processing
| Shortcut | Function |
|----------|----------|
| **Cmd+K** | Post Transactions |
| **Cmd+-** | Cancel Transaction |
| Cmd+[ | Print Form |
| Cmd+\ | Bill Job |
| **Cmd+R** | Batch Debtor Receipts |
| **Cmd+Y** | Batch Creditor Payments |
| Opt+Cmd+N | New Transaction (from anywhere) |

### General
| Shortcut | Function |
|----------|----------|
| Cmd+N | New Record/Transaction |
| Cmd+S | Save |
| Cmd+W | Close Window |
| Cmd+F | Find (Advanced) |
| Cmd+G | Find Next |
| Cmd+J | Find All (Show All) |
| Cmd+A | Select All |
| Cmd+= | Sum Selection |

---

## Batch Operations

| Command | Purpose | Creates | Effect |
|---------|---------|---------|--------|
| **Batch Debtor Receipts** (Cmd+R) | Process incoming customer payments | Individual `CR` transactions | Posts immediately, updates Payments table |
| **Batch Creditor Payments** (Cmd+Y) | "Cheque Run" to suppliers | Individual `CP` transactions | Posts immediately, updates Payments table |

---

## Transaction Reversal / Cancellation

| Aspect | Details |
|--------|---------|
| **Command** | `Command > Adjustment > Cancel Transaction` |
| **Shortcut** | `Cmd+-` (hyphen) |
| **Original Transaction** | Status changes to Cancelled (flagged). Remains in database for audit. |
| **New Transaction** | Duplicate with **negated amounts**. Suffix `-` added to OurRef (e.g., `INV1001` → `INV1001-`). Auto-posted. |
| **Partial Reversal** | **NOT POSSIBLE**. Must cancel entire transaction, then re-enter correct amount. |

---

## Common Pitfalls

### 1. Unposted vs Unpaid
- **Unposted** (Status=U): Draft, doesn't affect anything
- **Unpaid** (Amtpaid < Gross): Posted but not yet paid

### 2. Credit Notes via Negative Amounts
MoneyWorks uses **negative Gross** for credit notes, not separate transaction types.
The Type stays DI/CI - only the sign changes!

### 3. AmtPaid is Calculated
The `Amtpaid` field on Transaction is **calculated** from the Payments table at runtime.
Don't try to set it directly - it will be ignored.

### 4. Detail Lines Need Parentseq
When importing details for a new transaction:
1. Import Transaction first
2. Query to get the new Sequencenumber
3. Set Parentseq on all Detail lines
4. Import Detail lines

### 5. Stock Only Changes When Posted
Product.Stockonhand only updates when transaction Status changes to P.

### 6. Customer Balance Only Updates When Posted
Name.DCurrent only updates when transaction is posted.

### 7. Cannot Partial Reverse
MoneyWorks doesn't support partial reversals. Must cancel the entire transaction and re-enter with correct amount.

### 8. JN Cannot Adjust AR/AP
General Journals **cannot** adjust Accounts Receivable or Payable control accounts.
Must use proper transaction types (CRD, CPC, CPD, CRC) for debtor/creditor adjustments.

## Verified Workflows

| Workflow | Status | Reference |
|----------|--------|-----------|
| Invoice Duplication | ✅ Mapped | [INVOICE-DUPLICATION.md](INVOICE-DUPLICATION.md) |
| Payment Receipt | ✅ Mapped | [PAYMENT-RECEIPT.md](PAYMENT-RECEIPT.md) |
| Credit Note (Reversal) | ✅ Mapped | [CREDIT-NOTE.md](CREDIT-NOTE.md) |
| Transaction Types | ✅ Documented | [MANUAL-EXTRACT-TRANSACTION-TYPES.md](MANUAL-EXTRACT-TRANSACTION-TYPES.md) |
| Field Reference | ✅ Documented | [MANUAL-EXTRACT-FIELDS.md](MANUAL-EXTRACT-FIELDS.md) |
| API & Expressions | ✅ Documented | [MANUAL-EXTRACT-API-PAYMENTS-EXPRESSIONS.md](MANUAL-EXTRACT-API-PAYMENTS-EXPRESSIONS.md) |
| Journal Entry | ⏳ TODO | - |
| PO → Receive → Invoice | ⏳ TODO | - |
| Stock Adjustment (JNS) | ⏳ TODO | - |
| Customer/Supplier Import | ⏳ TODO | - |
| Product Import | ⏳ TODO | - |

## Snapshots Reference

| Snapshot | Description |
|----------|-------------|
| baseline-scenarios | Clean state before testing |
| after-post-invoice | Invoice 2131 posted (U→P) |
| after-payment | Receipt 351 recorded for invoice 2131 |
| after-credit-note | Invoice 2130 reversed |

---

## Source Documentation

The knowledge in this file was compiled from:

1. **Snapshot Diff Analysis** - Comparing MW Gold database state before/after operations
2. **Remote Agent UI Mapping** - Automated exploration of MW Gold UI via AppleScript
3. **Manual Extraction via Gemini** - 1M context analysis of MoneyWorks User Guide

### Manual Extract Files

| File | Content | Source Pages |
|------|---------|--------------|
| [MANUAL-EXTRACT-TRANSACTION-TYPES.md](MANUAL-EXTRACT-TRANSACTION-TYPES.md) | Complete transaction type reference | pp. 769, 154-161, 192-213, 414-443 |
| [MANUAL-EXTRACT-FIELDS.md](MANUAL-EXTRACT-FIELDS.md) | Transaction/Detail fields, dates, periods | MW User Guide |
| [MANUAL-EXTRACT-API-PAYMENTS-EXPRESSIONS.md](MANUAL-EXTRACT-API-PAYMENTS-EXPRESSIONS.md) | REST API, Payments table, MWScript, shortcuts | pp. 97-99, 615-622, 641, 695, 727, 779 |

### Remote Mapping Results

Located in `.claude/remote-jobs/results/`:
- `KEYBOARD-SHORTCUTS.md` - 45+ shortcuts tested
- `MENU-STRUCTURE.md` - 150+ menu items
- `NAVIGATOR-MAP.md` - Dashboard workflow mapping
- `TRANSACTION-WORKFLOWS.md` - Sales invoice workflow
- `SUMMARY.md` - Session overview
