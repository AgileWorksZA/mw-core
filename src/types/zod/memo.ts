import { z } from "zod";

export const memoZod = z.object({
  SequenceNumber: z.number(),
  LastModifiedTime: z.date(),
  NameSeq: z.number(),
  Order: z.number(),
  Date: z.date(),
  RecallDate: z.date(),
  Flags: z.number(),
  Text: z.string(),
});

export type MemoZod = z.infer<typeof memoZod>;