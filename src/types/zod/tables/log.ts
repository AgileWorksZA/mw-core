import { z } from "zod";

export const logZod = z.object({
  SequenceNumber: z.number(),
  LastModifiedTime: z.string(),
  Description: z.string(),
  Who: z.string(),
  Info1: z.string(),
  Info2: z.string(),
  Info3: z.string(),
});

export type LogZod = z.infer<typeof logZod>;
