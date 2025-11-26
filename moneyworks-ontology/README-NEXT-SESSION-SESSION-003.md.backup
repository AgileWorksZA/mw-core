# Next Session Quick Start Guide

**Mission:** Achieve 100% empirical field coverage before proceeding to ontology mapping

---

## 🎯 Quick Context

**Current State:**
- Coverage: 83% (904/1090 fields)
- Target: 100% (1059 fields, excluding 31 Slot fields)
- Gap: 155 fields to add

**Why This Matters:**
- User directive: "Must get 100% before ontology mapping"
- Incomplete coverage = missing FK relationships
- Missing entities = broken mereological coherence
- System fields required for FK resolution

---

## 📖 Read These Files IN ORDER

### 1. Session Context (Read First)
```
moneyworks-ontology/handoff.yaml
```
**Contains:** Complete session initialization protocol, current state, Phase 1 & 2 task definitions

### 2. Semantic Understanding
```
moneyworks-ontology/SESSION-003-FINAL-QUALIA.md
```
**Contains:** WHY we need 100%, epistemic insights, corrected assumptions

### 3. Detailed Gap Analysis
```
moneyworks-ontology/COVERAGE-GAP-ANALYSIS.md
```
**Contains:** Field-by-field breakdown, entity analysis, coverage calculations

### 4. Concrete Examples
```
moneyworks-ontology/PHASE-1-EXAMPLE.md
```
**Contains:** Step-by-step examples showing EXACTLY how to add missing fields

---

## ⚡ Quick Action Plan

### Phase 1: Add Fields to Existing Entities (→95% coverage)

**Input:** Empirical schema JSON
```
/Users/hjonck/Development/gitprojects/AgileWorksZA/ai_cfo_poc/mpoc/data/moneyworks-schemas/2025-11-25_full-schema_now.json
```

**Actions:**
1. For each of 21 existing ontology files in `generated/moneyworks-*-canonical-ontology.ts`:
   - Read empirical field list from JSON
   - Compare with current ontology
   - Add missing fields using pattern from PHASE-1-EXAMPLE.md

2. Fix 2 naming typos:
   - Account: `AccountantsCode` → `AccountantCode`
   - Transaction: `SalesPerson` → `Salesperson`

3. Create NEW file for Detail entity:
   - `generated/moneyworks-detail-canonical-ontology.ts`
   - 44 fields with `Detail.` prefix
   - Document parent-child relationship

**Fields to Add:** 197 across all existing entities

### Phase 2: Create 3 Critical Entities (→100% coverage)

**Create these NEW files:**

1. `generated/moneyworks-ledger-canonical-ontology.ts`
   - 201 fields (period balances & budgets)
   - Critical for financial reporting

2. `generated/moneyworks-jobsheet-canonical-ontology.ts`
   - 33 fields (job timesheets)
   - Critical for project management

3. `generated/moneyworks-assetcat-canonical-ontology.ts`
   - 23 fields (asset categories)
   - Critical for depreciation

**Fields to Add:** 257 across 3 new entities

---

## 🔧 Technical Workflow

### Data Extraction Pattern

```typescript
// Read empirical JSON
const empirical = JSON.parse(fs.readFileSync('...2025-11-25_full-schema_now.json'));
const accountTable = empirical.tables.find(t => t.name === 'Account');

// accountTable.fields = ["Slot", "SequenceNumber", "Code", ...]
// accountTable.sampleRecord = { sequencenumber: "293", code: "5105", ... }

// For each field in accountTable.fields:
//   1. Skip "Slot" (pure system field)
//   2. Infer dataType from sampleRecord value
//   3. Add to MONEYWORKS_ACCOUNT_FIELDS array
```

### Field Definition Template

```typescript
{
  fieldName: "FieldName",
  dataType: "N" as const,  // N=numeric, T=text, D=date, A=alphanumeric
  maxLength: 255,  // For T fields
  canonicalDescription: "Field purpose",
  manualSource: "Empirical API validation",
  isRequired: false,
  isIndexed: false,
  isSystem: false,  // true for SequenceNumber, LastModifiedTime
  isCalculated: false  // true for balance fields
}
```

### Type Inference Rules

```typescript
// From sampleRecord value:
"293"           → dataType: "N"  // Numeric
"20251125"      → dataType: "D"  // Date (YYYYMMDD format)
"CA"            → dataType: "A"  // Alphanumeric code
"Description"   → dataType: "T"  // Text
"0.00"          → dataType: "N"  // Numeric (decimal)
```

---

## ✅ Verification Process

### After ALL changes complete:

```bash
cd /Users/hjonck/Development/gitprojects/AgileWorksZA/mw-core
npx tsx scripts/verify-empirical-schema.ts
```

### Success Criteria:

```
Perfect Matches: 24/31 (77%)
  ✅ Account
  ✅ Name
  ✅ Product
  ✅ Job
  ✅ Transaction
  ✅ Detail        (NEW - separated from Transaction)
  ✅ Ledger        (NEW)
  ✅ JobSheet      (NEW)
  ✅ AssetCat      (NEW)
  ... (15 more existing entities)

Total fields missing in ontology: 0
Empirical field coverage: 100%
```

---

## 📊 Progress Tracking

### Update These Files at Session End:

1. **state.yaml**
   ```yaml
   empirical_field_coverage: 1.0  # 100%
   entity_coverage: 0.77  # 24/31
   overall: 0.95  # Increased from 0.90
   ```

2. **backlog.yaml**
   - Mark Phase 1 & 2 tasks complete
   - Add completion dates

3. **handoff.yaml**
   - Update current_state phase to "100% Coverage Achieved"
   - Note next action: "Proceed to TASK-013 (Ontology Reification)"

4. **Create SESSION-004-FINAL-QUALIA.md**
   - Document what was achieved
   - Note any challenges or insights
   - Provide context for next session

---

## 🎓 Key Insights for This Work

### System Fields ARE Important

**DO INCLUDE:**
- `SequenceNumber` - Primary key for FK references
- `LastModifiedTime` - Audit trail for sync

**DO EXCLUDE:**
- `Slot` - Pure database internal pointer

### Detail Entity is Special

- Fields have `Detail.` prefix in API
- Subfile relationship: `Detail.ParentSeq → Transaction.SequenceNumber`
- Must be SEPARATE ontology file

### Ledger is a Pivot Table

- One record per Account+Department+Category
- 92 balance fields (last 91 periods + current)
- 96 budget fields (A & B scenarios, past + future)

---

## 🚀 Execution Strategy

**Recommended Approach:**

1. **Start Small** - Fix 2 naming typos first (quick win)
2. **Add System Fields** - Add SequenceNumber & LastModifiedTime to all 21 entities
3. **Add Business Fields** - Work through entities alphabetically
4. **Create Detail** - Separate from Transaction
5. **Create Big Three** - Ledger, JobSheet, AssetCat
6. **Verify** - Run script, check for 100%

**Estimated Effort:**
- Phase 1: ~2 hours (systematic field additions)
- Phase 2: ~1 hour (3 new entity files)
- Verification: ~15 minutes

**Total:** ~3-4 hours to achieve 100% coverage

---

## ❓ If You Get Stuck

### Check These Resources:

1. **Empirical data structure:**
   - Read the JSON file
   - Look at sampleRecord for type inference

2. **Existing patterns:**
   - Look at `moneyworks-names-canonical-ontology.ts`
   - Copy the field definition structure

3. **Gap analysis:**
   - `COVERAGE-GAP-ANALYSIS.md` has detailed field lists

4. **Examples:**
   - `PHASE-1-EXAMPLE.md` shows exact steps

---

## 🎯 Success Definition

**You're done when:**
- ✅ Verification script shows 0 missing fields
- ✅ Coverage = 100% (1059/1059 fields)
- ✅ 24 entities have perfect match
- ✅ State files updated
- ✅ Ready to proceed to ontology mapping

**Then:** User can proceed with confidence that the canonical ontology is empirically complete and ready for downstream work (Xero → MoneyWorks mapping, MCP server development, etc.)

---

**Good luck! The path is clear, the examples are concrete, and 100% coverage is achievable! 🚀**
