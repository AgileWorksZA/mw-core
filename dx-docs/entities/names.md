# MoneyWorks Entity Guide: Names

## Architectural Overview
The **Names** entity is the central directory for all business contacts. It serves three distinct roles in the MoneyWorks ecosystem:
1.  **Identity**: Stores address, phone, and contact details.
2.  **Role Classification**: Defines if an entity is a Customer, Supplier, both, or neither.
3.  **Financial Control**: Manages credit limits, tax settings, and control accounts for Debtors and Creditors.

## Critical Concepts

### 1. The "Type" Hierarchy
MoneyWorks distinguishes between simple participants and full financial counterparties.

*   **Customer vs. Debtor**:
    *   **Customer (`CustomerType=1`)**: Someone you sell to (Cash Sales). No tracking of "money owed".
    *   **Debtor (`CustomerType=2`)**: A Customer who holds an account with you (Receivables). Supports aging, statements, and credit limits.

*   **Supplier vs. Creditor**:
    *   **Supplier (`SupplierType=1`)**: Someone you buy from (Cash Purchases).
    *   **Creditor (`SupplierType=2`)**: A Supplier you hold an account with (Payables). Supports aging and payment runs.

### 2. Dual-Layer Contact Architecture
MoneyWorks offers two ways to store people associated with a Name.

**Layer A: Embedded Contacts (The Simple Path)**
The Names table has built-in fields for up to two contacts. This is efficient for most SMB use cases.
*   **Contact 1**: `Contact`, `email`, `Mobile`, `DDI`, `Position`.
*   **Contact 2**: `Contact2`, `email2`, `Mobile2`, `DDI2`, `Position2`.
*   *Usage*: Default for invoices, statements, and quick lookups.

**Layer B: The "Contacts" Subfile (The Complex Path)**
For organizations requiring more than two contacts, MoneyWorks uses a separate **Contacts** table linked to the Name.
*   *Relationship*: `Contacts.ParentCode` → `Names.Code`.
*   *Usage*: Large organizations with multiple departments/roles (Accounts, Purchasing, Warehouse).

---

## Canonical Schemas

### Names Entity Fields
| Field | Type | Max | Required | Description | Relationship |
|-------|------|-----|----------|-------------|--------------|
| `Code` | Text | 11 | **Yes** | Unique Lookup Code (e.g., "ACME01"). | Primary Key |
| `Name` | Text | 255 | **Yes** | Full Legal/Trading Name. | - |
| `CustomerType` | Num | - | **Yes** | 0=None, 1=Customer, 2=Debtor. | - |
| `SupplierType` | Num | - | **Yes** | 0=None, 1=Supplier, 2=Creditor. | - |
| `RecAccount` | Text | 7 | Cond | Control Account (e.g., `1200` AR). | `Accounts.Code` |
| `PayAccount` | Text | 7 | Cond | Control Account (e.g., `2200` AP). | `Accounts.Code` |
| `CreditLimit` | Num | - | - | Max balance allowed for Debtors. | - |
| `TaxNumber` | Text | 20 | - | GST/VAT Registration Number. | - |
| `PaymentMethod`| Num | - | - | Default method (Chq, Direct, etc). | - |
| `Kind` | Num | - | **Yes** | 0=Template, 1=Normal. | - |
| `Hold` | Bool | - | - | Debtor is on hold. | - |
| `CCurrent` | Num | - | - | Current Creditor Balance. | - |
| `DCurrent` | Num | - | - | Current Debtor Balance. | - |
| `DebtorTerms` | Num | - | - | Days/Date terms for receivables. | - |
| `CreditorTerms`| Num | - | - | Days/Date terms for payables. | - |

### Embedded Contact Fields (Layer A)
| Field | Type | Max | Description |
|-------|------|-----|-------------|
| `Contact` | Text | 25 | Primary Contact Name. |
| `Phone` | Text | 19 | Main Company Phone. |
| `Mobile` | Text | 14 | Primary Contact Mobile. |
| `email` | Text | 80 | Primary Email (Invoices sent here). |
| `DDI` | Text | 19 | Primary Direct Dial. |
| `Afterhours` | Text | 11 | Primary After Hours. |
| `Position` | Text | 29 | Primary Contact Job Title. |
| `Salutation` | Text | 39 | Primary Contact Salutation. |
| `Role` | Num | - | Bit-mapped role flags. |
| `Memo` | Text | 255 | Internal notes. |

*(Note: Every field above has a `...2` equivalent for the secondary contact, e.g., `Contact2`, `Mobile2`)*

---

## Developer Tips

### 1. Creating a Debtor
To create a fully functional Debtor, you must set:
1.  `CustomerType = 2`
2.  `RecAccount` = Your General Ledger AR Account (e.g., "1200"). *If you miss this, you cannot post invoices to them.*
3.  `DebtorTerms`: Define when they must pay (e.g., `20` = 20th of next month).

### 2. Searching
*   **Find all Debtors**: `CustomerType=2`
*   **Find active Creditors**: `SupplierType=2 and isnull(StopCode)`

### 3. Handling Addresses
MoneyWorks stores addresses as multi-line text blocks but also supports discrete fields.
*   `PostAddress`: The full block (Street \r City \r Country).
*   `PostStreet`, `PostCity`, `PostCountry`: Discrete fields used for structured exports.
*   *Best Practice*: Write to the discrete fields if possible; MoneyWorks often auto-composes the block.
