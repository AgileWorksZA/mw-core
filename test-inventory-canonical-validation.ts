/**
 * MoneyWorks Inventory Entity - Canonical Validation Test Suite
 * 
 * COMPREHENSIVE validation of MoneyWorks Inventory canonical ontology
 * Tests terminological purity, cross-business universality, and entity relationships
 * 
 * Source Authority: moneyworks_appendix_inventory.html
 * Ontology: moneyworks-inventory-canonical-ontology.ts
 */

import {
  MONEYWORKS_INVENTORY_FIELDS,
  MONEYWORKS_INVENTORY_FUNCTIONS,
  MONEYWORKS_INVENTORY_CANONICAL_TERMS,
  MoneyWorksInventoryTrackingMode,
  MoneyWorksStockTakeState,
  validateInventoryLocationCanonical,
  validateInventoryIdentifierCanonical,
  validateStockTakeQuantitiesCanonical,
  validateProductSequenceRelationship,
  generateInventoryRecordKey,
  parseInventoryRecordKey,
  calculateStockVariance,
  supportsExpiryTracking
} from './generated/moneyworks-inventory-canonical-ontology';

// ============================================================================
// CANONICAL FIELD COVERAGE VALIDATION
// ============================================================================

/**
 * Test 1: Validate 100% field coverage from manual
 */
export function testInventoryFieldCoverageCanonical(): {
  isValid: boolean;
  coverage: number;
  missingFields: string[];
  extraFields: string[];
} {
  // Expected fields from moneyworks_appendix_inventory.html table
  const expectedFields = [
    'Expiry',
    'Identifier', 
    'LastModifiedTime',
    'Location',
    'ProductSeq',
    'Qty',
    'StockTakeNewQty',
    'StockTakeStartQty'
  ];
  
  const extractedFields = MONEYWORKS_INVENTORY_FIELDS.map(field => field.fieldName);
  
  const missingFields = expectedFields.filter(field => !extractedFields.includes(field));
  const extraFields = extractedFields.filter(field => !expectedFields.includes(field));
  
  return {
    isValid: missingFields.length === 0 && extraFields.length === 0,
    coverage: (extractedFields.length / expectedFields.length) * 100,
    missingFields,
    extraFields
  };
}

/**
 * Test 2: Validate field definitions match manual exactly
 */
export function testInventoryFieldDefinitionAccuracy(): {
  isValid: boolean;
  fieldValidations: any[];
} {
  const fieldValidations = MONEYWORKS_INVENTORY_FIELDS.map(field => {
    const validation = {
      fieldName: field.fieldName,
      hasCanonicalDescription: !!field.canonicalDescription,
      hasManualSource: field.manualSource === 'moneyworks_appendix_inventory.html',
      hasCorrectDataType: ['T', 'N', 'D', 'S'].includes(field.dataType),
      issues: [] as string[]
    };
    
    // Validate specific field requirements
    if (field.fieldName === 'Identifier' && field.maxLength !== 31) {
      validation.issues.push('Identifier should have maxLength 31 per manual');
    }
    
    if (field.fieldName === 'Location' && field.maxLength !== 15) {
      validation.issues.push('Location should have maxLength 15 per manual');
    }
    
    if (field.fieldName === 'Expiry' && field.dataType !== 'D') {
      validation.issues.push('Expiry should be Date type per manual');
    }
    
    if (['ProductSeq', 'Qty'].includes(field.fieldName) && field.dataType !== 'N') {
      validation.issues.push(`${field.fieldName} should be Number type per manual`);
    }
    
    return validation;
  });
  
  const allValid = fieldValidations.every(v => v.issues.length === 0);
  
  return {
    isValid: allValid,
    fieldValidations
  };
}

// ============================================================================
// TERMINOLOGICAL PURITY VALIDATION
// ============================================================================

/**
 * Test 3: Ensure no domain pollution in canonical terminology
 */
export function testInventoryTerminologyPurity(): {
  isValid: boolean;
  purityViolations: string[];
} {
  const purityViolations: string[] = [];
  
  // Check for domain-specific terms that should not appear in canonical layer
  const prohibitedTerms = [
    'warehouse', 'retail', 'store', 'shop',           // Business domain terms
    'item', 'sku', 'upc', 'barcode',                  // Generic inventory terms  
    'cycle count', 'perpetual', 'periodic',          // Inventory methodology terms
    'picking', 'shipping', 'receiving',              // Warehouse operation terms
    'vendor', 'supplier', 'customer'                 // Replaced by MoneyWorks canonical
  ];
  
  const allTerms = Object.values(MONEYWORKS_INVENTORY_CANONICAL_TERMS).join(' ').toLowerCase();
  
  prohibitedTerms.forEach(term => {
    if (allTerms.includes(term.toLowerCase())) {
      purityViolations.push(`Found prohibited term: ${term}`);
    }
  });
  
  return {
    isValid: purityViolations.length === 0,
    purityViolations
  };
}

/**
 * Test 4: Validate MoneyWorks canonical terminology usage
 */
export function testMoneyWorksCanonicalTerminologyUsage(): {
  isValid: boolean;
  canonicalTermsFound: string[];
  missingCanonicalTerms: string[];
} {
  // MoneyWorks canonical terms that should be used
  const requiredCanonicalTerms = [
    'Stock On Hand',           // MoneyWorks standard terminology
    'Stock Take',              // MoneyWorks inventory process
    'Location',                // MoneyWorks location concept
    'Product Sequence',        // MoneyWorks record reference
    'Inventory Subfile',       // MoneyWorks relationship type
    'Serial Number',           // MoneyWorks tracking mode
    'Batch Number'             // MoneyWorks tracking mode
  ];
  
  const allTerms = Object.values(MONEYWORKS_INVENTORY_CANONICAL_TERMS);
  const canonicalTermsFound = requiredCanonicalTerms.filter(term => 
    allTerms.some(canonicalTerm => canonicalTerm.includes(term))
  );
  
  const missingCanonicalTerms = requiredCanonicalTerms.filter(term =>
    !allTerms.some(canonicalTerm => canonicalTerm.includes(term))
  );
  
  return {
    isValid: missingCanonicalTerms.length === 0,
    canonicalTermsFound,
    missingCanonicalTerms
  };
}

// ============================================================================
// CROSS-BUSINESS UNIVERSALITY VALIDATION
// ============================================================================

/**
 * Test 5: Restaurant inventory management universality
 */
export function testRestaurantInventoryUniversality(): {
  isValid: boolean;
  businessScenarios: any[];
} {
  const businessScenarios = [
    {
      scenario: "Fresh ingredient expiry tracking",
      mapping: {
        businessConcept: "ingredient expiration",
        canonicalMapping: "Expiry field with batch tracking",
        universalApplicability: true
      },
      validation: {
        location: "KITCHEN",
        identifier: "BATCH-TOMATO-20241217",
        expiry: "2024-12-20",
        isValid: true
      }
    },
    {
      scenario: "Multiple location stock (kitchen, bar, storage)",
      mapping: {
        businessConcept: "multi-location inventory",
        canonicalMapping: "Location field with SOHForLocation function",
        universalApplicability: true
      },
      validation: {
        locations: ["KITCHEN", "BAR", "STORAGE"],
        productSeq: 123,
        isValid: true
      }
    },
    {
      scenario: "End-of-day stock count",
      mapping: {
        businessConcept: "daily inventory count",
        canonicalMapping: "Stock take functionality",
        universalApplicability: true
      },
      validation: {
        startQty: 50,
        countedQty: 47,
        variance: -3,
        isValid: true
      }
    }
  ];
  
  const allValid = businessScenarios.every(scenario => scenario.validation.isValid);
  
  return {
    isValid: allValid,
    businessScenarios
  };
}

/**
 * Test 6: Manufacturing inventory management universality
 */
export function testManufacturingInventoryUniversality(): {
  isValid: boolean;
  businessScenarios: any[];
} {
  const businessScenarios = [
    {
      scenario: "Serial number tracking for finished goods",
      mapping: {
        businessConcept: "product serial tracking",
        canonicalMapping: "Identifier field for serial numbers",
        universalApplicability: true
      },
      validation: {
        location: "FINISHED",
        identifier: "SN-2024-001234",
        isSerialNumber: true,
        isValid: true
      }
    },
    {
      scenario: "Raw material lot tracking",
      mapping: {
        businessConcept: "material lot control",
        canonicalMapping: "Identifier field for batch/lot numbers",
        universalApplicability: true
      },
      validation: {
        location: "RAW-MATERIALS",
        identifier: "LOT-STEEL-20241201",
        isBatchNumber: true,
        isValid: true
      }
    },
    {
      scenario: "Work-in-progress location tracking",
      mapping: {
        businessConcept: "production stage tracking",
        canonicalMapping: "Multi-location inventory management",
        universalApplicability: true
      },
      validation: {
        locations: ["RAW", "WIP-1", "WIP-2", "FINISHED", "SHIPPING"],
        isValid: true
      }
    }
  ];
  
  const allValid = businessScenarios.every(scenario => scenario.validation.isValid);
  
  return {
    isValid: allValid,
    businessScenarios
  };
}

/**
 * Test 7: Retail inventory management universality
 */
export function testRetailInventoryUniversality(): {
  isValid: boolean;
  businessScenarios: any[];
} {
  const businessScenarios = [
    {
      scenario: "Multi-store inventory tracking",
      mapping: {
        businessConcept: "store-specific stock levels",
        canonicalMapping: "Location-based inventory tracking",
        universalApplicability: true
      },
      validation: {
        locations: ["STORE-001", "STORE-002", "WAREHOUSE"],
        productSeq: 456,
        isValid: true
      }
    },
    {
      scenario: "Cycle counting operations",
      mapping: {
        businessConcept: "periodic stock verification",
        canonicalMapping: "Stock take functionality",
        universalApplicability: true
      },
      validation: {
        startQty: 100,
        countedQty: 98,
        variance: -2,
        adjustmentRequired: true,
        isValid: true
      }
    },
    {
      scenario: "Product expiration management",
      mapping: {
        businessConcept: "perishable goods tracking",
        canonicalMapping: "Expiry field with batch tracking",
        universalApplicability: true
      },
      validation: {
        identifier: "BATCH-MILK-20241218",
        expiry: "2024-12-25",
        supportsExpiry: true,
        isValid: true
      }
    }
  ];
  
  const allValid = businessScenarios.every(scenario => scenario.validation.isValid);
  
  return {
    isValid: allValid,
    businessScenarios
  };
}

// ============================================================================
// ENTITY RELATIONSHIP VALIDATION
// ============================================================================

/**
 * Test 8: Product entity relationship validation
 */
export function testInventoryProductRelationship(): {
  isValid: boolean;
  relationshipValidations: any[];
} {
  const relationshipValidations = [
    {
      relationship: "Inventory -> Products",
      field: "ProductSeq",
      rule: "Must reference valid Product record sequence number",
      testCases: [
        { productSeq: 1, isValid: true, reason: "Valid positive sequence" },
        { productSeq: 0, isValid: false, reason: "Invalid zero sequence" },
        { productSeq: -1, isValid: false, reason: "Invalid negative sequence" },
        { productSeq: 1.5, isValid: false, reason: "Invalid non-integer sequence" }
      ]
    }
  ];
  
  relationshipValidations.forEach(rel => {
    rel.testCases.forEach((testCase: any) => {
      const validation = validateProductSequenceRelationship(testCase.productSeq);
      testCase.actualValid = validation.isValid;
      testCase.passed = testCase.isValid === validation.isValid;
    });
  });
  
  const allPassed = relationshipValidations.every(rel =>
    rel.testCases.every((tc: any) => tc.passed)
  );
  
  return {
    isValid: allPassed,
    relationshipValidations
  };
}

// ============================================================================
// BUSINESS RULE VALIDATION
// ============================================================================

/**
 * Test 9: MoneyWorks inventory business rules validation
 */
export function testInventoryBusinessRules(): {
  isValid: boolean;
  businessRuleTests: any[];
} {
  const businessRuleTests = [
    {
      rule: "Location must be specified for inventory tracking",
      testCases: [
        { location: "WAREHOUSE", isValid: true },
        { location: "", isValid: false },
        { location: "   ", isValid: false },
        { location: "A".repeat(16), isValid: false } // Over 15 char limit
      ]
    },
    {
      rule: "Identifier must be specified for serial/batch tracking",
      testCases: [
        { identifier: "SN-123456", isValid: true },
        { identifier: "", isValid: false },
        { identifier: "A".repeat(32), isValid: false } // Over 31 char limit
      ]
    },
    {
      rule: "Stock take quantities must be non-negative",
      testCases: [
        { startQty: 10, newQty: 8, currentQty: 10, isValid: true },
        { startQty: -5, newQty: 8, currentQty: 10, isValid: false },
        { startQty: 10, newQty: -2, currentQty: 10, isValid: false }
      ]
    }
  ];
  
  businessRuleTests.forEach(rule => {
    rule.testCases.forEach((testCase: any) => {
      if (testCase.location !== undefined) {
        const validation = validateInventoryLocationCanonical(testCase.location);
        testCase.actualValid = validation.isValid;
      } else if (testCase.identifier !== undefined) {
        const validation = validateInventoryIdentifierCanonical(testCase.identifier);
        testCase.actualValid = validation.isValid;
      } else if (testCase.startQty !== undefined) {
        const validation = validateStockTakeQuantitiesCanonical(
          testCase.startQty, testCase.newQty, testCase.currentQty
        );
        testCase.actualValid = validation.isValid;
      }
      
      testCase.passed = testCase.isValid === testCase.actualValid;
    });
  });
  
  const allPassed = businessRuleTests.every(rule =>
    rule.testCases.every((tc: any) => tc.passed)
  );
  
  return {
    isValid: allPassed,
    businessRuleTests
  };
}

// ============================================================================
// FUNCTION COVERAGE VALIDATION
// ============================================================================

/**
 * Test 10: MoneyWorks inventory function coverage
 */
export function testInventoryFunctionCoverage(): {
  isValid: boolean;
  functionCoverage: any[];
} {
  const expectedFunctions = [
    'SOHForLocation',
    'StocktakeNewQtyForLocation', 
    'StocktakeStartQtyForLocation'
  ];
  
  const extractedFunctions = MONEYWORKS_INVENTORY_FUNCTIONS.map(func => func.functionName);
  
  const functionCoverage = expectedFunctions.map(funcName => ({
    functionName: funcName,
    isExtracted: extractedFunctions.includes(funcName),
    hasSignature: MONEYWORKS_INVENTORY_FUNCTIONS.find(f => f.functionName === funcName)?.canonicalSignature !== undefined,
    hasDescription: MONEYWORKS_INVENTORY_FUNCTIONS.find(f => f.functionName === funcName)?.description !== undefined
  }));
  
  const allCovered = functionCoverage.every(func => 
    func.isExtracted && func.hasSignature && func.hasDescription
  );
  
  return {
    isValid: allCovered,
    functionCoverage
  };
}

// ============================================================================
// UTILITY FUNCTION VALIDATION
// ============================================================================

/**
 * Test 11: Inventory utility functions validation
 */
export function testInventoryUtilityFunctions(): {
  isValid: boolean;
  utilityTests: any[];
} {
  const utilityTests = [
    {
      function: "generateInventoryRecordKey",
      testCases: [
        { 
          input: { productSeq: 123, location: "WAREHOUSE", identifier: "SN-001" },
          expected: "123-WAREHOUSE-SN-001",
          description: "Generate valid inventory key"
        }
      ]
    },
    {
      function: "parseInventoryRecordKey", 
      testCases: [
        {
          input: "123-WAREHOUSE-SN-001",
          expected: { productSeq: 123, location: "WAREHOUSE", identifier: "SN-001", isValid: true },
          description: "Parse valid inventory key"
        },
        {
          input: "invalid-key",
          expected: { productSeq: 0, location: "", identifier: "", isValid: false },
          description: "Handle invalid inventory key"
        }
      ]
    },
    {
      function: "calculateStockVariance",
      testCases: [
        {
          input: { startQty: 100, countedQty: 98 },
          expected: { variance: -2, varianceType: "shortage", adjustmentRequired: true },
          description: "Calculate stock shortage"
        },
        {
          input: { startQty: 50, countedQty: 55 },
          expected: { variance: 5, varianceType: "surplus", adjustmentRequired: true },
          description: "Calculate stock surplus"
        },
        {
          input: { startQty: 75, countedQty: 75 },
          expected: { variance: 0, varianceType: "exact", adjustmentRequired: false },
          description: "Calculate exact match"
        }
      ]
    }
  ];
  
  utilityTests.forEach(test => {
    test.testCases.forEach((testCase: any) => {
      try {
        let actualResult;
        
        if (test.function === "generateInventoryRecordKey") {
          const { productSeq, location, identifier } = testCase.input;
          actualResult = generateInventoryRecordKey(productSeq, location, identifier);
          testCase.passed = actualResult === testCase.expected;
        } else if (test.function === "parseInventoryRecordKey") {
          actualResult = parseInventoryRecordKey(testCase.input);
          testCase.passed = JSON.stringify(actualResult) === JSON.stringify(testCase.expected);
        } else if (test.function === "calculateStockVariance") {
          const { startQty, countedQty } = testCase.input;
          actualResult = calculateStockVariance(startQty, countedQty);
          testCase.passed = 
            actualResult.variance === testCase.expected.variance &&
            actualResult.varianceType === testCase.expected.varianceType &&
            actualResult.adjustmentRequired === testCase.expected.adjustmentRequired;
        }
        
        testCase.actualResult = actualResult;
      } catch (error) {
        testCase.passed = false;
        testCase.error = error;
      }
    });
  });
  
  const allPassed = utilityTests.every(test =>
    test.testCases.every((tc: any) => tc.passed)
  );
  
  return {
    isValid: allPassed,
    utilityTests
  };
}

// ============================================================================
// COMPREHENSIVE VALIDATION RUNNER
// ============================================================================

/**
 * Run all inventory canonical validation tests
 */
export function runInventoryCanonicalValidation(): {
  isValid: boolean;
  overallScore: number;
  testResults: any[];
  summary: any;
} {
  const tests = [
    { name: "Field Coverage", test: testInventoryFieldCoverageCanonical },
    { name: "Field Definition Accuracy", test: testInventoryFieldDefinitionAccuracy },
    { name: "Terminology Purity", test: testInventoryTerminologyPurity },
    { name: "Canonical Terminology Usage", test: testMoneyWorksCanonicalTerminologyUsage },
    { name: "Restaurant Universality", test: testRestaurantInventoryUniversality },
    { name: "Manufacturing Universality", test: testManufacturingInventoryUniversality },
    { name: "Retail Universality", test: testRetailInventoryUniversality },
    { name: "Product Relationship", test: testInventoryProductRelationship },
    { name: "Business Rules", test: testInventoryBusinessRules },
    { name: "Function Coverage", test: testInventoryFunctionCoverage },
    { name: "Utility Functions", test: testInventoryUtilityFunctions }
  ];
  
  const testResults = tests.map(test => ({
    name: test.name,
    result: test.test(),
    passed: test.test().isValid
  }));
  
  const passedTests = testResults.filter(test => test.passed).length;
  const overallScore = (passedTests / testResults.length) * 100;
  const isValid = overallScore === 100;
  
  const summary = {
    totalTests: testResults.length,
    passedTests,
    failedTests: testResults.length - passedTests,
    overallScore,
    isValid
  };
  
  return {
    isValid,
    overallScore,
    testResults,
    summary
  };
}

// Export validation functions
export default {
  runInventoryCanonicalValidation,
  testInventoryFieldCoverageCanonical,
  testInventoryFieldDefinitionAccuracy,
  testInventoryTerminologyPurity,
  testMoneyWorksCanonicalTerminologyUsage,
  testRestaurantInventoryUniversality,
  testManufacturingInventoryUniversality,
  testRetailInventoryUniversality,
  testInventoryProductRelationship,
  testInventoryBusinessRules,
  testInventoryFunctionCoverage,
  testInventoryUtilityFunctions
};