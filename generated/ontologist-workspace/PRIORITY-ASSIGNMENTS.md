# Priority Assignments - Ontologist Work Distribution

## Assignment Strategy
**ont1**: Emergency reconstruction (failed foundational entities)  
**ont2**: Validation and enhancement (existing entities)  
**Coordination**: Parallel execution with quality cross-validation

## CRITICAL PATH ASSIGNMENTS (EMERGENCY)

### ont1 - Emergency Reconstruction
**Priority**: CRITICAL - These entities are blocking entire system integrity

#### Assignment 1A: Transactions Entity
- **Status**: CATASTROPHIC FAILURE (15% coverage)
- **Manual Source**: `moneyworks_appendix_transactions.html`
- **Current Problem**: Only 10/65+ fields extracted, missing Detail subfile
- **Required Action**: Complete reconstruction using `/extract-moneyworks-entity transactions`
- **Success Criteria**: 90%+ coverage, all relationships documented
- **Deadline**: Immediate priority

#### Assignment 1B: Accounts Entity  
- **Status**: CRITICAL FAILURE (19% coverage)
- **Manual Source**: `moneyworks_appendix_accounts.html`
- **Current Problem**: Only 5/26+ fields extracted, missing Account flags
- **Required Action**: Complete reconstruction using `/extract-moneyworks-entity accounts`
- **Success Criteria**: 90%+ coverage, all relationships documented
- **Deadline**: High priority after Transactions

### ont2 - Validation and Strategic Enhancement
**Priority**: HIGH - Verify existing quality and enhance where needed

#### Assignment 2A: Products Entity Validation
- **Status**: UNKNOWN QUALITY (needs validation against standards)
- **Manual Source**: `moneyworks_appendix_products.html`
- **Required Action**: Full validation using `/extract-moneyworks-entity products`
- **Success Criteria**: Verify Names-level excellence or enhance to standard
- **Deadline**: Parallel with ont1 emergency work

#### Assignment 2B: TaxRates Entity Validation
- **Status**: UNKNOWN QUALITY (needs validation against standards)
- **Manual Source**: `moneyworks_appendix_taxrates.html`
- **Required Action**: Full validation using `/extract-moneyworks-entity taxrates`
- **Success Criteria**: Verify Names-level excellence or enhance to standard
- **Deadline**: After Products validation

## SYSTEMATIC COMPLETION ASSIGNMENTS

### Wave 2: Core Business Entities
**After emergency reconstruction complete**

#### ont1 Assignments (Wave 2)
- **Jobs Entity**: Pattern consistency verification
- **Departments Entity**: Full methodology application
- **General Classifications**: Multi-entity boundary analysis

#### ont2 Assignments (Wave 2)  
- **Assets Entity**: Relationship mapping verification
- **AssetLog Entity**: Hierarchical relationship validation
- **Inventory Entity**: Location-based architecture validation

### Wave 3: Support and Specialized Entities
**Final systematic completion**

#### ont1 Assignments (Wave 3)
- **Contacts Entity**: Subfile relationship validation
- **Payments Entity**: Many-to-many relationship mapping
- **Reconciliation Entity**: Financial control validation

#### ont2 Assignments (Wave 3)
- **User/User2/Login Trilogy**: Authentication architecture
- **Allocations Entity**: Rule-based processing validation  
- **Build Records Entity**: Manufacturing recipe validation
- **Memo Entity**: CRM functionality validation (already excellent)

## COORDINATION REQUIREMENTS

### Quality Cross-Validation
- **ont1 reviews ont2 outputs** for pattern consistency
- **ont2 reviews ont1 outputs** for architectural completeness
- **Both submit quality assessment reports** in coordination folder

### Integration Testing
- **Cross-entity relationship verification** after each wave
- **Foreign key target validation** across all entities
- **Pattern consistency confirmation** throughout project

### Progress Reporting
**Daily**: Update progress in `coordination/progress-tracking/`
**Weekly**: Submit quality assessment summaries
**Entity Completion**: Submit detailed completion reports

## COMMUNICATION PROTOCOL

### Assignment Files
- **ont1**: `ontologist-workspace/ont1/assignments/`
- **ont2**: `ontologist-workspace/ont2/assignments/`

### Reporting Structure
- **Completion Reports**: `{ont}/reports/{entity}-completion-report.md`
- **Quality Reviews**: `coordination/quality-reviews/{entity}-cross-validation.md`
- **Integration Tests**: `coordination/integration-tests/{entity}-relationships.md`

### Escalation Process
- **Blocking Issues**: Report immediately in coordination folder
- **Quality Concerns**: Cross-validate with other ontologist
- **Methodology Questions**: Refer to Names entity gold standard

## SUCCESS METRICS

### Individual Entity Success
- ✅ 90%+ field coverage (Names standard: 95%)
- ✅ 100% relationship documentation
- ✅ Modern pattern compliance
- ✅ Comprehensive validation framework

### Project Success
- ✅ All 20 entities achieve Names-level excellence
- ✅ Complete cross-entity relationship integrity
- ✅ Unified pattern consistency across ontology
- ✅ Ready for AI/semantic-first development approach

## CRITICAL REMINDER
**You are not just extracting entities - you are rebuilding the foundation for our entire AI/semantic-first development strategy. The quality of this work determines the success of all future development efforts.**

**Standard**: Names entity excellence (95% coverage, complete relationships, architectural insights)  
**Tolerance**: Zero compromise on quality standards  
**Timeline**: Emergency reconstruction first, then systematic excellence across all entities