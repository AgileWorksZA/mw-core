# Assets (Fixed Asset Register)

## Overview
The Asset Register tracks fixed assets through their lifecycle: acquisition, revaluation, depreciation, and disposal. Has its own navigator view with workflow diagram.

## Access Points
- Navigator: Assets (dedicated navigator view)

## Navigator Layout
Visual workflow showing interconnected entities:

### Entity Icons (Clickable)
| Entity | Description |
|--------|-------------|
| **Assets** | Central entity — the asset register list (+ button to add) |
| **Asset Categories** | Depreciation rule categories (+ button to add) |
| **Revalue** | Revalue asset up or down |
| **Depreciation** | Calculate and post depreciation |
| **Dispose** | Record asset disposal |

### Workflow Flow
- Assets ↔ Asset Categories (categories define depreciation rules)
- Asset Categories → Depreciation (categories drive depreciation calculation)
- Assets ↑ Revalue (revalue assets upward)
- Assets ↓ Dispose (record disposal)

### Reports Section
| Report | Description |
|--------|-------------|
| Asset Register | Full register listing |
| Asset Report | Detailed asset report |

## Asset Record Fields (Expected)
| Field | Type | Description |
|-------|------|-------------|
| Asset Code | Text | Unique identifier |
| Description | Text | Asset description |
| Category | Dropdown | Links to Asset Category (determines depreciation rules) |
| Acquisition Date | Date | Date purchased |
| Cost | Currency | Original cost |
| Accumulated Depreciation | Currency (display) | Total depreciation to date |
| Book Value | Currency (display) | Cost - Accumulated Depreciation |
| Disposal Date | Date | Date disposed (if applicable) |
| Disposal Amount | Currency | Sale/disposal proceeds |

## Asset Categories
Define depreciation rules:
| Field | Type | Description |
|-------|------|-------------|
| Category Name | Text | Category identifier |
| Depreciation Method | Dropdown | Straight Line, Diminishing Value, etc. |
| Rate | Percentage | Annual depreciation rate |
| Useful Life | Number | Expected life in years |
| Asset Account | Account lookup | GL account for asset (e.g., Fixed Asset) |
| Depreciation Account | Account lookup | GL expense account for depreciation |
| Accumulated Depreciation Account | Account lookup | GL contra account |

## Key Workflows

### Acquire Asset
1. Navigate to Assets → click + (New)
2. Fill in details, assign category
3. Save — posts to Asset Account in GL

### Run Depreciation
1. Click Depreciation icon
2. Select period to depreciate
3. System calculates based on categories
4. Posts journal: Debit Depreciation Expense, Credit Accumulated Depreciation

### Revalue Asset
1. Click Revalue icon
2. Select asset, enter new value
3. Posts revaluation journal

### Dispose Asset
1. Click Dispose icon
2. Enter disposal date and sale proceeds
3. System calculates gain/loss
4. Posts disposal journal (removes from register)

## Business Rules
- Asset Categories streamline setup for similar assets
- Depreciation auto-calculates based on method, rate, and acquisition date
- Book Value = Cost - Accumulated Depreciation
- Disposal Gain/Loss = Sale Proceeds - Book Value at disposal date
- Import via File → Import → Assets/Asset Categories
