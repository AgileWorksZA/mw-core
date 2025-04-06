import { z } from "zod";

export const bankRecsZod = z.object({
  SequenceNumber: z.number(),
  LastModifiedTime: z.string(),
  Account: z.string(),
  Opening: z.number(),
  Closing: z.number(),
  Statement: z.number(),
  Date: z.string(),
  ReconciledTime: z.string(),
  Discrepancy: z.number(),
});

export type BankRecsZod = z.infer<typeof bankRecsZod>;
