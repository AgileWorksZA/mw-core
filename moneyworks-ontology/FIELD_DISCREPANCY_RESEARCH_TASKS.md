# MoneyWorks Ontology - Field Discrepancy Research Tasks

**Created**: 2025-11-26
**Status**: IN PROGRESS
**Goal**: Achieve 100% empirical coverage with verified confidence

---

## Executive Summary

**Total Discrepancies**: 11 fields across 7 entities
**Research Method**: Systematic manual appendix search + empirical schema verification
**Principle**: No assumptions - all claims must be verified against authoritative sources

---

## Discrepancy Breakdown

### Category 1: Slot System Fields (6 entities)

**Status**: ⚠️ VERIFICATION REQUIRED

| Entity | Ontology Count | Empirical Count | Discrepancy | Appendix File |
|--------|---------------|-----------------|-------------|---------------|
| Ledger | 201 | 200 | Slot (+1) | moneyworks_appendix_ledger.html |
| Detail | 44 | 43 | Slot (+1) | moneyworks_appendix_detail.html |
| TaxRate | 31 | 30 | Slot (+1) | moneyworks_appendix_taxrates.html |
| JobSheet | 33 | 32 | Slot (+1) | moneyworks_appendix_jobsheet.html |
| AssetCat | 23 | 22 | Slot (+1) | moneyworks_appendix_assetcat.html |
| Name | 107 | 102 | Slot (+1, +4 others) | moneyworks_appendix_names.html |

**Research Tasks**:
1. ✅ Verify Slot appears in empirical schema (already confirmed: YES)
2. ⏳ Search each appendix for "Slot" field documentation
3. ⏳ Determine if Slot is documented as "system field" or "internal use"
4. ⏳ Document whether Slot should be in business ontologies

**Hypothesis**: Slot is a legitimate database field present in all entities but marked as system/internal field in manual.

---

### Category 2: Name Entity Business Fields (4 fields)

**Status**: 🔴 HIGH PRIORITY RESEARCH

| Field Name | Hypothesis | Appendix Search | Empirical Check |
|------------|------------|-----------------|-----------------|
| `SalesPerson` | Casing mismatch? (vs "Salesperson") | moneyworks_appendix_names.html | Check empirical for "Salesperson" |
| `EInvoiceID` | E-invoicing feature (edition-specific?) | moneyworks_appendix_names.html | Not in MW Now v9.2.3 |
| `CustPropmtPaymentDiscount` | Typo: "Propmtpayment" → "PromptPayment"? | moneyworks_appendix_names.html | Check for variations |
| `SupplierPromptPaymentTerms` | Field consolidation or different name? | moneyworks_appendix_names.html | Check for related fields |

**Research Tasks**:
1. ⏳ Search `moneyworks_appendix_names.html` for exact field name matches
2. ⏳ Search for case variations (SalesPerson vs Salesperson)
3. ⏳ Search for partial matches (EInvoice, PromptPayment, etc.)
4. ⏳ Cross-reference empirical schema for similar field names
5. ⏳ Document MW edition requirements (Now vs Gold vs Enterprise)

**Critical**: These 4 fields were added in TASK-020 Phase 1 from empirical schema analysis. Need to verify source.

---

### Category 3: Product Entity Field (1 field)

**Status**: ⏳ MEDIUM PRIORITY

| Field Name | Hypothesis | Appendix Search | Empirical Check |
|------------|------------|-----------------|-----------------|
| `AverageValue` | Calculated field? Inventory costing? | moneyworks_appendix_products.html | Not in MW Now v9.2.3 |

**Research Tasks**:
1. ⏳ Search `moneyworks_appendix_products.html` for "AverageValue"
2. ⏳ Search for inventory costing related fields
3. ⏳ Check if field is calculated vs stored
4. ⏳ Determine if field exists in other MW editions

---

## Research Protocol

### Phase 1: Manual Appendix Search (CURRENT)

**Objective**: Find authoritative documentation for each discrepant field

**Method**:
1. Launch parallel subagents to search appendix files
2. Search for exact field name matches
3. Search for case-insensitive variations
4. Search for partial/related terms
5. Document ALL findings (even "not found")

**Appendix Files to Search**:
- `/Users/hjonck/Development/gitprojects/AgileWorksZA/mw-core/mirror/manual/manual/moneyworks_appendix_names.html`
- `/Users/hjonck/Development/gitprojects/AgileWorksZA/mw-core/mirror/manual/manual/moneyworks_appendix_products.html`
- `/Users/hjonck/Development/gitprojects/AgileWorksZA/mw-core/mirror/manual/manual/moneyworks_appendix_ledger.html`
- `/Users/hjonck/Development/gitprojects/AgileWorksZA/mw-core/mirror/manual/manual/moneyworks_appendix_detail.html`
- `/Users/hjonck/Development/gitprojects/AgileWorksZA/mw-core/mirror/manual/manual/moneyworks_appendix_taxrates.html`
- `/Users/hjonck/Development/gitprojects/AgileWorksZA/mw-core/mirror/manual/manual/moneyworks_appendix_jobsheet.html`
- `/Users/hjonck/Development/gitprojects/AgileWorksZA/mw-core/mirror/manual/manual/moneyworks_appendix_assetcat.html`

### Phase 2: Empirical Schema Cross-Reference

**Objective**: Verify exact field names in empirical data

**Method**:
1. Check `/Users/hjonck/Development/gitprojects/AgileWorksZA/ai_cfo_poc/mpoc/data/moneyworks-schemas/2025-11-25_full-schema_now.json`
2. Extract exact field names for each entity
3. Compare case-sensitive to ontology field names
4. Look for similar/related field names

### Phase 3: Resolution and Documentation

**Objective**: Resolve each discrepancy with verified evidence

**Possible Outcomes**:
1. **Field exists in manual** → Keep in ontology, mark as verified
2. **Field name typo** → Correct ontology field name
3. **Field name casing** → Correct ontology to match empirical
4. **Edition-specific** → Add edition annotation to ontology
5. **Calculated field** → Mark as calculated, not stored
6. **Not documented** → Escalate for discussion

---

## Research Task List

### Immediate Tasks (Parallel Execution)

**TASK-R1**: Search for Slot field across all appendices
- Subagent: Search 7 appendix files for "Slot" field
- Expected: System field documentation or internal use note
- Output: Findings per appendix file

**TASK-R2**: Search Name appendix for 4 business fields
- Subagent: Search `moneyworks_appendix_names.html`
- Fields: SalesPerson, EInvoiceID, CustPropmtPaymentDiscount, SupplierPromptPaymentTerms
- Method: Exact match + case variations + partial matches
- Output: Field documentation or "not found" status

**TASK-R3**: Search Product appendix for AverageValue
- Subagent: Search `moneyworks_appendix_products.html`
- Field: AverageValue
- Method: Exact match + inventory costing search
- Output: Field documentation or related fields

**TASK-R4**: Empirical schema field name extraction
- Subagent: Extract exact field names from empirical JSON
- Entities: Name, Product, Ledger, Detail, TaxRate, JobSheet, AssetCat
- Method: Case-sensitive field list extraction
- Output: Exact field names per entity for comparison

---

## Success Criteria

**100% Coverage Achieved When**:
1. ✅ All 11 discrepant fields researched against manual
2. ✅ All fields verified in empirical schema (exact names)
3. ✅ Resolution documented for each discrepancy
4. ✅ Ontology corrections applied (if needed)
5. ✅ All entities achieve perfect match OR discrepancy explained with evidence

**Target**: 31/31 perfect matches with verified confidence

---

## Current Status

**Phase**: 1 - Manual Appendix Search
**Progress**: 0/11 fields researched
**Subagents Deployed**: 0
**Next Action**: Launch parallel research subagents

---

**Last Updated**: 2025-11-26
**Research Lead**: Session 007 Agent
**Priority**: HIGH - Blocking 100% coverage goal
