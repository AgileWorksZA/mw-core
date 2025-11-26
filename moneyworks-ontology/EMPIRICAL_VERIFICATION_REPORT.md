# MoneyWorks Empirical Schema Verification Report

**Generated:** 2025-11-25T23:38:07.015Z
**Task:** TASK-010 - API Schema Validation

## Executive Summary

- **Perfect Matches:** 15/31 (48.4%)
- **Entities with Discrepancies:** 16

## Detailed Results

### Account

- **Empirical Field Count:** 35
- **Ontology Field Count:** 35
- **Match:** ✅ Yes

**Notes:**
- ✅ Perfect match

---

### Ledger

- **Empirical Field Count:** 200
- **Ontology Field Count:** 201
- **Match:** ❌ No

**In Ontology but Not in Empirical (1):**
- `Slot`

**Notes:**
- ⚠️  Field count mismatch: -1
- ⚠️  1 ontology fields not in empirical data

---

### General

- **Empirical Field Count:** 6
- **Ontology Field Count:** 6
- **Match:** ✅ Yes

**Notes:**
- ✅ Perfect match

---

### Department

- **Empirical Field Count:** 11
- **Ontology Field Count:** 11
- **Match:** ✅ Yes

**Notes:**
- ✅ Perfect match

---

### Link

- **Empirical Field Count:** 5
- **Ontology Field Count:** 0
- **Match:** ❌ No

**Notes:**
- ❌ No ontology file mapped for this entity

---

### Transaction

- **Empirical Field Count:** 72
- **Ontology Field Count:** 72
- **Match:** ✅ Yes

**Notes:**
- ✅ Perfect match

---

### Detail

- **Empirical Field Count:** 43
- **Ontology Field Count:** 44
- **Match:** ❌ No

**In Ontology but Not in Empirical (1):**
- `Slot`

**Notes:**
- ⚠️  Field count mismatch: -1
- ⚠️  1 ontology fields not in empirical data

---

### Log

- **Empirical Field Count:** 8
- **Ontology Field Count:** 0
- **Match:** ❌ No

**Notes:**
- ❌ No ontology file mapped for this entity

---

### TaxRate

- **Empirical Field Count:** 30
- **Ontology Field Count:** 31
- **Match:** ❌ No

**In Ontology but Not in Empirical (1):**
- `Slot`

**Notes:**
- ⚠️  Field count mismatch: -1
- ⚠️  1 ontology fields not in empirical data

---

### Message

- **Empirical Field Count:** 28
- **Ontology Field Count:** 0
- **Match:** ❌ No

**Notes:**
- ❌ No ontology file mapped for this entity

---

### Name

- **Empirical Field Count:** 102
- **Ontology Field Count:** 107
- **Match:** ❌ No

**In Ontology but Not in Empirical (5):**
- `Slot`
- `SalesPerson`
- `EInvoiceID`
- `CustPropmtPaymentDiscount`
- `SupplierPromptPaymentTerms`

**Notes:**
- ⚠️  Field count mismatch: -5
- ⚠️  5 ontology fields not in empirical data

---

### Payments

- **Empirical Field Count:** 7
- **Ontology Field Count:** 7
- **Match:** ✅ Yes

**Notes:**
- ✅ Perfect match

---

### Contacts

- **Empirical Field Count:** 16
- **Ontology Field Count:** 16
- **Match:** ✅ Yes

**Notes:**
- ✅ Perfect match

---

### Product

- **Empirical Field Count:** 75
- **Ontology Field Count:** 76
- **Match:** ❌ No

**In Ontology but Not in Empirical (1):**
- `AverageValue`

**Notes:**
- ⚠️  Field count mismatch: -1
- ⚠️  1 ontology fields not in empirical data

---

### Inventory

- **Empirical Field Count:** 9
- **Ontology Field Count:** 9
- **Match:** ✅ Yes

**Notes:**
- ✅ Perfect match

---

### Job

- **Empirical Field Count:** 42
- **Ontology Field Count:** 42
- **Match:** ✅ Yes

**Notes:**
- ✅ Perfect match

---

### AssetLog

- **Empirical Field Count:** 20
- **Ontology Field Count:** 20
- **Match:** ✅ Yes

**Notes:**
- ✅ Perfect match

---

### Build

- **Empirical Field Count:** 8
- **Ontology Field Count:** 8
- **Match:** ❌ No

**Missing in Ontology (6):**
- `Build.ProductSeq`
- `Build.Order`
- `Build.Qty`
- `Build.PartCode`
- `Build.Flags`
- `Build.Memo`

**In Ontology but Not in Empirical (6):**
- `ProductSeq`
- `Order`
- `PartCode`
- `Qty`
- `Flags`
- `Memo`

**Notes:**
- ❌ 6 fields missing in ontology
- ⚠️  6 ontology fields not in empirical data

---

### JobSheet

- **Empirical Field Count:** 32
- **Ontology Field Count:** 33
- **Match:** ❌ No

**In Ontology but Not in Empirical (1):**
- `Slot`

**Notes:**
- ⚠️  Field count mismatch: -1
- ⚠️  1 ontology fields not in empirical data

---

### BankRecs

- **Empirical Field Count:** 9
- **Ontology Field Count:** 9
- **Match:** ✅ Yes

**Notes:**
- ✅ Perfect match

---

### Asset

- **Empirical Field Count:** 40
- **Ontology Field Count:** 40
- **Match:** ✅ Yes

**Notes:**
- ✅ Perfect match

---

### AssetCat

- **Empirical Field Count:** 22
- **Ontology Field Count:** 23
- **Match:** ❌ No

**In Ontology but Not in Empirical (1):**
- `Slot`

**Notes:**
- ⚠️  Field count mismatch: -1
- ⚠️  1 ontology fields not in empirical data

---

### AutoSplit

- **Empirical Field Count:** 13
- **Ontology Field Count:** 13
- **Match:** ✅ Yes

**Notes:**
- ✅ Perfect match

---

### Memo

- **Empirical Field Count:** 8
- **Ontology Field Count:** 8
- **Match:** ❌ No

**Missing in Ontology (6):**
- `Memo.NameSeq`
- `Memo.Order`
- `Memo.Date`
- `Memo.RecallDate`
- `Memo.Flags`
- `Memo.Text`

**In Ontology but Not in Empirical (6):**
- `NameSeq`
- `Order`
- `Date`
- `RecallDate`
- `Flags`
- `Text`

**Notes:**
- ❌ 6 fields missing in ontology
- ⚠️  6 ontology fields not in empirical data

---

### User

- **Empirical Field Count:** 4
- **Ontology Field Count:** 4
- **Match:** ✅ Yes

**Notes:**
- ✅ Perfect match

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

- **Empirical Field Count:** 15
- **Ontology Field Count:** 15
- **Match:** ✅ Yes

**Notes:**
- ✅ Perfect match

---

### User2

- **Empirical Field Count:** 23
- **Ontology Field Count:** 23
- **Match:** ✅ Yes

**Notes:**
- ✅ Perfect match

---

