import { z } from "zod";

export const filterZod = z.object({
  SequenceNumber: z.number(),
  LastModifiedTime: z.string(),
  File: z.number(),
  TabSet: z.number(),
  Tab: z.number(),
  Type: z.number(),
  User: z.string(),
  Name: z.string(),
  FilterFunction: z.string(),
  Order: z.number(),
});

export type FilterZod = z.infer<typeof filterZod>;
