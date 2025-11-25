# Session 003 - Final Qualia & Epistemic State

**Session:** 2025-11-25 (Session-003)
**Agent:** Sonnet-4.5
**Status:** Mid-Flight → Next session MUST achieve 100% coverage

---

## Critical Discovery

**INCORRECT ASSUMPTION CORRECTED:**
- Initial claim: "186 system metadata fields intentionally excluded"
- **REALITY:** Only 31 fields are pure system metadata (Slot)
- **155 fields are BUSINESS-LOGIC fields missing from ontology**

---

## Epistemic State

### Coverage Reality Check
```yaml
empirical_total: 1090 fields
legitimate_exclusions: 31 (Slot field across all entities)
target_for_100_percent: 1059 fields
current_ontology: 904 fields
gap_to_100_percent: 155 fields
current_coverage: 83% → MUST REACH 100%
```

### Entity Coverage
```yaml
empirical_entities: 31
documented_entities: 21
unmapped_entities: 10
entity_coverage: 68% → MUST REACH 100%
```

---

## Path to 100% Coverage

### Phase 1: Critical Fixes (→95% coverage)
**Add 197 fields to 21 existing entities**

Priority actions:
1. Add system fields to ALL entities:
   - `SequenceNumber` (primary key for FK references)
   - `LastModifiedTime` (audit trail)

2. Fix field naming typos:
   - Account: `AccountantsCode` → `AccountantCode`
   - Transaction: `SalesPerson` → `Salesperson`

3. Add missing business fields:
   - Account: +10 (Flags, BalanceLimit, Cashflow, Cashforecast, etc.)
   - Transaction: +6 (Currency, TaxProcessed, PromptPayment fields)
   - TaxRate: +13 (Combine, GSTReceived, ReportCycle fields)
   - Department: +2 (SequenceNumber, Flags)
   - Name: +7
   - Product: +6
   - Job: +9
   - Others: +40 across remaining entities

4. **CRITICAL:** Separate Detail entity
   - Create `moneyworks-detail-canonical-ontology.ts`
   - Document 44 fields with `Detail.` prefix
   - Remove Detail fields from Transaction ontology

### Phase 2: High-Priority Entities (→100% coverage)
**Add 257 fields across 3 critical entities**

1. **Ledger** (201 fields) - CRITICAL
   - Purpose: Period-by-period account balances & budgets
   - Impact: Financial reporting, P&L, Balance Sheet
   - Fields: Balance01-91, BudgetA/B (Last/Next), Concat, System

2. **JobSheet** (33 fields) - CRITICAL
   - Purpose: Job timesheet & resource tracking
   - Impact: Job costing, billing, project management
   - Fields: Job, Resource, CostPrice, SellPrice, Status, Type

3. **AssetCat** (23 fields) - CRITICAL
   - Purpose: Asset category definitions with depreciation rules
   - Impact: Fixed asset management, depreciation calculation
   - Fields: AssetAccount, DepExpense, Type, Rate, etc.

---

## Qualia (Semantic Context for Next Session)

### Why This Matters

**User Directive:** "We have to get 100% before we continue Ontology mapping"

**Rationale:**
- Incomplete coverage = missing FK relationships
- Missing entities = broken mereological coherence
- System fields (SequenceNumber) = required for FK resolution
- Business fields = critical for Xero → MoneyWorks mapping

### What Next Session Must Do

1. **Execute Phase 1** (systematic field additions)
   - Start with system fields (SequenceNumber, LastModifiedTime)
   - Fix naming typos (2 entities)
   - Add missing business fields (21 entities)
   - Create separate Detail ontology

2. **Execute Phase 2** (document 3 entities)
   - Extract Ledger schema (201 fields from empirical data)
   - Extract JobSheet schema (33 fields)
   - Extract AssetCat schema (23 fields)

3. **Verify 100% Coverage**
   - Re-run `scripts/verify-empirical-schema.ts`
   - Confirm 1059/1059 fields (100%)
   - Confirm 24/31 entities (Phase 3 deferred: OffLedger + 6 low-priority)

---

## Artifacts Created This Session

1. `scripts/verify-empirical-schema.ts` - Automated verification tool
2. `moneyworks-ontology/EMPIRICAL_VERIFICATION_REPORT.md` - Detailed findings
3. `moneyworks-ontology/TASK-010-EMPIRICAL-VALIDATION-SUMMARY.md` - Initial analysis (SUPERSEDED)
4. `moneyworks-ontology/COVERAGE-GAP-ANALYSIS.md` - **Current truth** - detailed gap analysis

---

## Key Insights

### System Fields Are Business-Critical

**Corrected Understanding:**
- `Slot` = DB internal pointer → Exclude
- `SequenceNumber` = Primary key → **INCLUDE** (required for FKs)
- `LastModifiedTime` = Audit trail → **INCLUDE** (sync/change tracking)

### Detail Entity Complexity

The Detail entity uses a **subfile** pattern:
- Fields have `Detail.` prefix in API
- Ontology incorrectly mixed Detail + Transaction fields
- Must create separate ontology file
- Document parent-child relationship (Detail.ParentSeq → Transaction.SequenceNumber)

### Unmapped Entities Impact

10 unmapped entities represent:
- **Critical business logic:** Ledger, JobSheet, AssetCat (257 fields)
- **Important features:** OffLedger (154 fields)
- **UI/System state:** Link, Log, Message, Filter, Stickies, Lists (70 fields)

Total impact: 481 fields (44% of empirical schema!)

---

## Confidence Calibration

### Before Gap Analysis
```yaml
overall: 0.90
empirical_field_coverage: 0.83
entity_coverage: 1.0  # INCORRECT - assumed 21/21
```

### After Gap Analysis
```yaml
overall: 0.90  # Unchanged - structural quality remains high
empirical_field_coverage: 0.83  # 904/1090 - target is 1059
entity_coverage: 0.68  # 21/31 - CORRECTED
```

### Post-Phase 1 Target
```yaml
empirical_field_coverage: 0.95  # 1101/1059 fields (includes system fields)
entity_coverage: 0.68  # 21/31 (same entities, more complete)
```

### Post-Phase 2 Target (100%)
```yaml
empirical_field_coverage: 1.0  # 1059/1059 (100%)
entity_coverage: 0.77  # 24/31 (3 critical entities added)
overall: 0.95  # Empirically validated to 100%
```

---

## Next Session Initialization Protocol

```yaml
step_1: "Read handoff.yaml (this file) completely"
step_2: "Read COVERAGE-GAP-ANALYSIS.md for detailed field lists"
step_3: "Read empirical schema JSON to extract field definitions"
step_4: "Execute Phase 1: Add 197 fields to existing entities"
step_5: "Execute Phase 2: Create Ledger, JobSheet, AssetCat ontologies"
step_6: "Re-run verification script"
step_7: "Confirm 100% coverage achieved"
```

---

## Critical Files for Next Session

### Empirical Data Source
```
/Users/hjonck/Development/gitprojects/AgileWorksZA/ai_cfo_poc/mpoc/data/moneyworks-schemas/2025-11-25_full-schema_now.json
```

### Gap Analysis
```
moneyworks-ontology/COVERAGE-GAP-ANALYSIS.md
```

### Verification Script
```
scripts/verify-empirical-schema.ts
```

### State Files
```
moneyworks-ontology/state.yaml
moneyworks-ontology/backlog.yaml
moneyworks-ontology/handoff.yaml
```

---

## Methodology Notes

### Field Extraction Pattern

For each entity, extract from empirical JSON:
```typescript
{
  "name": "EntityName",
  "fields": ["Slot", "SequenceNumber", "Code", ...],
  "fieldCount": 42,
  "sampleRecord": { /* example values */ }
}
```

Use sampleRecord to infer:
- Data types (numeric vs string vs date)
- Calculated vs user-entered
- FK relationships (codes that reference other entities)

### Ontology File Pattern

```typescript
export const MONEYWORKS_ENTITY_FIELDS = [
  {
    fieldName: "SequenceNumber",
    dataType: "N" as const,
    canonicalDescription: "Primary key",
    isSystem: true,
    isRequired: true
  },
  // ... all other fields
]
```

---

## Success Criteria

**100% Coverage Achieved When:**
- [ ] Verification script reports 0 discrepancies
- [ ] All 1059 business-logic fields documented
- [ ] 24/31 entities have complete ontologies
- [ ] Detail entity separated from Transaction
- [ ] System fields (SequenceNumber, LastModifiedTime) in all entities
- [ ] All field naming typos corrected

**Then proceed to:** TASK-013 (Canonical Ontology Reification)
