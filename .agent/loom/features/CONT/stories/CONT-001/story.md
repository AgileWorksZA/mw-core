# CONT-001: Implement MoneyWorks Contact Entity (API-Only)

## Why (Root Motivation)

Enable complete contact management for organizations requiring more than 2 contacts per customer/supplier, supporting complex B2B relationships with role-based contact lookup and communication tracking.

**5 Whys Analysis:**
1. Why? Need Contact entity support in the SDK
2. Why? Names table only has Contact1/Contact2 - limited to 2 contacts per Name
3. Why? Complex organizations (enterprises, government, multi-department) have 3+ contacts
4. Why? B2B relationships require role-based contact lookup (Payables, Receivables, Technical, Management)
5. Root: **Enable reliable customer/supplier communication through role-based contact management for complex organizational structures**

## Description

Full backend implementation of the MoneyWorks Contact entity following the established pattern from Product and Account entities (ACCT-001). This is API-only (web app removed).

**Key Characteristics:**
- Contacts are a **subfile of Names** (hierarchical via ParentSeq -> Names.Seq)
- Provides **unlimited contacts** per Name (vs Names' 2-contact limitation)
- Enhanced field capacities for international operations (Contact: 39 chars, Mobile: 19 chars)
- **Role bit-mapping** for function-based contact classification (16 user-definable roles)
- Legacy Contact1/Contact2 compatibility via special role bits (#10000, #20000)

**Architecture:**
```
Names (Parent)
  |
  +-- Contact1, Contact2 (embedded, fast access)
  |
  +-- Contacts subfile (unlimited, via ParentSeq)
        +-- Role bit-mapping (Payables, Receivables, Technical, Management, etc.)
```

## Acceptance Criteria

- [ ] **AC-001**: Canonical types defined in packages/canonical/src/entities/contacts/ with MoneyWorksContact interface, MoneyWorksContactRoles enum, and ContactCode branded type
- [ ] **AC-002**: ContactRepository extends BaseMoneyWorksRepository with postProcess() for numeric/boolean parsing and prepare() for MW format conversion
- [ ] **AC-003**: ContactRepository includes specialized query methods: findByParentSeq(), findByNameCode(), findByRole(), findByEmail()
- [ ] **AC-004**: ContactController extends BaseTableController and is registered in TableRegistry - Contact appears in GET /api/v1/tables 'available' list
- [ ] **AC-005**: TypeScript compilation passes with zero errors (bun run typecheck)
- [ ] **AC-006**: Role bit-mapping utilities available for encoding/decoding contact roles (16-bit field with legacy Contact1/Contact2 support)

## Weave Knowledge

**Patterns Applied:**
- `E:9-step-entity-implementation-pattern` - Complete entity requires 9 files across canonical/data/api packages
- `E:table-registry-registration-pattern` - Controller MUST be registered to appear in 'available' list
- `E:triple-export-registration-pattern` - Repository needs export in 3 locations
- `E:canonical-dsl-pattern` - Preserve exact MW terminology (ParentSeq, not parentId)
- `E:branded-types-pattern` - Use ContactCode branded type

**Pain Points to Avoid:**
- `Q:triple-export-registration-pain` - Remember all 3 export locations for repository
- Avoid translating MW field names (eMail not email, ParentSeq not parentId)

**Reference Implementation:**
- ACCT-001: Account entity implementation (same pattern)
- NameRepository: Parent entity relationship (Contacts link to Names)
- staging/generated/moneyworks-contact-roles-canonical-complete.ts: Role utilities

## Complexity: Moderate

**Rationale:**
- 5-10 files across 3 packages (canonical, data, api)
- Parent-child relationship adds complexity (ParentSeq -> Names.Seq)
- Role bit-mapping requires additional utilities
- Testing integration with Names table
- Estimated: 4-8 hours

## Priority: High

**Rationale:**
- Names entity already implemented - Contact is natural extension
- Blocks complete customer/supplier data access
- Required for B2B communication workflows
- Existing canonical ontology and role definitions available in staging/

## Notes

**MoneyWorks-Specific Considerations:**
1. Table name is "Contacts" (not "Contact") in MoneyWorks
2. Primary key behavior: Contacts don't have a simple Code field - use ParentSeq + Order combination
3. Email field is "eMail" (exact casing matters for MW API)
4. Role field is bit-mapped (16-bit for user roles + extended bits for Contact1/Contact2)

**Field Capacity vs Names:**
- Contact name: 39 chars (vs Names.Contact 25 chars) - BETTER
- Email: 63 chars (vs Names.email 80 chars) - WORSE
- Mobile: 19 chars (vs Names.Mobile 14 chars) - BETTER

**Existing Assets to Leverage:**
- `staging/generated/moneyworks-contacts-canonical-ontology.ts` - Complete field definitions
- `staging/generated/moneyworks-contact-roles-canonical-complete.ts` - Role utilities
- `dx-docs/entities/contacts.md` - Documentation
