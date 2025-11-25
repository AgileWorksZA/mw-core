# IMPT-001: MoneyWorks Import Foundation - Create/Update Records via SDK

## Why (Root Motivation)

Enable bidirectional data sync by allowing applications to write back to MoneyWorks, completing the data integration story and enabling real business automation workflows.

**5 Whys Analysis:**
1. Why? -> "We need to create/update records in MoneyWorks from the SDK"
2. Why? -> "Applications need to sync data back after processing or user edits"
3. Why? -> "Manual data entry in MoneyWorks is slow and error-prone"
4. Why? -> "Business workflows require automation of accounting data entry"
5. Root: **Enable end-to-end business automation by completing bidirectional MoneyWorks integration**

## Description

Implement write operations to create and update records in MoneyWorks through the SDK. The export functionality already exists with field discovery, multiple formats, and repository patterns. This story adds the inverse: converting objects back to TSV format with correct field ordering and sending to MoneyWorks import endpoint.

**Scope:**
- Extend SmartMoneyWorksClient with smartImport() method
- Create BaseWriteRepository with create/update/upsert
- Add pre-write validation using canonical validators
- Expose POST endpoints via ElysiaJS API
- Parse and return detailed ImportResult

**Out of Scope:**
- UI components for import (future story)
- Batch import with progress tracking (future story)
- Transaction rollback/compensation (future story)

## Acceptance Criteria

- [ ] **AC-001**: SmartMoneyWorksClient has smartImport() method that converts objects to TSV with correct field ordering based on discovered schema
- [ ] **AC-002**: ImportOptions supports mode parameter (insert, update, replace) with proper MoneyWorks semantics
- [ ] **AC-003**: BaseWriteRepository class provides create(), update(), and upsert() methods with proper error handling
- [ ] **AC-004**: Pre-write validation using canonical field validators prevents invalid data from being sent to MoneyWorks
- [ ] **AC-005**: API exposes POST /api/v1/{table}/import endpoint with proper authentication and error responses
- [ ] **AC-006**: ImportResult type provides detailed feedback: processed, created, updated, errors count with errorDetails array
- [ ] **AC-007**: TypeScript compilation passes with zero errors after implementation

## Weave Knowledge

**Patterns Applied:**
- `E:multi-format-export-pattern` - Inverse pattern for import: convert multiple input formats to MW-compatible TSV
- `E:canonical-dsl-pattern` - Preserve exact MW field names in import payloads (GST not VAT, TaxCode not taxId)
- `E:branded-types-pattern` - Use branded types for import validation (YYYYMMDD dates, AccountCode, etc.)
- `E:field-discovery-pattern` - Use discovered field structure to order TSV columns correctly
- `E:9-step-entity-implementation-pattern` - Follow consistent implementation structure

**Pain Points to Avoid:**
- `Q:triple-export-registration-pain` - Remember to update all export locations when adding new types

**Best Practices:**
- `Pi:full-stack-story-pattern` - Include data layer + API layer in single story
- `Pi:evidence-based-validation` - Collect concrete evidence for each AC

## Reference Implementation

The existing export flow in `SmartMoneyWorksClient.smartExport()` provides the pattern:
1. Ensure field structure is discovered
2. Use field ordering from schema
3. Convert between formats (objects <-> arrays <-> TSV)

For import, we reverse this:
1. Ensure field structure is discovered
2. Validate input against canonical validators
3. Convert objects to TSV using field ordering from schema
4. POST to /import endpoint
5. Parse response into ImportResult

## Complexity: Complex
Estimated 1-3 days. Multiple layers (data + API), requires field ordering logic, validation integration, error handling.

## Priority: High
Core functionality that unlocks business automation use cases.

## Notes

- MoneyWorks REST import endpoint already exists (POST /import with table, mode params)
- Basic import() method exists in MoneyWorksRESTClient but lacks smart field ordering
- Field discovery cache from export can be reused for import field ordering
- Consider adding work_it_out and calculated params for auto-calculation of derived fields
