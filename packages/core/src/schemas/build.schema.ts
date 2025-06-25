/**
 * Build table schemas for MoneyWorks MCP operations
 * 
 * Handles manufacturing builds, bill of materials, and production
 */

import { z } from "zod";
import {
  paginationSchema,
  sortSchema,
  exportFormatSchema,
  fieldSelectionSchema,
  dateRangeSchema,
  createSearchSchema,
  createFilterSchema,
  createOperationDescription,
} from "./base.schema";

/**
 * Build status
 */
export const buildStatusSchema = z.enum([
  "pending",
  "completed",
  "all"
], {
  description: "Build status filter"
});

/**
 * Build search fields
 */
const BUILD_SEARCH_FIELDS = ["Build.PartCode", "Build.Memo"];

/**
 * Main build operations schema
 */
export const buildOperationSchema = z.discriminatedUnion("operation", [
  // List builds
  z.object({
    operation: z.literal("list").describe("List manufacturing builds"),
    ...paginationSchema.shape,
    ...sortSchema.shape,
    ...fieldSelectionSchema.shape,
    ...dateRangeSchema.shape,
    productCode: z.string().optional()
      .describe("Filter by product code"),
    status: buildStatusSchema.default("all")
      .describe("Filter by build status"),
    location: z.string().optional()
      .describe("Filter by location/warehouse"),
  }),

  // Get single build
  z.object({
    operation: z.literal("get").describe("Get a build by sequence number"),
    sequenceNumber: z.number()
      .describe("Build sequence number"),
    includeComponents: z.boolean().default(true)
      .describe("Include component details"),
    ...fieldSelectionSchema.shape,
  }),

  // Search builds
  z.object({
    operation: z.literal("search").describe("Search builds"),
    ...createSearchSchema(BUILD_SEARCH_FIELDS).shape,
    ...paginationSchema.shape,
    ...sortSchema.shape,
    ...fieldSelectionSchema.shape,
    ...dateRangeSchema.shape,
    status: buildStatusSchema.default("all"),
  }),

  // Count builds
  z.object({
    operation: z.literal("count").describe("Count builds"),
    ...dateRangeSchema.shape,
    productCode: z.string().optional(),
    status: buildStatusSchema.default("all"),
    location: z.string().optional(),
    filter: createFilterSchema(),
  }),

  // Get bill of materials
  z.object({
    operation: z.literal("bom").describe("Get bill of materials for a product"),
    productCode: z.string()
      .describe("Product code to get BOM for"),
    quantity: z.number().positive().default(1)
      .describe("Quantity to calculate for (default: 1)"),
    includeSubAssemblies: z.boolean().default(true)
      .describe("Expand sub-assemblies"),
    showCosts: z.boolean().default(true)
      .describe("Include cost information"),
  }),

  // Production summary
  z.object({
    operation: z.literal("summary").describe("Get production summary"),
    ...dateRangeSchema.shape,
    groupBy: z.enum(["product", "location", "month", "week"])
      .default("product")
      .describe("Group summary by"),
    includeVariance: z.boolean().default(true)
      .describe("Include cost variance analysis"),
  }),

  // Export builds
  z.object({
    operation: z.literal("export").describe("Export build data"),
    format: exportFormatSchema,
    ...dateRangeSchema.shape,
    productCode: z.string().optional(),
    status: buildStatusSchema.default("all"),
    ...fieldSelectionSchema.shape,
    filename: z.string().optional(),
  }),

  // Component usage
  z.object({
    operation: z.literal("usage").describe("Get component usage analysis"),
    componentCode: z.string()
      .describe("Component/part code to analyze"),
    ...dateRangeSchema.shape,
    includeOnHand: z.boolean().default(true)
      .describe("Include current stock levels"),
    includePending: z.boolean().default(true)
      .describe("Include pending builds"),
  }),

  // Cost variance analysis
  z.object({
    operation: z.literal("variance").describe("Analyze cost variances"),
    ...dateRangeSchema.shape,
    productCode: z.string().optional(),
    minVariance: z.number().default(0)
      .describe("Minimum variance amount to include"),
    varianceType: z.enum(["amount", "percentage"]).default("amount"),
    ...paginationSchema.shape,
  }),
]).describe(createOperationDescription("Build/Manufacturing", {
  list: "{\"operation\": \"list\", \"fromDate\": \"2024-01-01\"}",
  get: "{\"operation\": \"get\", \"sequenceNumber\": 5678}",
  bom: "{\"operation\": \"bom\", \"productCode\": \"WIDGET-001\"}",
  summary: "{\"operation\": \"summary\", \"groupBy\": \"product\"}",
  variance: "{\"operation\": \"variance\", \"minVariance\": 100}",
}));

/**
 * Simplified schemas
 */
export const getBuildSchema = z.object({
  sequenceNumber: z.number().describe("Build sequence number"),
}).describe("Get a build by sequence number");

export const listBuildsSchema = z.object({
  productCode: z.string().optional()
    .describe("Filter by product code"),
  fromDate: z.string().optional()
    .describe("Start date (YYYY-MM-DD)"),
  toDate: z.string().optional()
    .describe("End date (YYYY-MM-DD)"),
  completedOnly: z.boolean().default(false),
  limit: z.number().min(1).max(1000).default(100),
}).describe("List builds with optional filters");

export const getBillOfMaterialsSchema = z.object({
  productCode: z.string()
    .describe("Product code. Example: 'WIDGET-001'"),
  quantity: z.number().positive().default(1),
}).describe("Get bill of materials for a product");

/**
 * Build record schema
 */
export const buildRecordSchema = z.object({
  sequenceNumber: z.number(),
  productSeq: z.number(),
  productCode: z.string(),
  productName: z.string().optional(),
  quantity: z.number(),
  buildDate: z.string(),
  status: z.string(),
  location: z.string().optional(),
  standardCost: z.number().optional(),
  actualCost: z.number().optional(),
  variance: z.number().optional(),
  memo: z.string().optional(),
});

/**
 * BOM component schema
 */
export const bomComponentSchema: z.ZodType<any> = z.object({
  partCode: z.string(),
  partName: z.string().optional(),
  quantity: z.number(),
  unitCost: z.number().optional(),
  totalCost: z.number().optional(),
  onHand: z.number().optional(),
  available: z.number().optional(),
  isSubAssembly: z.boolean().optional(),
  components: z.array(z.lazy(() => bomComponentSchema)).optional(),
});

/**
 * Production summary schema
 */
export const productionSummarySchema = z.object({
  group: z.string(),
  description: z.string().optional(),
  buildCount: z.number(),
  totalQuantity: z.number(),
  totalStandardCost: z.number(),
  totalActualCost: z.number(),
  totalVariance: z.number(),
  variancePercent: z.number(),
});

/**
 * Component usage schema
 */
export const componentUsageSchema = z.object({
  productCode: z.string(),
  productName: z.string(),
  quantityPerBuild: z.number(),
  buildsUsingComponent: z.number(),
  totalUsed: z.number(),
  lastUsedDate: z.string().optional(),
});

/**
 * Response schemas
 */
export const buildListResponseSchema = z.object({
  success: z.literal(true),
  builds: z.array(buildRecordSchema),
  count: z.number(),
  totalCount: z.number().optional(),
  hasMore: z.boolean(),
});

export const buildSingleResponseSchema = z.object({
  success: z.literal(true),
  build: buildRecordSchema,
  components: z.array(bomComponentSchema).optional(),
});

export const bomResponseSchema = z.object({
  success: z.literal(true),
  productCode: z.string(),
  quantity: z.number(),
  components: z.array(bomComponentSchema),
  totals: z.object({
    componentCount: z.number(),
    totalCost: z.number(),
    costPerUnit: z.number(),
  }),
  availability: z.object({
    canBuild: z.number(),
    limitingComponent: z.string().optional(),
  }).optional(),
});

export const productionSummaryResponseSchema = z.object({
  success: z.literal(true),
  summary: z.array(productionSummarySchema),
  count: z.number(),
  totals: z.object({
    builds: z.number(),
    quantity: z.number(),
    standardCost: z.number(),
    actualCost: z.number(),
    variance: z.number(),
  }),
  period: z.object({
    from: z.string(),
    to: z.string(),
  }),
});

/**
 * Example operations
 */
export const BUILD_OPERATION_EXAMPLES = {
  // Basic operations
  listRecent: {
    operation: "list",
    description: "List recent builds",
    example: { operation: "list", limit: 20 },
  },
  getBuild: {
    operation: "get",
    description: "Get specific build",
    example: { operation: "get", sequenceNumber: 5678 },
  },
  
  // Product operations
  productBuilds: {
    operation: "list",
    description: "List builds for a product",
    example: { operation: "list", productCode: "WIDGET-001" },
  },
  billOfMaterials: {
    operation: "bom",
    description: "Get bill of materials",
    example: { operation: "bom", productCode: "WIDGET-001", quantity: 10 },
  },
  
  // Analysis operations
  productionSummary: {
    operation: "summary",
    description: "Monthly production summary",
    example: { 
      operation: "summary", 
      groupBy: "month",
      fromDate: "2024-01-01",
      toDate: "2024-12-31"
    },
  },
  costVariance: {
    operation: "variance",
    description: "Find builds with cost variance",
    example: { operation: "variance", minVariance: 100, varianceType: "amount" },
  },
  
  // Component analysis
  componentUsage: {
    operation: "usage",
    description: "Analyze component usage",
    example: { operation: "usage", componentCode: "PART-123" },
  },
};