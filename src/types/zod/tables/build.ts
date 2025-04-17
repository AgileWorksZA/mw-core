import { z } from "zod";

export const buildZod = z.object({
  SequenceNumber: z.number(),
  LastModifiedTime: z.string(),
  ProductSeq: z.number(),
  Order: z.number(),
  Qty: z.number(),
  PartCode: z.string(),
  Flags: z.number(),
  Memo: z.string(),
});

export type BuildZod = z.infer<typeof buildZod>;
