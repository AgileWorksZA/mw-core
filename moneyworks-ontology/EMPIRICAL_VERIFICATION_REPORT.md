# MoneyWorks Empirical Schema Verification Report

**Generated:** 2025-11-25T22:56:45.930Z
**Task:** TASK-010 - API Schema Validation

## Executive Summary

- **Perfect Matches:** 4/31 (12.9%)
- **Entities with Discrepancies:** 27

## Detailed Results

### Account

- **Empirical Field Count:** 36
- **Ontology Field Count:** 35
- **Match:** ❌ No

**Missing in Ontology (1):**
- `Slot`

**Notes:**
- ⚠️  Field count mismatch: +1
- ❌ 1 fields missing in ontology

---

### Ledger

- **Empirical Field Count:** 201
- **Ontology Field Count:** 201
- **Match:** ✅ Yes

**Notes:**
- ✅ Perfect match

---

### General

- **Empirical Field Count:** 7
- **Ontology Field Count:** 0
- **Match:** ❌ No

**Missing in Ontology (7):**
- `Slot`
- `SequenceNumber`
- `LastModifiedTime`
- `Code`
- `Description`
- `Date`
- `Long`

**Notes:**
- ⚠️  Field count mismatch: +7
- ❌ 7 fields missing in ontology

---

### Department

- **Empirical Field Count:** 12
- **Ontology Field Count:** 11
- **Match:** ❌ No

**Missing in Ontology (1):**
- `Slot`

**Notes:**
- ⚠️  Field count mismatch: +1
- ❌ 1 fields missing in ontology

---

### Link

- **Empirical Field Count:** 5
- **Ontology Field Count:** 0
- **Match:** ❌ No

**Notes:**
- ❌ No ontology file mapped for this entity

---

### Transaction

- **Empirical Field Count:** 73
- **Ontology Field Count:** 72
- **Match:** ❌ No

**Missing in Ontology (1):**
- `Slot`

**Notes:**
- ⚠️  Field count mismatch: +1
- ❌ 1 fields missing in ontology

---

### Detail

- **Empirical Field Count:** 44
- **Ontology Field Count:** 44
- **Match:** ❌ No

**Missing in Ontology (43):**
- `Detail.SequenceNumber`
- `Detail.LastModifiedTime`
- `Detail.ParentSeq`
- `Detail.Sort`
- `Detail.Account`
- `Detail.Dept`
- `Detail.PostedQty`
- `Detail.TaxCode`
- `Detail.Gross`
- `Detail.Tax`
- `Detail.Debit`
- `Detail.Credit`
- `Detail.Description`
- `Detail.StockQty`
- `Detail.StockCode`
- `Detail.CostPrice`
- `Detail.UnitPrice`
- `Detail.Statement`
- `Detail.JobCode`
- `Detail.SaleUnit`
- `Detail.Discount`
- `Detail.Flags`
- `Detail.OrderQty`
- `Detail.BackorderQty`
- `Detail.PrevShipQty`
- `Detail.BaseCurrencyNet`
- `Detail.SerialNumber`
- `Detail.Period`
- `Detail.TransactionType`
- `Detail.SecurityLevel`
- `Detail.RevalueQty`
- `Detail.StockLocation`
- `Detail.OrderStatus`
- `Detail.ExpensedTax`
- `Detail.Date`
- `Detail.MoreFlags`
- `Detail.UserNum`
- `Detail.UserText`
- `Detail.TaggedText`
- `Detail.NonInvRcvdNotInvoicedQty`
- `Detail.Custom1`
- `Detail.Custom2`
- `Detail.OriginalUnitCost`

**In Ontology but Not in Empirical (43):**
- `SequenceNumber`
- `LastModifiedTime`
- `ParentSeq`
- `Sort`
- `Account`
- `Dept`
- `Debit`
- `Credit`
- `Description`
- `TaxCode`
- `Gross`
- `Tax`
- `ExpensedTax`
- `StockCode`
- `StockQty`
- `PostedQty`
- `SaleUnit`
- `CostPrice`
- `UnitPrice`
- `Discount`
- `SerialNumber`
- `StockLocation`
- `RevalueQty`
- `OriginalUnitCost`
- `OrderQty`
- `BackorderQty`
- `PrevShipQty`
- `OrderStatus`
- `NonInvRcvdNotInvoicedQty`
- `JobCode`
- `Statement`
- `Period`
- `Date`
- `TransactionType`
- `BaseCurrencyNet`
- `SecurityLevel`
- `Flags`
- `MoreFlags`
- `UserNum`
- `UserText`
- `TaggedText`
- `Custom1`
- `Custom2`

**Notes:**
- ❌ 43 fields missing in ontology
- ⚠️  43 ontology fields not in empirical data

---

### Log

- **Empirical Field Count:** 8
- **Ontology Field Count:** 0
- **Match:** ❌ No

**Notes:**
- ❌ No ontology file mapped for this entity

---

### TaxRate

- **Empirical Field Count:** 31
- **Ontology Field Count:** 31
- **Match:** ✅ Yes

**Notes:**
- ✅ Perfect match

---

### Message

- **Empirical Field Count:** 28
- **Ontology Field Count:** 0
- **Match:** ❌ No

**Notes:**
- ❌ No ontology file mapped for this entity

---

### Name

- **Empirical Field Count:** 103
- **Ontology Field Count:** 107
- **Match:** ❌ No

**In Ontology but Not in Empirical (4):**
- `SalesPerson`
- `EInvoiceID`
- `CustPropmtPaymentDiscount`
- `SupplierPromptPaymentTerms`

**Notes:**
- ⚠️  Field count mismatch: -4
- ⚠️  4 ontology fields not in empirical data

---

### Payments

- **Empirical Field Count:** 8
- **Ontology Field Count:** 7
- **Match:** ❌ No

**Missing in Ontology (1):**
- `Slot`

**Notes:**
- ⚠️  Field count mismatch: +1
- ❌ 1 fields missing in ontology

---

### Contacts

- **Empirical Field Count:** 17
- **Ontology Field Count:** 16
- **Match:** ❌ No

**Missing in Ontology (2):**
- `Slot`
- `Email`

**In Ontology but Not in Empirical (1):**
- `eMail`

**Notes:**
- ⚠️  Field count mismatch: +1
- ❌ 2 fields missing in ontology
- ⚠️  1 ontology fields not in empirical data

---

### Product

- **Empirical Field Count:** 76
- **Ontology Field Count:** 73
- **Match:** ❌ No

**Missing in Ontology (4):**
- `Slot`
- `StockTakeValue`
- `BuyTaxCodeOverride`
- `SellTaxCodeOverride`

**In Ontology but Not in Empirical (1):**
- `AverageValue`

**Notes:**
- ⚠️  Field count mismatch: +3
- ❌ 4 fields missing in ontology
- ⚠️  1 ontology fields not in empirical data

---

### Inventory

- **Empirical Field Count:** 10
- **Ontology Field Count:** 9
- **Match:** ❌ No

**Missing in Ontology (1):**
- `Slot`

**Notes:**
- ⚠️  Field count mismatch: +1
- ❌ 1 fields missing in ontology

---

### Job

- **Empirical Field Count:** 43
- **Ontology Field Count:** 42
- **Match:** ❌ No

**Missing in Ontology (1):**
- `Slot`

**Notes:**
- ⚠️  Field count mismatch: +1
- ❌ 1 fields missing in ontology

---

### AssetLog

- **Empirical Field Count:** 21
- **Ontology Field Count:** 15
- **Match:** ❌ No

**Missing in Ontology (7):**
- `Slot`
- `LastModifiedTime`
- `LogDate`
- `DisposedAccDepn`
- `GainLossOnDisposal`
- `GainLossOnDisposalPrivate`
- `DisposalAccDepnPrivate`

**In Ontology but Not in Empirical (1):**
- `Date`

**Notes:**
- ⚠️  Field count mismatch: +6
- ❌ 7 fields missing in ontology
- ⚠️  1 ontology fields not in empirical data

---

### Build

- **Empirical Field Count:** 9
- **Ontology Field Count:** 6
- **Match:** ❌ No

**Missing in Ontology (7):**
- `Slot`
- `Build.ProductSeq`
- `Build.Order`
- `Build.Qty`
- `Build.PartCode`
- `Build.Flags`
- `Build.Memo`

**In Ontology but Not in Empirical (4):**
- `ProductSeq`
- `PartCode`
- `Qty`
- `Memo`

**Notes:**
- ⚠️  Field count mismatch: +3
- ❌ 7 fields missing in ontology
- ⚠️  4 ontology fields not in empirical data

---

### JobSheet

- **Empirical Field Count:** 33
- **Ontology Field Count:** 33
- **Match:** ✅ Yes

**Notes:**
- ✅ Perfect match

---

### BankRecs

- **Empirical Field Count:** 10
- **Ontology Field Count:** 9
- **Match:** ❌ No

**Missing in Ontology (2):**
- `Slot`
- `ReconciledTime`

**In Ontology but Not in Empirical (1):**
- `Time`

**Notes:**
- ⚠️  Field count mismatch: +1
- ❌ 2 fields missing in ontology
- ⚠️  1 ontology fields not in empirical data

---

### Asset

- **Empirical Field Count:** 41
- **Ontology Field Count:** 36
- **Match:** ❌ No

**Missing in Ontology (5):**
- `Slot`
- `LastModifiedTime`
- `DisposedAccDepn`
- `DisposalAccDepnPrivate`
- `InitialDepn`

**Notes:**
- ⚠️  Field count mismatch: +5
- ❌ 5 fields missing in ontology

---

### AssetCat

- **Empirical Field Count:** 23
- **Ontology Field Count:** 23
- **Match:** ✅ Yes

**Notes:**
- ✅ Perfect match

---

### AutoSplit

- **Empirical Field Count:** 14
- **Ontology Field Count:** 13
- **Match:** ❌ No

**Missing in Ontology (1):**
- `Slot`

**Notes:**
- ⚠️  Field count mismatch: +1
- ❌ 1 fields missing in ontology

---

### Memo

- **Empirical Field Count:** 9
- **Ontology Field Count:** 6
- **Match:** ❌ No

**Missing in Ontology (7):**
- `Slot`
- `Memo.NameSeq`
- `Memo.Order`
- `Memo.Date`
- `Memo.RecallDate`
- `Memo.Flags`
- `Memo.Text`

**In Ontology but Not in Empirical (4):**
- `NameSeq`
- `Date`
- `RecallDate`
- `Text`

**Notes:**
- ⚠️  Field count mismatch: +3
- ❌ 7 fields missing in ontology
- ⚠️  4 ontology fields not in empirical data

---

### User

- **Empirical Field Count:** 5
- **Ontology Field Count:** 4
- **Match:** ❌ No

**Missing in Ontology (1):**
- `Slot`

**Notes:**
- ⚠️  Field count mismatch: +1
- ❌ 1 fields missing in ontology

---

### OffLedger

- **Empirical Field Count:** 154
- **Ontology Field Count:** 0
- **Match:** ❌ No

**Notes:**
- ❌ No ontology file mapped for this entity

---

### Filter

- **Empirical Field Count:** 11
- **Ontology Field Count:** 0
- **Match:** ❌ No

**Notes:**
- ❌ No ontology file mapped for this entity

---

### Stickies

- **Empirical Field Count:** 9
- **Ontology Field Count:** 0
- **Match:** ❌ No

**Notes:**
- ❌ No ontology file mapped for this entity

---

### Lists

- **Empirical Field Count:** 9
- **Ontology Field Count:** 0
- **Match:** ❌ No

**Notes:**
- ❌ No ontology file mapped for this entity

---

### Login

- **Empirical Field Count:** 16
- **Ontology Field Count:** 14
- **Match:** ❌ No

**Missing in Ontology (2):**
- `Slot`
- `SettingsDonor`

**Notes:**
- ⚠️  Field count mismatch: +2
- ❌ 2 fields missing in ontology

---

### User2

- **Empirical Field Count:** 24
- **Ontology Field Count:** 22
- **Match:** ❌ No

**Missing in Ontology (2):**
- `Slot`
- `Colour`

**Notes:**
- ⚠️  Field count mismatch: +2
- ❌ 2 fields missing in ontology

---

