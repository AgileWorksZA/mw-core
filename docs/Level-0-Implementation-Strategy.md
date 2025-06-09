# Level 0 Implementation Strategy - Complete Context

## Current Understanding

We have completed comprehensive research on:
1. **MoneyWorks Query Language** - Full syntax documentation
2. **Current API Architecture** - Complete audit and reusable components identified
3. **Format Parameter Strategy** - Three-level optimization approach
4. **Domain-Driven Design** - Architecture proposal for semantic layers

## Critical Next Step: Type Semantics Research

Before coding Level 0, we MUST understand MoneyWorks' type fields:

### Why This Matters
- **Level 0** needs to anticipate Level 1/2 requirements
- **Level 1** will provide type-safe domain interfaces
- **Level 2** will implement business logic
- **Performance** optimizations depend on understanding query patterns

### What We Need to Research

1. **Name Entity Types**
   - `ToFrom` field: "C" (Customer), "S" (Supplier), "M" (Both)
   - Related fields: CreditLimit, Terms, Hold status
   - Business rules for each type

2. **Transaction Document Types**
   - `Type` field: "SI", "SC", "PI", "PC", "SR", "PP", "SO", "PO", "JN", etc.
   - `Status` field: "O", "C", "P", "D", "CA"
   - Workflow states and transitions

3. **Account Classifications**
   - `Type` field: Income, Expense, Asset, Liability categories
   - `System` field: Special accounts (AR, AP, Bank)
   - Reporting implications

4. **Product Types**
   - `Type` field: Stocked, Service, Kit, etc.
   - Inventory vs non-inventory implications
   - Costing methods

## Implementation Approach

### Phase 1: Pre-Implementation Research
1. Document all type/status codes and meanings
2. Create TypeScript discriminated unions
3. Design domain query patterns
4. Plan format optimizations per query type

### Phase 2: Level 0 Implementation
With domain knowledge, implement Level 0 to:
- Support future domain layers efficiently
- Include format optimization hooks
- Provide telemetry for query patterns
- Enable smooth migration path

### Phase 3: Level 1 Domain Layer
- Type-safe query builders
- Domain-specific methods (getCustomers, getOpenInvoices)
- Smart format selection
- Business rule validation

### Phase 4: Level 2 Business Logic
- Accounting operations (aging, reconciliation)
- Reporting patterns
- Workflow automation
- Performance optimizations

## Architecture Benefits

### Developer Experience
```typescript
// Instead of:
search: 'ToFrom="C" and Hold=0'

// Developers write:
customers.active()
```

### Type Safety
```typescript
// Compile-time prevention of:
const supplier: Supplier = await getCustomer("CUST001"); // ❌ Type error
```

### Performance
```typescript
// Automatic optimization:
getCustomerBalances() // Uses server-side GetBalance() function
```

## Key Design Principles

1. **Level 0 is foundational** - Must support all future needs
2. **Domain knowledge drives design** - Understand before implementing
3. **Type safety throughout** - From MCP tools to business logic
4. **Performance by design** - Optimize at every layer
5. **Developer ergonomics** - Make the right thing easy

## Type Semantics Research Complete ✓

We've discovered and documented:

1. **Name.Kind**: 0=Customer, 1=Supplier, 2=Both
2. **Account.Type**: Full GL account classifications (Income, Asset, etc.)
3. **Account.System**: Special accounts (BK=Bank, AR/AP control)
4. **Transaction.Type**: Document types (SI, PI, etc.)
5. **Transaction.Status**: O=Open, P=Posted, D=Draft, etc.

Key insights:
- MoneyWorks uses single-letter codes internally but two-letter codes in queries
- The Kind field is numeric, not string (correcting our initial assumption)
- Rich semantic information already exists in our TypeScript interfaces

## Ready for Implementation

With this domain knowledge, we can now:

1. **Implement Level 0** with awareness of future domain needs
2. **Design Level 1** with proper type discrimination
3. **Plan Level 2** business logic with accounting semantics
4. **Optimize queries** based on common domain patterns

Example domain-aware design:
```typescript
// Level 0: Raw but informed
{ search: 'Kind=0 and Hold=0' }  // We know this means active customers

// Level 1: Type-safe domain
nameService.getActiveCustomers()

// Level 2: Business logic
accountingService.getCustomerAging()
```

This approach ensures we build a solid foundation that elegantly supports both raw power users and domain-focused developers.

---

**Status**: Ready for Level 0 implementation
**Priority**: Begin coding with domain awareness
**Impact**: Foundation for elegant architecture