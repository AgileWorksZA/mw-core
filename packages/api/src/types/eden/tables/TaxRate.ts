import { t } from "elysia";

export const TaxRateOne = t.Object(
  {
    SequenceNumber: t.Integer({
      description: "Unsigned long sequence number (indexed). Unique internal identifier for this tax rate record."
    }),
    LastModifiedTime: t.String({
      description: "Last modified timestamp. The date and time that this record was last changed."
    }),
    TaxCode: t.String({
      description: "The unique code for the tax rate (e.g., 'G', 'E', 'PST', 'VPA'). Indexed.",
      maxLength: 5
    }),
    PaidAccount: t.Nullable(t.String({
      description: "The GL control account code for tax paid using this rate (e.g., GST/VAT Paid).",
      maxLength: 7
    })),
    RecAccount: t.Nullable(t.String({
      description: "The GL control account code for tax received/collected using this rate (e.g., GST/VAT Received).",
      maxLength: 7
    })),
    Rate1: t.Integer({
      description: "The tax percentage rate used *before* the changeover date."
    }),
    Date: t.Nullable(t.String({
      description: "The date when the tax rate changes from Rate1 to Rate2."
    })),
    Rate2: t.Nullable(t.Integer({
      description: "The tax percentage rate used *on or after* the changeover date (current rate)."
    })),
    Combine: t.Nullable(t.Integer({
      description: "Flags indicating how second-tier tax is combined in composite taxes (0=Additive, 1=Multiplicative)."
    })),
    CombineRate1: t.Nullable(t.Integer({
      description: "Second-tier tax rate used before changeover date (legacy PST/specific composites)."
    })),
    CombineRate2: t.Nullable(t.Integer({
      description: "Second-tier tax rate used on or after changeover date (legacy PST/specific composites)."
    })),
    GSTReceived: t.Nullable(t.Integer({
      description: "Total GST/VAT received amount reported in the last finalised tax report for this code."
    })),
    NetReceived: t.Nullable(t.Integer({
      description: "Total Net amount associated with GST/VAT received in the last finalised tax report."
    })),
    GSTPaid: t.Nullable(t.Integer({
      description: "Total GST/VAT paid amount reported in the last finalised tax report for this code."
    })),
    NetPaid: t.Nullable(t.Integer({
      description: "Total Net amount associated with GST/VAT paid in the last finalised tax report."
    })),
    RateName: t.Nullable(t.String({
      description: "The description/name of the tax rate.",
      maxLength: 25
    })),
    ReportCycleStart: t.Nullable(t.Integer({
      description: "Start period number of the last finalised tax report cycle this code was included in."
    })),
    ReportCycleEnd: t.Nullable(t.Integer({
      description: "End period number of the last finalised tax report cycle this code was included in."
    })),
    ReportDate: t.Nullable(t.String({
      description: "End date of the last finalised tax report cycle this code was included in."
    })),
    PSTReceived: t.Nullable(t.Integer({
      description: "PST Received amount (legacy/Canada specific)."
    })),
    PSTPaid: t.Nullable(t.Integer({
      description: "PST Paid amount (legacy/Canada specific)."
    })),
    Type: t.Nullable(t.Integer({
      description: "Numeric type indicator for the tax rate (0=GST/VAT, 1=Sales, 2=Composite, 3=Reversed)."
    })),
    Combination: t.Nullable(t.String({
      description: "String representation of the components for a Composite tax (e.g., 'WET+G').",
      maxLength: 31
    })),
    UserNum: t.Nullable(t.Integer({
      description: "User-defined numeric field (scriptable)."
    })),
    UserText: t.Nullable(t.String({
      description: "User-defined text field (scriptable).",
      maxLength: 255
    })),
    TaggedText: t.Nullable(t.String({
      description: "Scriptable tag storage for key-value pairs.",
      maxLength: 255
    })),
    AliasCode: t.Nullable(t.String({
      description: "Alias code used for mapping this tax code in specific country guides or online filing.",
      maxLength: 3
    })),
    AliasCountry: t.Nullable(t.String({
      description: "Country code associated with the AliasCode mapping.",
      maxLength: 3
    })),
    ReversedRate1: t.Nullable(t.Integer({
      description: "Rate used for Reversed tax calculations before the changeover date."
    })),
    ReversedRate2: t.Nullable(t.Integer({
      description: "Rate used for Reversed tax calculations on or after the changeover date."
    })),
    Flags: t.Nullable(t.Integer({
      description: "Bitmapped flags field. Bit 0 (value 1): Tax is 100% (All Tax)."
    })),
  },
  { additionalProperties: true },
);