import { t } from "elysia";

export const PaymentsOne = t.Object(
  {
    SequenceNumber: t.Number(),
    LastModifiedTime: t.String(),
    InvoiceID: t.Number(),
    CashTrans: t.Number(),
    Date: t.Nullable(t.Date()),
    GSTCycle: t.Nullable(t.Number()),
    Amount: t.Number(),
  },
  { additionalProperties: true },
);
