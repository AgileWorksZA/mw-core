import { z } from "zod";

export const assetLogZod = z.object({
  SequenceNumber: z.number(),
  LastModifiedTime: z.string(),
  ParentSeq: z.number(),
  Action: z.string(),
  Date: z.string(),
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

export type AssetLogZod = z.infer<typeof assetLogZod>;

export const assetLogPartialSchema = assetLogZod.partial();

export type AssetLogPartialZod = z.infer<typeof assetLogPartialSchema>;
