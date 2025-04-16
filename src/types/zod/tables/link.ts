import { z } from "zod";

export const linkZod = z.object({
  SequenceNumber: z.number(),
  LastModifiedTime: z.string(),
  Dept: z.string(),
  Group: z.string(),
});

export type LinkZod = z.infer<typeof linkZod>;