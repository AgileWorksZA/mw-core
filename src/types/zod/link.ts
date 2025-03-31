import { z } from "zod";

export const linkZod = z.object({
  SequenceNumber: z.number(),
  LastModifiedTime: z.date(),
  Dept: z.string(),
  Group: z.string(),
});

export type LinkZod = z.infer<typeof linkZod>;