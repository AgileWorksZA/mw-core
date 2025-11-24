/**
 * MoneyWorks Departments Entity - Canonical Validation Test Suite
 * 
 * COMPREHENSIVE validation of departments canonical ontology extraction
 * Validates 100% field coverage, business domain applicability, and MoneyWorks compliance
 * 
 * Source Authority: moneyworks_appendix_departments.html
 * Ontology File: generated/moneyworks-departments-canonical-ontology.ts
 */

import {
  MONEYWORKS_DEPARTMENT_FIELDS,
  MONEYWORKS_DEPARTMENT_REQUIRED_FIELDS,
  MONEYWORKS_DEPARTMENT_INDEXED_FIELDS,
  MONEYWORKS_DEPARTMENT_CUSTOM_FIELDS,
  MONEYWORKS_DEPARTMENT_SYSTEM_FIELDS,
  MONEYWORKS_DEPARTMENT_RELATIONSHIPS,
  MONEYWORKS_DEPARTMENT_VALIDATION_RULES,
  MONEYWORKS_DEPARTMENT_BUSINESS_MAPPINGS,
  MoneyWorksDepartmentEntity,
  MoneyWorksDepartmentDataType
} from './generated/moneyworks-departments-canonical-ontology';

// ============================================================================
// FIELD COVERAGE VALIDATION TESTS
// ============================================================================

/**
 * Test 1: Complete field coverage validation
 * Validates that ALL fields from MoneyWorks manual are captured
 */
export function testDepartmentFieldCoverage(): boolean {
  console.log("🧪 Testing Department Field Coverage...");
  
  // Expected fields from moneyworks_appendix_departments.html table
  const expectedFields = [
    "Classification", "Code", "Custom1", "Custom2", "Description", 
    "LastModifiedTime", "UserNum", "UserText", "TaggedText"
  ];
  
  const extractedFields = MONEYWORKS_DEPARTMENT_FIELDS.map(field => field.fieldName);
  
  let allFieldsPresent = true;
  
  expectedFields.forEach(field => {
    if (!extractedFields.includes(field)) {
      console.error(`❌ MISSING FIELD: ${field}`);
      allFieldsPresent = false;
    }
  });
  
  if (allFieldsPresent) {
    console.log(`✅ All ${expectedFields.length} department fields successfully extracted`);
  }
  
  return allFieldsPresent;
}

/**
 * Test 2: Field data type accuracy validation
 * Validates that data types match MoneyWorks manual specifications
 */
export function testDepartmentFieldDataTypes(): boolean {
  console.log("🧪 Testing Department Field Data Types...");
  
  const expectedDataTypes: Record<string, MoneyWorksDepartmentDataType> = {
    "Classification": "T",
    "Code": "T", 
    "Custom1": "T",
    "Custom2": "T",
    "Description": "T",
    "LastModifiedTime": "S",
    "UserNum": "N",
    "UserText": "T",
    "TaggedText": "T"
  };
  
  let allTypesCorrect = true;
  
  MONEYWORKS_DEPARTMENT_FIELDS.forEach(field => {
    const expectedType = expectedDataTypes[field.fieldName];
    if (field.dataType !== expectedType) {
      console.error(`❌ WRONG DATA TYPE: ${field.fieldName} expected ${expectedType}, got ${field.dataType}`);
      allTypesCorrect = false;
    }
  });
  
  if (allTypesCorrect) {
    console.log("✅ All department field data types are correct");
  }
  
  return allTypesCorrect;
}

/**
 * Test 3: Field length validation
 * Validates that field lengths match MoneyWorks manual specifications
 */
export function testDepartmentFieldLengths(): boolean {
  console.log("🧪 Testing Department Field Lengths...");
  
  const expectedLengths: Record<string, number | undefined> = {
    "Classification": 5,
    "Code": 5,
    "Custom1": 15,
    "Custom2": 9,
    "Description": 35,
    "LastModifiedTime": undefined, // System field
    "UserNum": undefined, // Number field
    "UserText": 255,
    "TaggedText": 255
  };
  
  let allLengthsCorrect = true;
  
  MONEYWORKS_DEPARTMENT_FIELDS.forEach(field => {
    const expectedLength = expectedLengths[field.fieldName];
    if (field.maxLength !== expectedLength) {
      console.error(`❌ WRONG FIELD LENGTH: ${field.fieldName} expected ${expectedLength}, got ${field.maxLength}`);
      allLengthsCorrect = false;
    }
  });
  
  if (allLengthsCorrect) {
    console.log("✅ All department field lengths are correct");
  }
  
  return allLengthsCorrect;
}

// ============================================================================
// BUSINESS LOGIC VALIDATION TESTS
// ============================================================================

/**
 * Test 4: Required fields validation
 * Validates business-critical fields are properly marked as required
 */
export function testDepartmentRequiredFields(): boolean {
  console.log("🧪 Testing Department Required Fields...");
  
  const expectedRequiredFields = ["Code", "Description"];
  
  let requiredFieldsCorrect = true;
  
  expectedRequiredFields.forEach(fieldName => {
    if (!MONEYWORKS_DEPARTMENT_REQUIRED_FIELDS.includes(fieldName)) {
      console.error(`❌ MISSING REQUIRED FIELD: ${fieldName}`);
      requiredFieldsCorrect = false;
    }
  });
  
  // Validate no extra required fields
  MONEYWORKS_DEPARTMENT_REQUIRED_FIELDS.forEach(fieldName => {
    if (!expectedRequiredFields.includes(fieldName)) {
      console.error(`❌ UNEXPECTED REQUIRED FIELD: ${fieldName}`);
      requiredFieldsCorrect = false;
    }
  });
  
  if (requiredFieldsCorrect) {
    console.log("✅ Department required fields validation passed");
  }
  
  return requiredFieldsCorrect;
}

/**
 * Test 5: Indexed fields validation
 * Validates performance-critical fields are properly indexed
 */
export function testDepartmentIndexedFields(): boolean {
  console.log("🧪 Testing Department Indexed Fields...");
  
  const expectedIndexedFields = ["Code"]; // Primary key
  
  let indexedFieldsCorrect = true;
  
  expectedIndexedFields.forEach(fieldName => {
    if (!MONEYWORKS_DEPARTMENT_INDEXED_FIELDS.includes(fieldName)) {
      console.error(`❌ MISSING INDEXED FIELD: ${fieldName}`);
      indexedFieldsCorrect = false;
    }
  });
  
  if (indexedFieldsCorrect) {
    console.log("✅ Department indexed fields validation passed");
  }
  
  return indexedFieldsCorrect;
}

/**
 * Test 6: Custom and user fields identification
 * Validates extensibility fields are properly categorized
 */
export function testDepartmentCustomFields(): boolean {
  console.log("🧪 Testing Department Custom Fields...");
  
  const expectedCustomFields = ["Custom1", "Custom2", "UserNum", "UserText"];
  
  let customFieldsCorrect = true;
  
  expectedCustomFields.forEach(fieldName => {
    if (!MONEYWORKS_DEPARTMENT_CUSTOM_FIELDS.includes(fieldName)) {
      console.error(`❌ MISSING CUSTOM FIELD: ${fieldName}`);
      customFieldsCorrect = false;
    }
  });
  
  if (customFieldsCorrect) {
    console.log("✅ Department custom fields validation passed");
  }
  
  return customFieldsCorrect;
}

// ============================================================================
// ENTITY RELATIONSHIP VALIDATION TESTS
// ============================================================================

/**
 * Test 7: Entity relationship mapping validation
 * Validates department references to/from other MoneyWorks entities
 */
export function testDepartmentRelationships(): boolean {
  console.log("🧪 Testing Department Entity Relationships...");
  
  const expectedReferencedBy = ["Accounts", "Transactions", "Jobs", "Names"];
  const expectedReferences = ["General"]; // Departments reference General via Classification field
  
  let relationshipsCorrect = true;
  
  // Validate entities that reference departments
  expectedReferencedBy.forEach(entity => {
    if (!MONEYWORKS_DEPARTMENT_RELATIONSHIPS.referencedBy.includes(entity)) {
      console.error(`❌ MISSING REFERENCING ENTITY: ${entity}`);
      relationshipsCorrect = false;
    }
  });
  
  // Validate entities that departments reference
  expectedReferences.forEach(entity => {
    const referencesEntity = MONEYWORKS_DEPARTMENT_RELATIONSHIPS.references.some(ref => ref.entity === entity);
    if (!referencesEntity) {
      console.error(`❌ MISSING REFERENCED ENTITY: ${entity}`);
      relationshipsCorrect = false;
    }
  });
  
  if (relationshipsCorrect) {
    console.log("✅ Department entity relationships validation passed");
  }
  
  return relationshipsCorrect;
}

// ============================================================================
// CROSS-BUSINESS DOMAIN VALIDATION TESTS
// ============================================================================

/**
 * Test 8: Universal business applicability validation
 * Validates departments work across all business domains
 */
export function testDepartmentUniversality(): boolean {
  console.log("🧪 Testing Department Universal Business Applicability...");
  
  const requiredDomains = ["restaurant", "legal", "construction", "consulting", "manufacturing", "retail"];
  
  let universalityCorrect = true;
  
  requiredDomains.forEach(domain => {
    if (!MONEYWORKS_DEPARTMENT_BUSINESS_MAPPINGS[domain as keyof typeof MONEYWORKS_DEPARTMENT_BUSINESS_MAPPINGS]) {
      console.error(`❌ MISSING BUSINESS DOMAIN: ${domain}`);
      universalityCorrect = false;
    } else {
      const departments = MONEYWORKS_DEPARTMENT_BUSINESS_MAPPINGS[domain as keyof typeof MONEYWORKS_DEPARTMENT_BUSINESS_MAPPINGS];
      if (!departments || departments.length < 3) {
        console.error(`❌ INSUFFICIENT DEPARTMENTS FOR ${domain}: Need at least 3, got ${departments?.length || 0}`);
        universalityCorrect = false;
      }
    }
  });
  
  if (universalityCorrect) {
    console.log("✅ Department universal business applicability validation passed");
  }
  
  return universalityCorrect;
}

/**
 * Test 9: Department business scenario validation
 * Tests realistic department usage across business scenarios
 */
export function testDepartmentBusinessScenarios(): boolean {
  console.log("🧪 Testing Department Business Scenarios...");
  
  let scenariosValid = true;
  
  // Scenario 1: Restaurant cost center tracking
  const restaurantDept: MoneyWorksDepartmentEntity = {
    Code: "KITCH",
    Description: "Kitchen Operations",
    Classification: "PROD",
    Custom1: "Food Service",
    Custom2: "Manager1"
  };
  
  if (!validateDepartmentEntity(restaurantDept)) {
    console.error("❌ Restaurant department scenario failed");
    scenariosValid = false;
  }
  
  // Scenario 2: Legal practice area tracking
  const legalDept: MoneyWorksDepartmentEntity = {
    Code: "LITG",
    Description: "Litigation Department",
    Classification: "LEGAL",
    UserText: "High-stakes commercial litigation"
  };
  
  if (!validateDepartmentEntity(legalDept)) {
    console.error("❌ Legal department scenario failed");
    scenariosValid = false;
  }
  
  // Scenario 3: Construction project tracking
  const constructionDept: MoneyWorksDepartmentEntity = {
    Code: "RESI",
    Description: "Residential Construction",
    UserNum: 2024,
    TaggedText: "active,residential,permits-required"
  };
  
  if (!validateDepartmentEntity(constructionDept)) {
    console.error("❌ Construction department scenario failed");
    scenariosValid = false;
  }
  
  if (scenariosValid) {
    console.log("✅ Department business scenarios validation passed");
  }
  
  return scenariosValid;
}

// ============================================================================
// VALIDATION HELPER FUNCTIONS
// ============================================================================

/**
 * Validates a department entity against MoneyWorks canonical rules
 */
function validateDepartmentEntity(dept: MoneyWorksDepartmentEntity): boolean {
  // Required field validation
  if (!dept.Code || dept.Code.trim() === '') {
    console.error("Department code is required");
    return false;
  }
  
  if (!dept.Description || dept.Description.trim() === '') {
    console.error("Department description is required");
    return false;
  }
  
  // Length validation
  if (dept.Code.length > 5) {
    console.error(`Department code exceeds maximum length: ${dept.Code.length} > 5`);
    return false;
  }
  
  if (dept.Description.length > 35) {
    console.error(`Department description exceeds maximum length: ${dept.Description.length} > 35`);
    return false;
  }
  
  if (dept.Classification && dept.Classification.length > 5) {
    console.error(`Department classification exceeds maximum length: ${dept.Classification.length} > 5`);
    return false;
  }
  
  return true;
}

// ============================================================================
// COMPLETE VALIDATION SUITE RUNNER
// ============================================================================

/**
 * Runs complete department canonical validation suite
 * Returns overall validation result
 */
export function runDepartmentValidationSuite(): boolean {
  console.log("🚀 Starting MoneyWorks Departments Canonical Validation Suite");
  console.log("=" .repeat(70));
  
  const tests = [
    testDepartmentFieldCoverage,
    testDepartmentFieldDataTypes,
    testDepartmentFieldLengths,
    testDepartmentRequiredFields,
    testDepartmentIndexedFields,
    testDepartmentCustomFields,
    testDepartmentRelationships,
    testDepartmentUniversality,
    testDepartmentBusinessScenarios
  ];
  
  let allTestsPassed = true;
  let passedTests = 0;
  
  tests.forEach((test, index) => {
    try {
      const result = test();
      if (result) {
        passedTests++;
      } else {
        allTestsPassed = false;
      }
    } catch (error) {
      console.error(`❌ Test ${index + 1} threw error:`, error);
      allTestsPassed = false;
    }
    console.log("-".repeat(50));
  });
  
  console.log("=" .repeat(70));
  console.log(`📊 VALIDATION RESULTS: ${passedTests}/${tests.length} tests passed`);
  
  if (allTestsPassed) {
    console.log("🎉 ALL DEPARTMENT VALIDATION TESTS PASSED!");
    console.log("✅ MoneyWorks Departments canonical ontology is VALID");
  } else {
    console.log("❌ Some department validation tests FAILED");
    console.log("🔧 Review and fix the failed validations");
  }
  
  return allTestsPassed;
}

/**
 * Quick validation for development/debugging
 */
export function quickDepartmentValidation(): void {
  console.log("⚡ Quick Department Validation Check");
  console.log(`📋 Total Fields: ${MONEYWORKS_DEPARTMENT_FIELDS.length}`);
  console.log(`🔑 Required Fields: ${MONEYWORKS_DEPARTMENT_REQUIRED_FIELDS.length}`);
  console.log(`📇 Indexed Fields: ${MONEYWORKS_DEPARTMENT_INDEXED_FIELDS.length}`);
  console.log(`🛠️ Custom Fields: ${MONEYWORKS_DEPARTMENT_CUSTOM_FIELDS.length}`);
  console.log(`⚙️ System Fields: ${MONEYWORKS_DEPARTMENT_SYSTEM_FIELDS.length}`);
  console.log(`🔗 Referenced By: ${MONEYWORKS_DEPARTMENT_RELATIONSHIPS.referencedBy.length} entities`);
  console.log(`🌍 Business Domains: ${Object.keys(MONEYWORKS_DEPARTMENT_BUSINESS_MAPPINGS).length}`);
}

// Run validation if called directly
if (require.main === module) {
  runDepartmentValidationSuite();
}