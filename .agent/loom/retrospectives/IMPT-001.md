# Retrospective: IMPT-001 - MoneyWorks Import Foundation

## Summary
- **Status**: Complete
- **Sessions**: 1
- **Duration**: 2025-11-25 (single session)
- **Complexity**: Complex (estimated) / Complex (actual)
- **Active ACs**: 7/7 passing
- **Deferred ACs**: 0
- **Cancelled ACs**: 0

## What Went Well

1. **Schema-driven TSV generation**: Leveraged existing field discovery infrastructure to automatically order fields correctly for MoneyWorks import
2. **Comprehensive type definitions**: ImportOptions and ImportResult types are well-documented with MoneyWorks-specific semantics
3. **Reusable validation layer**: import-validator.ts provides generic validators that work across all entities
4. **Consistent mode naming**: Adopted MoneyWorks terminology (insert/update/replace) maintaining canonical DSL purity
5. **Bulk operations**: Added bulkCreate() and bulkUpsert() methods leveraging same underlying import

## What Could Be Improved

1. **No integration tests**: Implementation relies on manual testing against MoneyWorks server
2. **Error mapping**: MoneyWorks error responses could use more structured parsing
3. **Retry logic**: No automatic retry for transient failures

## Key Decisions

### D-001: Use 'replace' as default import mode
- **What**: Changed default from 'insert' to 'replace' (upsert)
- **Why**: Most common use case is update-if-exists, create-if-not
- **Alternatives**: Keep 'insert' as default (safer but less convenient)
- **When**: 2025-11-25

### D-002: Match MoneyWorks REST API mode terminology
- **What**: Used insert/update/replace instead of create/update/createOrUpdate
- **Why**: Canonical DSL purity - exact MoneyWorks terms
- **Alternatives**: Generic CRUD terminology (create/update/upsert)
- **When**: 2025-11-25

## Learnings

### L-001: TSV import requires header row
MoneyWorks import expects field names in first row of TSV. The `recordsToOrderedTSV()` method automatically generates this header based on discovered schema.

### L-002: Field order matters for import
Unlike JSON where order is irrelevant, TSV column positions must match MoneyWorks field structure. Using schema discovery ensures correct ordering.

### L-003: Validation before send saves round trips
Pre-validating records client-side catches errors like invalid dates (must be YYYYMMDD) and string length issues before network call.

## Key Learnings Extracted (Weave)

| Dimension | Insight | Description |
|-----------|---------|-------------|
| **E (Epistemology)** | tsv-header-row-import-pattern | MW TSV *import* requires header row (unlike export which has no headers!) |
| **E** | schema-driven-import-pattern | Use field discovery to order TSV columns correctly |
| **E** | layered-validation-pattern | Client → Repository → MW validation layers |
| **Π (Praxeology)** | validate-before-import | Always validate before sending to MW |
| **Π** | use-replace-mode-default | 'replace' (upsert) avoids duplicate key errors |
| **M (Modality)** | *rejected: generic-crud-mode-terminology* | Use MW-native insert/update/replace instead |
| **D (Deontics)** | pre-import-validation-obligation | MUST validate field types before import |
| **Q (Qualia)** | import-workflow | Complete import flow documented |
| **Q** | repository-crud-workflow | Repository write method patterns |

> **Most Important Discovery**: TSV Header Row Asymmetry - MoneyWorks TSV *export* has NO headers, but TSV *import* REQUIRES a header row. This is a critical gotcha.

## Automation Opportunities

### Skills to Create

1. **Skill**: `moneyworks-import-testing`
   - **Purpose**: Test import operations against MoneyWorks server
   - **Trigger**: "When testing import/create/update functionality"
   - **Knowledge**: Test patterns for write operations, sample data generation
   - **Impact**: Saves ~20 min per test cycle

### Patterns to Codify

1. **Pattern**: Schema-driven data transformation
   - **Current**: Manual field ordering for each entity
   - **Future**: Always use discovered schema for field ordering
   - **Benefit**: Consistent, error-free TSV generation

2. **Pattern**: Layered validation approach
   - **Current**: Ad-hoc validation per endpoint
   - **Future**: import-validator provides reusable validators
   - **Benefit**: Consistent error messages, earlier failure detection

### Standalone Scripts

None needed - all automation fits within skill patterns.

## Weave Recommendations

### E (Epistemology) - Patterns
- `E:tsv-header-row-pattern`: MoneyWorks TSV import requires header row with field names
- `E:schema-driven-import-pattern`: Use discovered field structure for import ordering

### Q (Qualia) - Pain Points
- None encountered - implementation went smoothly

### Pi (Praxeology) - Best Practices
- `Pi:validate-before-import`: Always validate records before sending to MoneyWorks
- `Pi:use-replace-mode-default`: Upsert semantics are safer than insert-only

### M (Modality) - Decisions
- `M:moneyworks-mode-terminology`: Use exact MoneyWorks terms (insert/update/replace)
- `M:replace-as-default-mode`: Default to replace for better DX

## File Changes Summary

### New Files
- `packages/data/src/validators/import-validator.ts` - Validation utilities
- `packages/data/src/validators/index.ts` - Validator exports

### Modified Files
- `packages/data/src/client/types.ts` - ImportMode, ImportOptions, ImportResult, ImportErrorDetail
- `packages/data/src/client/moneyworks-smart-client.ts` - smartImport(), recordsToOrderedTSV(), valueToTSV()
- `packages/data/src/repositories/base.repository.ts` - create(), update(), upsert(), bulkCreate(), bulkUpsert()
- `packages/api/src/controllers/base-table.ts` - import() method
- `packages/api/src/routes/tables.ts` - POST /:table/import route
- `packages/api/src/schemas/table.ts` - TableImportBodySchema, ImportResultSchema
- `packages/data/src/index.ts` - Export validators
