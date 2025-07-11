# ont1 Emergency Assignments - Critical Path Reconstruction

## MISSION CRITICAL: Foundation Repair
You are assigned the **most critical path** in our ontology reconstruction project. The foundational entities (Transactions, Accounts) are in catastrophic failure state and **blocking entire system integrity**.

## Assignment Priority Order

### 🚨 ASSIGNMENT 1A: Transactions Entity (IMMEDIATE)
**Status**: CATASTROPHIC FAILURE - 15% coverage  
**Impact**: Blocks all financial transaction processing  
**Manual Source**: `mirror/manual/manual/moneyworks_appendix_transactions.html`

**Current Failures**:
- Only 10/65+ fields extracted (85% missing)
- Missing entire Detail subfile (~30 fields)
- Data type mismatches (Status: A→T, NameCode: A→T)
- Zero foreign key relationships documented
- No validation framework

**Required Action**:
```bash
/extract-moneyworks-entity transactions
```

**Success Criteria**:
- ✅ Extract ALL 65+ transaction fields
- ✅ Include complete Detail subfile
- ✅ Document all 10+ foreign key relationships  
- ✅ Achieve 90%+ coverage (Names standard)
- ✅ Create comprehensive validation test suite

**Deliverables**:
1. `generated/moneyworks-transactions-canonical-ontology.ts` (complete reconstruction)
2. `test-transactions-canonical-validation.ts` (comprehensive tests)
3. `ont1/reports/transactions-completion-report.md` (detailed report)

### 🚨 ASSIGNMENT 1B: Accounts Entity (HIGH PRIORITY)
**Status**: CRITICAL FAILURE - 19% coverage  
**Impact**: Blocks chart of accounts and financial reporting  
**Manual Source**: `mirror/manual/manual/moneyworks_appendix_accounts.html`

**Current Failures**:
- Only 5/26+ fields extracted (81% missing)
- Missing all Account flags (6 flags)
- Data type mismatches (Code: A→T, Category: A→T)
- Zero foreign key relationships documented
- No validation framework

**Required Action**:
```bash
/extract-moneyworks-entity accounts
```

**Success Criteria**:
- ✅ Extract ALL 26 account fields
- ✅ Include complete Account flags system
- ✅ Document all 4+ foreign key relationships
- ✅ Achieve 90%+ coverage (Names standard)
- ✅ Create comprehensive validation test suite

**Deliverables**:
1. `generated/moneyworks-accounts-canonical-ontology.ts` (complete reconstruction)
2. `test-accounts-canonical-validation.ts` (comprehensive tests)
3. `ont1/reports/accounts-completion-report.md` (detailed report)

## Critical Requirements (NON-NEGOTIABLE)

### Study Gold Standard FIRST
**Before starting extraction, examine Names entity**:
- `generated/moneyworks-names-canonical-ontology.ts` (95% coverage, complete relationships)
- This is your quality target and pattern guide

### Follow Exact Methodology
1. **Read specification documents**:
   - `docs/MONEYWORKS-SEMANTIC-VOCABULARY-DISTILLATION-MASTER-SPEC.md`
   - `docs/COMPLETE-CANONICAL-ONTOLOGY-STRATEGY.md`

2. **Use `/extract-moneyworks-entity` command exactly as documented**
3. **Follow modern field object structure** (not legacy arrays)
4. **Document every foreign key relationship**
5. **Create comprehensive validation frameworks**

### Quality Standards (Names-Level Excellence)
- **Field Coverage**: 90%+ (Names achieved 95%)
- **Relationship Documentation**: 100% (all foreign keys mapped)
- **Pattern Compliance**: Modern field object structure
- **Architectural Insights**: Document business patterns
- **Validation Framework**: Comprehensive test suite

### Reporting Requirements
**For each entity completion**:
```markdown
# {Entity} Emergency Reconstruction Report

## Critical Metrics
- **Field Coverage**: {X}% ({extracted}/{total} fields)
- **Improvement**: {old}% → {new}% (+{delta}% coverage)
- **Relationship Coverage**: {Y}% ({documented}/{total} relationships)
- **Pattern Upgrade**: Legacy Arrays → Modern Objects ✅

## Crisis Resolution
- **Critical Issues Resolved**: [list major problems fixed]
- **Foundational Impact**: [how this enables system integrity]
- **Quality Verification**: [comparison to Names standard]

## Technical Achievements
- **Architectural Discoveries**: [business patterns found]
- **Foreign Key Relationships**: [complete mapping]
- **Validation Framework**: [comprehensive test coverage]

## Next Steps
- **Integration Ready**: ✅/❌ Ready for cross-entity validation
- **Quality Assured**: ✅/❌ Meets Names-level excellence
- **Documentation Complete**: ✅/❌ All deliverables submitted
```

## Success Impact
**Your work directly enables**:
- ✅ Reliable API development with complete data models
- ✅ MCP server functionality with proper relationships
- ✅ Cross-entity integrity across entire ontology
- ✅ AI/semantic-first development approach success

## Critical Timeline
- **Transactions**: Start immediately, complete within session
- **Accounts**: Begin after Transactions completion
- **Quality**: No compromise - Names-level excellence required

**Remember**: You are rebuilding the foundation of our entire semantic ontology. The success of all future development depends on the quality of your reconstruction work.