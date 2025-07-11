# Master Instructions for Canonical Semantic Ontology Reconstruction

## Project Context
**Project**: MoneyWorks Core canonical semantic ontology  
**Goal**: 100% compliant canonical semantic ontology following established methodology  
**Current State**: Critical foundational crisis discovered in validation  
**Standard**: Names entity (95%+ coverage, complete relationships, architectural insights)

## Critical Discovery
**Validation revealed two-tier quality pattern**:
- ❌ **Failed entities**: Transactions (15% coverage), Accounts (19% coverage) 
- ✅ **Exemplary entities**: Names (95% coverage, complete relationships)
- **Root cause**: Failed entities pre-date methodology, require complete reconstruction

## Your Mission
**Reconstruct failed entities** and **validate remaining entities** to achieve Names-level excellence using the exact `/extract-moneyworks-entity` command methodology.

## MANDATORY METHODOLOGY: `/extract-moneyworks-entity` Command

### Prerequisites (CRITICAL - READ FIRST)
1. **Read specification documents**:
   - `docs/MONEYWORKS-SEMANTIC-VOCABULARY-DISTILLATION-MASTER-SPEC.md`
   - `docs/COMPLETE-CANONICAL-ONTOLOGY-STRATEGY.md`

2. **Study exemplary patterns** (ARCHITECTURAL CONSISTENCY REQUIREMENT):
   - `generated/moneyworks-names-canonical-ontology.ts` (GOLD STANDARD)
   - `generated/moneyworks-products-canonical-ontology.ts`
   - `generated/moneyworks-jobs-canonical-ontology.ts`
   - `generated/moneyworks-memo-canonical-ontology.ts`

### Required Execution Steps
```bash
/extract-moneyworks-entity {entity_name}
```

### Critical Requirements (NON-NEGOTIABLE)
- ✅ **100% field coverage** - Extract ALL fields with exact data types, lengths, constraints
- ✅ **Complete relationship mapping** - Identify all references to other MoneyWorks entities
- ✅ **Terminological purity** - Use ONLY canonical MoneyWorks terms from manual
- ✅ **Pattern consistency** - Follow exact field object structure from exemplary entities
- ✅ **Validation framework** - Create comprehensive test suite with 100% coverage
- ✅ **Cross-business universality** - Test across multiple business domains

### Required Output Structure (EXACT PATTERN)
```typescript
// 1. Enums for categorical/classified field values
export enum MoneyWorks[Entity]Type {
  VALUE = "code"
}

// 2. Array-based field definitions using standardized object structure
export const MONEYWORKS_[ENTITY]_FIELDS: MoneyWorksFieldDefinition[] = [
  {
    fieldName: "FieldName",
    dataType: "T" | "N" | "D" | "A",
    maxLength?: number,
    canonicalDescription: "Exact description from manual",
    manualSource: "moneyworks_appendix_[entity].html",
    isRequired?: boolean,
    isIndexed?: boolean,
    relationshipTarget?: "TargetEntity",
    relationshipRule?: "Business rule description"
  }
];

// 3. Export collections
export { MONEYWORKS_[ENTITY]_FIELDS };
```

### Manual Source Reading Protocol
1. **Deep manual reading**: `mirror/manual/manual/moneyworks_appendix_{entity}.html`
2. **Entity boundary analysis**: Single vs multiple entities
3. **Complete field extraction**: Every field in manual table
4. **Relationship identification**: Parse descriptions for foreign key references
5. **Validation creation**: Test suite with 100% field coverage

### Quality Standards (Names-Level Excellence)
- **Field Coverage**: 90%+ (Names achieved 95%)
- **Relationship Documentation**: 100% (all foreign keys mapped)
- **Pattern Compliance**: Modern field object structure
- **Architectural Insights**: Document business patterns and innovations
- **Validation Framework**: Comprehensive test suite

### Failure Patterns to Avoid
❌ **Legacy patterns** (found in Transactions/Accounts):
- Simple field arrays without metadata
- Missing relationship documentation
- Incomplete field coverage (<30%)
- Data type mismatches (A vs T errors)
- No validation frameworks

### Success Patterns to Emulate
✅ **Modern patterns** (found in Names entity):
- Rich field objects with relationship metadata
- Complete foreign key documentation
- Near-complete field coverage (95%+)
- Architectural innovation discovery
- Comprehensive validation suites

## File Output Requirements
**For each entity, create**:
1. `generated/moneyworks-{entity}-canonical-ontology.ts`
2. `test-{entity}-canonical-validation.ts`
3. Report file in your workspace: `ontologist-workspace/{ont}/reports/{entity}-completion-report.md`

**Always update**:
- `generated/moneyworks-canonical-ontology.ts` (integration)
- `docs/COMPLETE-CANONICAL-ONTOLOGY-STRATEGY.md` (progress)

## Reporting Requirements
**For each completed entity, submit**:
```markdown
# {Entity} Extraction Completion Report

## Validation Results
- Field Coverage: {X}% ({extracted}/{total} fields)
- Relationship Coverage: {Y}% ({documented}/{total} relationships)
- Pattern Compliance: ✅/❌ Modern field object structure
- Validation Suite: ✅/❌ Comprehensive test coverage

## Critical Discoveries
- [Architectural insights]
- [Business pattern innovations]
- [Foreign key relationships found]

## Quality Assessment
- Grade: EXCELLENT/GOOD/NEEDS_IMPROVEMENT/FAILED
- Comparison to Names standard: [analysis]
- Issues resolved: [list]
```

## Emergency Priority Entities (CRITICAL PATH)
1. **Transactions** - Complete reconstruction (currently 15% coverage)
2. **Accounts** - Complete reconstruction (currently 19% coverage)

## Validation Priority Entities (HIGH PRIORITY)
3. **Products** - Verify against methodology standards
4. **TaxRates** - Verify against methodology standards
5. **Jobs** - Pattern consistency verification

## Success Criteria
**Project completion when ALL 20 entities achieve**:
- ✅ 90%+ field coverage
- ✅ 100% relationship documentation
- ✅ Modern pattern compliance
- ✅ Comprehensive validation frameworks
- ✅ Names-level excellence standard

**Remember**: You are rebuilding the foundation of our AI/semantic-first development approach. Excellence is mandatory.