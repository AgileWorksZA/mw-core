# MoneyWorks Entity Guide: Ledger

## Architectural Overview
The **Ledger** entity is the "physical" storage of account balances, distinct from the **Account** entity which defines the "logical" Chart of Accounts.

### Critical Concepts

#### 1. The Account vs. Ledger Relationship
*   **Account**: Defines the rules (Code, Description, Type, Tax Code). Represents the "Header".
*   **Ledger**: Stores the actual numbers. Represents the "Expansion".
*   **Relationship**: **One-to-Many**.
    *   One `Account` (e.g., `4000`) can have multiple `Ledger` records if departments are used (e.g., `4000-A`, `4000-B`).

#### 2. Departmental Expansion
If you use departments, MoneyWorks creates a specific `Ledger` record for every valid `Account` + `Department` combination.
*   **Posting**: When you post a transaction to `4000-A`, it updates the `Ledger` record for `4000-A`.
*   **Reporting**: Reports can run on `Accounts` (rolling up all depts) or `Ledgers` (specific dept breakdown).

#### 3. Currency Deltas
For multi-currency accounts, the `Ledger` table also manages the "Delta" records (hidden records that track exchange rate variances).
*   *Concept*: `Base Value = Foreign Value * Rate + Delta`.

---

## Canonical Schemas

### Ledger Fields

| Field | Type | Description | Relationship |
|-------|------|-------------|--------------|
| `AccountCode` | Text | Parent Account Code. | `Accounts.Code` |
| `Department` | Text | Department Code (or blank). | `Departments.Code` |
| `Concat` | Text | Full Code (e.g., "4000-A"). | - |
| `Balance` | Num | **Current** Balance. | - |
| `Type` | Text | Account Type (Inherited). | `Accounts.Type` |
| `Category` | Text | Category (Inherited). | - |
| `Classification`| Text | Dept Classification (Inherited).| - |

---

## Developer Tips

### 1. When to use Ledger vs Account
*   **Use `Account`**: When you need to list the Chart of Accounts, check settings (Tax Code, Bank Number), or validate codes.
*   **Use `Ledger`**: When you need **Balances by Department**.
    *   *Query*: `AccountCode="4000"` on the Ledger table will return multiple records (one per dept), each with its own `Balance`.

### 2. Calculating Period Movements
The `Ledger` table record exposes the *Current* balance. To get historical movements (e.g., "Net change in Jan 2023"), you typically use the `GetMovement` or `GetBalance` functions in MWScript, passing the specific `Code` (or `Concat` value).

### 3. Hidden Records
The Ledger table contains "Delta" records (suffixed `~~DEL`). These are usually filtered out by default in UI lists but might appear in raw API exports.
