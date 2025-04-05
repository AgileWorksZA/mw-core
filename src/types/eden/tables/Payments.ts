import { t } from 'elysia';
export const PaymentsOne = t.Object({
  SequenceNumber: t.Number(),
  LastModifiedTime: t.Date(),
  InvoiceID: t.Number(),
  CashTrans: t.Number(),
  Date: t.Nullable(t.Date()),
  GSTCycle: t.Nullable(t.Number()),
  Amount: t.Number(),
});
export const PaymentsMany = t.Object({
  data: t.Array(PaymentsOne),
  pagination: t.Object({
    total: t.Number(),
    limit: t.Number(),
    offset: t.Number(),
    next: t.Number(),
    prev: t.Number(),
  })
});
