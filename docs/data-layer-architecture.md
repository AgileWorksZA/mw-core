# MoneyWorks Data Layer Architecture

## Overview

This document defines the data layer architecture for MoneyWorks Core, establishing how we preserve MoneyWorks DSL purity while providing clean data access patterns.

## Key Principle: Preserving MoneyWorks DSL

The core insight from our analysis: **using strings instead of enums for MoneyWorks types is a symptom of DSL contamination**. 

### Why Enums Matter

1. **Type Safety**: Enums provide compile-time validation of MW values
2. **DSL Preservation**: Enums are the canonical representation of MW's fixed vocabularies
3. **Contamination Prevention**: String types allow arbitrary values that can pollute the DSL
4. **Documentation**: Enums serve as living documentation of valid MW values

## MoneyWorks Date Types with Enhanced DX

MoneyWorks uses specific date formats that require special handling. We now have tagged template literals for superior developer experience:

### Tagged Template Literals for Dates

```typescript
import { d, p } from '@moneyworks/utilities';

// Creating dates with tagged template literals
const invoiceDate = d`20250118`;           // Direct YYYYMMDD
const dueDate = d`${new Date()}`;          // From Date object
const parsed = d`2025-01-18`;              // Auto-parses ISO format

// Dates now have methods!
if (dueDate.gt(invoiceDate)) {
  console.log('Due date is after invoice date');
}

const nextMonth = invoiceDate.addMonths(1);
const daysDiff = dueDate.subtract(invoiceDate);
const formatted = invoiceDate.format('-');  // "2025-01-18"

// Period handling
const currentPeriod = p`202501`;
const periodFromDate = p`${new Date()}`;
```

### Branded Types for Type Safety

```typescript
import { YYYYMMDD, Period, AccountCode, NameCode, TransactionSeq } from '@moneyworks/utilities';

// These branded types prevent accidental misuse:
// - YYYYMMDD: "20250118" format for dates (with methods via d`` literal)
// - Period: 202501 format for year/month periods (via p`` literal)
// - AccountCode, NameCode: Prevent mixing different code types
// - TransactionSeq: Type-safe transaction sequence numbers
```

## Data Layer Structure

### 1. Pure MoneyWorks Types (Data Transfer Objects)

Located in: `/packages/core/src/data/moneyworks/types/`

```typescript
// Import canonical enums from pure MW layer
import { 
  MoneyWorksTransactionType, 
  MoneyWorksTransactionStatus,
  MoneyWorksPaymentMethod 
} from '../../../canonical/moneyworks-canonical-ontology';

// Import branded types and tagged literals
import { YYYYMMDD, Period, NameCode, TransactionSeq, d, p } from '@moneyworks/utilities';

// Example MoneyWorks Transaction with exact field preservation
export interface MWTransaction {
  Type: MoneyWorksTransactionType;    // Use enum, not string!
  Status: MoneyWorksTransactionStatus; // Use enum, not string!
  NameCode: NameCode;                  // Branded type for name codes
  TransDate: YYYYMMDD;                 // Branded type for MW dates
  Total: number;
  DueDate: YYYYMMDD;
  OurRef: string;
  TheirRef: string;
  Description: string;
  PaymentMethod: MoneyWorksPaymentMethod; // Enum for payment methods
  Period: Period;                         // Branded type for periods
  SequenceNumber: TransactionSeq;         // Branded type for sequence
  // ... all other MW fields with exact casing
}

// MoneyWorks Name (Contact) with exact fields
export interface MWName {
  Type: MoneyWorksNameType;      // Enum: "C", "S", etc.
  Code: NameCode;                // Branded type for codes
  Name: string;
  CustomerType: 0 | 1 | 2;       // Literal type for MW's specific values
  SupplierType: 0 | 1 | 2;       // Literal type for MW's specific values
  Address1: string;
  Address2: string;
  Address3: string;
  Address4: string;
  // ... all other MW fields
}
```

### 2. Repository Layer

Located in: `/packages/core/src/data/repositories/`

```typescript
import { d, p } from '@moneyworks/utilities';

// MoneyWorks Transaction Repository
export class MoneyWorksTransactionRepository {
  constructor(private readonly client: MoneyWorksRestClient) {}

  /**
   * Fetch transactions using MW query language
   * @param query MoneyWorks query string (e.g., "Type='DII' AND Status='U'")
   */
  async find(query: string): Promise<MWTransaction[]> {
    const response = await this.client.get('/transaction', { query });
    // Parse MW date strings to branded types with methods
    return response.data.map(this.parseMWTransaction);
  }

  /**
   * Get transactions between dates using enhanced date methods
   */
  async findBetweenDates(startDate: YYYYMMDD, endDate: YYYYMMDD): Promise<MWTransaction[]> {
    const query = `TransDate>='${startDate}' AND TransDate<='${endDate}'`;
    return this.find(query);
  }

  /**
   * Create transaction with MW validation
   */
  async create(transaction: MWTransaction): Promise<MWTransaction> {
    // Branded types automatically coerce to strings when needed
    const response = await this.client.post('/transaction', transaction);
    return this.parseMWTransaction(response.data);
  }

  private parseMWTransaction(raw: any): MWTransaction {
    return {
      ...raw,
      // Use tagged template literals for enhanced dates
      TransDate: d`${raw.TransDate}`,
      DueDate: d`${raw.DueDate}`,
      Period: p`${raw.Period}`,
      SequenceNumber: raw.SequenceNumber as TransactionSeq,
      NameCode: raw.NameCode as NameCode
    };
  }
}
```

### 3. Translation Layer

Located in: `/packages/core/src/data/translators/`

```typescript
import { MWTransaction, MWName } from '../moneyworks/types';
import { BusinessInvoice, BusinessContact } from '../../domain/types';
import { d } from '@moneyworks/utilities';

export class TransactionTranslator {
  /**
   * Translate MW transaction to business domain
   * CRITICAL: This is the ONLY place where MW enums are interpreted
   */
  toBusinessInvoice(mw: MWTransaction): BusinessInvoice {
    return {
      id: mw.SequenceNumber,
      type: this.translateTransactionType(mw.Type),
      status: this.translateStatus(mw.Status),
      customer: mw.NameCode,
      amount: mw.Total,
      // Enhanced date objects have toDate() method
      dueDate: mw.DueDate.toDate(),
      transactionDate: mw.TransDate.toDate(),
      reference: mw.OurRef,
      description: mw.Description,
      // Calculate aging using date methods
      daysOverdue: mw.DueDate.lt(d`${new Date()}`) 
        ? d`${new Date()}`.subtract(mw.DueDate)
        : 0,
      // Preserve MW reference for round-trip accuracy
      _mw: {
        type: mw.Type,  // Original enum value preserved
        status: mw.Status,
        period: mw.Period  // Preserve period for MW reporting
      }
    };
  }

  /**
   * Translate business invoice back to MW
   * Uses preserved enum values for accuracy
   */
  toMoneyWorks(invoice: BusinessInvoice): MWTransaction {
    return {
      Type: invoice._mw.type,  // Use preserved enum value
      Status: invoice._mw.status,  // Use preserved enum value
      NameCode: invoice.customer,
      Total: invoice.amount,
      // Convert JS Date using tagged template literal
      DueDate: d`${invoice.dueDate}`,
      TransDate: d`${invoice.transactionDate}`,
      OurRef: invoice.reference,
      Description: invoice.description,
      Period: invoice._mw.period,  // Preserve MW period
      // ... other required MW fields
    };
  }

  private translateTransactionType(mwType: MoneyWorksTransactionType): string {
    // This is where we map MW enums to business terms
    switch(mwType) {
      case MoneyWorksTransactionType.DEBTOR_INVOICE_INCOMPLETE:
        return 'customer_invoice';
      case MoneyWorksTransactionType.CREDITOR_INVOICE_INCOMPLETE:
        return 'supplier_invoice';
      // ... etc
    }
  }
}
```

### 4. Service Layer

Located in: `/packages/core/src/services/`

```typescript
import { d, p } from '@moneyworks/utilities';

export class InvoiceService {
  constructor(
    private readonly mwRepo: MoneyWorksTransactionRepository,
    private readonly translator: TransactionTranslator
  ) {}

  /**
   * Business-friendly invoice operations
   */
  async getUnpaidCustomerInvoices(): Promise<BusinessInvoice[]> {
    // Use MW enums in queries for type safety
    const query = `Type='${MoneyWorksTransactionType.DEBTOR_INVOICE_INCOMPLETE}' AND Status='${MoneyWorksTransactionStatus.POSTED}'`;
    
    const mwTransactions = await this.mwRepo.find(query);
    return mwTransactions.map(t => this.translator.toBusinessInvoice(t));
  }

  /**
   * Get overdue invoices using enhanced date methods
   */
  async getOverdueInvoices(): Promise<BusinessInvoice[]> {
    const today = d`${new Date()}`;
    const query = `Type='${MoneyWorksTransactionType.DEBTOR_INVOICE_INCOMPLETE}' AND Status='${MoneyWorksTransactionStatus.POSTED}' AND DueDate<'${today}'`;
    
    const mwTransactions = await this.mwRepo.find(query);
    return mwTransactions
      .map(t => this.translator.toBusinessInvoice(t))
      .sort((a, b) => b.daysOverdue - a.daysOverdue);  // Most overdue first
  }

  /**
   * Get invoices for current period
   */
  async getCurrentPeriodInvoices(): Promise<BusinessInvoice[]> {
    const currentPeriod = p`${new Date()}`;
    const query = `Period=${currentPeriod} AND Type='${MoneyWorksTransactionType.DEBTOR_INVOICE_INCOMPLETE}'`;
    
    const mwTransactions = await this.mwRepo.find(query);
    return mwTransactions.map(t => this.translator.toBusinessInvoice(t));
  }

  async createInvoice(invoice: CreateInvoiceRequest): Promise<BusinessInvoice> {
    // Build MW transaction with proper enums and enhanced dates
    const invoiceDate = d`${new Date()}`;
    const dueDate = invoiceDate.addDays(invoice.paymentTermsDays);
    
    const mwTransaction: MWTransaction = {
      Type: MoneyWorksTransactionType.DEBTOR_INVOICE_INCOMPLETE,
      Status: MoneyWorksTransactionStatus.UNPOSTED,
      TransDate: invoiceDate,
      DueDate: dueDate,
      Period: p`${invoiceDate.toDate()}`,  // Convert date to period
      NameCode: invoice.customerCode as NameCode,
      // ... map other fields
    };

    const created = await this.mwRepo.create(mwTransaction);
    return this.translator.toBusinessInvoice(created);
  }

  /**
   * Example of complex date logic with enhanced methods
   */
  async getAgedReceivables(): Promise<AgedReceivablesReport> {
    const today = d`${new Date()}`;
    const invoices = await this.getUnpaidCustomerInvoices();
    
    return {
      current: invoices.filter(inv => d`${inv.dueDate}`.gte(today)),
      days30: invoices.filter(inv => {
        const due = d`${inv.dueDate}`;
        return due.lt(today) && due.gte(today.addDays(-30));
      }),
      days60: invoices.filter(inv => {
        const due = d`${inv.dueDate}`;
        return due.lt(today.addDays(-30)) && due.gte(today.addDays(-60));
      }),
      days90: invoices.filter(inv => {
        const due = d`${inv.dueDate}`;
        return due.lt(today.addDays(-60)) && due.gte(today.addDays(-90));
      }),
      over90: invoices.filter(inv => d`${inv.dueDate}`.lt(today.addDays(-90)))
    };
  }
}
```

## Anti-Patterns to Avoid

### 1. String Types for MW Enums ❌
```typescript
// WRONG - This is contamination!
interface MWTransaction {
  Type: string;  // Allows any value, not just MW types
}
```

### 2. Unbranded Date Strings ❌
```typescript
// WRONG - No type safety for dates
interface MWTransaction {
  TransDate: string;  // Could be any format!
  DueDate: string;    // No validation
}
```

### 3. Manual Date Parsing ❌
```typescript
// WRONG - Error-prone date manipulation
const year = parseInt(dateStr.substring(0, 4));
const month = parseInt(dateStr.substring(4, 6));
// ... manual parsing
```

## Correct Patterns

### 1. Import Canonical Enums ✅
```typescript
// RIGHT - Use canonical MW enums
import { MoneyWorksTransactionType } from '../canonical/moneyworks-canonical-ontology';

interface MWTransaction {
  Type: MoneyWorksTransactionType;  // Type-safe MW values only
}
```

### 2. Use Tagged Template Literals ✅
```typescript
// RIGHT - Enhanced date handling with methods
import { d, p } from '@moneyworks/utilities';

// Create dates with validation and methods
const invoiceDate = d`20250118`;
const dueDate = invoiceDate.addDays(30);

// Natural comparisons
if (dueDate.gt(d`${new Date()}`)) {
  console.log('Not yet due');
}

// Period handling
const currentPeriod = p`${new Date()}`;
const lastPeriod = p`${currentPeriod - 1}`;  // Will validate!
```

### 3. Type-Safe Date Operations ✅
```typescript
// RIGHT - All date operations are type-safe and validated
const today = d`${new Date()}`;
const invoices = await repo.findBetweenDates(
  today.addMonths(-1),  // Start of last month
  today                 // Today
);

// Date arithmetic with methods
const aging = invoices.map(inv => ({
  invoice: inv,
  daysOverdue: today.subtract(inv.DueDate),
  isOverdue: inv.DueDate.lt(today)
}));
```

## Implementation Guidelines

1. **Always use enums** for MW fixed vocabularies (Type, Status, PaymentMethod, etc.)
2. **Always use tagged literals** for MW dates (`d``) and periods (`p``)
3. **Import from canonical layer** - Never redefine MW enums
4. **Import from utilities** - Use the shared branded types and utilities
5. **Preserve exact MW casing** in field names (Type not type, NameCode not nameCode)
6. **Translate at boundaries** - Only in the translation layer
7. **Use date methods** - Take advantage of the enhanced date methods
8. **Type-safe queries** - Use enums and proper date formatting in MW queries

## Benefits of This Approach

1. **DSL Purity**: MW concepts remain uncontaminated
2. **Type Safety**: Compile-time validation of MW values and dates
3. **Developer Experience**: Tagged template literals provide intuitive date handling
4. **Method Chaining**: Dates support fluent method chaining for complex operations
5. **Validation**: All dates are validated at creation time
6. **Maintainability**: Single source of truth for MW vocabularies
7. **Discoverability**: IDE autocomplete for date methods and enum values
8. **Refactoring Safety**: Type system catches errors at compile time

## Date Handling Examples

```typescript
// Creating dates - multiple ways
const date1 = d`20250118`;              // Direct YYYYMMDD
const date2 = d`2025-01-18`;            // ISO format
const date3 = d`${new Date()}`;         // From Date object
const date4 = d`${someStringVariable}`; // Parse any format

// Method chaining for complex operations
const nextBusinessDay = d`${new Date()}`
  .addDays(1)
  .isWeekend() 
    ? d`${new Date()}`.addDays(3)  // Skip to Monday
    : d`${new Date()}`.addDays(1);

// Period operations
const currentPeriod = p`${new Date()}`;        // 202501
const nextPeriod = p`${currentPeriod + 1}`;    // 202502 (validated!)
const yearAgo = p`${new Date().getFullYear() - 1}${new Date().getMonth() + 1}`;

// Comparisons are natural
const invoices = transactions.filter(t => 
  t.TransDate.gte(d`2025-01-01`) && 
  t.TransDate.lte(d`2025-01-31`)
);

// Calculate business metrics
const avgDaysToPayment = invoices
  .filter(inv => inv.Status === MoneyWorksTransactionStatus.PAID)
  .map(inv => inv.PaymentDate.subtract(inv.TransDate))
  .reduce((sum, days) => sum + days, 0) / invoices.length;
```

## Conclusion

By using proper TypeScript enums for MoneyWorks types and enhanced tagged template literals for dates, we achieve:

1. **Zero DSL contamination** through type-safe enums
2. **Exceptional developer experience** with tagged template literals
3. **Natural date operations** with chainable methods
4. **Compile-time safety** for all MoneyWorks data types
5. **Semantic accuracy** while maintaining usability

This architecture ensures our data layer remains pure to MoneyWorks semantics while providing modern, ergonomic APIs for developers.