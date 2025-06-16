# MoneyWorks Semantic Purity Framework

*Design Document for Maintaining MoneyWorks DSL Canonical Integrity*

## 🎯 **Core Architectural Principle**

MoneyWorks serves as a **Domain Specific Language (DSL)** foundation that can be used to implement any business's specialized DSL. We must maintain **semantic purity** at the MoneyWorks core layer to prevent domain pollution and ensure universal applicability.

## 🏗️ **Three-Layer Semantic Architecture**

### **Layer 1: MoneyWorks Core DSL (Pure Canonical)**
- **Authority**: MoneyWorks Manual as single source of truth
- **Content**: Exact terminology, field definitions, business rules as documented by MoneyWorks
- **Scope**: MoneyWorks-specific concepts only
- **Language**: MoneyWorks canonical terminology (e.g., "Creditor" not "Supplier", "Debtor" not "Customer")

### **Layer 2: Business Mapping (Domain-Agnostic)**
- **Content**: How businesses map their processes to MoneyWorks concepts
- **Scope**: Universal business processes that work across all industries
- **Language**: Business-to-MoneyWorks concept mapping

### **Layer 3: Domain/Industry Interpretation (Business-Specific)**
- **Content**: Industry-specific terminology and regulatory overlays
- **Scope**: Restaurant vs Manufacturing vs Legal vs Consulting specific usage
- **Language**: Domain-specific business terminology

## 📚 **MoneyWorks Canonical Concept Extraction Strategy**

### **Priority 1: Field-Level Canonical Definitions**

For each MoneyWorks entity field, extract:

1. **Canonical Name**: Exact field name from MoneyWorks
2. **MoneyWorks Description**: How MoneyWorks manual describes the field
3. **MoneyWorks Purpose**: What MoneyWorks says this field is for
4. **MoneyWorks Rules**: Validation, constraints, and behavior rules from manual
5. **MoneyWorks Relationships**: How this field relates to other MoneyWorks concepts

**Example: Transaction Type Field**
```typescript
// ✅ PURE MONEYWORKS CANONICAL
interface MoneyWorksTransactionTypeField {
  canonicalName: "Type";
  moneyWorksDescription: "The transaction type - see TransactionType enum. Max 4 chars.";
  moneyWorksPurpose: "Defines the fundamental nature and behavior of the transaction";
  moneyWorksRules: [
    "Maximum 4 characters",
    "Must be valid MoneyWorks transaction type code",
    "Determines available fields and validation rules"
  ];
  moneyWorksValues: {
    "CP": "Cash Payment/Purchase - immediate payment transaction",
    "CR": "Cash Receipt/Sale - immediate receipt transaction", 
    "DI": "Debtor Invoice - invoice sent to debtor (incomplete until paid)",
    "DII": "Debtor Invoice Incomplete - unposted debtor invoice",
    "DIC": "Debtor Invoice Complete - fully paid debtor invoice",
    "CI": "Creditor Invoice - invoice received from creditor",
    // ... all canonical MoneyWorks transaction types
  };
}
```

### **Priority 2: Relationship Mapping**

Extract MoneyWorks canonical relationships:

```typescript
interface MoneyWorksRelationship {
  sourceField: string;           // "Type"
  targetField: string;          // "Status" 
  relationshipType: string;     // "determines_available_values"
  moneyWorksRule: string;       // "DIC transactions must have Status='P'"
  canonicalExplanation: string; // MoneyWorks manual explanation
}
```

### **Priority 3: Business Rules Extraction**

MoneyWorks-documented business logic:

```typescript
interface MoneyWorksBusinessRule {
  ruleSource: "MoneyWorks Manual Section X.Y";
  canonicalRule: string;        // "CP transactions require NameCode field"
  moneyWorksReason: string;     // "Payment transactions must specify payee"
  validation: "required" | "warning" | "conditional";
  applicableContexts: string[]; // ["Type=CP", "Type=CPC"]
}
```

## 🧪 **Canonical Validation Testing Framework**

### **Test 1: Manual Source Verification**
```typescript
interface CanonicalSourceTest {
  concept: string;              // "Debtor Invoice Complete"
  manualReference: string;      // "MoneyWorks Manual Section 4.2.1"
  exactQuote: string;          // Direct quote from manual
  verified: boolean;           // Manual verification status
}
```

### **Test 2: Cross-Business Universality**
```typescript
interface UniversalityTest {
  concept: string;              // "Cash Payment"
  businessScenarios: [
    { type: "Restaurant", applies: true, reason: "Pay suppliers for ingredients" },
    { type: "Law Firm", applies: true, reason: "Pay suppliers for office supplies" },
    { type: "Manufacturing", applies: true, reason: "Pay suppliers for materials" }
  ];
  verdict: "universal" | "domain_specific";
}
```

### **Test 3: MoneyWorks Specificity**
```typescript
interface MoneyWorksSpecificityTest {
  concept: string;              // "Transaction Type DIC"
  isMoneyWorksSpecific: boolean; // true - this is MoneyWorks-specific concept
  generalAccountingEquivalent?: string; // "Paid Invoice" 
  whyMoneyWorksSpecific: string; // "DIC is MoneyWorks' specific way of tracking invoice completion"
}
```

### **Test 4: Terminology Consistency**
```typescript
interface TerminologyConsistencyTest {
  ourTerm: string;             // "Supplier"  
  moneyWorksTerm: string;      // "Creditor"
  consistent: boolean;         // false
  correctionRequired: boolean; // true
  canonicalUsage: string;      // "Use 'Creditor' to match MoneyWorks terminology"
}
```

## 📝 **Implementation Guidelines**

### **DO: Canonical MoneyWorks Enhancement**
```typescript
// ✅ PURE: Explains MoneyWorks concept in MoneyWorks language
interface DebtorInvoiceComplete {
  moneyWorksCode: "DIC";
  canonicalName: "Debtor Invoice Complete";
  moneyWorksDefinition: "Invoice to debtor that has been fully paid";
  moneyWorksRules: [
    "Must have Status='P' (Posted)",
    "AmtPaid equals Gross amount", 
    "Cannot be edited once complete"
  ];
  humanReadableExplanation: "In MoneyWorks, a DIC represents an invoice to a debtor (customer) that has been completely paid up, making it a completed transaction in the system";
}
```

### **DON'T: Generic Business Interpretation**
```typescript
// ❌ POLLUTED: Introduces non-MoneyWorks business concepts
interface CustomerInvoicePaid {  // "Customer" not MoneyWorks canonical term
  businessIntent: "CUSTOMER_BILLING"; // Business interpretation
  marketingCategory: "B2B_SALES";     // Industry-specific concept
  accountingStandard: "US_GAAP";      // External standard, not MoneyWorks
}
```

## 🎯 **Validation Workflow**

1. **Extract**: Mine MoneyWorks manual for canonical concept
2. **Define**: Create pure MoneyWorks definition with human-readable MoneyWorks explanation
3. **Test**: Run through all 4 validation tests
4. **Verify**: Check against actual MoneyWorks manual source
5. **Document**: Record canonical source and verification status

## 📊 **Success Metrics**

- **Canonical Coverage**: % of MoneyWorks concepts extracted from manual
- **Purity Score**: % of concepts that pass all validation tests
- **Cross-Business Validity**: Can define restaurant, law firm, manufacturing using same MoneyWorks foundation
- **LLM Comprehension**: AI can understand MoneyWorks concepts without domain hallucination

## 🚀 **Implementation Priority**

1. **Extract Transaction Type ontology** - Start with transaction types (CP, CR, DI, etc.)
2. **Extract Account Type ontology** - Pure MoneyWorks account classification
3. **Extract Field Definition ontology** - Every field in MoneyWorks canonical language
4. **Build validation testing framework** - Automated canonical verification
5. **Create layered semantic architecture** - Separate pure core from business mapping

This framework ensures we build MoneyWorks semantic intelligence that works for ANY business domain while maintaining the purity and power of MoneyWorks as a universal business DSL foundation.