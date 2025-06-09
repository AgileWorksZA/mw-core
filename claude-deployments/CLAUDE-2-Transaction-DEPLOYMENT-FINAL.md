# Claude-2 Deployment Package: Transaction Entity Generation

## 🎯 Your Mission
You are Claude-2 in a parallel processing team generating MoneyWorks entities.
Generate a complete semantic TypeScript definition for the **Transaction** entity using **official MoneyWorks documentation**.

## 📋 Complete Assignment

### Entity Details
- **Entity**: Transaction
- **Priority**: Critical (most complex entity - 70+ fields)
- **Complexity**: High (multiple transaction types, statuses, workflows)
- **Reference Pattern**: Use the Name entity pattern below as your template

### 🌐 Official Documentation Access
**CRITICAL**: Access the official MoneyWorks field descriptions here:
- **Primary URL**: https://cognito.co.nz/manual/moneyworks_appendix_appendix_afield_descriptions.html
- **Search for**: "Transaction" table documentation
- **Backup search**: Use web_search tool to find MoneyWorks Transaction appendix

Use web_search like this:
```
web_search("site:cognito.co.nz transaction table fields appendix")
```

### Key Semantic Fields to Focus On
Based on XML examples found, these are REAL MoneyWorks transaction types:
```xml
<type>DII</type>  <!-- Definitely a real transaction type -->
<type>CR</type>   <!-- Customer Receipt -->
```

Focus on these critical enums:
```typescript
export enum TransactionType {
  DII = "DII",   // From XML example - find documentation meaning
  CR = "CR",     // Customer Receipt from XML example  
  // Add others from official documentation
}

export enum TransactionStatus {
  // Based on Status field (size="2") - find official values
}

export enum PaymentMethodType {
  // Based on PaymentMethod field (number) - find official values
}
```

## 📖 Reference Implementation (Your Template)
Follow this Name entity pattern exactly:

```typescript
/**
 * MoneyWorks Transaction Entity - Generated from Official Documentation
 * Source: https://cognito.co.nz/manual/moneyworks_appendix_appendix_afield_descriptions.html
 */

// ============================================================================
// ENUMS - Semantic Types from Official Documentation
// ============================================================================

/** Transaction types based on MoneyWorks documentation */
export enum TransactionType {
  /** [Document official meaning] */
  DII = "DII",
  /** Customer Receipt */
  CR = "CR",
  // Add all others from documentation
}

/** Transaction status workflow states */
export enum TransactionStatus {
  // Document all from official source
}

// ... more enums

// ============================================================================
// MAIN INTERFACE - All 70+ Fields with JSDoc
// ============================================================================

export interface Transaction {
  /** Internal sequence number - unique identifier */
  SequenceNumber: number;
  
  /** Date and time the record was last modified */
  LastModifiedTime: string;
  
  /** Transaction reference number. Max 12 chars. */
  OurRef: string;
  
  /** Transaction type from MoneyWorks documentation. Max 4 chars. */
  Type: TransactionType;
  
  /** Transaction status from workflow. Max 2 chars. */
  Status: TransactionStatus;
  
  /** Payment method type */
  PaymentMethod: PaymentMethodType;
  
  // ... include ALL 70+ fields with proper JSDoc from documentation
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/** Check if transaction is posted */
export function isPosted(transaction: Transaction): boolean {
  // Use real status values from documentation
  return transaction.Status === TransactionStatus.Posted;
}

/** Check if transaction is a receipt */
export function isReceipt(transaction: Transaction): boolean {
  return transaction.Type === TransactionType.CR;
}

// ============================================================================
// VALIDATION  
// ============================================================================

export function validateTransaction(transaction: Partial<Transaction>): ValidationResult {
  const errors: ValidationError[] = [];
  
  // Use EXACT size constraints from documentation
  if (transaction.OurRef && transaction.OurRef.length > 12) {
    errors.push({ field: "OurRef", message: "OurRef cannot exceed 12 characters", value: transaction.OurRef });
  }
  
  if (transaction.Type && transaction.Type.length > 4) {
    errors.push({ field: "Type", message: "Type cannot exceed 4 characters", value: transaction.Type });
  }
  
  return { isValid: errors.length === 0, errors };
}

// ============================================================================
// QUERY BUILDERS
// ============================================================================

export class TransactionQueryBuilder {
  private conditions: string[] = [];

  type(type: TransactionType): this {
    this.conditions.push(`Type="${type}"`);
    return this;
  }

  status(status: TransactionStatus): this {
    this.conditions.push(`Status="${status}"`);
    return this;
  }

  dateRange(from: string, to: string): this {
    this.conditions.push(`TransDate>="${from}" AND TransDate<="${to}"`);
    return this;
  }

  build(): string {
    return this.conditions.join(" AND ");
  }
}
```

## 📁 COMPLETE Source API Definition
Your TypeScript interface MUST cover all these fields from your codebase:

```typescript
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
```

## 🔍 Research Process
1. **Access official docs** using web_search with MoneyWorks site
2. **Find Transaction appendix** with complete field descriptions
3. **Document enum values** from official sources (not guessed)
4. **Extract business meanings** for each transaction type/status
5. **Map size constraints** exactly from documentation

## ✅ Success Criteria Checklist
Before submitting your work, verify:

- [ ] **Accessed official MoneyWorks documentation** via web_search
- [ ] **Found Transaction table appendix** with enum values
- [ ] **All 70+ fields included** with correct types from source interface
- [ ] **Semantic enums sourced from docs** (no guessed values)
- [ ] **Complete JSDoc documentation** with exact size constraints
- [ ] **Validation functions** with documented field limits
- [ ] **Query builder class** for type-safe transaction queries  
- [ ] **Utility functions** (isPosted, isDraft, isPaid, isOnHold)
- [ ] **TypeScript compiles** without errors
- [ ] **Generated file**: `generated/transaction.ts`

## 🚀 Begin Immediately
1. Use web_search to access MoneyWorks documentation
2. Find official Transaction field descriptions
3. Generate complete semantic TypeScript following Name pattern
4. Use only documented enum values (never guess)
5. Save as `generated/transaction.ts`

**Focus on business accuracy over speed. If documentation is unclear, add TODO comments rather than guessing values.** 