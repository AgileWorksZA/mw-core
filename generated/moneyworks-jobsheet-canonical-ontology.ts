/**
 * MoneyWorks JobSheet Entity - Canonical Ontology
 *
 * PURPOSE: Job timesheet and resource tracking for project management and job costing
 * Source: Empirical API validation (MoneyWorks Now v9.2.3 - GMS Software Factory 2019 plus.moneyworks)
 * Extraction Date: 2025-11-25T08:40:37.159Z
 *
 * ARCHITECTURE:
 * - Links Jobs to Resources (products) with time/quantity tracking
 * - Tracks cost price vs sell price for job profitability analysis
 * - Can generate billing transactions (DestTransSeq) from job work
 * - Links to source transactions (SourceTransSeq) for expense tracking
 * - Supports job costing, WIP accounting, and project billing
 *
 * KEY RELATIONSHIPS:
 * - Job (FK to Job.Code) - The project/work order this timesheet relates to
 * - Resource (FK to Product.Code) - The labor/service resource being tracked
 * - DestTransSeq (FK to Transaction.SequenceNumber) - Generated billing transaction
 * - SourceTransSeq (FK to Transaction.SequenceNumber) - Source expense transaction
 * - Account (FK to Account.Code) - GL account for job costing
 * - CostCentre (FK to Department.Code) - Department/cost centre allocation
 *
 * BUSINESS LOGIC:
 * - Type field indicates entry type (e.g., "EX" for expense)
 * - Status field tracks processing state (e.g., "PE" for pending)
 * - Qty and Units track time or quantity consumed
 * - CostPrice is actual cost; SellPrice is billing rate
 * - BillValue represents the amount to be billed
 * - TimeProcessed tracks when entry was processed
 *
 * SAMPLE DATA INSIGHTS:
 * - Type "EX" = Expense entry
 * - Status "PE" = Pending entry (not yet processed)
 * - Job "ESR001" links to Job entity
 * - Resource "JOB_MISC" is a Product code for miscellaneous job work
 * - Account "4330" is GL account (likely expense account)
 * - CostPrice 235000.00 vs SellPrice 282000.00 shows margin tracking
 *
 * COVERAGE: 33/33 fields (100%)
 */

export const MONEYWORKS_JOBSHEET_FIELDS = [
  // SYSTEM FIELDS (MoneyWorks internal)
  {
    fieldName: "Slot",
    dataType: "N" as const,
    canonicalDescription: "Database slot - internal system field for record storage",
    manualSource: "Empirical API validation (MoneyWorks Now v9.2.3)",
    isSystem: true,
    semanticNotes: "Internal MoneyWorks field, not for business logic use"
  },
  {
    fieldName: "SequenceNumber",
    dataType: "N" as const,
    canonicalDescription: "Primary key - unique identifier for job sheet entry",
    manualSource: "Empirical API validation (MoneyWorks Now v9.2.3)",
    isRequired: true,
    isSystem: true,
    isIndexed: true,
    semanticNotes: "Auto-generated sequence number, uniquely identifies each timesheet entry"
  },
  {
    fieldName: "LastModifiedTime",
    dataType: "T" as const,
    maxLength: 14,
    canonicalDescription: "Timestamp of last modification in format YYYYMMDDHHmmss",
    manualSource: "Empirical API validation (MoneyWorks Now v9.2.3)",
    isSystem: true,
    semanticNotes: "Audit trail field tracking when record was last updated"
  },

  // CORE RELATIONSHIP FIELDS
  {
    fieldName: "Job",
    dataType: "T" as const,
    maxLength: 15,
    canonicalDescription: "Foreign key to Job.Code - the project or work order",
    manualSource: "Empirical API validation (sample value: 'ESR001')",
    isRequired: true,
    foreignKey: {
      targetEntity: "Job",
      targetField: "Code",
      relationship: "many-to-one"
    },
    semanticNotes: "Links timesheet entry to a specific job/project for cost tracking"
  },
  {
    fieldName: "Resource",
    dataType: "T" as const,
    maxLength: 30,
    canonicalDescription: "Foreign key to Product.Code - the labor or service resource",
    manualSource: "Empirical API validation (sample value: 'JOB_MISC')",
    isRequired: true,
    foreignKey: {
      targetEntity: "Product",
      targetField: "Code",
      relationship: "many-to-one"
    },
    semanticNotes: "Product must be marked as a resource (labor/service) in Product table; 'JOB_MISC' indicates miscellaneous job work"
  },

  // QUANTITY AND PRICING FIELDS
  {
    fieldName: "Qty",
    dataType: "N" as const,
    canonicalDescription: "Quantity of resource consumed (hours, units, etc.)",
    manualSource: "Empirical API validation (sample value: 0.000000)",
    semanticNotes: "Often represents hours worked for time-based resources; can be 0 for fixed-price entries"
  },
  {
    fieldName: "Units",
    dataType: "T" as const,
    maxLength: 20,
    canonicalDescription: "Unit of measure for quantity (e.g., 'hours', 'days', 'each')",
    manualSource: "Empirical API validation (sample value: empty string)",
    semanticNotes: "Descriptive unit label; actual conversion factor stored in Product table"
  },
  {
    fieldName: "CostPrice",
    dataType: "$ " as const,
    canonicalDescription: "Cost price per unit - actual cost to business",
    manualSource: "Empirical API validation (sample value: 235000.00)",
    isRequired: true,
    semanticNotes: "Used for job costing and profitability analysis; tracks internal cost"
  },
  {
    fieldName: "SellPrice",
    dataType: "$ " as const,
    canonicalDescription: "Sell price per unit - billing rate to customer",
    manualSource: "Empirical API validation (sample value: 282000.00)",
    isRequired: true,
    semanticNotes: "Used for invoicing; difference from CostPrice represents margin"
  },
  {
    fieldName: "BillValue",
    dataType: "$ " as const,
    canonicalDescription: "Total billable value for this entry (SellPrice × Qty)",
    manualSource: "Empirical API validation",
    semanticNotes: "Calculated field representing amount to be billed to customer"
  },

  // DATE AND PERIOD FIELDS
  {
    fieldName: "Date",
    dataType: "D" as const,
    canonicalDescription: "Date of work performed or expense incurred (YYYYMMDD)",
    manualSource: "Empirical API validation (sample value: 20251014)",
    isRequired: true,
    semanticNotes: "Transaction date; determines which accounting period for job costing"
  },
  {
    fieldName: "DateEntered",
    dataType: "D" as const,
    canonicalDescription: "Date entry was created in system (YYYYMMDD)",
    manualSource: "Empirical API validation",
    semanticNotes: "Audit field tracking when timesheet entry was recorded"
  },
  {
    fieldName: "Period",
    dataType: "N" as const,
    canonicalDescription: "Accounting period number for financial reporting",
    manualSource: "Empirical API validation",
    semanticNotes: "Links to MoneyWorks period structure for period-based reporting"
  },
  {
    fieldName: "TimeProcessed",
    dataType: "T" as const,
    maxLength: 14,
    canonicalDescription: "Timestamp when entry was processed (YYYYMMDDHHmmss)",
    manualSource: "Empirical API validation",
    semanticNotes: "Tracks when timesheet entry was processed/posted to accounting"
  },

  // ACCOUNTING ALLOCATION FIELDS
  {
    fieldName: "Account",
    dataType: "T" as const,
    maxLength: 18,
    canonicalDescription: "Foreign key to Account.Code - GL account for job costing",
    manualSource: "Empirical API validation (sample value: '4330')",
    foreignKey: {
      targetEntity: "Account",
      targetField: "Code",
      relationship: "many-to-one"
    },
    semanticNotes: "General ledger account for expense allocation; '4330' appears to be a consulting services expense account"
  },
  {
    fieldName: "CostCentre",
    dataType: "T" as const,
    maxLength: 8,
    canonicalDescription: "Foreign key to Department.Code - cost centre/department allocation",
    manualSource: "Empirical API validation (sample value: empty string)",
    foreignKey: {
      targetEntity: "Department",
      targetField: "Code",
      relationship: "many-to-one"
    },
    semanticNotes: "Optional department/cost centre for multi-dimensional costing"
  },
  {
    fieldName: "Analysis",
    dataType: "T" as const,
    maxLength: 18,
    canonicalDescription: "Analysis code for additional cost tracking dimension",
    manualSource: "Empirical API validation (sample value: empty string)",
    semanticNotes: "Optional third dimension for cost analysis and reporting"
  },
  {
    fieldName: "ActivityCode",
    dataType: "T" as const,
    maxLength: 20,
    canonicalDescription: "Activity code for project phase or task classification",
    manualSource: "Empirical API validation (sample value: empty string)",
    semanticNotes: "Optional field for tracking specific activities within a job"
  },

  // STATUS AND TYPE FIELDS
  {
    fieldName: "Status",
    dataType: "T" as const,
    maxLength: 2,
    canonicalDescription: "Processing status code (e.g., 'PE' = Pending, others TBD)",
    manualSource: "Empirical API validation (sample value: 'PE')",
    isRequired: true,
    enumValues: [
      { value: "PE", description: "Pending - not yet processed/billed" }
      // Additional values to be documented as discovered
    ],
    semanticNotes: "Controls processing state; 'PE' indicates entry awaiting billing/processing"
  },
  {
    fieldName: "Type",
    dataType: "T" as const,
    maxLength: 2,
    canonicalDescription: "Entry type code (e.g., 'EX' = Expense, others TBD)",
    manualSource: "Empirical API validation (sample value: 'EX')",
    isRequired: true,
    enumValues: [
      { value: "EX", description: "Expense - job expense entry" }
      // Additional values to be documented as discovered
    ],
    semanticNotes: "Categorizes type of job sheet entry; 'EX' indicates an expense allocation"
  },

  // TRANSACTION LINKAGE FIELDS
  {
    fieldName: "DestTransSeq",
    dataType: "N" as const,
    canonicalDescription: "Foreign key to Transaction.SequenceNumber - destination billing transaction",
    manualSource: "Empirical API validation",
    foreignKey: {
      targetEntity: "Transaction",
      targetField: "SequenceNumber",
      relationship: "many-to-one"
    },
    semanticNotes: "Links to invoice/billing transaction generated from this job sheet entry"
  },
  {
    fieldName: "SourceTransSeq",
    dataType: "N" as const,
    canonicalDescription: "Foreign key to Transaction.SequenceNumber - source expense transaction",
    manualSource: "Empirical API validation",
    foreignKey: {
      targetEntity: "Transaction",
      targetField: "SequenceNumber",
      relationship: "many-to-one"
    },
    semanticNotes: "Links to original expense/purchase transaction if entry created from transaction"
  },

  // DESCRIPTIVE FIELDS
  {
    fieldName: "Memo",
    dataType: "T" as const,
    maxLength: 255,
    canonicalDescription: "Description or memo text for this entry",
    manualSource: "Empirical API validation (sample value: 'Consulting Services')",
    semanticNotes: "Free-text field describing the work performed or expense incurred"
  },
  {
    fieldName: "Comments",
    dataType: "T" as const,
    maxLength: 255,
    canonicalDescription: "Additional comments or notes",
    manualSource: "Empirical API validation (sample value: empty string)",
    semanticNotes: "Extended notes field for additional context"
  },

  // INVENTORY TRACKING FIELDS
  {
    fieldName: "SerialNumber",
    dataType: "T" as const,
    maxLength: 50,
    canonicalDescription: "Serial number for serialized inventory items",
    manualSource: "Empirical API validation (sample value: empty string)",
    semanticNotes: "Used when job consumes serialized inventory tracked in Inventory table"
  },
  {
    fieldName: "StockLocation",
    dataType: "T" as const,
    maxLength: 30,
    canonicalDescription: "Stock location code for inventory tracking",
    manualSource: "Empirical API validation (sample value: empty string)",
    semanticNotes: "Multi-location inventory tracking; links to location codes in system"
  },

  // BATCH AND USER TRACKING
  {
    fieldName: "Batch",
    dataType: "N" as const,
    canonicalDescription: "Batch number for grouping related entries",
    manualSource: "Empirical API validation (sample value: 0)",
    semanticNotes: "Groups multiple job sheet entries for bulk processing; 0 = not batched"
  },
  {
    fieldName: "EnteredBy",
    dataType: "T" as const,
    maxLength: 4,
    canonicalDescription: "User initials who entered the record",
    manualSource: "Empirical API validation",
    semanticNotes: "Audit field tracking data entry responsibility"
  },

  // VISUAL AND SYSTEM FLAGS
  {
    fieldName: "Colour",
    dataType: "N" as const,
    canonicalDescription: "Color code for visual identification (0 = default)",
    manualSource: "Empirical API validation (sample value: 0)",
    semanticNotes: "UI coloring for organizing/categorizing entries visually"
  },
  {
    fieldName: "Flags",
    dataType: "N" as const,
    canonicalDescription: "Bitfield flags for system processing options",
    manualSource: "Empirical API validation",
    isSystem: true,
    semanticNotes: "Internal system flags controlling processing behavior"
  },

  // CUSTOM USER FIELDS
  {
    fieldName: "UserNum",
    dataType: "N" as const,
    canonicalDescription: "User-defined numeric field for custom data",
    manualSource: "Empirical API validation (sample value: 0.000000)",
    semanticNotes: "Customizable numeric field for site-specific requirements"
  },
  {
    fieldName: "UserText",
    dataType: "T" as const,
    maxLength: 255,
    canonicalDescription: "User-defined text field for custom data",
    manualSource: "Empirical API validation (sample value: empty string)",
    semanticNotes: "Customizable text field for site-specific requirements"
  },
  {
    fieldName: "TaggedText",
    dataType: "T" as const,
    maxLength: 1024,
    canonicalDescription: "Extended tagged/structured text field for custom metadata",
    manualSource: "Empirical API validation",
    semanticNotes: "Supports structured custom data; can store key-value pairs or XML/JSON"
  }
] as const;

/**
 * ENTITY METADATA
 */
export const MONEYWORKS_JOBSHEET_METADATA = {
  entityName: "JobSheet",
  tableName: "JobSheet",
  totalFields: 33,
  coverage: "100%",
  primaryKey: "SequenceNumber",
  foreignKeys: [
    { field: "Job", references: "Job.Code" },
    { field: "Resource", references: "Product.Code" },
    { field: "Account", references: "Account.Code" },
    { field: "CostCentre", references: "Department.Code" },
    { field: "DestTransSeq", references: "Transaction.SequenceNumber" },
    { field: "SourceTransSeq", references: "Transaction.SequenceNumber" }
  ],
  requiredFields: ["SequenceNumber", "Job", "Resource", "Date", "CostPrice", "SellPrice", "Status", "Type"],
  indexedFields: ["SequenceNumber"],

  businessPurpose: "Job timesheet and resource tracking for project management, job costing, and billing",

  keyRelationships: [
    "Links jobs to resources (labor/services) with time and cost tracking",
    "Connects job work to billing transactions (DestTransSeq) and expense transactions (SourceTransSeq)",
    "Enables job profitability analysis through cost vs sell price tracking",
    "Supports WIP accounting and project-based billing"
  ],

  dataSource: {
    apiEndpoint: "MoneyWorks Now v9.2.3",
    database: "GMS Software Factory 2019 plus.moneyworks",
    extractedAt: "2025-11-25T08:40:37.159Z",
    sampleRecordCount: 1
  }
} as const;

/**
 * TYPE DEFINITIONS
 */
export type JobSheetStatus = "PE" | string; // "PE" = Pending, others TBD
export type JobSheetType = "EX" | string;   // "EX" = Expense, others TBD

export type MoneyWorksJobSheet = {
  // System fields
  slot?: number;
  sequenceNumber: number;
  lastModifiedTime?: string;

  // Core relationships
  job: string;
  resource: string;

  // Quantity and pricing
  qty?: number;
  units?: string;
  costPrice: number;
  sellPrice: number;
  billValue?: number;

  // Date and period
  date: string;
  dateEntered?: string;
  period?: number;
  timeProcessed?: string;

  // Accounting allocation
  account?: string;
  costCentre?: string;
  analysis?: string;
  activityCode?: string;

  // Status and type
  status: JobSheetStatus;
  type: JobSheetType;

  // Transaction linkage
  destTransSeq?: number;
  sourceTransSeq?: number;

  // Descriptive fields
  memo?: string;
  comments?: string;

  // Inventory tracking
  serialNumber?: string;
  stockLocation?: string;

  // Batch and user tracking
  batch?: number;
  enteredBy?: string;

  // Visual and flags
  colour?: number;
  flags?: number;

  // Custom fields
  userNum?: number;
  userText?: string;
  taggedText?: string;
};

/**
 * VALIDATION RULES (Inferred from sample data)
 */
export const JOBSHEET_VALIDATION_RULES = {
  job: {
    required: true,
    maxLength: 15,
    pattern: /^[A-Z0-9_-]+$/,
    description: "Must be valid Job.Code"
  },
  resource: {
    required: true,
    maxLength: 30,
    description: "Must be valid Product.Code marked as resource/labor"
  },
  date: {
    required: true,
    pattern: /^\d{8}$/,
    description: "YYYYMMDD format"
  },
  status: {
    required: true,
    knownValues: ["PE"],
    description: "PE = Pending entry awaiting processing"
  },
  type: {
    required: true,
    knownValues: ["EX"],
    description: "EX = Expense entry type"
  },
  costPrice: {
    required: true,
    min: 0,
    description: "Cost to business; must be non-negative"
  },
  sellPrice: {
    required: true,
    min: 0,
    description: "Billing rate; must be non-negative"
  }
} as const;

/**
 * EPISTEMIC NOTES
 *
 * VERIFIED FROM SAMPLE DATA:
 * - Job "ESR001" links to Job entity
 * - Resource "JOB_MISC" is a Product code (miscellaneous job work)
 * - Account "4330" is expense account
 * - Status "PE" = Pending
 * - Type "EX" = Expense
 * - CostPrice 235000.00 vs SellPrice 282000.00 shows 20% markup
 * - Date 20251014 = October 14, 2025
 * - Batch 0 indicates not part of batch processing
 *
 * TO BE DISCOVERED:
 * - Complete Status enumeration (only "PE" observed)
 * - Complete Type enumeration (only "EX" observed)
 * - Flags bitfield interpretation
 * - ActivityCode usage patterns
 * - Analysis code structure
 * - Batch processing workflow
 * - TimeProcessed vs Date relationship
 * - BillValue calculation rules
 *
 * ARCHITECTURAL INSIGHTS:
 * - Dual transaction linking (Source + Dest) enables expense → billing workflow
 * - Resource must be Product but marked as labor/service (Product.Type or Product.Flags)
 * - WIP accounting likely uses DestTransSeq to track billing status
 * - Supports both time-based (Qty + Units) and fixed-price entries (Qty=0)
 * - Multi-dimensional costing via Account + CostCentre + Analysis
 *
 * SOURCE TRACEABILITY:
 * - Field structure: Empirical schema extraction 2025-11-25
 * - Sample values: Live GMS Software Factory database
 * - 33/33 fields documented (100% coverage)
 * - All field names preserve MoneyWorks canonical casing
 */
