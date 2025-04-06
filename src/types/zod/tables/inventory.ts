import { z } from "zod";

export const inventorySchema = z.object({
  SequenceNumber: z.number(),
  LastModifiedTime: z.string().or(z.date()),
  Identifier: z.string(),
  Location: z.string().nullable().optional(),
  ProductSeq: z.number(),
  Qty: z.number(),
  Expiry: z.string().or(z.date()).nullable().optional(),
});

export type InventoryZod = z.infer<typeof inventorySchema>;

export const inventoryPartialSchema = inventorySchema.partial();

export type InventoryPartialZod = z.infer<typeof inventoryPartialSchema>;
