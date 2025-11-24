# MoneyWorks Entity Guide: Transactions

## Architectural Overview
The **Transaction** entity is the core operational unit in MoneyWorks. It represents every financial event, from invoices and payments to general ledger journals and stock movements.

### Critical Architecture: The Header/Detail Split
MoneyWorks uses a classic **Header/Detail** pattern, but they are stored as distinct entities that must be managed together.

*   **Transaction (Header)**: Contains the "Who", "When", "Total Amount", and "Type".
    *   *Key Field*: `SequenceNumber` (Primary Key).
*   **Detail (Lines)**: Contains the "What" (Account codes, Products, line amounts).
    *   *Link Field*: `Detail.ParentSeq` (Foreign Key linking to `Transaction.SequenceNumber`).

> **Developer Note**: When creating a transaction via API or Script, you typically construct the Header and its Details simultaneously. Deleting a header usually cascades to delete its details.

### The Posting Lifecycle
Transactions exist in one of two primary states, defined by the `Status` field:
1.  **Unposted (`Status='U'`)**: The transaction is draft. It does not affect General Ledger balances. It can be modified or deleted freely.
2.  **Posted (`Status='P'`)**: The transaction is committed. It updates GL balances, inventory levels, and customer/supplier balances. It **cannot** be modified (mostly) or deleted, only reversed.

---

## Canonical Schemas

### 1. Transaction Header Fields

#### Core Identification
| Field | Type | Required | Description | Relationship |
|-------|------|----------|-------------|--------------|
| `SequenceNumber` | Num | **Yes** | Unique Primary Key. | - |
| `Type` | Text | **Yes** | Transaction Type Code (e.g., `CIC`, `CP`). | [See Types](#transaction-types) |
| `Status` | Text | **Yes** | `U` (Unposted) or `P` (Posted). | - |
| `TransDate` | Date | **Yes** | The accounting date of the transaction. | - |
| `Period` | Num | **Yes** | Financial Period (e.g. `202301`). | - |
| `NameCode` | Text | **Yes** | Customer or Supplier Code. | `Names.Code` |
| `OurRef` | Text | **Yes** | Internal Doc Number (Invoice #, Cheque #). | - |
| `TheirRef` | Text | No | External Ref (Customer PO, Supplier Inv). | - |
| `Description` | Text | **Yes** | Primary narrative description. | - |
| `Contra` | Text | - | Control Account or Bank Account. | `Accounts.Code` |
| `ToFrom` | Text | - | Payee/Payer name (for cash trans). | - |

#### Financials & Tax
| Field | Type | Description |
|-------|------|-------------|
| `Gross` | Num | Total transaction value (inclusive of tax). |
| `TaxAmount` | Num | Total GST/Tax component. |
| `Currency` | Text | Currency Code (e.g., "USD"). |
| `ExchangeRate` | Num | Rate vs Base Currency. |
| `TaxCycle` | Num | GST Cycle ID. |
| `ProdPriceCode`| Text | Pricing Level (A-F). |

#### Payment & Aging
| Field | Type | Description |
|-------|------|-------------|
| `DueDate` | Date | When payment is expected. |
| `DatePaid` | Date | Date of last payment. |
| `AmtPaid` | Num | Amount paid so far. |
| `PayAmount` | Num | Amount scheduled for next payment run. |
| `Hold` | Bool | Transaction is on hold. |
| `Aging` | Num | Aging bucket index. |
| `PromptPaymentDate` | Date | Discount expiry date. |
| `PromptPaymentAmt` | Num | Discount amount available. |

#### Logistics & Order Info
| Field | Type | Description |
|-------|------|-------------|
| `MailingAddress` | Text | Specific billing address. |
| `DeliveryAddress` | Text | Specific shipping address. |
| `FreightCode` | Text | Shipping method code. |
| `FreightDetails` | Text | Shipping instructions. |
| `Salesperson` | Text | Sales rep code. |
| `OrderTotal` | Num | Original order total. |
| `OrderShipped` | Num | Value shipped so far. |

#### System & Audit
| Field | Type | Description |
|-------|------|-------------|
| `EnterDate` | Date | System date of creation. |
| `EnteredBy` | Text | Initials of creator. |
| `PostedBy` | Text | Initials of poster. |
| `LastModifiedTime` | Text | Timestamp of last edit. |
| `TimePosted` | Text | Timestamp of posting. |
| `SecurityLevel` | Num | Access level required. |
| `User1`..`User8` | Text | Custom user fields. |
| `UserNum`, `UserText` | Var | Scriptable storage fields. |


### 2. Transaction Detail (Line) Fields
| Field | Type | Max | Description | Relationship |
|-------|------|-----|-------------|--------------|
| `Detail.ParentSeq` | Num | - | **Foreign Key** to Header. | `Transaction.SequenceNumber` |
| `Detail.Account` | Text | 14 | GL Account Code (or `Account-Dept`). | `Accounts.Code` |
| `Detail.Net` | Num | - | Line amount (exclusive of tax). | - |
| `Detail.Tax` | Num | - | Tax amount for this line. | - |
| `Detail.Gross` | Num | - | Line amount (inclusive of tax). | - |
| `Detail.StockCode` | Text | 19 | Product Code (if inventory item). | `Products.Code` |
| `Detail.StockQty` | Num | - | Quantity of goods. | - |
| `Detail.Description`| Text | 1020| Line-specific description. | - |
| `Detail.JobCode` | Text | 9 | Job/Project Code for costing. | `Jobs.Code` |

---

## Reference: Transaction Types
MoneyWorks uses specific 3-letter codes to define the behavior of a transaction.

| Code | Canonical Name | Business Context |
|------|----------------|------------------|
| `CIC` | Creditor Invoice (Complete) | A bill received from a supplier that is already fully paid (rare). |
| `CII` | **Creditor Invoice** | A standard bill received from a supplier to be paid later (Payable). |
| `CP` | **Cash Payment** | Immediate payment for expenses (not against an invoice). |
| `CPC` | Cash Payment (Creditor) | A payment meant to pay off an existing `CII`. |
| `CR` | **Cash Receipt** | Immediate income (Cash Sale). |
| `DIC` | Debtor Invoice (Complete) | An invoice sent to a customer that is already paid (Cash Sale with Invoice). |
| `DII` | **Debtor Invoice** | Standard sales invoice sent to a customer (Receivable). |
| `JN` | General Journal | Manual GL adjustments. |
| `JNS` | Stock Journal | Inventory adjustments. |
| `SO` / `PO` | Sales/Purchase Order | Orders (Non-financial untill processed). |

## Developer Tips

### 1. The "Contra" Field Logic
The `Contra` field changes meaning based on `Type`:
*   **Invoices (`DII`, `CII`)**: It is the **Control Account** (e.g., Accounts Receivable/Payable). Often set automatically by the system based on the `NameCode`.
*   **Cash (`CP`, `CR`)**: It is the **Bank Account** code where the money is coming from/going to.

### 2. Calculating Tax
MoneyWorks generally calculates tax bottom-up:
1.  `Detail.Tax` is calculated for each line based on the Tax Code of the Account or Product.
2.  `Transaction.TaxAmount` is the sum of all `Detail.Tax`.
3.  `Transaction.Gross` = Sum of all `Detail.Net` + `Transaction.TaxAmount`.

### 3. Key lookups
*   **Find all unpaid invoices for a customer**:
    `Type="DII" and Status="P" and NameCode="XYZ" and BalanceDue <> 0`
