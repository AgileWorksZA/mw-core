import { t } from 'elysia';
export const BankRecsOne = t.Object({
  SequenceNumber: t.Number(),
  LastModifiedTime: t.Date(),
  Account: t.String(),
  Opening: t.Optional(t.Number()),
  Closing: t.Optional(t.Number()),
  Statement: t.Optional(t.Number()),
  Date: t.Date(),
  ReconciledTime: t.Optional(t.Date()),
  Discrepancy: t.Optional(t.Number()),
});
export const BankRecsMany = t.Object({
  data: t.Array(BankRecsOne),
  pagination: t.Object({
    total: t.Number(),
    limit: t.Number(),
    offset: t.Number(),
    next: t.Number(),
    prev: t.Number(),
  })
});
