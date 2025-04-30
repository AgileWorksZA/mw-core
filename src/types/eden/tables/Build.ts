import { t } from "elysia";

export const BuildOne = t.Object(
  {
    SequenceNumber: t.Number({
      description: "Unsigned long sequence number (indexed). Unique internal identifier for this BOM line item."
    }),
    LastModifiedTime: t.String({
      description: "Last modified timestamp. The date and time that this record was last changed."
    }),
    ProductSeq: t.Number({
      description: "The sequence number of the parent Product record (Product.SequenceNumber) to which this recipe line belongs."
    }),
    Order: t.Nullable(t.Number({
      description: "The order/position of this component within the Bill of Materials for the parent product."
    })),
    Qty: t.Number({
      description: "Quantity of the component required to build ONE unit of the parent product."
    }),
    PartCode: t.String({
      description: "Code of the component product/item used in the build. Must be an existing Product code.",
      maxLength: 31
    }),
    Flags: t.Nullable(t.Number({
      description: "Flags associated with the build component line (usage not explicitly documented)."
    })),
    Memo: t.Nullable(t.String({
      description: "Memo or instruction for this component line, up to 255 characters.",
      maxLength: 255
    })),
  },
  { additionalProperties: true },
);
