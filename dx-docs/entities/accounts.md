# MoneyWorks Entity Guide: Accounts

## Architectural Overview
The **Accounts** entity represents the General Ledger (GL) - the backbone of the MoneyWorks financial system. Every financial transaction line must reference a valid Account Code.

### Critical Concepts

#### 1. The Chart of Accounts Structure
MoneyWorks uses a **Type-driven** chart of accounts rather than a strict range-driven one (though ranges are common by convention).
*   **Code**: Unique identifier (e.g., `1000`, `200.10`). Supports alphanumeric and departmental suffixes.
*   **Type**: Defines the accounting behavior (Income, Asset, Expense, etc.).
*   **System Type**: Tags special accounts that have built-in automation logic (e.g., `BK` for Bank, `AR` for Receivables).

#### 2. System Accounts (The "Magic" Accounts)
Certain accounts are hard-wired into MoneyWorks' business logic. You generally cannot delete these, but you can rename them.
*   **Bank Accounts (`BK`)**: Enables cheque printing, reconciliation, and statement imports.
*   **Control Accounts (`AR`/`AP`)**: The single bucket for all money owed by Debtors or to Creditors. Transactions posting here must include a `NameCode`.
*   **GST Accounts (`GR`/`GP`)**: Automatically captures tax from transactions.
*   **Profit & Loss (`PL`)**: The destination for year-end retained earnings rollover.

#### 3. Departmental Accounting
Accounts can be segmented by department using a suffix (e.g., `4000-A`, `4000-B`).
*   The "base" account is `4000`.
*   The system treats `4000-A` as a distinct GL code but allows reporting rolled up by `4000` or by Department `A`.

---

## Canonical Schemas

### Account Fields

#### Identification & Classification
| Field | Type | Required | Description | Relationship |
|-------|------|----------|-------------|--------------|
| `Code` | Text | **Yes** | Unique GL Code. Max 7 chars (excl dept). | Primary Key |
| `Type` | Text | **Yes** | Account Type Code. | [See Account Types](#account-types) |
| `Description` | Text | **Yes** | Account Name. | - |
| `System` | Text | **Yes** | System Function Code (or spaces). | [See System Types](#system-types) |
| `Category` | Text | - | Reporting Category Code. | `General.Code` (Kind=C) |
| `Group` | Text | - | Department Group Code. | `General.Code` (Kind=G) |
| `AccountantsCode`| Text | - | Mapping code for external accountant. | - |
| `TaxCode` | Text | - | Default Tax Code for transactions. | `TaxRates.TaxCode` |
| `Currency` | Text | - | Currency Code (if multi-currency). | - |

#### Banking & Controls
| Field | Type | Description |
|-------|------|-------------|
| `BankAccountNumber` | Text | Actual bank account number (for `BK` accounts). |
| `LastStatementImport` | Date | Cut-off date of last bank feed. |
| `ManualChequeNumber` | Text | Next number for manual cheque books. |
| `PrintedChequeNumber` | Text | Next number for printer run. |
| `SecurityLevel` | Num | Access level required to view/use. |
| `EBITDA` | Text | Reporting Tag (I=Interest, T=Tax, D=Depreciation). |
| `Flags` | Num | Bit-mapped operational flags. |

#### System & Audit
| Field | Type | Description |
|-------|------|-------------|
| `Created` | Date | Creation timestamp. |
| `LastModifiedTime` | Text | Last edit timestamp. |
| `PandL` | Text | P&L Account reference (Self-ref). |
| `Colour` | Num | UI display colour index. |
| `Comments` | Text | Internal user notes. |
| `Category2`..`4` | Text | User-defined categories. |
| `UserNum` | Num | Scriptable storage. |
| `UserText` | Text | Scriptable storage. |
| `TaggedText` | Text | Scriptable tag storage. |

---

## Reference: Account Types

### Primary Types (`Account.Type`)
| Code | Canonical Name | Normal Balance | Statement Section |
|------|----------------|----------------|-------------------|
| **IN** | Income | Credit | P&L (Revenue) |
| **SA** | Sales | Credit | P&L (Revenue) |
| **CS** | Cost of Sales | Debit | P&L (COGS) |
| **EX** | Expense | Debit | P&L (Expenses) |
| **CA** | Current Asset | Debit | Balance Sheet |
| **FA** | Fixed Asset | Debit | Balance Sheet |
| **TA** | Term Asset | Debit | Balance Sheet |
| **CL** | Current Liability | Credit | Balance Sheet |
| **TL** | Term Liability | Credit | Balance Sheet |
| **SF** | Shareholder Funds | Credit | Balance Sheet (Equity) |

### System Types (`Account.System`)
| Code | Name | Special Behavior |
|------|------|------------------|
| **BK** | Bank | Enables Reconciliations and Cheque management. |
| **AR** | Accounts Receivable | Control account for Debtors. Locked for direct journals (usually). |
| **AP** | Accounts Payable | Control account for Creditors. Locked for direct journals (usually). |
| **GR** | GST Received | Auto-collects Tax from Sales. |
| **GP** | GST Paid | Auto-collects Tax from Purchases. |
| **PL** | Profit & Loss | Retained Earnings destination. |
| **"  "**| Ordinary | Standard account with no special logic. |

---

## Developer Tips

### 1. Job Code Requirement
If `Flags` has the `JOB_CODE_REQUIRED` bit set (0x0004), any transaction line using this account **must** include a valid `JobCode`. Attempting to save a transaction without one will throw an error.

### 2. Bank Reconciliation
Only accounts with `System="BK"` can be reconciled. The `LastStatementImport` field is critical for preventing duplicate bank feed imports.

### 3. Creating Control Accounts
You generally only need one AR and one AP account. Creating multiple (e.g., "Foreign AR" vs "Local AR") is possible but requires careful management of Name records to ensure they point to the correct `RecAccount`/`PayAccount`.
