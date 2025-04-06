import { z } from "zod";

export const assetSchema = z.object({
  SequenceNumber: z.number(),
  LastModifiedTime: z.string().or(z.string()),
  Code: z.string(),
  Description: z.string(),
  Category: z.string(),
  SerialNum: z.string().nullable().optional(),
  Qty: z.number(),
  ExpectedLife: z.number().nullable().optional(),
  Cost: z.number(),
  AccumDepreciation: z.number(),
  AcquisitionDate: z.string().or(z.string()),
  LastDepreciatedDate: z.string().or(z.string()).nullable().optional(),
  AcquisitionSeq: z.number().nullable().optional(),
  DisposalSeq: z.number().nullable().optional(),
  Location: z.string().nullable().optional(),
  Dept: z.string().nullable().optional(),
  PrivateUsePercent: z.number().nullable().optional(),
  Status: z.string(),
  LastModifiedBy: z.string().nullable().optional(),
  LastRevaluedDate: z.string().or(z.string()).nullable().optional(),
  ExpectedResidualValue: z.number().nullable().optional(),
  RevalSurplusImpairAmt: z.number().nullable().optional(),
  UserNum: z.number().nullable().optional(),
  UserText: z.string().nullable().optional(),
  AccumDepnAdj: z.number().nullable().optional(),
  BookValue: z.number(),
  DisposalDate: z.string().or(z.string()).nullable().optional(),
  GainLossOnDisposal: z.number().nullable().optional(),
  Colour: z.number().nullable().optional(),
  TaggedText: z.string().nullable().optional(),
  Type: z.string(),
  Rate: z.number(),
  Comment: z.string().nullable().optional(),
  Custom1: z.string().nullable().optional(),
  Custom2: z.string().nullable().optional(),
  Custom3: z.string().nullable().optional(),
  Custom4: z.string().nullable().optional(),
});

export type AssetZod = z.infer<typeof assetSchema>;

export const assetPartialSchema = assetSchema.partial();

export type AssetPartialZod = z.infer<typeof assetPartialSchema>;
