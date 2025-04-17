import { z } from "zod";

export const generalZod = z.object({
  SequenceNumber: z.number(),
  LastModifiedTime: z.string(),
  Code: z.string(),
  Description: z.string(),
  Date: z.string(),
  Long: z.number(),
});

export type GeneralZod = z.infer<typeof generalZod>;
