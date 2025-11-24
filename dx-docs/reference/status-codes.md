# Status Codes Reference

MoneyWorks uses compact codes to represent the lifecycle state of entities.

## Transaction Status (`Transaction.Status`)

| Code | State | Description | Implication |
|------|-------|-------------|-------------|
| **U** | **Unposted** | Draft / Work in Progress. | No impact on GL. Editable. Deletable. |
| **P** | **Posted** | Committed / Finalized. | Updates GL, Stock, and Balances. Immutable. |

## Name Types (`CustomerType` / `SupplierType`)

| Code | Meaning | Context |
|------|---------|---------|
| **0** | **None** | Not involved in this role. |
| **1** | **Cash Only** | "Customer" or "Supplier". Cash transactions only. No credit account. |
| **2** | **Account** | "Debtor" or "Creditor". Full account facilities (Aging, Terms, Credit Limit). |

## Product Types (`Products.Type`)

| Code | Name | Description |
|------|------|-------------|
| **P** | Product | Physical inventory item (Stock tracked). |
| **S** | Service | Service or non-stock item (Hours, Fees). |
| **R** | Resource | Resource for job costing (Labour, Machine time). |
| **F** | Freight | Freight/Shipping charge item. |
