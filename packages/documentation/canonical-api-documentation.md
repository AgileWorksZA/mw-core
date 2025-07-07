# MoneyWorks Canonical Package API Documentation

## Overview

The `@moneyworks/canonical` package is the foundation of MoneyWorks semantic accuracy, containing ONLY pure MoneyWorks types and logic. This package enforces strict MoneyWorks DSL (Domain Specific Language) compliance and serves as the single source of truth for MoneyWorks terminology, types, and business rules.

**Version Information:**
- Package Version: 0.1.0
- MoneyWorks Manual Version: 9.0
- Last Updated: 2024-01-18

## Core Design Principles

1. **Pure MoneyWorks DSL** - No contamination from generic business terms
2. **Canonical Terminology** - NEVER translate MoneyWorks terms (e.g., GST stays GST)
3. **Exact Field Names** - TaxCode, not tax_code or taxId
4. **Type Safety** - Full TypeScript types with branded types for data integrity
5. **Self-Documenting** - Rich JSDoc comments with AI instructions

## Package Structure

```typescript
import { 
  // Common types
  MoneyWorksDataType,
  MoneyWorksFieldMetadata,
  MoneyWorksValidationResult,
  MoneyWorksBusinessRules,
  
  // Entity namespaces
  TaxRates,
  
  // Version info
  CANONICAL_VERSION
} from '@moneyworks/canonical';
```

## Common Types and Utilities

### Data Types

MoneyWorks uses specific single-letter codes for field types:

```typescript
enum MoneyWorksDataType {
  TEXT = 'T',        // Text field (T)
  NUMERIC = 'N',     // Numeric field (N)
  DATE = 'D',        // Date field (D) - YYYYMMDD format
  BOOLEAN = 'B',     // Boolean field (B)
  TIMESTAMP = 'S',   // Timestamp field (S)
  ENUMERATED = 'E'   // Enumerated field (E)
}
```

### Field Metadata

```typescript
interface MoneyWorksFieldMetadata {
  fieldName: string;              // Exact MW field name
  dataType: MoneyWorksDataType;   // Single letter type code
  maxLength?: number;             // For text fields
  canonicalDescription: string;   // From MW manual
  manualSource: string;          // Manual page reference
  isRequired?: boolean;
  isIndexed?: boolean;
}
```

### Validation Result

```typescript
interface MoneyWorksValidationResult {
  isValid: boolean;
  warnings: string[];
  context?: Record<string, unknown>;
}
```

## TaxRates Namespace

The TaxRates namespace provides complete functionality for working with MoneyWorks tax rates.

### Types and Interfaces

#### MoneyWorksTaxRate

The complete tax rate entity with all MoneyWorks fields:

```typescript
interface MoneyWorksTaxRate {
  // Primary fields
  TaxCode: string;           // T(5) - Unique identifier
  PaidAccount: AccountCode;  // T(7) - Control account for GST paid
  RecAccount: AccountCode;   // T(7) - Control account for GST received
  Date: YYYYMMDD;           // D - Changeover date
  Rate1: number;            // N - Rate before changeover
  Rate2: number;            // N - Rate after changeover
  
  // Multi-tier tax fields
  Combine?: MoneyWorksTaxCombineMode;  // N - How 2nd tier combines
  CombineRate1?: number;               // N - 2nd tier before changeover
  CombineRate2?: number;               // N - 2nd tier after changeover
  
  // GST finalization fields (system-managed)
  GSTPaid?: number;         // N - Total GST paid in last finalisation
  GSTReceived?: number;     // N - Total GST received in last finalisation
  NetPaid?: number;         // N - Net paid in last finalisation
  NetReceived?: number;     // N - Net received in last finalisation
  
  // System fields
  LastModifiedTime?: string;  // S - Last change timestamp
  UserNum?: number;          // N - Scriptable number
  UserText?: string;         // T(255) - Scriptable text
  TaggedText?: string;       // T(255) - Scriptable tags
}
```

#### Input Types

```typescript
// For creating new tax rates (only required fields)
interface MoneyWorksTaxRateCreateInput {
  TaxCode: string;
  PaidAccount: AccountCode;
  RecAccount: AccountCode;
  Date: YYYYMMDD;
  Rate1: number;
  Rate2: number;
}

// For updating tax rates (all optional except TaxCode)
interface MoneyWorksTaxRateUpdateInput {
  TaxCode: string;
  PaidAccount?: AccountCode;
  RecAccount?: AccountCode;
  Date?: YYYYMMDD;
  Rate1?: number;
  Rate2?: number;
  Combine?: MoneyWorksTaxCombineMode;
  CombineRate1?: number;
  CombineRate2?: number;
}
```

### Enumerations

#### MoneyWorksTaxCombineMode

Controls how 2nd tier tax is calculated:

```typescript
enum MoneyWorksTaxCombineMode {
  NONE = 0,      // No 2nd tier tax
  ADDITIVE = 1,  // 2nd tier added to base tax
  COMPOUND = 2,  // 2nd tier on tax-inclusive amount
  SEPARATE = 3   // 2nd tier calculated independently
}
```

#### MoneyWorksTaxFinalizationStatus

Status of GST finalization:

```typescript
enum MoneyWorksTaxFinalizationStatus {
  NOT_FINALIZED = 'NOT_FINALIZED',
  FINALIZED = 'FINALIZED'
}
```

### Field Definitions

Access complete field metadata:

```typescript
// Get all fields
const fields = MONEYWORKS_TAX_RATE_FIELDS; // 17 fields

// Get specific field metadata
const taxCodeField = getFieldMetadata('TaxCode');

// Get required fields only
const requiredFields = getRequiredFields(); // Returns 6 required fields

// Get indexed fields
const indexedFields = getIndexedFields(); // Returns fields with indexes
```

### Validators

#### validateTaxCode(taxCode: string)
Validates TaxCode format (max 5 chars, alphanumeric).

#### validateTaxRate(taxRate: Partial<MoneyWorksTaxRate>)
Comprehensive validation of entire tax rate entity.

#### validateTaxAccountReferences(paidAccount: string, recAccount: string)
Validates account references format and rules.

#### validateRequiredFields(taxRate: Partial<MoneyWorksTaxRate>)
Ensures all required fields are present.

### Calculators

#### getCurrentTaxRate(rate1, rate2, changeoverDate, currentDate?)
Determines which rate applies based on date:

```typescript
const result = getCurrentTaxRate(10, 15, d`20240401`);
// Returns: {
//   currentRate: 15,
//   ratePeriod: 'after_changeover',
//   explanation: 'Using Rate2 (15%) - current date is on or after changeover Date 20240401'
// }
```

#### calculateCombinedTax(amount, primaryRate, secondaryRate, combineMode, isTaxInclusive?)
Calculates multi-tier tax with MoneyWorks logic:

```typescript
const result = calculateCombinedTax(100, 10, 5, MoneyWorksTaxCombineMode.COMPOUND);
// Returns: {
//   primaryTax: 10.00,
//   secondaryTax: 0.55,  // 5% of 110
//   totalTax: 10.55,
//   taxInclusiveAmount: 110.55,
//   taxExclusiveAmount: 100.00,
//   explanation: 'MoneyWorks tax calculation using COMPOUND Combine mode...'
// }
```

#### calculateTaxForRate(taxRate, amount, options?)
Full tax calculation for a MoneyWorks TaxRate:

```typescript
const result = calculateTaxForRate(taxRate, 1000, { 
  date: d`20240501`,
  isTaxInclusive: false 
});
```

#### calculateGSTFinalization(transactions)
Calculates GST finalization totals:

```typescript
const result = calculateGSTFinalization([
  { amount: 1000, tax: 100, type: 'paid' },
  { amount: 2000, tax: 200, type: 'received' }
]);
// Returns GSTPaid, GSTReceived, NetPaid, NetReceived
```

### Business Rules

Access MoneyWorks business rules:

```typescript
// Validation rules
MoneyWorksTaxRateBusinessRules.validationRules.uniqueTaxCode // true

// Relationship rules  
MoneyWorksTaxRateRelationships // Array of field relationships

// Operational rules
TaxRateOperationalRules.rateSelection.changeoverDateInclusive // true

// Get rules for specific operation
const rules = getApplicableRules('create');
// Returns: ['TaxCode must be unique', 'PaidAccount and RecAccount must exist', ...]
```

### Canonical Terms

Access MoneyWorks terminology:

```typescript
// Get all canonical terms
MONEYWORKS_TAX_RATE_CANONICAL_TERMS

// Get canonical term for a concept
getCanonicalTerm('tax id') // Returns: 'TaxCode'

// Tax-specific actions
MONEYWORKS_TAX_ACTIONS['calculate GST'] // 'Compute tax amount using rates'
```

## Critical MoneyWorks Concepts

### Universal GST Terminology
MoneyWorks uses "GST" for ALL tax types globally:
- US Sales Tax → GST in MoneyWorks
- EU VAT → GST in MoneyWorks  
- Australian GST → GST in MoneyWorks

This is NOT a mistake - it's canonical MoneyWorks language.

### Changeover Date System
- The `Date` field determines when to switch from Rate1 to Rate2
- Before Date: use Rate1
- On or after Date: use Rate2
- This is NOT an "effective date" - it's a "changeover Date"

### Two-Tier Tax System
- Primary tax: Rate1/Rate2
- Secondary tax (2nd tier): CombineRate1/CombineRate2
- Combination controlled by Combine field

### GST Finalization
- MoneyWorks process that populates GSTPaid, GSTReceived, NetPaid, NetReceived
- NOT "tax filing" or "VAT return"
- Always spelled "finalisation" (British spelling)

## Usage Examples

### Creating a Tax Rate

```typescript
import { TaxRates } from '@moneyworks/canonical';
import { d } from '@moneyworks/utilities';

const newTaxRate: TaxRates.MoneyWorksTaxRateCreateInput = {
  TaxCode: 'GST10',
  PaidAccount: '2-1520' as AccountCode,
  RecAccount: '2-1510' as AccountCode,
  Date: d`20240401`,
  Rate1: 10,
  Rate2: 15
};

// Validate before saving
const validation = TaxRates.validateTaxRate(newTaxRate);
if (!validation.isValid) {
  console.error('Validation warnings:', validation.warnings);
}
```

### Calculating Tax

```typescript
const taxRate: TaxRates.MoneyWorksTaxRate = {
  TaxCode: 'GST10',
  PaidAccount: '2-1520' as AccountCode,
  RecAccount: '2-1510' as AccountCode,
  Date: d`20240401`,
  Rate1: 10,
  Rate2: 15,
  Combine: TaxRates.MoneyWorksTaxCombineMode.COMPOUND,
  CombineRate1: 5,
  CombineRate2: 7
};

const calculation = TaxRates.calculateTaxForRate(taxRate, 1000);
console.log(`Total tax: ${calculation.totalTax}`);
console.log(`Explanation: ${calculation.explanation}`);
```

## Future Entities

The package structure supports additional MoneyWorks entities:
- Transactions
- Accounts  
- Names
- Products
- etc.

Each will follow the same pattern with types, validators, calculators, and business rules.

## Important Notes

1. **Never translate MoneyWorks terms** - Use exact terminology
2. **Import from namespace** - Use `import { TaxRates } from '@moneyworks/canonical'`
3. **Validation is advisory** - Returns warnings, not errors
4. **All amounts are numbers** - MoneyWorks uses numeric fields for money
5. **Dates use YYYYMMDD** - Branded type from utilities package

This canonical package ensures semantic accuracy and MoneyWorks DSL purity across all implementations.