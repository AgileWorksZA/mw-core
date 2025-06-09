# Claude-3 Assignment: Product Entity Generation

## Your Mission
Generate a complete, semantic TypeScript definition for the MoneyWorks **Product** entity following the established pattern from the Name entity.

## Entity Details
- **Entity**: Product
- **Priority**: High (inventory management is critical)
- **Complexity**: Medium (60+ fields, pricing structures, inventory tracking)
- **Reference Pattern**: `generated/name.ts` (use this as your template)

## Source Materials

### Primary Documentation
- **Current API Definition**: `packages/api/src/types/interface/tables/product.ts`
- **Reference Implementation**: `generated/name.ts` (your template)
- **Schema Reference**: Look for product-related schemas in `packages/api/src/types/optimized/`

### Expected Documentation (when HTTrack completes)
- `mirror/manual/moneyworks_appendix_products.html`
- Use existing knowledge and API definitions to start

## Key Semantic Fields to Focus On

Based on MoneyWorks domain knowledge, the Product entity likely has these critical enums:

### Product Types
```typescript
export enum ProductType {
  // Common types: Inventory, Service, Labor, etc.
}
```

### Unit Types
```typescript
export enum UnitType {
  // Measurement units: Each, Hours, Kg, etc.
}
```

### Pricing Levels
```typescript
export enum PricingLevel {
  A = "A",
  B = "B", 
  C = "C",
  D = "D",
  E = "E",
  F = "F"
}
```

### Stock Status
```typescript
export enum StockStatus {
  // Inventory status tracking
}
```

## Deliverables

### 1. Create `generated/product.ts`
Follow the exact pattern from `generated/name.ts`:

1. **Header with documentation source**
2. **All semantic enums** for constrained fields
3. **Complete interface** with JSDoc comments
4. **Utility functions** (isInventoryItem, isService, etc.)
5. **Validation functions** with constraints
6. **Query builder class** for products
7. **Type guards** for product types

### 2. Update `entity-mappings.yaml`
Add Product entity to the mappings:

```yaml
Product:
  description: "Inventory and product management"
  primary_definition: "packages/api/src/types/interface/tables/product.ts"
  status: "complete"
  last_updated: "2025-01-15"
  coverage: 100
  key_semantic_fields:
    Type:
      source_section: "Product type classification"
      enum_values: {...}
    PricingLevel:
      source_section: "Customer pricing levels A-F"
      enum_values: ["A", "B", "C", "D", "E", "F"]
```

## Quality Requirements

### Must Have
- [ ] **100% field coverage** from the source API definition
- [ ] **Semantic enums** for all constrained fields (no magic numbers)
- [ ] **Complete validation** with field size limits
- [ ] **Query builder** for type-safe product queries
- [ ] **Business logic helpers** (pricing calculations, stock checks)
- [ ] **JSDoc documentation** for every field

### Pattern Consistency
- [ ] Same structure as `generated/name.ts`
- [ ] Same naming conventions (PascalCase enums, camelCase functions)
- [ ] Same export pattern and organization
- [ ] Same level of documentation detail

## Special Considerations for Products

### Inventory Management
- Stock on hand tracking
- Reorder levels and quantities
- Min/max stock levels
- Location tracking

### Pricing Structure
- Multiple price levels (A-F for different customer types)
- Cost tracking
- Markup calculations
- Quantity break pricing

### Unit Conversions
- Buy unit vs sell unit
- Conversion factors
- Fractional quantities

### Financial Integration
- Cost of goods accounts
- Sales accounts
- Stock value calculations

## Example Structure

```typescript
/**
 * MoneyWorks Product Entity - Generated from API Definition
 * Source: packages/api/src/types/interface/tables/product.ts
 */

// Semantic enums
export enum ProductType { ... }
export enum UnitType { ... }
export enum PricingLevel { A = "A", B = "B", ... }
export enum StockStatus { ... }

// Main interface
export interface Product {
  // Universal fields
  SequenceNumber: number;
  LastModifiedTime: string;
  
  // Product core
  Code: string;
  Description: string;
  Type: ProductType;
  
  // Pricing (multiple levels)
  PriceA: number;
  PriceB: number;
  // ... other price levels
  
  // Inventory
  StockOnHand: number;
  ReorderLevel: number;
  
  // ... all other fields
}

// Utility functions
export function isInventoryItem(product: Product): boolean { ... }
export function isService(product: Product): boolean { ... }
export function getPriceForLevel(product: Product, level: PricingLevel): number { ... }

// Validation
export function validateProduct(product: Partial<Product>): ValidationResult { ... }

// Query builder
export class ProductQueryBuilder { ... }
```

## Success Criteria

### Completion Checklist
- [ ] File created: `generated/product.ts`
- [ ] Entity mappings updated
- [ ] TypeScript compiles without errors
- [ ] All fields from source API included
- [ ] Semantic enums for constrained values
- [ ] Complete validation and query capabilities
- [ ] Pricing level helpers implemented

## Timeline
- **Start**: Immediately after receiving this assignment
- **Target Completion**: 2-3 hours
- **Review**: Primary Claude will integrate and validate

## Questions/Issues
If you encounter any ambiguities or need clarification:
1. Add TODO comments in the generated file
2. Document assumptions you made
3. Note any fields that need additional research

---

**Begin when ready!** Use `generated/name.ts` as your blueprint and create the most comprehensive Product entity possible.

**Primary Claude will review and integrate your work into the overall system.** 