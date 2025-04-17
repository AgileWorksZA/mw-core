import { z } from "zod";

// --- Job Enums ---

/**
 * Defines the status of a job/project. Indexed.
 * QU: Quoted - Quote or tender issued but not yet accepted/declined. Default for new jobs.
 * OP: Active - Job is in progress. Charges and time can be recorded. Automatically set when activity occurs on a quoted job.
 * CO: Complete - Job is finished, usually after a final invoice. Further entries might be restricted based on user privileges.
 */
export const JobStatusEnum = z
  .enum(["QU", "OP", "CO"])
  .describe(`Defines the status of a job/project. Indexed.
  QU: Quoted - Quote or tender issued but not yet accepted/declined. Default for new jobs.
  OP: Active - Job is in progress. Charges and time can be recorded. Automatically set when activity occurs on a quoted job.
  CO: Complete - Job is finished, usually after a final invoice. Further entries might be restricted based on user privileges.`);

// --- Job Schema ---

/**
 * Zod schema for the Job record.
 * Internal file name: Job
 * Stores summary details and settings for jobs or projects being tracked.
 */
export const jobZod = z.object({
  /** Unsigned long sequence number (indexed). Unique internal identifier for this job record. */
  SequenceNumber: z
    .number()
    .positive()
    .describe(
      "Unsigned long sequence number (indexed). Unique internal identifier for this job record.",
    ),
  /** Last modified timestamp. The date and time that this record was last changed. */
  LastModifiedTime: z
    .string()
    .describe(
      "Last modified timestamp. The date and time that this record was last changed.",
    ),
  /** The unique code identifying the job. Max 9 chars. */
  Code: z
    .string()
    .max(9)
    .describe("The unique code identifying the job. Max 9 chars."),
  /** The job name or a brief summary description. Max 255 chars. */
  Description: z
    .string()
    .max(255)
    .describe("The job name or a brief summary description. Max 255 chars."),
  /** The code of the client (customer) for whom the job is being done. Must be a valid Debtor code. Max 11 chars. */
  Client: z
    .string()
    .max(11)
    .describe(
      "The code of the client (customer) for whom the job is being done. Must be a valid Debtor code. Max 11 chars.",
    ),
  /** General comments about the job. Max 1020 chars. */
  Comment: z
    .string()
    .max(1020)
    .nullable()
    .optional()
    .describe("General comments about the job. Max 1020 chars."),
  /** The date on which the job started. Defaults to today's date on creation. Should be specified in YYYY-MM-DD format. */
  StartDate: z
    .string()
    .describe(
      "The date on which the job started. Defaults to today's date on creation. Should be specified in YYYY-MM-DD format.",
    ),
  /** The percentage markup applied to cost-plus items used on the job. */
  Markup: z
    .number()
    .describe(
      "The percentage markup applied to cost-plus items used on the job.",
    ),
  /** The amount quoted for the job (if billing method is 'Quote'). */
  Quote: z
    .number()
    .describe("The amount quoted for the job (if billing method is 'Quote')."),
  /** The total amount billed to date for the job (system maintained). */
  Billed: z
    .number()
    .describe(
      "The total amount billed to date for the job (system maintained).",
    ),
  /** The status of the job (Quoted, Active, or Complete). Indexed. */
  Status: JobStatusEnum.describe(
    "The status of the job (Quoted, Active, or Complete). Indexed.",
  ),
  /** Bitmapped flags field (usage not explicitly detailed in appendix). */
  Flags: z
    .number()
    .describe(
      "Bitmapped flags field (usage not explicitly detailed in appendix).",
    ),
  /** Display color for the job record (0-7 index). */
  Colour: z
    .number()
    .min(0)
    .max(7)
    .nullable()
    .optional()
    .describe("Display color for the job record (0-7 index)."),
  /** Work-in-Progress general ledger account code for this job. Max 13 chars. */
  WIPAccount: z
    .string()
    .max(13)
    .describe(
      "Work-in-Progress general ledger account code for this job. Max 13 chars.",
    ),
  /** User-defined category 1 for analysis. Max 15 chars. */
  Category1: z
    .string()
    .max(15)
    .nullable()
    .optional()
    .describe("User-defined category 1 for analysis. Max 15 chars."),
  /** User-defined category 2 for analysis. Max 15 chars. */
  Category2: z
    .string()
    .max(15)
    .nullable()
    .optional()
    .describe("User-defined category 2 for analysis. Max 15 chars."),
  /** User-defined category 3 for analysis. Max 15 chars. */
  Category3: z
    .string()
    .max(15)
    .nullable()
    .optional()
    .describe("User-defined category 3 for analysis. Max 15 chars."),
  /** User-defined category 4 for analysis. Max 15 chars. */
  Category4: z
    .string()
    .max(15)
    .nullable()
    .optional()
    .describe("User-defined category 4 for analysis. Max 15 chars."),
  /** The client's order number for the job. Max 31 chars. */
  OrderNum: z
    .string()
    .max(31)
    .nullable()
    .optional()
    .describe("The client's order number for the job. Max 31 chars."),
  /** The contact person at the client's organization for this job. Max 63 chars. */
  Contact: z
    .string()
    .max(63)
    .nullable()
    .optional()
    .describe(
      "The contact person at the client's organization for this job. Max 63 chars.",
    ),
  /** The phone number of the contact person. Max 19 chars. */
  Phone: z
    .string()
    .max(19)
    .nullable()
    .optional()
    .describe("The phone number of the contact person. Max 19 chars."),
  /** The expected end date of the job. Should be specified in YYYY-MM-DD format. */
  EndDate: z
    .string()
    .nullable()
    .optional()
    .describe(
      "The expected end date of the job. Should be specified in YYYY-MM-DD format.",
    ),
  /** Initials (up to 3 chars) of the internal manager responsible for the job. */
  Manager: z
    .string()
    .max(3)
    .nullable()
    .optional()
    .describe(
      "Initials (up to 3 chars) of the internal manager responsible for the job.",
    ),
  /** User-estimated percentage of job completion (informational). */
  PercentComplete: z
    .number()
    .min(0)
    .max(100)
    .nullable()
    .optional()
    .describe("User-estimated percentage of job completion (informational)."),
  /** Value of approved variations to the original quote/budget (not explicitly documented, presumed numeric). */
  Variations: z
    .number()
    .nullable()
    .optional()
    .describe(
      "Value of approved variations to the original quote/budget (not explicitly documented, presumed numeric).",
    ),
  /** Amount of retention currently held by the client (not explicitly documented, presumed numeric). */
  RetentionsHeld: z
    .number()
    .nullable()
    .optional()
    .describe(
      "Amount of retention currently held by the client (not explicitly documented, presumed numeric).",
    ),
  /** Amount of retention currently owing to subcontractors (not explicitly documented, presumed numeric). */
  RetentionsOwing: z
    .number()
    .nullable()
    .optional()
    .describe(
      "Amount of retention currently owing to subcontractors (not explicitly documented, presumed numeric).",
    ),
  /** Default product pricing level (A-F) for this job (not explicitly documented, presumed string). Max 1 char. */
  ProductPricing: z
    .string()
    .max(1)
    .nullable()
    .optional()
    .describe(
      "Default product pricing level (A-F) for this job (not explicitly documented, presumed string). Max 1 char.",
    ),
  /** Retention percentage applied to invoices for this job (not explicitly documented, presumed numeric). */
  RetainPercent: z
    .number()
    .nullable()
    .optional()
    .describe(
      "Retention percentage applied to invoices for this job (not explicitly documented, presumed numeric).",
    ),
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
  /** Job code of the parent project if this job is part of a larger project. Max 9 chars. */
  Project: z
    .string()
    .max(9)
    .nullable()
    .optional()
    .describe(
      "Job code of the parent project if this job is part of a larger project. Max 9 chars.",
    ),
  /** Required end date (deadline) for the job. Should be specified in YYYY-MM-DD format. */
  TargetDate: z
    .string()
    .nullable()
    .optional()
    .describe(
      "Required end date (deadline) for the job. Should be specified in YYYY-MM-DD format.",
    ),
  /** Custom field 1. Max 255 chars. */
  Custom1: z
    .string()
    .max(255)
    .nullable()
    .optional()
    .describe("Custom field 1. Max 255 chars."),
  /** Custom field 2. Max 255 chars. */
  Custom2: z
    .string()
    .max(255)
    .nullable()
    .optional()
    .describe("Custom field 2. Max 255 chars."),
  /** Custom field 3. Max 15 chars. */
  Custom3: z
    .string()
    .max(15)
    .nullable()
    .optional()
    .describe("Custom field 3. Max 15 chars."),
  /** Custom field 4. Max 15 chars. */
  Custom4: z
    .string()
    .max(15)
    .nullable()
    .optional()
    .describe("Custom field 4. Max 15 chars."),
  /** Scriptable tag storage for key-value pairs. Max 255 chars. */
  TaggedText: z
    .string()
    .max(255)
    .nullable()
    .optional()
    .describe("Scriptable tag storage for key-value pairs. Max 255 chars."),
  /** Custom field 5. Max 15 chars. */
  Custom5: z
    .string()
    .max(15)
    .nullable()
    .optional()
    .describe("Custom field 5. Max 15 chars."),
  /** Custom field 6. Max 15 chars. */
  Custom6: z
    .string()
    .max(15)
    .nullable()
    .optional()
    .describe("Custom field 6. Max 15 chars."),
  /** Custom field 7. Max 15 chars. */
  Custom7: z
    .string()
    .max(15)
    .nullable()
    .optional()
    .describe("Custom field 7. Max 15 chars."),
  /** Custom field 8. Max 15 chars. */
  Custom8: z
    .string()
    .max(15)
    .nullable()
    .optional()
    .describe("Custom field 8. Max 15 chars."),
});

/**
 * Inferred TypeScript type from the jobZod schema.
 * Represents a fully validated Job record.
 */
export type JobZod = z.infer<typeof jobZod>;

// Partial schema for updates
export const jobPartialSchema = jobZod.partial();

/**
 * Inferred TypeScript type from the jobPartialSchema.
 * Represents a Job record where all fields are optional.
 */
export type JobPartialZod = z.infer<typeof jobPartialSchema>;
