# Ontology Validation Report

**Date**: 2025-01-25
**Validators**: 3 parallel subagents
**Source**: `generated/moneyworks-*-canonical-ontology.ts`

## Executive Summary

| Category | Status | Verified | Discrepancies | Missing |
|----------|--------|----------|---------------|---------|
| **Enumerations** | ✅ PASS | 34/34 | 0 | 0 |
| **Flags** | ✅ PASS | 48/48 | 0 | 0 |
| **Foreign Keys** | ⚠️ ISSUES | 12/54 | 8 | 28 |

**Overall**: Enumerations and flags are fully validated. FK registry requires correction.

---

## 1. Enumeration Validation: ✅ PASS

### Transaction Types (17/17 verified)
All 17 transaction type codes match source exactly:
- DII, DIC, CR, CRD, CRC, CII, CIC, CP, CPC, CPD, JN, JNS, SOI, SOC, POI, POC, QU

### Account Types (10/10 verified)
All 10 primary account types match source exactly:
- IN, SA, EX, CS, CA, FA, TA, CL, TL, SF

### System Account Types (7/7 verified)
All 7 system account types match source exactly:
- BK, AR, AP, GR, GP, PL, "  " (Ordinary)

**Conclusion**: Enumeration files are accurate. No corrections needed.

---

## 2. Flag Validation: ✅ PASS

### Transaction Flags (23/23 verified)
All bit positions and names match source:
- 0x00000001 through 0x08000000

### Detail Flags (15/15 verified)
All bit positions and names match source:
- 0x0001 through 0x8000

### Detail More Flags (3/3 verified)
All bit positions and names match source:
- 0x0001 REQUIRES_SERIAL_NUMBER
- 0x0002 REQUIRES_BATCH_NUMBER
- 0x0004 BATCH_EXPIRES

### Account Flags (6/6 verified)
All bit positions and names match source:
- 0x0001 through 0x8000

### Name Flags (1/1 verified)
- 0x0001 REQUIRES_ORDER_NUMBER

**Conclusion**: Flag file is accurate. No corrections needed.

---

## 3. Foreign Key Validation: ⚠️ ISSUES FOUND

### Summary
- **Total FKs in YAML**: 54
- **Verified**: 12 (22%)
- **Discrepancies**: 8 (15%)
- **Not Found/Invalid**: 28 (52%)
- **Need Review**: 6 (11%)

### Critical Discrepancies Requiring Fix

| YAML Field | YAML Target | Source Target | Action |
|------------|-------------|---------------|--------|
| Detail.ParentSeq | Transactions.SequenceNumber | Transaction.SequenceNumber | Fix: remove 's' |
| Detail.TaxCode | TaxRates.Code | TaxRates.TaxCode | Fix: use .TaxCode |
| Detail.Statement | Reconciliation.Seq | Reconciliation.SequenceNumber | Fix: use .SequenceNumber |
| Accounts.Category | GeneralClassifications.Code | General.Code | Fix: use General |
| Accounts.Group | GeneralClassifications.Code | General.Code | Fix: use General |
| TaxRates.CollectAccount | Accounts.Code | RecAccount | Fix: rename to RecAccount |
| TaxRates.PayAccount | Accounts.Code | PaidAccount | Fix: rename to PaidAccount |

### Field Name Mismatches (YAML vs Source)

| YAML Field | Actual Source Field |
|------------|---------------------|
| Jobs.DebtorCode | Jobs.Client |
| Jobs.ParentCode | Jobs.Project |
| Detail.AcctCode | Detail.Account |
| Assets.DepartmentCode | Assets.Dept |

### Fields Not Found in Source
Many FK fields listed in YAML do not have `relationshipTarget` defined in source:
- Names.RecAccount, Names.PayAccount (fields exist, no relationshipTarget)
- Names.DefaultTax, Names.DefaultTax2, Names.SalespersonCode (fields don't exist)
- Products.TaxCode, Products.AssetAccount, etc. (fields don't exist as named)
- Allocations.SourceAccount, TargetAccount1-4 (completely different structure)

### Recommendation

The FK registry was constructed based on semantic understanding but needs reconciliation with actual `relationshipTarget` properties in the canonical ontology files. Options:

1. **Update YAML to match source** - Use exact field names from source
2. **Update source to add relationshipTarget** - Add missing relationship metadata
3. **Hybrid** - Document known relationships even without relationshipTarget

---

## 4. Action Items

### Immediate (High Priority)
- [ ] Fix 8 discrepancies in FK registry (wrong target names)
- [ ] Rename mismatched field names (DebtorCode→Client, etc.)
- [ ] Update entity reference (GeneralClassifications→General)

### Medium Priority
- [ ] Review 28 FK entries that couldn't be verified
- [ ] Decide: Add relationshipTarget to source OR remove from YAML
- [ ] Document Allocations entity structure correctly

### Low Priority
- [ ] Add validation automation script
- [ ] Create CI check for ontology drift

---

## 5. Validation Methodology

### Process Used
1. Subagent 1: Compared FK YAML against all canonical TS files
2. Subagent 2: Compared enumeration YAML against TS enum definitions
3. Subagent 3: Compared flag YAML against TS flag enums

### Verification Criteria
- Field name exact match
- Target entity/field exists in source
- Hex values for flags match exactly
- Enum codes match exactly

### Limitations
- Some source files don't have `relationshipTarget` on all FK fields
- Relationship semantics may be correct even if not in source metadata
- Manual verification against MoneyWorks manual may be needed

---

## 6. Confidence Assessment

| Component | Confidence | Basis |
|-----------|------------|-------|
| Transaction Types | 100% | All codes verified |
| Account Types | 100% | All codes verified |
| All Flags | 100% | All bits verified |
| FK Registry | 22% | Only 12 of 54 verified |

**Next Step**: Fix FK discrepancies before using ontology in production.
