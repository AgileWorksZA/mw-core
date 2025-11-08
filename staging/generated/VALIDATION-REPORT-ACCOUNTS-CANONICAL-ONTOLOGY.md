# MoneyWorks Accounts Entity - Canonical Validation Report

**Validation Date**: 2024-06-18  
**Entity**: Accounts (Internal Name: "Account")  
**Manual Source**: `moneyworks_appendix_accounts.html`  
**Ontology File**: `generated/moneyworks-canonical-ontology.ts` (MONEYWORKS_ACCOUNT_FIELDS)  
**Validation Status**: ❌ **FAILED** - Severe field coverage and accuracy issues identified

## 📊 **VALIDATION SUMMARY**

| Validation Criteria | Status | Score | Notes |
|---------------------|--------|--------|--------|
| Field Coverage | ❌ FAIL | ~19% | Only 5/26+ fields extracted |
| Data Type Accuracy | ⚠️ PARTIAL | 60% | Several critical mismatches |
| Length Specifications | ⚠️ PARTIAL | 80% | Most lengths accurate |
| Terminological Purity | ✅ PASS | 100% | Canonical MoneyWorks terms used |
| Foreign Key Coverage | ❌ FAIL | 0% | No relationships documented |
| Manual Source Citations | ✅ PASS | 100% | All fields properly cited |

**Overall Grade**: ❌ **FAILED** - Requires significant expansion and correction

## 🚨 **CRITICAL ISSUES IDENTIFIED**

### **1. Severe Field Coverage Gap**
**Issue**: Our ontology contains only 5 fields, but the manual documents 26+ account fields

**Manual Field Count Analysis**:
- **Account fields documented**: 26 fields in manual table
- **Account flags**: 6 additional flag definitions  
- **Our coverage**: 5 fields (19%)

**Missing Critical Fields Include**:
- `AccountantsCode`, `BankAccountNumber`, `Category2`, `Category3`
- `Category4`, `Colour`, `Comments`, `Created`, `Currency`
- `EBITDA`, `Group`, `LastModifiedTime`, `LastStatementImport`
- `ManualChequeNumber`, `PandL`, `PrintedChequeNumber`
- `SecurityLevel`, `TaggedText`, `TaxCode`, `UserNum`, `UserText`
- **Account Flags**: All 6 flag definitions missing

### **2. Data Type Mismatches**
**Issue**: Critical data type errors in our ontology

| Field | Manual Type | Our Type | Issue |
|-------|-------------|----------|--------|
| Code | T (Text) | A (Alphanumeric) | Wrong type ❌ |
| Type | A (Alphanumeric) | A (Alphanumeric) | Correct ✅ |
| System | A (Alphanumeric) | A (Alphanumeric) | Correct ✅ |
| Description | T (Text) | T (Text) | Correct ✅ |
| Category | T (Text) | A (Alphanumeric) | Wrong type ❌ |

### **3. Length Specification Errors**
**Issue**: Several length specifications don't match the manual

| Field | Manual Length | Our Length | Discrepancy |
|-------|---------------|------------|-------------|
| Code | 7 | 8 | +1 character (acceptable - includes dept) |
| Description | 39 | 64 | +25 characters ❌ |
| Category | 7 | 8 | +1 character ❌ |

### **4. Missing Foreign Key Relationships**
**Issue**: Critical foreign key relationships not documented

**Identified Foreign Keys Missing**:
```typescript
// Based on manual analysis - NOT in our ontology:
{
  sourceField: "Category",
  targetEntity: "General",
  targetField: "Code", 
  manualDescription: "The category code for the account (blank if Category is None). References General table (Kind='C')"
},
{
  sourceField: "Group",
  targetEntity: "General", 
  targetField: "Code",
  manualDescription: "The department group code for the account. References General table (Kind='G')"
},
{
  sourceField: "PandL",
  targetEntity: "Accounts",
  targetField: "Code",
  manualDescription: "The Profit and Loss account"
},
{
  sourceField: "TaxCode",
  targetEntity: "TaxRates",
  targetField: "Code",
  manualDescription: "The tax code for the account"
}
```

## 📋 **DETAILED FIELD ANALYSIS**

### **Fields Present in Our Ontology**
✅ Fields extracted correctly:
1. `Type` - Correct (A, 2) ✅
2. `System` - Correct (A, 2) ✅  
3. `Description` - Correct type (T) but wrong length ⚠️

❌ Fields with issues:
4. `Code` - Wrong type (should be T, not A) ❌
5. `Category` - Wrong type (should be T, not A) ❌

### **Critical Missing Fields (Complete List)**
❌ **Account Management Fields Missing**:
- `AccountantsCode` (T,9) - Code in accountant's chart that corresponds to this account
- `BankAccountNumber` (T,23) - For bank accounts, the number of the bank account
- `Category2` (T,15) - User defined category field
- `Category3` (T,15) - User defined category field  
- `Category4` (T,15) - User defined category field
- `Comments` (T,1020) - For own use
- `Currency` (T,3) - The currency code (empty for local currency accounts)

❌ **System Fields Missing**:
- `Created` (S) - The date/time on which the account was created
- `LastModifiedTime` (S) - The date and time that this account was last changed
- `SecurityLevel` (N) - The security level for the account
- `TaggedText` (T,255) - Scriptable tag storage
- `UserNum` (N) - Scriptable number
- `UserText` (T,255) - Scriptable text

❌ **Bank Account Fields Missing**:
- `LastStatementImport` (D) - Last bank statement import cut-off date
- `ManualChequeNumber` (T,11) - Next manual cheque number (for bank accounts)
- `PrintedChequeNumber` (T,11) - Next batch cheque number (for bank accounts)

❌ **Classification Fields Missing**:
- `Colour` (N) - The colour, represented internally as a numeric index in the range 0-7
- `EBITDA` (T,1) - Tag to specify EBITDA status of account for reporting
- `Group` (T,5) - The department group code for the account
- `PandL` (T,7) - The Profit and Loss account
- `TaxCode` (A,3) - The tax code for the account

❌ **Account Flags (ALL Missing)**:
- **Do not reconcile (bank)** - 0x0001
- **Is an Unbanked Account** - 0x0002
- **Job Code Required** - 0x0004
- **Synchronise Cheque Numbers** - 0x0010
- **Non Discountable** - 0x0020
- **Non posting account** - 0x8000

## 🔗 **FOREIGN KEY RELATIONSHIP ANALYSIS**

### **Relationships We Should Have Documented**
Based on manual analysis, Accounts entity has these foreign key relationships:

#### **Primary Relationships**
1. **Category → General.Code** (Account categories, Kind='C')
2. **Group → General.Code** (Department groups, Kind='G')  
3. **PandL → Accounts.Code** (Self-reference to P&L account)
4. **TaxCode → TaxRates.Code** (Default tax rate for account)

#### **Usage Relationships (Accounts as target)**
- Referenced by **Transactions.Detail.Account** 
- Referenced by **Assets** for depreciation accounts
- Referenced by **Jobs** for cost allocation
- Referenced by **Allocations** for auto-posting rules

**Current Coverage**: 0/4 relationships documented ❌

## 📝 **ARCHITECTURAL COMPLIANCE ANALYSIS**

### **Three-Layer Architecture**
✅ **Canonical Layer**: Uses MoneyWorks canonical terminology  
❌ **Field Coverage**: Massive gaps in canonical extraction (81% missing)  
❌ **Relationship Layer**: No foreign key relationships documented  

### **Terminological Purity**
✅ **MoneyWorks Terms**: Uses canonical account terminology  
✅ **Manual Citations**: All fields properly cite manual source  
✅ **No Domain Pollution**: No industry-specific terms used  

### **Pattern Consistency**
❌ **Field Object Structure**: Missing relationship metadata  
❌ **Enum Usage**: No enums for account types (we have these separately)  
❌ **Validation Functions**: No validation functions provided  
❌ **Flag Documentation**: No account flags documented  

## 🛠️ **RECOMMENDATIONS FOR CORRECTION**

### **Immediate Actions Required**
1. **Complete Re-extraction**: Extract ALL 26+ account fields from manual
2. **Fix Data Types**: Correct Code and Category from A→T type
3. **Add Account Flags**: Extract complete flag system (6 flags)
4. **Document Relationships**: Add all 4+ foreign key relationships
5. **Add Validation**: Create comprehensive validation functions

### **Extraction Strategy**
```markdown
1. **Read full manual table** - Extract all 26 documented fields
2. **Extract Account flags** - Document all 6 flag definitions  
3. **Map foreign keys** - Category→General, Group→General, etc.
4. **Create proper enums** - Account types, system types, flags
5. **Add validation functions** - Field coverage, flag testing
6. **Update integration** - in main canonical ontology file
```

### **Pattern Compliance**
Follow established patterns from newer entities:
- Use proper field object structure with relationship metadata
- Create enums for categorical values (account types, flags)
- Add comprehensive validation functions
- Document foreign key relationships explicitly

## 🎯 **CORRECTIVE ACTION PLAN**

### **Phase 1: Critical Field Extraction**
- [ ] Extract all 26 Account fields from manual table
- [ ] Extract all 6 Account flag definitions
- [ ] Fix data type mismatches (Code: A→T, Category: A→T)
- [ ] Correct length specifications where needed

### **Phase 2: Relationship Documentation**
- [ ] Document Category→General.Code relationship (Kind='C')
- [ ] Document Group→General.Code relationship (Kind='G')  
- [ ] Document PandL→Accounts.Code self-reference
- [ ] Document TaxCode→TaxRates.Code relationship

### **Phase 3: Enhancement Framework**
- [ ] Create account flag testing functions
- [ ] Add comprehensive field validation
- [ ] Create account type validation functions
- [ ] Test cross-business universality

## 💡 **CONSISTENCY WITH TRANSACTIONS FINDINGS**

This validation confirms the **systematic pattern identified in Transactions**:
- **Early extractions have severe field coverage gaps** (Accounts: 19%, Transactions: 15%)
- **Data type mismatches are common** in foundational entities
- **Foreign key relationships are completely missing** 
- **Pattern inconsistency** between early and late extractions

**Critical Insight**: Our foundational entities (Transactions, Accounts) require complete re-extraction following the established methodology.

## 🔄 **RELATIONSHIP TO OTHER ENTITIES**

### **Accounts as Central Hub**
Accounts is referenced by:
- **Transactions** (Detail.Account → Accounts.Code)
- **Assets** (depreciation accounts)
- **Jobs** (cost allocation accounts)
- **Allocations** (auto-posting rules)
- **Chart of Accounts** reporting hierarchy

### **Dependencies**
Accounts depends on:
- **General Classifications** (Category and Group references)
- **TaxRates** (default tax code)
- **Self-reference** (PandL account)

**Impact**: Fixing Accounts entity is critical for validating referential integrity across the entire ontology.

---

**Conclusion**: The Accounts entity ontology requires complete re-extraction following the established `/extract-moneyworks-entity` methodology. With only 19% field coverage and missing all foreign key relationships, this represents a foundational issue that must be corrected to ensure referential integrity across our canonical ontology system.