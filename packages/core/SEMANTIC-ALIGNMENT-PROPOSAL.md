# Semantic Alignment Proposal for MoneyWorks Core

## Executive Summary

After analyzing the ontology discussions in the @generated folder and comparing with the current core module implementation, this proposal outlines how to evolve our codebase to better express the rich semantic domain of MoneyWorks.

## Key Discoveries from Ontology Analysis

### 1. MoneyWorks is a Semantic System
The generated discussions reveal that MoneyWorks is not just a database with fields, but a **semantic business system** with:
- Rich business intent behind every operation
- Domain-specific terminology with precise meanings
- Complex relationships that express business workflows
- Natural language concepts embedded in the design

### 2. Current Implementation Gaps

Our current core module follows a traditional data-centric approach:

```typescript
// Current approach - data-focused
export interface Transaction {
  SequenceNumber: number;
  Type: string;
  Gross: number;
  // ... just fields
}
```

The ontology suggests a richer model:

```typescript
// Semantic approach - intent-focused
export interface SemanticTransaction {
  // Data layer
  data: Transaction;
  
  // Semantic layer
  intent: BusinessIntent;
  affects: AccountingConcept[];
  workflow: WorkflowState;
  story: BusinessNarrative;
}
```

## Proposed Enhancements

### 1. Semantic Type System

Create a parallel type system that adds business meaning:

```typescript
// packages/core/src/semantic/types.ts
export interface SemanticEnvelope<T> {
  data: T;
  semantics: {
    intent: string;
    businessMeaning: string;
    naturalLanguage: string;
    affects: string[];
    rules: BusinessRule[];
  };
}

// Example: Customer Payment
export type CustomerPayment = SemanticEnvelope<Transaction> & {
  semantics: {
    intent: "reduce_customer_debt";
    businessMeaning: "Customer settling their outstanding balance";
    naturalLanguage: "Customer {name} paid ${amount} against invoice {reference}";
    affects: ["cash_position", "debtor_balance", "aged_receivables"];
    rules: [
      "payment_cannot_exceed_outstanding",
      "must_reference_valid_customer"
    ];
  };
};
```

### 2. Domain-Driven Builders

Replace generic CRUD with intent-driven operations:

```typescript
// packages/core/src/dsl/builders.ts
export class MoneyWorksDSL {
  // Current approach
  async createTransaction(data: Transaction) { }
  
  // Semantic approach
  async recordSale() {
    return new SaleBuilder()
      .to(customer)
      .for(product)
      .quantity(amount)
      .story("Regular monthly subscription")
      .execute();
  }
  
  async paySupplier() {
    return new PaymentBuilder()
      .to(supplier)
      .amount(value)
      .against(invoice)
      .from(bankAccount)
      .story("Paying for inventory received")
      .execute();
  }
}
```

### 3. Natural Language Query Interface

Implement queries that match how users think:

```typescript
// packages/core/src/semantic/queries.ts
export class NaturalQuery {
  // Instead of: Type="DI" AND Gross<>AmtPaid
  async unpaidCustomerInvoices() {
    return this.transactions
      .whereCustomerOwesUs()
      .orderByOldestFirst()
      .includeAgingAnalysis();
  }
  
  // Instead of: Name.Type="S" AND Balance<0
  async suppliersWeOwe() {
    return this.names
      .whereWeOweThemMoney()
      .orderByLargestDebtFirst()
      .includePaymentTerms();
  }
}
```

### 4. Business Context Providers

Add context that explains the "why" behind data:

```typescript
// packages/core/src/semantic/context.ts
export class BusinessContext {
  explainTransaction(tx: Transaction): BusinessExplanation {
    return {
      what: "Customer payment received",
      why: "Settling invoice INV-001 from January",
      impact: {
        cashFlow: "+$1,000 improved cash position",
        customerRelationship: "Account now current",
        accounting: "Reduces accounts receivable"
      },
      nextSteps: ["No follow-up needed", "Send receipt"]
    };
  }
}
```

### 5. Semantic Validation

Validation that understands business rules:

```typescript
// packages/core/src/semantic/validation.ts
export class SemanticValidator {
  // Current: validates field types
  // Semantic: validates business logic
  
  validatePayment(payment: CustomerPayment): ValidationResult {
    const rules = [
      this.customerMustExist(payment),
      this.paymentCannotExceedOwed(payment),
      this.bankAccountMustHaveFunds(payment),
      this.periodMustBeOpen(payment)
    ];
    
    return {
      valid: rules.every(r => r.passed),
      story: this.explainValidation(rules)
    };
  }
}
```

## Implementation Roadmap

### Phase 1: Semantic Annotations (Week 1-2)
- Add semantic metadata to existing types
- Create business intent enums
- Document domain terminology

### Phase 2: Context Layer (Week 3-4)
- Build business context providers
- Implement semantic validators
- Add relationship mappings

### Phase 3: Natural Language API (Week 5-6)
- Create fluent builders
- Implement query translators
- Add narrative generators

### Phase 4: Full Semantic DSL (Week 7-8)
- Complete domain-driven interfaces
- Implement workflow engine
- Add LLM optimizations

## Example: Complete Semantic Flow

```typescript
// Before: Technical, database-centric
const tx = await client.create('Transaction', {
  Type: 'CP',
  NameCode: 'SUPP001',
  Gross: 1000,
  AccountCode: '1000'
});

// After: Semantic, business-centric
const payment = await moneyworks
  .paySupplier('Office Supplies Ltd')
  .amount(1000)
  .forInvoice('INV-123')
  .fromBankAccount('Operating Account')
  .because('Monthly stationery order')
  .execute();

// The result includes rich context
console.log(payment.story);
// "Paid Office Supplies Ltd $1,000 from Operating Account for invoice INV-123 (Monthly stationery order)"

console.log(payment.impact);
// {
//   cashFlow: "Reduced by $1,000",
//   supplierRelationship: "Account now current",
//   taxImplications: "GST credit available"
// }
```

## Benefits

1. **Developer Experience**: Code reads like business requirements
2. **AI/LLM Integration**: Semantic layer perfect for AI understanding
3. **Error Prevention**: Business rules enforced at compile time
4. **Self-Documenting**: Intent clear from code structure
5. **MCP Optimization**: Natural language mapping for better prompts

## Next Steps

1. Review and approve this proposal
2. Create semantic-core package alongside existing core
3. Gradually migrate interfaces to include semantic layer
4. Build example applications showing the improved DX
5. Document the semantic patterns for team adoption

## Conclusion

The ontology discussions reveal a sophisticated understanding of MoneyWorks as a semantic business system. By aligning our core module with these insights, we can create a DSL that truly expresses the richness of the MoneyWorks domain, resulting in code that is more intuitive, less error-prone, and naturally aligned with business thinking.