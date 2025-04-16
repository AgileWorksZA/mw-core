import { z } from "zod";

export const inventoryZod = z.object({
  SequenceNumber: z.number(),
  LastModifiedTime: z.string(),
  Identifier: z.string(),
  Location: z.string().nullable().optional(),
  ProductSeq: z.number(),
  Qty: z.number(),
  Expiry: z.string().nullable().optional(),
});

export type InventoryZod = z.infer<typeof inventoryZod>;

export const inventoryPartialSchema = inventoryZod.partial();

export type InventoryPartialZod = z.infer<typeof inventoryPartialSchema>;
