# Transaction Types Reference

MoneyWorks uses a specific set of codes to define the behavior and accounting implications of a transaction.

## Core Types

| Code | Canonical Name | Description | Journal Impact |
|------|----------------|-------------|----------------|
| **CII** | Creditor Invoice | A standard bill from a supplier (Payable). | Cr Creditor Control / Dr Expense |
| **DII** | Debtor Invoice | A standard invoice to a customer (Receivable). | Dr Debtor Control / Cr Sales |
| **CP** | Cash Payment | Immediate payment for expenses. | Cr Bank / Dr Expense |
| **CR** | Cash Receipt | Immediate income. | Dr Bank / Cr Sales |
| **JN** | General Journal | Manual GL adjustments. | Defined by user lines |

## Variant Types

| Code | Canonical Name | Usage |
|------|----------------|-------|
| **CIC** | Creditor Invoice (Complete) | Records a historical invoice that was already paid. |
| **DIC** | Debtor Invoice (Complete) | Records a historical invoice that was already paid. |
| **CPC** | Cash Payment (Creditor) | A payment specifically allocated to pay off a `CII`. |
| **CRC** | Cash Receipt (Creditor) | A refund received from a supplier. |
| **CRD** | Cash Receipt (Debtor) | A payment received from a customer for a `DII`. |
| **CPD** | Cash Payment (Debtor) | A refund paid back to a customer. |

## Order Types (Non-Financial)
These types do not impact the General Ledger until they are "Processed" into Invoices.

| Code | Canonical Name | Description |
|------|----------------|-------------|
| **PO** / **POI** | Purchase Order | Order placed with supplier. |
| **SO** / **SOI** | Sales Order | Order received from customer. |
| **QU** | Quote | Price quotation (can be converted to SO/Invoice). |

## Inventory Types

| Code | Canonical Name | Usage |
|------|----------------|-------|
| **JNS** | Stock Journal | Used for stocktakes, write-offs, and assembly builds. |
