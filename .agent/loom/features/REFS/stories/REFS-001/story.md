# REFS-001: Implement Job, Category1, and Category2 Reference Tables

## Why (Root Motivation)

Enable complete data validation and lookup across the SDK by implementing the reference tables that Products, Transactions, and Accounts depend on for categorization and job costing workflows.

**5 Whys Analysis:**
1. Why? Products and Transactions reference JobCode, Category1, Category2 fields
2. Why? Users need to validate these references exist before saving
3. Why? Invalid references cause data integrity issues in MoneyWorks
4. Why? Broken job costing and categorization breaks financial reporting
5. Root: **Complete data integrity requires reference table validation**

## Description

Implement three simple MoneyWorks reference/lookup tables following the established 9-step entity implementation pattern:

1. **Job** - Project/job costing table
   - Primary key: Code
   - Key fields: Code, Description, Status, Customer, Budget, Actual
   - Used by: Transaction.Detail.JobCode, Product.JobPricingMode

2. **Category1** - Primary categorization table
   - Primary key: Code
   - Key fields: Code, Description
   - Used by: Product.Category1, Account.Category

3. **Category2** - Secondary categorization table
   - Primary key: Code
   - Key fields: Code, Description
   - Used by: Product.Category2, Account.Category2

These are simpler entities than Transaction or Contact - they're essentially lookup tables with Code/Description patterns.

## Acceptance Criteria

- [ ] **AC-001**: Job entity has canonical types defined in packages/canonical/src/entities/jobs/ with MoneyWorksJob interface, enums (JobStatus), and relevant branded types
- [ ] **AC-002**: Category1 entity has canonical types defined in packages/canonical/src/entities/category1/ with MoneyWorksCategory1 interface (Code, Description fields)
- [ ] **AC-003**: Category2 entity has canonical types defined in packages/canonical/src/entities/category2/ with MoneyWorksCategory2 interface (Code, Description fields)
- [ ] **AC-004**: JobRepository, Category1Repository, and Category2Repository extend BaseMoneyWorksRepository with postProcess() and prepare() methods
- [ ] **AC-005**: JobRepository includes specialized query methods: findByCode(), findActiveJobs(), findByStatus()
- [ ] **AC-006**: All three entities appear in GET /api/v1/tables 'available' list (removed from 'upcoming')
- [ ] **AC-007**: TypeScript compilation passes with zero errors (bun run typecheck)

## Weave Knowledge

**Patterns Applied:**
- `E:9-step-entity-implementation-pattern` - Follow the 9-step checklist for each entity
- `E:5-file-canonical-pattern` - Use enums -> types -> fields -> validators -> index structure
- `E:table-registry-registration-pattern` - Must register controllers to appear in 'available'
- `E:triple-export-registration-pattern` - Update all 3 export locations for repositories

**Pain Points to Avoid:**
- `Q:triple-export-registration-pain` - Remember to update repositories/index.ts, main index.ts, AND factory functions

**Best Practices:**
- `Π:reference-implementation-pattern` - Use Account entity (ACCT-001) as reference implementation

**Reference Implementation:**
Account entity from ACCT-001 provides the template structure. Category1/Category2 are even simpler - just Code/Description lookup tables.

## Complexity: Moderate

- 3 entities x 9 steps = 27 implementation steps
- But entities are simple (lookup tables vs complex entities like Transaction)
- Category1/Category2 are nearly identical - can reuse pattern
- Estimated: 4-8 hours with parallelization

## Priority: Medium

- Not blocking core workflows
- Enables better data validation and completeness
- Good for SDK completeness story

## Notes

- Category1 and Category2 may have nearly identical structures - evaluate if they can share a base type
- Job is more complex with status, budget tracking, customer relationships
- All three currently in TableRegistry.upcoming array - move to registered after implementation
