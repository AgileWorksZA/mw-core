# Extract MoneyWorks Entity

Extract a MoneyWorks entity canonical ontology following our established semantic vocabulary distillation methodology.

## Usage

```
/extract-moneyworks-entity <entity_name>
```

Examples:
- `/extract-moneyworks-entity departments`
- `/extract-moneyworks-entity assets`
- `/extract-moneyworks-entity contacts`

## Parameters

- `entity_name`: The MoneyWorks entity to extract (lowercase, e.g., "departments", "assets", "contacts")

## Command Implementation

You are continuing the MoneyWorks Semantic Vocabulary Distillation project. 

**Current Context:**
- Project: MoneyWorks Core semantic ontology extraction
- Location: `/Users/hjonck/Development/gitprojects/AgileWorksZA/mw-core`
- Master Specification: `docs/MONEYWORKS-SEMANTIC-VOCABULARY-DISTILLATION-MASTER-SPEC.md`
- Progress Tracking: `docs/COMPLETE-CANONICAL-ONTOLOGY-STRATEGY.md`

**Foundational Entities Complete (6/17-20, ~35% progress):**
1. ✅ Transactions (17 types) - Financial transaction system
2. ✅ Accounts (10 types) - Chart of accounts with system accounts  
3. ✅ Names (Customer/Debtor, Supplier/Creditor) - Hierarchical classification
4. ✅ Products (Enterprise inventory, 69 fields) - Complex pricing matrices
5. ✅ TaxRates (International compliance, 17 fields) - Dual-rate, multi-tier
6. ✅ Jobs (Project management, 34 fields) - Hierarchical structure, client integration

**Key Architectural Discoveries:**
- MoneyWorks canonical terminology (Creditor not Supplier, Debtor not Customer)
- Three-layer semantic architecture (Canonical → Business → Domain)
- Entity relationship networks and complex interdependencies
- Cross-business universality validation methodology
- Enterprise-grade capabilities (inventory, tax compliance, project management)

Now extract the **{{entity_name}}** entity canonical ontology from MoneyWorks manual following our established semantic vocabulary distillation methodology.

## CRITICAL REQUIREMENTS:
- 100% MoneyWorks terminological purity (use ONLY canonical terms from manual)
- Complete field coverage (extract ALL fields with exact data types, lengths, constraints)
- Entity relationship mapping (identify all references to other MoneyWorks entities)
- Cross-business universality validation (test across restaurant, legal, construction, consulting domains)
- Comprehensive validation framework (create test suite with 100% field coverage)

## MULTI-ENTITY FILE GUARD:
⚠️ **IMPORTANT**: Check if the manual page contains multiple distinct entities in one file:
- If multiple entities detected: Extract EACH entity separately maintaining terminological purity
- Create separate ontology files for each entity: moneyworks-[entity1]-canonical-ontology.ts, moneyworks-[entity2]-canonical-ontology.ts
- Include WARNING in output: "Multi-entity file detected - extracted [X] distinct entities to prevent DSL pollution"
- Validate that entities don't share conflicting terminology or field definitions
- Document entity boundaries clearly in session summary

## METHODOLOGY:
1. Deep manual reading: `/Users/hjonck/Development/gitprojects/AgileWorksZA/mw-core/mirror/manual/manual/moneyworks_appendix_{{entity_name}}.html`
2. **Entity boundary analysis**: Identify if single vs multiple entities in file
3. Extract canonical definitions following established patterns from Products, TaxRates, Jobs, Names entities
4. Generate appropriate ontology files (single or multiple based on analysis)
5. Create comprehensive validation tests for each entity
6. Update integration files and document discoveries

## PURITY PRINCIPLES:
- Use MoneyWorks canonical terminology exclusively (Creditor not Supplier, Debtor not Customer)
- Maintain three-layer architecture (Canonical → Business → Domain)
- Prevent domain pollution (no industry-specific terms in canonical layer)
- Ensure universal business applicability (works for ANY business type)
- Complete manual traceability (every concept citable to exact manual source)
- **Entity separation**: Keep distinct entities in separate files to prevent cross-pollution

## VALIDATION REQUIREMENTS:
- Business scenario testing across multiple domains
- Entity relationship integrity checking
- Terminological consistency validation
- Cross-entity reference verification
- Field coverage completeness confirmation
- **Multi-entity validation**: If multiple entities, validate each independently

## OUTPUT FILES (CONDITIONAL):
**Single Entity:**
- `generated/moneyworks-{{entity_name}}-canonical-ontology.ts`
- `test-{{entity_name}}-canonical-validation.ts`
- `docs/SESSION-{{ENTITY_NAME}}-EXTRACTION-SUMMARY.md`

**Multiple Entities (with warning):**
- `generated/moneyworks-[entity1]-canonical-ontology.ts`
- `generated/moneyworks-[entity2]-canonical-ontology.ts`
- `test-[entity1]-canonical-validation.ts`
- `test-[entity2]-canonical-validation.ts`
- `docs/SESSION-[ENTITY1-ENTITY2]-EXTRACTION-SUMMARY.md` (with multi-entity warning)

**Always Update:**
- `generated/moneyworks-canonical-ontology.ts` (integrate all entities)
- `docs/COMPLETE-CANONICAL-ONTOLOGY-STRATEGY.md` (update progress)

## DSL POLLUTION PREVENTION:
- Separate entity definitions prevent terminology conflicts
- Clear entity boundaries maintain semantic clarity
- Individual validation ensures entity-specific purity
- Warning documentation alerts to multi-entity complexity

Follow the exact patterns established in our foundational phases. If multi-entity file detected, prioritize DSL purity through separation over file consolidation. Document all discoveries and ensure 100% compliance with MoneyWorks semantic purity framework.

## Success Criteria:
✅ Complete field extraction with 100% coverage
✅ Cross-business universality validation
✅ Entity relationship mapping documented
✅ Comprehensive test suite created
✅ Terminological purity maintained
✅ Progress tracking updated
✅ Session summary documented