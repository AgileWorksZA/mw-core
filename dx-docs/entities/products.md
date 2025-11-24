# MoneyWorks Entity Guide: Products

## Architectural Overview
The **Products** entity is a sophisticated multi-dimensional classification system that manages everything you buy, sell, or use. It is not just a simple "Item" list; it handles inventory tracking, complex pricing matrices, manufacturing recipes, and job costing resources.

### Critical Concepts

#### 1. The "Hash" Status (Operational State)
MoneyWorks uses a bitmask field called `Hash` to determine what you can *do* with a product. It is not enough to just create a product; you must set its capabilities.
*   **Can Buy (0x0002)**: Appears in Purchase Orders and Creditor Invoices. Requires `COGAcct`.
*   **Can Sell (0x0004)**: Appears in Sales Orders and Debtor Invoices. Requires `SalesAcct`.
*   **Inventory (0x0008)**: Stock levels are tracked. Requires `StockAcct` (Asset).

> **Constraint**: If `Inventory` is set, the product generally must also be `Buy` or `Sell`.

#### 2. Unit Conversion Architecture
MoneyWorks natively handles different units for buying and selling (e.g., buying beer by the "Keg", selling by the "Pint").
*   **Base Unit**: The `SellUnit`. All stock levels (`StockOnHand`) are stored in this unit.
*   **Buy Unit**: The unit you purchase in.
*   **Conversion Factor**: The scalar to convert Buy Units to Sell Units.
    *   *Formula*: `Stock Qty = Purchase Qty / ConversionFactor` (Note: Manual says "divided by", but practically it's often `Buy Qty * Factor` in other systems. In MoneyWorks, if you buy 1 Case of 12, and sell 12 Each, `ConversionFactor` is usually `0.08333` (1/12) if the logic is `Buy / Factor = Sell`, OR `12` if `Buy * Factor = Sell`. *Verification needed: The ontology says "quantity purchased is divided by this conversion factor". So for 1 Case -> 12 Each, Factor = 1/12 = 0.083333.*)

#### 3. The Pricing Matrix
MoneyWorks supports a 2-dimensional pricing strategy per product:
*   **Dimension 1: Price Levels (A-F)**. You can assign different customers to different price levels (e.g., Retail=A, Wholesale=B).
*   **Dimension 2: Quantity Breaks**. You can define up to 4 quantity thresholds (e.g., 1+, 10+, 50+, 100+) which trigger different prices for Levels A and B.

---

## Canonical Schemas

### Product Fields

#### Identification & Classification
| Field | Type | Max | Required | Description | Relationship |
|-------|------|-----|----------|-------------|--------------|
| `Code` | Text | 31 | **Yes** | Unique Product Code. | Primary Key |
| `Type` | Text | 1 | **Yes** | P=Product, S=Service, R=Resource. | [See Types](#product-types) |
| `Description` | Text | 255 | **Yes** | Product Name/Description. | - |
| `BarCode` | Text | 19 | - | GTIN/EAN/UPC Barcode. | - |
| `Hash` | Num | - | **Yes** | Bitmask for Buy/Sell/Stock status. | - |
| `Category1`..`4`| Text | 15 | - | User-defined reporting categories. | - |
| `Colour` | Num | - | - | UI display colour index. | - |
| `Flags` | Num | - | - | Bit-mapped operational flags. | - |

#### Financial Accounts (The "GL Map")
| Field | Type | Max | Description | Relationship |
|-------|------|-----|-------------|--------------|
| `SalesAcct` | Text | 13 | **Income** account (Credit on Sale). | `Accounts.Code` |
| `COGAcct` | Text | 13 | **Expense/COGS** account (Debit on Buy/Sell). | `Accounts.Code` |
| `StockAcct` | Text | 13 | **Asset** account (Debit on Buy, Credit on Sell). | `Accounts.Code` |
| `TaxCode` | Text | 3 | Default Tax Code (e.g. "G"). | `TaxRates.TaxCode` |

#### Pricing & Costs
| Field | Type | Description |
|-------|------|-------------|
| `BuyPrice` | Num | Last purchase price (in `BuyPriceCurrency`). |
| `BuyPriceCurrency`| Text | Currency of last purchase. |
| `CostPrice` | Num | Standard Cost (Base Currency). Basis for margin. |
| `SellPrice` | Num | **Price Level A** (Base Price). |
| `SellPriceB`..`F` | Num | Price Levels B through F. |
| `SellDiscount` | Num | Standard discount %. |
| `SellDiscountMode`| Num | 1=None, 2=Customer, 3=Product, 4=Add. |

#### Inventory & Units
| Field | Type | Description |
|-------|------|-------------|
| `StockOnHand` | Num | Current Quantity (in `SellUnit`). |
| `StockValue` | Num | Total Value of SOH (Cost Basis). |
| `SellUnit` | Text | Unit name (e.g., "ea"). |
| `BuyUnit` | Text | Unit name (e.g., "box"). |
| `ConversionFactor`| Num | Conversion ratio (Buy -> Sell). |
| `ReorderLevel` | Num | Minimum stock threshold. |
| `LeadTimeDays` | Num | Expected delivery delay. |
| `Supplier` | Text | Preferred Supplier Code. |
| `SuppliersCode` | Text | SKU used by Supplier. |

#### Manufacturing & Build
| Field | Type | Description |
|-------|------|-------------|
| `MinBuildQty` | Num | Minimum batch size for manufacturing. |
| `NormalBuildQty` | Num | Standard production run size. |

---

## Reference: Product Types (`Type`)

| Code | Canonical Name | Business Context |
|------|----------------|------------------|
| **P** | **Product** | Physical goods. Usually inventoried (`Hash` includes 8). |
| **S** | **Service** | Non-tangible. Time, consulting, fees. Never inventoried. |
| **R** | **Resource** | Internal resources (Labour, Machine Time) for Job Costing. |
| **T** | **Time** | Time-billing items (similar to Service but specific to timesheets). |
| **F** | **Freight** | Shipping/Delivery charges. |

## Developer Tips

### 1. The "Hash" is Mandatory
If you create a product via API without setting the `Hash`, it will be "dead" - it won't appear in any transaction entry screens.
*   **Standard Resale Item**: `Hash = 14` (2 Buy + 4 Sell + 8 Stock).
*   **Service Item**: `Hash = 4` (Sell only).
*   **Consumable/Expense**: `Hash = 2` (Buy only).

### 2. Inventory Journals
You cannot write directly to `StockOnHand`. You must create a transaction to move stock:
*   **Purchase (`PI`)**: Increases Stock.
*   **Sale (`SI`)**: Decreases Stock.
*   **Stock Journal (`JNS`)**: Adjusts Stock (Stocktake, Write-off, Assembly).

### 3. Barcode Lookups
MoneyWorks natively indexes the `BarCode` field. In the user interface and many API lookups, entering a barcode in the `ProductCode` field will resolve correctly.
