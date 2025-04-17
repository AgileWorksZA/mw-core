import { z } from "zod";

export const departmentZod = z.object({
  SequenceNumber: z.number(),
  LastModifiedTime: z.string(),
  Code: z.string(),
  Description: z.string(),
  Classification: z.string(),
  Custom1: z.string(),
  Custom2: z.string(),
  Flags: z.number(),
  UserNum: z.number(),
  UserText: z.string(),
  TaggedText: z.string(),
});

export type DepartmentZod = z.infer<typeof departmentZod>;
