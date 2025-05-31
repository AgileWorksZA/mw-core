import { t } from "elysia";

export const StickiesOne = t.Object(
  {
    SequenceNumber: t.Integer({
      description: "Unsigned long sequence number (indexed). Unique internal identifier for this sticky note record."
    }),
    LastModifiedTime: t.String({
      description: "Last modified timestamp. The date and time that this sticky note was last changed."
    }),
    FileNum: t.Integer({
      description: "Numeric code indicating the file/table the sticky note is attached to (e.g., 0=Transaction, 1=Name, 2=Account, 3=Product, 4=Job)."
    }),
    Colour: t.Nullable(t.Integer({
      description: "Display color index for the sticky note (0-7).",
      min: 0,
      max: 7
    })),
    User: t.Nullable(t.String({
      description: "User initials who created/last modified the sticky note.",
      maxLength: 3
    })),
    OwnerSeq: t.Integer({
      description: "Sequence number of the owner record (in the table specified by FileNum) to which this sticky note is attached."
    }),
    Message: t.String({
      description: "The text content of the sticky note message.",
      maxLength: 255
    }),
    Flags: t.Nullable(t.Integer({
      description: "Bitmapped flags determining when the sticky note is displayed (e.g., Bit 0: Display When Selling, Bit 1: Display When Buying, Bit 2: Display When Opening Record)."
    })),
  },
  { additionalProperties: true },
);