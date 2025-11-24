/**
 * MoneyWorks Allocations Entity - Canonical Validation Test Suite
 * 
 * Comprehensive validation tests for MoneyWorks Allocations canonical ontology
 * Source: moneyworks-allocations-canonical-ontology.ts
 * 
 * VALIDATION SCOPE:
 * - Field definition completeness and accuracy
 * - Canonical terminology purity verification  
 * - Business rule implementation testing
 * - Cross-business universality validation
 * - Entity relationship integrity checking
 */

import {
  MONEYWORKS_ALLOCATION_FIELDS,
  MONEYWORKS_ALLOCATION_CANONICAL_TERMS,
  MONEYWORKS_ALLOCATION_BUSINESS_RULES,
  MONEYWORKS_ALLOCATION_USAGE_PATTERNS,
  MoneyWorksAllocationSplitMode,
  validateAllocationRuleCanonical,
  getCanonicalAllocationExplanation,
  getAllocationComplexityLevel
} from './generated/moneyworks-allocations-canonical-ontology';

// ============================================================================
// FIELD DEFINITION COMPLETENESS TESTS
// ============================================================================

describe('MoneyWorks Allocations - Field Definition Completeness', () => {
  test('All documented fields are extracted', () => {
    const expectedFields = [
      'LastModifiedTime', 'MatchFunction', 'MatchName', 'Priority',
      'SplitAcct1', 'SplitAcct2', 'SplitAcct3', 'SplitAcct4', 
      'SplitAmount1', 'SplitAmount2', 'SplitAmount3', 'SplitMode'
    ];
    
    const extractedFields = MONEYWORKS_ALLOCATION_FIELDS.map(field => field.fieldName);
    
    expectedFields.forEach(expectedField => {
      expect(extractedFields).toContain(expectedField);
    });
    
    expect(extractedFields.length).toBe(12);
  });

  test('All fields have required metadata', () => {
    MONEYWORKS_ALLOCATION_FIELDS.forEach(field => {
      expect(field.fieldName).toBeDefined();
      expect(field.dataType).toBeDefined();
      expect(field.canonicalDescription).toBeDefined();
      expect(field.manualSource).toBe('moneyworks_appendix_allocation_file.html');
      
      // Type-specific validations
      if (field.dataType === 'T') {
        expect(field.maxLength).toBeDefined();
        expect(field.maxLength).toBeGreaterThan(0);
      }
    });
  });

  test('Field data types match manual specifications', () => {
    const fieldTypeMap = new Map([
      ['LastModifiedTime', 'S'],
      ['MatchFunction', 'T'],
      ['MatchName', 'T'], 
      ['Priority', 'N'],
      ['SplitAcct1', 'T'],
      ['SplitAcct2', 'T'],
      ['SplitAcct3', 'T'],
      ['SplitAcct4', 'T'],
      ['SplitAmount1', 'N'],
      ['SplitAmount2', 'N'],
      ['SplitAmount3', 'N'],
      ['SplitMode', 'N']
    ]);

    MONEYWORKS_ALLOCATION_FIELDS.forEach(field => {
      expect(field.dataType).toBe(fieldTypeMap.get(field.fieldName));
    });
  });

  test('Text field length constraints are accurate', () => {
    const lengthConstraints = new Map([
      ['MatchFunction', 255],
      ['MatchName', 11],
      ['SplitAcct1', 13],
      ['SplitAcct2', 13], 
      ['SplitAcct3', 13],
      ['SplitAcct4', 13]
    ]);

    MONEYWORKS_ALLOCATION_FIELDS.forEach(field => {
      if (lengthConstraints.has(field.fieldName)) {
        expect(field.maxLength).toBe(lengthConstraints.get(field.fieldName));
      }
    });
  });
});

// ============================================================================
// CANONICAL TERMINOLOGY PURITY TESTS
// ============================================================================

describe('MoneyWorks Allocations - Canonical Terminology Purity', () => {
  test('Uses MoneyWorks canonical allocation terms', () => {
    const canonicalTerms = Object.values(MONEYWORKS_ALLOCATION_CANONICAL_TERMS);
    
    // Verify key canonical terms are present
    expect(canonicalTerms).toContain('Allocation Rule');
    expect(canonicalTerms).toContain('Auto-Allocation');
    expect(canonicalTerms).toContain('AutoSplit');
    expect(canonicalTerms).toContain('Match Function');
    expect(canonicalTerms).toContain('Split Account');
    expect(canonicalTerms).toContain('Split Mode');
  });

  test('Avoids non-MoneyWorks generic terminology', () => {
    const fieldDescriptions = MONEYWORKS_ALLOCATION_FIELDS.map(f => f.canonicalDescription).join(' ');
    
    // Should NOT contain generic business terms
    const prohibitedTerms = [
      'distribution', 'apportionment', 'assignment', 
      'allocation rule', 'cost center', 'department allocation'
    ];
    
    prohibitedTerms.forEach(term => {
      expect(fieldDescriptions.toLowerCase()).not.toContain(term.toLowerCase());
    });
  });

  test('Field descriptions use exact manual wording', () => {
    // Critical fields must match manual exactly
    const criticalFields = new Map([
      ['MatchFunction', 'The matching text/function that involves the split'],
      ['MatchName', 'The name of the rule'],
      ['Priority', 'Priority of the rule'],
      ['SplitAcct1', 'The first split account'],
      ['SplitAmount1', 'Percent or amount to allocate to first split account'],
      ['SplitMode', 'The type of split']
    ]);

    MONEYWORKS_ALLOCATION_FIELDS.forEach(field => {
      if (criticalFields.has(field.fieldName)) {
        expect(field.canonicalDescription).toBe(criticalFields.get(field.fieldName));
      }
    });
  });
});

// ============================================================================
// SPLIT MODE ENUM VALIDATION TESTS  
// ============================================================================

describe('MoneyWorks Allocations - Split Mode Classification', () => {
  test('Split mode enum provides logical allocation methods', () => {
    expect(MoneyWorksAllocationSplitMode.PERCENTAGE).toBe(1);
    expect(MoneyWorksAllocationSplitMode.FIXED_AMOUNT).toBe(2);
    expect(MoneyWorksAllocationSplitMode.RATIO).toBe(3);
    expect(MoneyWorksAllocationSplitMode.REMAINING_TO_LAST).toBe(4);
  });

  test('Split mode names use MoneyWorks terminology', () => {
    const modeNames = Object.keys(MoneyWorksAllocationSplitMode).filter(key => isNaN(Number(key)));
    
    expect(modeNames).toContain('PERCENTAGE');
    expect(modeNames).toContain('FIXED_AMOUNT');
    expect(modeNames).toContain('RATIO');
    expect(modeNames).toContain('REMAINING_TO_LAST');
  });
});

// ============================================================================
// BUSINESS RULE IMPLEMENTATION TESTS
// ============================================================================

describe('MoneyWorks Allocations - Business Rule Implementation', () => {
  test('All critical business rules are documented', () => {
    const ruleTypes = MONEYWORKS_ALLOCATION_BUSINESS_RULES.map(rule => rule.ruleType);
    
    expect(ruleTypes).toContain('processing');
    expect(ruleTypes).toContain('pattern_matching');
    expect(ruleTypes).toContain('validation');
    expect(ruleTypes).toContain('calculation');
    expect(ruleTypes).toContain('identification');
    expect(ruleTypes).toContain('audit');
  });

  test('Priority processing rule is correctly defined', () => {
    const priorityRule = MONEYWORKS_ALLOCATION_BUSINESS_RULES.find(
      rule => rule.fieldName === 'Priority'
    );
    
    expect(priorityRule).toBeDefined();
    expect(priorityRule?.canonicalRule).toContain('priority order');
    expect(priorityRule?.canonicalRule).toContain('lower numbers processed first');
  });

  test('Account validation rule ensures referential integrity', () => {
    const accountRule = MONEYWORKS_ALLOCATION_BUSINESS_RULES.find(
      rule => rule.fieldName === 'SplitAcct1-4'
    );
    
    expect(accountRule).toBeDefined();
    expect(accountRule?.canonicalRule).toContain('valid accounts');
    expect(accountRule?.canonicalRule).toContain('chart of accounts');
  });

  test('Split calculation rule covers all modes', () => {
    const calculationRule = MONEYWORKS_ALLOCATION_BUSINESS_RULES.find(
      rule => rule.fieldName === 'SplitAmount1-3 + SplitMode'
    );
    
    expect(calculationRule).toBeDefined();
    expect(calculationRule?.canonicalRule).toContain('percentage');
    expect(calculationRule?.canonicalRule).toContain('fixed amounts');
    expect(calculationRule?.canonicalRule).toContain('ratios');
  });
});

// ============================================================================
// VALIDATION FUNCTION TESTS
// ============================================================================

describe('MoneyWorks Allocations - Validation Functions', () => {
  test('validateAllocationRuleCanonical handles valid configuration', () => {
    const result = validateAllocationRuleCanonical(
      '*OFFICE SUPPLIES*',
      'OFFICE_RULE',
      ['6100-01'],
      [100],
      MoneyWorksAllocationSplitMode.PERCENTAGE
    );
    
    expect(result.isValid).toBe(true);
    expect(result.warnings).toHaveLength(0);
  });

  test('validateAllocationRuleCanonical detects invalid configurations', () => {
    // Test missing match function
    let result = validateAllocationRuleCanonical(
      '',
      'TEST_RULE',
      ['6100'],
      [100],
      MoneyWorksAllocationSplitMode.PERCENTAGE
    );
    
    expect(result.isValid).toBe(false);
    expect(result.warnings.some(w => w.includes('MatchFunction is required'))).toBe(true);

    // Test percentage over 100%
    result = validateAllocationRuleCanonical(
      '*TEST*',
      'TEST_RULE',
      ['6100', '6200'],
      [60, 50],
      MoneyWorksAllocationSplitMode.PERCENTAGE
    );
    
    expect(result.isValid).toBe(false);
    expect(result.warnings.some(w => w.includes('exceeds 100%'))).toBe(true);

    // Test too many split accounts
    result = validateAllocationRuleCanonical(
      '*TEST*',
      'TEST_RULE',
      ['6100', '6200', '6300', '6400', '6500'],
      [20, 20, 20, 20, 20],
      MoneyWorksAllocationSplitMode.PERCENTAGE
    );
    
    expect(result.isValid).toBe(false);
    expect(result.warnings.some(w => w.includes('Maximum 4 split accounts'))).toBe(true);
  });

  test('getCanonicalAllocationExplanation generates accurate descriptions', () => {
    const explanation = getCanonicalAllocationExplanation(
      '*UTILITIES*',
      ['6200-ADM', '6200-OPS'],
      [40, 60],
      MoneyWorksAllocationSplitMode.PERCENTAGE
    );
    
    expect(explanation).toContain('*UTILITIES*');
    expect(explanation).toContain('percentage mode');
    expect(explanation).toContain('6200-ADM (40%)');
    expect(explanation).toContain('6200-OPS (60%)');
  });

  test('getAllocationComplexityLevel correctly categorizes rules', () => {
    expect(getAllocationComplexityLevel(['6100']).level).toBe('simple');
    expect(getAllocationComplexityLevel(['6100', '6200']).level).toBe('moderate');
    expect(getAllocationComplexityLevel(['6100', '6200', '6300']).level).toBe('complex');
    expect(getAllocationComplexityLevel(['6100', '6200', '6300', '6400']).level).toBe('maximum');
  });
});

// ============================================================================
// CROSS-BUSINESS UNIVERSALITY TESTS
// ============================================================================

describe('MoneyWorks Allocations - Cross-Business Universality', () => {
  test('Usage patterns cover all major business types', () => {
    const businessTypes = MONEYWORKS_ALLOCATION_USAGE_PATTERNS.flatMap(
      pattern => pattern.businessTypes
    );
    
    expect(businessTypes).toContain('all');
    expect(businessTypes).toContain('professional services');
    expect(businessTypes).toContain('manufacturing');
    expect(businessTypes).toContain('consulting');
  });

  test('All usage patterns have universal applicability', () => {
    MONEYWORKS_ALLOCATION_USAGE_PATTERNS.forEach(pattern => {
      expect(pattern.scenario).toBeDefined();
      expect(pattern.universalApplicability).toBeDefined();
      expect(pattern.canonicalExample).toBeDefined();
      expect(pattern.canonicalExample.matchFunction).toBeDefined();
      expect(pattern.canonicalExample.splitAcct1).toBeDefined();
    });
  });

  test('Restaurant business allocation scenarios work', () => {
    // Restaurant expense allocation
    const restaurantRule = {
      matchFunction: '*FOOD SUPPLIER*',
      splitAcct1: '5100-FOOD',  // Cost of goods sold - food
      splitAcct2: '5100-BEV',   // Cost of goods sold - beverages
      splitAmount1: 80,
      splitAmount2: 20,
      splitMode: MoneyWorksAllocationSplitMode.PERCENTAGE
    };
    
    const validation = validateAllocationRuleCanonical(
      restaurantRule.matchFunction,
      'FOOD_SPLIT',
      [restaurantRule.splitAcct1, restaurantRule.splitAcct2],
      [restaurantRule.splitAmount1, restaurantRule.splitAmount2],
      restaurantRule.splitMode
    );
    
    expect(validation.isValid).toBe(true);
  });

  test('Legal practice allocation scenarios work', () => {
    // Legal time allocation by matter type
    const legalRule = {
      matchFunction: '*RESEARCH SERVICES*',
      splitAcct1: '6100-LIT',   // Litigation expenses
      splitAcct2: '6100-CORP',  // Corporate expenses
      splitAmount1: 1500,       // Fixed amount for litigation
      splitMode: MoneyWorksAllocationSplitMode.FIXED_AMOUNT
    };
    
    const validation = validateAllocationRuleCanonical(
      legalRule.matchFunction,
      'LEGAL_SPLIT',
      [legalRule.splitAcct1, legalRule.splitAcct2],
      [legalRule.splitAmount1],
      legalRule.splitMode
    );
    
    expect(validation.isValid).toBe(true);
  });

  test('Manufacturing allocation scenarios work', () => {
    // Manufacturing overhead allocation
    const manufacturingRule = {
      matchFunction: '*FACTORY LEASE*',
      splitAcct1: '6300-PROD',  // Production overhead
      splitAcct2: '6300-QC',    // Quality control overhead
      splitAcct3: '6300-MAINT', // Maintenance overhead
      splitAmount1: 70,
      splitAmount2: 20,
      splitAmount3: 10,
      splitMode: MoneyWorksAllocationSplitMode.PERCENTAGE
    };
    
    const validation = validateAllocationRuleCanonical(
      manufacturingRule.matchFunction,
      'MFG_SPLIT',
      [manufacturingRule.splitAcct1, manufacturingRule.splitAcct2, manufacturingRule.splitAcct3],
      [manufacturingRule.splitAmount1, manufacturingRule.splitAmount2, manufacturingRule.splitAmount3],
      manufacturingRule.splitMode
    );
    
    expect(validation.isValid).toBe(true);
  });
});

// ============================================================================
// ENTITY RELATIONSHIP INTEGRITY TESTS
// ============================================================================

describe('MoneyWorks Allocations - Entity Relationship Integrity', () => {
  test('Split account fields reference Accounts entity', () => {
    const accountFields = MONEYWORKS_ALLOCATION_FIELDS.filter(
      field => field.fieldName.startsWith('SplitAcct')
    );
    
    accountFields.forEach(field => {
      expect(field.relationshipTarget).toBe('Accounts.Code');
      expect(field.relationshipRule).toContain('account');
    });
  });

  test('Match function relates to transaction processing', () => {
    const matchField = MONEYWORKS_ALLOCATION_FIELDS.find(
      field => field.fieldName === 'MatchFunction'
    );
    
    expect(matchField?.relationshipTarget).toBe('Transaction.Description');
    expect(matchField?.relationshipRule).toContain('transaction');
  });

  test('Split amounts properly relate to split accounts', () => {
    const amountFields = MONEYWORKS_ALLOCATION_FIELDS.filter(
      field => field.fieldName.startsWith('SplitAmount')
    );
    
    amountFields.forEach((field, index) => {
      const expectedTarget = `SplitAcct${index + 1}`;
      expect(field.relationshipTarget).toBe(expectedTarget);
    });
  });
});

// ============================================================================
// INTEGRATION AND COMPLETENESS TESTS
// ============================================================================

describe('MoneyWorks Allocations - Integration Completeness', () => {
  test('Ontology exports all required components', () => {
    expect(MONEYWORKS_ALLOCATION_FIELDS).toBeDefined();
    expect(MONEYWORKS_ALLOCATION_CANONICAL_TERMS).toBeDefined();
    expect(MONEYWORKS_ALLOCATION_BUSINESS_RULES).toBeDefined();
    expect(MONEYWORKS_ALLOCATION_USAGE_PATTERNS).toBeDefined();
    expect(MoneyWorksAllocationSplitMode).toBeDefined();
  });

  test('Manual source attribution is complete', () => {
    MONEYWORKS_ALLOCATION_FIELDS.forEach(field => {
      expect(field.manualSource).toBe('moneyworks_appendix_allocation_file.html');
    });
    
    MONEYWORKS_ALLOCATION_BUSINESS_RULES.forEach(rule => {
      expect(rule.manualSource).toContain('allocation');
    });
  });

  test('Field extraction covers entire manual entity table', () => {
    // Verify we extracted all 12 fields documented in manual
    expect(MONEYWORKS_ALLOCATION_FIELDS).toHaveLength(12);
    
    // Verify coverage of both original and new fields (marked as "new" in manual)
    const newFields = ['MatchName', 'Priority', 'SplitAcct3', 'SplitAcct4', 'SplitAmount3', 'SplitMode'];
    const extractedFieldNames = MONEYWORKS_ALLOCATION_FIELDS.map(f => f.fieldName);
    
    newFields.forEach(newField => {
      expect(extractedFieldNames).toContain(newField);
    });
  });
});

// ============================================================================
// ALLOCATION SYSTEM COMPREHENSIVENESS TESTS
// ============================================================================

describe('MoneyWorks Allocations - System Comprehensiveness', () => {
  test('Supports full allocation workflow', () => {
    // Pattern matching
    expect(MONEYWORKS_ALLOCATION_CANONICAL_TERMS.MATCH_FUNCTION).toBeDefined();
    expect(MONEYWORKS_ALLOCATION_CANONICAL_TERMS.TRANSACTION_MATCHING).toBeDefined();
    
    // Rule management  
    expect(MONEYWORKS_ALLOCATION_CANONICAL_TERMS.MATCH_NAME).toBeDefined();
    expect(MONEYWORKS_ALLOCATION_CANONICAL_TERMS.RULE_PRIORITY).toBeDefined();
    
    // Split configuration
    expect(MONEYWORKS_ALLOCATION_CANONICAL_TERMS.SPLIT_ACCOUNT).toBeDefined();
    expect(MONEYWORKS_ALLOCATION_CANONICAL_TERMS.SPLIT_AMOUNT).toBeDefined();
    expect(MONEYWORKS_ALLOCATION_CANONICAL_TERMS.SPLIT_MODE).toBeDefined();
    
    // Processing context
    expect(MONEYWORKS_ALLOCATION_CANONICAL_TERMS.AUTO_ALLOCATION).toBeDefined();
    expect(MONEYWORKS_ALLOCATION_CANONICAL_TERMS.BANK_IMPORT_ALLOCATION).toBeDefined();
  });

  test('Covers all allocation calculation modes', () => {
    expect(MoneyWorksAllocationSplitMode.PERCENTAGE).toBeDefined();
    expect(MoneyWorksAllocationSplitMode.FIXED_AMOUNT).toBeDefined();
    expect(MoneyWorksAllocationSplitMode.RATIO).toBeDefined();
    expect(MoneyWorksAllocationSplitMode.REMAINING_TO_LAST).toBeDefined();
  });

  test('Supports enterprise allocation complexity', () => {
    // Up to 4-way splits
    expect(MONEYWORKS_ALLOCATION_FIELDS.some(f => f.fieldName === 'SplitAcct4')).toBe(true);
    expect(MONEYWORKS_ALLOCATION_FIELDS.some(f => f.fieldName === 'SplitAmount3')).toBe(true);
    
    // Priority-based rule processing
    expect(MONEYWORKS_ALLOCATION_FIELDS.some(f => f.fieldName === 'Priority')).toBe(true);
    
    // Named rule management
    expect(MONEYWORKS_ALLOCATION_FIELDS.some(f => f.fieldName === 'MatchName')).toBe(true);
  });
});

export {
  // Export test suites for integration testing
  MONEYWORKS_ALLOCATION_FIELDS,
  MONEYWORKS_ALLOCATION_CANONICAL_TERMS,
  validateAllocationRuleCanonical,
  getCanonicalAllocationExplanation,
  getAllocationComplexityLevel
};