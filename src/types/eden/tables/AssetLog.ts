import { t } from "elysia";

export const AssetLogOne = t.Object({
  SequenceNumber: t.Number(),
  LastModifiedTime: t.String(),
  ParentSeq: t.Number(),
  Action: t.String(),
  Date: t.String(),
  Qty: t.Optional(t.Nullable(t.Number())),
  Depreciation: t.Optional(t.Nullable(t.Number())),
  Adjustment1: t.Optional(t.Nullable(t.Number())),
  Adjustment2: t.Optional(t.Nullable(t.Number())),
  Rate: t.Optional(t.Nullable(t.Number())),
  PrivateUsePercent: t.Optional(t.Nullable(t.Number())),
  AccumDepreciation: t.Number(),
  AccumReval: t.Optional(t.Nullable(t.Number())),
  ClosingValue: t.Number(),
  TransactionSeq: t.Optional(t.Nullable(t.Number())),
  Memo: t.Optional(t.Nullable(t.String())),
});

export const AssetLogMany = t.Object({
  data: t.Array(t.Partial(AssetLogOne)),
  pagination: t.Object({
    total: t.Number(),
    limit: t.Number(),
    offset: t.Number(),
    next: t.Number(),
    prev: t.Number(),
  }),
});
