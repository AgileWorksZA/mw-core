import { t } from "elysia";

export const InventoryOne = t.Object(
  {
    SequenceNumber: t.Integer({
      description: "Unsigned long sequence number (indexed). Unique internal identifier for this specific inventory record."
    }),
    LastModifiedTime: t.String({
      description: "Last modified timestamp. The date and time that this record was last changed."
    }),
    Identifier: t.String({
      description: "The serial number or batch number identifier for the item. Max 31 chars.",
      maxLength: 31
    }),
    Location: t.Optional(t.Nullable(t.String({
      description: "The stock location code where this item/batch is stored. Blank means default location. Max 15 chars.",
      maxLength: 15
    }))),
    ProductSeq: t.Integer({
      description: "The sequence number of the parent Product record (Product.SequenceNumber) this inventory belongs to."
    }),
    Qty: t.Integer({
      description: "The quantity (stock on hand) for this specific serial/batch at this specific location."
    }),
    Expiry: t.Optional(t.Nullable(t.String({
      description: "The expiry date for items tracked by batch with expiry dates. Should be specified in YYYY-MM-DD format."
    }))),
  },
  { additionalProperties: true },
);
