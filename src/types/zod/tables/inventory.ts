import { z } from "zod";

// --- Inventory Enums ---
// No specific enums identified for the Inventory table itself based on the documentation.

// --- Inventory Schema ---

/**
 * Zod schema for the Inventory record.
 * Internal file name: Inventory
 * Represents the stock on hand for a specific Product identified by its serial number,
 * batch number, and/or location. This is a subfile of the Product table.
 */
export const inventoryZod = z.object({
  /** Unsigned long sequence number (indexed). Unique internal identifier for this specific inventory record (unique combination of product, serial/batch, location). */
  SequenceNumber: z
    .number()
    .positive()
    .describe(
      "Unsigned long sequence number (indexed). Unique internal identifier for this specific inventory record.",
    ),
  /** Last modified timestamp. The date and time that this record was last changed (e.g., when quantity changed). */
  LastModifiedTime: z
    .string()
    .describe(
      "Last modified timestamp. The date and time that this record was last changed.",
    ),
  /** The serial number or batch number identifier for the item. Max 31 chars. */
  Identifier: z
    .string()
    .max(31) // Matches Product.StockCode max size, which is often used for serial/batch ID length
    .describe(
      "The serial number or batch number identifier for the item. Max 31 chars.",
    ),
  /** The stock location code where this item/batch is stored. Blank means default location. Max 15 chars. */
  Location: z
    .string()
    .max(15) // Max length for location codes
    .nullable()
    .optional()
    .describe(
      "The stock location code where this item/batch is stored. Blank means default location. Max 15 chars.",
    ),
  /** The sequence number of the parent Product record this inventory belongs to. */
  ProductSeq: z
    .number()
    .positive()
    .describe(
      "The sequence number of the parent Product record (Product.SequenceNumber) this inventory belongs to.",
    ),
  /** The quantity (stock on hand) for this specific serial/batch at this specific location. */
  Qty: z
    .number()
    .describe(
      "The quantity (stock on hand) for this specific serial/batch at this specific location.",
    ),
  /** The expiry date for items tracked by batch with expiry dates. Should be specified in YYYY-MM-DD format. */
  Expiry: z
    .string()
    .nullable()
    .optional()
    .describe(
      "The expiry date for items tracked by batch with expiry dates. Should be specified in YYYY-MM-DD format.",
    ),
  // Note: The Appendix A documentation for Inventory (page 757) only lists the fields above.
  // If other fields like StockTakeNewQty/StockTakeStartQty are needed for specific contexts,
  // they might be accessed via functions or calculated fields on the parent Product record
  // (e.g., p.StocktakeNewQtyForLocation(location)) rather than being directly stored here.
});

/**
 * Inferred TypeScript type from the inventoryZod schema.
 * Represents a fully validated Inventory record for a specific serial/batch/location.
 */
export type InventoryZod = z.infer<typeof inventoryZod>;

// Partial schema for potential updates (e.g., updating Qty via stocktake or transfer)
export const inventoryPartialSchema = inventoryZod.partial();

/**
 * Inferred TypeScript type from the inventoryPartialSchema.
 * Represents an Inventory record where all fields are optional.
 */
export type InventoryPartialZod = z.infer<typeof inventoryPartialSchema>;
