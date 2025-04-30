import { t } from "elysia";

export const AssetOne = t.Object(
  {
    SequenceNumber: t.Number({
      description: "Unsigned long sequence number (indexed). Unique internal identifier for the asset record."
    }),
    LastModifiedTime: t.String({
      description: "Last modified timestamp. The date and time that this asset record was last changed."
    }),
    Code: t.String({
      description: "A unique code for the asset, up to 19 characters long.",
      maxLength: 19
    }),
    Description: t.String({
      description: "The description of the asset, up to 63 characters.",
      maxLength: 63
    }),
    Category: t.String({
      description: "The Asset Category of the asset. Must correspond to an existing Asset Category code.",
      maxLength: 7
    }),
    SerialNum: t.Optional(t.Nullable(t.String({
      description: "A serial number for the asset, up to 31 characters.",
      maxLength: 31
    }))),
    Qty: t.Number({
      description: "The quantity of the asset (normally 1, but can be a set)."
    }),
    ExpectedLife: t.Optional(t.Nullable(t.Number({
      description: "The expected life in years of the asset (informational)."
    }))),
    Cost: t.Number({
      description: "The cost (per unit) of the asset. For new assets, this is the acquisition cost."
    }),
    AccumDepreciation: t.Number({
      description: "The accumulated depreciation recorded against the asset."
    }),
    AcquisitionDate: t.String({
      description: "Date on which the asset was acquired. Should be specified in YYYY-MM-DD format."
    }),
    LastDepreciatedDate: t.Optional(t.Nullable(t.String({
      description: "Date on which the asset was last depreciated. Should be specified in YYYY-MM-DD format. Blank for new assets."
    }))),
    AcquisitionSeq: t.Optional(t.Nullable(t.Number({
      description: "The sequencenumber of the purchase transaction for the asset. Can be linked via 'Link Invoice'."
    }))),
    DisposalSeq: t.Optional(t.Nullable(t.Number({
      description: "The sequencenumber of the last disposal transaction for the asset."
    }))),
    Location: t.Optional(t.Nullable(t.String({
      description: "Where the asset is kept, up to 15 characters.",
      maxLength: 15
    }))),
    Dept: t.Optional(t.Nullable(t.String({
      description: "The asset department (must be a MoneyWorks Department code).",
      maxLength: 5
    }))),
    PrivateUsePercent: t.Optional(t.Nullable(t.Number({
      description: "The percent of the asset used privately (0-100). Only applicable if Category allows private use.",
      min: 0,
      max: 100
    }))),
    Status: t.String({
      description: "The asset status. Values: NEW, ACT, NDP, OTH, DSP. NEW: Newly entered asset, not yet depreciated. ACT: Active asset, has been depreciated. NDP: Non-depreciable asset. OTH: Other asset type for record keeping. DSP: Disposed asset."
    }),
    LastModifiedBy: t.Optional(t.Nullable(t.String({
      description: "User initials (up to 3 chars) who last modified the asset record.",
      maxLength: 3
    }))),
    LastRevaluedDate: t.Optional(t.Nullable(t.String({
      description: "Date of last revaluation (blank if none). Should be specified in YYYY-MM-DD format."
    }))),
    ExpectedResidualValue: t.Optional(t.Nullable(t.Number({
      description: "Expected residual value at end of life (informational)."
    }))),
    RevalSurplusImpairAmt: t.Optional(t.Nullable(t.Number({
      description: "Total revalued amount (positive if surplus, negative if impairment)."
    }))),
    UserNum: t.Optional(t.Nullable(t.Number({
      description: "User defined number (scriptable)."
    }))),
    UserText: t.Optional(t.Nullable(t.String({
      description: "User defined text (scriptable), up to 255 characters.",
      maxLength: 255
    }))),
    AccumDepnAdj: t.Optional(t.Nullable(t.Number({
      description: "Total adjustments to accumulated depreciation due to revaluations."
    }))),
    BookValue: t.Number({
      description: "The current book value (Cost * Qty - AccumDepreciation)."
    }),
    DisposalDate: t.Optional(t.Nullable(t.String({
      description: "Date last disposed. Should be specified in YYYY-MM-DD format."
    }))),
    GainLossOnDisposal: t.Optional(t.Nullable(t.Number({
      description: "The gain or loss on asset disposal."
    }))),
    Colour: t.Optional(t.Nullable(t.Number({
      description: "Colour of record (0-7 index).",
      min: 0,
      max: 7
    }))),
    TaggedText: t.Optional(t.Nullable(t.String({
      description: "Scriptable tag storage, up to 255 characters.",
      maxLength: 255
    }))),
    Type: t.String({
      description: "Depreciation type: SL (straight line) or DV (diminishing value)."
    }),
    Rate: t.Number({
      description: "Depreciation rate percentage."
    }),
    Comment: t.Optional(t.Nullable(t.String({
      description: "Comments on asset, up to 1020 characters.",
      maxLength: 1020
    }))),
    Custom1: t.Optional(t.Nullable(t.String({
      description: "Custom field 1, up to 255 characters.",
      maxLength: 255
    }))),
    Custom2: t.Optional(t.Nullable(t.String({
      description: "Custom field 2, up to 255 characters.",
      maxLength: 255
    }))),
    Custom3: t.Optional(t.Nullable(t.String({
      description: "Custom field 3, up to 15 characters.",
      maxLength: 15
    }))),
    Custom4: t.Optional(t.Nullable(t.String({
      description: "Custom field 4, up to 15 characters.",
      maxLength: 15
    }))),
  },
  { additionalProperties: true },
);
