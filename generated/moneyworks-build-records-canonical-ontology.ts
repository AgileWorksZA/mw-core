/**
 * MoneyWorks Build Records Entity - Canonical Ontology
 * 
 * PURE MoneyWorks canonical definitions extracted from official manual
 * Source: moneyworks_appendix_build_file.html
 * Authority: MoneyWorks Manual - Build File Field Descriptions
 * 
 * CRITICAL DISCOVERY: MoneyWorks has sophisticated manufacturing/assembly system:
 * - Build records store product recipes/components for manufactured items
 * - Each build record represents one component in a product's bill of materials
 * - Links to Products entity via ProductSeq foreign key relationship
 * - Supports quantity-based component requirements for assembly manufacturing
 * - Memo field provides component-specific notes and documentation
 */

// ============================================================================
// CANONICAL MONEYWORKS BUILD RECORDS FIELD DEFINITIONS
// ============================================================================

/**
 * Core MoneyWorks build records fields as defined in manual
 * Source: moneyworks_appendix_build_file.html - Build table
 * Internal Name: Build
 * Purpose: Stores the recipes for the products (bill of materials components)
 */
export const MONEYWORKS_BUILD_RECORDS_FIELDS = [
  {
    fieldName: "LastModifiedTime",
    dataType: "S" as const,
    canonicalDescription: "The date and time that this record was last changed.",
    manualSource: "moneyworks_appendix_build_file.html",
    relationshipTarget: "System audit fields",
    relationshipRule: "System-maintained timestamp for all record modifications"
  },
  {
    fieldName: "ProductSeq",
    dataType: "N" as const,
    canonicalDescription: "The sequence number of the Product record to which the recipe belongs",
    manualSource: "moneyworks_appendix_build_file.html",
    isRequired: true,
    relationshipTarget: "Products.Seq",
    relationshipRule: "Foreign key relationship - Build records belong to specific Product entries"
  },
  {
    fieldName: "PartCode",
    dataType: "T" as const,
    maxLength: 19,
    canonicalDescription: "Code of component",
    manualSource: "moneyworks_appendix_build_file.html",
    isRequired: true,
    relationshipTarget: "Products.Code",
    relationshipRule: "Component product code - must reference existing Product record"
  },
  {
    fieldName: "Qty",
    dataType: "N" as const,
    canonicalDescription: "Quantity of component required",
    manualSource: "moneyworks_appendix_build_file.html",
    isRequired: true
  },
  {
    fieldName: "Memo",
    dataType: "T" as const,
    maxLength: 255,
    canonicalDescription: "Memo for the component",
    manualSource: "moneyworks_appendix_build_file.html"
  }
] as const;

// ============================================================================
// CANONICAL MONEYWORKS BUILD RECORDS TERMINOLOGY
// ============================================================================

/**
 * MoneyWorks canonical build records terminology
 * Essential terms for manufacturing and assembly processes
 */
export const MONEYWORKS_BUILD_RECORDS_CANONICAL_TERMS = {
  // Core manufacturing concepts (MoneyWorks canonical)
  BUILD_RECORD: "Build Record",           // Individual component entry in recipe
  PRODUCT_RECIPE: "Product Recipe",       // Complete bill of materials for product
  COMPONENT: "Component",                 // Individual part in assembly
  BILL_OF_MATERIALS: "Bill of Materials", // MoneyWorks term for product recipes
  
  // Assembly relationships (MoneyWorks canonical)
  PARENT_PRODUCT: "Parent Product",       // Product being manufactured
  COMPONENT_PRODUCT: "Component Product", // Parts used in assembly
  COMPONENT_QUANTITY: "Component Quantity", // Required quantity per unit
  PART_CODE: "Part Code",                 // Component product identifier
  
  // Documentation (MoneyWorks canonical)
  COMPONENT_MEMO: "Component Memo",       // Notes specific to component usage
  RECIPE_NOTES: "Recipe Notes",           // Assembly instructions and notes
  
  // System tracking (MoneyWorks canonical)
  RECIPE_MODIFICATION: "Recipe Modification", // Last changed timestamp
  BUILD_SEQUENCE: "Build Sequence"        // Component order in recipe
} as const;

// ============================================================================
// CANONICAL MONEYWORKS BUILD RECORDS RELATIONSHIPS
// ============================================================================

/**
 * MoneyWorks Build Records entity relationships
 * Source: moneyworks_appendix_build_file.html + Products entity analysis
 */
export const MONEYWORKS_BUILD_RECORDS_RELATIONSHIPS = [
  {
    relationshipType: "belongs_to" as const,
    sourceEntity: "Build Records",
    targetEntity: "Products",
    sourceField: "ProductSeq",
    targetField: "Seq",
    canonicalDescription: "Build record belongs to parent product being manufactured",
    manualSource: "moneyworks_appendix_build_file.html",
    businessContext: "Each build record is a component in a specific product's recipe",
    cardinality: "many-to-one" as const
  },
  {
    relationshipType: "references" as const,
    sourceEntity: "Build Records",
    targetEntity: "Products",
    sourceField: "PartCode",
    targetField: "Code",
    canonicalDescription: "Component part code references existing product record",
    manualSource: "moneyworks_appendix_build_file.html",
    businessContext: "Components must be valid products in the system",
    cardinality: "many-to-one" as const
  }
] as const;

// ============================================================================
// CANONICAL MONEYWORKS BUILD RECORDS BUSINESS RULES
// ============================================================================

/**
 * MoneyWorks Build Records canonical business rules
 * Extracted from manual and MoneyWorks manufacturing logic
 */
export const MONEYWORKS_BUILD_RECORDS_BUSINESS_RULES = [
  {
    ruleType: "manufacturing" as const,
    canonicalRule: "Build records define recipes for manufactured products",
    manualSource: "moneyworks_appendix_build_file.html",
    businessContext: "Products with build records can be assembled from components",
    validation: "Parent product (ProductSeq) must exist in Products table"
  },
  {
    ruleType: "component_validation" as const,
    canonicalRule: "Component PartCode must reference valid existing product",
    manualSource: "moneyworks_appendix_build_file.html",
    businessContext: "Components must be trackable products in inventory system",
    validation: "PartCode must match existing Products.Code"
  },
  {
    ruleType: "quantity_requirement" as const,
    canonicalRule: "Component quantity specifies required amount per parent unit",
    manualSource: "moneyworks_appendix_build_file.html",
    businessContext: "Manufacturing calculations based on component quantities",
    validation: "Qty must be positive number for manufacturing feasibility"
  },
  {
    ruleType: "recipe_integrity" as const,
    canonicalRule: "Multiple build records create complete bill of materials",
    manualSource: "moneyworks_appendix_build_file.html",
    businessContext: "Complex products require multiple components",
    validation: "ProductSeq can have multiple build records for complete recipe"
  }
] as const;

// ============================================================================
// CANONICAL MONEYWORKS BUILD RECORDS USAGE PATTERNS
// ============================================================================

/**
 * MoneyWorks Build Records canonical usage patterns
 * Universal business applications across industries
 */
export const MONEYWORKS_BUILD_RECORDS_USAGE_PATTERNS = [
  {
    scenario: "Manufacturing Assembly",
    businessTypes: ["manufacturing", "production", "assembly"],
    canonicalPattern: "Products with component recipes for manufactured goods",
    example: "Furniture: Table (parent) requires Wood Panels + Screws + Finish (components)",
    moneyWorksImplementation: "ProductSeq=Table, multiple Build records for each component"
  },
  {
    scenario: "Service Bundling", 
    businessTypes: ["professional services", "consulting", "maintenance"],
    canonicalPattern: "Service packages combining individual service components",
    example: "IT Support Package: Setup + Training + Ongoing Support (service components)",
    moneyWorksImplementation: "ProductSeq=Package, Build records for each service component"
  },
  {
    scenario: "Kit Assembly",
    businessTypes: ["retail", "distribution", "wholesale"],
    canonicalPattern: "Pre-packaged kits containing multiple individual products",
    example: "Starter Kit: Product A + Product B + Instructions (kit components)",
    moneyWorksImplementation: "ProductSeq=Kit, Build records for each included product"
  },
  {
    scenario: "Recipe Management",
    businessTypes: ["food service", "restaurants", "catering"],
    canonicalPattern: "Menu items with ingredient specifications",
    example: "Signature Dish: Ingredients + Quantities + Preparation notes",
    moneyWorksImplementation: "ProductSeq=Dish, Build records for each ingredient with quantities"
  },
  {
    scenario: "Project Components",
    businessTypes: ["construction", "engineering", "consulting"],
    canonicalPattern: "Project deliverables composed of specific work components",
    example: "Construction Project: Materials + Labor + Equipment (project components)",
    moneyWorksImplementation: "ProductSeq=Project, Build records for each component type"
  }
] as const;

// ============================================================================
// CANONICAL VALIDATION FUNCTIONS
// ============================================================================

/**
 * Validate canonical MoneyWorks build record definitions
 */
export function validateBuildRecordCanonical(buildRecord: {
  ProductSeq: number;
  PartCode: string;
  Qty: number;
  Memo?: string;
}): {
  isValid: boolean;
  warnings: string[];
  canonicalValidation: string;
} {
  const warnings: string[] = [];
  
  // Validate ProductSeq
  if (!buildRecord.ProductSeq || buildRecord.ProductSeq <= 0) {
    warnings.push("ProductSeq required - must reference valid parent product for recipe");
  }
  
  // Validate PartCode
  if (!buildRecord.PartCode || buildRecord.PartCode.trim().length === 0) {
    warnings.push("PartCode required - must reference valid component product");
  }
  
  if (buildRecord.PartCode && buildRecord.PartCode.length > 19) {
    warnings.push("PartCode exceeds maximum length of 19 characters");
  }
  
  // Validate Qty
  if (!buildRecord.Qty || buildRecord.Qty <= 0) {
    warnings.push("Qty required - must be positive number for manufacturing feasibility");
  }
  
  // Validate Memo length
  if (buildRecord.Memo && buildRecord.Memo.length > 255) {
    warnings.push("Memo exceeds maximum length of 255 characters");
  }
  
  const canonicalValidation = warnings.length === 0 
    ? "Valid MoneyWorks build record - ready for manufacturing recipe"
    : "Build record validation failed - check MoneyWorks canonical requirements";
  
  return {
    isValid: warnings.length === 0,
    warnings,
    canonicalValidation
  };
}

/**
 * Get canonical MoneyWorks build record explanation
 */
export function getCanonicalBuildRecordExplanation(productSeq: number, partCode: string, qty: number): string {
  return `MoneyWorks Build Record: Product ${productSeq} requires ${qty} units of component "${partCode}" for manufacturing assembly`;
}

/**
 * Validate build record relationships
 */
export function validateBuildRecordRelationships(buildRecord: {
  ProductSeq: number;
  PartCode: string;
}): {
  relationshipValidation: string;
  requiredChecks: string[];
} {
  const requiredChecks = [
    `Verify ProductSeq ${buildRecord.ProductSeq} exists in Products table`,
    `Verify PartCode "${buildRecord.PartCode}" matches existing Products.Code`,
    "Ensure component product is suitable for manufacturing use",
    "Validate parent product is configured for assembly manufacturing"
  ];
  
  return {
    relationshipValidation: "MoneyWorks Build Record requires valid parent product and component product relationships",
    requiredChecks
  };
}

/**
 * Get manufacturing recipe summary
 */
export function getManufacturingRecipeSummary(buildRecords: Array<{
  ProductSeq: number;
  PartCode: string;
  Qty: number;
  Memo?: string;
}>): {
  totalComponents: number;
  recipeComplexity: "simple" | "moderate" | "complex";
  componentSummary: string;
} {
  const totalComponents = buildRecords.length;
  
  let recipeComplexity: "simple" | "moderate" | "complex";
  if (totalComponents <= 3) recipeComplexity = "simple";
  else if (totalComponents <= 8) recipeComplexity = "moderate";
  else recipeComplexity = "complex";
  
  const componentList = buildRecords
    .map(record => `${record.Qty} × ${record.PartCode}`)
    .join(", ");
  
  return {
    totalComponents,
    recipeComplexity,
    componentSummary: `Manufacturing recipe: ${componentList}`
  };
}

export default {
  MONEYWORKS_BUILD_RECORDS_FIELDS,
  MONEYWORKS_BUILD_RECORDS_CANONICAL_TERMS,
  MONEYWORKS_BUILD_RECORDS_RELATIONSHIPS,
  MONEYWORKS_BUILD_RECORDS_BUSINESS_RULES,
  MONEYWORKS_BUILD_RECORDS_USAGE_PATTERNS
};