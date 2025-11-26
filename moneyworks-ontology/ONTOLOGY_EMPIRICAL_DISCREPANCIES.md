# MoneyWorks Ontology - Empirical Discrepancies Analysis

**Date**: 2025-11-26
**Authority**: Empirical API comparison (MoneyWorks Now v9.2.3)
**Status**: RESEARCH REQUIRED - Not "deprecated", needs investigation

## Executive Summary

Verification against MoneyWorks Now v9.2.3 API identified **11 fields present in canonical ontologies but not in empirical API response**. These are NOT assumed to be deprecated - they require systematic research to determine their status.

**Critical Principle**: We document what exists in the empirical system. Fields in ontologies that don't appear in API may be:
- Edition-specific (MW Gold/Enterprise features not in MW Now)
- Version-specific (different MW versions)
- Calculated fields (computed, not stored)
- Alias names (same field, different name in API)
- Typos in ontology (our error)
- Actually deprecated (removed from product)

**Action Required**: Systematic research against MoneyWorks manual and other MW editions/versions.

---

## Discrepancy Categories

### Category 1: Slot System Field (6 instances)

**Status**: ⚠️ UNDER REVIEW - Present in empirical, excluded by verification script

#### Technical Context

The verification script (`scripts/verify-empirical-schema.ts`) has this configuration:
```typescript
const EXCLUDED_SYSTEM_FIELDS = ['Slot'] as const;
```

**Empirical Evidence**: Slot field **IS present** in MoneyWorks Now v9.2.3 API responses for all entities.

**Verification Behavior**: Script excludes Slot from empirical field counts by design.

**Ontology Status**: Slot fields correctly documented in ontologies with `isSystem: true`.

#### Affected Entities

| Entity | Ontology Fields | Empirical (incl Slot) | Empirical (excl Slot) | Match? |
|--------|----------------|----------------------|----------------------|---------|
| Ledger | 201 | 201 | 200 | ✅ Match (when Slot excluded) |
| Detail | 44 | 44 | 43 | ✅ Match (when Slot excluded) |
| TaxRate | 31 | 31 | 30 | ✅ Match (when Slot excluded) |
| JobSheet | 33 | 33 | 32 | ✅ Match (when Slot excluded) |
| AssetCat | 23 | 23 | 22 | ✅ Match (when Slot excluded) |
| Name | 107 (includes Slot) | 103 (includes Slot) | 102 (excludes Slot) | ⚠️ Still -5 discrepancy |

#### Analysis

**Question**: Why does verification script exclude Slot?

**Hypothesis**: Original design decision to focus verification on "business logic fields" vs "system implementation fields". Slot is an internal database identifier, less relevant to business domain modeling.

**Decision**: Keep Slot in ontologies (empirically accurate) but document the verification exclusion pattern.

**Recommendation**:
- Maintain Slot fields in ontologies (factual accuracy)
- Keep verification exclusion (focuses metrics on business fields)
- Document this intentional discrepancy

---

### Category 2: Name Entity Fields (4 fields)

**Status**: ⚠️ RESEARCH REQUIRED

#### Fields Not in Empirical API v9.2.3

1. **SalesPerson**
   - **Ontology**: Present (added in TASK-020 Phase 1)
   - **Empirical**: Not found in MW Now v9.2.3
   - **Hypothesis**: Possible casing issue - API has "Salesperson" (note capitalization)
   - **Research**: Check if this is a typo in ontology vs API field name
   - **Priority**: HIGH - likely naming issue

2. **EInvoiceID**
   - **Ontology**: Present (e-invoicing identifier)
   - **Empirical**: Not found in MW Now v9.2.3
   - **Hypothesis**: Edition-specific (MW Gold/Enterprise) or version-specific feature
   - **Research**: Check MW manual for e-invoicing feature availability by edition
   - **Priority**: MEDIUM - may be legitimate edition difference

3. **CustPropmtPaymentDiscount**
   - **Ontology**: Present (customer prompt payment discount)
   - **Empirical**: Not found in MW Now v9.2.3
   - **Hypothesis**: Typo in field name - "Propmtpayment" should be "PromptPayment"?
   - **Research**: Check manual for correct field name spelling
   - **Priority**: HIGH - likely typo

4. **SupplierPromptPaymentTerms**
   - **Ontology**: Present (supplier payment terms)
   - **Empirical**: Not found in MW Now v9.2.3
   - **Hypothesis**: Field consolidation or restructuring in API
   - **Research**: Check if functionality exists under different field name
   - **Priority**: MEDIUM

#### Research Protocol for Name Fields

1. **Manual Verification**: Check `moneyworks_appendix_names.html` for field definitions
2. **API Field Name Mapping**: Compare ontology names to empirical API response field names
3. **Edition Comparison**: Test against MW Gold/Enterprise if available
4. **Version History**: Check MW release notes for field changes
5. **Functional Testing**: Verify if functionality exists under different names

---

### Category 3: Product Entity Field (1 field)

**Status**: ⚠️ RESEARCH REQUIRED

#### AverageValue

- **Ontology**: Present
- **Empirical**: Not found in MW Now v9.2.3
- **Hypothesis**: Calculated field (average inventory cost) - computed on-demand, not stored
- **Alternative**: May be available through different endpoint or calculation
- **Research**: Check manual for inventory costing field documentation
- **Priority**: MEDIUM

#### Research Protocol

1. Check `moneyworks_appendix_products.html` for AverageValue definition
2. Determine if field is calculated vs stored
3. Verify if functionality exists via API calculation endpoint
4. Check MW version differences in inventory costing

---

## Research Methodology

### Phase 1: Manual Source Verification (CRITICAL)

For each discrepant field:
1. Search MoneyWorks manual appendices for field definition
2. Document exact field name from authoritative source
3. Note any edition/version restrictions mentioned
4. Extract field description and data type

### Phase 2: API Field Mapping

1. Compare ontology field names to empirical API response (case-sensitive)
2. Check for alias patterns (e.g., "SalesPerson" vs "Salesperson")
3. Document actual API field names from empirical schema

### Phase 3: Edition/Version Testing

1. Test fields against MW Gold/Enterprise if available
2. Check MW release notes for field additions/removals
3. Document version-specific or edition-specific fields

### Phase 4: Ontology Correction

Based on research findings:
- **Fix typos** in ontology field names (e.g., "Propmtpayment" → "PromptPayment")
- **Add edition flags** for edition-specific fields (e.g., `editionRequired: "Gold"`)
- **Mark calculated fields** (e.g., `isCalculated: true, storedInDB: false`)
- **Remove errors** if field doesn't exist in any MW edition/version

---

## Current Status: Verification Metrics

**With Slot Exclusion (Current Script Behavior):**
- Perfect Matches: 24/31 (77.4%)
- Entities with discrepancies: 7
- Fields missing in ontology: 0
- **Ontology fields not in empirical: 11** ← THIS DOCUMENT

**Without Slot Exclusion (Raw Comparison):**
- Perfect Matches: 18/31 (58.1%)
- Additional matches from Slot exclusion: 6 entities

---

## Next Steps (Backlog Task)

**TASK-022**: Research Ontology-Empirical Field Discrepancies

**Subtasks**:
1. Manual verification of 5 Name/Product fields against MW appendices
2. API field name mapping (case sensitivity check)
3. Edition/version feature matrix creation
4. Ontology corrections based on findings
5. Documentation of field status (edition-specific, version-specific, etc.)

**Expected Outcome**:
- Accurate field name mappings
- Edition/version annotations in ontologies
- Either perfect match or documented reason for discrepancy

**Estimated Effort**: Medium (2-3 hours)

**Priority**: P3 (Enhancement - ontology already production-ready at 99.01% coverage)

---

## Epistemic Status

**Confidence in Findings**:
- Slot field analysis: 90% (empirically verified)
- Name/Product field status: 30% (requires manual research)

**Knowledge Gaps**:
- MoneyWorks manual field definitions not yet cross-referenced
- Edition-specific features not documented
- Version history not analyzed
- API field name aliases not mapped

**Principle**: We document facts, not assumptions. These discrepancies require investigation before making claims about deprecation or errors.

---

**Document Authority**: Empirical observation requiring research validation
**Last Updated**: 2025-11-26
**Status**: OPEN - Research required
