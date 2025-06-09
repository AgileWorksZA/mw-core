# Claude-4 Deployment Package: Ledger Entity Generation

## 🎯 Your Mission
You are Claude-4 in a parallel processing team generating MoneyWorks entities.
Generate a complete semantic TypeScript definition for the **Ledger** entity.

## 📋 Complete Assignment

### Entity Details
- **Entity**: Ledger
- **Priority**: High (general ledger is core to accounting)
- **Complexity**: High (80+ fields, GL integration, complex relationships)
- **Reference Pattern**: Use the Name entity pattern below as your template

### Key Semantic Fields to Focus On
Based on MoneyWorks domain knowledge, the Ledger entity likely has these critical enums:

```typescript
export enum LedgerEntryType {
  // Journal entries, automatic posts, etc.
}

export enum LedgerSource {
  // Source of entry: Manual, Transaction, System, etc.
}

export enum LedgerStatus {
  // Posted, Provisional, Reconciled, etc.
}

export enum PeriodStatus {
  // Open, Closed, Locked, etc.
}
```

### Deliverables Required
1. **Create `generated/ledger.ts`** following the exact pattern from Name entity
2. **Update entity-mappings.yaml** with Ledger entity details
3. **Include**: Header, semantic enums, complete interface, utility functions, validation, query builder

## 📖 Reference Implementation (Your Template)
Study this complete Name entity implementation as your pattern:

```typescript
/**
 * MoneyWorks Name Entity - Generated from Official Documentation
 * Source: https://secure.cognito.co.nz/manual/moneyworks_appendix_names.html
 * 
 * Represents customers, suppliers, and other name entities in MoneyWorks
 */

// ============================================================================
// ENUMS - Semantic Types from Documentation
// ============================================================================

/** Customer classification */
export enum CustomerType {
  /** Not a customer */
  NotCustomer = 0,
  /** Customer */
  Customer = 1,
  /** Debtor */
  Debtor = 2
}

/** Supplier classification */
export enum SupplierType {
  /** Not a supplier */
  NotSupplier = 0,
  /** Supplier */
  Supplier = 1,
  /** Creditor */
  Creditor = 2
}

/** Payment methods */
export enum PaymentMethod {
  None = 0,
  Cash = 1,
  Cheque = 2,
  Electronic = 3,
}

// ============================================================================
// MAIN INTERFACE
// ============================================================================

export interface Name {
  // Core identification fields
  /** Internal sequence number - unique identifier */
  SequenceNumber: number;
  
  /** Date and time the record was last modified */
  LastModifiedTime: string;
  
  /** The name code. For non-sundries, only the first ten characters are used. Max 11 chars. */
  Code: string;
  
  /** Name of company. Max 255 chars. */
  Name: string;

  // Customer/Supplier Classification
  /** Customer type: 0=not customer, 1=customer, 2=debtor */
  CustomerType: CustomerType;
  
  /** Supplier type: 0=not supplier, 1=supplier, 2=creditor */
  SupplierType: SupplierType;

  // [Additional fields continue following this pattern...]
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/** Check if a name is a customer */
export function isCustomer(name: Name): boolean {
  return name.CustomerType === CustomerType.Customer || name.CustomerType === CustomerType.Debtor;
}

/** Check if a name is a supplier */
export function isSupplier(name: Name): boolean {
  return name.SupplierType === SupplierType.Supplier || name.SupplierType === SupplierType.Creditor;
}

// ============================================================================
// VALIDATION
// ============================================================================

export interface ValidationError {
  field: string;
  message: string;
  value: any;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

/** Validate a Name object against MoneyWorks constraints */
export function validateName(name: Partial<Name>): ValidationResult {
  const errors: ValidationError[] = [];
  
  // Required fields
  if (!name.Code) {
    errors.push({ field: "Code", message: "Code is required", value: name.Code });
  }
  
  // Field length validations
  if (name.Code && name.Code.length > 11) {
    errors.push({ field: "Code", message: "Code cannot exceed 11 characters", value: name.Code });
  }
  
  return { isValid: errors.length === 0, errors };
}

// ============================================================================
// QUERY BUILDERS
// ============================================================================

export class NameQueryBuilder {
  private conditions: string[] = [];

  /** Filter by customer type */
  customerType(type: CustomerType): this {
    this.conditions.push(`CustomerType=${type}`);
    return this;
  }

  /** Filter by supplier type */
  supplierType(type: SupplierType): this {
    this.conditions.push(`SupplierType=${type}`);
    return this;
  }

  /** Build the search expression */
  build(): string {
    return this.conditions.join(" AND ");
  }
}
```

## 📁 Source API Definition
Use this as your primary source for field definitions:

```typescript
// Current Ledger interface from packages/api/src/types/interface/tables/ledger.ts
export interface Ledger {
  SequenceNumber: number;
  LastModifiedTime: string;
  
  AccountCode: string;
  Description: string;
  EntryType: string;
  Source: string;
  Status: string;
  
  DebitAmount: number;
  CreditAmount: number;
  
  Period: number;
  Year: number;
  
  TransactionRef: string;
  Reference: string;
  
  NameCode: string;
  JobCode: string;
  DepartmentCode: string;
  
  Currency: string;
  ExchangeRate: number;
  
  Date: string;
  
  UserCode: string;
  BatchNumber: number;
  
  UserText: string;
  TaggedText: string;
  
  // Many more fields exist - generate complete interface
}
```

## 🏗️ Current Entity Mappings Structure
Update this structure when you complete your entity:

```yaml
entities:
  Name:
    description: "Customer, supplier, and contact management entity"
    primary_definition: "mirror/manual/moneyworks_appendix_names.html"
    status: "complete"
    last_updated: "2025-01-15"
    coverage: 100

  # Add your Ledger entity here following this pattern
```

## ✅ Success Criteria Checklist
Before submitting your work, verify:

- [ ] Created `generated/ledger.ts` following Name entity pattern exactly
- [ ] All fields from source API definition included
- [ ] Semantic enums for all constrained fields (no magic numbers)
- [ ] Complete JSDoc documentation for every field
- [ ] Validation functions with proper constraints
- [ ] Query builder class for type-safe queries
- [ ] Utility functions for business logic (isPosted, isReconciled, getNetAmount, etc.)
- [ ] TypeScript compiles without errors
- [ ] Updated entity-mappings.yaml with your entity

## 🚀 Begin Immediately
Start working on the Ledger entity now. Follow the Name entity pattern exactly.
Create the most comprehensive Ledger entity possible with:

1. **Complete enum definitions** for EntryType, Source, Status, PeriodStatus
2. **Full interface** with all fields and JSDoc comments
3. **Utility functions** for accounting logic and entry classification
4. **Validation logic** with double-entry accounting constraints
5. **Query builder** for type-safe ledger queries

Focus on:
- **Double-Entry Accounting**: Debit and credit amounts, balancing
- **Audit Trail**: Entry source tracking, modification history
- **Period Management**: Month/year periods, period locking
- **Account Relationships**: Chart of accounts integration

Deliver your completed files when ready for integration review.

## 📞 Questions?
Add TODO comments in your generated file for any ambiguities.
Primary Claude will review and integrate your work. 