# ont2 Validation Assignments - Strategic Quality Assurance

## MISSION: Quality Validation and Enhancement
You are assigned **strategic quality assurance** for existing entities that may have hidden quality issues similar to Transactions/Accounts. Your role is critical in preventing more foundational crises.

## Assignment Priority Order

### 🔍 ASSIGNMENT 2A: Products Entity Validation (IMMEDIATE)
**Status**: UNKNOWN QUALITY - High risk entity  
**Risk Level**: HIGH - Products is core to inventory/sales systems  
**Manual Source**: `mirror/manual/manual/moneyworks_appendix_products.html`

**Validation Questions**:
- Does it achieve Names-level excellence (95% coverage)?
- Are all foreign key relationships documented?
- Does it follow modern field object structure?
- Is the validation framework comprehensive?

**Required Action**:
```bash
/extract-moneyworks-entity products
```

**Assessment Criteria**:
- **If EXCELLENT** (90%+ coverage): Document validation success
- **If PARTIAL** (30-80% coverage): Enhance to Names standard
- **If FAILED** (<30% coverage): Complete reconstruction required

**Deliverables**:
1. `ont2/reports/products-validation-report.md` (quality assessment)
2. Enhanced/reconstructed ontology if needed
3. Comprehensive validation test suite

### 🔍 ASSIGNMENT 2B: TaxRates Entity Validation (HIGH PRIORITY)
**Status**: UNKNOWN QUALITY - International compliance risk  
**Risk Level**: HIGH - Tax compliance affects all financial transactions  
**Manual Source**: `mirror/manual/manual/moneyworks_appendix_taxrates.html`

**Validation Focus**:
- International tax compliance patterns
- Complex dual-rate, multi-tier structures
- Integration with transaction processing
- Cross-border business universality

**Required Action**:
```bash
/extract-moneyworks-entity taxrates
```

**Deliverables**:
1. `ont2/reports/taxrates-validation-report.md` (compliance assessment)
2. Enhanced ontology if quality gaps found
3. International business validation tests

### 🔍 ASSIGNMENT 2C: Jobs Entity Pattern Verification (MEDIUM PRIORITY)
**Status**: SUSPECTED GOOD QUALITY - Pattern consistency check  
**Focus**: Verify modern pattern compliance and architectural consistency  
**Manual Source**: `mirror/manual/manual/moneyworks_appendix_jobs.html`

**Verification Points**:
- Modern field object structure compliance
- Complete relationship documentation
- Project management pattern accuracy
- Client integration architecture

## Strategic Validation Methodology

### Quality Triage Process
**For each entity, determine**:

1. **Quick Assessment**:
   - Field count: Manual vs ontology
   - Pattern structure: Modern objects vs legacy arrays
   - Relationship presence: Foreign keys documented?

2. **Quality Classification**:
   - **EXCELLENT**: 90%+ coverage, full relationships, modern patterns
   - **GOOD**: 70-89% coverage, most relationships, mixed patterns
   - **PARTIAL**: 30-69% coverage, some relationships, legacy patterns
   - **FAILED**: <30% coverage, no relationships, legacy patterns

3. **Action Determination**:
   - **EXCELLENT**: Validate and document success
   - **GOOD**: Enhance to excellent standard
   - **PARTIAL**: Significant reconstruction required
   - **FAILED**: Complete reconstruction (escalate to emergency)

### Validation Report Template
```markdown
# {Entity} Strategic Validation Report

## Quality Assessment
- **Field Coverage**: {X}% ({extracted}/{total} fields)
- **Manual Analysis**: {total} fields documented in manual
- **Coverage Grade**: EXCELLENT/GOOD/PARTIAL/FAILED
- **Pattern Structure**: Modern Objects/Legacy Arrays/Mixed
- **Relationship Coverage**: {Y}% foreign keys documented

## Comparison to Names Standard
- **Names Coverage**: 95% (gold standard)
- **This Entity**: {X}% coverage
- **Gap Analysis**: {gap}% below/above Names standard
- **Quality Tier**: Same tier/Higher tier/Lower tier

## Strategic Assessment
- **Business Impact**: [HIGH/MEDIUM/LOW] if quality issues exist
- **Development Risk**: [description of API/MCP impacts]
- **Integration Dependencies**: [entities that depend on this one]

## Action Required
- **Status**: VALIDATED/ENHANCE_REQUIRED/RECONSTRUCTION_REQUIRED
- **Priority**: IMMEDIATE/HIGH/MEDIUM/LOW
- **Estimated Effort**: [hours/sessions needed]

## Recommendations
- [Specific actions needed to achieve Names-level excellence]
```

### Cross-Validation Protocol
**Coordinate with ont1**:
- **Share quality findings** for pattern consistency
- **Cross-review outputs** for architectural alignment
- **Validate relationships** that span both your assignments
- **Report integration issues** immediately

## Quality Standards (Names-Level Excellence)
**Your benchmark for all validations**:
- ✅ **Field Coverage**: 90%+ extraction from manual
- ✅ **Relationship Documentation**: 100% foreign keys mapped
- ✅ **Pattern Compliance**: Modern field object structure
- ✅ **Architectural Insights**: Business patterns documented
- ✅ **Validation Framework**: Comprehensive test coverage
- ✅ **Cross-Business Universality**: Works across all business types

## Success Metrics
**Project success depends on your validation**:
- **Early Detection**: Find quality issues before they become crises
- **Prevention**: Stop foundational problems from accumulating
- **Enhancement**: Elevate good entities to excellent standard
- **Assurance**: Provide confidence in ontology quality

## Critical Timeline
- **Products**: Begin immediately (parallel with ont1 emergency work)
- **TaxRates**: Start after Products assessment
- **Jobs**: Pattern verification after TaxRates
- **Quality**: Maintain Names-level excellence standard throughout

**Remember**: You are the quality guardian preventing more foundational crises. Your validation work ensures we achieve 100% canonical semantic ontology excellence across all 20 entities.