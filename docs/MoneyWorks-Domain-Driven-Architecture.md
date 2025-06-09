# MoneyWorks Domain-Driven Architecture

## Overview

MoneyWorks encodes rich accounting semantics through various type and status fields across its entities. Our current Level 0 design provides raw access to this data, but we need Level 1 and 2 interfaces that expose these semantics in a type-safe, domain-driven way. This document outlines the accounting knowledge embedded in MoneyWorks and proposes an elegant layered architecture that leverages both MoneyWorks' semantic richness and modern TypeScript patterns.

## Current Architecture Review

### Level 0: Raw Pass-Through
- ✅ Full MoneyWorks query language access
- ✅ Direct format parameter control
- ✅ No abstraction overhead
- ❌ No semantic understanding
- ❌ Requires deep MoneyWorks knowledge

### Level 1: Basic Abstractions (Current Plan)
- ✅ Type-safe field selection
- ✅ Format optimization
- ❌ Still exposes raw codes
- ❌ No domain concepts

### Missing: Domain-Driven Layer
We need interfaces that understand:
- A "customer" vs "supplier" vs "both"
- "Posted" vs "draft" transactions
- "Sales invoice" vs "purchase order"
- "Bank account" vs "revenue account"

## MoneyWorks Semantic Type Fields

### 1. Name Table - Customer/Supplier Distinction

**Field**: `ToFrom` (Kind in some contexts)
```typescript
// Current raw values
ToFrom: "C" | "S" | "M";  // Customer, Supplier, Both

// Domain semantics needed
type NameType = "customer" | "supplier" | "both";
type Customer = Name & { ToFrom: "C" };
type Supplier = Name & { ToFrom: "S" };
```

**Additional semantics**:
- `Hold` field: Credit hold status
- `CreditLimit`: Customer credit management
- `Terms`: Payment terms (relates to customer/supplier type)

### 2. Transaction Table - Document Types

**Field**: `Type`
```typescript
// Current raw values (partial list)
Type: "SI" | "SC" | "PI" | "PC" | "SR" | "PP" | "SO" | "PO" | "JN" | ...;

// Domain semantics needed
type TransactionCategory = 
  | "sales-invoice"
  | "sales-credit"
  | "purchase-invoice"
  | "purchase-credit"
  | "sales-receipt"
  | "purchase-payment"
  | "sales-order"
  | "purchase-order"
  | "journal";
```

**Field**: `Status`
```typescript
// Current raw values
Status: "O" | "C" | "P" | "D" | "CA";  // Open, Closed, Posted, Draft, Cancelled

// Domain semantics needed
type TransactionStatus = "open" | "closed" | "posted" | "draft" | "cancelled";
```

### 3. Account Table - GL Account Types

**Field**: `Type`
```typescript
// Current raw values
Type: "I" | "S" | "E" | "C" | "A" | "L" | "F" | "T" | "M" | "H";
// Income, Sales, Expense, Cost of Sales, Current Asset, Current Liability, 
// Fixed Asset, Term Liability, Retained Earnings, Header

// Domain semantics needed
type AccountCategory = 
  | "income"
  | "sales"
  | "expense"
  | "cost-of-sales"
  | "current-asset"
  | "current-liability"
  | "fixed-asset"
  | "term-liability"
  | "retained-earnings"
  | "header";
```

**Field**: `System`
```typescript
// Current raw values (two-letter codes in queries)
System: "P" | "R" | "K" | "A" | "L" | "F" | " ";
// AP Control, AR Control, Bank, AR, AP, Fixed Asset, Normal

// Domain semantics needed
type AccountSystem = 
  | "accounts-payable-control"
  | "accounts-receivable-control"
  | "bank"
  | "accounts-receivable"
  | "accounts-payable"
  | "fixed-asset"
  | "normal";
```

### 4. Product Table - Product Types

**Field**: `Type`
```typescript
// Current raw values
Type: "S" | "B" | "K" | "A" | "O" | "M" | "L" | "F" | "P";
// Stocked, Bought, Kit, Auto-build, Other charges, Mfg, Labour, Freight, Part

// Domain semantics needed
type ProductType = 
  | "stocked-item"
  | "purchased-item"
  | "kit"
  | "auto-build"
  | "service"
  | "manufactured"
  | "labour"
  | "freight"
  | "component";
```

## Proposed Domain-Driven Architecture

### Level 1: Type-Safe Domain Interfaces

```typescript
// Domain-specific query builders
interface CustomerQuery {
  status?: "active" | "on-hold";
  creditLimit?: { min?: number; max?: number };
  balance?: { operator: ">" | "<" | "="; value: number };
}

// Service with domain methods
class Level1NameService {
  // Domain-specific methods
  async getCustomers(query?: CustomerQuery) {
    const search = this.buildCustomerSearch(query);
    return this.level0.export({
      table: "name",
      search: search + ' and ToFrom="C"',
      format: this.optimizeFormat(query)
    });
  }
  
  async getSuppliers(query?: SupplierQuery) {
    const search = this.buildSupplierSearch(query);
    return this.level0.export({
      table: "name",
      search: search + ' and ToFrom="S"',
      format: this.optimizeFormat(query)
    });
  }
  
  // Smart type discrimination
  isCustomer(name: Name): name is Customer {
    return name.ToFrom === "C" || name.ToFrom === "M";
  }
}
```

### Level 2: Business Logic Layer

```typescript
// High-level business operations
class Level2AccountingService {
  // Accounts Receivable operations
  async getOutstandingInvoices(customerId?: string) {
    const query = customerId 
      ? `NameCode="${customerId}" and Status="O"` 
      : 'Status="O"';
    
    return this.level1.transactions.getSalesInvoices({
      status: "open",
      customerId
    });
  }
  
  // Cash position analysis
  async getCashPosition() {
    const bankAccounts = await this.level1.accounts.getBankAccounts();
    
    // Use server-side functions for balances
    const format = bankAccounts
      .map(acc => `[GetBalance("${acc.Code}")]`)
      .join("\t");
    
    return this.level0.export({
      table: "account",
      search: 'System="BK"',
      format
    });
  }
  
  // Aging analysis with domain concepts
  async getAgedReceivables(asOfDate?: Date) {
    const format = [
      "[NameCode]",
      '[Lookup(NameCode,"Name.Name")]',
      "[if(Age(TransDate,Today())<=30,Gross-Paid,0)]",  // Current
      "[if(Age(TransDate,Today())>30 and Age(TransDate,Today())<=60,Gross-Paid,0)]",  // 30 days
      "[if(Age(TransDate,Today())>60 and Age(TransDate,Today())<=90,Gross-Paid,0)]",  // 60 days
      "[if(Age(TransDate,Today())>90,Gross-Paid,0)]"  // 90+ days
    ].join("\t");
    
    return this.level0.export({
      table: "transaction",
      search: 'Type="SI" and Status="O"',
      format
    });
  }
}
```

## Type Discrimination Patterns

### 1. Union Type Refinement
```typescript
// Base type with discriminator
type NameEntity = 
  | { ToFrom: "C"; type: "customer"; creditLimit: number; }
  | { ToFrom: "S"; type: "supplier"; creditTerms: string; }
  | { ToFrom: "M"; type: "both"; creditLimit: number; creditTerms: string; };

// Type guards
function isCustomer(name: Name): name is Customer {
  return name.ToFrom === "C" || name.ToFrom === "M";
}

function isSupplier(name: Name): name is Supplier {
  return name.ToFrom === "S" || name.ToFrom === "M";
}
```

### 2. Semantic Query Builders
```typescript
class TransactionQueryBuilder {
  private conditions: string[] = [];
  
  salesInvoices() {
    this.conditions.push('Type="SI"');
    return this;
  }
  
  posted() {
    this.conditions.push('Status="P"');
    return this;
  }
  
  forCustomer(code: string) {
    this.conditions.push(`NameCode="${code}"`);
    return this;
  }
  
  dateRange(from: Date, to: Date) {
    this.conditions.push(
      `TransDate >= '${formatDate(from)}' and TransDate <= '${formatDate(to)}'`
    );
    return this;
  }
  
  build(): string {
    return this.conditions.join(" and ");
  }
}
```

### 3. Domain Event Mapping
```typescript
// Map MoneyWorks types to domain events
const TransactionTypeMap = {
  "SI": { category: "sales", document: "invoice", direction: "outgoing" },
  "SC": { category: "sales", document: "credit", direction: "outgoing" },
  "PI": { category: "purchase", document: "invoice", direction: "incoming" },
  "PC": { category: "purchase", document: "credit", direction: "incoming" },
  "SR": { category: "sales", document: "receipt", direction: "payment" },
  "PP": { category: "purchase", document: "payment", direction: "payment" },
  "JN": { category: "journal", document: "entry", direction: "adjustment" }
};

// Use in domain logic
function getTransactionSummary(transaction: Transaction) {
  const mapping = TransactionTypeMap[transaction.Type];
  return {
    ...mapping,
    isPayment: mapping.direction === "payment",
    affectsAR: mapping.category === "sales",
    affectsAP: mapping.category === "purchase"
  };
}
```

## Implementation Strategy

### Phase 1: Document Type Semantics
1. Create comprehensive mapping of all type/status codes
2. Document business rules for each type
3. Identify related fields that change meaning based on type

### Phase 2: Build Type System
1. Create TypeScript discriminated unions for each entity
2. Implement type guards and refinement functions
3. Build semantic query helpers

### Phase 3: Domain Services
1. Create Level 1 services with domain methods
2. Implement smart format optimization based on query type
3. Add validation for business rules

### Phase 4: Business Logic Layer
1. Build Level 2 services for common accounting operations
2. Leverage server-side calculations for aggregations
3. Create reusable patterns for reporting

## Benefits of This Approach

### 1. Developer Experience
- Write `getCustomers()` instead of `search: 'ToFrom="C"'`
- Type safety prevents invalid combinations
- IntelliSense shows domain concepts

### 2. Business Logic Encapsulation
- Accounting rules in one place
- Consistent handling of edge cases
- Reusable patterns

### 3. Performance Optimization
- Smart format selection based on operation
- Server-side calculations for aggregations
- Relationship resolution in single query

### 4. Maintainability
- Changes to codes in one place
- Clear separation of concerns
- Testable business logic

## Example: Complete AR Dashboard

```typescript
// Level 2 - Business focused
const dashboard = await accountingService.getARDashboard();

// Returns domain objects
{
  outstandingInvoices: Invoice[],
  overdueAmount: number,
  averageDaysToPayment: number,
  topCustomersByBalance: Customer[],
  cashReceivedToday: number
}

// Implementation leverages all levels
class ARDashboardService {
  async getARDashboard() {
    // Use Level 0 for optimized multi-query
    const format = [
      "[Count(Type='SI' and Status='O')]",  // Outstanding count
      "[Sum(Type='SI' and Status='O',Gross-Paid)]",  // Outstanding amount
      "[Sum(Type='SI' and Age(TransDate,Today())>Terms,Gross-Paid)]"  // Overdue
    ].join("\t");
    
    const summary = await this.level0.evaluate(format);
    
    // Use Level 1 for typed queries
    const invoices = await this.level1.transactions.getSalesInvoices({
      status: "open",
      limit: 10,
      sort: "TransDate",
      direction: "descending"
    });
    
    return this.mapToDomainModel(summary, invoices);
  }
}
```

## Next Steps

Before implementing Level 0:
1. **Research**: Document all type/status field meanings
2. **Design**: Create complete type mappings
3. **Validate**: Verify understanding with MoneyWorks documentation
4. **Plan**: Design Level 1 domain interfaces
5. **Implement**: Build Level 0 with future layers in mind

This architecture provides:
- Raw power at Level 0
- Type safety at Level 1
- Business logic at Level 2
- All while maintaining MoneyWorks' semantic richness

---

**Status**: Architecture Proposal
**Priority**: Critical for elegant API design
**Next**: Research MoneyWorks type field semantics