# MoneyWorks Entity Guide: Assets

## Architectural Overview
The **Assets** entity is a complete Fixed Asset Register. It manages the lifecycle of long-term assets (computers, vehicles, machinery) from acquisition to disposal, including depreciation calculations.

### Critical Concepts

#### 1. The Asset Lifecycle
Assets have a strict status workflow:
*   **`NEW`**: Recently added. Not yet depreciating.
*   **`ACT` (Active)**: In service. Depreciation runs automatically.
*   **`NDP` (Non-Depreciable)**: Land, Art. Value remains constant.
*   **`DSP` (Disposed)**: Sold or written off.

#### 2. Depreciation Methods
MoneyWorks supports standard accounting depreciation:
*   **Straight Line (`SL`)**: Depreciates a fixed amount every year (`Cost / Expected Life`).
*   **Diminishing Value (`DV`)**: Depreciates a percentage of the *current* book value (`Book Value * Rate`).

#### 3. Ledger Integration
Assets are linked to the General Ledger via **Asset Categories**. You don't define GL accounts on the Asset itself; you define them on the Category (e.g., "Office Equipment").
*   **Cost Account**: Where the asset value sits (Balance Sheet).
*   **Depn Expense**: Where the monthly cost goes (P&L).
*   **Accum Depn**: Contra-asset account (Balance Sheet).

---

## Canonical Schemas

### Asset Fields

#### Identification
| Field | Type | Max | Required | Description | Relationship |
|-------|------|-----|----------|-------------|--------------|
| `Code` | Text | 19 | **Yes** | Unique Asset ID. | Primary Key |
| `Description` | Text | 63 | **Yes** | Asset Name. | - |
| `Category` | Text | 7 | **Yes** | Asset Category (GL Links). | `AssetCategories.Code` |
| `SerialNum` | Text | 31 | - | Serial Number. | - |
| `Location` | Text | 15 | - | Physical Location. | - |
| `Dept` | Text | 5 | - | Cost Center. | `Departments.Code` |

#### Financials
| Field | Type | Description |
|-------|------|-------------|
| `Cost` | Num | Original purchase cost. |
| `BookValue` | Num | Current accounting value (`Cost - AccumDep`). |
| `AccumDepreciation`| Num | Total depreciation to date. |
| `ExpectedLife` | Num | Useful life (Years). |
| `ExpectedResidualValue`| Num | Value at end of life. |
| `Status` | Text | `NEW`, `ACT`, `NDP`, `DSP`. |
| `Type` | Text | `SL` (Straight Line) or `DV` (Diminishing). |
| `Rate` | Num | Depreciation rate (for DV). |

#### Audit Trail
| Field | Type | Description | Relationship |
|-------|------|-------------|--------------|
| `AcquisitionDate` | Date | Date bought. | - |
| `AcquisitionSeq` | Num | Purchase Transaction. | `Transaction.SequenceNumber` |
| `DisposalDate` | Date | Date sold/scrapped. | - |
| `DisposalSeq` | Num | Sale Transaction. | `Transaction.SequenceNumber` |
| `LastDepreciatedDate`| Date | Date of last run. | - |

---

## Developer Tips

### 1. Automating Depreciation
You cannot "write" to the `AccumDepreciation` field directly to depreciate an asset. You must run the **Depreciation** command in MoneyWorks (or via automation), which creates a General Journal (`JN`) and updates the asset records.

### 2. Disposing of Assets
To dispose of an asset, you typically create a Sales Invoice (if sold) or a Journal (if written off) and link it to the Asset. This triggers the `DisposalSeq` link and updates the status to `DSP`.

### 3. Private Use
The `PrivateUsePercent` field allows for split-use assets (e.g., a car used 30% personally). MoneyWorks handles the complex tax adjustments for this automatically during depreciation.
