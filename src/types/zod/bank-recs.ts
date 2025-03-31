import { z } from "zod";

export const bankRecsZod = z.object({
  SequenceNumber: z.number(),
  LastModifiedTime: z.date(),
  Account: z.string(),
  Opening: z.number(),
  Closing: z.number(),
  Statement: z.number(),
  Date: z.date(),
  ReconciledTime: z.date(),
  Discrepancy: z.number(),
});

export type BankRecsZod = z.infer<typeof bankRecsZod>;