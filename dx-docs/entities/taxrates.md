# MoneyWorks Entity Guide: TaxRates

## Architectural Overview
The **TaxRates** entity defines the GST/VAT compliance rules. Unlike simpler accounting systems that just use a percentage, MoneyWorks treats Tax as a robust entity with historical rate tracking, dual-tier taxes (e.g., Canadian GST+PST), and strict General Ledger integration.

### Critical Concepts

#### 1. The "Tax Code" Key
Every transaction line references a `TaxCode` (e.g., `G`, `Z`, `E`). This code resolves to a TaxRate record which dictates:
*   **Rate**: The percentage to charge.
*   **Ledger Impact**: Which GL accounts collect the tax.
*   **History**: What the rate *was* on a given date.

#### 2. Historical Rate Management (The Date Switch)
MoneyWorks handles tax rate changes (e.g., GST moving from 12.5% to 15%) without creating new codes.
*   **Rate1**: The "Old" Rate.
*   **Rate2**: The "New" Rate.
*   **Changeover Date**: The exact date the system switches from Rate1 to Rate2 based on the *Transaction Date*.

#### 3. The Ledger Interface
MoneyWorks maintains a "hard" link between Tax and GL. You cannot post tax without defined control accounts.
*   **GST Paid (`PaidAccount`)**: Asset account. Accumulates tax paid on purchases (Recoverable).
*   **GST Received (`RecAccount`)**: Liability account. Accumulates tax collected on sales (Payable).

---

## Canonical Schemas

### TaxRate Fields

#### Core Definitions
| Field | Type | Max | Required | Description | Relationship |
|-------|------|-----|----------|-------------|--------------|
| `TaxCode` | Text | 5 | **Yes** | Unique Tax Identifier (e.g. "GST"). | Primary Key |
| `Description`| Text | 255 | - | (Implicit/Derived in UI, not in core table). | - |
| `Rate1` | Num | - | **Yes** | Primary Rate (Pre-Changeover). | - |
| `Rate2` | Num | - | **Yes** | Primary Rate (Post-Changeover). | - |
| `Date` | Date | - | **Yes** | Changeover Date. | - |

#### Ledger Mapping
| Field | Type | Max | Description | Relationship |
|-------|------|-----|-------------|--------------|
| `PaidAccount` | Text | 7 | GL for Tax Paid (Purchases). | `Accounts.Code` |
| `RecAccount` | Text | 7 | GL for Tax Collected (Sales). | `Accounts.Code` |

#### Dual-Tier Taxes (e.g. PST/State Tax)
| Field | Type | Description |
|-------|------|-------------|
| `Combine` | Num | Mode: 0=None, 1=Add, 2=Compound, 3=Separate. |
| `CombineRate1`| Num | Secondary Rate (Pre-Changeover). |
| `CombineRate2`| Num | Secondary Rate (Post-Changeover). |

#### Compliance Totals (Auto-Updated)
| Field | Type | Description |
|-------|------|-------------|
| `GSTPaid` | Num | Total Paid in last cycle. |
| `GSTReceived` | Num | Total Collected in last cycle. |
| `NetPaid` | Num | Net Payment in last cycle. |
| `NetReceived` | Num | Net Refund in last cycle. |

---

## Reference: Combination Modes (`Combine`)

Used for regions with two tax layers (e.g., Quebec GST+QST).

| Code | Mode | Calculation Logic |
|------|------|-------------------|
| **0** | **None** | Single tier only. |
| **1** | **Additive** | `Tax = Amount * (Rate + CombineRate)` |
| **2** | **Compound** | `Tax = (Amount * Rate) + ((Amount + Tax1) * CombineRate)` |
| **3** | **Separate** | `Tax = (Amount * Rate) + (Amount * CombineRate)` ( tracked separately). |

## Developer Tips

### 1. Tax Inclusive vs Exclusive
The TaxRate entity defines the *percentage*, but the *Transaction* defines if a price is Inclusive or Exclusive.
*   *Inclusive*: `Gross` is fixed. `Net = Gross / (1 + Rate)`.
*   *Exclusive*: `Net` is fixed. `Gross = Net * (1 + Rate)`.

### 2. Zero Rated vs Exempt
*   **Zero Rated (`0%`)**: Tax is calculated at 0%. It *is* reported on the tax return (e.g., Exports).
*   **Exempt**: No tax logic applies. Often handled by a special "Exempt" tax code pointing to null accounts or handled via transaction logic.

### 3. Creating a New Tax Rate
When creating a new tax code via API, you **must** ensure `PaidAccount` and `RecAccount` exist in the Chart of Accounts first. The API will reject the creation if the GL codes are invalid.
