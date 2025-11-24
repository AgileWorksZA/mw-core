/**
 * MoneyWorks User Entity - Canonical Validation Tests
 * 
 * Comprehensive validation of MoneyWorks User canonical ontology
 * Testing terminological purity, field coverage, and cross-business universality
 */

import {
  MONEYWORKS_USER_FIELDS,
  MONEYWORKS_USER_BUSINESS_RULES,
  USER_UNIVERSALITY_EXAMPLES,
  validateUserKey,
  validateUserData,
  validateUserRecord,
  type MoneyWorksUser
} from './generated/moneyworks-user-canonical-ontology';

// ============================================================================
// FIELD COVERAGE VALIDATION
// ============================================================================

/**
 * Test 1: Complete field coverage validation
 * Ensures all User entity fields from manual are captured
 */
export function testUserFieldCoverage(): { passed: boolean; details: string[] } {
  const details: string[] = [];
  const expectedFields = ['LastModifiedTime', 'Key', 'Data'];
  const extractedFields = MONEYWORKS_USER_FIELDS.map(f => f.fieldName);
  
  let passed = true;
  
  for (const expectedField of expectedFields) {
    if (!extractedFields.includes(expectedField)) {
      passed = false;
      details.push(`❌ Missing field: ${expectedField}`);
    } else {
      details.push(`✅ Field present: ${expectedField}`);
    }
  }
  
  details.push(`📊 Total fields extracted: ${extractedFields.length}`);
  details.push(`📊 Expected minimum fields: ${expectedFields.length}`);
  
  return { passed, details };
}

/**
 * Test 2: Field definition completeness
 * Validates that each field has complete canonical information
 */
export function testUserFieldDefinitions(): { passed: boolean; details: string[] } {
  const details: string[] = [];
  let passed = true;
  
  for (const field of MONEYWORKS_USER_FIELDS) {
    const issues: string[] = [];
    
    if (!field.fieldName) issues.push("missing fieldName");
    if (!field.dataType) issues.push("missing dataType");
    if (!field.canonicalDescription) issues.push("missing canonicalDescription");
    if (!field.manualSource) issues.push("missing manualSource");
    
    if (issues.length > 0) {
      passed = false;
      details.push(`❌ ${field.fieldName}: ${issues.join(', ')}`);
    } else {
      details.push(`✅ ${field.fieldName}: Complete definition`);
    }
  }
  
  return { passed, details };
}

// ============================================================================
// TERMINOLOGICAL PURITY VALIDATION
// ============================================================================

/**
 * Test 3: MoneyWorks terminological purity
 * Ensures no business domain pollution in canonical layer
 */
export function testUserTerminologicalPurity(): { passed: boolean; details: string[] } {
  const details: string[] = [];
  let passed = true;
  
  // Check for domain-specific pollution
  const pollutionTerms = [
    'customer', 'client', 'supplier', 'vendor', 'employee', 'staff',
    'restaurant', 'legal', 'manufacturing', 'retail', 'service'
  ];
  
  const allText = JSON.stringify(MONEYWORKS_USER_FIELDS).toLowerCase();
  
  for (const term of pollutionTerms) {
    if (allText.includes(term)) {
      passed = false;
      details.push(`❌ Domain pollution detected: "${term}"`);
    }
  }
  
  if (passed) {
    details.push("✅ No domain pollution detected");
  }
  
  // Check for proper MoneyWorks terminology
  const properTerms = ['user', 'key', 'data', 'persistent', 'script'];
  let properTermsFound = 0;
  
  for (const term of properTerms) {
    if (allText.includes(term)) {
      properTermsFound++;
      details.push(`✅ MoneyWorks term found: "${term}"`);
    }
  }
  
  details.push(`📊 Proper MoneyWorks terms: ${properTermsFound}/${properTerms.length}`);
  
  return { passed, details };
}

// ============================================================================
// BUSINESS RULE VALIDATION
// ============================================================================

/**
 * Test 4: Business rule completeness
 * Validates that all business rules from manual are captured
 */
export function testUserBusinessRules(): { passed: boolean; details: string[] } {
  const details: string[] = [];
  let passed = true;
  
  const expectedRuleTypes = [
    'uniqueness', 'deletion', 'conflict_management', 'import_format', 'field_format'
  ];
  
  const extractedRuleTypes = MONEYWORKS_USER_BUSINESS_RULES.map(r => r.ruleType);
  
  for (const expectedType of expectedRuleTypes) {
    if (!extractedRuleTypes.includes(expectedType)) {
      passed = false;
      details.push(`❌ Missing business rule type: ${expectedType}`);
    } else {
      details.push(`✅ Business rule type present: ${expectedType}`);
    }
  }
  
  details.push(`📊 Total business rules: ${MONEYWORKS_USER_BUSINESS_RULES.length}`);
  
  return { passed, details };
}

// ============================================================================
// CROSS-BUSINESS UNIVERSALITY VALIDATION
// ============================================================================

/**
 * Test 5: Cross-business universality validation
 * Tests that User entity works across different business types
 */
export function testUserUniversality(): { passed: boolean; details: string[] } {
  const details: string[] = [];
  let passed = true;
  
  const requiredBusinessTypes = ['restaurant', 'legal', 'manufacturing', 'consulting'];
  const coveredBusinessTypes = USER_UNIVERSALITY_EXAMPLES.map(ex => ex.businessType);
  
  for (const businessType of requiredBusinessTypes) {
    if (!coveredBusinessTypes.includes(businessType)) {
      passed = false;
      details.push(`❌ Missing business type coverage: ${businessType}`);
    } else {
      const example = USER_UNIVERSALITY_EXAMPLES.find(ex => ex.businessType === businessType);
      details.push(`✅ ${businessType}: ${example?.useCase || 'covered'}`);
    }
  }
  
  // Validate that examples demonstrate universality
  for (const example of USER_UNIVERSALITY_EXAMPLES) {
    if (!example.universalApplicability) {
      passed = false;
      details.push(`❌ ${example.businessType}: Missing universality explanation`);
    } else {
      details.push(`✅ ${example.businessType}: Universal pattern confirmed`);
    }
  }
  
  return { passed, details };
}

// ============================================================================
// VALIDATION FUNCTION TESTING
// ============================================================================

/**
 * Test 6: Key validation function testing
 */
export function testUserKeyValidation(): { passed: boolean; details: string[] } {
  const details: string[] = [];
  let passed = true;
  
  const testCases = [
    { key: "VALID_KEY", shouldPass: true, description: "Valid key" },
    { key: "TOOLONGKEY", shouldPass: false, description: "Key too long (>9 chars)" },
    { key: "", shouldPass: false, description: "Empty key" },
    { key: "SHORT", shouldPass: true, description: "Short valid key" },
    { key: "123456789", shouldPass: true, description: "Numeric key at limit" }
  ];
  
  for (const testCase of testCases) {
    const result = validateUserKey(testCase.key);
    const actualPassed = result.isValid;
    
    if (actualPassed === testCase.shouldPass) {
      details.push(`✅ ${testCase.description}: ${actualPassed ? 'Passed' : 'Failed'} as expected`);
    } else {
      passed = false;
      details.push(`❌ ${testCase.description}: Expected ${testCase.shouldPass}, got ${actualPassed}`);
    }
  }
  
  return { passed, details };
}

/**
 * Test 7: Data validation function testing
 */
export function testUserDataValidation(): { passed: boolean; details: string[] } {
  const details: string[] = [];
  let passed = true;
  
  const longData = "x".repeat(246); // Exceeds 245 char limit
  const validData = "Valid persistent data for script configuration";
  
  const testCases = [
    { data: validData, shouldPass: true, description: "Valid data" },
    { data: longData, shouldPass: false, description: "Data too long (>245 chars)" },
    { data: "", shouldPass: true, description: "Empty data (valid for deletion)" },
    { data: "Short", shouldPass: true, description: "Short data" }
  ];
  
  for (const testCase of testCases) {
    const result = validateUserData(testCase.data);
    const actualPassed = result.isValid;
    
    if (actualPassed === testCase.shouldPass) {
      details.push(`✅ ${testCase.description}: ${actualPassed ? 'Passed' : 'Failed'} as expected`);
    } else {
      passed = false;
      details.push(`❌ ${testCase.description}: Expected ${testCase.shouldPass}, got ${actualPassed}`);
    }
  }
  
  return { passed, details };
}

/**
 * Test 8: Complete record validation testing
 */
export function testUserRecordValidation(): { passed: boolean; details: string[] } {
  const details: string[] = [];
  let passed = true;
  
  const validRecord: MoneyWorksUser = {
    Key: "VALID_KEY",
    Data: "Valid persistent configuration data"
  };
  
  const invalidRecord: MoneyWorksUser = {
    Key: "TOOLONGKEY123", // Too long
    Data: "x".repeat(300)  // Too long
  };
  
  const testCases = [
    { record: validRecord, shouldPass: true, description: "Valid complete record" },
    { record: invalidRecord, shouldPass: false, description: "Invalid record (key and data too long)" },
    { record: { Key: "VALID" }, shouldPass: true, description: "Minimal valid record" }
  ];
  
  for (const testCase of testCases) {
    const result = validateUserRecord(testCase.record);
    const actualPassed = result.isValid;
    
    if (actualPassed === testCase.shouldPass) {
      details.push(`✅ ${testCase.description}: ${actualPassed ? 'Passed' : 'Failed'} as expected`);
    } else {
      passed = false;
      details.push(`❌ ${testCase.description}: Expected ${testCase.shouldPass}, got ${actualPassed}`);
      if (!actualPassed) {
        details.push(`   Errors: ${result.errors.join(', ')}`);
      }
    }
  }
  
  return { passed, details };
}

// ============================================================================
// COMPREHENSIVE TEST RUNNER
// ============================================================================

/**
 * Run all User entity validation tests
 */
export function runAllUserValidationTests(): { 
  overallPassed: boolean; 
  testResults: Array<{ testName: string; passed: boolean; details: string[] }>;
  summary: string[];
} {
  const tests = [
    { name: "Field Coverage", fn: testUserFieldCoverage },
    { name: "Field Definitions", fn: testUserFieldDefinitions },
    { name: "Terminological Purity", fn: testUserTerminologicalPurity },
    { name: "Business Rules", fn: testUserBusinessRules },
    { name: "Cross-Business Universality", fn: testUserUniversality },
    { name: "Key Validation", fn: testUserKeyValidation },
    { name: "Data Validation", fn: testUserDataValidation },
    { name: "Record Validation", fn: testUserRecordValidation }
  ];
  
  const testResults = tests.map(test => ({
    testName: test.name,
    ...test.fn()
  }));
  
  const passedTests = testResults.filter(r => r.passed).length;
  const totalTests = testResults.length;
  const overallPassed = passedTests === totalTests;
  
  const summary = [
    `📊 User Entity Validation Summary:`,
    `✅ Passed: ${passedTests}/${totalTests} tests`,
    `📈 Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`,
    `🎯 Canonical Purity: ${overallPassed ? 'CONFIRMED' : 'ISSUES DETECTED'}`,
    `🌍 Universal Applicability: ${testResults.find(r => r.testName === 'Cross-Business Universality')?.passed ? 'CONFIRMED' : 'ISSUES DETECTED'}`
  ];
  
  return { overallPassed, testResults, summary };
}

// ============================================================================
// MANUAL TRACEABILITY VALIDATION
// ============================================================================

/**
 * Test 9: Manual source traceability
 * Ensures all definitions are traceable to manual sources
 */
export function testUserManualTraceability(): { passed: boolean; details: string[] } {
  const details: string[] = [];
  let passed = true;
  
  const expectedManualSource = "moneyworks_appendix_user_file.html";
  
  // Check field manual sources
  for (const field of MONEYWORKS_USER_FIELDS) {
    if (field.manualSource !== expectedManualSource) {
      passed = false;
      details.push(`❌ ${field.fieldName}: Incorrect manual source "${field.manualSource}"`);
    } else {
      details.push(`✅ ${field.fieldName}: Correct manual source`);
    }
  }
  
  // Check business rule manual sources
  for (const rule of MONEYWORKS_USER_BUSINESS_RULES) {
    if (rule.manualSource !== expectedManualSource) {
      passed = false;
      details.push(`❌ Business rule "${rule.ruleType}": Incorrect manual source`);
    } else {
      details.push(`✅ Business rule "${rule.ruleType}": Correct manual source`);
    }
  }
  
  return { passed, details };
}

/**
 * Export all test functions for external testing
 */
export const userValidationTests = {
  fieldCoverage: testUserFieldCoverage,
  fieldDefinitions: testUserFieldDefinitions,
  terminologicalPurity: testUserTerminologicalPurity,
  businessRules: testUserBusinessRules,
  universality: testUserUniversality,
  keyValidation: testUserKeyValidation,
  dataValidation: testUserDataValidation,
  recordValidation: testUserRecordValidation,
  manualTraceability: testUserManualTraceability,
  runAll: runAllUserValidationTests
};