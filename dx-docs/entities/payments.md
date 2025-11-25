# MoneyWorks Entity Guide: Payments

## Architectural Overview
The **Payments** entity is a **junction table** (many-to-many link) that connects **Transactions** (Payments/Receipts) to **Transactions** (Invoices). It is the mechanism for "allocating" a payment to specific invoices.

### Critical Concepts

#### 1. The Linking Mechanism
A single payment (e.g., a cheque for $1000) can pay multiple invoices. Conversely, a single invoice can be paid by multiple partial payments. The **Payments** table stores these links.
*   **`CashTrans`**: The Sequence Number of the Payment Transaction (Type `CP`, `CR`).
*   **`InvoiceID`**: The Sequence Number of the Invoice Transaction (Type `CII`, `DII`).
*   **`Amount`**: The portion of the payment allocated to this specific invoice.

#### 2. Overpayments (The Negative ID Hack)
If a debtor pays *more* than they owe, or pays in advance, there is no invoice to link to. MoneyWorks handles this by using a **Negative InvoiceID**.
*   **Positive ID**: Points to a Transaction (`SequenceNumber`).
*   **Negative ID**: Points to a **Name** record (Debtor).
    *   *Formula*: `Name.SequenceNumber + 2147483648` (High bit set), then negated.
    *   *Context*: Allows the payment to sit on the Debtor's account as "Unallocated Cash".

#### 3. GST Cycles
The `GSTCycle` field tracks *when* this payment was reported to the tax authority.
*   **Positive**: Reported in a specific GST cycle.
*   **Negative**: Processed on an accrual/invoice basis (tax was reported when the *Invoice* was posted, not the payment).

---

## Canonical Schemas

### Payment Fields

| Field | Type | Max | Required | Description | Relationship |
|-------|------|-----|----------|-------------|--------------|
| `CashTrans` | Num | - | **Yes** | The Payment/Receipt Transaction. | `Transaction.SequenceNumber` |
| `InvoiceID` | Num | - | **Yes** | The Invoice being paid (or Name if overpaid). | `Transaction.Seq` / `Name.Seq` |
| `Amount` | Num | - | **Yes** | Allocated amount. | - |
| `Date` | Date | - | **Yes** | Date of allocation. | - |
| `GSTCycle` | Num | - | - | Tax reporting cycle ID. | - |
| `LastModifiedTime`| Text | - | - | Timestamp. | - |

---

## Developer Tips

### 1. Finding Unpaid Invoices
You don't query the Payments table directly to find unpaid invoices. You query the **Transaction** table.
*   *Query*: `Type="DII" and Status="P" and BalanceDue > 0`

### 2. Allocating a Payment via API
To allocate a payment via the REST API or Import, you typically import a transaction with `Type="CR"` (Cash Receipt) and include nested lines for the allocations if supported, or let MoneyWorks auto-allocate (FIFO).
*   *Best Practice*: If you need precise control, use the `Allocate` command (if available via CLI/API wrapper) or construct the payment carefully.

### 3. The "Contra" Logic
When `InvoiceID` links to a Name (Overpayment), the payment sits in the `Contra` account of the payment transaction until it is later "offset" against a future invoice.
