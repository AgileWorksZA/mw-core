# Claude-2 Assignment: Transaction Entity Generation

## Your Mission
Generate a complete, semantic TypeScript definition for the MoneyWorks **Transaction** entity following the established pattern from the Name entity.

## Entity Details
- **Entity**: Transaction
- **Priority**: Critical (most complex entity - 100+ fields)
- **Complexity**: High (multiple transaction types, statuses, workflows)
- **Reference Pattern**: `generated/name.ts` (use this as your template)

## Source Materials

### Primary Documentation
- **Current API Definition**: `packages/api/src/types/interface/tables/transaction.ts`
- **Reference Implementation**: `generated/name.ts` (your template)
- **Schema Reference**: Look for transaction-related schemas in `packages/api/src/types/optimized/`

### Expected Documentation (when HTTrack completes)
- `mirror/manual/moneyworks_appendix_transactions.html`
- Use existing knowledge and API definitions to start

## Key Semantic Fields to Focus On

Based on MoneyWorks domain knowledge, the Transaction entity likely has these critical enums:

### Transaction Types
```typescript
export enum TransactionType {
  // Document these based on MoneyWorks transaction types
  // Common types: Invoice, Receipt, Payment, Journal, etc.
}
```

### Transaction Status
```typescript
export enum TransactionStatus {
  // Document workflow states
  // Common: Draft, Posted, Voided, etc.
}
```

### Approval Status
```typescript
export enum ApprovalStatus {
  // Multi-level approval workflow
}
```

## Deliverables

### 1. Create `generated/transaction.ts`
Follow the exact pattern from `generated/name.ts`:

1. **Header with documentation source**
2. **All semantic enums** for constrained fields
3. **Complete interface** with JSDoc comments
4. **Utility functions** (isPosted, isDraft, etc.)
5. **Validation functions** with constraints
6. **Query builder class** for transactions
7. **Type guards** for transaction states

### 2. Update `entity-mappings.yaml`
Add Transaction entity to the mappings:

```yaml
Transaction:
  description: "Financial transaction management"
  primary_definition: "packages/api/src/types/interface/tables/transaction.ts"
  status: "complete"
  last_updated: "2025-01-15"
  coverage: 100
  key_semantic_fields:
    Type:
      source_section: "Transaction type classification"
      enum_values: {...}
    Status:
      source_section: "Transaction status workflow"
      enum_values: {...}
```

## Quality Requirements

### Must Have
- [ ] **100% field coverage** from the source API definition
- [ ] **Semantic enums** for all constrained fields (no magic numbers)
- [ ] **Complete validation** with field size limits
- [ ] **Query builder** for type-safe transaction queries
- [ ] **Business logic helpers** (amount calculations, status checks)
- [ ] **JSDoc documentation** for every field

### Pattern Consistency
- [ ] Same structure as `generated/name.ts`
- [ ] Same naming conventions (PascalCase enums, camelCase functions)
- [ ] Same export pattern and organization
- [ ] Same level of documentation detail

## Special Considerations for Transactions

### Financial Fields
- Amount fields (Debit, Credit, Total, Tax, etc.)
- Currency handling
- Exchange rates
- Rounding precision

### Workflow States
- Draft → Posted → Reconciled
- Approval workflows
- Void/reversal handling

### References
- Links to Names (customers/suppliers)
- Account code references
- Document numbering

## Example Structure

```typescript
/**
 * MoneyWorks Transaction Entity - Generated from API Definition
 * Source: packages/api/src/types/interface/tables/transaction.ts
 */

// Semantic enums
export enum TransactionType { ... }
export enum TransactionStatus { ... }
export enum ApprovalStatus { ... }

// Main interface
export interface Transaction {
  // Universal fields
  SequenceNumber: number;
  LastModifiedTime: string;
  
  // Transaction core
  Type: TransactionType;
  Status: TransactionStatus;
  
  // Financial fields
  Total: number;
  TaxTotal: number;
  
  // ... all other fields
}

// Utility functions
export function isPosted(transaction: Transaction): boolean { ... }
export function isVoided(transaction: Transaction): boolean { ... }

// Validation
export function validateTransaction(transaction: Partial<Transaction>): ValidationResult { ... }

// Query builder
export class TransactionQueryBuilder { ... }
```

## Success Criteria

### Completion Checklist
- [ ] File created: `generated/transaction.ts`
- [ ] Entity mappings updated
- [ ] TypeScript compiles without errors
- [ ] All fields from source API included
- [ ] Semantic enums for constrained values
- [ ] Complete validation and query capabilities

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

**Begin when ready!** Use `generated/name.ts` as your blueprint and create the most comprehensive Transaction entity possible.

**Primary Claude will review and integrate your work into the overall system.** 