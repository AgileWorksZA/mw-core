import { z } from "zod";

export const stickiesZod = z.object({
  SequenceNumber: z.number(),
  LastModifiedTime: z.date(),
  FileNum: z.number(),
  Colour: z.number(),
  User: z.string(),
  OwnerSeq: z.number(),
  Message: z.string(),
  Flags: z.number(),
});

export type StickiesZod = z.infer<typeof stickiesZod>;