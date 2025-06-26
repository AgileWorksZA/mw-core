# MoneyWorks Core - Design Principles and Guidelines

## Core Design Principles

### 1. Developer Experience (DX)
- **Clear, intuitive APIs** - Method names should be self-explanatory
- **Comprehensive type safety** - Full TypeScript types for all interfaces
- **Consistent naming** - Follow established patterns throughout codebase
- **Rich documentation** - JSDoc comments with examples
- **Helpful error messages** - Guide developers to solutions

### 2. LLM Context Quality
- **Self-documenting code** - Code structure tells the story
- **Explicit schemas** - All data structures clearly defined
- **Rich metadata** - Include descriptions, constraints, relationships
- **AI-friendly comments** - Use @ai-instruction and @ai-critical tags
- **Canonical terminology** - Consistent language throughout

### 3. Canonical MoneyWorks DSL
- **Preserve MW terminology** - NEVER translate MW terms (e.g., GST stays GST)
- **Use exact field names** - TaxCode, not tax_code or taxId
- **Maintain MW concepts** - RecAccount, PaidAccount, not generic terms
- **Follow MW patterns** - Date formats (YYYYMMDD), account codes, etc.
- **Pure DSL approach** - No contamination from other business systems

### 4. Performance & Flexibility
- **Multiple export formats** - Compact arrays, full objects, schema-enriched
- **Lazy loading** - Field discovery only when needed
- **Efficient caching** - Cache discovered structures
- **Clear conversion paths** - Easy to transform between formats
- **Extensible design** - New formats can be added easily

### 5. Type Safety & Validation
- **Branded types** - YYYYMMDD, AccountCode, etc.
- **Compile-time safety** - Catch errors before runtime
- **Runtime validation** - Validate data from MoneyWorks
- **Clear type hierarchies** - Input types, output types, internal types

## Export Format Standards

### Compact Format (`compact`)
- Raw arrays for minimal network overhead
- No field names, just values
- Position-based data access

### Compact with Headers (`compact-headers`)
- First row contains field names
- Subsequent rows are data arrays
- Self-documenting while staying lean

### Full Object Format (`full`)
- Complete objects with field names
- Best developer experience
- Type-safe and self-documenting

### Schema-Enriched Format (`schema`)
- Includes full field metadata
- Types, constraints, descriptions
- Best for LLM understanding and documentation

## Code Organization

### Package Structure
- `@moneyworks/canonical` - Pure MW type definitions
- `@moneyworks/data` - Data access layer
- `@moneyworks/utilities` - Shared utilities and branded types
- `@moneyworks/cli` - Command-line interface

### Import Patterns
- Use full package imports between packages: `@moneyworks/package/module`
- Main index.ts can use relative imports within same package
- Avoid circular dependencies by careful module organization

### Naming Conventions
- Interfaces: `MoneyWorks{Entity}` (e.g., `MoneyWorksTaxRate`)
- Types: Descriptive names (e.g., `ExportFormat`, `ImportResult`)
- Methods: Verb-first (e.g., `findByKey`, `validateTaxCode`)
- Constants: UPPER_SNAKE_CASE (e.g., `MONEYWORKS_TAX_RATE_FIELDS`)

## Testing Philosophy
- Test the behavior, not the implementation
- Use real MW data structures in tests
- Mock at the HTTP level, not the client level
- Ensure all export formats produce equivalent data

## Documentation Standards
- Every public method needs JSDoc
- Include @example tags where helpful
- Use @ai-instruction for AI-specific guidance
- Document MoneyWorks quirks and gotchas

## Memories
- Always run TypeScript compiler before committing
- Check imports are using full package paths
- Maintain the canonical DSL purity
- resume: Remembered the importance of maintaining and updating personal resume regularly