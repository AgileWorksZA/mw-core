# Retrospective: SNAP-001 - Snapshot & Diff System for Import Behavior Discovery

## Summary
- **Status**: Complete
- **Duration**: 2025-11-25 (single session)
- **Complexity**: Moderate (estimated) / Moderate (actual)
- **Active ACs**: 6/6 passed
- **Deferred ACs**: 0
- **Cancelled ACs**: 0

## What Went Well

1. **Clean module structure** - Snapshot system organized into clear separation of concerns:
   - `types.ts` / `diff-types.ts` - Type definitions
   - `snapshot.ts` - Capture logic
   - `diff-engine.ts` - Comparison engine
   - `diff.ts` - CLI interface
   - `action-map.ts` - Documentation generation

2. **Primary key detection** - `getPrimaryKeyField()` correctly identifies table-specific PKs:
   - Code-based tables: TaxRate, Account, Job, Category1, Category2
   - SequenceNumber-based tables: Transaction, Detail, Name, Product

3. **Graceful error handling** - Unavailable tables (Category1, Category2, Contact) don't crash snapshot; errors reported at end

4. **Full workflow tested** - End-to-end testing with real MoneyWorks data (4929 records captured)

## What Could Be Improved

1. **TypeScript iteration** - Had to use `Array.from()` for Map iteration due to downlevelIteration issues
2. **Table availability** - Not all MoneyWorks files have all tables; needed graceful fallback

## Key Decisions

- **D-001**: Use for-loops with Array.from() for Map iteration
  - **What**: TypeScript downlevelIteration issues required converting Map.entries() to arrays
  - **Why**: Maintains compatibility without changing tsconfig
  - **When**: 2025-11-25T19:01:00Z

- **D-002**: Graceful handling of unavailable tables
  - **What**: Continue snapshot with available tables, report errors at end
  - **Why**: Different MW files have different tables enabled
  - **When**: 2025-11-25T19:01:00Z

## Learnings

- **L-001 (pattern)**: getPrimaryKeyField() pattern identifies correct PK per table type
- **L-002 (technique)**: Bun.file().exists() and Bun.write() provide clean async file operations

## Automation Opportunities

### Skills to Create

- **Skill**: `moneyworks-behavior-discovery`
  - **Purpose**: Guide agents through snapshot/diff workflow for discovering MW behavior
  - **Trigger**: "When investigating what MoneyWorks does for operation X"
  - **Knowledge**: Workflow steps, snapshot location conventions, diff interpretation
  - **Impact**: Saves research time when developing imports

### Patterns to Codify

- **Pattern**: Table-specific primary key detection
  - **Current**: Manual check of table type
  - **Future**: Centralize in TableRegistry metadata
  - **Benefit**: Consistent PK resolution across all table operations

## Weave Recommendations

### Epistemology (E)
- `snapshot-diff-discovery-pattern`: Empirical behavior discovery through before/after state comparison

### Praxeology (Praxis)
- `graceful-table-iteration`: Continue processing when individual tables fail, report at end
- `primary-key-detection`: Table-type-aware primary key resolution

### Qualia (Q)
- `typescript-map-iteration`: Map.entries() requires Array.from() wrapper for TypeScript compatibility
