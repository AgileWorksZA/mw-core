# @moneyworks/canonical

Pure MoneyWorks canonical types, enums, validators, and business logic. Zero contamination with business domain concepts.

## 🎯 Purpose

This package is the **single source of truth** for MoneyWorks concepts. It ensures:

- **DSL Purity**: Only MoneyWorks terminology, never generic business terms
- **Type Safety**: Everything that can be an enum or literal type, is
- **AI Compliance**: Schemas and documentation that force AI to use MW language
- **Business Logic**: MoneyWorks-specific calculations and validations

## 📦 What's Inside

### Entities

Each MoneyWorks entity has:
- **Types** - Exact field definitions from MW manual
- **Enums** - All fixed vocabularies as TypeScript enums  
- **Validators** - Canonical validation functions
- **Calculators** - MW-specific business logic
- **AI Schemas** - DSL enforcement for AI agents
- **Documentation** - Comprehensive terminology guides

### Common

Shared types and interfaces used across all entities:
- `MoneyWorksDataType` - The MW field type system (T, N, D, etc.)
- `MoneyWorksFieldMetadata` - Standard field definition structure
- `MoneyWorksValidationResult` - Consistent validation responses
- `MoneyWorksBusinessRules` - Rule definition interfaces

## 🚀 Usage

### Import Patterns

```typescript
// Import from entity namespace
import { TaxRates } from '@moneyworks/canonical';
const taxRate: TaxRates.MoneyWorksTaxRate = { ... };

// Import directly from entity subpath
import { MoneyWorksTaxRate, validateTaxRate } from '@moneyworks/canonical/tax-rates';

// Import common types
import { MoneyWorksDataType, MoneyWorksValidationResult } from '@moneyworks/canonical';
```

### Example: Working with Tax Rates

```typescript
import { 
  MoneyWorksTaxRate, 
  MoneyWorksTaxCombineMode,
  validateTaxRate,
  calculateTaxForRate 
} from '@moneyworks/canonical/tax-rates';
import { d } from '@moneyworks/utilities';

// Create a tax rate (using MW terminology)
const gst10: MoneyWorksTaxRate = {
  TaxCode: "GST10",
  PaidAccount: "2-1520",    // NOT "tax payable"
  RecAccount: "2-1510",     // NOT "tax receivable"  
  Date: d`20240401`,        // NOT "effective date"
  Rate1: 10,                // NOT "old rate"
  Rate2: 10,                // NOT "new rate"
  Combine: MoneyWorksTaxCombineMode.NONE
};

// Validate it
const validation = validateTaxRate(gst10);
if (!validation.isValid) {
  console.error('Validation warnings:', validation.warnings);
}

// Calculate tax
const result = calculateTaxForRate(gst10, 100.00, {
  date: d`20240501`,
  isTaxInclusive: false
});

console.log(`TaxCode ${result.TaxCode}: $${result.totalTax}`);
```

## 🤖 AI/LLM Integration

This package includes comprehensive AI guidance:

### AI Schema Files

Each entity includes `.ai-schema.json`:
```json
{
  "entity": "MoneyWorks Tax Rates",
  "instruction": "CRITICAL: Use ONLY MoneyWorks terminology",
  "vocabulary": {
    "ALWAYS_USE": { ... },
    "NEVER_USE": [ ... ]
  }
}
```

### AI Documentation

Each entity has `README-AI.md` with:
- Quick reference cards (Never Say / Always Say)
- Example dialogues (correct vs incorrect)
- Field-by-field language guides
- Common operation patterns

### TypeScript JSDoc

Every type and function includes AI instructions:
```typescript
/**
 * @ai-instruction USE ONLY MoneyWorks field names
 * @ai-forbidden VAT, sales-tax, tax-rate-id
 * @ai-required TaxCode, PaidAccount, RecAccount
 */
```

## 🛡️ DSL Protection

### Enforcement Mechanisms

1. **TypeScript Enums** - Can't use wrong values
2. **Branded Types** - Type-safe field values
3. **Validation Functions** - Runtime checking
4. **AI Schemas** - Language enforcement
5. **Linting Rules** - Catch terminology issues

### Example Protection

```typescript
// ❌ This won't compile
const taxRate: MoneyWorksTaxRate = {
  taxId: "GST10",        // ERROR: 'taxId' doesn't exist
  effectiveDate: "2024", // ERROR: 'effectiveDate' doesn't exist
  // ...
};

// ❌ This will fail validation
const result = validateTaxCode("GST10_INVALID!");
// warnings: ["TaxCode should contain only alphanumeric characters"]

// ✅ This is correct
const taxRate: MoneyWorksTaxRate = {
  TaxCode: "GST10",
  Date: d`20240401`,
  // ... all MW fields
};
```

## 📚 Adding New Entities

To add a new MoneyWorks entity:

1. Create entity folder: `src/entities/[entity-name]/`
2. Add core files:
   - `types.ts` - Interface definitions
   - `enums.ts` - Fixed vocabularies
   - `fields.ts` - Field metadata
   - `validators.ts` - Validation logic
   - `terms.ts` - Terminology mapping
   - `.ai-schema.json` - AI instructions
   - `README-AI.md` - AI documentation
   - `index.ts` - Public exports

3. Follow the tax-rates pattern exactly
4. Use ONLY MoneyWorks terminology
5. Cite manual sources for everything

## 🔧 Development

```bash
# Build the package
bun run build

# Watch mode
bun run dev

# Type checking
bun run typecheck

# Validate DSL compliance
bun run validate-dsl
```

## 📖 Resources

- MoneyWorks Manual: Primary source of truth
- Architecture docs: `/docs/architecture-overview.md`
- Data layer docs: `/docs/data-layer-architecture.md`

## ⚠️ Important Rules

1. **NEVER** add business domain concepts to this package
2. **ALWAYS** use exact MoneyWorks terminology
3. **ALWAYS** cite manual sources in comments
4. **NEVER** "improve" or "simplify" MW concepts
5. **ALWAYS** preserve MW's exact field names and casing

This package is the foundation of semantic accuracy. Protect its purity!