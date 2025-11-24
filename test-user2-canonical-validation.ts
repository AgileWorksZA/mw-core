/**
 * MoneyWorks User2 Entity - Canonical Validation Tests
 * 
 * Comprehensive validation of MoneyWorks User2 canonical ontology
 * Testing terminological purity, field coverage, and cross-business universality
 */

import {
  MONEYWORKS_USER2_FIELDS,
  MONEYWORKS_USER2_BUSINESS_RULES,
  USER2_UNIVERSALITY_EXAMPLES,
  validateUser2DevKey,
  validateUser2Key,
  validateUser2TextField,
  validateUser2Record,
  type MoneyWorksUser2
} from './generated/moneyworks-user2-canonical-ontology';

// ============================================================================
// FIELD COVERAGE VALIDATION
// ============================================================================

/**
 * Test 1: Complete field coverage validation
 * Ensures all User2 entity fields from manual are captured
 */
export function testUser2FieldCoverage(): { passed: boolean; details: string[] } {
  const details: string[] = [];
  const expectedFields = [
    'LastModifiedTime', 'DevKey', 'Key', 'Int1', 'Int2', 'Float1', 'Float2',
    'Date1', 'Date2', 'Text1', 'Text2', 'Text', 'Int3', 'Int4', 'Float3', 
    'Float4', 'Date3', 'Date4', 'Text3', 'Text4', 'TaggedText'
  ];
  const extractedFields = MONEYWORKS_USER2_FIELDS.map(f => f.fieldName);
  
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
 * Test 2: Field definition completeness and data type validation
 */
export function testUser2FieldDefinitions(): { passed: boolean; details: string[] } {
  const details: string[] = [];
  let passed = true;
  
  const expectedDataTypes = ['T', 'N', 'D', 'S'];
  
  for (const field of MONEYWORKS_USER2_FIELDS) {
    const issues: string[] = [];
    
    if (!field.fieldName) issues.push("missing fieldName");
    if (!field.dataType) issues.push("missing dataType");
    if (!expectedDataTypes.includes(field.dataType)) issues.push(`invalid dataType: ${field.dataType}`);
    if (!field.canonicalDescription) issues.push("missing canonicalDescription");
    if (!field.manualSource) issues.push("missing manualSource");
    
    if (issues.length > 0) {
      passed = false;
      details.push(`❌ ${field.fieldName}: ${issues.join(', ')}`);
    } else {
      details.push(`✅ ${field.fieldName}: Complete definition (${field.dataType})`);
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
export function testUser2TerminologicalPurity(): { passed: boolean; details: string[] } {
  const details: string[] = [];
  let passed = true;
  
  // Check for domain-specific pollution
  const pollutionTerms = [
    'customer', 'client', 'supplier', 'vendor', 'employee', 'staff',
    'restaurant', 'legal', 'manufacturing', 'retail', 'service'
  ];
  
  const allText = JSON.stringify(MONEYWORKS_USER2_FIELDS).toLowerCase();
  
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
  const properTerms = ['user2', 'devkey', 'key', 'persistent', 'script', 'tagged'];
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
 * Test 4: Business rule completeness and DevKey allocation validation
 */
export function testUser2BusinessRules(): { passed: boolean; details: string[] } {
  const details: string[] = [];
  let passed = true;
  
  const expectedRuleTypes = [
    'allocation', 'uniqueness', 'update_behavior', 'deletion', 
    'import_format', 'field_order', 'optional_fields'
  ];
  
  const extractedRuleTypes = MONEYWORKS_USER2_BUSINESS_RULES.map(r => r.ruleType);
  
  for (const expectedType of expectedRuleTypes) {
    if (!extractedRuleTypes.includes(expectedType)) {
      passed = false;
      details.push(`❌ Missing business rule type: ${expectedType}`);
    } else {
      details.push(`✅ Business rule type present: ${expectedType}`);
    }
  }
  
  // Check DevKey allocation rule specifically
  const devKeyRule = MONEYWORKS_USER2_BUSINESS_RULES.find(r => r.fieldName === 'DevKey');
  if (!devKeyRule) {
    passed = false;
    details.push(`❌ Missing critical DevKey allocation rule`);
  } else {
    details.push(`✅ DevKey allocation rule present: ${devKeyRule.canonicalRule}`);
  }
  
  details.push(`📊 Total business rules: ${MONEYWORKS_USER2_BUSINESS_RULES.length}`);
  
  return { passed, details };
}

// ============================================================================
// CROSS-BUSINESS UNIVERSALITY VALIDATION
// ============================================================================

/**
 * Test 5: Cross-business universality with typed data validation
 */
export function testUser2Universality(): { passed: boolean; details: string[] } {
  const details: string[] = [];
  let passed = true;
  
  const requiredBusinessTypes = ['restaurant', 'legal', 'manufacturing', 'consulting'];
  const coveredBusinessTypes = USER2_UNIVERSALITY_EXAMPLES.map(ex => ex.businessType);
  
  for (const businessType of requiredBusinessTypes) {
    if (!coveredBusinessTypes.includes(businessType)) {
      passed = false;
      details.push(`❌ Missing business type coverage: ${businessType}`);
    } else {
      const example = USER2_UNIVERSALITY_EXAMPLES.find(ex => ex.businessType === businessType);
      details.push(`✅ ${businessType}: ${example?.useCase || 'covered'}`);
      
      // Validate that example demonstrates typed data usage
      if (example?.typedDataExample) {
        const hasIntData = example.typedDataExample.Int1 !== undefined;
        const hasFloatData = example.typedDataExample.Float1 !== undefined;
        const hasDateData = example.typedDataExample.Date1 !== undefined;
        const hasTextData = example.typedDataExample.Text1 !== undefined;
        
        if (hasIntData && hasFloatData && hasDateData && hasTextData) {
          details.push(`   ✅ Demonstrates all data types (Int, Float, Date, Text)`);
        } else {
          passed = false;
          details.push(`   ❌ Missing demonstration of typed data capabilities`);
        }
      }
    }
  }
  
  return { passed, details };
}

// ============================================================================
// VALIDATION FUNCTION TESTING
// ============================================================================

/**
 * Test 6: DevKey validation function testing
 */
export function testUser2DevKeyValidation(): { passed: boolean; details: string[] } {
  const details: string[] = [];
  let passed = true;
  
  const testCases = [
    { devKey: 65536, shouldPass: true, description: "Valid DevKey (minimum user value)" },
    { devKey: 100000, shouldPass: true, description: "Valid DevKey (user range)" },
    { devKey: 65535, shouldPass: false, description: "Invalid DevKey (reserved for plug-ins)" },
    { devKey: 1000, shouldPass: false, description: "Invalid DevKey (too low)" },
    { devKey: -1, shouldPass: false, description: "Invalid DevKey (negative)" },
    { devKey: 65536.5, shouldPass: false, description: "Invalid DevKey (not integer)" }
  ];
  
  for (const testCase of testCases) {
    const result = validateUser2DevKey(testCase.devKey);
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
 * Test 7: Key validation function testing (28 character limit)
 */
export function testUser2KeyValidation(): { passed: boolean; details: string[] } {
  const details: string[] = [];
  let passed = true;
  
  const testCases = [
    { key: "VALID_KEY_2024", shouldPass: true, description: "Valid key" },
    { key: "VERY_LONG_KEY_NAME_EXCEEDS_28", shouldPass: false, description: "Key too long (>28 chars)" },
    { key: "", shouldPass: false, description: "Empty key" },
    { key: "SHORT", shouldPass: true, description: "Short valid key" },
    { key: "EXACTLY_28_CHARACTERS_LONG", shouldPass: true, description: "Key at 28 char limit" }
  ];
  
  for (const testCase of testCases) {
    const result = validateUser2Key(testCase.key);
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
 * Test 8: Text field validation testing (different length limits)
 */
export function testUser2TextFieldValidation(): { passed: boolean; details: string[] } {
  const details: string[] = [];
  let passed = true;
  
  const testCases = [
    { field: "Text1", value: "Valid text", shouldPass: true, description: "Valid Text1" },
    { field: "Text1", value: "x".repeat(256), shouldPass: false, description: "Text1 too long (>255)" },
    { field: "Text", value: "x".repeat(1020), shouldPass: true, description: "Text at 1020 limit" },
    { field: "Text", value: "x".repeat(1021), shouldPass: false, description: "Text too long (>1020)" },
    { field: "TaggedText", value: "x".repeat(255), shouldPass: true, description: "TaggedText at limit" }
  ];
  
  for (const testCase of testCases) {
    const result = validateUser2TextField(testCase.value, testCase.field);
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
 * Test 9: Complete record validation testing
 */
export function testUser2RecordValidation(): { passed: boolean; details: string[] } {
  const details: string[] = [];
  let passed = true;
  
  const validRecord: MoneyWorksUser2 = {
    DevKey: 65536,
    Key: "VALID_RECORD_2024",
    Int1: 100,
    Float1: 99.5,
    Date1: "2024-12-16",
    Text1: "Valid typed data record"
  };
  
  const invalidRecord: MoneyWorksUser2 = {
    DevKey: 1000,          // Too low
    Key: "VERY_LONG_KEY_NAME_THAT_EXCEEDS_28_CHARACTERS", // Too long
    Text1: "x".repeat(300) // Too long
  };
  
  const testCases = [
    { record: validRecord, shouldPass: true, description: "Valid complete record with typed data" },
    { record: invalidRecord, shouldPass: false, description: "Invalid record (DevKey, Key, Text1 violations)" },
    { record: { DevKey: 65537, Key: "MINIMAL" }, shouldPass: true, description: "Minimal valid record" }
  ];
  
  for (const testCase of testCases) {
    const result = validateUser2Record(testCase.record);
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
// VERSION EVOLUTION VALIDATION
// ============================================================================

/**
 * Test 10: Version evolution field tracking
 * Validates that newer version fields are properly marked
 */
export function testUser2VersionEvolution(): { passed: boolean; details: string[] } {
  const details: string[] = [];
  let passed = true;
  
  const newerVersionFields = [
    'Int3', 'Int4', 'Float3', 'Float4', 'Date3', 'Date4', 
    'Text3', 'Text4', 'TaggedText'
  ];
  
  for (const fieldName of newerVersionFields) {
    const field = MONEYWORKS_USER2_FIELDS.find(f => f.fieldName === fieldName);
    if (!field) {
      passed = false;
      details.push(`❌ Missing newer version field: ${fieldName}`);
    } else if (!field.versionNote) {
      passed = false;
      details.push(`❌ ${fieldName}: Missing version note`);
    } else {
      details.push(`✅ ${fieldName}: Version note present`);
    }
  }
  
  return { passed, details };
}

// ============================================================================
// COMPREHENSIVE TEST RUNNER
// ============================================================================

/**
 * Run all User2 entity validation tests
 */
export function runAllUser2ValidationTests(): { 
  overallPassed: boolean; 
  testResults: Array<{ testName: string; passed: boolean; details: string[] }>;
  summary: string[];
} {
  const tests = [
    { name: "Field Coverage", fn: testUser2FieldCoverage },
    { name: "Field Definitions", fn: testUser2FieldDefinitions },
    { name: "Terminological Purity", fn: testUser2TerminologicalPurity },
    { name: "Business Rules", fn: testUser2BusinessRules },
    { name: "Cross-Business Universality", fn: testUser2Universality },
    { name: "DevKey Validation", fn: testUser2DevKeyValidation },
    { name: "Key Validation", fn: testUser2KeyValidation },
    { name: "Text Field Validation", fn: testUser2TextFieldValidation },
    { name: "Record Validation", fn: testUser2RecordValidation },
    { name: "Version Evolution", fn: testUser2VersionEvolution }
  ];
  
  const testResults = tests.map(test => ({
    testName: test.name,
    ...test.fn()
  }));
  
  const passedTests = testResults.filter(r => r.passed).length;
  const totalTests = testResults.length;
  const overallPassed = passedTests === totalTests;
  
  const summary = [
    `📊 User2 Entity Validation Summary:`,
    `✅ Passed: ${passedTests}/${totalTests} tests`,
    `📈 Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`,
    `🎯 Canonical Purity: ${overallPassed ? 'CONFIRMED' : 'ISSUES DETECTED'}`,
    `🌍 Universal Applicability: ${testResults.find(r => r.testName === 'Cross-Business Universality')?.passed ? 'CONFIRMED' : 'ISSUES DETECTED'}`,
    `📈 Enhanced Features: ${testResults.find(r => r.testName === 'Version Evolution')?.passed ? 'CONFIRMED' : 'ISSUES DETECTED'}`
  ];
  
  return { overallPassed, testResults, summary };
}

/**
 * Export all test functions for external testing
 */
export const user2ValidationTests = {
  fieldCoverage: testUser2FieldCoverage,
  fieldDefinitions: testUser2FieldDefinitions,
  terminologicalPurity: testUser2TerminologicalPurity,
  businessRules: testUser2BusinessRules,
  universality: testUser2Universality,
  devKeyValidation: testUser2DevKeyValidation,
  keyValidation: testUser2KeyValidation,
  textFieldValidation: testUser2TextFieldValidation,
  recordValidation: testUser2RecordValidation,
  versionEvolution: testUser2VersionEvolution,
  runAll: runAllUser2ValidationTests
};