import { t } from "elysia";

export const BankRecsOne = t.Object(
  {
    SequenceNumber: t.Number({
      description: "Unsigned long sequence number (indexed). Unique internal identifier for this reconciliation record."
    }),
    LastModifiedTime: t.String({
      description: "Last modified timestamp. The date and time that this record was last changed."
    }),
    Account: t.String({
      description: "The general ledger account code that was reconciled.",
      maxLength: 8
    }),
    Opening: t.Nullable(t.Number({
      description: "The opening balance used for the reconciliation."
    })),
    Closing: t.Nullable(t.Number({
      description: "The closing balance from the bank statement used for the reconciliation."
    })),
    Statement: t.Nullable(t.Number({
      description: "The statement number from the bank statement."
    })),
    Date: t.String({
      description: "The statement date used for the reconciliation. Should be specified in YYYY-MM-DD format."
    }),
    ReconciledTime: t.Nullable(t.String({
      description: "The date and time the reconciliation was finalised."
    })),
    Discrepancy: t.Nullable(t.Number({
      description: "The difference between calculated closing balance and statement closing balance at finalisation. Should be zero for a successful reconciliation."
    })),
  },
  { additionalProperties: true },
);
