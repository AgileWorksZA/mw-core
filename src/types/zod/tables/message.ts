import { z } from "zod";

export const messageZod = z.object({
  SequenceNumber: z.number(),
  LastModifiedTime: z.string(),
  StartDate: z.string(),
  EndDate: z.string(),
  NextDate: z.string(),
  Keep: z.boolean(),
  Ref: z.number(),
  LastDay: z.number(),
  NDaily: z.number(),
  NWeekly: z.number(),
  NMonthly: z.number(),
  Once: z.number(),
  XTimes: z.number(),
  Forever: z.number(),
  Day: z.number(),
  Type: z.number(),
  DayOfWeek: z.number(),
  N: z.number(),
  X: z.number(),
  AvoidWeekends: z.number(),
  Reverse: z.number(),
  kill_next_time: z.number(),
  Message: z.string(),
  User: z.string(),
  UserNum: z.number(),
  UserText: z.string(),
  TaggedText: z.string(),
});

export type MessageZod = z.infer<typeof messageZod>;
