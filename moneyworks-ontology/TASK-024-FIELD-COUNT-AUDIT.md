# TASK-024: Field Count Audit Results

**Date**: 2025-11-26
**Priority**: P0
**Status**: Audit Complete - Fixes Required

---

## Audit Results

**Command Run**:
```bash
cd generated/
grep -c 'fieldName:' moneyworks-*-canonical-ontology.ts
```

**Total Files**: 31 entity ontologies

---

## Field Count Comparison

| File | Actual Count | Header Claim | Status | Error |
|------|--------------|--------------|--------|-------|
| moneyworks-accounts-canonical-ontology.ts | 35 | 26 | ❌ WRONG | +35% |
| moneyworks-allocations-canonical-ontology.ts | 19 | ? | ⚠️ CHECK | - |
| moneyworks-assetcat-canonical-ontology.ts | 22 | ? | ⚠️ CHECK | - |
| moneyworks-assetlog-canonical-ontology.ts | 20 | ? | ⚠️ CHECK | - |
| moneyworks-assets-canonical-ontology.ts | 40 | ? | ⚠️ CHECK | - |
| moneyworks-build-records-canonical-ontology.ts | 8 | ? | ⚠️ CHECK | - |
| moneyworks-contacts-canonical-ontology.ts | 25 | Missing | ❌ MISSING | - |
| moneyworks-departments-canonical-ontology.ts | 11 | ? | ⚠️ CHECK | - |
| moneyworks-detail-canonical-ontology.ts | 45 | 44 | ❌ WRONG | +2% |
| moneyworks-filter-canonical-ontology.ts | 12 | 9 | ❌ WRONG | +33% |
| moneyworks-general-classifications-canonical-ontology.ts | 6 | ? | ⚠️ CHECK | - |
| moneyworks-inventory-canonical-ontology.ts | 9 | ? | ⚠️ CHECK | - |
| moneyworks-jobs-canonical-ontology.ts | 42 | ? | ⚠️ CHECK | - |
| moneyworks-jobsheet-canonical-ontology.ts | 32 | ? | ⚠️ CHECK | - |
| moneyworks-ledger-canonical-ontology.ts | 202 | ? | ⚠️ CHECK | - |
| moneyworks-link-canonical-ontology.ts | 6 | 9 | ❌ WRONG | -33% |
| moneyworks-lists-canonical-ontology.ts | 10 | 9 | ❌ WRONG | +11% |
| moneyworks-log-canonical-ontology.ts | 9 | ? | ⚠️ CHECK | - |
| moneyworks-login-canonical-ontology.ts | 29 | ? | ⚠️ CHECK | - |
| moneyworks-memo-canonical-ontology.ts | 8 | ? | ⚠️ CHECK | - |
| moneyworks-message-canonical-ontology.ts | 29 | 9 | ❌ WRONG | +222% |
| moneyworks-names-canonical-ontology.ts | 107 | 102 | ❌ WRONG | +5% |
| moneyworks-offledger-canonical-ontology.ts | 155 | ? | ⚠️ CHECK | - |
| moneyworks-payments-canonical-ontology.ts | 12 | ? | ⚠️ CHECK | - |
| moneyworks-products-canonical-ontology.ts | 75 | 75 | ✅ CORRECT | 0% |
| moneyworks-reconciliation-canonical-ontology.ts | 9 | ? | ⚠️ CHECK | - |
| moneyworks-stickies-canonical-ontology.ts | 10 | ? | ⚠️ CHECK | - |
| moneyworks-taxrates-canonical-ontology.ts | 30 | 9 | ❌ WRONG | +233% |
| moneyworks-transactions-canonical-ontology.ts | 111 | 65 | ❌ WRONG | +71% |
| moneyworks-user-canonical-ontology.ts | 11 | ? | ⚠️ CHECK | - |
| moneyworks-user2-canonical-ontology.ts | 33 | 2 | ❌ WRONG | +1550% |

---

## Critical Issues (P0)

### Confirmed Wrong (11 files)

1. **user2** - CRITICAL ERROR
   - Claimed: 2
   - Actual: 33
   - Error: +1550%
   - Impact: CRITICAL

2. **message** - CRITICAL ERROR
   - Claimed: 9
   - Actual: 29
   - Error: +222%
   - Impact: CRITICAL

3. **taxrates** - CRITICAL ERROR
   - Claimed: 9
   - Actual: 30
   - Error: +233%
   - Impact: CRITICAL

4. **transactions** - HIGH ERROR
   - Claimed: 65
   - Actual: 111
   - Error: +71%
   - Impact: HIGH

5. **accounts** - HIGH ERROR
   - Claimed: 26
   - Actual: 35
   - Error: +35%
   - Impact: HIGH

6. **filter** - HIGH ERROR
   - Claimed: 9
   - Actual: 12
   - Error: +33%
   - Impact: HIGH

7. **link** - HIGH ERROR
   - Claimed: 9
   - Actual: 6
   - Error: -33%
   - Impact: HIGH

8. **lists** - MEDIUM ERROR
   - Claimed: 9
   - Actual: 10
   - Error: +11%
   - Impact: MEDIUM

9. **names** - MEDIUM ERROR
   - Claimed: 102
   - Actual: 107
   - Error: +5%
   - Impact: MEDIUM

10. **detail** - LOW ERROR
    - Claimed: 44
    - Actual: 45
    - Error: +2%
    - Impact: LOW

11. **contacts** - MISSING HEADER
    - Claimed: (none)
    - Actual: 25
    - Impact: CRITICAL

### Needs Header Verification (19 files)

Need to check if these files have field count claims in headers:
- allocations, assetcat, assetlog, assets, build-records
- departments, general-classifications, inventory, jobs, jobsheet
- ledger, log, login, memo, offledger
- payments, reconciliation, stickies, user

---

## Remediation Tasks

### Task 1: Fix Critical Errors (6 files - 1 hour)

1. Update user2.ts header: 2 → 33
2. Update message.ts header: 9 → 29
3. Update taxrates.ts header: 9 → 30
4. Update transactions.ts header: 65 → 111
5. Update accounts.ts header: 26 → 35
6. Add contacts.ts header: Missing → 25

### Task 2: Fix High/Medium Errors (5 files - 30 min)

7. Update filter.ts header: 9 → 12
8. Update link.ts header: 9 → 6
9. Update lists.ts header: 9 → 10
10. Update names.ts header: 102 → 107
11. Update detail.ts header: 44 → 45

### Task 3: Verify and Add Headers (19 files - 1 hour)

Check each file for existing header claim, add if missing:
- Grep for "COVERAGE:" or "fields" in header comments
- If missing, add standard format: `COVERAGE: N fields`
- If present but wrong, update to actual count

### Task 4: Create Automated Validation (30 min)

Create script: `scripts/validate-field-counts.sh`

```bash
#!/bin/bash
# Validate field count headers match actual counts

cd generated/
errors=0

for f in moneyworks-*-canonical-ontology.ts; do
  actual=$(grep -c 'fieldName:' "$f")

  # Extract claimed count from header (if exists)
  claimed=$(grep -i "COVERAGE:" "$f" | head -1 | grep -oE '[0-9]+' | head -1)

  if [ -z "$claimed" ]; then
    echo "⚠️  $f: Missing field count header (actual: $actual)"
    errors=$((errors + 1))
  elif [ "$claimed" != "$actual" ]; then
    echo "❌ $f: Header claims $claimed, actual $actual"
    errors=$((errors + 1))
  fi
done

if [ $errors -eq 0 ]; then
  echo "✅ All field counts accurate!"
  exit 0
else
  echo "❌ Found $errors files with inaccurate field counts"
  exit 1
fi
```

---

## Acceptance Criteria

- [ ] All 31 files have "COVERAGE: N fields" header
- [ ] All headers match actual fieldName count (±0 tolerance)
- [ ] Validation script runs in CI and catches future errors
- [ ] No files with missing or inaccurate field count claims

---

## Estimated Time

- Task 1 (Critical): 1 hour
- Task 2 (High/Medium): 30 minutes
- Task 3 (Verification): 1 hour
- Task 4 (Automation): 30 minutes
- **Total**: 3 hours

---

## Notes

### Discrepancy in Names Entity

Names ontology shows 107 actual fields, but we recently claimed 102.

**Investigation needed**:
- Are there 5 duplicate field definitions?
- Did we count Slot field in some counts but not others?
- Check for fields defined multiple times

**Action**: Manual review of names-canonical-ontology.ts before updating header

### Products Entity - Already Correct

Products entity is the ONLY file with accurate header (75 = 75).
This was updated during Amendment 001. Use as template for others.

---

**Status**: Ready for execution
**Next Step**: Begin Task 1 (Fix critical errors)
