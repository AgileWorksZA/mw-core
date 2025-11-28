# TASK-025: Duplicate Field Definitions Report

**Date**: 2025-11-26
**Priority**: P1
**Status**: Investigation Complete - Fixes Required

---

## Overview

The coherence analysis identified 20 duplicate field definitions across multiple entity ontology files. This creates ambiguity about which definition is canonical.

---

## Confirmed Duplicates

### 1. allocations-canonical-ontology.ts (3 duplicates)

**Duplicates Found**:
- `LastModifiedTime` (appears 2 times)
- `MatchFunction` (appears 2 times)
- `Priority` (appears 2 times)

**Root Cause**: Fields defined in BOTH `MONEYWORKS_ALLOCATION_FIELDS` array AND `MONEYWORKS_ALLOCATION_BUSINESS_RULES` array

**Fix**: Remove field definitions from BUSINESS_RULES array (should contain rules only, not field definitions)

**Time**: 30 minutes

---

### 2. contacts-canonical-ontology.ts (suspected duplicates)

**Investigation Needed**: Coherence agent reported duplicates but audit found none with simple grep.

**Possible Causes**:
- Fields may be in different arrays (contacts vs embedded contact fields)
- Case sensitivity issues
- Comment-based duplication

**Action**: Manual review required

**Time**: 30 minutes

---

### 3. departments-canonical-ontology.ts (LastModifiedTime x3)

**Investigation Needed**: Coherence agent reported LastModifiedTime appears 3 times.

**Possible Causes**:
- May be in comments, not actual field definitions
- Multiple array declarations
- Template code not cleaned up

**Action**: Manual review required

**Time**: 15 minutes

---

### 4. memo-canonical-ontology.ts (LastModifiedTime x5)

**Investigation Needed**: Coherence agent reported LastModifiedTime appears 5 times.

**This is the MOST CRITICAL duplicate issue**.

**Action**: Manual review required - likely needs significant cleanup

**Time**: 45 minutes

---

## Remediation Strategy

### Phase 1: Fix Confirmed Duplicates (30 min)

1. **allocations-canonical-ontology.ts**:
   - Read file to locate BUSINESS_RULES array
   - Remove LastModifiedTime, MatchFunction, Priority from BUSINESS_RULES
   - Verify they exist in FIELDS array
   - Update field count header: 19 → 16 (if 3 removed)

### Phase 2: Manual Review (2 hours)

For each suspected file:
1. Read entire file
2. Grep for each suspected duplicate field
3. Identify all occurrences (array, comments, examples)
4. Determine canonical definition
5. Remove non-canonical instances
6. Update field count header
7. Document decision in commit message

### Phase 3: Validation (15 min)

Create validation script:

```bash
#!/bin/bash
# Check for duplicate fieldName within each file

for f in generated/moneyworks-*-canonical-ontology.ts; do
  dupes=$(grep 'fieldName:' "$f" | sort | uniq -d | wc -l | tr -d ' ')
  if [ "$dupes" != "0" ]; then
    echo "❌ $f has $dupes duplicate fieldName entries:"
    grep 'fieldName:' "$f" | sort | uniq -d
  fi
done
```

---

## Investigation Commands

### Find All Duplicates

```bash
cd generated/
for f in moneyworks-*-canonical-ontology.ts; do
  echo "=== $f ==="
  grep 'fieldName:' "$f" | sort | uniq -c | grep -v '^ *1 '
done > ../moneyworks-ontology/duplicate_fields_full_report.txt
```

### Check Specific File

```bash
grep -n 'fieldName: "LastModifiedTime"' moneyworks-memo-canonical-ontology.ts
```

---

## Acceptance Criteria

- [ ] Zero duplicate `fieldName:` entries within any single file
- [ ] All duplicates documented with reason for removal
- [ ] Field count headers updated after duplicate removal
- [ ] Validation script confirms no duplicates

---

## Estimated Time

- Phase 1 (Fix allocations): 30 minutes
- Phase 2 (Manual review 4 files): 2 hours
- Phase 3 (Validation): 15 minutes
- **Total**: 2 hours 45 minutes

---

## Priority Order

1. **allocations** (confirmed, easy fix)
2. **memo** (5 duplicates - highest impact)
3. **departments** (3 duplicates)
4. **contacts** (suspected, needs verification)

---

## Notes

### Why This Matters

Duplicate field definitions create:
- **Ambiguity**: Which definition is canonical?
- **Maintenance burden**: Updates must be made in multiple places
- **Type safety issues**: Code generators may produce incorrect types
- **Documentation confusion**: Users don't know which to trust

### BUSINESS_RULES Pattern Issue

The allocations file appears to have an architectural flaw:
- BUSINESS_RULES array should contain *rules*, not *field definitions*
- Mixing field definitions and rules creates confusion
- This pattern should not be replicated in other entities

**Recommendation**: Document pattern in ARCHITECTURE.md after fix

---

**Status**: Ready for execution
**Next Step**: Fix allocations duplicates, then manual review of memo
