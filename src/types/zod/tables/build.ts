import { z } from "zod";

/**
 * Zod schema for the Build File record.
 * Internal file name: Build
 * Stores the Bill of Materials (BOM) recipes for manufactured products.
 * This table is a subfile of the Product table.
 */
export const buildZod = z.object({
  /** Unsigned long sequence number (indexed). Unique internal identifier for this BOM line item. */
  SequenceNumber: z
    .number()
    .positive()
    .describe(
      "Unsigned long sequence number (indexed). Unique internal identifier for this BOM line item.",
    ),
  /** Last modified timestamp. The date and time that this record was last changed. */
  LastModifiedTime: z
    .string()
    .describe(
      "Last modified timestamp. The date and time that this record was last changed.",
    ),
  /** The sequence number of the parent Product record to which this recipe line belongs. */
  ProductSeq: z
    .number()
    .positive()
    .describe(
      "The sequence number of the parent Product record (Product.SequenceNumber) to which this recipe line belongs.",
    ),
  /** The order/position of this component within the Bill of Materials for the parent product. */
  Order: z // Assuming 'Order' refers to the sequence within the BOM, not a purchase/sales order number
    .number()
    .describe(
      "The order/position of this component within the Bill of Materials for the parent product.",
    ),
  /** Quantity of the component required to build ONE unit of the parent product. */
  Qty: z
    .number()
    .describe(
      "Quantity of the component required to build ONE unit of the parent product.",
    ),
  /** Code of the component product/item used in the build. Must be an existing Product code. */
  PartCode: z
    .string()
    .max(31) // Max length of a Product code
    .describe(
      "Code of the component product/item used in the build. Must be an existing Product code.",
    ),
  /** Flags associated with the build component line (usage not explicitly documented). */
  Flags: z
    .number()
    .describe(
      "Flags associated with the build component line (usage not explicitly documented).",
    ),
  /** Memo or instruction for this component line. Max 255 chars. */
  Memo: z
    .string()
    .max(255)
    .nullable()
    .optional()
    .describe(
      "Memo or instruction for this component line, up to 255 characters.",
    ),
});

/**
 * Inferred TypeScript type from the buildZod schema.
 * Represents a fully validated Build (Bill of Materials line) record.
 */
export type BuildZod = z.infer<typeof buildZod>;

// Partial schema (useful perhaps if updating memos?)
export const buildPartialSchema = buildZod.partial();

/**
 * Inferred TypeScript type from the buildPartialSchema.
 * Represents a Build record where all fields are optional.
 */
export type BuildPartialZod = z.infer<typeof buildPartialSchema>;
