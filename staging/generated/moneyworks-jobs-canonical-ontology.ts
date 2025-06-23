/**
 * MoneyWorks Jobs Entity - Canonical Ontology
 * 
 * PURE MoneyWorks staging definitions extracted from official manual
 * Source: moneyworks_appendix_jobs.html
 * Authority: MoneyWorks Manual - Jobs Field Descriptions
 * 
 * CRITICAL DISCOVERY: MoneyWorks has sophisticated project management system:
 * - Hierarchical job structure (projects containing sub-jobs)
 * - Complete project lifecycle: Quote → Active → Complete
 * - Client-based project costing with markup and billing tracking
 * - Extensive categorization and analysis capabilities
 */

// ============================================================================
// CANONICAL MONEYWORKS JOB STATUS TYPES
// ============================================================================

/**
 * MoneyWorks staging job status classification
 * Source: moneyworks_appendix_jobs.html - "Status" field
 */
export enum MoneyWorksJobStatus {
  /** Quoted job */
  QUOTED = "QU",
  
  /** Active job */
  ACTIVE = "OP",
  
  /** Complete job */
  COMPLETE = "CO"
}

/**
 * MoneyWorks staging job colour classification
 * Source: moneyworks_appendix_jobs.html - "Colour" field
 * Note: Colour represented as numeric index 0-7, rendered as textual colour name
 */
export enum MoneyWorksJobColour {
  /** Colour index 0 */
  COLOUR_0 = 0,
  
  /** Colour index 1 */
  COLOUR_1 = 1,
  
  /** Colour index 2 */
  COLOUR_2 = 2,
  
  /** Colour index 3 */
  COLOUR_3 = 3,
  
  /** Colour index 4 */
  COLOUR_4 = 4,
  
  /** Colour index 5 */
  COLOUR_5 = 5,
  
  /** Colour index 6 */
  COLOUR_6 = 6,
  
  /** Colour index 7 */
  COLOUR_7 = 7
}

// ============================================================================
// CANONICAL MONEYWORKS JOB FIELD DEFINITIONS
// ============================================================================

/**
 * Core MoneyWorks job fields as defined in manual
 * Source: moneyworks_appendix_jobs.html - Jobs table
 */
export const MONEYWORKS_JOB_FIELDS = [
  {
    fieldName: "Code",
    dataType: "T" as const,
    maxLength: 9,
    canonicalDescription: "The job code.",
    manualSource: "moneyworks_appendix_jobs.html",
    isRequired: true,
    isIndexed: true
  },
  {
    fieldName: "Status",
    dataType: "A" as const,
    maxLength: 2,
    canonicalDescription: "The status of the job. \"QU\" for quoted, \"OP\" for active, \"CO\" for complete",
    manualSource: "moneyworks_appendix_jobs.html",
    isRequired: true,
    isIndexed: true
  },
  {
    fieldName: "Description",
    dataType: "T" as const,
    maxLength: 255,
    canonicalDescription: "The job name.",
    manualSource: "moneyworks_appendix_jobs.html",
    isRequired: true
  },
  {
    fieldName: "Client",
    dataType: "T" as const,
    maxLength: 11,
    canonicalDescription: "The code of the client for whom the job is being done. Must be a debtor.",
    manualSource: "moneyworks_appendix_jobs.html",
    isRequired: true,
    relationshipTarget: "Names",
    relationshipRule: "Must reference valid Name with CustomerType = 2 (Debtor)"
  },
  {
    fieldName: "Project",
    dataType: "T" as const,
    maxLength: 9,
    canonicalDescription: "Job code of project to which this belongs",
    manualSource: "moneyworks_appendix_jobs.html",
    relationshipTarget: "Jobs",
    relationshipRule: "Must reference valid Job.Code for hierarchical project structure"
  },
  {
    fieldName: "Manager",
    dataType: "T" as const,
    maxLength: 3,
    canonicalDescription: "The manager for the job",
    manualSource: "moneyworks_appendix_jobs.html"
  },
  {
    fieldName: "Contact",
    dataType: "T" as const,
    maxLength: 63,
    canonicalDescription: "The contact for the job",
    manualSource: "moneyworks_appendix_jobs.html"
  },
  {
    fieldName: "Phone",
    dataType: "T" as const,
    maxLength: 19,
    canonicalDescription: "The contact's phone number",
    manualSource: "moneyworks_appendix_jobs.html"
  },
  {
    fieldName: "OrderNum",
    dataType: "T" as const,
    maxLength: 31,
    canonicalDescription: "The client's order number for the job",
    manualSource: "moneyworks_appendix_jobs.html"
  },
  {
    fieldName: "StartDate",
    dataType: "D" as const,
    canonicalDescription: "The start date of the job",
    manualSource: "moneyworks_appendix_jobs.html"
  },
  {
    fieldName: "EndDate",
    dataType: "D" as const,
    canonicalDescription: "The expected end date",
    manualSource: "moneyworks_appendix_jobs.html"
  },
  {
    fieldName: "TargetDate",
    dataType: "D" as const,
    canonicalDescription: "Target date for job",
    manualSource: "moneyworks_appendix_jobs.html"
  },
  {
    fieldName: "Quote",
    dataType: "N" as const,
    canonicalDescription: "The amount quoted for the job.",
    manualSource: "moneyworks_appendix_jobs.html"
  },
  {
    fieldName: "Billed",
    dataType: "N" as const,
    canonicalDescription: "The amount billed to date for the job.",
    manualSource: "moneyworks_appendix_jobs.html"
  },
  {
    fieldName: "Markup",
    dataType: "N" as const,
    canonicalDescription: "The percent markup applied to items used on the job.",
    manualSource: "moneyworks_appendix_jobs.html"
  },
  {
    fieldName: "PercentComplete",
    dataType: "N" as const,
    canonicalDescription: "Percent that the job is complete",
    manualSource: "moneyworks_appendix_jobs.html"
  },
  {
    fieldName: "Colour",
    dataType: "N" as const,
    canonicalDescription: "The colour, represented internally as a numeric index in the range 0-7 but rendered as a textual colour name",
    manualSource: "moneyworks_appendix_jobs.html"
  },
  {
    fieldName: "Comment",
    dataType: "T" as const,
    maxLength: 1020,
    canonicalDescription: "Comments on the job",
    manualSource: "moneyworks_appendix_jobs.html"
  },
  {
    fieldName: "Category1",
    dataType: "T" as const,
    maxLength: 15,
    canonicalDescription: "Any value. This can be used for analysis purposes.",
    manualSource: "moneyworks_appendix_jobs.html"
  },
  {
    fieldName: "Category2",
    dataType: "T" as const,
    maxLength: 15,
    canonicalDescription: "Any value. This can be used for analysis purposes.",
    manualSource: "moneyworks_appendix_jobs.html"
  },
  {
    fieldName: "Category3",
    dataType: "T" as const,
    maxLength: 15,
    canonicalDescription: "Any value. This can be used for analysis purposes.",
    manualSource: "moneyworks_appendix_jobs.html"
  },
  {
    fieldName: "Category4",
    dataType: "T" as const,
    maxLength: 15,
    canonicalDescription: "Any value. This can be used for analysis purposes.",
    manualSource: "moneyworks_appendix_jobs.html"
  },
  {
    fieldName: "Custom1",
    dataType: "T" as const,
    maxLength: 255,
    canonicalDescription: "For your own use",
    manualSource: "moneyworks_appendix_jobs.html"
  },
  {
    fieldName: "Custom2",
    dataType: "T" as const,
    maxLength: 255,
    canonicalDescription: "For your own use",
    manualSource: "moneyworks_appendix_jobs.html"
  },
  {
    fieldName: "Custom3",
    dataType: "T" as const,
    maxLength: 15,
    canonicalDescription: "For your own use",
    manualSource: "moneyworks_appendix_jobs.html"
  },
  {
    fieldName: "Custom4",
    dataType: "T" as const,
    maxLength: 15,
    canonicalDescription: "For your own use",
    manualSource: "moneyworks_appendix_jobs.html"
  },
  {
    fieldName: "Custom5",
    dataType: "T" as const,
    maxLength: 15,
    canonicalDescription: "For your own use",
    manualSource: "moneyworks_appendix_jobs.html"
  },
  {
    fieldName: "Custom6",
    dataType: "T" as const,
    maxLength: 15,
    canonicalDescription: "For your own use",
    manualSource: "moneyworks_appendix_jobs.html"
  },
  {
    fieldName: "Custom7",
    dataType: "T" as const,
    maxLength: 15,
    canonicalDescription: "For your own use",
    manualSource: "moneyworks_appendix_jobs.html"
  },
  {
    fieldName: "Custom8",
    dataType: "T" as const,
    maxLength: 15,
    canonicalDescription: "For your own use",
    manualSource: "moneyworks_appendix_jobs.html"
  },
  {
    fieldName: "UserNum",
    dataType: "N" as const,
    canonicalDescription: "User defined",
    manualSource: "moneyworks_appendix_jobs.html"
  },
  {
    fieldName: "UserText",
    dataType: "T" as const,
    maxLength: 255,
    canonicalDescription: "User defined",
    manualSource: "moneyworks_appendix_jobs.html"
  },
  {
    fieldName: "TaggedText",
    dataType: "T" as const,
    maxLength: 255,
    canonicalDescription: "Scriptable tag storage",
    manualSource: "moneyworks_appendix_jobs.html"
  },
  {
    fieldName: "LastModifiedTime",
    dataType: "S" as const,
    canonicalDescription: "The date that this job record was last changed. Transactions related to the job do not change the modification date of the job record",
    manualSource: "moneyworks_appendix_jobs.html"
  }
] as const;

// ============================================================================
// CANONICAL MONEYWORKS JOB TYPE DEFINITIONS
// ============================================================================

/**
 * MoneyWorks staging job status definitions with manual explanations
 */
export interface MoneyWorksJobStatusDefinition {
  status: MoneyWorksJobStatus;
  canonicalName: string;
  moneyWorksDescription: string;
  manualSource: string;
  businessContext: string;
}

export const MONEYWORKS_JOB_STATUS_DEFINITIONS: MoneyWorksJobStatusDefinition[] = [
  {
    status: MoneyWorksJobStatus.QUOTED,
    canonicalName: "Quoted",
    moneyWorksDescription: "QU for quoted",
    manualSource: "moneyworks_appendix_jobs.html",
    businessContext: "Job has been quoted but not yet confirmed or started"
  },
  {
    status: MoneyWorksJobStatus.ACTIVE,
    canonicalName: "Active",
    moneyWorksDescription: "OP for active",
    manualSource: "moneyworks_appendix_jobs.html", 
    businessContext: "Job is active and work is in progress"
  },
  {
    status: MoneyWorksJobStatus.COMPLETE,
    canonicalName: "Complete",
    moneyWorksDescription: "CO for complete",
    manualSource: "moneyworks_appendix_jobs.html",
    businessContext: "Job has been completed and closed"
  }
];

// ============================================================================
// CANONICAL MONEYWORKS TERMINOLOGY CLARIFICATION
// ============================================================================

/**
 * CRITICAL ARCHITECTURAL INSIGHT:
 * 
 * MoneyWorks Jobs entity reveals sophisticated project management capabilities:
 * 
 * PROJECT HIERARCHY:
 * - Jobs can belong to other Jobs via "Project" field
 * - Creates nested project structure for complex project management
 * - Parent projects can contain multiple sub-jobs
 * 
 * CLIENT INTEGRATION:
 * - Jobs must reference a Debtor (not just any Name)
 * - Enforces that jobs are performed for paying customers
 * - Direct integration with Names entity receivables management
 * 
 * FINANCIAL TRACKING:
 * - Quote → Billed progression tracks project financials
 * - Markup percentage for cost-plus pricing models
 * - PercentComplete for progress billing and project monitoring
 * 
 * ANALYSIS & CATEGORIZATION:
 * - 4 Category fields for business intelligence
 * - 8 Custom fields for organization-specific needs
 * - Colour coding for visual project management
 */

export const MONEYWORKS_JOB_CANONICAL_TERMS = {
  // Project classifications (MoneyWorks staging)
  JOB_CODE: "Job Code",                     // Unique identifier for job
  PROJECT_CODE: "Project Code",             // Parent project reference
  CLIENT_CODE: "Client Code",               // Debtor who pays for job
  
  // Status management (MoneyWorks staging)
  QUOTED_JOB: "Quoted Job",                 // Status QU - proposal stage
  ACTIVE_JOB: "Active Job",                 // Status OP - work in progress
  COMPLETE_JOB: "Complete Job",             // Status CO - finished
  
  // Financial tracking (MoneyWorks staging)
  QUOTED_AMOUNT: "Quoted Amount",           // Initial quote value
  BILLED_AMOUNT: "Billed Amount",           // Amount invoiced to date
  MARKUP_PERCENT: "Markup Percent",        // Cost-plus pricing markup
  PERCENT_COMPLETE: "Percent Complete",     // Progress tracking
  
  // Project management (MoneyWorks staging)
  JOB_MANAGER: "Job Manager",               // Responsible manager code
  START_DATE: "Start Date",                 // Project commencement
  END_DATE: "End Date",                     // Expected completion
  TARGET_DATE: "Target Date",               // Target completion
  
  // Client communication (MoneyWorks staging)
  CLIENT_CONTACT: "Client Contact",         // Primary contact person
  CONTACT_PHONE: "Contact Phone",           // Contact phone number
  CLIENT_ORDER_NUMBER: "Client Order Number", // Customer's PO/order reference
  
  // Analysis & categorization (MoneyWorks staging)
  ANALYSIS_CATEGORY: "Analysis Category",   // Category1-4 for reporting
  CUSTOM_FIELD: "Custom Field",            // Custom1-8 for organization needs
  JOB_COLOUR: "Job Colour",                // Visual categorization
  JOB_COMMENT: "Job Comment",              // Extended job notes
  
  // System management (MoneyWorks staging)
  USER_DEFINED_NUMBER: "User Defined Number", // UserNum for custom metrics
  USER_DEFINED_TEXT: "User Defined Text",     // UserText for custom data
  SCRIPTABLE_TAGS: "Scriptable Tags",         // TaggedText for automation
  LAST_MODIFIED: "Last Modified Time"         // Record change tracking
} as const;

// ============================================================================
// CANONICAL VALIDATION FUNCTIONS
// ============================================================================

/**
 * Validate staging MoneyWorks job status
 */
export function validateJobStatusCanonical(status: string): {
  isValid: boolean;
  canonicalStatus?: MoneyWorksJobStatus;
  warnings: string[];
} {
  const warnings: string[] = [];
  
  // Validate status code
  const validStatuses = ["QU", "OP", "CO"];
  if (!validStatuses.includes(status)) {
    warnings.push(`Invalid Job Status '${status}'. MoneyWorks canonical values: QU (quoted), OP (active), CO (complete)`);
  }
  
  return {
    isValid: warnings.length === 0,
    canonicalStatus: status as MoneyWorksJobStatus,
    warnings
  };
}

/**
 * Validate staging MoneyWorks job code format
 */
export function validateJobCodeCanonical(code: string): {
  isValid: boolean;
  warnings: string[];
} {
  const warnings: string[] = [];
  
  if (!code || code.trim().length === 0) {
    warnings.push("Job Code is required");
  } else if (code.length > 9) {
    warnings.push(`Job Code '${code}' exceeds maximum length of 9 characters`);
  }
  
  return {
    isValid: warnings.length === 0,
    warnings
  };
}

/**
 * Validate staging MoneyWorks client reference (must be debtor)
 */
export function validateJobClientCanonical(clientCode: string): {
  isValid: boolean;
  warnings: string[];
  requirement: string;
} {
  const warnings: string[] = [];
  
  if (!clientCode || clientCode.trim().length === 0) {
    warnings.push("Client Code is required for job");
  } else if (clientCode.length > 11) {
    warnings.push(`Client Code '${clientCode}' exceeds maximum length of 11 characters`);
  }
  
  return {
    isValid: warnings.length === 0,
    warnings,
    requirement: "Client must reference valid Name with CustomerType = 2 (Debtor)"
  };
}

/**
 * Validate staging MoneyWorks job colour
 */
export function validateJobColourCanonical(colour: number): {
  isValid: boolean;
  warnings: string[];
} {
  const warnings: string[] = [];
  
  if (colour < 0 || colour > 7) {
    warnings.push(`Job Colour ${colour} out of range. MoneyWorks canonical range: 0-7`);
  }
  
  return {
    isValid: warnings.length === 0,
    warnings
  };
}

/**
 * Validate staging MoneyWorks project hierarchy reference
 */
export function validateProjectHierarchyCanonical(jobCode: string, projectCode?: string): {
  isValid: boolean;
  warnings: string[];
  hierarchyNote: string;
} {
  const warnings: string[] = [];
  
  if (projectCode && projectCode === jobCode) {
    warnings.push("Job cannot be its own parent project (circular reference)");
  }
  
  if (projectCode && projectCode.length > 9) {
    warnings.push(`Project Code '${projectCode}' exceeds maximum length of 9 characters`);
  }
  
  return {
    isValid: warnings.length === 0,
    warnings,
    hierarchyNote: "MoneyWorks supports nested project structure where jobs can belong to other jobs"
  };
}

/**
 * Get staging MoneyWorks job status explanation
 */
export function getCanonicalJobStatusExplanation(status: MoneyWorksJobStatus): string {
  const statusDef = MONEYWORKS_JOB_STATUS_DEFINITIONS.find(def => def.status === status);
  return statusDef ? `${statusDef.canonicalName}: ${statusDef.businessContext}` : "Unknown job status";
}

/**
 * Validate staging MoneyWorks job financial amounts
 */
export function validateJobFinancialsCanonical(quote?: number, billed?: number, markup?: number, percentComplete?: number): {
  isValid: boolean;
  warnings: string[];
  insights: string[];
} {
  const warnings: string[] = [];
  const insights: string[] = [];
  
  // Validate quote amount
  if (quote !== undefined && quote < 0) {
    warnings.push("Quote amount cannot be negative");
  }
  
  // Validate billed amount
  if (billed !== undefined && billed < 0) {
    warnings.push("Billed amount cannot be negative");
  }
  
  // Validate markup percentage
  if (markup !== undefined && markup < 0) {
    warnings.push("Markup percentage cannot be negative");
  }
  
  // Validate percent complete
  if (percentComplete !== undefined) {
    if (percentComplete < 0 || percentComplete > 100) {
      warnings.push("Percent complete must be between 0 and 100");
    }
  }
  
  // Business logic insights
  if (quote !== undefined && billed !== undefined) {
    if (billed > quote) {
      insights.push("Billed amount exceeds quote - may indicate scope changes or additional work");
    }
    
    const billingRatio = quote > 0 ? (billed / quote) * 100 : 0;
    if (percentComplete !== undefined) {
      const completionGap = Math.abs(billingRatio - percentComplete);
      if (completionGap > 20) {
        insights.push(`Billing ratio (${billingRatio.toFixed(1)}%) and completion (${percentComplete}%) significantly different`);
      }
    }
  }
  
  return {
    isValid: warnings.length === 0,
    warnings,
    insights
  };
}

/**
 * Get staging job entity relationships for validation
 */
export function getCanonicalJobEntityRelationships(): {
  requiredReferences: string[];
  optionalReferences: string[];
  businessRules: string[];
} {
  return {
    requiredReferences: [
      "Names.Code (Client field - must be Debtor)",
    ],
    optionalReferences: [
      "Jobs.Code (Project field - hierarchical structure)",
    ],
    businessRules: [
      "Client must reference Name with CustomerType = 2 (Debtor)",
      "Project field can reference another Job for hierarchical project structure",
      "Jobs cannot reference themselves as parent projects",
      "Transactions can reference Jobs for cost tracking and billing",
      "Products can be associated with Jobs for materials and services tracking"
    ]
  };
}

export default {
  MONEYWORKS_JOB_STATUS_DEFINITIONS,
  MONEYWORKS_JOB_FIELDS,
  MONEYWORKS_JOB_CANONICAL_TERMS
};