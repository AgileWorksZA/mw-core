/**
 * MoneyWorks Login Entity - Canonical Validation Tests
 * 
 * Comprehensive validation of MoneyWorks Login canonical ontology
 * Testing terminological purity, field coverage, and cross-business universality
 */

import {
  MONEYWORKS_LOGIN_FIELDS,
  MONEYWORKS_LOGIN_BUSINESS_RULES,
  LOGIN_UNIVERSALITY_EXAMPLES,
  LOGIN_ENTITY_RELATIONSHIPS,
  validateLoginName,
  validateLoginEmail,
  validateLoginSecurityLevel,
  validateLoginRecord,
  type MoneyWorksLogin
} from './generated/moneyworks-login-canonical-ontology';

// ============================================================================
// FIELD COVERAGE VALIDATION
// ============================================================================

/**
 * Test 1: Complete field coverage validation
 * Ensures all Login entity fields from manual are captured
 */
export function testLoginFieldCoverage(): { passed: boolean; details: string[] } {
  const details: string[] = [];
  const expectedFields = [
    'Category', 'Email', 'Flags', 'Initials', 'LastModifiedTime', 'Name',
    'Password', 'Privileges', 'Role', 'SecurityLevel', 'TaggedText', 'UserNum', 'UserText'
  ];
  const extractedFields = MONEYWORKS_LOGIN_FIELDS.map(f => f.fieldName);
  
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
export function testLoginFieldDefinitions(): { passed: boolean; details: string[] } {
  const details: string[] = [];
  let passed = true;
  
  const expectedDataTypes = ['T', 'N', 'S', '3'];
  
  for (const field of MONEYWORKS_LOGIN_FIELDS) {
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
// SECURITY FIELD VALIDATION
// ============================================================================

/**
 * Test 3: Security field validation (Password, Privileges, Security Level)
 */
export function testLoginSecurityFields(): { passed: boolean; details: string[] } {
  const details: string[] = [];
  let passed = true;
  
  // Check Password field
  const passwordField = MONEYWORKS_LOGIN_FIELDS.find(f => f.fieldName === 'Password');
  if (!passwordField) {
    passed = false;
    details.push(`❌ Missing Password field`);
  } else {
    if (passwordField.securityNote !== 'Stored encrypted, never plain text') {
      passed = false;
      details.push(`❌ Password: Missing or incorrect security note`);
    } else {
      details.push(`✅ Password: Security note present`);
    }
    
    if (passwordField.maxLength !== 33) {
      passed = false;
      details.push(`❌ Password: Incorrect length limit (expected 33, got ${passwordField.maxLength})`);
    } else {
      details.push(`✅ Password: Correct length limit (33 chars)`);
    }
  }
  
  // Check Privileges field
  const privilegesField = MONEYWORKS_LOGIN_FIELDS.find(f => f.fieldName === 'Privileges');
  if (!privilegesField) {
    passed = false;
    details.push(`❌ Missing Privileges field`);
  } else {
    if (privilegesField.maxLength !== 65) {
      passed = false;
      details.push(`❌ Privileges: Incorrect length limit (expected 65, got ${privilegesField.maxLength})`);
    } else {
      details.push(`✅ Privileges: Correct length limit (65 chars)`);
    }
  }
  
  // Check SecurityLevel field
  const securityLevelField = MONEYWORKS_LOGIN_FIELDS.find(f => f.fieldName === 'SecurityLevel');
  if (!securityLevelField) {
    passed = false;
    details.push(`❌ Missing SecurityLevel field`);
  } else {
    if (securityLevelField.dataType !== 'N') {
      passed = false;
      details.push(`❌ SecurityLevel: Incorrect data type (expected N, got ${securityLevelField.dataType})`);
    } else {
      details.push(`✅ SecurityLevel: Correct data type (N)`);
    }
  }
  
  return { passed, details };
}

// ============================================================================
// TERMINOLOGICAL PURITY VALIDATION
// ============================================================================

/**
 * Test 4: MoneyWorks terminological purity
 * Ensures no business domain pollution in canonical layer
 */
export function testLoginTerminologicalPurity(): { passed: boolean; details: string[] } {
  const details: string[] = [];
  let passed = true;
  
  // Check for domain-specific pollution (should only appear in universality examples)
  const pollutionTerms = [
    'customer', 'client', 'supplier', 'vendor', 'employee', 'staff'
  ];
  
  const fieldsText = JSON.stringify(MONEYWORKS_LOGIN_FIELDS).toLowerCase();
  
  for (const term of pollutionTerms) {
    if (fieldsText.includes(term)) {
      passed = false;
      details.push(`❌ Domain pollution detected in fields: "${term}"`);
    }
  }
  
  if (passed) {
    details.push("✅ No domain pollution detected in field definitions");
  }
  
  // Check for proper MoneyWorks authentication terminology
  const properTerms = ['login', 'user', 'role', 'privilege', 'security', 'password'];
  let properTermsFound = 0;
  
  for (const term of properTerms) {
    if (fieldsText.includes(term)) {
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
 * Test 5: Business rule completeness and security validation
 */
export function testLoginBusinessRules(): { passed: boolean; details: string[] } {
  const details: string[] = [];
  let passed = true;
  
  const expectedRuleTypes = [
    'uniqueness', 'security', 'authorization', 'role_based_access', 
    'hierarchical_access', 'communication', 'organization'
  ];
  
  const extractedRuleTypes = MONEYWORKS_LOGIN_BUSINESS_RULES.map(r => r.ruleType);
  
  for (const expectedType of expectedRuleTypes) {
    if (!extractedRuleTypes.includes(expectedType)) {
      passed = false;
      details.push(`❌ Missing business rule type: ${expectedType}`);
    } else {
      details.push(`✅ Business rule type present: ${expectedType}`);
    }
  }
  
  // Check critical security rules
  const securityRule = MONEYWORKS_LOGIN_BUSINESS_RULES.find(r => r.ruleType === 'security');
  if (!securityRule) {
    passed = false;
    details.push(`❌ Missing critical security rule`);
  } else {
    details.push(`✅ Security rule present: ${securityRule.canonicalRule}`);
  }
  
  // Check uniqueness rules
  const uniquenessRules = MONEYWORKS_LOGIN_BUSINESS_RULES.filter(r => r.ruleType === 'uniqueness');
  if (uniquenessRules.length < 2) {
    passed = false;
    details.push(`❌ Missing uniqueness rules (expected Name and Initials)`);
  } else {
    details.push(`✅ Uniqueness rules present: ${uniquenessRules.length}`);
  }
  
  details.push(`📊 Total business rules: ${MONEYWORKS_LOGIN_BUSINESS_RULES.length}`);
  
  return { passed, details };
}

// ============================================================================
// CROSS-BUSINESS UNIVERSALITY VALIDATION
// ============================================================================

/**
 * Test 6: Cross-business universality with role-based access validation
 */
export function testLoginUniversality(): { passed: boolean; details: string[] } {
  const details: string[] = [];
  let passed = true;
  
  const requiredBusinessTypes = ['restaurant', 'legal', 'manufacturing', 'consulting'];
  const coveredBusinessTypes = LOGIN_UNIVERSALITY_EXAMPLES.map(ex => ex.businessType);
  
  for (const businessType of requiredBusinessTypes) {
    if (!coveredBusinessTypes.includes(businessType)) {
      passed = false;
      details.push(`❌ Missing business type coverage: ${businessType}`);
    } else {
      const example = LOGIN_UNIVERSALITY_EXAMPLES.find(ex => ex.businessType === businessType);
      details.push(`✅ ${businessType}: ${example?.useCase || 'covered'}`);
      
      // Validate that example demonstrates role-based access
      if (example?.userExample) {
        const hasRole = example.userExample.Role !== undefined;
        const hasSecurityLevel = example.userExample.SecurityLevel !== undefined;
        const hasCategory = example.userExample.Category !== undefined;
        
        if (hasRole && hasSecurityLevel && hasCategory) {
          details.push(`   ✅ Demonstrates role-based access control`);
        } else {
          passed = false;
          details.push(`   ❌ Missing role-based access demonstration`);
        }
      }
    }
  }
  
  return { passed, details };
}

// ============================================================================
// ENTITY RELATIONSHIP VALIDATION
// ============================================================================

/**
 * Test 7: Entity relationship validation (user tracking across entities)
 */
export function testLoginEntityRelationships(): { passed: boolean; details: string[] } {
  const details: string[] = [];
  let passed = true;
  
  const expectedRelatedEntities = ['Transactions', 'Names', 'Products', 'Jobs'];
  const extractedRelatedEntities = LOGIN_ENTITY_RELATIONSHIPS.map(r => r.targetEntity);
  
  for (const expectedEntity of expectedRelatedEntities) {
    if (!extractedRelatedEntities.includes(expectedEntity)) {
      passed = false;
      details.push(`❌ Missing relationship to: ${expectedEntity}`);
    } else {
      const relationship = LOGIN_ENTITY_RELATIONSHIPS.find(r => r.targetEntity === expectedEntity);
      details.push(`✅ Relationship to ${expectedEntity}: ${relationship?.relationshipType}`);
      
      // Validate that relationship uses Initials field for tracking
      if (relationship?.relationshipField !== 'Initials') {
        passed = false;
        details.push(`   ❌ ${expectedEntity}: Should use Initials field for tracking`);
      } else {
        details.push(`   ✅ ${expectedEntity}: Uses Initials for user tracking`);
      }
    }
  }
  
  details.push(`📊 Total entity relationships: ${LOGIN_ENTITY_RELATIONSHIPS.length}`);
  
  return { passed, details };
}

// ============================================================================
// VALIDATION FUNCTION TESTING
// ============================================================================

/**
 * Test 8: Name validation function testing
 */
export function testLoginNameValidation(): { passed: boolean; details: string[] } {
  const details: string[] = [];
  let passed = true;
  
  const testCases = [
    { name: "John Smith", shouldPass: true, description: "Valid name" },
    { name: "A".repeat(32), shouldPass: false, description: "Name too long (>31 chars)" },
    { name: "", shouldPass: false, description: "Empty name" },
    { name: "A".repeat(31), shouldPass: true, description: "Name at 31 char limit" },
    { name: "Admin", shouldPass: true, description: "Short valid name" }
  ];
  
  for (const testCase of testCases) {
    const result = validateLoginName(testCase.name);
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
 * Test 9: Email validation function testing
 */
export function testLoginEmailValidation(): { passed: boolean; details: string[] } {
  const details: string[] = [];
  let passed = true;
  
  const testCases = [
    { email: "user@example.com", shouldPass: true, description: "Valid email" },
    { email: "a".repeat(60) + "@example.com", shouldPass: false, description: "Email too long (>63 chars)" },
    { email: "invalid-email", shouldPass: false, description: "Invalid email format" },
    { email: "", shouldPass: true, description: "Empty email (optional field)" },
    { email: "test@domain.co.uk", shouldPass: true, description: "Valid complex email" }
  ];
  
  for (const testCase of testCases) {
    const result = validateLoginEmail(testCase.email);
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
 * Test 10: Security level validation function testing
 */
export function testLoginSecurityLevelValidation(): { passed: boolean; details: string[] } {
  const details: string[] = [];
  let passed = true;
  
  const testCases = [
    { level: 5, shouldPass: true, description: "Valid security level" },
    { level: 0, shouldPass: true, description: "Minimum security level" },
    { level: 10, shouldPass: true, description: "Maximum security level" },
    { level: -1, shouldPass: false, description: "Negative security level" },
    { level: 11, shouldPass: false, description: "Security level too high" },
    { level: 5.5, shouldPass: false, description: "Non-integer security level" }
  ];
  
  for (const testCase of testCases) {
    const result = validateLoginSecurityLevel(testCase.level);
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
 * Test 11: Complete record validation testing
 */
export function testLoginRecordValidation(): { passed: boolean; details: string[] } {
  const details: string[] = [];
  let passed = true;
  
  const validRecord: MoneyWorksLogin = {
    Name: "Admin User",
    Category: "Management",
    Email: "admin@company.com",
    Role: "ADM",
    SecurityLevel: 10,
    Initials: "AU"
  };
  
  const invalidRecord: MoneyWorksLogin = {
    Name: "A".repeat(35),          // Too long
    Email: "invalid-email-format", // Invalid format
    SecurityLevel: 15,             // Too high
    Category: "A".repeat(35)       // Too long
  };
  
  const testCases = [
    { record: validRecord, shouldPass: true, description: "Valid complete record" },
    { record: invalidRecord, shouldPass: false, description: "Invalid record (multiple violations)" },
    { record: { Name: "MinUser" }, shouldPass: true, description: "Minimal valid record" }
  ];
  
  for (const testCase of testCases) {
    const result = validateLoginRecord(testCase.record);
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
 * Run all Login entity validation tests
 */
export function runAllLoginValidationTests(): { 
  overallPassed: boolean; 
  testResults: Array<{ testName: string; passed: boolean; details: string[] }>;
  summary: string[];
} {
  const tests = [
    { name: "Field Coverage", fn: testLoginFieldCoverage },
    { name: "Field Definitions", fn: testLoginFieldDefinitions },
    { name: "Security Fields", fn: testLoginSecurityFields },
    { name: "Terminological Purity", fn: testLoginTerminologicalPurity },
    { name: "Business Rules", fn: testLoginBusinessRules },
    { name: "Cross-Business Universality", fn: testLoginUniversality },
    { name: "Entity Relationships", fn: testLoginEntityRelationships },
    { name: "Name Validation", fn: testLoginNameValidation },
    { name: "Email Validation", fn: testLoginEmailValidation },
    { name: "Security Level Validation", fn: testLoginSecurityLevelValidation },
    { name: "Record Validation", fn: testLoginRecordValidation }
  ];
  
  const testResults = tests.map(test => ({
    testName: test.name,
    ...test.fn()
  }));
  
  const passedTests = testResults.filter(r => r.passed).length;
  const totalTests = testResults.length;
  const overallPassed = passedTests === totalTests;
  
  const summary = [
    `📊 Login Entity Validation Summary:`,
    `✅ Passed: ${passedTests}/${totalTests} tests`,
    `📈 Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`,
    `🎯 Canonical Purity: ${overallPassed ? 'CONFIRMED' : 'ISSUES DETECTED'}`,
    `🌍 Universal Applicability: ${testResults.find(r => r.testName === 'Cross-Business Universality')?.passed ? 'CONFIRMED' : 'ISSUES DETECTED'}`,
    `🔒 Security Features: ${testResults.find(r => r.testName === 'Security Fields')?.passed ? 'CONFIRMED' : 'ISSUES DETECTED'}`,
    `🔗 Entity Relationships: ${testResults.find(r => r.testName === 'Entity Relationships')?.passed ? 'CONFIRMED' : 'ISSUES DETECTED'}`
  ];
  
  return { overallPassed, testResults, summary };
}

/**
 * Export all test functions for external testing
 */
export const loginValidationTests = {
  fieldCoverage: testLoginFieldCoverage,
  fieldDefinitions: testLoginFieldDefinitions,
  securityFields: testLoginSecurityFields,
  terminologicalPurity: testLoginTerminologicalPurity,
  businessRules: testLoginBusinessRules,
  universality: testLoginUniversality,
  entityRelationships: testLoginEntityRelationships,
  nameValidation: testLoginNameValidation,
  emailValidation: testLoginEmailValidation,
  securityLevelValidation: testLoginSecurityLevelValidation,
  recordValidation: testLoginRecordValidation,
  runAll: runAllLoginValidationTests
};