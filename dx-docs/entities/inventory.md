# MoneyWorks Entity Guide: Inventory (Stock Locations & Batches)

## Architectural Overview
The **Inventory** entity is a subfile of the **Product** table. While the `Products` table stores the *total* stock on hand, the `Inventory` table stores the breakdown of that stock by:
1.  **Location** (Warehouse, Store).
2.  **Identifier** (Serial Number or Batch/Lot Number).

### Critical Concepts

#### 1. The Subfile Relationship
*   **Parent**: `Products` (Master Record).
*   **Child**: `Inventory` (Detail Record).
*   *Link*: `Inventory.ProductSeq` -> `Products.SequenceNumber`.

#### 2. Tracking Modes
The behavior of this table depends on the Product's settings:
*   **Location Only**: Records distinguish stock by `Location`. `Identifier` is usually blank/default.
*   **Serial Tracking**: `Identifier` holds the unique Serial Number. `Qty` is always 1.
*   **Batch Tracking**: `Identifier` holds the Batch/Lot Number. `Qty` can be > 1. `Expiry` date is used.

#### 3. Stock Movements
You generally **do not** write to this table directly to move stock. You use **Stock Journals (`JNS`)** or **Transactions (Invoices/Receipts)**. MoneyWorks automatically updates the Inventory subfile records based on the transaction details.

---

## Canonical Schemas

### Inventory Fields

| Field | Type | Max | Description | Relationship |
|-------|------|-----|-------------|--------------|
| `ProductSeq` | Num | - | **Foreign Key** to Product. | `Products.SequenceNumber` |
| `Location` | Text | 15 | Warehouse/Store Code. | - |
| `Identifier` | Text | 31 | Serial or Batch Number. | - |
| `Qty` | Num | - | Stock on Hand for this specific batch/loc. | - |
| `Expiry` | Date | - | Expiry date (for Batches). | - |
| `StockTakeStartQty`| Num | - | Snapshot at start of stocktake. | - |
| `StockTakeNewQty` | Num | - | Counted quantity during stocktake. | - |

---

## Developer Tips

### 1. Querying Stock for a Location
Do not rely on `Products.StockOnHand` if you need location-specific data.
*   *Script*: `SOHForLocation("WAREHOUSE")` (Built-in function).
*   *Query*: Select from Inventory where `ProductSeq = [ID]` and `Location = 'WAREHOUSE'`.

### 2. Handling Serial Numbers
When processing a transaction for a serialized item, you must specify the serial numbers. In the API/Import, this is often done by appending the serial number to the product code or using specific sub-fields depending on the interface version.

### 3. The "Default" Location
If no location is specified, MoneyWorks uses an empty string `""` as the location code. Ensure your code handles empty strings correctly as a valid location identifier.
