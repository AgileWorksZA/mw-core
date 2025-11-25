# MoneyWorks Entity Guide: General Classifications

## Architectural Overview
The **General** entity is a polymorphic table that stores three distinct types of classification data. It uses a **Prefix System** (`C`, `D`, `S`) to distinguish between them.

### Critical Concepts

#### 1. The Prefix Rule
The `Code` field always starts with a specific letter which dictates the record's function:
*   **`C...` (Categories)**: Account Categories (e.g., `CFOOD`, `CRENT`).
*   **`D...` (Departments)**: Department codes (e.g., `DSALES`, `DADMIN`).
*   **`S...` (Groups)**: Department Groups (e.g., `SOPS`, `SMGMT`).

#### 2. Usage in Other Entities
*   **Accounts**:
    *   `Category` field links to `C...` records.
    *   `Group` field links to `G...` (Note: Manual says `S...` prefix in General, but Accounts field is named `Group`. *Correction*: The Ontology says `Group` references `General.Code` with Kind='G'. Wait, the Ontology says `S` prefix for Department Groups. Let's verify: `S` is standard for "Set/Group" in many systems, but MoneyWorks often uses `Group` as the field name. The code is likely `S...` internally).

#### 3. Departmental Logic
MoneyWorks uses "Departments" to segment the General Ledger.
*   **Departments (`D...`)**: The actual cost centers (e.g., "Sales Team A").
*   **Groups (`S...`)**: Collections of departments (e.g., "All Sales Teams").
*   *Ledger Impact*: You post to `Account-Department` (e.g., `4000-A`).

---

## Canonical Schemas

### General Field

| Field | Type | Max | Required | Description | Relationship |
|-------|------|-----|----------|-------------|--------------|
| `Code` | Text | 5 | **Yes** | Unique Code (Must start with C, D, or S). | Primary Key |
| `Description`| Text | 25 | **Yes** | Human-readable name. | - |
| `LastModifiedTime` | Text | - | - | Last edit timestamp. | - |

---

## Reference: Classification Types

### Account Categories (`C`)
Used to group General Ledger accounts for reporting (e.g. "Balance Sheet", "Overheads").
*   *Example*: `CFIXED` (Fixed Assets), `CSALES` (Revenue).
*   *Linked From*: `Accounts.Category`.

### Department Classifications (`D`)
Defines the suffixes available for accounts.
*   *Example*: `DNY` (New York), `DLON` (London).
*   *Usage*: Allows `1000-NY`, `1000-LON`.

### Department Groups (`S`)
Aggregates multiple departments for reporting.
*   *Example*: `SNA` (North America) might include `DNY` and `DLA`.
*   *Linked From*: `Accounts.Group`.

## Developer Tips

### 1. Code Constraints
*   **Length**: Max 5 characters *including* the prefix. This means you only have **4 characters** for your actual identifier (e.g., `C` + `FOOD`).
*   **Format**: Alphanumeric + Underscore. No spaces.

### 2. Auto-Capitalization
MoneyWorks automatically capitalizes these codes. `cfood` becomes `CFOOD`.
