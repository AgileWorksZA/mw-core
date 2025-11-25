# MoneyWorks Entity Guide: OffLedger (Currencies & KPIs)

## Architectural Overview
The **OffLedger** entity is a special table used to store data that varies over time but isn't part of the financial transaction ledger. Its primary use is **Multi-Currency Rates**, but it also stores **User-Defined Off-Ledger** values (like "Headcount" or "Rainfall") for reporting.

### Critical Concepts

#### 1. Currencies (`Kind='CUR'`)
Every currency defined in MoneyWorks is a record in this table.
*   **Rates History**: Unlike the simple `ExchangeRate()` function which returns the *current* rate, this table stores historical rates.
*   **Budgeting**: You can budget for exchange rate fluctuations here.
*   **Linked Accounts**: Stores the GL accounts for Realised/Unrealised Gains.

#### 2. User Off-Ledger (`Kind='USR'`)
You can create your own time-series data streams.
*   **Example**: Store "Monthly Sales Calls" or "Kg Waste Recycled".
*   **Reporting**: These values can be pulled into reports to calculate KPIs (e.g., `Sales / Headcount`).

---

## Canonical Schemas

### OffLedger Fields

| Field | Type | Description |
|-------|------|-------------|
| `Name` | Text | Currency Code (e.g. "USD") or OffLedger Code. |
| `Kind` | Text | `CUR` (Currency) or `USR` (User). |
| `Description` | Text | Human readable name. |
| `Balance00`..`90`| Num | Historical values (Period 00 = Current). |
| `Budget00`..`29` | Num | Historical budgets. |
| `LinkedAccountU`| Text | Unrealised Gains Account (Currencies only). |
| `LinkedAccountR`| Text | Realised Gains Account (Currencies only). |

---

## Developer Tips

### 1. Reading Exchange Rates
While `ExchangeRate("USD", date)` is the standard way to get a rate, querying the `OffLedger` table allows you to extract the entire curve of historical rates for analysis.

### 2. Using Off-Ledger for KPIs
If you are building a dashboard integration, consider pushing non-financial metrics (like "Website Visits") into a `USR` OffLedger record via the REST API. This allows the MoneyWorks Report Writer to combine financial and non-financial data in a single report.
