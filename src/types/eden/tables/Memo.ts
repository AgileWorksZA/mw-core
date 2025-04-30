import { t } from "elysia";

export const MemoOne = t.Object(
  {
    SequenceNumber: t.Integer({
      description: "Unsigned long sequence number (indexed). Unique internal identifier for this memo record."
    }),
    LastModifiedTime: t.String({
      description: "Last modified timestamp. The date and time that this record was last changed."
    }),
    NameSeq: t.Integer({
      description: "The sequence number of the parent Name record (Name.SequenceNumber) to which this memo belongs."
    }),
    Order: t.Nullable(t.Integer({
      description: "The display order of this memo within the list for the parent Name record."
    })),
    Date: t.Nullable(t.String({
      description: "The date the memo was created or the contact occurred. Should be specified in YYYY-MM-DD format."
    })),
    RecallDate: t.Nullable(t.String({
      description: "The date for a follow-up reminder. If set, a reminder appears in MoneyWorks on or after this date. Should be specified in YYYY-MM-DD format."
    })),
    Flags: t.Nullable(t.Integer({
      description: "Bitmapped flags field (usage not explicitly detailed in appendix)."
    })),
    Text: t.String({
      description: "The text content of the memo. Max 255 chars.",
      maxLength: 255
    }),
  },
  { additionalProperties: true },
);
