# Coverage Gap Analysis - Path to 100%

**Created:** 2025-11-25
**Purpose:** Systematic analysis of all missing fields to achieve 100% empirical coverage

---

## Executive Summary

**Current State:** 83% coverage (904/1090 fields)
**Gap:** 186 fields missing
**INCORRECT ASSUMPTION:** These are NOT all "system metadata" - many are business-logic fields!

### Gap Breakdown

| Category | Count | Action Required |
|----------|-------|-----------------|
| **System Metadata** (legitimate exclusions) | ~93 | Document but don't add to ontology |
| **Business-Logic Fields** (missing from ontology) | ~93 | **MUST ADD** to achieve 100% |

---

## System Metadata Fields (Legitimate Exclusions)

These fields appear in EVERY entity and are database implementation details:

| Field | Type | Purpose | Include in Ontology? |
|-------|------|---------|---------------------|
| `Slot` | System | Database record slot number | **NO** - internal DB pointer |
| `SequenceNumber` | System | Primary key (auto-increment) | **YES** - needed for FK references |
| `LastModifiedTime` | System | Audit timestamp | **YES** - useful for sync/audit |

**Revised Decision:**
- `Slot` → Exclude (pure DB implementation)
- `SequenceNumber` → **Include** (required for FK relationships)
- `LastModifiedTime` → **Include** (useful for change tracking)

**Count:** Only `Slot` should be excluded = ~31 fields (one per entity)

---

## Business-Logic Fields Analysis (MUST ADD)

### Category 1: Missing Core Fields

#### Account Entity (11 missing)
- ✅ `SequenceNumber` - **MUST ADD** (primary key for FKs)
- ❌ `Slot` - Exclude (DB internal)
- ✅ `Flags` - **MUST ADD** (account flags)
- ✅ `AccountantCode` - **MUST ADD** (typo in ontology: AccountantsCode)
- ✅ `BalanceLimit` - **MUST ADD** (overdraft limit)
- ✅ `ManualChequeNumDigits` - **MUST ADD**
- ✅ `PrintedChequeNumDigits` - **MUST ADD**
- ✅ `FeedID` - **MUST ADD** (bank feed integration)
- ✅ `Cashflow` - **MUST ADD** (cashflow category)
- ✅ `Cashforecast` - **MUST ADD** (forecast category)
- ✅ `ImportFormat` - **MUST ADD** (statement import format)

**Action:** Add 10 fields (all except Slot)

#### Transaction Entity (7 missing)
- ❌ `Slot` - Exclude
- ✅ `TaxProcessed` - **MUST ADD** (GST/VAT processing flag)
- ✅ `Salesperson` - **FIX TYPO** (ontology has "SalesPerson")
- ✅ `Currency` - **MUST ADD** (multi-currency support)
- ✅ `CurrencyTransferSeq` - **MUST ADD** (FX transfer reference)
- ✅ `PromptPaymentTerms` - **MUST ADD** (early payment terms)
- ✅ `PromptPaymentDisc` - **MUST ADD** (early payment discount)

**Action:** Add 6 fields + fix 1 typo

#### Department Entity (3 missing)
- ❌ `Slot` - Exclude
- ✅ `SequenceNumber` - **MUST ADD**
- ✅ `Flags` - **MUST ADD** (department flags)

**Action:** Add 2 fields

#### TaxRate Entity (14 missing)
- ❌ `Slot` - Exclude
- ✅ `SequenceNumber` - **MUST ADD**
- ✅ `Combine` - **MUST ADD** (combined tax code)
- ✅ `CombineRate1` - **MUST ADD** (combined rate component 1)
- ✅ `CombineRate2` - **MUST ADD** (combined rate component 2)
- ✅ `GSTReceived` - **MUST ADD** (GST received balance)
- ✅ `NetReceived` - **MUST ADD** (net received balance)
- ✅ `GSTPaid` - **MUST ADD** (GST paid balance)
- ✅ `NetPaid` - **MUST ADD** (net paid balance)
- ✅ `ReportCycleStart` - **MUST ADD** (reporting period start)
- ✅ `ReportCycleEnd` - **MUST ADD** (reporting period end)
- ✅ `ReportDate` - **MUST ADD** (next report date)
- ✅ `AliasCode` - **MUST ADD** (alternative tax code)
- ✅ `AliasCountry` - **MUST ADD** (country for alias)

**Action:** Add 13 fields

---

### Category 2: Unmapped Entities (8 entities, ~550 fields)

These entities have NO ontology file:

| Entity | Fields | Priority | Business Value |
|--------|--------|----------|----------------|
| **Ledger** | 201 | **HIGH** | Period balances & budgets (critical for reporting) |
| **OffLedger** | 154 | MEDIUM | Off-balance sheet tracking (currencies, etc.) |
| **JobSheet** | 33 | **HIGH** | Job timesheets/resource tracking |
| **AssetCat** | 23 | **HIGH** | Asset category definitions (depreciation rules) |
| **Link** | 5 | LOW | Department-group linkage |
| **Log** | 8 | LOW | Audit log (system history) |
| **Message** | 28 | LOW | User reminders/messages |
| **Filter** | 11 | LOW | Saved filter definitions (UI state) |
| **Stickies** | 9 | LOW | UI sticky notes |
| **Lists** | 9 | LOW | Custom list definitions |

**High Priority (must document):** Ledger (201), JobSheet (33), AssetCat (23) = 257 fields
**Medium Priority:** OffLedger (154) = 154 fields
**Low Priority (UI/system):** Link, Log, Message, Filter, Stickies, Lists = 70 fields

---

### Category 3: Detail Entity (Critical Issue)

**Problem:** Detail fields use `Detail.` prefix in API but ontology has bare field names

**Empirical API Structure:**
```
Detail.SequenceNumber
Detail.ParentSeq
Detail.Account
Detail.Gross
... (44 fields total with "Detail." prefix)
```

**Ontology Structure (INCORRECT):**
```
SequenceNumber
ParentSeq
Account
Gross
... mixed with Transaction fields!
```

**Root Cause:** The ontology conflated Detail subfile with Transaction parent entity

**Action Required:**
1. Create separate `moneyworks-detail-canonical-ontology.ts`
2. Extract Detail-specific fields from transactions file
3. Document `Detail.` prefix convention
4. Map all 44 Detail fields correctly

---

## Revised Field Count Analysis

### System Fields (Exclude = 31)
- `Slot` × 31 entities = 31 fields to exclude

### Must Add to Ontology
| Category | Fields | Status |
|----------|--------|--------|
| System fields to include | `SequenceNumber`, `LastModifiedTime` across entities | ~62 |
| Business-logic fields (existing entities) | Account, Transaction, Department, etc. | ~62 |
| **High-priority unmapped entities** | Ledger, JobSheet, AssetCat | **257** |
| **Medium-priority unmapped** | OffLedger | **154** |
| Detail entity correction | Separate Detail ontology | **44** |
| **TOTAL MUST ADD** | | **~579** |

**Adjusted Coverage Calculation:**
- Empirical total: 1090 fields
- Legitimate exclusions (Slot only): 31 fields
- **Target for 100% coverage: 1059 fields**
- Current coverage: 904 fields
- **Gap to 100%: 155 fields** (not 186!)

---

## Action Plan for 100% Coverage

### Phase 1: Critical Fixes (Required for 100%)

**1.1 Fix Field Naming Discrepancies**
- [ ] Account: `AccountantsCode` → `AccountantCode`
- [ ] Transaction: `SalesPerson` → `Salesperson`

**1.2 Add Missing Fields to Existing Entities**
- [ ] Account: Add 10 fields (Flags, BalanceLimit, Cashflow, etc.)
- [ ] Transaction: Add 6 fields (Currency, TaxProcessed, PromptPayment*, etc.)
- [ ] Department: Add 2 fields (SequenceNumber, Flags)
- [ ] TaxRate: Add 13 fields (Combine, GSTReceived, ReportCycle*, etc.)
- [ ] Name: Add 7 fields (Flags, EInvoicingID, etc.)
- [ ] Product: Add 6 fields (Hash field, etc.)
- [ ] Job: Add 9 fields (Flags, Custom5-8, etc.)
- [ ] Payments: Add 2 fields (SequenceNumber, LastModifiedTime)
- [ ] Inventory: Add 2 fields (SequenceNumber, LastModifiedTime)
- [ ] Asset: Add 6 fields
- [ ] AssetLog: Add 7 fields
- [ ] BankRecs: Add 2 fields
- [ ] AutoSplit: Add 2 fields
- [ ] Memo: Add 4 fields (Detail. prefix fields)
- [ ] User: Add 2 fields
- [ ] Login: Add 8 fields
- [ ] User2: Add 3 fields

**Subtotal:** ~91 fields across existing entities

**1.3 Separate Detail Entity**
- [ ] Create `moneyworks-detail-canonical-ontology.ts`
- [ ] Document all 44 Detail.* fields
- [ ] Remove Detail fields from Transaction ontology
- [ ] Document subfile relationship

**Subtotal:** 44 fields

**1.4 Add System Metadata Fields**
- [ ] Add `SequenceNumber` to all entities (primary key)
- [ ] Add `LastModifiedTime` to all entities (audit trail)

**Subtotal:** ~62 fields (31 entities × 2 fields, accounting for some already present)

---

### Phase 2: High-Priority Unmapped Entities (Critical Business Logic)

**2.1 Ledger Entity (201 fields)**
- Purpose: Period-by-period account balances and budgets
- Critical for: Financial reporting, P&L, Balance Sheet
- Fields: Balance01-Balance91, BudgetA*, BudgetB*, etc.

**2.2 JobSheet Entity (33 fields)**
- Purpose: Job timesheet and resource tracking
- Critical for: Job costing, billing, project management
- Fields: Job, Resource, CostPrice, SellPrice, Status, etc.

**2.3 AssetCat Entity (23 fields)**
- Purpose: Asset category definitions with depreciation rules
- Critical for: Fixed asset management, depreciation calculation
- Fields: Code, AssetAccount, DepExpense, Type, Rate, etc.

**Subtotal:** 257 fields

---

### Phase 3: Medium-Priority Unmapped Entities

**3.1 OffLedger Entity (154 fields)**
- Purpose: Off-balance sheet tracking (currencies, unearned revenue, etc.)
- Fields: Kind, Name, Balance00-Balance91, Budget*, LinkedAccount*, etc.

**Subtotal:** 154 fields

---

### Phase 4: Low-Priority Entities (Optional - UI/System)

- Link (5) - Department-group mappings
- Log (8) - Audit history
- Message (28) - User reminders
- Filter (11) - Saved UI filters
- Stickies (9) - UI notes
- Lists (9) - Custom lists

**Subtotal:** 70 fields (can defer if needed)

---

## Coverage Targets

| Phase | Fields Added | Cumulative Coverage | Status |
|-------|--------------|---------------------|--------|
| **Current** | 904 | 83% | Baseline |
| **Phase 1: Critical Fixes** | +197 | **95%** | **REQUIRED** |
| **Phase 2: High-Priority** | +257 | **100% (business-critical)** | **REQUIRED** |
| **Phase 3: Medium-Priority** | +154 | 100%+ (complete) | Recommended |
| **Phase 4: Low-Priority** | +70 | 100%+ (exhaustive) | Optional |

---

## Conclusion

**The "186 system metadata fields" claim was INCORRECT.**

Actual breakdown:
- **31 fields** are truly system metadata (Slot) → Exclude
- **155 fields** are missing business-logic fields → **MUST ADD**

**Path to 100% Coverage:**
1. ✅ Phase 1: Add 197 fields to existing entities + fix naming → **95% coverage**
2. ✅ Phase 2: Document 3 high-priority entities (257 fields) → **100% business-critical coverage**
3. ⚠️ Phase 3: Document OffLedger (154 fields) → Complete coverage
4. ⚠️ Phase 4: Document UI/system entities (70 fields) → Exhaustive coverage

**Recommendation:** Execute Phases 1 & 2 to achieve 100% coverage of all business-critical fields.
