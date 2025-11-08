# MoneyWorks Entity Validation Framework

**Validation Date**: 2024-06-18  
**Methodology**: Following `/extract-moneyworks-entity` command recipe + Foreign Key Validation  
**Scope**: All 20 foundational MoneyWorks entities  
**Validation Criteria**: 100% manual compliance + referential integrity

## 📋 **ENTITY INVENTORY & MANUAL SOURCE MAPPING**

### **Core Business Entities (6/6)**
| Entity | Ontology File | Manual Source | Status |
|--------|---------------|---------------|---------|
| 1. Transactions | `moneyworks-canonical-ontology.ts` | `moneyworks_appendix_transactions.html` | 🔄 Pending |
| 2. Accounts | `moneyworks-canonical-ontology.ts` | `moneyworks_appendix_accounts.html` | 🔄 Pending |
| 3. Names | `moneyworks-names-canonical-ontology.ts` | `moneyworks_appendix_names.html` | 🔄 Pending |
| 4. Products | `moneyworks-products-canonical-ontology.ts` | `moneyworks_appendix_products.html` | 🔄 Pending |
| 5. TaxRates | `moneyworks-taxrates-canonical-ontology.ts` | `moneyworks_appendix_tax_rate.html` | 🔄 Pending |
| 6. Jobs | `moneyworks-jobs-canonical-ontology.ts` | `moneyworks_appendix_jobs.html` | 🔄 Pending |

### **Supporting Entities (8/8)**
| Entity | Ontology File | Manual Source | Status |
|--------|---------------|---------------|---------|
| 7. Departments | `moneyworks-departments-canonical-ontology.ts` | `moneyworks_appendix_departments.html` | 🔄 Pending |
| 8. General Classifications | `moneyworks-general-classifications-canonical-ontology.ts` | `moneyworks_appendix_account_categories__department_classifications_and_groups.html` | 🔄 Pending |
| 9. Assets | `moneyworks-assets-canonical-ontology.ts` | `moneyworks_appendix_assets.html` | 🔄 Pending |
| 10. AssetLog | `moneyworks-assetlog-canonical-ontology.ts` | `moneyworks_appendix_assets.html` (subfile) | 🔄 Pending |
| 11. Contacts | `moneyworks-contacts-canonical-ontology.ts` | `moneyworks_appendix_contacts.html` | 🔄 Pending |
| 12. Inventory | `moneyworks-inventory-canonical-ontology.ts` | `moneyworks_appendix_inventory.html` | 🔄 Pending |
| 13. Payments | `moneyworks-payments-canonical-ontology.ts` | `moneyworks_appendix_payments_file.html` | 🔄 Pending |
| 14. Reconciliation | `moneyworks-reconciliation-canonical-ontology.ts` | `moneyworks_appendix_reconciliation_file.html` | 🔄 Pending |

### **System Entities (6/6)**
| Entity | Ontology File | Manual Source | Status |
|--------|---------------|---------------|---------|
| 15. User | `moneyworks-user-canonical-ontology.ts` | `moneyworks_appendix_user_file.html` | 🔄 Pending |
| 16. User2 | `moneyworks-user2-canonical-ontology.ts` | `moneyworks_appendix_user2_file.html` | 🔄 Pending |
| 17. Login | `moneyworks-login-canonical-ontology.ts` | `moneyworks_appendix_login_file.html` | 🔄 Pending |
| 18. Allocations | `moneyworks-allocations-canonical-ontology.ts` | `moneyworks_appendix_allocation_file.html` | 🔄 Pending |
| 19. Build Records | `moneyworks-build-records-canonical-ontology.ts` | `moneyworks_appendix_build_file.html` | 🔄 Pending |
| 20. Memo | `moneyworks-memo-canonical-ontology.ts` | `moneyworks_appendix_memo_file.html` | 🔄 Pending |

**Total Entities**: 20/20 (100% Complete for validation)

## 🔗 **FOREIGN KEY VALIDATION FRAMEWORK**

### **Relationship Discovery Methodology**
Following `/extract-moneyworks-entity` command requirements:

1. **Field Analysis**: For each field in every entity:
   - Identify reference fields (Code, Seq, account codes, etc.)
   - Extract manual descriptions of relationships
   - Document relationship type and cardinality

2. **Cross-Entity Validation**: For each foreign key:
   - Verify target entity exists in our ontology
   - Confirm target field compatibility
   - Validate relationship rules and constraints

3. **Relationship Documentation**: Create explicit mappings with:
   - Source entity/field → Target entity/field
   - Relationship type (one-to-one, one-to-many, many-to-many)
   - Business rules and constraints
   - Manual source citations

### **Relationship Types Expected**
Based on MoneyWorks architecture:

#### **Primary Key Relationships**
- Names.Code ← Referenced by multiple entities
- Products.Code ← Referenced by transactions, inventory
- Accounts.Code ← Referenced by transactions, assets
- Jobs.Code ← Referenced by transactions, products

#### **Sequence Number Relationships**
- Names.Seq ← Referenced by Contacts, Memo subfiles
- Products.Seq ← Referenced by Inventory subfile
- Assets.Seq ← Referenced by AssetLog subfile

#### **Hierarchical Relationships**
- Jobs.Project → Jobs.Code (self-referencing hierarchy)
- Accounts.Category → General Classifications
- Departments hierarchical references

### **Validation Criteria Per Entity**

#### **Standard Validation (From Extract Command)**
✅ **Deep manual reading**: Compare against official MoneyWorks manual  
✅ **Entity boundary analysis**: Verify single vs multiple entities  
✅ **Field coverage verification**: 100% field extraction with exact specifications  
✅ **Terminological purity**: 100% MoneyWorks canonical terms (Creditor not Supplier)  
✅ **Architectural consistency**: Follow established patterns from foundational entities  
✅ **Manual traceability**: Every concept citable to exact manual source  

#### **Enhanced Foreign Key Validation**
✅ **Foreign key discovery**: Identify all reference fields  
✅ **Target validation**: Verify referenced entities/fields exist  
✅ **Relationship accuracy**: Correct cardinality and business rules  
✅ **Referential integrity**: No orphaned references or circular dependencies  
✅ **Constraint validation**: Required vs optional, cascade behaviors  

## 📊 **VALIDATION WORKFLOW**

### **Per-Entity Process**
1. **Read manual source** (`/Users/hjonck/Development/gitprojects/AgileWorksZA/mw-core/mirror/manual/manual/[manual_file]`)
2. **Load ontology file** from `/generated/` directory
3. **Compare field definitions** against manual specifications
4. **Analyze foreign key relationships** from manual descriptions
5. **Validate cross-entity references** against our ontology
6. **Document findings** in validation report
7. **Grade entity**: PASS/FAIL with detailed analysis

### **Validation Output Files**
For each **PASSING** entity:
- `VALIDATION-REPORT-[ENTITY]-CANONICAL-ONTOLOGY.md` in `/generated/`
- Include: Field coverage, foreign key analysis, terminological purity, compliance assessment

### **Cross-Entity Analysis**
- `MONEYWORKS-ENTITY-RELATIONSHIPS-VALIDATION.md` - Comprehensive relationship mapping
- `MONEYWORKS-VALIDATION-SUMMARY-REPORT.md` - Overall results and recommendations

## 🎯 **SUCCESS CRITERIA**

### **Entity-Level Pass Criteria**
- ✅ 100% field coverage (all manual fields extracted)
- ✅ Exact data type and length compliance
- ✅ 100% MoneyWorks terminological purity
- ✅ All foreign keys properly documented
- ✅ Relationship integrity validated
- ✅ Business rules accurately captured
- ✅ Manual source citations complete

### **Framework-Level Success**
- Complete validation of all 20 entities
- Comprehensive foreign key relationship mapping
- Identification of any ontology improvements needed
- Validation that foundational phase is truly complete
- Referential integrity across entire MoneyWorks ontology

---

**Next Steps**: Begin systematic validation starting with core entities (Transactions, Accounts, Names) and proceeding through all 20 entities following the `/extract-moneyworks-entity` command methodology.