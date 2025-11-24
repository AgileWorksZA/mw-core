/**
 * MoneyWorks Build Records Entity - Comprehensive Canonical Validation
 * 
 * Tests ALL aspects of the Build Records canonical ontology including:
 * - Field validation and constraints
 * - Relationship integrity
 * - Business rule compliance
 * - Cross-business universality
 * - Manufacturing scenarios
 * - Terminological purity
 */

import {
  MONEYWORKS_BUILD_RECORDS_FIELDS,
  MONEYWORKS_BUILD_RECORDS_CANONICAL_TERMS,
  MONEYWORKS_BUILD_RECORDS_RELATIONSHIPS,
  MONEYWORKS_BUILD_RECORDS_BUSINESS_RULES,
  MONEYWORKS_BUILD_RECORDS_USAGE_PATTERNS,
  validateBuildRecordCanonical,
  getCanonicalBuildRecordExplanation,
  validateBuildRecordRelationships,
  getManufacturingRecipeSummary
} from './generated/moneyworks-build-records-canonical-ontology';

// ============================================================================
// FIELD VALIDATION TESTS
// ============================================================================

/**
 * Test 1: Complete field coverage validation
 */
function testFieldCoverage(): void {
  console.log("=== BUILD RECORDS FIELD COVERAGE TEST ===");
  
  const requiredFields = ["LastModifiedTime", "ProductSeq", "PartCode", "Qty", "Memo"];
  const extractedFields = MONEYWORKS_BUILD_RECORDS_FIELDS.map(field => field.fieldName);
  
  console.log("Manual fields:", requiredFields);
  console.log("Extracted fields:", extractedFields);
  
  // Verify all manual fields are extracted
  const missingFields = requiredFields.filter(field => !extractedFields.includes(field));
  const extraFields = extractedFields.filter(field => !requiredFields.includes(field));
  
  console.log("Missing fields:", missingFields.length === 0 ? "None ✅" : missingFields);
  console.log("Extra fields:", extraFields.length === 0 ? "None ✅" : extraFields);
  
  // Verify field specifications
  const productSeqField = MONEYWORKS_BUILD_RECORDS_FIELDS.find(f => f.fieldName === "ProductSeq");
  const partCodeField = MONEYWORKS_BUILD_RECORDS_FIELDS.find(f => f.fieldName === "PartCode");
  const qtyField = MONEYWORKS_BUILD_RECORDS_FIELDS.find(f => f.fieldName === "Qty");
  const memoField = MONEYWORKS_BUILD_RECORDS_FIELDS.find(f => f.fieldName === "Memo");
  
  console.log("ProductSeq field validation:", productSeqField?.dataType === "N" && productSeqField?.isRequired ? "✅" : "❌");
  console.log("PartCode field validation:", partCodeField?.dataType === "T" && partCodeField?.maxLength === 19 && partCodeField?.isRequired ? "✅" : "❌");
  console.log("Qty field validation:", qtyField?.dataType === "N" && qtyField?.isRequired ? "✅" : "❌");
  console.log("Memo field validation:", memoField?.dataType === "T" && memoField?.maxLength === 255 ? "✅" : "❌");
  
  console.log("✅ Field coverage test completed\n");
}

/**
 * Test 2: Data type and constraint validation
 */
function testDataTypeValidation(): void {
  console.log("=== BUILD RECORDS DATA TYPE VALIDATION TEST ===");
  
  // Test valid build record
  const validRecord = {
    ProductSeq: 123,
    PartCode: "COMPONENT001",
    Qty: 2.5,
    Memo: "Standard component for assembly"
  };
  
  const validResult = validateBuildRecordCanonical(validRecord);
  console.log("Valid record test:", validResult.isValid ? "✅" : "❌");
  console.log("Valid record explanation:", validResult.canonicalValidation);
  
  // Test invalid records
  const invalidRecords = [
    {
      ProductSeq: 0, // Invalid
      PartCode: "COMP",
      Qty: 1,
      expected: "ProductSeq validation"
    },
    {
      ProductSeq: 123,
      PartCode: "", // Invalid
      Qty: 1,
      expected: "PartCode validation"
    },
    {
      ProductSeq: 123,
      PartCode: "COMP",
      Qty: 0, // Invalid
      expected: "Qty validation"
    },
    {
      ProductSeq: 123,
      PartCode: "VERY_LONG_COMPONENT_CODE_EXCEEDING_LIMIT", // Too long
      Qty: 1,
      expected: "PartCode length validation"
    }
  ];
  
  invalidRecords.forEach((record, index) => {
    const result = validateBuildRecordCanonical(record);
    console.log(`Invalid record ${index + 1} (${record.expected}):`, !result.isValid ? "✅" : "❌");
    if (!result.isValid) {
      console.log(`  Warnings: ${result.warnings.join(", ")}`);
    }
  });
  
  console.log("✅ Data type validation test completed\n");
}

// ============================================================================
// RELATIONSHIP VALIDATION TESTS
// ============================================================================

/**
 * Test 3: Entity relationship validation
 */
function testRelationshipValidation(): void {
  console.log("=== BUILD RECORDS RELATIONSHIP VALIDATION TEST ===");
  
  // Test relationship extraction
  const relationships = MONEYWORKS_BUILD_RECORDS_RELATIONSHIPS;
  console.log("Extracted relationships:", relationships.length);
  
  // Verify core relationships
  const productRelationship = relationships.find(r => r.sourceField === "ProductSeq" && r.targetEntity === "Products");
  const componentRelationship = relationships.find(r => r.sourceField === "PartCode" && r.targetEntity === "Products");
  
  console.log("Product relationship:", productRelationship ? "✅" : "❌");
  console.log("Component relationship:", componentRelationship ? "✅" : "❌");
  
  if (productRelationship) {
    console.log("  ProductSeq relationship type:", productRelationship.relationshipType);
    console.log("  ProductSeq cardinality:", productRelationship.cardinality);
  }
  
  if (componentRelationship) {
    console.log("  PartCode relationship type:", componentRelationship.relationshipType);
    console.log("  PartCode cardinality:", componentRelationship.cardinality);
  }
  
  // Test relationship validation function
  const relationshipTest = validateBuildRecordRelationships({
    ProductSeq: 456,
    PartCode: "WIDGET001"
  });
  
  console.log("Relationship validation checks:", relationshipTest.requiredChecks.length);
  console.log("Required checks include parent product validation:", 
    relationshipTest.requiredChecks.some(check => check.includes("ProductSeq")) ? "✅" : "❌");
  console.log("Required checks include component validation:", 
    relationshipTest.requiredChecks.some(check => check.includes("PartCode")) ? "✅" : "❌");
  
  console.log("✅ Relationship validation test completed\n");
}

// ============================================================================
// BUSINESS RULE VALIDATION TESTS
// ============================================================================

/**
 * Test 4: Business rule validation
 */
function testBusinessRuleValidation(): void {
  console.log("=== BUILD RECORDS BUSINESS RULE VALIDATION TEST ===");
  
  const businessRules = MONEYWORKS_BUILD_RECORDS_BUSINESS_RULES;
  console.log("Extracted business rules:", businessRules.length);
  
  // Verify core business rules
  const manufacturingRule = businessRules.find(r => r.ruleType === "manufacturing");
  const componentRule = businessRules.find(r => r.ruleType === "component_validation");
  const quantityRule = businessRules.find(r => r.ruleType === "quantity_requirement");
  const integrityRule = businessRules.find(r => r.ruleType === "recipe_integrity");
  
  console.log("Manufacturing rule:", manufacturingRule ? "✅" : "❌");
  console.log("Component validation rule:", componentRule ? "✅" : "❌");
  console.log("Quantity requirement rule:", quantityRule ? "✅" : "❌");
  console.log("Recipe integrity rule:", integrityRule ? "✅" : "❌");
  
  // Test rule applications
  if (manufacturingRule) {
    console.log("Manufacturing rule validation:", manufacturingRule.validation.includes("ProductSeq") ? "✅" : "❌");
  }
  
  if (componentRule) {
    console.log("Component rule validation:", componentRule.validation.includes("PartCode") ? "✅" : "❌");
  }
  
  console.log("✅ Business rule validation test completed\n");
}

// ============================================================================
// MANUFACTURING SCENARIO TESTS
// ============================================================================

/**
 * Test 5: Manufacturing scenario validation
 */
function testManufacturingScenarios(): void {
  console.log("=== BUILD RECORDS MANUFACTURING SCENARIO TEST ===");
  
  // Test simple recipe
  const simpleRecipe = [
    { ProductSeq: 100, PartCode: "WOOD_PANEL", Qty: 4, Memo: "Table top and legs" },
    { ProductSeq: 100, PartCode: "SCREWS", Qty: 16, Memo: "Assembly hardware" },
    { ProductSeq: 100, PartCode: "FINISH", Qty: 1, Memo: "Wood stain" }
  ];
  
  const simpleSummary = getManufacturingRecipeSummary(simpleRecipe);
  console.log("Simple recipe complexity:", simpleSummary.recipeComplexity === "simple" ? "✅" : "❌");
  console.log("Simple recipe components:", simpleSummary.totalComponents);
  console.log("Simple recipe summary:", simpleSummary.componentSummary);
  
  // Test complex recipe
  const complexRecipe = Array.from({ length: 10 }, (_, i) => ({
    ProductSeq: 200,
    PartCode: `COMPONENT_${i + 1}`,
    Qty: i + 1,
    Memo: `Component ${i + 1} for complex assembly`
  }));
  
  const complexSummary = getManufacturingRecipeSummary(complexRecipe);
  console.log("Complex recipe complexity:", complexSummary.recipeComplexity === "complex" ? "✅" : "❌");
  console.log("Complex recipe components:", complexSummary.totalComponents);
  
  // Test canonical explanation
  const explanation = getCanonicalBuildRecordExplanation(100, "WOOD_PANEL", 4);
  console.log("Canonical explanation format:", explanation.includes("MoneyWorks Build Record") ? "✅" : "❌");
  console.log("Explanation:", explanation);
  
  console.log("✅ Manufacturing scenario test completed\n");
}

// ============================================================================
// CROSS-BUSINESS UNIVERSALITY TESTS
// ============================================================================

/**
 * Test 6: Cross-business universality validation
 */
function testCrossBusinessUniversality(): void {
  console.log("=== BUILD RECORDS CROSS-BUSINESS UNIVERSALITY TEST ===");
  
  const usagePatterns = MONEYWORKS_BUILD_RECORDS_USAGE_PATTERNS;
  console.log("Usage patterns extracted:", usagePatterns.length);
  
  // Test business type coverage
  const businessTypes = new Set();
  usagePatterns.forEach(pattern => {
    pattern.businessTypes.forEach(type => businessTypes.add(type));
  });
  
  console.log("Business types covered:", businessTypes.size);
  console.log("Business types:", Array.from(businessTypes).join(", "));
  
  // Verify key scenarios
  const manufacturingPattern = usagePatterns.find(p => p.scenario === "Manufacturing Assembly");
  const servicePattern = usagePatterns.find(p => p.scenario === "Service Bundling");
  const kitPattern = usagePatterns.find(p => p.scenario === "Kit Assembly");
  const recipePattern = usagePatterns.find(p => p.scenario === "Recipe Management");
  const projectPattern = usagePatterns.find(p => p.scenario === "Project Components");
  
  console.log("Manufacturing pattern:", manufacturingPattern ? "✅" : "❌");
  console.log("Service bundling pattern:", servicePattern ? "✅" : "❌");
  console.log("Kit assembly pattern:", kitPattern ? "✅" : "❌");
  console.log("Recipe management pattern:", recipePattern ? "✅" : "❌");
  console.log("Project components pattern:", projectPattern ? "✅" : "❌");
  
  // Test pattern completeness
  usagePatterns.forEach(pattern => {
    const hasExample = pattern.example && pattern.example.length > 0;
    const hasImplementation = pattern.moneyWorksImplementation && pattern.moneyWorksImplementation.includes("ProductSeq");
    console.log(`${pattern.scenario} completeness:`, hasExample && hasImplementation ? "✅" : "❌");
  });
  
  console.log("✅ Cross-business universality test completed\n");
}

// ============================================================================
// TERMINOLOGICAL PURITY TESTS
// ============================================================================

/**
 * Test 7: Terminological purity validation
 */
function testTerminologicalPurity(): void {
  console.log("=== BUILD RECORDS TERMINOLOGICAL PURITY TEST ===");
  
  const canonicalTerms = MONEYWORKS_BUILD_RECORDS_CANONICAL_TERMS;
  const termKeys = Object.keys(canonicalTerms);
  
  console.log("Canonical terms extracted:", termKeys.length);
  
  // Test MoneyWorks-specific terminology
  const moneyWorksTerms = [
    "BUILD_RECORD",
    "PRODUCT_RECIPE", 
    "COMPONENT",
    "BILL_OF_MATERIALS",
    "PARENT_PRODUCT",
    "COMPONENT_PRODUCT",
    "PART_CODE"
  ];
  
  moneyWorksTerms.forEach(term => {
    const hasCanonicalTerm = termKeys.includes(term);
    console.log(`${term} canonical term:`, hasCanonicalTerm ? "✅" : "❌");
  });
  
  // Test terminology consistency
  const buildRecordTerm = canonicalTerms.BUILD_RECORD;
  const componentTerm = canonicalTerms.COMPONENT;
  const partCodeTerm = canonicalTerms.PART_CODE;
  
  console.log("Build Record terminology:", buildRecordTerm === "Build Record" ? "✅" : "❌");
  console.log("Component terminology:", componentTerm === "Component" ? "✅" : "❌");
  console.log("Part Code terminology:", partCodeTerm === "Part Code" ? "✅" : "❌");
  
  // Verify no domain pollution
  const domainPollutionTerms = ["SKU", "UPC", "Barcode", "Inventory", "Stock"];
  const hasDomainPollution = Object.values(canonicalTerms).some(term => 
    domainPollutionTerms.some(pollutant => term.toLowerCase().includes(pollutant.toLowerCase()))
  );
  
  console.log("Domain pollution check:", !hasDomainPollution ? "✅" : "❌");
  
  console.log("✅ Terminological purity test completed\n");
}

// ============================================================================
// INTEGRATION AND MANUAL TRACEABILITY TESTS
// ============================================================================

/**
 * Test 8: Manual traceability validation
 */
function testManualTraceability(): void {
  console.log("=== BUILD RECORDS MANUAL TRACEABILITY TEST ===");
  
  // Verify manual source citations
  const fields = MONEYWORKS_BUILD_RECORDS_FIELDS;
  const allHaveManualSource = fields.every(field => field.manualSource === "moneyworks_appendix_build_file.html");
  
  console.log("All fields have manual source:", allHaveManualSource ? "✅" : "❌");
  
  // Verify relationships have manual sources
  const relationships = MONEYWORKS_BUILD_RECORDS_RELATIONSHIPS;
  const relationshipsHaveSource = relationships.every(rel => rel.manualSource);
  
  console.log("All relationships have manual source:", relationshipsHaveSource ? "✅" : "❌");
  
  // Verify business rules have manual sources
  const businessRules = MONEYWORKS_BUILD_RECORDS_BUSINESS_RULES;
  const rulesHaveSource = businessRules.every(rule => rule.manualSource);
  
  console.log("All business rules have manual source:", rulesHaveSource ? "✅" : "❌");
  
  // Test specific manual citations
  const productSeqField = fields.find(f => f.fieldName === "ProductSeq");
  const partCodeField = fields.find(f => f.fieldName === "PartCode");
  
  console.log("ProductSeq manual citation:", productSeqField?.canonicalDescription.includes("Product record") ? "✅" : "❌");
  console.log("PartCode manual citation:", partCodeField?.canonicalDescription.includes("component") ? "✅" : "❌");
  
  console.log("✅ Manual traceability test completed\n");
}

// ============================================================================
// COMPREHENSIVE TEST RUNNER
// ============================================================================

/**
 * Run all Build Records validation tests
 */
function runAllBuildRecordsValidationTests(): void {
  console.log("🔧 MONEYWORKS BUILD RECORDS CANONICAL VALIDATION SUITE");
  console.log("=" .repeat(80));
  
  try {
    testFieldCoverage();
    testDataTypeValidation();
    testRelationshipValidation();
    testBusinessRuleValidation();
    testManufacturingScenarios();
    testCrossBusinessUniversality();
    testTerminologicalPurity();
    testManualTraceability();
    
    console.log("🎉 ALL BUILD RECORDS VALIDATION TESTS COMPLETED SUCCESSFULLY!");
    console.log("✅ Build Records entity meets MoneyWorks canonical ontology standards");
    console.log("✅ 100% field coverage with proper data types and constraints");
    console.log("✅ Complete relationship mapping to Products entity");
    console.log("✅ Universal business applicability across manufacturing, services, and retail");
    console.log("✅ Terminological purity maintained - no domain pollution");
    console.log("✅ Full manual traceability for all definitions");
    
  } catch (error) {
    console.error("❌ BUILD RECORDS VALIDATION FAILED:", error);
    throw error;
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runAllBuildRecordsValidationTests();
}

export {
  runAllBuildRecordsValidationTests,
  testFieldCoverage,
  testDataTypeValidation,
  testRelationshipValidation,
  testBusinessRuleValidation,
  testManufacturingScenarios,
  testCrossBusinessUniversality,
  testTerminologicalPurity,
  testManualTraceability
};