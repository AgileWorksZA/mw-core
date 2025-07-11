# ont2 Fresh Session Context Brief - Entity Quality Assessment

## 🎯 **MISSION**
Validate remaining entities for development readiness and identify any requiring reconstruction before systematic completion.

## 📚 **ESSENTIAL CONTEXT - READ THESE FIRST**

### **1. Project Foundation Documents**
**READ FIRST**: `/Users/hjonck/Development/gitprojects/AgileWorksZA/mw-core/docs/COMPLETE-CANONICAL-ONTOLOGY-STRATEGY.md`
- Project status: Emergency reconstruction complete, systematic completion in progress
- Quality evolution: 15-19% coverage crisis → 100% standard established

### **2. Methodology Reference**
**READ SECOND**: `/Users/hjonck/Development/gitprojects/AgileWorksZA/mw-core/.claude/commands/extract-moneyworks-entity.md`
- Complete extraction methodology 
- Critical requirements: 100% field coverage, complete relationships
- Success criteria and validation framework

### **3. Your Previous Validation Success**
**READ THIRD**: `/Users/hjonck/Development/gitprojects/AgileWorksZA/mw-core/generated/ontologist-workspace/ont2/reports/`
- `products-validation-report.md` (98.57% coverage - EXCELLENT)
- `taxrates-validation-report.md` (100% coverage - EXCEPTIONAL)  
- `jobs-validation-report.md` (100% coverage - EXCEPTIONAL)

### **4. Quality Standards (Gold Standards)**
**STUDY PATTERNS**:
- `generated/moneyworks-transactions-canonical-ontology.ts` (100% coverage - Emergency reconstruction)
- `generated/moneyworks-accounts-canonical-ontology.ts` (100% coverage - Emergency reconstruction)
- `generated/moneyworks-names-canonical-ontology.ts` (95% coverage - Original standard)

## 📊 **PROJECT STATUS CONTEXT**

### **Completed Entities** (8/20):
1. **Transactions**: 100% ✅ (Emergency reconstruction: 15% → 100%)
2. **Accounts**: 100% ✅ (Emergency reconstruction: 19% → 100%)
3. **Names**: 95% ✅ (Original gold standard, 18 foreign key relationships)
4. **Products**: 98.57% ✅ (Your validation - EXCELLENT)
5. **TaxRates**: 100% ✅ (Your validation - EXCEPTIONAL)
6. **Jobs**: 100% ✅ (Your validation - EXCEPTIONAL)
7. **Departments**: 100% ✅ (ont1 systematic completion)
8. **General Classifications**: 100% ✅ (ont1 systematic completion)

### **Your Previous Achievement**
**Cross-Entity Relationship Validation**: 38 foreign key relationships confirmed
- Names Entity: Major integration hub (18 relationships including dual-layer contacts)
- Enterprise-grade relationship design validated
- Development readiness partially certified

## 🏆 **QUALITY STANDARDS**

### **100% Coverage Standard** (Updated from 90%+)
Based on TaxRates/Jobs benchmark you established:
- Extract ALL fields from manual source
- Complete foreign key relationship mapping
- Modern field object structure with metadata
- Comprehensive validation framework
- Universal business applicability

### **Triage Classification System**
- **100% Coverage**: Validated, ready for development
- **90-99% Coverage**: Enhance to 100% standard
- **<90% Coverage**: Requires reconstruction (like original Transactions/Accounts)

### **Field Object Structure** (Modern Pattern)
```typescript
{
  fieldName: string,
  dataType: "T" | "N" | "D" | "A",
  maxLength?: number,
  canonicalDescription: string,
  manualSource: string,
  isRequired?: boolean,
  isIndexed?: boolean,
  relationshipTarget?: string,
  relationshipRule?: string
}
```

## 🎯 **CURRENT ASSIGNMENT: Remaining Entity Quality Assessment**

### **Entities to Assess** (12 remaining):
- **Assets**, AssetLog, Contacts, Inventory
- Payments, Reconciliation, User, User2, Login
- Allocations, Build Records, Memo

### **Assessment Process**
For each entity:

1. **Read existing ontology file**: `generated/moneyworks-{entity}-canonical-ontology.ts`
2. **Count fields**: Compare ontology vs manual source
3. **Check pattern structure**: Modern objects vs legacy arrays
4. **Verify relationships**: Foreign key documentation exists
5. **Classify quality**: 100%/NEEDS_ENHANCEMENT/NEEDS_RECONSTRUCTION

### **Priority Order**
**Start with Assets** (ont1 is currently processing):
- Validate existing Assets entity quality
- Check relationship integrity with other entities
- Ensure no foundational issues before ont1 completes extraction

### **Assessment Template**
```markdown
# {Entity} Quality Assessment

## Current State Analysis
- **Field Count**: {X} fields in ontology
- **Manual Source**: `moneyworks_appendix_{entity}.html`
- **Pattern Structure**: Modern Objects/Legacy Arrays
- **Relationships**: {Y} foreign keys documented

## Quality Classification
- **Coverage**: {percentage}%
- **Grade**: 100%/NEEDS_ENHANCEMENT/NEEDS_RECONSTRUCTION
- **Action Required**: VALIDATE/ENHANCE/RECONSTRUCT

## Risk Assessment
- **Business Impact**: HIGH/MEDIUM/LOW if issues found
- **Integration Dependencies**: [list entities that depend on this]
- **Reconstruction Priority**: IMMEDIATE/HIGH/MEDIUM if needed
```

## 🚀 **EXECUTION INSTRUCTION**

**Begin with Assets entity assessment**:
1. Read `generated/moneyworks-assets-canonical-ontology.ts`
2. Check manual source for field count
3. Assess pattern structure and relationships
4. Classify quality level
5. Report findings for coordination with ont1's work

**Goal**: Prevent discovery of foundational crises during systematic completion by identifying entities needing reconstruction before ont1 processes them.

**Context**: You've already proven the validation methodology works (Products/TaxRates/Jobs success). Now apply same rigor to remaining entities to ensure development readiness.