import { z } from "zod";

export const user2Zod = z.object({
  SequenceNumber: z.number(),
  LastModifiedTime: z.string(),
  DevKey: z.number(),
  Key: z.string(),
  Int1: z.number(),
  Int2: z.number(),
  Float1: z.number(),
  Float2: z.number(),
  Date1: z.string(),
  Date2: z.string(),
  Text1: z.string(),
  Text2: z.string(),
  Text: z.string(),
  Int3: z.number(),
  Int4: z.number(),
  Float3: z.number(),
  Float4: z.number(),
  Date3: z.string(),
  Date4: z.string(),
  Text3: z.string(),
  Text4: z.string(),
  TaggedText: z.string(),
  Colour: z.number(),
});

export type User2Zod = z.infer<typeof user2Zod>;