import { z } from "zod";

export const autoSplitZod = z.object({
  SequenceNumber: z.number(),
  LastModifiedTime: z.string(),
  MatchFunction: z.string(),
  SplitMode: z.number(),
  SplitAcct1: z.string(),
  SplitAcct2: z.string(),
  SplitAmount1: z.number(),
  SplitAmount2: z.number(),
  SplitAcct3: z.string(),
  SplitAcct4: z.string(),
  SplitAmount3: z.number(),
  MatchName: z.string(),
  Priority: z.number(),
});

export type AutoSplitZod = z.infer<typeof autoSplitZod>;
