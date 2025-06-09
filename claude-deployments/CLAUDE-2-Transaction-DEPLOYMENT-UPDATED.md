# Claude-2 Deployment Package: Transaction Entity Generation

## 🎯 Your Mission
You are Claude-2 in a parallel processing team generating MoneyWorks entities.
Generate a complete semantic TypeScript definition for the **Transaction** entity.

## 📋 Complete Assignment

### Entity Details
- **Entity**: Transaction
- **Priority**: Critical (most complex entity - 70+ fields)
- **Complexity**: High (multiple transaction types, statuses, workflows)
- **Reference Pattern**: Use the Name entity pattern below as your template

### Key Semantic Fields to Focus On
Based on the source interface, focus on these critical enums:

```typescript
export enum TransactionType {
  // Based on Type field (size="4") - document transaction types
}

export enum TransactionStatus {
  // Based on Status field (size="2") - document workflow states
}

export enum PaymentMethodType {
  // Based on PaymentMethod field (number) - payment types
}

export enum SecurityLevelType {
  // Based on SecurityLevel field (number) - security levels
}
```

## 📖 Reference Implementation (Your Template)
Use this Name entity as your exact pattern (fix the validation function typo):

```typescript
/**
 * MoneyWorks Name Entity - Generated from Official Documentation
 * Source: https://secure.cognito.co.nz/manual/moneyworks_appendix_names.html
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
  /** Internal sequence number - unique identifier */
  SequenceNumber: number;
  
  /** Date and time the record was last modified */
  LastModifiedTime: string;
  
  /** The name code. Max 11 chars. */
  Code: string;
  
  /** Name of company. Max 255 chars. */
  Name: string;

  /** Customer type: 0=not customer, 1=customer, 2=debtor */
  CustomerType: CustomerType;
  
  /** Supplier type: 0=not supplier, 1=supplier, 2=creditor */
  SupplierType: SupplierType;

  // [Many more fields...]
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
  
  if (!name.Code) {
    errors.push({ field: "Code", message: "Code is required", value: name.Code });
  }
  
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

  customerType(type: CustomerType): this {
    this.conditions.push(`CustomerType=${type}`);
    return this;
  }

  build(): string {
    return this.conditions.join(" AND ");
  }
}
```

## 📁 COMPLETE Source API Definition
Use this COMPLETE interface as your source (this is the actual MoneyWorks Transaction entity):

```typescript
/**
 * Transaction table interface
 * file_num: 5
 */
export interface Transaction {
  /** @indexed */
  SequenceNumber: number;
  LastModifiedTime: string;
  /** @indexed @mutable="conditionally" size="12" */
  OurRef: string;
  /** @indexed @mutable="conditionally" */
  TransDate: string;
  /** @indexed */
  EnterDate: string;
  /** @mutable="conditionally" */
  DueDate: string;
  /** @indexed */
  Period: number;
  /** @indexed size="4" */
  Type: string;
  /** @mutable="freely, script-only" size="32" */
  TheirRef: string;
  /** @indexed size="12" */
  NameCode: string;
  /** @mutable="freely, script-only" size="6" */
  Flag: string;
  /** @mutable="conditionally" size="1024" */
  Description: string;
  Gross: number;
  /** @mutable="freely, script-only" size="10" */
  Analysis: string;
  /** size="8" */
  Contra: string;
  /** @mutable="conditionally" size="256" */
  ToFrom: string;
  /** @indexed size="2" */
  Status: string;
  /** @mutable="conditionally" */
  Hold: boolean;
  DatePaid: string;
  AmtPaid: number;
  PayAmount: number;
  Aging: number;
  TaxAmount: number;
  TaxCycle: number;
  Recurring: boolean;
  /** @mutable="freely, script-only" */
  Printed: number;
  Flags: number;
  TaxProcessed: number;
  /** @mutable="conditionally" size="6" */
  Salesperson: string;
  /** @mutable="conditionally" */
  Colour: number;
  BankJNSeq: number;
  PaymentMethod: number;
  TimePosted: string;
  /** @indexed */
  SecurityLevel: number;
  /** @mutable="freely, script-only" size="256" */
  User1: string;
  /** @mutable="freely, script-only" size="256" */
  User2: string;
  /** @mutable="freely, script-only" size="256" */
  User3: string;
  /** @mutable="freely, script-only" */
  PromptPaymentDate: string;
  PromptPaymentAmt: number;
  /** size="2" */
  ProdPriceCode: string;
  /** @mutable="conditionally" size="256" */
  MailingAddress: string;
  /** @mutable="conditionally" size="256" */
  DeliveryAddress: string;
  /** size="32" */
  FreightCode: string;
  FreightAmount: number;
  /** @mutable="freely, script-only" size="256" */
  FreightDetails: string;
  /** @mutable="freely, script-only" size="32" */
  SpecialBank: string;
  /** @mutable="freely, script-only" size="32" */
  SpecialBranch: string;
  /** @mutable="freely, script-only" size="32" */
  SpecialAccount: string;
  /** size="4" */
  Currency: string;
  ExchangeRate: number;
  /** size="4" */
  EnteredBy: string;
  /** size="4" */
  PostedBy: string;
  AmtWrittenOff: number;
  OrderTotal: number;
  OrderShipped: number;
  OrderDeposit: number;
  OriginatingOrderSeq: number;
  CurrencyTransferSeq: number;
  PromptPaymentTerms: number;
  PromptPaymentDisc: number;
  /** @mutable="conditionally, script-only" size="4" */
  ApprovedBy1: string;
  /** @mutable="conditionally, script-only" size="4" */
  ApprovedBy2: string;
  /** @mutable="freely, script-only" */
  UserNum: number;
  /** @mutable="freely, script-only" size="256" */
  UserText: string;
  /** @mutable="freely, script-only" size="16" */
  User4: string;
  /** @mutable="freely, script-only" size="16" */
  User5: string;
  /** @mutable="freely, script-only" size="16" */
  User6: string;
  /** @mutable="freely, script-only" size="16" */
  User7: string;
  /** @mutable="freely, script-only" size="16" */
  User8: string;
  /** @mutable="freely, script-only" size="256" */
  TaggedText: string;
  /** @mutable="freely, script-only" */
  Emailed: number;
  /** @mutable="freely, script-only" */
  Transferred: number;
}

export type TransactionField = keyof Transaction;
```

## ✅ Success Criteria Checklist
Before submitting your work, verify:

- [ ] Created `generated/transaction.ts` following Name entity pattern exactly
- [ ] All 70+ fields from source interface included with correct types
- [ ] Semantic enums for Type, Status, PaymentMethod, SecurityLevel (no magic numbers)
- [ ] Complete JSDoc documentation for every field with size constraints
- [ ] Validation functions with proper field length limits
- [ ] Query builder class for type-safe transaction queries  
- [ ] Utility functions (isPosted, isDraft, isPaid, isOnHold, etc.)
- [ ] TypeScript compiles without errors
- [ ] Fixed validation function typo (Partial<Name> not Partial<n>)

## 🚀 Begin Immediately
Create the most comprehensive Transaction entity possible. Focus on:

1. **Financial workflow enums** (Type, Status, approval levels)
2. **Complete field coverage** (all 70+ fields with annotations)
3. **Business logic helpers** (payment status, approval workflow)
4. **Validation with size limits** (use @size annotations)
5. **Type-safe query builders**

Generate `generated/transaction.ts` following the Name pattern exactly!

## 📞 Questions?
Add TODO comments for any ambiguities. Primary Claude will review your work. 