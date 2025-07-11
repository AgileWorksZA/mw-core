# ont2 Fresh Session Brief - Products Entity Validation

## 🎯 **SESSION OBJECTIVE**
Validate Products entity against 100% coverage standard with fresh context optimization.

## 📋 **PROJECT CONTEXT** (Essential Only)
**Foundational Crisis Resolved**:
- ont1 reconstructed Transactions (15% → 100%) and Accounts (19% → 100%)
- New quality standard: **100% field coverage mandatory**
- 17 entities remain for systematic validation/reconstruction

## 🏆 **QUALITY STANDARD**
**100% Field Coverage Mandatory** (Updated Standard)
- Extract ALL fields from manual source
- Complete foreign key relationship mapping  
- Modern field object structure with metadata
- Comprehensive validation framework
- Universal business applicability

## 📚 **ESSENTIAL METHODOLOGY**

### **Use `/extract-moneyworks-entity` Command**
**Command Usage**:
```
/extract-moneyworks-entity products
```

**Critical Requirements**:
- 100% MoneyWorks terminological purity
- Complete field coverage (ALL fields from manual)
- Entity relationship mapping (foreign keys)
- Cross-business universality validation
- Comprehensive validation framework

### **Gold Standard References**
**Study these patterns for quality comparison**:
- `generated/moneyworks-transactions-canonical-ontology.ts` (100% coverage - NEW GOLD STANDARD)
- `generated/moneyworks-accounts-canonical-ontology.ts` (100% coverage - NEW GOLD STANDARD)
- `generated/moneyworks-names-canonical-ontology.ts` (95% coverage - PREVIOUS STANDARD)

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

## 🎯 **ASSIGNMENT: Products Entity Validation**

### **Critical Assessment**
**Entity**: Products  
**Risk Level**: HIGH - Core inventory/sales system  
**Manual Source**: `mirror/manual/manual/moneyworks_appendix_products.html`  
**Current Status**: UNKNOWN quality vs 100% standard

### **Validation Process**
1. **Execute**: `/extract-moneyworks-entity products`
2. **Assess Current State**: Compare existing vs manual source
3. **Quality Classification**:
   - **100% Coverage**: Validate and document success
   - **<100% Coverage**: Complete reconstruction required

### **Expected Findings**
**High Risk Scenarios**:
- Products may have <100% coverage (like original Transactions/Accounts)
- Missing foreign key relationships to Transactions/Inventory
- Incomplete inventory management fields
- Pattern inconsistency with gold standards

### **Success Criteria**
- ✅ 100% field coverage from manual
- ✅ Complete foreign key relationships documented
- ✅ Modern pattern compliance verified
- ✅ Universal business validation (restaurant, manufacturing, retail, services)
- ✅ Integration with Transactions/Inventory confirmed

## 📋 **VALIDATION FRAMEWORK**

### **Field Coverage Assessment**
**Count and Compare**:
- Manual source fields: [COUNT from manual]
- Current ontology fields: [COUNT from existing]
- Coverage percentage: [CALCULATE]
- Classification: EXCELLENT/NEEDS_RECONSTRUCTION

### **Relationship Mapping**
**Expected Foreign Keys**:
- Products.TaxCode → TaxRates.Code
- Products.Category → General Classifications
- Transaction.Detail.StockCode → Products.Code (reverse relationship)
- Inventory.ProductSeq → Products.Seq (inventory tracking)

### **Quality Assessment Report**
```markdown
# Products Entity Validation Report

## Assessment Results
- **Field Coverage**: {X}% ({extracted}/{total} fields)
- **Quality Classification**: EXCELLENT/NEEDS_RECONSTRUCTION
- **Pattern Compliance**: Modern Objects/Legacy Arrays
- **Relationship Coverage**: {Y}% foreign keys documented

## Comparison to Gold Standards
- **Transactions Standard**: 100% coverage
- **Accounts Standard**: 100% coverage  
- **Products Current**: {X}% coverage
- **Action Required**: VALIDATE_SUCCESS/COMPLETE_RECONSTRUCTION

## Strategic Impact
- **Business Risk**: [HIGH/MEDIUM/LOW if quality issues]
- **Integration Dependencies**: [entities affected]
- **Reconstruction Priority**: [IMMEDIATE/HIGH/MEDIUM]
```

## 🚀 **EXECUTION INSTRUCTION**

**Begin immediately with**:
```
/extract-moneyworks-entity products
```

**Assessment Goal**: Determine if Products achieves 100% coverage standard or requires complete reconstruction like Transactions/Accounts did.

**Context**: Products is critical for inventory management and sales processing. Any coverage gaps or relationship omissions impact core business functionality.

**Report findings for systematic processing coordination.**