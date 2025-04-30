import { t } from "elysia";

export const AssetLogOne = t.Object(
  {
    SequenceNumber: t.Optional(t.Nullable(t.Number({
      description: "Unsigned long sequence number (indexed). Unique internal identifier for the asset log entry."
    }))),
    LastModifiedTime: t.Nullable(t.String({
      description: "Last modified timestamp. The date and time that this record was last changed."
    })),
    ParentSeq: t.Optional(t.Nullable(t.Number({
      description: "Sequence number of the parent asset record (Asset.SequenceNumber)."
    }))),
    Action: t.Optional(t.Nullable(t.String({
      description: "Type of action recorded (e.g., Acquisition, Disposal, Depreciation). Values: AA: Acquisition, AD: Disposal, AP: Part Disposal, DS: Straight Line Depreciation, DD: Diminishing Value Depreciation, ME: Memo, RV: Revaluation."
    }))),
    Date: t.Optional(t.Nullable(t.String({
      description: "Date of the action. Should be specified in YYYY-MM-DD format."
    }))),
    Qty: t.Optional(t.Nullable(t.Number({
      description: "Quantity involved in the action (e.g., quantity disposed)."
    }))),
    Depreciation: t.Optional(t.Nullable(t.Number({
      description: "Depreciation amount calculated or applied in this action."
    }))),
    Adjustment1: t.Optional(t.Nullable(t.Number({
      description: "Adjustment 1 amount (specific usage depends on action type). Potentially used in revaluations or complex disposals."
    }))),
    Adjustment2: t.Optional(t.Nullable(t.Number({
      description: "Adjustment 2 amount (specific usage depends on action type). Potentially used in revaluations or complex disposals."
    }))),
    Rate: t.Optional(t.Nullable(t.Number({
      description: "Depreciation rate used for this action (if applicable)."
    }))),
    PrivateUsePercent: t.Optional(t.Nullable(t.Number({
      description: "Private use percentage at the time of this action.",
      min: 0,
      max: 100
    }))),
    AccumDepreciation: t.Number({
      description: "Accumulated depreciation *after* this action."
    }),
    AccumReval: t.Optional(t.Nullable(t.Number({
      description: "Accumulated revaluation surplus/impairment *after* this action."
    }))),
    ClosingValue: t.Number({
      description: "Book value of the asset *after* this action."
    }),
    TransactionSeq: t.Optional(t.Nullable(t.Number({
      description: "Sequence number of the related MoneyWorks transaction (e.g., purchase invoice, disposal journal)."
    }))),
    Memo: t.Optional(t.Nullable(t.String({
      description: "User-entered memo for this specific log entry.",
      maxLength: 255
    }))),
  },
  { additionalProperties: true },
);
