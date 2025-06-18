# MoneyWorks Core Architecture Overview

## Executive Summary

This document outlines the architectural principles for building a clean, maintainable, and semantically accurate MoneyWorks integration. It addresses the fundamental issues discovered in previous implementations and establishes clear architectural boundaries.

## The Core Problem: Conceptual Contamination

Previous implementations suffered from **conceptual contamination** - the mixing of MoneyWorks canonical concepts with business domain concepts within the same types and layers. This created:

- Terminology confusion (e.g., Supplier vs Creditor)
- Inconsistent abstractions
- Maintenance nightmares
- Semantic inaccuracy

## MoneyWorks Terminology Hierarchy

### Critical Discovery

MoneyWorks has a nuanced hierarchical classification system that must be preserved:

#### Customer vs Debtor
- **Customer (Type 1)**: Basic sales functionality, can make purchases
- **Debtor (Type 2)**: Full receivables management, credit limits, aging, payment terms

#### Supplier vs Creditor  
- **Supplier (Type 1)**: Basic purchase functionality, can provide goods/services
- **Creditor (Type 2)**: Full payables management, payment terms, aging, account management

**Key Insight**: Debtor is a MORE SPECIFIC type of Customer, and Creditor is a MORE SPECIFIC type of Supplier in MoneyWorks.

## Clean Architecture Principles

### 1. Layer Separation

The architecture must maintain strict separation between:

```
┌─────────────────────────────────────┐
│      Business/AI Layer              │  Natural language, business concepts
├─────────────────────────────────────┤
│      Translation Layer              │  Bidirectional mapping
├─────────────────────────────────────┤
│   Pure MoneyWorks Layer            │  Canonical MoneyWorks only
└─────────────────────────────────────┘
```

### 2. Pure MoneyWorks Layer

**Purpose**: Represent MoneyWorks exactly as it is, without interpretation.

**Characteristics**:
- Uses ONLY MoneyWorks canonical terminology
- Preserves all field specifications exactly
- Maintains all business rules from the manual
- No simplification or "improvement" of concepts
- Direct 1:1 mapping with MoneyWorks REST API

**Example**:
```typescript
// CORRECT - Pure MoneyWorks
export enum MoneyWorksTransactionType {
  CREDITOR_INVOICE_COMPLETE = "CIC",    // NOT "SUPPLIER_INVOICE"
  DEBTOR_INVOICE_INCOMPLETE = "DII",    // NOT "CUSTOMER_INVOICE"
}

// INCORRECT - Contaminated
export enum TransactionType {
  SUPPLIER_INVOICE = "CIC",  // ❌ Business term in canonical layer
}
```

### 3. Translation Layer

**Purpose**: Map between MoneyWorks concepts and business concepts while preserving semantic accuracy.

**Characteristics**:
- Bidirectional mapping functions
- Handles terminology differences
- Preserves hierarchical relationships
- Maintains semantic equivalence
- Zero information loss

**Example**:
```typescript
// Translation maintains hierarchy
function translateNameType(mwCustomerType: number): BusinessEntityType {
  switch(mwCustomerType) {
    case 0: return BusinessEntityType.NON_CUSTOMER;
    case 1: return BusinessEntityType.BASIC_CUSTOMER;
    case 2: return BusinessEntityType.FULL_DEBTOR;  // Preserves specificity
  }
}
```

### 4. Business/AI Layer

**Purpose**: Provide natural, intuitive interfaces for business users and AI systems.

**Characteristics**:
- Natural language friendly
- Business-appropriate terminology
- Rich context and metadata
- Optimized for AI/LLM interaction
- MCP-ready interfaces

**Example**:
```typescript
// Business-friendly interface
interface CustomerInvoice {
  customer: Customer;           // Business term
  amount: Money;
  dueDate: Date;
  
  // Rich business context
  paymentStatus: PaymentStatus;
  aging: AgingBucket;
  
  // Preserved MoneyWorks reference
  _mw: {
    type: "DII",              // Original MW type preserved
    customerType: 2           // Original MW customer type
  };
}
```

## Anti-Patterns to Avoid

### 1. Terminology Override
```typescript
// ❌ WRONG - Overriding canonical terms
export const MONEYWORKS_CANONICAL_TERMS = {
  CREDITOR: "Supplier",  // This destroys MW semantics!
}
```

### 2. Mixed Concerns in Same Type
```typescript
// ❌ WRONG - Mixing layers
interface Transaction {
  type: "SUPPLIER_INVOICE",     // Business term
  mwType: "CIC",                // MW term
  businessIntent: "pay_vendor"   // AI term
  // Too many concerns in one place!
}
```

### 3. Lossy Abstraction
```typescript
// ❌ WRONG - Losing MW specificity
function simplifyCustomerType(mwType: number): string {
  return mwType > 0 ? "customer" : "not_customer";
  // Lost the distinction between Customer and Debtor!
}
```

## Correct Patterns

### 1. Clean Separation
```typescript
// ✅ Pure MoneyWorks types
namespace MoneyWorks {
  export interface Transaction {
    Type: string;        // "CIC"
    NameCode: string;
    Status: string;
    // Exactly as in MW API
  }
}

// ✅ Business types
namespace Business {
  export interface SupplierInvoice {
    supplier: Supplier;
    amount: Money;
    status: InvoiceStatus;
  }
}

// ✅ Translation
function toBusinessInvoice(mw: MoneyWorks.Transaction): Business.SupplierInvoice {
  // Clean translation logic
}
```

### 2. Semantic Preservation
```typescript
// ✅ Preserves MW semantics
interface MoneyWorksName {
  customerType: 0 | 1 | 2;  // Preserves all three states
  supplierType: 0 | 1 | 2;  // Preserves all three states
}

// ✅ Business interpretation
interface BusinessEntity {
  canSell: boolean;         // customerType > 0
  hasReceivables: boolean;  // customerType === 2
  canBuy: boolean;          // supplierType > 0  
  hasPayables: boolean;     // supplierType === 2
}
```

### 3. Bidirectional Accuracy
```typescript
// ✅ Lossless bidirectional translation
const translator = {
  toMoneyWorks(entity: BusinessEntity): MoneyWorksName {
    return {
      customerType: entity.hasReceivables ? 2 : entity.canSell ? 1 : 0,
      supplierType: entity.hasPayables ? 2 : entity.canBuy ? 1 : 0
    };
  },
  
  toBusiness(mw: MoneyWorksName): BusinessEntity {
    return {
      canSell: mw.customerType > 0,
      hasReceivables: mw.customerType === 2,
      canBuy: mw.supplierType > 0,
      hasPayables: mw.supplierType === 2
    };
  }
};
```

## Implementation Strategy

### Phase 1: Pure MoneyWorks Foundation
1. Extract all canonical types from MoneyWorks manual
2. Create pure TypeScript definitions matching MW exactly
3. Validate against actual MW API responses
4. Zero business logic or interpretation

### Phase 2: Translation Layer
1. Define business concept mappings
2. Create bidirectional translators
3. Ensure zero information loss
4. Validate semantic equivalence

### Phase 3: Business Layer
1. Design intuitive business interfaces
2. Add rich context and metadata
3. Optimize for AI/MCP interaction
4. Maintain MW references for traceability

## Success Criteria

1. **Canonical Purity**: MoneyWorks layer uses 100% MW terminology
2. **Semantic Accuracy**: No loss of MW distinctions or hierarchies
3. **Business Usability**: Intuitive interfaces for business users
4. **AI Optimization**: Natural language friendly for LLMs
5. **Maintainability**: Clear separation of concerns
6. **Traceability**: Can trace any business concept back to MW source

## Conclusion

The key to a successful MoneyWorks integration is respecting the semantic boundaries between MoneyWorks' canonical model and business domain concepts. By maintaining clean architectural layers with proper translation, we can achieve both accuracy and usability without contamination.