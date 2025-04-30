import { t } from "elysia";

export const PaymentsOne = t.Object(
  {
    SequenceNumber: t.Number({
      description: "Unsigned long sequence number (indexed). Unique internal identifier for this payment allocation record."
    }),
    LastModifiedTime: t.String({
      description: "Last modified timestamp. The date and time that this allocation record was last changed."
    }),
    InvoiceID: t.Number({
      description: "The sequence number of the Invoice transaction (DI or CI) that is being paid/credited by the CashTrans. Indexed."
    }),
    CashTrans: t.Number({
      description: "The sequence number of the Payment or Receipt transaction (CP, CR, CPD, CRC, CRD) being allocated to the InvoiceID. Indexed."
    }),
    Date: t.Nullable(t.Date({
      description: "The date the payment/receipt allocation occurred (usually the date of the CashTrans)."
    })),
    GSTCycle: t.Nullable(t.Number({
      description: "The tax cycle number when this allocation was processed for GST/VAT/Tax (relevant for cash basis reporting). 0 if not processed."
    })),
    Amount: t.Number({
      description: "The amount of the CashTrans transaction that was specifically allocated to this InvoiceID."
    }),
  },
  { additionalProperties: true },
);