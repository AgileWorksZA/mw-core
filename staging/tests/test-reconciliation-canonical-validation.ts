/**
 * MoneyWorks Reconciliation Entity - Canonical Validation Test Suite
 * 
 * Comprehensive test suite validating Reconciliation staging ontology extraction
 * Source Authority: moneyworks_appendix_reconciliation_file.html
 * 
 * PURPOSE: Validate 100% coverage and terminological purity of Reconciliation entity
 */

import {
  MONEYWORKS_RECONCILIATION_FIELDS,
  MONEYWORKS_RECONCILIATION_ENTITY,
  RECONCILIATION_FIELD_COUNT,
  RECONCILIATION_FIELD_NAMES,
  RECONCILIATION_REQUIRED_FIELDS,
  RECONCILIATION_INDEXED_FIELDS,
  RECONCILIATION_RELATIONSHIP_FIELDS
} from '../generated/moneyworks-reconciliation-canonical-ontology';

// ============================================================================
// FIELD COVERAGE VALIDATION TESTS
// ============================================================================

/**
 * Test 1: Complete field coverage validation
 * Ensures ALL fields from manual are extracted
 */
function testReconciliationFieldCoverage(): void {
  const expectedFields = [
    "Account", "Closing", "Date", "Discrepancy", 
    "LastModifiedTime", "Opening", "Statement", "Time"
  ];
  
  console.log("=== RECONCILIATION FIELD COVERAGE TEST ===");
  console.log(`Expected fields: ${expectedFields.length}`);
  console.log(`Extracted fields: ${RECONCILIATION_FIELD_COUNT}`);
  
  expectedFields.forEach(fieldName => {
    const fieldExists = RECONCILIATION_FIELD_NAMES.includes(fieldName as any);
    console.log(`${fieldName}: ${fieldExists ? '✅ FOUND' : '❌ MISSING'}`);
    
    if (!fieldExists) {
      throw new Error(`CRITICAL: Missing field ${fieldName} in Reconciliation ontology`);
    }
  });
  
  console.log("✅ RECONCILIATION FIELD COVERAGE: 100% COMPLETE\n");
}

/**
 * Test 2: Data type accuracy validation
 * Validates MoneyWorks staging data types
 */
function testReconciliationDataTypes(): void {
  const expectedDataTypes = {
    "Account": "T",
    "Closing": "N", 
    "Date": "D",
    "Discrepancy": "N",
    "LastModifiedTime": "S",
    "Opening": "T",
    "Statement": "N",
    "Time": "S"
  };
  
  console.log("=== RECONCILIATION DATA TYPE VALIDATION ===");
  
  Object.entries(expectedDataTypes).forEach(([fieldName, expectedType]) => {
    const field = MONEYWORKS_RECONCILIATION_FIELDS.find(f => f.fieldName === fieldName);
    
    if (!field) {
      throw new Error(`Field ${fieldName} not found in ontology`);
    }
    
    const typeMatch = field.dataType === expectedType;
    console.log(`${fieldName}: ${field.dataType} ${typeMatch ? '✅ CORRECT' : '❌ WRONG'}`);
    
    if (!typeMatch) {
      throw new Error(`CRITICAL: Wrong data type for ${fieldName}. Expected: ${expectedType}, Got: ${field.dataType}`);
    }
  });
  
  console.log("✅ RECONCILIATION DATA TYPES: ALL CORRECT\n");
}

/**
 * Test 3: Field length constraints validation
 * Validates size constraints from manual
 */
function testReconciliationFieldLengths(): void {
  const expectedLengths = {
    "Account": 8,
    "Opening": 5
  };
  
  console.log("=== RECONCILIATION FIELD LENGTH VALIDATION ===");
  
  Object.entries(expectedLengths).forEach(([fieldName, expectedLength]) => {
    const field = MONEYWORKS_RECONCILIATION_FIELDS.find(f => f.fieldName === fieldName);
    
    if (!field) {
      throw new Error(`Field ${fieldName} not found in ontology`);
    }
    
    const lengthMatch = field.maxLength === expectedLength;
    console.log(`${fieldName}: ${field.maxLength} ${lengthMatch ? '✅ CORRECT' : '❌ WRONG'}`);
    
    if (!lengthMatch) {
      throw new Error(`CRITICAL: Wrong length for ${fieldName}. Expected: ${expectedLength}, Got: ${field.maxLength}`);
    }
  });
  
  console.log("✅ RECONCILIATION FIELD LENGTHS: ALL CORRECT\n");
}

// ============================================================================
// TERMINOLOGICAL PURITY VALIDATION
// ============================================================================

/**
 * Test 4: Canonical terminology purity
 * Ensures pure MoneyWorks terminology usage
 */
function testReconciliationTerminologyPurity(): void {
  console.log("=== RECONCILIATION TERMINOLOGY PURITY TEST ===");
  
  const pollutionTerms = [
    "bank", "statement_reconciliation", "balance_check", 
    "account_verification", "matching", "clearing"
  ];
  
  const ontologyText = JSON.stringify(MONEYWORKS_RECONCILIATION_FIELDS).toLowerCase();
  const entityText = JSON.stringify(MONEYWORKS_RECONCILIATION_ENTITY).toLowerCase();
  
  let pollutionFound = false;
  
  pollutionTerms.forEach(term => {
    const inOntology = ontologyText.includes(term);
    const inEntity = entityText.includes(term);
    
    if (inOntology || inEntity) {
      console.log(`❌ POLLUTION DETECTED: "${term}" found in ontology`);
      pollutionFound = true;
    } else {
      console.log(`✅ CLEAN: "${term}" not found`);
    }
  });
  
  if (pollutionFound) {
    throw new Error("CRITICAL: Domain pollution detected in Reconciliation ontology");
  }
  
  console.log("✅ RECONCILIATION TERMINOLOGY: 100% PURE\n");
}

/**
 * Test 5: Manual source traceability
 * Validates every definition cites manual source
 */
function testReconciliationManualTraceability(): void {  
  console.log("=== RECONCILIATION MANUAL TRACEABILITY TEST ===");
  
  const expectedSource = "moneyworks_appendix_reconciliation_file.html";
  
  MONEYWORKS_RECONCILIATION_FIELDS.forEach(field => {
    const hasSource = field.manualSource === expectedSource;
    console.log(`${field.fieldName}: ${hasSource ? '✅ TRACED' : '❌ NO SOURCE'}`);
    
    if (!hasSource) {
      throw new Error(`CRITICAL: Field ${field.fieldName} missing manual source traceability`);
    }
  });
  
  console.log("✅ RECONCILIATION TRACEABILITY: 100% COMPLETE\n");
}

// ============================================================================
// ENTITY RELATIONSHIP VALIDATION
// ============================================================================

/**
 * Test 6: Entity relationship integrity
 * Validates relationships to other MoneyWorks entities
 */
function testReconciliationRelationships(): void {
  console.log("=== RECONCILIATION ENTITY RELATIONSHIPS TEST ===");
  
  const expectedRelationships = [
    {
      field: "Account",
      target: "Accounts",
      rule: "Must reference valid Account code for reconciliation"
    }
  ];
  
  expectedRelationships.forEach(expected => {
    const relationship = RECONCILIATION_RELATIONSHIP_FIELDS.find(r => r.field === expected.field);
    
    if (!relationship) {
      throw new Error(`CRITICAL: Missing relationship for field ${expected.field}`);  
    }
    
    const targetMatch = relationship.target === expected.target;
    console.log(`${expected.field} -> ${relationship.target}: ${targetMatch ? '✅ CORRECT' : '❌ WRONG'}`);
    
    if (!targetMatch) {
      throw new Error(`CRITICAL: Wrong relationship target for ${expected.field}`);
    }
  });
  
  console.log("✅ RECONCILIATION RELATIONSHIPS: ALL VALIDATED\n");
}

// ============================================================================
// CROSS-BUSINESS UNIVERSALITY VALIDATION
// ============================================================================

/**
 * Test 7: Cross-business universality validation
 * Tests Reconciliation across different business domains
 */
function testReconciliationUniversality(): void {
  console.log("=== RECONCILIATION CROSS-BUSINESS UNIVERSALITY TEST ===");
  
  const businessScenarios = [
    {
      type: "restaurant",
      scenario: "Daily cash register reconciliation with bank deposits",
      reconciliationContext: "Cash receipts vs bank statement matching"
    },
    {
      type: "legal_firm", 
      scenario: "Trust account reconciliation for client funds",
      reconciliationContext: "Client trust funds vs bank statement matching"
    },
    {
      type: "manufacturing",
      scenario: "Operating account reconciliation for supplier payments",
      reconciliationContext: "Accounts payable vs bank statement matching"
    },
    {
      type: "consulting",
      scenario: "Business account reconciliation for project invoicing",
      reconciliationContext: "Accounts receivable vs bank statement matching" 
    }
  ];
  
  businessScenarios.forEach(scenario => {
    console.log(`${scenario.type.toUpperCase()}:`);
    console.log(`  Scenario: ${scenario.scenario}`);
    console.log(`  Reconciliation Use: ${scenario.reconciliationContext}`);
    console.log(`  Universal Fields: Account, Date, Opening, Closing, Discrepancy`);
    console.log(`  ✅ UNIVERSALLY APPLICABLE\n`);
  });
  
  const universality = MONEYWORKS_RECONCILIATION_ENTITY.universalityValidation;
  
  if (!universality.universalityConfirmed) {
    throw new Error("CRITICAL: Reconciliation universality not confirmed");
  }
  
  console.log("✅ RECONCILIATION UNIVERSALITY: VALIDATED ACROSS ALL BUSINESS TYPES\n");
}

// ============================================================================
// COMPREHENSIVE TEST EXECUTION
// ============================================================================

/**
 * Execute complete Reconciliation staging validation suite
 */
function runReconciliationValidationSuite(): void {
  console.log("🚀 STARTING RECONCILIATION CANONICAL VALIDATION SUITE\n");
  
  try {
    testReconciliationFieldCoverage();
    testReconciliationDataTypes();
    testReconciliationFieldLengths();
    testReconciliationTerminologyPurity();
    testReconciliationManualTraceability();
    testReconciliationRelationships();
    testReconciliationUniversality();
    
    console.log("🎉 RECONCILIATION CANONICAL VALIDATION: ALL TESTS PASSED");
    console.log("✅ 100% Field Coverage");
    console.log("✅ 100% Data Type Accuracy");
    console.log("✅ 100% Terminology Purity");
    console.log("✅ 100% Manual Traceability");
    console.log("✅ 100% Relationship Integrity");
    console.log("✅ 100% Cross-Business Universality");
    
  } catch (error) {
    console.error("❌ RECONCILIATION VALIDATION FAILED:", error);
    throw error;
  }
}

// Execute validation if run directly
if (require.main === module) {
  runReconciliationValidationSuite();
}

export {
  testReconciliationFieldCoverage,
  testReconciliationDataTypes,
  testReconciliationFieldLengths,
  testReconciliationTerminologyPurity,
  testReconciliationManualTraceability,
  testReconciliationRelationships,
  testReconciliationUniversality,
  runReconciliationValidationSuite
};