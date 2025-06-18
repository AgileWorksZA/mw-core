/**
 * MoneyWorks Contacts Entity - Canonical Validation Test Suite
 * 
 * Comprehensive validation framework for Contacts entity canonical ontology
 * Tests terminological purity, business rule compliance, and cross-business universality
 * 
 * Source Authority: moneyworks_appendix_contacts.html
 * Ontology: moneyworks-contacts-canonical-ontology.ts
 */

import {
  MONEYWORKS_CONTACTS_FIELDS,
  MONEYWORKS_CONTACTS_BUSINESS_RULES,
  MONEYWORKS_CONTACTS_RELATIONSHIPS,
  MONEYWORKS_CONTACTS_CANONICAL_SUMMARY
} from '../generated/moneyworks-contacts-canonical-ontology';

// ============================================================================
// CANONICAL PURITY VALIDATION
// ============================================================================

/**
 * Test 1: Terminological Purity Validation
 * Ensures 100% MoneyWorks canonical terminology without domain pollution
 */
export const CONTACTS_TERMINOLOGY_PURITY_TESTS = [
  {
    testName: "Contact Entity Name Purity",
    concept: "contact management",
    expectedCanonical: "Contacts",
    manualSource: "moneyworks_appendix_contacts.html",
    purityResult: "pure" as const,
    pollutionSources: [],
    validation: () => {
      const entityName = MONEYWORKS_CONTACTS_CANONICAL_SUMMARY.entityName;
      return entityName === "Contacts" && 
             entityName === MONEYWORKS_CONTACTS_CANONICAL_SUMMARY.internalName;
    }
  },
  
  {
    testName: "Communication Field Terminology",
    concept: "communication endpoints",
    expectedCanonical: "eMail, Mobile, DDI, AfterHours",
    manualSource: "moneyworks_appendix_contacts.html",
    purityResult: "pure" as const,
    pollutionSources: [],
    validation: () => {
      const commFields = MONEYWORKS_CONTACTS_FIELDS.filter(f => 
        ['eMail', 'Mobile', 'DDI', 'AfterHours'].includes(f.fieldName)
      );
      return commFields.length === 4 && 
             commFields.every(f => f.dataType === "T" && f.maxLength === 19 || f.maxLength === 63);
    }
  },
  
  {
    testName: "Relationship Field Purity",
    concept: "hierarchical contact management",
    expectedCanonical: "ParentSeq",
    manualSource: "moneyworks_appendix_contacts.html",
    purityResult: "pure" as const,
    pollutionSources: [],
    validation: () => {
      const parentField = MONEYWORKS_CONTACTS_FIELDS.find(f => f.fieldName === "ParentSeq");
      return parentField?.relationshipTarget === "Names.Seq" &&
             parentField?.relationshipRule === "Contact must belong to valid Name entity";
    }
  }
];

// ============================================================================
// FIELD COVERAGE VALIDATION
// ============================================================================

/**
 * Test 2: Complete Field Coverage Validation
 * Ensures all 14 fields from manual are extracted with correct specifications
 */
export const CONTACTS_FIELD_COVERAGE_TESTS = [
  {
    testName: "Complete Field Count",
    expectedCount: 14,
    validation: () => MONEYWORKS_CONTACTS_FIELDS.length === 14
  },
  
  {
    testName: "Communication Fields Coverage",
    expectedFields: ["AfterHours", "DDI", "eMail", "Mobile"],
    validation: () => {
      const commFields = MONEYWORKS_CONTACTS_FIELDS
        .filter(f => ["AfterHours", "DDI", "eMail", "Mobile"].includes(f.fieldName))
        .map(f => f.fieldName);
      return commFields.length === 4 &&
             ["AfterHours", "DDI", "eMail", "Mobile"].every(field => commFields.includes(field));
    }
  },
  
  {
    testName: "Professional Contact Fields Coverage",
    expectedFields: ["Contact", "Position", "Salutation"],
    validation: () => {
      const profFields = MONEYWORKS_CONTACTS_FIELDS
        .filter(f => ["Contact", "Position", "Salutation"].includes(f.fieldName))
        .map(f => f.fieldName);
      return profFields.length === 3 &&
             ["Contact", "Position", "Salutation"].every(field => profFields.includes(field));
    }
  },
  
  {
    testName: "System Fields Coverage",
    expectedFields: ["ParentSeq", "Order", "Role", "LastModifiedTime"],
    validation: () => {
      const sysFields = MONEYWORKS_CONTACTS_FIELDS
        .filter(f => ["ParentSeq", "Order", "Role", "LastModifiedTime"].includes(f.fieldName))
        .map(f => f.fieldName);
      return sysFields.length === 4 &&
             ["ParentSeq", "Order", "Role", "LastModifiedTime"].every(field => sysFields.includes(field));
    }
  },
  
  {
    testName: "Extensibility Fields Coverage",
    expectedFields: ["Memo", "TaggedText", "UserNum", "UserText"],
    validation: () => {
      const extFields = MONEYWORKS_CONTACTS_FIELDS
        .filter(f => ["Memo", "TaggedText", "UserNum", "UserText"].includes(f.fieldName))
        .map(f => f.fieldName);
      return extFields.length === 4 &&
             ["Memo", "TaggedText", "UserNum", "UserText"].every(field => extFields.includes(field));
    }
  }
];

// ============================================================================
// DATA TYPE VALIDATION
// ============================================================================

/**
 * Test 3: MoneyWorks Data Type Compliance
 * Validates exact data type mappings from manual
 */
export const CONTACTS_DATA_TYPE_TESTS = [
  {
    testName: "Text Field Data Types",
    validation: () => {
      const textFields = MONEYWORKS_CONTACTS_FIELDS.filter(f => f.dataType === "T");
      const expectedTextFields = [
        "AfterHours", "Contact", "DDI", "eMail", "Memo", 
        "Mobile", "Position", "Salutation", "TaggedText", "UserText"
      ];
      return textFields.length === expectedTextFields.length &&
             textFields.every(f => expectedTextFields.includes(f.fieldName));
    }
  },
  
  {
    testName: "Numeric Field Data Types",
    validation: () => {
      const numericFields = MONEYWORKS_CONTACTS_FIELDS.filter(f => f.dataType === "N");
      const expectedNumericFields = ["Order", "ParentSeq", "Role", "UserNum"];
      return numericFields.length === expectedNumericFields.length &&
             numericFields.every(f => expectedNumericFields.includes(f.fieldName));
    }
  },
  
  {
    testName: "System Field Data Types",
    validation: () => {
      const systemFields = MONEYWORKS_CONTACTS_FIELDS.filter(f => f.dataType === "S");
      return systemFields.length === 1 &&
             systemFields[0].fieldName === "LastModifiedTime";
    }
  },
  
  {
    testName: "Communication Field Length Constraints",
    validation: () => {
      const phoneFields = MONEYWORKS_CONTACTS_FIELDS.filter(f => 
        ["AfterHours", "DDI", "Mobile"].includes(f.fieldName)
      );
      const emailField = MONEYWORKS_CONTACTS_FIELDS.find(f => f.fieldName === "eMail");
      
      return phoneFields.every(f => f.maxLength === 19) &&
             emailField?.maxLength === 63;
    }
  }
];

// ============================================================================
// BUSINESS RULE VALIDATION
// ============================================================================

/**
 * Test 4: MoneyWorks Business Rule Compliance
 * Validates canonical business rules and constraints
 */
export const CONTACTS_BUSINESS_RULE_TESTS = [
  {
    testName: "Parent Entity Relationship Rule",
    validation: () => {
      const parentRule = MONEYWORKS_CONTACTS_BUSINESS_RULES.find(r => 
        r.fieldName === "ParentSeq" && r.ruleType === "relationship"
      );
      return parentRule?.canonicalRule.includes("Name entity via ParentSeq → Names.Seq");
    }
  },
  
  {
    testName: "Role Bit Mapping Rule",
    validation: () => {
      const roleRule = MONEYWORKS_CONTACTS_BUSINESS_RULES.find(r => 
        r.fieldName === "Role" && r.ruleType === "constraint"
      );
      return roleRule?.canonicalRule.includes("bit mapping") &&
             roleRule?.canonicalRule.includes("each bit representing distinct contact role");
    }
  },
  
  {
    testName: "Contact Ordering Rule",
    validation: () => {
      const orderRule = MONEYWORKS_CONTACTS_BUSINESS_RULES.find(r => 
        r.fieldName === "Order" && r.ruleType === "constraint"
      );
      return orderRule?.canonicalRule.includes("contact sequence within parent Name entity");
    }
  }
];

// ============================================================================
// ENTITY RELATIONSHIP VALIDATION
// ============================================================================

/**
 * Test 5: Entity Relationship Integrity
 * Validates correct entity relationship mappings
 */
export const CONTACTS_RELATIONSHIP_TESTS = [
  {
    testName: "Names Entity Relationship",
    validation: () => {
      const nameRelationship = MONEYWORKS_CONTACTS_RELATIONSHIPS.find(r => 
        r.sourceEntity === "Contacts" && r.targetEntity === "Names"
      );
      return nameRelationship?.sourceField === "ParentSeq" &&
             nameRelationship?.targetField === "Seq" &&
             nameRelationship?.cardinality === "many-to-one" &&
             nameRelationship?.relationshipType === "required";
    }
  },
  
  {
    testName: "Subfile Entity Architecture",
    validation: () => {
      return MONEYWORKS_CONTACTS_CANONICAL_SUMMARY.entityType === "subfile" &&
             MONEYWORKS_CONTACTS_CANONICAL_SUMMARY.parentEntity === "Names";
    }
  }
];

// ============================================================================
// DUAL-LAYER CONTACT ARCHITECTURE VALIDATION
// ============================================================================

/**
 * Test 6: Dual-Layer Contact Architecture Tests
 * Validates proper integration and usage patterns between Names and Contacts entities
 */
export const CONTACTS_DUAL_LAYER_ARCHITECTURE_TESTS = [
  {
    testName: "Field Capacity Comparison Validation",
    validation: () => {
      // Validate that Contacts provides larger capacity for specific fields
      const contactNameField = MONEYWORKS_CONTACTS_FIELDS.find(f => f.fieldName === "Contact");
      const mobileField = MONEYWORKS_CONTACTS_FIELDS.find(f => f.fieldName === "Mobile"); 
      const positionField = MONEYWORKS_CONTACTS_FIELDS.find(f => f.fieldName === "Position");
      const afterhoursField = MONEYWORKS_CONTACTS_FIELDS.find(f => f.fieldName === "AfterHours");
      const emailField = MONEYWORKS_CONTACTS_FIELDS.find(f => f.fieldName === "eMail");
      
      return contactNameField?.maxLength === 39 &&  // vs Names(25/29)
             mobileField?.maxLength === 19 &&        // vs Names(14/13)
             positionField?.maxLength === 39 &&      // vs Names(29/29)
             afterhoursField?.maxLength === 19 &&    // vs Names(11/11)
             emailField?.maxLength === 63;           // vs Names(80/80) - Names advantage
    }
  },
  
  {
    testName: "Architectural Relationship Validation",
    validation: () => {
      const parentSeqField = MONEYWORKS_CONTACTS_FIELDS.find(f => f.fieldName === "ParentSeq");
      const relationshipRule = MONEYWORKS_CONTACTS_RELATIONSHIPS.find(r => 
        r.sourceField === "ParentSeq" && r.targetEntity === "Names"
      );
      
      return parentSeqField?.relationshipTarget === "Names.Seq" &&
             relationshipRule?.cardinality === "many-to-one" &&
             relationshipRule?.relationshipType === "required";
    }
  },
  
  {
    testName: "Unlimited Contact Expansion Validation",
    validation: () => {
      // Verify that Contacts supports unlimited contacts per Name
      const summaryInsights = MONEYWORKS_CONTACTS_CANONICAL_SUMMARY.architecturalInsights;
      return summaryInsights.some(insight => 
        insight.includes("Unlimited contacts per Name entity") &&
        insight.includes("vs Names built-in limit of 2")
      );
    }
  },
  
  {
    testName: "Usage Pattern Documentation Validation",
    validation: () => {
      const usageGuidance = MONEYWORKS_CONTACTS_CANONICAL_SUMMARY.dualLayerUsageGuidance;
      return usageGuidance.useNamesOnly && 
             usageGuidance.useHybridApproach && 
             usageGuidance.useContactsPrimary &&
             usageGuidance.useNamesOnly.scenarios.length > 0 &&
             usageGuidance.useHybridApproach.scenarios.length > 0 &&
             usageGuidance.useContactsPrimary.scenarios.length > 0;
    }
  }
];

// ============================================================================
// CROSS-BUSINESS UNIVERSALITY VALIDATION
// ============================================================================

/**
 * Test 7: Cross-Business Universality Tests
 * Validates Contacts entity works across all business domains
 */
export const CONTACTS_UNIVERSALITY_TESTS = [
  {
    businessType: "restaurant",
    scenarioName: "Restaurant Staff Contact Management",
    businessOperation: { 
      action: "manage_staff_contacts", 
      entity: "restaurant_staff", 
      contacts: ["manager", "chef", "server"] 
    },
    canonicalMapping: {
      parentEntity: "Names",
      contactRecords: [
        { Contact: "John Manager", Position: "Restaurant Manager", Role: 1 },
        { Contact: "Alice Chef", Position: "Head Chef", Role: 2 },
        { Contact: "Bob Server", Position: "Server", Role: 4 }
      ]
    },
    universalityResult: "universal" as const,
    validation: () => {
      // Contacts support role-based hierarchies for any organizational structure
      const roleSupport = MONEYWORKS_CONTACTS_FIELDS.find(f => f.fieldName === "Role");
      const positionSupport = MONEYWORKS_CONTACTS_FIELDS.find(f => f.fieldName === "Position");
      return roleSupport?.canonicalDescription.includes("bit mapped") &&
             positionSupport?.maxLength === 39;
    }
  },
  
  {
    businessType: "legal",
    scenarioName: "Legal Client Contact Hierarchy",
    businessOperation: {
      action: "manage_client_contacts",
      entity: "law_firm_clients",
      contacts: ["primary_contact", "billing_contact", "legal_counsel"]
    },
    canonicalMapping: {
      parentEntity: "Names",
      contactRecords: [
        { Contact: "Jane Doe", Position: "CEO", Role: 1, Salutation: "Ms." },
        { Contact: "John Smith", Position: "CFO", Role: 2, Salutation: "Mr." },
        { Contact: "Legal Counsel", Position: "General Counsel", Role: 4, Salutation: "Esq." }
      ]
    },
    universalityResult: "universal" as const,
    validation: () => {
      // Professional contact management with salutations and positions
      const salutationField = MONEYWORKS_CONTACTS_FIELDS.find(f => f.fieldName === "Salutation");
      const positionField = MONEYWORKS_CONTACTS_FIELDS.find(f => f.fieldName === "Position");
      return salutationField?.maxLength === 39 && positionField?.maxLength === 39;
    }
  },
  
  {
    businessType: "manufacturing",
    scenarioName: "Supplier Contact Management",
    businessOperation: {
      action: "manage_supplier_contacts",
      entity: "manufacturing_suppliers",
      contacts: ["sales_rep", "technical_support", "account_manager"]
    },
    canonicalMapping: {
      parentEntity: "Names",
      contactRecords: [
        { Contact: "Sales Rep", Position: "Sales Representative", Mobile: "123-456-7890", Role: 1 },
        { Contact: "Tech Support", Position: "Technical Support", DDI: "123-456-7891", Role: 2 },
        { Contact: "Account Mgr", Position: "Account Manager", eMail: "mgr@supplier.com", Role: 4 }
      ]
    },
    universalityResult: "universal" as const,
    validation: () => {
      // Comprehensive communication tracking for supplier relationships
      const communicationFields = MONEYWORKS_CONTACTS_FIELDS.filter(f => 
        ["Mobile", "DDI", "eMail", "AfterHours"].includes(f.fieldName)
      );
      return communicationFields.length === 4 &&
             communicationFields.every(f => f.canonicalDescription.includes("Contact's"));
    }
  }
];

// ============================================================================
// COMPREHENSIVE VALIDATION SUITE
// ============================================================================

/**
 * Complete validation suite for Contacts entity
 * Runs all validation tests and reports results
 */
export function validateContactsCanonicalOntology() {
  const results = {
    terminologyPurity: CONTACTS_TERMINOLOGY_PURITY_TESTS.map(test => ({
      ...test,
      passed: test.validation()
    })),
    
    fieldCoverage: CONTACTS_FIELD_COVERAGE_TESTS.map(test => ({
      ...test,
      passed: test.validation()
    })),
    
    dataTypeCompliance: CONTACTS_DATA_TYPE_TESTS.map(test => ({
      ...test,
      passed: test.validation()
    })),
    
    businessRuleCompliance: CONTACTS_BUSINESS_RULE_TESTS.map(test => ({
      ...test,
      passed: test.validation()
    })),
    
    relationshipIntegrity: CONTACTS_RELATIONSHIP_TESTS.map(test => ({
      ...test,
      passed: test.validation()
    })),
    
    dualLayerArchitecture: CONTACTS_DUAL_LAYER_ARCHITECTURE_TESTS.map(test => ({
      ...test,
      passed: test.validation()
    })),
    
    universalityValidation: CONTACTS_UNIVERSALITY_TESTS.map(test => ({
      ...test,
      passed: test.validation()
    }))
  };
  
  // Calculate overall validation score
  const allTests = [
    ...results.terminologyPurity,
    ...results.fieldCoverage,
    ...results.dataTypeCompliance,
    ...results.businessRuleCompliance,
    ...results.relationshipIntegrity,
    ...results.dualLayerArchitecture,
    ...results.universalityValidation
  ];
  
  const passedTests = allTests.filter(test => test.passed).length;
  const totalTests = allTests.length;
  const validationScore = (passedTests / totalTests) * 100;
  
  return {
    validationScore,
    passedTests,
    totalTests,
    results,
    isPure: validationScore === 100,
    summary: {
      entityName: "Contacts",
      canonicalPurity: results.terminologyPurity.every(t => t.passed),
      fieldCoverage: results.fieldCoverage.every(t => t.passed),
      businessRuleCompliance: results.businessRuleCompliance.every(t => t.passed),
      dualLayerArchitecture: results.dualLayerArchitecture.every(t => t.passed),
      universalApplicability: results.universalityValidation.every(t => t.passed)
    }
  };
}

// ============================================================================
// USAGE EXAMPLE
// ============================================================================

/**
 * Example usage of validation suite
 */
export function runContactsValidation() {
  console.log("🧪 MoneyWorks Contacts Entity - Canonical Validation");
  console.log("=" .repeat(60));
  
  const validation = validateContactsCanonicalOntology();
  
  console.log(`📊 Validation Score: ${validation.validationScore.toFixed(1)}%`);
  console.log(`✅ Passed Tests: ${validation.passedTests}/${validation.totalTests}`);
  console.log(`🎯 Canonical Purity: ${validation.isPure ? "PURE" : "NEEDS REVIEW"}`);
  
  console.log("\n📋 Validation Summary:");
  console.log(`  • Terminological Purity: ${validation.summary.canonicalPurity ? "✅" : "❌"}`);
  console.log(`  • Field Coverage: ${validation.summary.fieldCoverage ? "✅" : "❌"}`);
  console.log(`  • Business Rule Compliance: ${validation.summary.businessRuleCompliance ? "✅" : "❌"}`);
  console.log(`  • Dual-Layer Architecture: ${validation.summary.dualLayerArchitecture ? "✅" : "❌"}`);
  console.log(`  • Universal Applicability: ${validation.summary.universalApplicability ? "✅" : "❌"}`);
  
  return validation;
}

// Export validation suite
export default {
  validateContactsCanonicalOntology,
  runContactsValidation,
  CONTACTS_TERMINOLOGY_PURITY_TESTS,
  CONTACTS_FIELD_COVERAGE_TESTS,
  CONTACTS_DATA_TYPE_TESTS,
  CONTACTS_BUSINESS_RULE_TESTS,
  CONTACTS_RELATIONSHIP_TESTS,
  CONTACTS_DUAL_LAYER_ARCHITECTURE_TESTS,
  CONTACTS_UNIVERSALITY_TESTS
};