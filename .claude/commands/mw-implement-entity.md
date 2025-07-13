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

### Phase 1: Utilities Package (if needed)
- Check if new branded types needed
- Add entity-specific utilities/helpers
- Skip if no special types required

### Phase 2: Canonical Package (`/packages/canonical/src/entities/{entity}/`)
- **types.ts**: MoneyWorks{Entity} interface with all fields
- **fields.ts**: MONEYWORKS_{ENTITY}_FIELDS array
- **validators.ts**: Validation functions
- **enums.ts**: Any MW enums (if applicable)  
- **index.ts**: Public exports
- **README-AI.md**: AI guidance

### Phase 3: Data Package
- **{entity}.repository.ts**: Extend BaseMoneyWorksRepository
- Handle MW relationships (e.g., ParentSeq)
- Add entity-specific query helpers
- Update package exports

### Phase 4: CLI Package
- Add entity commands (list, get, create, update, delete)
- Handle relationships in CLI interface
- Add to CLI help system

### Phase 5: MCP-Server Package
- Add entity tools to MCP server
- Enable LLM access to entity data
- Update MCP documentation

### Phase 6: API Package
- REST endpoints for entity CRUD
- Handle MW relationships in API
- Add OpenAPI documentation

### Phase 7: Web1 Package
- Entity UI components
- Management pages
- Integration with related entities
- Add to navigation

### Phase 8: Documentation
- Developer guide
- API documentation
- UI user guide
- Update main docs

## Entity Compatibility
- ✅ Simple entities (TaxRate)
- ✅ Subfile entities (Contacts → Names)
- ✅ Complex entities (Transactions)
- ✅ All MW data types (T, N, D, S)
- ✅ MW business rules preserved

## Notes
- Always preserve MoneyWorks terminology
- Check relationships and dependencies
- Follow existing patterns from TaxRate implementation
- Each phase builds on previous phases
- After a phase is completed, check it for errors and linting issues and fix as much as possible
- Ensure all packages are compatible with each other
- Always check for compatibility issues before merging into staging
- Make notes of any new requirements or changes that we need to address at the end of each cycle