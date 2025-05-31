import { t } from "elysia";

export const GeneralOne = t.Object(
  {
    SequenceNumber: t.Integer({
      description: "Unsigned long sequence number (indexed). Unique internal identifier for this record."
    }),
    LastModifiedTime: t.String({
      description: "Last modified timestamp. The date and time that this record was last changed."
    }),
    Code: t.String({
      description: "The unique code for the Category, Classification, or Group. Max 5 chars. The first character indicates the type (C, D, S).",
      maxLength: 5
    }),
    Description: t.Nullable(t.String({
      description: "The description or name of the Category, Classification, or Group. Max 25 chars.",
      maxLength: 25
    })),
    Date: t.Nullable(t.String({
      description: "Date associated with this record, if applicable."
    })),
    Long: t.Nullable(t.Integer({
      description: "Numeric data associated with this record, if applicable."
    })),
  },
  { additionalProperties: true },
);
