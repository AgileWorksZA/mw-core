# MoneyWorks Foreign Key Relationship Discovery Framework

**Framework Date**: 2024-06-18  
**Based on**: Manual analysis of `moneyworks_appendix_transactions.html` and cross-entity examination  
**Purpose**: Comprehensive foreign key validation across all 20 MoneyWorks entities

## 🔍 **FOREIGN KEY IDENTIFICATION PATTERNS**

### **Pattern Analysis from Transactions Manual**
From `moneyworks_appendix_transactions.html`, I've identified these key relationship patterns:

#### **Direct Foreign Key References**
1. **NameCode** → References Names.Code (Customer or Supplier Code)
2. **Detail.StockCode** → References Products.Code (Product code for detail line)
3. **Detail.JobCode** → References Jobs.Code (Job code for detail line)
4. **Detail.ParentSeq** → References Transactions.SequenceNumber (Parent transaction)
5. **Detail.Statement** → References Reconciliation.Seq (Reconciliation record)

#### **Account Code References**
- Transaction detail lines contain Account codes (need to map to Accounts.Code)
- **TaxCode** → References TaxRates.Code
- **Dept** (Department code) → References Departments.Code

#### **Sequence Number Relationships**
- **ParentSeq** patterns for hierarchical structures
- **SequenceNumber** as primary key referenced by other entities

## 📋 **FOREIGN KEY DISCOVERY METHODOLOGY**

### **Step 1: Field Name Pattern Recognition**
Look for these naming patterns in field names:
```typescript
const FOREIGN_KEY_PATTERNS = [
  // Direct code references
  /.*Code$/i,           // NameCode, StockCode, JobCode, TaxCode
  /.*Seq$/i,            // ParentSeq, NameSeq, ProductSeq
  
  // Specific relationship patterns
  /^Account$/i,         // Account field pointing to Accounts
  /^Dept$/i,           // Department reference
  /^Supplier$/i,        // Supplier code reference
  /^Client$/i,         // Client reference (usually to Names)
  
  // Parent-child relationships
  /Parent.*/i,          // ParentSeq, ParentCode
  /.*Parent.*/i,        // Any parent reference
];
```

### **Step 2: Manual Description Analysis**
Parse field descriptions for relationship keywords:
```typescript
const RELATIONSHIP_KEYWORDS = [
  "references", "refers to", "points to", "code of",
  "sequence number of", "belongs to", "for the",
  "customer", "supplier", "product", "account",
  "job", "department", "tax rate", "reconciliation"
];
```

### **Step 3: Cross-Entity Validation**
For each potential foreign key:
1. Identify target entity from field name/description
2. Verify target entity exists in our ontology
3. Confirm target field exists and has compatible type
4. Validate data type and length compatibility
5. Document relationship cardinality and business rules

## 🔗 **DISCOVERED FOREIGN KEY RELATIONSHIPS**

### **Transactions Entity Foreign Keys**
Based on manual analysis:

```typescript
export const TRANSACTIONS_FOREIGN_KEYS = [
  {
    sourceField: "NameCode",
    targetEntity: "Names",
    targetField: "Code",
    relationshipType: "many-to-one",
    isRequired: true,
    manualDescription: "Customer or Supplier Code",
    businessRule: "Must reference valid Name record (Customer or Supplier)"
  },
  {
    sourceField: "Detail.StockCode", 
    targetEntity: "Products",
    targetField: "Code",
    relationshipType: "many-to-one",
    isRequired: false,
    manualDescription: "The product code for the detail line. This will be blank if the transaction is a service-type transaction.",
    businessRule: "Optional reference to Product for inventory transactions"
  },
  {
    sourceField: "Detail.JobCode",
    targetEntity: "Jobs", 
    targetField: "Code",
    relationshipType: "many-to-one",
    isRequired: false,
    manualDescription: "This is the job code for the detail line.",
    businessRule: "Optional reference to Job for job costing"
  },
  {
    sourceField: "Detail.ParentSeq",
    targetEntity: "Transactions",
    targetField: "SequenceNumber", 
    relationshipType: "many-to-one",
    isRequired: true,
    manualDescription: "The sequence number of the parent transaction",
    businessRule: "Self-referencing hierarchy for transaction details"
  },
  {
    sourceField: "Detail.Statement",
    targetEntity: "Reconciliation",
    targetField: "Seq",
    relationshipType: "many-to-one", 
    isRequired: false,
    manualDescription: "The sequence number for the reconciliation record for which this detail line was reconciled.",
    businessRule: "Optional reference for bank reconciliation tracking"
  }
];
```

## 🛠️ **VALIDATION FRAMEWORK IMPLEMENTATION**

### **Foreign Key Validation Function Template**
```typescript
export interface ForeignKeyRelationship {
  sourceEntity: string;
  sourceField: string;
  targetEntity: string;
  targetField: string;
  relationshipType: "one-to-one" | "one-to-many" | "many-to-one" | "many-to-many";
  isRequired: boolean;
  cascadeDelete?: boolean;
  manualDescription: string;
  businessRule: string;
  manualSource: string;
}

export function validateForeignKeyRelationship(
  relationship: ForeignKeyRelationship,
  sourceOntology: any,
  targetOntology: any
): {
  isValid: boolean;
  issues: string[];
  recommendations: string[];
} {
  const issues: string[] = [];
  const recommendations: string[] = [];
  
  // Validate source field exists
  const sourceField = sourceOntology.fields?.find(f => f.fieldName === relationship.sourceField);
  if (!sourceField) {
    issues.push(`Source field ${relationship.sourceField} not found in ${relationship.sourceEntity} ontology`);
  }
  
  // Validate target entity/field exists
  const targetField = targetOntology.fields?.find(f => f.fieldName === relationship.targetField);
  if (!targetField) {
    issues.push(`Target field ${relationship.targetField} not found in ${relationship.targetEntity} ontology`);
  }
  
  // Validate data type compatibility
  if (sourceField && targetField) {
    if (sourceField.dataType !== targetField.dataType) {
      issues.push(`Data type mismatch: ${sourceField.dataType} vs ${targetField.dataType}`);
    }
    
    if (sourceField.maxLength && targetField.maxLength && sourceField.maxLength > targetField.maxLength) {
      recommendations.push(`Source field length (${sourceField.maxLength}) exceeds target field length (${targetField.maxLength})`);
    }
  }
  
  return {
    isValid: issues.length === 0,
    issues,
    recommendations
  };
}
```

### **Comprehensive Entity Relationship Map**
```typescript
export const MONEYWORKS_ENTITY_RELATIONSHIPS: ForeignKeyRelationship[] = [
  // Will be populated as we validate each entity
  
  // Known patterns from manual analysis:
  // Names.Code ← Referenced by: Transactions.NameCode, Jobs.Client, etc.
  // Products.Code ← Referenced by: Transactions.Detail.StockCode, Inventory.ProductSeq, etc.
  // Accounts.Code ← Referenced by: Transaction detail lines, Assets.Account, etc.
  // Jobs.Code ← Referenced by: Transactions.Detail.JobCode, Products.JobCode, etc.
  // Departments.Code ← Referenced by: Transactions.Detail.Dept, Accounts.Dept, etc.
  // TaxRates.Code ← Referenced by: Transactions.Detail.TaxCode, Products.TaxCode, etc.
];
```

## 📊 **VALIDATION WORKFLOW FOR EACH ENTITY**

### **Enhanced Entity Validation Process**
1. **Standard Manual Validation** (from `/extract-moneyworks-entity` command):
   - Read manual source
   - Verify field coverage
   - Check terminological purity
   - Validate architectural consistency

2. **Foreign Key Discovery** (NEW):
   - Scan all fields for foreign key patterns
   - Parse manual descriptions for relationships
   - Identify target entities and fields
   - Document relationship metadata

3. **Cross-Entity Validation** (NEW):
   - Load target entity ontologies
   - Validate field compatibility
   - Check relationship cardinality
   - Verify business rule accuracy

4. **Relationship Documentation** (NEW):
   - Add relationship metadata to field definitions
   - Create comprehensive relationship registry
   - Generate validation reports

### **Expected Foreign Key Categories**

#### **Primary Reference Relationships**
- **Names** as central hub (referenced by most entities)
- **Products** for inventory and transaction details
- **Accounts** for financial postings
- **Jobs** for project costing

#### **Hierarchical Relationships**
- **Jobs.Project** → **Jobs.Code** (project hierarchy)
- **Accounts.Category** → **General Classifications**
- **Detail.ParentSeq** → **Transactions.SequenceNumber**

#### **Subfile Relationships**
- **Contacts.NameSeq** → **Names.Seq**
- **Memo.NameSeq** → **Names.Seq** 
- **Inventory.ProductSeq** → **Products.Seq**
- **AssetLog.AssetSeq** → **Assets.Seq**

#### **Junction Table Relationships**
- **Payments** linking invoices to payment transactions
- **Allocations** for rule-based processing

## 🎯 **SUCCESS CRITERIA FOR FOREIGN KEY VALIDATION**

### **Entity-Level Validation**
✅ All foreign key fields identified and documented  
✅ Target entities and fields validated to exist  
✅ Data type and length compatibility confirmed  
✅ Relationship cardinality accurately documented  
✅ Business rules properly captured  
✅ Manual source citations complete  

### **Framework-Level Validation**
✅ Complete relationship map across all 20 entities  
✅ No orphaned foreign key references  
✅ No circular dependency issues  
✅ Referential integrity rules documented  
✅ Entity interdependency graph complete  

---

**Next Step**: Begin systematic validation starting with core entities to build the complete foreign key relationship map across all 20 MoneyWorks entities.