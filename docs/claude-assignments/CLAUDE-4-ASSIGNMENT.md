# Claude-4 Assignment: Ledger Entity Generation

## Your Mission
Generate a complete, semantic TypeScript definition for the MoneyWorks **Ledger** entity following the established pattern from the Name entity.

## Entity Details
- **Entity**: Ledger
- **Priority**: High (general ledger is core to accounting)
- **Complexity**: High (80+ fields, GL integration, complex relationships)
- **Reference Pattern**: `generated/name.ts` (use this as your template)

## Source Materials

### Primary Documentation
- **Current API Definition**: `packages/api/src/types/interface/tables/ledger.ts`
- **Reference Implementation**: `generated/name.ts` (your template)
- **Schema Reference**: Look for ledger-related schemas in `packages/api/src/types/optimized/`

### Expected Documentation (when HTTrack completes)
- `mirror/manual/moneyworks_appendix_ledger.html`
- Use existing knowledge and API definitions to start

## Key Semantic Fields to Focus On

Based on MoneyWorks domain knowledge, the Ledger entity likely has these critical enums:

### Entry Types
```typescript
export enum LedgerEntryType {
  // Journal entries, automatic posts, etc.
}
```

### Entry Source
```typescript
export enum LedgerSource {
  // Source of entry: Manual, Transaction, System, etc.
}
```

### Entry Status
```typescript
export enum LedgerStatus {
  // Posted, Provisional, Reconciled, etc.
}
```

### Period Status
```typescript
export enum PeriodStatus {
  // Open, Closed, Locked, etc.
}
```

## Deliverables

### 1. Create `generated/ledger.ts`
Follow the exact pattern from `generated/name.ts`:

1. **Header with documentation source**
2. **All semantic enums** for constrained fields
3. **Complete interface** with JSDoc comments
4. **Utility functions** (isPosted, isReconciled, etc.)
5. **Validation functions** with constraints
6. **Query builder class** for ledger entries
7. **Type guards** for entry types

### 2. Update `entity-mappings.yaml`
Add Ledger entity to the mappings:

```yaml
Ledger:
  description: "General ledger entries and account balances"
  primary_definition: "packages/api/src/types/interface/tables/ledger.ts"
  status: "complete"
  last_updated: "2025-01-15"
  coverage: 100
  key_semantic_fields:
    EntryType:
      source_section: "Ledger entry type classification"
      enum_values: {...}
    Source:
      source_section: "Entry source system"
      enum_values: {...}
    Status:
      source_section: "Entry posting status"
      enum_values: {...}
```

## Quality Requirements

### Must Have
- [ ] **100% field coverage** from the source API definition
- [ ] **Semantic enums** for all constrained fields (no magic numbers)
- [ ] **Complete validation** with field size limits
- [ ] **Query builder** for type-safe ledger queries
- [ ] **Business logic helpers** (balance calculations, reconciliation)
- [ ] **JSDoc documentation** for every field

### Pattern Consistency
- [ ] Same structure as `generated/name.ts`
- [ ] Same naming conventions (PascalCase enums, camelCase functions)
- [ ] Same export pattern and organization
- [ ] Same level of documentation detail

## Special Considerations for Ledger

### Double-Entry Accounting
- Debit and credit amounts
- Account balancing
- Period tracking
- Currency handling

### Audit Trail
- Entry source tracking
- Modification history
- User attribution
- System stamps

### Period Management
- Month/year periods
- Period locking
- Year-end processing
- Comparative periods

### Account Relationships
- Chart of accounts integration
- Account hierarchies
- Department/job allocations
- Multi-dimensional analysis

## Example Structure

```typescript
/**
 * MoneyWorks Ledger Entity - Generated from API Definition
 * Source: packages/api/src/types/interface/tables/ledger.ts
 */

// Semantic enums
export enum LedgerEntryType { ... }
export enum LedgerSource { ... }
export enum LedgerStatus { ... }
export enum PeriodStatus { ... }

// Main interface
export interface Ledger {
  // Universal fields
  SequenceNumber: number;
  LastModifiedTime: string;
  
  // Ledger core
  AccountCode: string;
  Description: string;
  EntryType: LedgerEntryType;
  Source: LedgerSource;
  Status: LedgerStatus;
  
  // Financial amounts
  DebitAmount: number;
  CreditAmount: number;
  
  // Period tracking
  Period: number;
  Year: number;
  
  // ... all other fields
}

// Utility functions
export function isPosted(entry: Ledger): boolean { ... }
export function isReconciled(entry: Ledger): boolean { ... }
export function getNetAmount(entry: Ledger): number { ... }

// Validation
export function validateLedger(entry: Partial<Ledger>): ValidationResult { ... }

// Query builder
export class LedgerQueryBuilder { ... }
```

## Success Criteria

### Completion Checklist
- [ ] File created: `generated/ledger.ts`
- [ ] Entity mappings updated
- [ ] TypeScript compiles without errors
- [ ] All fields from source API included
- [ ] Semantic enums for constrained values
- [ ] Complete validation and query capabilities
- [ ] Accounting logic helpers implemented

## Timeline
- **Start**: Immediately after receiving this assignment
- **Target Completion**: 2-3 hours
- **Review**: Primary Claude will integrate and validate

## Questions/Issues
If you encounter any ambiguities or need clarification:
1. Add TODO comments in the generated file
2. Document assumptions you made
3. Note any fields that need additional research

---

**Begin when ready!** Use `generated/name.ts` as your blueprint and create the most comprehensive Ledger entity possible.

**Primary Claude will review and integrate your work into the overall system.** 