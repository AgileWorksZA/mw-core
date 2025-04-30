import { t } from "elysia";

export const LinkOne = t.Object(
  {
    SequenceNumber: t.Number({
      description: "Unsigned long sequence number (indexed). Unique internal identifier for this link record."
    }),
    LastModifiedTime: t.String({
      description: "Last modified timestamp. The date and time that this link record was last changed."
    }),
    Dept: t.String({
      description: "The code of the Department being linked to the Group. Must be a valid Department code. Max 5 chars.",
      maxLength: 5
    }),
    Group: t.String({
      description: "The code of the Department Group the Department is linked to. Must be a valid Group code (stored in General table with 'S' prefix internally). Max 5 chars.",
      maxLength: 5
    }),
  },
  { additionalProperties: true },
);
