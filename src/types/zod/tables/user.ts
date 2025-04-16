import { z } from "zod";

export const userZod = z.object({
  SequenceNumber: z.number(),
  LastModifiedTime: z.string(),
  Key: z.string(),
  Data: z.string(),
});

export type UserZod = z.infer<typeof userZod>;