# MoneyWorks Entity Guide: Build Records (Bill of Materials)

## Architectural Overview
The **Build** entity defines the "Recipe" or "Bill of Materials" (BOM) for manufactured items. It creates a link between a parent product (the item being made) and its components (the raw materials).

### Critical Concepts

#### 1. The Subfile Relationship
*   **Parent**: `Products` (The item *being built*).
*   **Child**: `Build` (The component *required*).
*   *Link*: `Build.ProductSeq` -> `Products.SequenceNumber`.

#### 2. Auto-Build Logic
If a Product has the `Auto-Build` flag set, MoneyWorks uses these records to automatically:
1.  Reduce stock of the components (`PartCode`).
2.  Increase stock of the parent (`ProductSeq`).
This happens when the parent product is sold (Auto-Assembly) or built via a Stock Journal.

---

## Canonical Schemas

### Build Fields

| Field | Type | Max | Required | Description | Relationship |
|-------|------|-----|----------|-------------|--------------|
| `ProductSeq` | Num | - | **Yes** | The Parent Product (Finished Good). | `Products.SequenceNumber` |
| `PartCode` | Text | 19 | **Yes** | The Component Product (Raw Material). | `Products.Code` |
| `Qty` | Num | - | **Yes** | Quantity required per 1 unit of Parent. | - |
| `Memo` | Text | 255 | - | Instructions/Notes for this component. | - |

---

## Developer Tips

### 1. Recursive Builds
MoneyWorks supports multi-level BOMs (Sub-assemblies). A component (`PartCode`) can itself be a manufactured item with its own Build records.
*   *Warning*: When writing scripts to traverse this tree, ensure you check for circular references (A builds B, B builds A) to avoid infinite loops.

### 2. Fractional Quantities
`Qty` supports decimals. This is common for liquid ingredients (e.g., 0.05 Liters) or allocation of overheads.

### 3. Importing BOMs
You can import Build records. The format typically requires mapping the Parent Product Code (which MoneyWorks resolves to `ProductSeq`) and the Component Code (`PartCode`).
