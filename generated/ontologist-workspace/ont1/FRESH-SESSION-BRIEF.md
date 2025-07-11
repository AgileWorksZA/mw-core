# ont1 Fresh Session Brief - Next Entity Assignment

## 🎯 **SESSION OBJECTIVE**
Continue systematic entity processing with fresh context to optimize context window usage.

## 📋 **PREVIOUS ACHIEVEMENTS** (Reference Only)
- ✅ **Transactions**: 15% → 100% coverage (102 fields: 65 Transaction + 37 Detail)
- ✅ **Accounts**: 19% → 100% coverage (26 fields + 6 flags)
- ✅ **Crisis Resolved**: Foundational entities now complete
- ✅ **New Standard**: 100% field coverage mandatory

## 🏆 **QUALITY STANDARD ESTABLISHED**
**100% Field Coverage Mandatory** (not 90%+)
- Extract ALL fields from manual source
- Complete foreign key relationship mapping
- Modern field object structure with metadata
- Comprehensive validation framework
- Universal business applicability

## 📚 **ESSENTIAL CONTEXT**

### **Methodology**: Use `/extract-moneyworks-entity` Command
**Command Usage**:
```
/extract-moneyworks-entity {entity_name}
```

**Critical Requirements**:
- 100% MoneyWorks terminological purity
- Complete field coverage (ALL fields from manual)
- Entity relationship mapping (foreign keys)
- Cross-business universality validation
- Comprehensive validation framework

### **Pattern Reference** (Gold Standards)
**Study these exemplary patterns**:
- `generated/moneyworks-transactions-canonical-ontology.ts` (100% coverage)
- `generated/moneyworks-accounts-canonical-ontology.ts` (100% coverage)
- `generated/moneyworks-names-canonical-ontology.ts` (95% coverage)

**Required Field Object Structure**:
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

## 🎯 **NEXT ASSIGNMENT: Jobs Entity Validation**

### **Assignment Priority**
**Entity**: Jobs  
**Priority**: HIGH - Pattern consistency verification  
**Manual Source**: `mirror/manual/manual/moneyworks_appendix_jobs.html`  
**Current Status**: Unknown quality level vs 100% standard

### **Assignment Objective**
**Determine**: Does Jobs entity achieve 100% coverage or require reconstruction?

**Assessment Process**:
1. **Execute**: `/extract-moneyworks-entity jobs`
2. **Compare**: Against 100% coverage standard
3. **Classification**:
   - **100% Coverage**: Document validation success
   - **<100% Coverage**: Complete reconstruction required

### **Success Criteria**
- ✅ 100% field coverage from manual source
- ✅ Complete foreign key relationship documentation
- ✅ Modern field object structure compliance
- ✅ Comprehensive validation framework
- ✅ Universal business applicability validation

### **Deliverables**
1. **Primary Output**: `generated/moneyworks-jobs-canonical-ontology.ts` (enhanced/reconstructed)
2. **Validation Suite**: `test-jobs-canonical-validation.ts`
3. **Assessment Report**: Submit completion assessment

## 🔄 **SYSTEMATIC PROCESSING PLAN**
**After Jobs completion, continue with**:
1. Departments entity
2. General Classifications entity
3. Assets entity
4. [Continue systematic processing]

**Each entity in fresh session** to optimize context usage.

## 📊 **PROJECT STATUS**
- **Emergency Phase**: ✅ COMPLETE (Transactions, Accounts)
- **Validation Phase**: 🔄 IN PROGRESS (Jobs current)
- **Remaining**: 17 entities for systematic processing
- **Standard**: 100% coverage mandatory for all

## 🚀 **EXECUTION INSTRUCTION**
**Begin immediately with**:
```
/extract-moneyworks-entity jobs
```

**Apply the same exceptional methodology that achieved 100% coverage for Transactions and Accounts. Target complete field extraction and relationship mapping.**