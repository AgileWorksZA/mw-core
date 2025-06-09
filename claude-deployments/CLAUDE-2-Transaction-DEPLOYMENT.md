# Claude-2 Deployment Package: Transaction Entity Generation

## 🎯 Your Mission
You are Claude-2 in a parallel processing team generating MoneyWorks entities.
Generate a complete semantic TypeScript definition for the **Transaction** entity.

## 📋 Complete Assignment

### Entity Details
- **Entity**: Transaction
- **Priority**: Critical (most complex entity - 100+ fields)
- **Complexity**: High (multiple transaction types, statuses, workflows)
- **Reference Pattern**: Use the Name entity pattern below as your template

### Key Semantic Fields to Focus On
Based on MoneyWorks domain knowledge, the Transaction entity likely has these critical enums:

```typescript
export enum TransactionType {
  // Document these based on MoneyWorks transaction types
  // Common types: Invoice, Receipt, Payment, Journal, etc.
}

export enum TransactionStatus {
  // Document workflow states
  // Common: Draft, Posted, Voided, etc.
}

export enum ApprovalStatus {
  // Multi-level approval workflow
}
```

### Deliverables Required
1. **Create `generated/transaction.ts`** following the exact pattern from Name entity
2. **Update entity-mappings.yaml** with Transaction entity details
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

/** Name record type */
export enum NameKind {
  /** Template record */
  Template = 0,
  /** Normal record */
  Normal = 1
}

/** Payment methods */
export enum PaymentMethod {
  None = 0,
  Cash = 1,
  Cheque = 2,
  Electronic = 3,
  // Additional methods may exist - documentation indicates "etc"
}

/** Product pricing levels for customers */
export enum ProductPricingLevel {
  A = "A",
  B = "B", 
  C = "C",
  D = "D",
  E = "E",
  F = "F"
}

/** Name flags - bit-mapped field */
export enum NameFlags {
  /** Requires order number */
  RequiresOrderNumber = 0x0001
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
  
  /** The kind of Name. 0 for a template, 1 for a normal */
  Kind: NameKind;

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
  // Validation logic here
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

  /** Build the search expression */
  build(): string {
    return this.conditions.join(" AND ");
  }
}
```

## 📁 Source API Definition
Use this as your primary source for field definitions:

```typescript
// Current Transaction interface from packages/api/src/types/interface/tables/transaction.ts
export interface Transaction {
  SequenceNumber: number;
  LastModifiedTime: string;
  
  Type: string;
  Status: string;
  Reference: string;
  
  NameCode: string;
  AccountCode: string;
  Description: string;
  
  Amount: number;
  TaxAmount: number;
  Total: number;
  
  Currency: string;
  ExchangeRate: number;
  
  Date: string;
  DueDate: string;
  
  Terms: number;
  Discount: number;
  
  Hold: boolean;
  Posted: boolean;
  
  ApprovedBy1: string;
  ApprovedBy2: string;
  
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

  # Add your Transaction entity here following this pattern
```

## ✅ Success Criteria Checklist
Before submitting your work, verify:

- [ ] Created `generated/transaction.ts` following Name entity pattern exactly
- [ ] All fields from source API definition included
- [ ] Semantic enums for all constrained fields (no magic numbers)
- [ ] Complete JSDoc documentation for every field
- [ ] Validation functions with proper constraints
- [ ] Query builder class for type-safe queries
- [ ] Utility functions for business logic (isPosted, isDraft, etc.)
- [ ] TypeScript compiles without errors
- [ ] Updated entity-mappings.yaml with your entity

## 🚀 Begin Immediately
Start working on the Transaction entity now. Follow the Name entity pattern exactly.
Create the most comprehensive Transaction entity possible with:

1. **Complete enum definitions** for Type, Status, ApprovalStatus
2. **Full interface** with all fields and JSDoc comments
3. **Utility functions** for transaction state checking
4. **Validation logic** with financial constraints
5. **Query builder** for type-safe transaction queries

Deliver your completed files when ready for integration review.

## 📞 Questions?
Add TODO comments in your generated file for any ambiguities.
Primary Claude will review and integrate your work.
