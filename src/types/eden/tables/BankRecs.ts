import { t } from "elysia";
export const BankRecsOne = t.Object({
  SequenceNumber: t.Number(),
  LastModifiedTime: t.String(),
  Account: t.String(),
  Opening: t.Nullable(t.Number()),
  Closing: t.Nullable(t.Number()),
  Statement: t.Nullable(t.Number()),
  Date: t.String(),
  ReconciledTime: t.Nullable(t.String()),
  Discrepancy: t.Nullable(t.Number()),
});
export const BankRecsMany = t.Object({
  data: t.Array(BankRecsOne),
  pagination: t.Object({
    total: t.Number(),
    limit: t.Number(),
    offset: t.Number(),
    next: t.Number(),
    prev: t.Number(),
  }),
});
