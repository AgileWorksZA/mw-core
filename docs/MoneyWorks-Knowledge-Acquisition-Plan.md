# MoneyWorks Knowledge Acquisition Plan

## Overview

Before implementing the Level 0/1/2 API architecture, we need to systematically document all MoneyWorks codes and enumerations with their semantic meanings. This knowledge base will power our type-driven, AI-first API design.

## Phase 1: Knowledge Acquisition

### Entity Order

1. **Name (Customer/Supplier)**
   - Kind field values
   - CustomerType/SupplierType enumerations
   - PaymentMethod codes
   - Category meanings

2. **Account (Chart of Accounts)**
   - Type field (GL classifications)
   - System field (special accounts)
   - Color codes
   - Custom field usage

3. **Transaction (Documents)**
   - Type field (document types)
   - Status field (workflow states)
   - Valid transitions
   - Period handling

4. **Product (Inventory/Services)**
   - Type field (product classifications)
   - Costing methods
   - Stock vs non-stock rules
   - Kit/assembly handling

5. **Supporting Entities**
   - Job (project tracking)
   - TaxRate (tax codes)
   - Department (cost centers)
   - User (security levels)

### Documentation Format

For each entity, we'll create:

```typescript
// Example: Name.Kind enumeration
export enum NameKind {
  Customer = 0,        // Can sell to
  Supplier = 1,        // Can buy from  
  CustomerSupplier = 2 // Both customer and supplier
}

// With discriminated unions
export type Customer = Name & { Kind: NameKind.Customer };
export type Supplier = Name & { Kind: NameKind.Supplier };

// And semantic helpers
export const isCustomer = (name: Name): name is Customer => 
  name.Kind === NameKind.Customer || name.Kind === NameKind.CustomerSupplier;
```

## Phase 2: Type System Design

### Core Principles

1. **Semantic Names**: Use business terms, not codes
2. **Type Safety**: Discriminated unions prevent invalid states
3. **Discoverability**: IntelliSense shows meaningful options
4. **Backwards Compatible**: Maps to MoneyWorks codes internally

### Type Architecture

```typescript
// Layer 0: Raw types with semantic enums
interface RawName {
  Kind: NameKind;
  // ... other fields
}

// Layer 1: Domain types
type Customer = RawName & { Kind: NameKind.Customer };

// Layer 2: Business concepts
interface ActiveCustomer extends Customer {
  Hold: false;
  CreditLimit: number;
}
```

## Phase 3: Implementation Strategy

### 1. Create Semantic Type Library
- `packages/api/src/types/semantics/`
  - `name.semantics.ts`
  - `account.semantics.ts`
  - `transaction.semantics.ts`
  - etc.

### 2. Update Raw Interfaces
- Add semantic enums to existing types
- Maintain backwards compatibility
- Add JSDoc with business meanings

### 3. Build Query Helpers
- Type-safe query builders
- Semantic method names
- Automatic code generation

### 4. Design MCP Tools
- AI-friendly descriptions
- Semantic parameters
- Example-driven documentation

## Benefits

1. **Developer Experience**
   ```typescript
   // Instead of memorizing codes:
   names.search({ Kind: 0, Hold: false })
   
   // Developers write:
   names.getActiveCustomers()
   ```

2. **AI Understanding**
   - "Find all unpaid invoices" → automatically generates correct query
   - Semantic descriptions in MCP tools
   - No need to expose codes to AI

3. **Type Safety**
   ```typescript
   // Compile error - can't assign supplier to customer
   const customer: Customer = supplier; // ❌
   ```

4. **Maintainability**
   - Single source of truth for codes
   - Easy to add new classifications
   - Clear business logic

## Success Criteria

1. All MoneyWorks codes documented with meanings
2. TypeScript enums for all classifications
3. Discriminated unions for type safety
4. Semantic query helpers for common patterns
5. MCP tools speak business language, not codes

## Next Steps

1. Start with Name entity - await Kind field documentation
2. Document each field's codes and meanings
3. Create TypeScript semantic types
4. Build discriminated unions
5. Design query helpers
6. Proceed to next entity

---

**Status**: Ready to begin knowledge acquisition
**First Entity**: Name (Customer/Supplier)
**Waiting For**: MoneyWorks code definitions