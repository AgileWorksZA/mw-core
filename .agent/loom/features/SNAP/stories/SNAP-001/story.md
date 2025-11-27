# SNAP-001: Snapshot & Diff System for Import Behavior Discovery

## Why (Root Motivation)

Enable reliable imports by empirically discovering MoneyWorks's internal data transformations rather than guessing at field values, auto-calculations, and side effects.

**5 Whys Analysis:**
1. Why? We need to reverse-engineer MoneyWorks import behavior
2. Why? MoneyWorks is a black box - we don't know what happens internally when records are created
3. Why? Imports fail silently or produce wrong data because we don't know auto-calculated fields, validations, and side effects
4. Why? We guess at field values instead of observing what MoneyWorks actually does
5. Root: **Enable reliable imports by empirically discovering MoneyWorks's internal data transformations rather than guessing**

## Description

Build CLI tooling to capture full MoneyWorks database state (snapshot) and compare states (diff) to empirically discover what MoneyWorks does internally for various operations.

### The Workflow:
1. Run `bun snapshot before-invoice`
2. Create an invoice manually in MoneyWorks Gold
3. Run `bun snapshot after-invoice`
4. Run `bun diff before-invoice after-invoice`
5. See exactly what MW changed internally
6. Try to replicate via import
7. Document findings in "action maps"

### Key Discoveries This Enables:
- What fields are auto-calculated by MoneyWorks
- What validations exist (by seeing what values are corrected)
- What side effects occur (e.g., creating a transaction updates account balances)
- What the correct field values should be for imports

## Acceptance Criteria

- [ ] **AC-001**: `bun snapshot <label>` exports all MoneyWorks tables to `.snapshots/<label>/<table>.json` files
- [ ] **AC-002**: `bun diff <before> <after>` outputs added records, modified records, and deleted records per table
- [ ] **AC-003**: Diff output identifies specific field changes within modified records (oldValue vs newValue)
- [ ] **AC-004**: Snapshot captures all available tables (TaxRate, Name, Account, Product, Transaction, Detail, etc.)
- [ ] **AC-005**: Action map `.md` file can be generated from diff showing what operation caused what changes
- [ ] **AC-006**: TypeScript compilation passes with zero errors (`bun run tsc --noEmit`)

## Weave Knowledge

**Patterns Applied:**
- `E:tsv-header-row-import-pattern` - Understanding import structure via exports
- `E:schema-driven-import-pattern` - Schema discovery for field ordering
- `E:layered-validation-pattern` - Discovering validation rules by observation
- `Π:evidence-based-ac-validation` - Evidence-based approach to understanding behavior

**Pain Points to Avoid:**
- `Q:tsv-no-headers` - TSV exports lack headers, need to use full object export

**Reference Implementation:**
Use existing export infrastructure in SmartMoneyWorksClient to fetch all tables in full object format.

## Complexity: Moderate

Requires:
- CLI script setup (2 commands)
- Table enumeration from TableRegistry
- JSON file I/O for snapshots
- Deep diff algorithm for comparison
- Markdown generation for action maps

Estimated: 4-6 hours

## Priority: High

This is foundational infrastructure for import development. Without understanding what MoneyWorks does internally, import development is guesswork.

## Notes

### Output Structure
```
.snapshots/
  before-invoice/
    TaxRate.json
    Name.json
    Account.json
    Transaction.json
    Detail.json
    ...
  after-invoice/
    TaxRate.json
    ...

.action-maps/
  invoice-creation.md
```

### Diff Output Format
```json
{
  "Transaction": {
    "added": [{ "SequenceNumber": 123, ... }],
    "modified": [{
      "key": 45,
      "changes": {
        "Balance": { "old": 1000, "new": 1500 }
      }
    }],
    "deleted": []
  },
  "Detail": {
    "added": [{ "SequenceNumber": 456, ... }],
    ...
  }
}
```
