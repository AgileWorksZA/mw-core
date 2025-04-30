import { t } from "elysia";

export const ListOne = t.Object(
  {
    SequenceNumber: t.Number({
      description: "Unsigned long sequence number (indexed). Unique internal identifier for this list item record."
    }),
    LastModifiedTime: t.String({
      description: "Last modified timestamp. The date and time that this record was last changed."
    }),
    ListID: t.String({
      description: "The identifier of the Validation List to which this item belongs. Max 15 chars.",
      maxLength: 15
    }),
    Item: t.String({
      description: "The actual value or code of the list item. Max 15 chars.",
      maxLength: 15
    }),
    Comment: t.Nullable(t.String({
      description: "The description associated with the list item, displayed in choices lists. Max 255 chars (assumed).",
      maxLength: 255
    })),
    UserNum: t.Nullable(t.Number({
      description: "User-defined numeric field (scriptable)."
    })),
    UserText: t.Nullable(t.String({
      description: "User-defined text field (scriptable). Max 255 chars.",
      maxLength: 255
    })),
    TaggedText: t.Nullable(t.String({
      description: "Scriptable tag storage for key-value pairs. Max 255 chars.",
      maxLength: 255
    })),
  },
  { additionalProperties: true },
);
