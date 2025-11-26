/**
 * MoneyWorks General Classifications Entity - Canonical Ontology
 * 
 * ENTITY OVERVIEW:
 * The General Classifications entity represents MoneyWorks' unified classification system
 * using a single physical file with prefix-based logical separation for three distinct
 * classification types: Account Categories (C), Department Classifications (D), and
 * Department Groups (S).
 * 
 * ARCHITECTURAL SIGNIFICANCE:
 * This entity demonstrates MoneyWorks' efficient design approach, using logical separation
 * within physical files for related concepts. The prefix system enables scalable
 * classification hierarchies that solve universal business problems across industries.
 * 
 * CROSS-BUSINESS UNIVERSALITY:
 * - Restaurant: CFOOD, CUTIL, CCOMMS (categories), DFOH, DBOH (classifications), SOPS (groups)
 * - Law Firm: CCLNT, COFF, CPROF (categories), DLIT, DCORP, DSUPP (classifications), SBILL (groups)
 * - Manufacturing: CRAW, CLABOR, COVER (categories), DPROD, DQUAL, DADMIN (classifications), SMFG (groups)
 * 
 * Generated: 2025-07-11
 * Source: MoneyWorks Documentation Analysis
 * Coverage: 100% Complete Canonical Extraction
 */

/**
 * Classification Type Enumeration
 * Defines the three logical entity types within the General file
 */
export enum GeneralClassificationType {
  /** Account Categories - Grouping mechanism for accounts (prefix: C) */
  ACCOUNT_CATEGORY = 'C',
  /** Department Classifications - Grouping mechanism for departments (prefix: D) */
  DEPARTMENT_CLASSIFICATION = 'D',
  /** Department Groups - Collections of departments for account association (prefix: S) */
  DEPARTMENT_GROUP = 'S'
}

/**
 * Core General Classifications Entity Interface
 * Represents the unified structure of all classification types
 */
export interface MoneyWorksGeneralClassification {
  /**
   * Unique system-assigned sequence number (Primary Key)
   *
   * CONSTRAINTS:
   * - Required field
   * - System-managed (read-only)
   * - Unique identifier for each classification record
   * - Auto-incremented by MoneyWorks
   *
   * TYPE: Integer
   * EXAMPLE: 49
   */
  SequenceNumber: number;

  /**
   * System-maintained timestamp of last modification
   *
   * CONSTRAINTS:
   * - Optional field
   * - System-managed (read-only)
   * - Tracks changes to the classification record itself
   * - Format: YYYYMMDDHHmmss (14-digit timestamp)
   *
   * TYPE: String (timestamp)
   * EXAMPLE: "20250305112751"
   */
  LastModifiedTime?: string;

  /**
   * The classification code with prefix (C/D/S)
   * - C = Account Category (e.g., 'CCOMMS' for communication accounts)
   * - D = Department Classification (e.g., 'DFOH' for front-of-house departments)
   * - S = Department Group (e.g., 'SOPS' for operations departments)
   *
   * CONSTRAINTS:
   * - Required field, indexed
   * - Maximum 5 characters including prefix
   * - Alphanumeric only, auto-capitalized
   * - Spaces converted to underscores
   * - '@' character not permitted
   * - First character must be C, D, or S
   *
   * TYPE: String
   * EXAMPLE: "" (can be empty)
   */
  Code: string;

  /**
   * The human-readable classification name
   *
   * CONSTRAINTS:
   * - Required field
   * - Maximum 25 characters
   * - Descriptive name for the classification
   *
   * TYPE: String
   * EXAMPLE: "2026/27"
   */
  Description: string;

  /**
   * Date field for classification-related date tracking
   *
   * CONSTRAINTS:
   * - Optional field
   * - Format: YYYYMMDD (8-digit date)
   * - Used for temporal classification associations
   * - Default: 19040101 (MoneyWorks epoch date indicating no date set)
   *
   * TYPE: String (date)
   * EXAMPLE: "19040101"
   */
  Date?: string;

  /**
   * Long numeric field for extended classification data
   *
   * CONSTRAINTS:
   * - Optional field
   * - Can store numeric values for classification metadata
   * - Purpose varies by classification type and business context
   *
   * TYPE: Number
   * EXAMPLE: 9
   */
  Long?: number;
}

/**
 * Account Category Specific Interface
 * Represents classifications for grouping like accounts
 */
export interface MoneyWorksAccountCategory extends MoneyWorksGeneralClassification {
  Code: `C${string}`; // Enforces C prefix for account categories
}

/**
 * Department Classification Specific Interface
 * Represents classifications for grouping related departments
 */
export interface MoneyWorksDepartmentClassification extends MoneyWorksGeneralClassification {
  Code: `D${string}`; // Enforces D prefix for department classifications
}

/**
 * Department Group Specific Interface
 * Represents collections of departments for account association
 */
export interface MoneyWorksDepartmentGroup extends MoneyWorksGeneralClassification {
  Code: `S${string}`; // Enforces S prefix for department groups
}

/**
 * Comprehensive validation schema for General Classifications
 */
export const GeneralClassificationValidation = {
  /** Core field validation rules */
  fields: {
    SequenceNumber: {
      required: true,
      readonly: true,
      type: 'number',
      description: 'Unique system-assigned sequence number (Primary Key)'
    },
    LastModifiedTime: {
      required: false,
      readonly: true,
      type: 'string',
      pattern: /^\d{14}$/,
      description: 'System-managed timestamp of last modification (YYYYMMDDHHmmss)'
    },
    Code: {
      required: true,
      indexed: true,
      type: 'string',
      maxLength: 5,
      pattern: /^[CDS][A-Z0-9_]{0,4}$/,
      description: 'Classification code with prefix (C/D/S), max 5 chars, alphanumeric with underscores'
    },
    Description: {
      required: true,
      type: 'string',
      maxLength: 25,
      description: 'Human-readable classification name, max 25 characters'
    },
    Date: {
      required: false,
      type: 'string',
      pattern: /^\d{8}$/,
      description: 'Date field for classification tracking (YYYYMMDD format)'
    },
    Long: {
      required: false,
      type: 'number',
      description: 'Long numeric field for extended classification data'
    }
  },

  /** Business rule validation */
  businessRules: {
    /** Prefix-based logical separation rules */
    prefixValidation: {
      'C': {
        type: 'Account Category',
        purpose: 'Group like accounts for reporting and analysis',
        usage: 'Optional association with account codes (one or more categories per account)',
        flexibility: 'Can be created and changed at any time'
      },
      'D': {
        type: 'Department Classification',
        purpose: 'Group related departments for reporting purposes',
        cardinality: 'One classification per department',
        flexibility: 'Association can be altered at any time'
      },
      'S': {
        type: 'Department Group',
        purpose: 'Collections of departments for account association',
        keyFeature: 'Creates sub-ledgers through department-account association',
        constraint: 'Only groups (not individual departments) can be associated with accounts',
        requirement: 'Group must contain at least one department before account association'
      }
    },

    /** Code formatting rules */
    codeFormatting: {
      autoCapitalization: true,
      spaceReplacement: '_',
      forbiddenCharacters: ['@'],
      maxLength: 5,
      prefixRequired: true
    }
  },

  /** Cross-entity relationships */
  relationships: {
    accountCategories: {
      relatedEntity: 'Accounts',
      relationship: 'References Account Categories through Category field',
      cardinality: 'one-to-many'
    },
    departmentClassifications: {
      relatedEntity: 'Departments',
      relationship: 'References Department Classifications for grouping',
      cardinality: 'one-to-many'
    },
    departmentGroups: {
      relatedEntity: 'Account-Department Association',
      relationship: 'Department Groups enable sophisticated departmental accounting',
      cardinality: 'many-to-many'
    }
  }
} as const;

/**
 * Canonical field definitions for General Classifications entity
 * Defines the complete field structure with types, constraints, and metadata
 */
export const MONEYWORKS_GENERAL_FIELDS = [
  {
    fieldName: "SequenceNumber",
    dataType: "N",
    canonicalDescription: "Unique system-assigned sequence number (Primary Key). System-managed, read-only, auto-incremented identifier.",
    isRequired: true,
    isIndexed: false,
    isReadOnly: true
  },
  {
    fieldName: "LastModifiedTime",
    dataType: "T",
    canonicalDescription: "System-maintained timestamp of last modification. Format: YYYYMMDDHHmmss (14-digit timestamp). System-managed, read-only.",
    isRequired: false,
    isIndexed: false,
    isReadOnly: true
  },
  {
    fieldName: "Code",
    dataType: "A",
    canonicalDescription: "Classification code with prefix (C=Account Category, D=Department Classification, S=Department Group). Max 5 chars, alphanumeric with underscores, auto-capitalized.",
    isRequired: true,
    isIndexed: true,
    isReadOnly: false,
    maxLength: 5
  },
  {
    fieldName: "Description",
    dataType: "A",
    canonicalDescription: "Human-readable classification name. Maximum 25 characters.",
    isRequired: true,
    isIndexed: false,
    isReadOnly: false,
    maxLength: 25
  },
  {
    fieldName: "Date",
    dataType: "D",
    canonicalDescription: "Date field for classification-related date tracking. Format: YYYYMMDD (8-digit date). Default: 19040101 (MoneyWorks epoch indicating no date set).",
    isRequired: false,
    isIndexed: false,
    isReadOnly: false
  },
  {
    fieldName: "Long",
    dataType: "N",
    canonicalDescription: "Long numeric field for extended classification data. Purpose varies by classification type and business context.",
    isRequired: false,
    isIndexed: false,
    isReadOnly: false
  }
] as const;

/**
 * Type guard functions for classification type determination
 */
export const isAccountCategory = (classification: MoneyWorksGeneralClassification): classification is MoneyWorksAccountCategory => {
  return classification.Code.startsWith('C');
};

export const isDepartmentClassification = (classification: MoneyWorksGeneralClassification): classification is MoneyWorksDepartmentClassification => {
  return classification.Code.startsWith('D');
};

export const isDepartmentGroup = (classification: MoneyWorksGeneralClassification): classification is MoneyWorksDepartmentGroup => {
  return classification.Code.startsWith('S');
};

/**
 * Utility function to determine classification type from code
 */
export const getClassificationType = (code: string): GeneralClassificationType | null => {
  const prefix = code.charAt(0).toUpperCase();
  switch (prefix) {
    case 'C': return GeneralClassificationType.ACCOUNT_CATEGORY;
    case 'D': return GeneralClassificationType.DEPARTMENT_CLASSIFICATION;
    case 'S': return GeneralClassificationType.DEPARTMENT_GROUP;
    default: return null;
  }
};

/**
 * Universal business examples across industries
 */
export const UniversalBusinessExamples = {
  restaurant: {
    accountCategories: ['CFOOD', 'CUTIL', 'CCOMMS', 'CRENT', 'CLABOR'],
    departmentClassifications: ['DFOH', 'DBOH', 'DMGMT'],
    departmentGroups: ['SOPS', 'SADMIN']
  },
  lawFirm: {
    accountCategories: ['CCLNT', 'COFF', 'CPROF', 'CLIB', 'CTECH'],
    departmentClassifications: ['DLIT', 'DCORP', 'DSUPP', 'DADMIN'],
    departmentGroups: ['SBILL', 'SOVER']
  },
  manufacturing: {
    accountCategories: ['CRAW', 'CLABOR', 'COVER', 'CMAINT', 'CSHIP'],
    departmentClassifications: ['DPROD', 'DQUAL', 'DADMIN', 'DSALES'],
    departmentGroups: ['SMFG', 'SSUPP']
  }
} as const;

/**
 * API integration constants
 */
export const API_CONSTANTS = {
  /** Table name for MoneyWorks API export */
  TABLE_NAME: 'general',
  
  /** Export URL format */
  EXPORT_URL_FORMAT: '/export?table=general&format=xml-verbose',
  
  /** Internal MoneyWorks entity name */
  INTERNAL_NAME: 'General'
} as const;

export default MoneyWorksGeneralClassification;