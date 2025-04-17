import { z } from "zod";

export const memoZod = z.object({
  SequenceNumber: z.number(),
  LastModifiedTime: z.string(),
  NameSeq: z.number(),
  Order: z.number(),
  Date: z.string(),
  RecallDate: z.string(),
  Flags: z.number(),
  Text: z.string(),
});

export type MemoZod = z.infer<typeof memoZod>;
