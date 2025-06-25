/**
 * Core system operations schemas for MoneyWorks MCP
 * 
 * Provides 41 system operations across 9 categories:
 * - Validation (5 tools)
 * - Permissions (5 tools)
 * - Schema (4 tools)
 * - Data Relationships (3 tools)
 * - Calculations (6 tools)
 * - Sequences (3 tools)
 * - Constants (5 tools)
 * - Search Expressions (5 tools)
 * - System (5 tools)
 */

import { z } from "zod";
import { createOperationDescription } from "./base.schema";

/**
 * Core operation categories
 */
export const coreCategorySchema = z.enum([
  "validation",
  "permission",
  "schema",
  "dataRelationship",
  "calculation",
  "sequence",
  "constant",
  "searchExpression",
  "system"
], {
  description: "Category of core operation. Start with 'schema' to understand data structure."
});

/**
 * Table names enum for operations that need it
 */
export const tableNameSchema = z.enum([
  "Account", "Transaction", "Name", "Product", "Job", "Department",
  "TaxRate", "Asset", "Build", "Contact", "General", "Inventory",
  "JobSheetItem", "Login", "Memo", "OffLedger", "Payments",
  "Reconciliation", "User", "Detail"
], {
  description: "MoneyWorks table name"
});

/**
 * Main core operations schema - organized by category
 */
export const coreOperationSchema = z.discriminatedUnion("category", [
  // VALIDATION OPERATIONS (5 tools)
  z.object({
    category: z.literal("validation"),
    operation: z.enum([
      "validateField",
      "validateCode", 
      "validateExpression",
      "checkFieldRequirements",
      "getValidationRules"
    ]).describe("Validation operation to perform"),
    
    // Operation-specific fields
    table: tableNameSchema.optional()
      .describe("Table name (required for field operations)"),
    field: z.string().optional()
      .describe("Field name to validate"),
    value: z.any().optional()
      .describe("Value to validate"),
    code: z.string().optional()
      .describe("Code to validate (for validateCode)"),
    expression: z.string().optional()
      .describe("MoneyWorks expression to validate"),
    strict: z.boolean().default(true)
      .describe("Use strict validation rules"),
  }),

  // PERMISSION OPERATIONS (5 tools)
  z.object({
    category: z.literal("permission"),
    operation: z.enum([
      "checkTablePermission",
      "checkFieldPermission",
      "checkOperationPermission",
      "getUserPermissions",
      "getSecurityAudit"
    ]).describe("Permission operation to perform"),
    
    table: tableNameSchema.optional(),
    field: z.string().optional(),
    permissionOperation: z.string().optional()
      .describe("Operation like 'read', 'write', 'delete'"),
    userId: z.string().optional()
      .describe("User ID to check permissions for"),
    auditType: z.enum(["permissions", "access", "operations", "all"]).optional(),
  }),

  // SCHEMA OPERATIONS (4 tools)
  z.object({
    category: z.literal("schema"),
    operation: z.enum([
      "getTableSchema",
      "getFieldMetadata",
      "getRelationships",
      "searchSchema"
    ]).describe("Schema operation. Start with 'getTableSchema' to see table structure."),
    
    table: tableNameSchema.optional()
      .describe("Table name (omit for searchSchema)"),
    field: z.string().optional()
      .describe("Field name for getFieldMetadata"),
    searchTerm: z.string().optional()
      .describe("Search term for searchSchema"),
    includeExamples: z.boolean().default(true)
      .describe("Include example values in response"),
  }),

  // DATA RELATIONSHIP OPERATIONS (3 tools)
  z.object({
    category: z.literal("dataRelationship"),
    operation: z.enum([
      "findRelated",
      "getRelationshipMap",
      "checkReferentialIntegrity"
    ]).describe("Data relationship operations"),
    
    table: tableNameSchema.optional(),
    recordId: z.string().optional()
      .describe("Record ID to find relationships for"),
    maxDepth: z.number().min(1).max(5).default(2)
      .describe("Maximum relationship depth to traverse"),
    includeInverse: z.boolean().default(true),
  }),

  // CALCULATION OPERATIONS (6 tools)
  z.object({
    category: z.literal("calculation"),
    operation: z.enum([
      "calculate",
      "aggregate",
      "evaluate",
      "getCalculationFields",
      "validateCalculation",
      "getCommonCalculations"
    ]).describe("Calculation and expression operations"),
    
    expression: z.string().optional()
      .describe("MoneyWorks expression. Example: 'Sum(Account.Balance)'"),
    table: tableNameSchema.optional(),
    filter: z.string().optional()
      .describe("Filter for aggregations. Example: 'Type=\"IN\"'"),
    groupBy: z.string().optional(),
    function: z.enum(["sum", "count", "avg", "min", "max"]).optional(),
  }),

  // SEQUENCE OPERATIONS (3 tools)
  z.object({
    category: z.literal("sequence"),
    operation: z.enum([
      "getNext",
      "getCurrent",
      "getSequenceInfo"
    ]).describe("Sequence number operations"),
    
    sequenceType: z.enum([
      "transaction", "invoice", "receipt", "payment",
      "creditnote", "journal", "order", "build"
    ]).describe("Type of sequence"),
    preview: z.boolean().default(true)
      .describe("Preview only, don't increment"),
  }),

  // CONSTANT OPERATIONS (5 tools)
  z.object({
    category: z.literal("constant"),
    operation: z.enum([
      "getConstant",
      "listConstants",
      "getSystemInfo",
      "getDateConstants",
      "getUserConstants"
    ]).describe("System constant operations"),
    
    constantName: z.string().optional()
      .describe("Constant name like 'TODAY', 'PERIOD', 'VERSION'"),
    constantType: z.enum(["system", "date", "user", "all"]).optional(),
  }),

  // SEARCH EXPRESSION OPERATIONS (5 tools)
  z.object({
    category: z.literal("searchExpression"),
    operation: z.enum([
      "buildExpression",
      "parseExpression",
      "testExpression",
      "getOperators",
      "getExamples"
    ]).describe("Search expression builder operations"),
    
    table: tableNameSchema.optional(),
    conditions: z.array(z.object({
      field: z.string(),
      operator: z.string(),
      value: z.any(),
    })).optional().describe("Conditions to build expression from"),
    expression: z.string().optional()
      .describe("Expression to parse or test"),
    limit: z.number().optional()
      .describe("Limit for test results"),
  }),

  // SYSTEM OPERATIONS (5 tools)
  z.object({
    category: z.literal("system"),
    operation: z.enum([
      "getVersion",
      "exportCustom",
      "importData",
      "generateReport",
      "executeScript"
    ]).describe("System-level operations"),
    
    format: z.enum(["json", "xml", "csv", "tab"]).optional(),
    template: z.string().optional()
      .describe("Export template or report name"),
    data: z.string().optional()
      .describe("Import data content"),
    script: z.string().optional()
      .describe("MoneyWorks script to execute"),
    parameters: z.record(z.any()).optional(),
  }),
]).describe(createOperationDescription("Core System", {
  schema: "{\"category\": \"schema\", \"operation\": \"getTableSchema\", \"table\": \"Account\"}",
  calculate: "{\"category\": \"calculation\", \"operation\": \"calculate\", \"expression\": \"Sum(Account.Balance)\"}",
  validate: "{\"category\": \"validation\", \"operation\": \"validateField\", \"table\": \"Name\", \"field\": \"Email\", \"value\": \"test@example.com\"}",
  permission: "{\"category\": \"permission\", \"operation\": \"getUserPermissions\"}",
  constant: "{\"category\": \"constant\", \"operation\": \"getConstant\", \"constantName\": \"TODAY\"}",
}));

/**
 * Simplified schemas for common operations
 */
export const getTableSchemaSchema = z.object({
  table: tableNameSchema.describe("Table to get schema for"),
  includeExamples: z.boolean().default(true),
}).describe("Get complete schema for a table");

export const calculateExpressionSchema = z.object({
  expression: z.string()
    .describe("MoneyWorks expression. Example: 'Sum(Transaction.Gross, TransType=\"DI\")'"),
}).describe("Calculate a MoneyWorks expression");

export const validateFieldValueSchema = z.object({
  table: tableNameSchema,
  field: z.string(),
  value: z.any(),
}).describe("Validate a field value");

/**
 * Response schemas for different operation types
 */
export const schemaResponseSchema = z.object({
  success: z.literal(true),
  table: z.string(),
  fields: z.array(z.object({
    name: z.string(),
    type: z.string(),
    description: z.string().optional(),
    required: z.boolean(),
    maxLength: z.number().optional(),
    example: z.any().optional(),
    validValues: z.array(z.any()).optional(),
  })),
  primaryKey: z.string(),
  relationships: z.array(z.object({
    field: z.string(),
    relatedTable: z.string(),
    relatedField: z.string(),
    type: z.string(),
  })).optional(),
});

export const calculationResponseSchema = z.object({
  success: z.literal(true),
  expression: z.string(),
  result: z.any(),
  dataType: z.string(),
  executionTime: z.number().optional(),
  recordsProcessed: z.number().optional(),
});

export const validationResponseSchema = z.object({
  success: z.literal(true),
  valid: z.boolean(),
  message: z.string().optional(),
  errors: z.array(z.string()).optional(),
  suggestions: z.array(z.string()).optional(),
});

/**
 * Example operations by category
 */
export const CORE_OPERATION_EXAMPLES = {
  // Schema examples
  getAccountSchema: {
    category: "schema",
    operation: "getTableSchema",
    description: "Get Account table structure",
    example: { category: "schema", operation: "getTableSchema", table: "Account" },
  },
  searchFields: {
    category: "schema",
    operation: "searchSchema",
    description: "Find email fields",
    example: { category: "schema", operation: "searchSchema", searchTerm: "email" },
  },
  
  // Calculation examples
  totalIncome: {
    category: "calculation",
    operation: "calculate",
    description: "Calculate total income",
    example: { 
      category: "calculation", 
      operation: "calculate", 
      expression: "Sum(Account.Balance, Type=\"IN\")" 
    },
  },
  countInvoices: {
    category: "calculation",
    operation: "aggregate",
    description: "Count unpaid invoices",
    example: {
      category: "calculation",
      operation: "aggregate",
      table: "Transaction",
      function: "count",
      filter: "Outstanding>0"
    },
  },
  
  // Validation examples
  validateEmail: {
    category: "validation",
    operation: "validateField",
    description: "Validate email format",
    example: {
      category: "validation",
      operation: "validateField",
      table: "Name",
      field: "Email",
      value: "test@example.com"
    },
  },
  
  // System examples
  getVersion: {
    category: "system",
    operation: "getVersion",
    description: "Get MoneyWorks version",
    example: { category: "system", operation: "getVersion" },
  },
  
  // Constant examples
  getCurrentDate: {
    category: "constant",
    operation: "getConstant",
    description: "Get current date",
    example: { category: "constant", operation: "getConstant", constantName: "TODAY" },
  },
};