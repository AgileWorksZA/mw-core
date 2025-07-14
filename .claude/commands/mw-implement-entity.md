# implement-mw-entity

Implements a MoneyWorks entity from staging ontology through all packages

## Usage
```
/implement-mw-entity <entity-name>
```

## Examples
```
/implement-mw-entity contacts
/implement-mw-entity names
/implement-mw-entity products
/implement-mw-entity transactions
```

## Implementation Phases

### Phase 0: Pre-Implementation Analysis
1. **Analyze Staging Ontology** (`staging/generated/moneyworks-{entity}-canonical-ontology.ts`)
   - Check DSL completeness (>90% required)
   - Verify all MW fields captured with correct types
   - Ensure MW terminology preserved (no generic terms)
   - Check relationships documented
   - Assess architectural understanding
   - Grade: A- or better to proceed

### Phase 0.5: Field Metadata Structure Design
- Create comprehensive field metadata interface (like `MoneyWorksNameField`)
- Include: fieldName, dataType, maxLength, description, required, indexed, relatedEntity, validationRules
- Essential for validation, UI generation, and documentation

### Phase 1: Utilities Package (if needed)
- Check if new branded types needed
- Add entity-specific utilities/helpers
- Skip if no special types required

### Phase 2: Canonical Package (`/packages/canonical/src/entities/{entity}/`)
- **types.ts**: MoneyWorks{Entity} interface with all fields
- **fields.ts**: Comprehensive field metadata array (MONEYWORKS_{ENTITY}_FIELDS)
- **validators.ts**: Validation functions
- **enums.ts**: Any MW enums (if applicable)
- **business-rules.ts**: Entity-specific business logic (if complex like isDebtor/isCreditor)
- **calculators.ts**: Any calculation functions (if needed)
- **index.ts**: Public exports
- **README-AI.md**: AI guidance with type-specific examples

### Phase 3: Data Package
- **{entity}.repository.ts**: Extend BaseMoneyWorksRepository
- Implement prepare() and postProcess() methods for data transformation
- Add specialized query methods (e.g., findCustomers, findSuppliers)
- Handle MW relationships (e.g., ParentSeq)
- **NO MOCK DATA** - Use real MoneyWorks test instances
- Update package exports

### Phase 4: CLI Package
- Add entity commands (list, get, create, update, delete)
- Handle relationships in CLI interface
- Add to CLI help system
- Test with real MoneyWorks connections

### Phase 5: MCP-Server Package
- Create multiple specialized tools per entity (search, get by type, update fields)
- Group related tools together
- Use descriptive tool names with mw_ prefix
- Include comprehensive parameter validation
- Update MCP documentation

### Phase 6: API Package
- Extend BaseTableController for consistency
- Add to table registry for automatic discovery
- Controllers can be minimal if using base functionality
- Handle MW relationships in API
- Add proper context type declarations for routes
- Add OpenAPI documentation

### Phase 7: Web1 Package
- Create type definitions at component level
- Implement search/filter functionality
- Add type badges/indicators for entity subtypes
- Consider pagination early
- Integration with related entities
- Add to navigation

### Phase 8: Quality Assurance
- Run TypeScript compilation checks on all packages
- Fix any type errors or import issues
- Remove rootDir restrictions in tsconfigs if needed
- Add necessary lib types (DOM for UI packages)
- Ensure all packages work together
- Test with real MoneyWorks connections only

### Phase 9: Documentation
- Developer guide with integration examples
- API documentation
- UI user guide
- Document required MW test data setup
- Include relationship diagrams if applicable
- Update main docs

## Testing Strategy
- **Integration-first approach** - Test against real MoneyWorks instances
- **Test data setup** - Create predictable test entities in MW (TEST_ENTITY_001 pattern)
- **Unit tests only for pure functions** - Validators, formatters, calculators
- **No repository mocks** - Always use real MW connections
- **Document test data requirements** - What needs to be set up in MW for tests

## Entity Compatibility
- ✅ Simple entities (TaxRate)
- ✅ Subfile entities (Contacts → Names)
- ✅ Complex entities (Transactions)
- ✅ All MW data types (T, N, D, S, B)
- ✅ MW business rules preserved
- ✅ Parent-child relationships
- ✅ Complex business types (Customer/Supplier types)

## Common Pitfalls to Avoid
- ❌ Mock data in repositories - Use real MW instead
- ❌ Forgetting exports in index.ts
- ❌ Translating MW terms to generic business terms
- ❌ Missing TypeScript optional field handling
- ❌ Not testing with real MW connections early
- ❌ Hardcoding test data - Use predictable patterns
- ❌ Ignoring TypeScript compilation errors
- ❌ Using rootDir in monorepo tsconfigs

## Best Practices
- ✅ Always preserve MoneyWorks terminology
- ✅ Create comprehensive field metadata
- ✅ Test with real MW connections from the start
- ✅ Set up predictable test data patterns
- ✅ Run quality checks after each phase
- ✅ Document complex business rules
- ✅ Use existing patterns from TaxRate and Names implementations
- ✅ Consider UI pagination and filtering early
- ✅ Group related MCP tools together
- ✅ Extend base classes for consistency

## Notes
- Each phase builds on previous phases
- Quality assurance is critical between phases
- Keep TypeScript configurations flexible for monorepo
- Document MW test data requirements clearly
- Consider entity relationships early in design