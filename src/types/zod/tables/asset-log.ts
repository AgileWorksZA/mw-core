import { z } from "zod";

export const assetLogSchema = z.object({
  SequenceNumber: z.number(),
  LastModifiedTime: z.string().or(z.date()),
  ParentSeq: z.number(),
  Action: z.string(),
  Date: z.string().or(z.date()),
  Qty: z.number().nullable().optional(),
  Depreciation: z.number().nullable().optional(),
  Adjustment1: z.number().nullable().optional(),
  Adjustment2: z.number().nullable().optional(),
  Rate: z.number().nullable().optional(),
  PrivateUsePercent: z.number().nullable().optional(),
  AccumDepreciation: z.number(),
  AccumReval: z.number().nullable().optional(),
  ClosingValue: z.number(),
  TransactionSeq: z.number().nullable().optional(),
  Memo: z.string().nullable().optional(),
});

export type AssetLogZod = z.infer<typeof assetLogSchema>;

export const assetLogPartialSchema = assetLogSchema.partial();

export type AssetLogPartialZod = z.infer<typeof assetLogPartialSchema>;
