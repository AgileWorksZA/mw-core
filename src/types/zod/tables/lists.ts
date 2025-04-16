import { z } from "zod";

export const listsZod = z.object({
  SequenceNumber: z.number(),
  LastModifiedTime: z.string(),
  ListID: z.string(),
  Item: z.string(),
  Comment: z.string(),
  UserNum: z.number(),
  UserText: z.string(),
  TaggedText: z.string(),
});

export type ListsZod = z.infer<typeof listsZod>;