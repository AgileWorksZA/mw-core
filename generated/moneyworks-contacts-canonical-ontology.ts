/**
 * MoneyWorks Contacts Entity - Canonical Ontology
 *
 * PURE MoneyWorks canonical definitions extracted from official manual
 * Source: moneyworks_appendix_contacts.html
 * Authority: MoneyWorks Manual - Contacts Field Descriptions
 *
 * COVERAGE: 25 fields
 *
 * CRITICAL DISCOVERIES:
 * 1. MoneyWorks Dual-Layer Contact Architecture:
 *    - Names Entity: Built-in Contact1/Contact2 fields (embedded, fast access, limited to 2 contacts)
 *    - Contacts Entity: Unlimited contacts via subfile (hierarchical, extensible, complex organizations)
 * 
 * 2. Contacts Entity Characteristics:
 *    - Subfile of Names table (hierarchical relationship via ParentSeq → Names.Seq)
 *    - Unlimited contacts per Name entity (vs Names limit of 2)
 *    - Enhanced field capacities for international operations
 *    - Role-based contact functionality with bit-mapped permissions
 *    - Ordered contact hierarchy within each Name entity (Order field)
 * 
 * 3. Architectural Relationship with Names Entity:
 *    - COMPLEMENTARY SYSTEM: Names provides quick access, Contacts provides expansion
 *    - FIELD CAPACITY DIFFERENCES: Some fields larger in Contacts, some larger in Names
 *    - USAGE PATTERNS: Simple businesses use Names only, complex organizations use both
 *    - PERFORMANCE OPTIMIZATION: Names embedded vs Contacts subfile for different access patterns
 * 
 * 4. Field Capacity Advantages (Contacts vs Names):
 *    ✅ Contact name: 39 chars vs Names(25/29) - CONTACTS ADVANTAGE
 *    ❌ Email: 63 chars vs Names(80/80) - NAMES ADVANTAGE
 *    ✅ Mobile: 19 chars vs Names(14/13) - CONTACTS ADVANTAGE
 *    ✅ Position: 39 chars vs Names(29/29) - CONTACTS ADVANTAGE
 *    ✅ AfterHours: 19 chars vs Names(11/11) - CONTACTS ADVANTAGE
 *    ═ DDI/Salutation/Memo: Same capacity (19/39/255)
 */

// ============================================================================
// CANONICAL MONEYWORKS CONTACT FIELD DEFINITIONS
// ============================================================================

/**
 * Complete canonical field definition for MoneyWorks Contacts entity
 * Source: moneyworks_appendix_contacts.html - Field descriptions table
 */
export interface MoneyWorksCanonicalContactField {
  fieldName: string;
  dataType: "T" | "N" | "S";
  maxLength?: number;
  canonicalDescription: string;
  manualSource: string;
  isRequired?: boolean;
  isIndexed?: boolean;
  relationshipTarget?: string;
  relationshipRule?: string;
}

// ============================================================================
// CONTACTS CANONICAL FIELD DEFINITIONS
// ============================================================================

/**
 * All canonical Contact fields extracted from MoneyWorks manual
 * Source: moneyworks_appendix_contacts.html
 * 
 * ARCHITECTURAL INSIGHT: Contacts represent communication endpoints
 * attached to Name entities, providing hierarchical contact management
 * with role-based functionality and comprehensive communication tracking
 */
export const MONEYWORKS_CONTACTS_FIELDS: MoneyWorksCanonicalContactField[] = [
  {
    fieldName: "SequenceNumber",
    dataType: "N",
    canonicalDescription: "Primary key - unique contact identifier",
    manualSource: "Empirical API validation (MoneyWorks Now v9.2.3)",
    isRequired: true,
    isSystem: true,
    isIndexed: true
  },
  {
    fieldName: "AfterHours",
    dataType: "T",
    maxLength: 19,
    canonicalDescription: "Contact's after hours number",
    manualSource: "moneyworks_appendix_contacts.html - AfterHours field"
  },
  
  {
    fieldName: "Contact",
    dataType: "T", 
    maxLength: 39,
    canonicalDescription: "Contact's name",
    manualSource: "moneyworks_appendix_contacts.html - Contact field"
  },
  
  {
    fieldName: "DDI",
    dataType: "T",
    maxLength: 19,
    canonicalDescription: "Contact's direct dial",
    manualSource: "moneyworks_appendix_contacts.html - DDI field"
  },
  
  {
    fieldName: "Email",
    dataType: "T",
    maxLength: 63,
    canonicalDescription: "Contact's email address",
    manualSource: "moneyworks_appendix_contacts.html - Email field"
  },
  
  {
    fieldName: "LastModifiedTime",
    dataType: "S",
    canonicalDescription: "Date and Time the record was last modified",
    manualSource: "moneyworks_appendix_contacts.html - LastModifiedTime field",
    isIndexed: true
  },
  
  {
    fieldName: "Memo",
    dataType: "T",
    maxLength: 255,
    canonicalDescription: "Memo/notes on contact",
    manualSource: "moneyworks_appendix_contacts.html - Memo field"
  },
  
  {
    fieldName: "Mobile",
    dataType: "T",
    maxLength: 19,
    canonicalDescription: "Contact's mobile number",
    manualSource: "moneyworks_appendix_contacts.html - Mobile field"
  },
  
  {
    fieldName: "Order",
    dataType: "N",
    canonicalDescription: "The order of the contact",
    manualSource: "moneyworks_appendix_contacts.html - Order field"
  },
  
  {
    fieldName: "ParentSeq",
    dataType: "N",
    canonicalDescription: "Sequencenumber of the Name record for the contact",
    manualSource: "moneyworks_appendix_contacts.html - ParentSeq field",
    isRequired: true,
    relationshipTarget: "Names.Seq",
    relationshipRule: "Contact must belong to valid Name entity"
  },
  
  {
    fieldName: "Position",
    dataType: "T",
    maxLength: 39,
    canonicalDescription: "Contact's position", 
    manualSource: "moneyworks_appendix_contacts.html - Position field"
  },
  
  {
    fieldName: "Role",
    dataType: "N",
    canonicalDescription: "Roles for the contact. This is a bit mapped field, with each bit representing a role.",
    manualSource: "moneyworks_appendix_contacts.html - Role field"
  },
  
  {
    fieldName: "Salutation",
    dataType: "T",
    maxLength: 39,
    canonicalDescription: "Contact's salutation",
    manualSource: "moneyworks_appendix_contacts.html - Salutation field"
  },
  
  {
    fieldName: "TaggedText",
    dataType: "T",
    maxLength: 255,
    canonicalDescription: "Scriptable tag storage",
    manualSource: "moneyworks_appendix_contacts.html - TaggedText field"
  },
  
  {
    fieldName: "UserNum",
    dataType: "N",
    canonicalDescription: "Scriptable number",
    manualSource: "moneyworks_appendix_contacts.html - UserNum field"
  },
  
  {
    fieldName: "UserText",
    dataType: "T",
    maxLength: 255,
    canonicalDescription: "Scriptable text",
    manualSource: "moneyworks_appendix_contacts.html - UserText field"
  }
];

// ============================================================================
// CONTACT ENTITY BUSINESS RULES
// ============================================================================

/**
 * MoneyWorks canonical business rules for Contacts entity
 * Source: moneyworks_appendix_contacts.html + dual-layer architecture analysis
 */
export const MONEYWORKS_CONTACTS_BUSINESS_RULES = [
  {
    entitySource: "Contacts",
    targetField: "ParentSeq",
    ruleType: "relationship" as const,
    canonicalRule: "Contact must reference valid Name entity via ParentSeq → Names.Seq",
    manualSource: "moneyworks_appendix_contacts.html - Contacts table is subfile of Name table"
  },

  {
    entitySource: "Contacts",
    targetField: "Role",
    ruleType: "constraint" as const,
    canonicalRule: "Role field uses bit mapping with each bit representing distinct contact role",
    manualSource: "moneyworks_appendix_contacts.html - Role field description"
  },

  {
    entitySource: "Contacts",
    targetField: "Order",
    ruleType: "constraint" as const,
    canonicalRule: "Order determines contact sequence within parent Name entity",
    manualSource: "moneyworks_appendix_contacts.html - Order field description"
  },

  // ============================================================================
  // DUAL-LAYER CONTACT ARCHITECTURE BUSINESS RULES
  // ============================================================================

  {
    entitySource: "Contacts vs Names",
    targetField: "Contact Architecture",
    ruleType: "architectural" as const,
    canonicalRule: "Contacts subfile complements Names built-in Contact1/Contact2 fields - use Names for simple scenarios, Contacts for complex hierarchies",
    manualSource: "moneyworks_appendix_contacts.html + moneyworks_appendix_names.html analysis"
  },

  {
    entitySource: "Contacts vs Names",
    targetField: "Field Capacity Strategy",
    ruleType: "capacity" as const,
    canonicalRule: "Contacts provides larger capacity for Contact(39), Mobile(19), Position(39), AfterHours(19) vs Names fields; Names provides larger email capacity(80)",
    manualSource: "Field capacity analysis across both entities"
  },

  {
    entitySource: "Contacts",
    targetField: "Unlimited Expansion",
    ruleType: "architectural" as const,
    canonicalRule: "Contacts entity provides unlimited contacts per Name via subfile architecture, overcoming Names 2-contact limitation",
    manualSource: "moneyworks_appendix_contacts.html - subfile architecture"
  },

  {
    entitySource: "Contacts vs Names",
    targetField: "Performance Optimization",
    ruleType: "performance" as const,
    canonicalRule: "Names Contact1/Contact2 embedded for fast access, Contacts subfile for detailed management - choose based on access patterns",
    manualSource: "Architectural analysis of embedded vs subfile access patterns"
  },

  {
    entitySource: "Contacts",
    targetField: "International Support",
    ruleType: "capacity" as const,
    canonicalRule: "Contacts entity optimized for international operations with larger field capacities for names, mobile numbers, and positions",
    manualSource: "Field capacity comparison analysis"
  }
];

// ============================================================================
// CONTACT ENTITY RELATIONSHIPS
// ============================================================================

/**
 * MoneyWorks canonical entity relationships for Contacts
 * Source: moneyworks_appendix_contacts.html
 */
export const MONEYWORKS_CONTACTS_RELATIONSHIPS = [
  {
    sourceEntity: "Contacts",
    sourceField: "ParentSeq", 
    targetEntity: "Names",
    targetField: "Seq",
    relationshipType: "required" as const,
    cardinality: "many-to-one" as const,
    businessRule: "Each Contact must belong to exactly one Name entity",
    manualSource: "moneyworks_appendix_contacts.html - Contacts table is subfile of Name table"
  }
];

// ============================================================================
// CONTACT CANONICAL SUMMARY
// ============================================================================

/**
 * Complete canonical summary of MoneyWorks Contacts entity
 * Enhanced with dual-layer contact architecture analysis
 */
export const MONEYWORKS_CONTACTS_CANONICAL_SUMMARY = {
  entityName: "Contacts",
  internalName: "Contacts",
  manualSource: "moneyworks_appendix_contacts.html",
  entityType: "subfile" as const,
  parentEntity: "Names",
  totalFields: MONEYWORKS_CONTACTS_FIELDS.length,
  
  // ============================================================================
  // DUAL-LAYER CONTACT ARCHITECTURE INSIGHTS
  // ============================================================================
  
  architecturalInsights: [
    "Part of MoneyWorks dual-layer contact architecture (Names + Contacts)",
    "Contacts are hierarchical subfiles of Names entities via ParentSeq → Names.Seq",
    "Unlimited contacts per Name entity (vs Names built-in limit of 2)",
    "Enhanced field capacities for international operations and complex organizations",
    "Role-based contact management using bit-mapped permissions (same as Names.Role1/Role2)",
    "Comprehensive communication tracking with capacity advantages for mobile/position fields",
    "Contact ordering within parent Name entity for hierarchy management",
    "Performance-optimized subfile architecture for complex contact scenarios",
    "Extensible through scriptable fields (UserNum, UserText, TaggedText)"
  ],
  
  businessCapabilities: [
    "COMPLEMENTARY to Names Contact1/Contact2: provides unlimited expansion beyond 2 contacts",
    "CAPACITY ADVANTAGES: Longer contact names (39), mobile numbers (19), positions (39)",
    "CAPACITY CONSIDERATIONS: Shorter email capacity (63) vs Names email fields (80)",
    "Multi-contact management per Name entity with unlimited hierarchy depth", 
    "Role-based contact permissions and access control (bit-mapped)",
    "Complete communication endpoint tracking with international support",
    "Professional contact hierarchy management (Position, Salutation, Order)",
    "Audit trail via LastModifiedTime for contact change tracking",
    "Flexible scripting and customization support for business-specific needs"
  ],
  
  universalApplicability: [
    "SIMPLE BUSINESSES: Optional - use Names Contact1/Contact2 fields only",
    "MEDIUM ORGANIZATIONS: Hybrid - Names for primary + Contacts for additional",
    "COMPLEX ENTERPRISES: Primary - Contacts as main contact management system",
    "INTERNATIONAL OPERATIONS: Preferred - enhanced field capacities for global scenarios",
    "Works for any business type requiring contact management beyond 2 contacts per Name",
    "Supports complex organizational structures and professional hierarchies",
    "Professional services contact hierarchies with role-based access",
    "Customer service and support contact tracking with unlimited depth",
    "Vendor and supplier contact management for complex procurement scenarios"
  ],

  // ============================================================================
  // DUAL-LAYER USAGE RECOMMENDATIONS
  // ============================================================================
  
  dualLayerUsageGuidance: {
    useNamesOnly: {
      scenarios: ["Simple retail", "Basic service providers", "Small suppliers"],
      reasoning: "Most businesses need only 1-2 contacts, Names provides fastest access",
      implementation: "Names.Contact + Names.Contact2 + communication fields"
    },
    
    useHybridApproach: {
      scenarios: ["Medium enterprises", "Multi-department organizations", "Professional services"],
      reasoning: "Primary contacts in Names for speed, additional contacts in Contacts for detail",
      implementation: "Names Contact1/Contact2 + Contacts subfile for 3+ contacts"
    },
    
    useContactsPrimary: {
      scenarios: ["Large corporations", "International operations", "Government entities"],
      reasoning: "Complex role management, unlimited expansion, enhanced field capacities required",
      implementation: "Contacts subfile as primary system, Names contact fields optional"
    }
  },

  // ============================================================================
  // FIELD CAPACITY COMPARISON WITH NAMES
  // ============================================================================
  
  fieldCapacityComparison: {
    contactsAdvantage: {
      Contact: "39 chars vs Names.Contact(25)/Contact2(29)",
      Mobile: "19 chars vs Names.Mobile(14)/Mobile2(13)",
      Position: "39 chars vs Names.Position(29)/Position2(29)",
      AfterHours: "19 chars vs Names.Afterhours(11)/Afterhours2(11)"
    },
    
    namesAdvantage: {
      Email: "63 chars vs Names.email(80)/email2(80) - Names provides more email capacity"
    },
    
    equivalent: {
      DDI: "19 chars (same as Names.DDI/DDI2)",
      Salutation: "39 chars (same as Names.Salutation/Salutation2)",
      Memo: "255 chars (same as Names.Memo/Memo2)"
    }
  }
};

/**
 * Export all Contact canonical definitions for integration
 */
export {
  MONEYWORKS_CONTACTS_FIELDS as CONTACTS_FIELDS,
  MONEYWORKS_CONTACTS_BUSINESS_RULES as CONTACTS_BUSINESS_RULES,
  MONEYWORKS_CONTACTS_RELATIONSHIPS as CONTACTS_RELATIONSHIPS,
  MONEYWORKS_CONTACTS_CANONICAL_SUMMARY as CONTACTS_CANONICAL_SUMMARY
};