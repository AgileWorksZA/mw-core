import { t } from "elysia";

export const AssetCatOne = t.Object(
  {
    SequenceNumber: t.Integer({
      description: "Unsigned long sequence number (indexed). Unique internal identifier for the asset category record."
    }),
    LastModifiedTime: t.Optional(t.Nullable(t.String({
      description: "Last modified timestamp. The date and time that this record was last changed."
    }))),
    Code: t.String({
      description: "Unique code for the category, up to 7 characters.",
      maxLength: 7
    }),
    Description: t.String({
      description: "Description of category, up to 63 characters.",
      maxLength: 63
    }),
    AssetAccount: t.String({
      description: "The fixed asset general ledger account code used for assets in this category.",
      maxLength: 13
    }),
    DepExpense: t.String({
      description: "Depreciation expense general ledger account code.",
      maxLength: 13
    }),
    AccumDep: t.String({
      description: "Accumulated depreciation general ledger account code (must be a Fixed Asset type).",
      maxLength: 13
    }),
    GainLoss: t.String({
      description: "General ledger account code for gain/loss on asset disposal (Income or Expense type).",
      maxLength: 13
    }),
    Custom: t.Optional(t.Nullable(t.String({
      description: "Custom field for user definition, up to 39 characters.",
      maxLength: 39
    }))),
    Group: t.Optional(t.Nullable(t.String({
      description: "Group code for user-defined grouping, up to 7 characters.",
      maxLength: 7
    }))),
    Type: t.String({
      description: "Default depreciation type for assets in this category: SL (Straight Line) or DV (Diminishing Value)."
    }),
    Impairment: t.Optional(t.Nullable(t.String({
      description: "An expense account for asset impairment (when assets are revalued down).",
      maxLength: 13
    }))),
    Rate: t.Integer({
      description: "Default annual depreciation rate percentage for this category."
    }),
    RevalSurplus: t.Optional(t.Nullable(t.String({
      description: "An equity (shareholder funds) account for upwards asset revaluations.",
      maxLength: 13
    }))),
    GainLossPrivate: t.Optional(t.Nullable(t.String({
      description: "Account for the private use portion of gain/loss on asset disposal.",
      maxLength: 13
    }))),
    DepExpensePrivate: t.Optional(t.Nullable(t.String({
      description: "Account for the private use portion of depreciation expense.",
      maxLength: 13
    }))),
    UserNum: t.Optional(t.Nullable(t.Integer({
      description: "User defined number (scriptable)."
    }))),
    UserText: t.Optional(t.Nullable(t.String({
      description: "User defined text (scriptable), up to 255 characters.",
      maxLength: 255
    }))),
    LastDepreciatedDate: t.Optional(t.Nullable(t.String({
      description: "Date of last depreciation run for this category. Should be specified in YYYY-MM-DD format."
    }))),
    TaggedText: t.Optional(t.Nullable(t.String({
      description: "Scriptable tag storage, up to 255 characters.",
      maxLength: 255
    }))),
    Flags: t.Nullable(t.Integer({
      description: "Bitmapped flags field. Flag 0x01: Assets can have personal/private use. Flag 0x02: Calculate depreciation on a daily basis."
    })),
  },
  { additionalProperties: true },
);
