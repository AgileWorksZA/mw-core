import { t } from "elysia";

export const UserOne = t.Object(
  {
    SequenceNumber: t.Integer({
      description: "Unsigned long sequence number (indexed). Unique internal identifier for this user data record."
    }),
    LastModifiedTime: t.String({
      description: "Last modified timestamp. The date and time that this record was last changed."
    }),
    Key: t.String({
      description: "The unique key identifying this data record, defined by the script/plug-in. Indexed.",
      maxLength: 9
    }),
    Data: t.Nullable(t.String({
      description: "The text data associated with the Key.",
      maxLength: 245
    })),
  },
  { additionalProperties: true },
);