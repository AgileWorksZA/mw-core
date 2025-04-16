import { z } from "zod";

export const loginZod = z.object({
  SequenceNumber: z.number(),
  LastModifiedTime: z.string(),
  Initials: z.string(),
  Name: z.string(),
  Password: z.string(),
  SecurityLevel: z.number(),
  Privileges: z.string(),
  Email: z.string(),
  Flags: z.number(),
  Category: z.string(),
  Role: z.string(),
  UserNum: z.number(),
  UserText: z.string(),
  TaggedText: z.string(),
  SettingsDonor: z.string(),
});

export type LoginZod = z.infer<typeof loginZod>;