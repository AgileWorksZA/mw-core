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

## Entity Complexity Assessment

Before starting, assess entity complexity to plan appropriately:

### High-Complexity Entities (e.g., Names, Transactions, Products)
- **50+ fields** with complex relationships
- **Business type hierarchies** (Customer/Debtor, Supplier/Creditor)
- **Conditional field requirements** based on entity subtypes
- **Multiple specialized query patterns** needed
- **Complex validation rules** with interdependencies
- **Time estimate**: 2-3x base implementation time

### Medium-Complexity Entities (e.g., Accounts, Contacts)
- **20-50 fields** with some relationships
- **Simple business rules** without hierarchies
- **Standard CRUD operations** with few specialized queries
- **Straightforward validation** rules
- **Time estimate**: 1.5x base implementation time

### Simple Entities (e.g., TaxRate, Departments)
- **<20 fields** with minimal relationships
- **Clear business rules** without conditionals
- **Basic CRUD operations** only
- **Simple validation** rules
- **Time estimate**: 1x base implementation time

## Implementation Phases

### Phase 0: Pre-Implementation Analysis
1. **Analyze Staging Ontology** (`staging/generated/moneyworks-{entity}-canonical-ontology.ts`)
   - Check DSL completeness (>90% required)
   - Verify all MW fields captured with correct types
   - Ensure MW terminology preserved (no generic terms)
   - Check relationships documented
   - Assess architectural understanding
   - Grade: A- or better to proceed
2. **Complexity Assessment**
   - Count fields and assess complexity
   - Identify business type hierarchies
   - Document conditional requirements
   - Plan MCP tool granularity

### Phase 0.5: Field Metadata Structure Design
- **MANDATORY for entities with 50+ fields**
- Create comprehensive field metadata interface (like `MoneyWorksNameField`)
- Include: fieldName, dataType, maxLength, description, required, indexed, relatedEntity, validationRules
- Essential for validation, UI generation, and documentation
- Identify indexed fields for efficient search operations
- Document conditional requirements (e.g., RecAccount required IF CustomerType=2)

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
- **Plan for client-side filtering** when MW search expressions are limited:
  ```typescript
  // MW search is limited - implement hybrid approach
  const baseFilter = buildMWFilter(typeConstraints);
  const allRecords = await this.find(baseFilter, { limit: 1000 });
  const filtered = allRecords.filter(r => /* JS filtering */);
  ```
- Update package exports

### Phase 4: CLI Package
- Add entity commands (list, get, create, update, delete)
- Handle relationships in CLI interface
- Add to CLI help system
- Test with real MoneyWorks connections

### Phase 5: MCP-Server Package
- Create multiple specialized tools per entity (search, get by type, update fields)
- **Design tools around business workflows, not just CRUD**:
  - Type-specific tools (e.g., mw_get_customers, mw_get_debtors)
  - Business function tools (e.g., mw_update_credit_limit, mw_put_on_hold)
  - Reporting tools (e.g., mw_get_balances_summary, mw_get_overdue_debtors)
- Group related tools together in single file
- Use descriptive tool names with mw_ prefix
- Include comprehensive parameter validation
- **High-complexity entities need 10-15 tools**, simple entities need 3-5
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
- **Design UI patterns for complex entities**:
  - Type badges for visual classification (Customer vs Debtor)
  - Balance display with accounting conventions (DR/CR)
  - Multi-field search with debouncing
  - Conditional filtering based on entity subtypes
  - Hold status indicators
- Consider pagination early (50 items per page default)
- Integration with related entities
- Add to navigation
- **Complex entities need proportionally more UI patterns**

### Phase 8: Quality Assurance
- Run TypeScript compilation checks on all packages
- Fix any type errors or import issues
- Remove rootDir restrictions in tsconfigs if needed
- Add necessary lib types (DOM for UI packages)
- Ensure all packages work together
- Test with real MoneyWorks connections only

### Phase 9: Documentation
- **Documentation depth scales with complexity**:
  - Simple entities: ~200 lines following tax-rates pattern
  - Medium entities: ~300 lines with more examples
  - Complex entities: ~400+ lines with extensive business rules
- **Key sections for complex entities**:
  - Business type hierarchies with clear distinctions
  - Conditional field requirements
  - Common mistake patterns specific to the entity
  - Troubleshooting guide for validation errors
  - Multiple code examples for each subtype
- Developer guide with integration examples
- API documentation
- UI user guide
- Document required MW test data setup
- Include relationship diagrams if applicable
- Update main docs (canonical overview, navigation)

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

## Lessons Learned from Names Implementation

### 1. Repository Search Strategy
- **MoneyWorks search expressions are very limited**
- Implement hybrid approach: MW filtering for types, JS filtering for text
- Set reasonable fetch limits (1000 records) to avoid performance issues
- Document search limitations clearly

### 2. MCP Tool Design
- Names needed 12 tools vs 3 for TaxRate
- Design around business workflows, not just data access
- Group tools by function (search, type-specific, business operations)
- Include specialized reporting tools for complex entities

### 3. UI Complexity
- Complex entities need sophisticated visual patterns
- Type badges, status indicators, balance displays
- Multi-field search with proper debouncing
- Consider mobile responsiveness early

### 4. Documentation Requirements
- Complex entities need 2x documentation
- Focus on business rule interactions
- Include extensive troubleshooting sections
- Provide examples for each entity subtype

### 5. Field Metadata Importance
- With 108 fields, metadata structure was critical
- Helps identify searchable fields
- Enables UI generation
- Supports validation logic

## Notes
- Each phase builds on previous phases
- Quality assurance is critical between phases
- Keep TypeScript configurations flexible for monorepo
- Document MW test data requirements clearly
- Consider entity relationships early in design
- **Budget extra time for high-complexity entities**
- **No mock data ever - it causes more problems than it solves**