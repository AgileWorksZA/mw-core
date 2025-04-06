import { z } from "zod";

export const assetCatSchema = z.object({
  SequenceNumber: z.number(),
  LastModifiedTime: z.string().nullable().optional(),
  Code: z.string(),
  Description: z.string(),
  AssetAccount: z.string(),
  DepExpense: z.string(),
  AccumDep: z.string(),
  GainLoss: z.string(),
  Custom: z.string().nullable().optional(),
  Group: z.string().nullable().optional(),
  Type: z.string(),
  Impairment: z.string().nullable().optional(),
  Rate: z.number(),
  RevalSurplus: z.string().nullable().optional(),
  GainLossPrivate: z.string().nullable().optional(),
  DepExpensePrivate: z.string().nullable().optional(),
  UserNum: z.number().nullable().optional(),
  UserText: z.string().nullable().optional(),
  LastDepreciatedDate: z.string().or(z.date()).nullable().optional(),
  TaggedText: z.string().nullable().optional(),
  Flags: z.number(),
});

export type AssetCatZod = z.infer<typeof assetCatSchema>;

export const assetCatPartialSchema = assetCatSchema.partial();

export type AssetCatPartialZod = z.infer<typeof assetCatPartialSchema>;
