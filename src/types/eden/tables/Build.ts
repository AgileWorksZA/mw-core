import { t } from "elysia";

export const BuildOne = t.Object(
  {
    SequenceNumber: t.Number(),
    LastModifiedTime: t.String(),
    ProductSeq: t.Number(),
    Order: t.Nullable(t.Number()),
    Qty: t.Number(),
    PartCode: t.String(),
    Flags: t.Nullable(t.Number()),
    Memo: t.Nullable(t.String()),
  },
  { additionalProperties: true },
);
