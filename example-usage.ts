/**
 * Example usage of the generated MoneyWorks Name entity
 * Shows the power of semantic types vs generic numbers/strings
 */

import { 
  Name, 
  CustomerType, 
  SupplierType, 
  NameKind,
  PaymentMethod,
  ProductPricingLevel,
  queryNames,
  validateName,
  isCustomer,
  isSupplier,
  getCustomerTypeLabel 
} from './generated/name';

// ============================================================================
// BEFORE: Generic, error-prone queries
// ============================================================================

// Old way - prone to errors
const oldQuery = {
  search: {
    CustomerType: 1,  // What does 1 mean? 
    SupplierType: 0,  // Is this right?
  }
};

// ============================================================================
// AFTER: Semantic, type-safe queries
// ============================================================================

// New way - semantic and self-documenting
const newQuery = queryNames()
  .customerType(CustomerType.Customer)  // Clear intent
  .supplierType(SupplierType.NotSupplier)  // Obvious meaning
  .nameContains("ABC Company")
  .build();

console.log("Generated query:", newQuery);
// Output: CustomerType=1 AND SupplierType=0 AND Name LIKE "*ABC Company*"

// ============================================================================
// TYPE-SAFE ENTITY CREATION
// ============================================================================

const newCustomer: Partial<Name> = {
  Code: "CUST001",
  Name: "ABC Manufacturing Ltd",
  CustomerType: CustomerType.Customer,  // Type-safe enum
  SupplierType: SupplierType.NotSupplier,  // Cannot use wrong values
  Kind: NameKind.Normal,
  ProductPricing: ProductPricingLevel.B,  // "B" pricing level
  PaymentMethod: PaymentMethod.Electronic,
  Address1: "123 Main Street",
  PostCode: "1001",
  Currency: "NZD",
  CreditLimit: 50000,
  Hold: false
};

// Validation with meaningful error messages
const validation = validateName(newCustomer);
if (!validation.isValid) {
  console.log("Validation errors:", validation.errors);
}

// ============================================================================
// SEMANTIC HELPER FUNCTIONS
// ============================================================================

// Check entity types semantically
if (isCustomer(newCustomer as Name)) {
  console.log(`${newCustomer.Name} is a ${getCustomerTypeLabel(newCustomer.CustomerType!)}`);
}

// Query builder for complex scenarios
const advancedQuery = queryNames()
  .customersOnly()  // Only customers (Type 1 or 2)
  .onHold(false)    // Not on hold
  .build();

console.log("Advanced query:", advancedQuery);
// Output: (CustomerType=1 OR CustomerType=2) AND Hold=False

// ============================================================================
// COMPARISON: Generic vs Semantic
// ============================================================================

// GENERIC (current API audit approach)
interface GenericName {
  CustomerType: number;  // What do the numbers mean?
  SupplierType: number;  // Documentation lookup required
  PaymentMethod: number; // Error-prone magic numbers
  ProductPricing: string; // Unconstrained string
}

// SEMANTIC (our generated approach)
interface SemanticName {
  CustomerType: CustomerType;        // Self-documenting enum
  SupplierType: SupplierType;        // Clear semantic meaning  
  PaymentMethod: PaymentMethod;      // Type-safe values
  ProductPricing: ProductPricingLevel; // Constrained to A-F
}

// ============================================================================
// INTEGRATION WITH LEVEL-0 API
// ============================================================================

// The Level-0 API can now use semantic queries:
// Instead of: search: "CustomerType=1 AND SupplierType=0"
// We can use: search: queryNames().customerType(CustomerType.Customer).build()

// This bridges the gap between:
// 1. Raw MoneyWorks queries (Level 0)
// 2. Semantic type safety (Level 1)
// 3. Higher-level business logic (Level 2)

export { newCustomer, newQuery, advancedQuery }; 