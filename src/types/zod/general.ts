import { z } from "zod";

export const generalZod = z.object({
  SequenceNumber: z.number(),
  LastModifiedTime: z.date(),
  Code: z.string(),
  Description: z.string(),
  Date: z.date(),
  Long: z.number(),
});

export type GeneralZod = z.infer<typeof generalZod>;