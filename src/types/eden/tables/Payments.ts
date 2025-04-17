import { t } from "elysia";
export const PaymentsOne = t.Object({
  SequenceNumber: t.Number(),
  LastModifiedTime: t.String(),
  InvoiceID: t.Number(),
  CashTrans: t.Number(),
  Date: t.Nullable(t.Date()),
  GSTCycle: t.Nullable(t.Number()),
  Amount: t.Number(),
});
export const PaymentsMany = t.Object({
  data: t.Array(t.Partial(PaymentsOne)),
  pagination: t.Object({
    total: t.Number(),
    limit: t.Number(),
    offset: t.Number(),
    next: t.Number(),
    prev: t.Number(),
  }),
});
