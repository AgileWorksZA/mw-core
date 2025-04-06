import { t } from "elysia";

export const AssetCatOne = t.Object({
  SequenceNumber: t.Number(),
  LastModifiedTime: t.Optional(t.Nullable(t.String())),
  Code: t.String(),
  Description: t.String(),
  AssetAccount: t.String(),
  DepExpense: t.String(),
  AccumDep: t.String(),
  GainLoss: t.String(),
  Custom: t.Optional(t.Nullable(t.String())),
  Group: t.Optional(t.Nullable(t.String())),
  Type: t.String(),
  Impairment: t.Optional(t.Nullable(t.String())),
  Rate: t.Number(),
  RevalSurplus: t.Optional(t.Nullable(t.String())),
  GainLossPrivate: t.Optional(t.Nullable(t.String())),
  DepExpensePrivate: t.Optional(t.Nullable(t.String())),
  UserNum: t.Optional(t.Nullable(t.Number())),
  UserText: t.Optional(t.Nullable(t.String())),
  LastDepreciatedDate: t.Optional(t.Nullable(t.String())),
  TaggedText: t.Optional(t.Nullable(t.String())),
  Flags: t.Nullable(t.Number()),
});

export const AssetCatMany = t.Object({
  data: t.Array(t.Partial(AssetCatOne)),
  pagination: t.Object({
    total: t.Number(),
    limit: t.Number(),
    offset: t.Number(),
    next: t.Number(),
    prev: t.Number(),
  }),
});
