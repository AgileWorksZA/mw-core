import { z } from "zod";

// --- Job Sheet Enums ---

/**
 * Defines the status of a Job Sheet item. Indexed.
 * PE: Pending - Item has been recorded but not yet invoiced/billed to the client.
 * PR: Processed - Item has been included in an invoice to the client.
 * BU: Budget - Represents a budgeted item or resource for the job, not an actual cost/time entry.
 */
export const JobSheetStatusEnum = z.enum(["PE", "PR", "BU"])
  .describe(`Defines the status of a Job Sheet item. Indexed.
  PE: Pending - Item has been recorded but not yet invoiced/billed to the client.
  PR: Processed - Item has been included in an invoice to the client.
  BU: Budget - Represents a budgeted item or resource for the job, not an actual cost/time entry.`);

/**
 * Defines the type of a Job Sheet item, indicating if it represents income or expense related to the job.
 * IN: Income - Represents revenue or billed amounts associated with the job.
 * EX: Expense - Represents costs, time, or materials used on the job.
 */
export const JobSheetTypeEnum = z.enum(["IN", "EX"])
  .describe(`Defines the type of a Job Sheet item, indicating if it represents income or expense related to the job.
  IN: Income - Represents revenue or billed amounts associated with the job.
  EX: Expense - Represents costs, time, or materials used on the job.`);

// --- Job Sheet Schema ---

/**
 * Zod schema for the Job Sheet Item record.
 * Internal file name: JobSheet
 * Records individual time, disbursements, stock requisitions, or budget items against a specific job.
 */
export const jobSheetZod = z.object({
  /** Unsigned long sequence number (indexed). Unique internal identifier for this job sheet item. */
  SequenceNumber: z
    .number()
    .positive()
    .describe("Unsigned long sequence number (indexed). Unique internal identifier for this job sheet item."),
  /** Last modified timestamp. The date and time that this record was last changed. */
  LastModifiedTime: z
    .string()
    .describe("Last modified timestamp. The date and time that this record was last changed."),
  /** The job code this item belongs to. Must be an existing Job code. Indexed. Max 9 chars. */
  Job: z
    .string()
    .max(9)
    .describe("The job code this item belongs to. Must be an existing Job code. Indexed. Max 9 chars."),
  /** The quantity of the resource or product used/budgeted. */
  Qty: z.number().describe("The quantity of the resource or product used/budgeted."),
  /** The code for the product or resource used/budgeted. Must be an existing Product code. Indexed. Max 19 chars. */
  Resource: z
    .string()
    .max(31) // Max length for Product Code
    .describe("The code for the product or resource used/budgeted. Must be an existing Product code. Indexed. Max 31 chars."),
  /** The date the resource was used or the budget item applies to. Should be specified in YYYY-MM-DD format. */
  Date: z
    .string()
    .describe("The date the resource was used or the budget item applies to. Should be specified in YYYY-MM-DD format."),
  /** The cost centre (Department code) associated with this item. Must be a valid Department code. Max 5 chars. */
  CostCentre: z
    .string()
    .max(5)
    .nullable()
    .optional()
    .describe("The cost centre (Department code) associated with this item. Must be a valid Department code. Max 5 chars."),
  /** The general ledger expense or income account code for the resource/item. Indexed. Max 13 chars. */
  Account: z
    .string()
    .max(13) // Account code + potential department
    .describe("The general ledger expense or income account code for the resource/item. Indexed. Max 13 chars."),
  /** The accounting period this item falls into, determined by the Date field. */
  Period: z
    .number()
    .describe("The accounting period this item falls into, determined by the Date field."),
  /** The units of the resource or product (e.g., Hr, Kg, Km). Max 3 chars. */
  Units: z
    .string()
    .max(3)
    .nullable()
    .optional()
    .describe("The units of the resource or product (e.g., Hr, Kg, Km). Max 3 chars."),
  /** The cost price of the product or resource used (excluding tax). */
  CostPrice: z
    .number()
    .describe("The cost price of the product or resource used (excluding tax)."),
  /** The anticipated charged value (sell price) of the product or resource used (excluding tax). */
  SellPrice: z
    .number()
    .describe("The anticipated charged value (sell price) of the product or resource used (excluding tax)."),
  /** A description or memo for the job sheet item. Max 255 chars. */
  Memo: z
    .string()
    .max(255)
    .nullable()
    .optional()
    .describe("A description or memo for the job sheet item. Max 255 chars."),
  /** The sequence number of the invoice on which this item was billed out (0 if unbilled). */
  DestTransSeq: z
    .number()
    .positive()
    .nullable()
    .optional()
    .describe("The sequence number of the invoice on which this item was billed out (0 if unbilled)."),
  /** The sequence number of the originating transaction if entered via transaction tagging (0 if entered directly). */
  SourceTransSeq: z
    .number()
    .positive()
    .nullable()
    .optional()
    .describe("The sequence number of the originating transaction if entered via transaction tagging (0 if entered directly)."),
  /** The date the job sheet item was entered. Should be specified in YYYY-MM-DD format. */
  DateEntered: z
    .string()
    .describe("The date the job sheet item was entered. Should be specified in YYYY-MM-DD format."),
  /** Bitmapped flags field. Flag 1 = Time, Flag 2 = Material. */
  Flags: z
    .number()
    .describe("Bitmapped flags field. Flag 1 = Time, Flag 2 = Material."),
  /** Display color for the job sheet record (0-7 index). */
  Colour: z
    .number()
    .min(0).max(7)
    .nullable()
    .optional()
    .describe("Display color for the job sheet record (0-7 index)."),
  /** The status of the job sheet item (Pending, Processed, or Budget). Indexed. */
  Status: JobSheetStatusEnum.describe("The status of the job sheet item (Pending, Processed, or Budget). Indexed."),
  /** The type of the job sheet item (Income or Expense). */
  Type: JobSheetTypeEnum.describe("The type of the job sheet item (Income or Expense)."),
  /** The analysis code associated with the item. Max 9 chars. */
  Analysis: z
    .string()
    .max(9)
    .nullable()
    .optional()
    .describe("The analysis code associated with the item. Max 9 chars."),
  /** The actual value billed for this item on an invoice (may differ from SellPrice). */
  BillValue: z
    .number()
    .nullable()
    .optional()
    .describe("The actual value billed for this item on an invoice (may differ from SellPrice)."),
  /** A free-form activity code. Max 9 chars. */
  ActivityCode: z
    .string()
    .max(9)
    .nullable()
    .optional()
    .describe("A free-form activity code. Max 9 chars."),
  /** General comments on the entry. Max 255 chars. */
  Comments: z
    .string()
    .max(255)
    .nullable()
    .optional()
    .describe("General comments on the entry. Max 255 chars."),
  /** For items entered via Timesheet, the sequence number of the first item in the batch. */
  Batch: z
    .number()
    .positive()
    .nullable()
    .optional()
    .describe("For items entered via Timesheet, the sequence number of the first item in the batch."),
  /** User initials who entered the job sheet record. Max 3 chars. */
  EnteredBy: z
    .string()
    .max(3)
    .describe("User initials who entered the job sheet record. Max 3 chars."),
  /** Serial or batch number for inventoried items. Max 31 chars. */
  SerialNumber: z
    .string()
    .max(31)
    .nullable()
    .optional()
    .describe("Serial or batch number for inventoried items. Max 31 chars."),
  /** Stock location for inventoried items. Max 15 chars. */
  StockLocation: z
    .string()
    .max(15)
    .nullable()
    .optional()
    .describe("Stock location for inventoried items. Max 15 chars."),
  /** User-defined numeric field (scriptable). */
  UserNum: z
    .number()
    .nullable()
    .optional()
    .describe("User-defined numeric field (scriptable)."),
  /** User-defined text field (scriptable). Max 255 chars. */
  UserText: z
    .string()
    .max(255)
    .nullable()
    .optional()
    .describe("User-defined text field (scriptable). Max 255 chars."),
  /** Scriptable tag storage for key-value pairs. Max 255 chars. */
  TaggedText: z
    .string()
    .max(255)
    .nullable()
    .optional()
    .describe("Scriptable tag storage for key-value pairs. Max 255 chars."),
  /** Timestamp for when the job sheet item was processed (billed). */
  TimeProcessed: z
    .string()
    .nullable()
    .optional()
    .describe("Timestamp for when the job sheet item was processed (billed)."),
});

/**
 * Inferred TypeScript type from the jobSheetZod schema.
 * Represents a fully validated Job Sheet Item record.
 */
export type JobSheetZod = z.infer<typeof jobSheetZod>;

// Partial schema for updates (less common, as most are system-generated or single-entry)
export const jobSheetPartialSchema = jobSheetZod.partial();

/**
 * Inferred TypeScript type from the jobSheetPartialSchema.
 * Represents a Job Sheet Item record where all fields are optional.
 */
export type JobSheetPartialZod = z.infer<typeof jobSheetPartialSchema>;