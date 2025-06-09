# Parallel Processing Guide for MoneyWorks Entity Generation

## Overview
This guide enables multiple Claude instances to work simultaneously on different MoneyWorks entities, following the established pattern and maintaining consistency.

## Current Status
- **Primary Claude (this instance):** Account entity + coordination
- **Available for assignment:** Transaction, Product, Ledger entities
- **Pattern established:** Name entity (complete reference implementation)

## Entity Assignment

### Claude Instance Roles
```yaml
Primary (Claude-1): 
  - Account entity generation
  - Quality control and coordination
  - Integration validation
  - Progress tracking

Claude-2:
  - Transaction entity generation
  - Documentation: mirror/manual/*transaction*
  - Priority: Critical

Claude-3:
  - Product entity generation  
  - Documentation: mirror/manual/*product*
  - Priority: High

Claude-4:
  - Ledger entity generation
  - Documentation: mirror/manual/*ledger*
  - Priority: High
```

## Standard Working Instructions

### For Each Assigned Claude Instance

#### Step 1: Read Documentation
```bash
# Your assigned documentation files will be in:
mirror/manual/moneyworks_appendix_[your_entity].html

# Example for Transaction entity:
mirror/manual/moneyworks_appendix_transactions.html
```

#### Step 2: Follow the Name Entity Pattern
Use `generated/name.ts` as your reference template. Every entity should include:

1. **Header with source documentation URL**
2. **Semantic enums for all constrained fields**
3. **Complete interface with JSDoc comments**
4. **Utility functions** (isX, getXLabel, etc.)
5. **Validation functions** with field constraints
6. **Query builder class** for type-safe queries
7. **Type guards** where applicable

#### Step 3: Generate Your Entity File
Create `generated/[entity-name].ts` following this structure:

```typescript
/**
 * MoneyWorks [Entity] Entity - Generated from Official Documentation
 * Source: https://secure.cognito.co.nz/manual/moneyworks_appendix_[entity].html
 */

// Enums (semantic types)
export enum [Entity]Type { ... }
export enum [Entity]Status { ... }

// Main interface  
export interface [Entity] { ... }

// Utility functions
export function is[Entity](...) { ... }

// Validation
export function validate[Entity](...) { ... }

// Query builder
export class [Entity]QueryBuilder { ... }
```

#### Step 4: Update Entity Mappings
Add your entity to `entity-mappings.yaml`:

```yaml
entities:
  [YourEntity]:
    description: "Brief description"
    primary_definition: "mirror/manual/moneyworks_appendix_[entity].html"
    status: "complete"
    last_updated: "[date]"
    coverage: 100
    key_semantic_fields:
      [FieldName]:
        source_section: "Field definition section"
        enum_values: {...}
```

#### Step 5: Submit for Review
1. Create your entity file
2. Update entity-mappings.yaml
3. Test compilation (if possible)
4. Document any issues or missing information

## Quality Standards

### Required Elements
- [ ] **Complete field coverage** (100% of documented fields)
- [ ] **Semantic enums** for all constrained values
- [ ] **Field validation** with size and type constraints
- [ ] **JSDoc comments** with field descriptions
- [ ] **Query builders** for type-safe searching
- [ ] **Utility functions** for business logic
- [ ] **Source attribution** in file header

### Naming Conventions
- **Enums:** PascalCase (`CustomerType`, `TransactionStatus`)
- **Interfaces:** PascalCase (`Name`, `Account`, `Transaction`)
- **Functions:** camelCase (`validateName`, `queryAccounts`)
- **Files:** kebab-case (`name.ts`, `account.ts`)

### Documentation Standards
- **Field comments:** Include max length and semantic meaning
- **Enum values:** Include descriptive comments
- **Source citations:** Link back to original documentation
- **Examples:** Provide usage examples where helpful

## Entity-Specific Instructions

### Transaction Entity (Claude-2)
**Complexity:** High (100+ fields, multiple types)
**Key Enums:** TransactionType, Status, ApprovalStatus
**Focus Areas:**
- Transaction type classifications
- Status workflow states
- Financial validation rules
- Multi-currency handling

### Product Entity (Claude-3)  
**Complexity:** Medium (60+ fields, pricing levels)
**Key Enums:** ProductType, Unit types, Pricing levels
**Focus Areas:**
- Inventory classifications
- Pricing structures (A-F levels)
- Unit conversions
- Stock tracking

### Ledger Entity (Claude-4)
**Complexity:** High (80+ fields, GL integration)
**Key Enums:** EntryType, Source, Status
**Focus Areas:**
- General ledger entry types
- Account relationships
- Balancing requirements
- Audit trail

## Coordination Protocol

### Communication
- **Progress updates:** Comment in relevant entity files
- **Issues found:** Document in entity-mappings.yaml
- **Questions:** Add as TODO comments in generated files
- **Completion:** Update status in progress tracking

### File Conflicts
- **Entity files:** No conflicts (separate files per entity)
- **Shared files:** Only Primary Claude updates entity-mappings.yaml
- **Documentation:** Each Claude works on separate docs

### Integration Testing
Primary Claude will:
1. Compile all generated entities
2. Test Level-0 API integration
3. Validate cross-entity relationships
4. Coordinate any required changes

## Success Criteria

### Per Entity (Each Claude)
- [ ] TypeScript compiles without errors
- [ ] All documented fields included
- [ ] Semantic enums for constrained fields
- [ ] Validation functions work correctly
- [ ] Query builders generate valid MoneyWorks queries
- [ ] Documentation is complete and accurate

### Overall Project (Primary coordination)
- [ ] All entities integrate with Level-0 API
- [ ] No naming conflicts between entities
- [ ] Consistent patterns across all entities
- [ ] Documentation is synchronized

## Example Reference: Name Entity

See `generated/name.ts` for the complete reference implementation:
- **Lines 1-10:** Header and documentation
- **Lines 11-60:** Semantic enums with comments  
- **Lines 61-400:** Complete interface with JSDoc
- **Lines 401-450:** Utility functions
- **Lines 451-500:** Validation logic
- **Lines 501-540:** Query builder class

This is the gold standard that all entities should match in structure and quality.

## Start Command

Each Claude instance should begin with:

```bash
# Check documentation availability
ls -la mirror/manual/*[your_entity]*

# Review reference implementation  
cat generated/name.ts | head -50

# Start generation
# [Begin reading your assigned documentation and generating the entity]
```

---

**Ready for parallel processing!** 🚀

Each Claude instance can now work independently while maintaining consistency and quality across all entities. 