import { t } from "elysia";

export const DepartmentOne = t.Object(
  {
    SequenceNumber: t.Integer({
      description: "Unsigned long sequence number (indexed). Unique internal identifier for this department record."
    }),
    LastModifiedTime: t.String({
      description: "Last modified timestamp. The date and time that this record was last changed."
    }),
    Code: t.String({
      description: "The unique department code, up to 5 alphanumeric characters. Used as suffix in departmentalised GL codes (e.g., ACCOUNT-DEPT).",
      maxLength: 5
    }),
    Description: t.String({
      description: "The department name/description, up to 35 characters.",
      maxLength: 35
    }),
    Classification: t.Nullable(t.String({
      description: "The classification code for the department, used for grouping related departments. Max 5 chars.",
      maxLength: 5
    })),
    Custom1: t.Nullable(t.String({
      description: "Custom field 1 for user definition, up to 15 characters.",
      maxLength: 15
    })),
    Custom2: t.Nullable(t.String({
      description: "Custom field 2 for user definition, up to 9 characters.",
      maxLength: 9
    })),
    Flags: t.Nullable(t.Integer({
      description: "Bitmapped flags field. Bit 0x8000: Heading Only (cannot be posted to directly)."
    })),
    UserNum: t.Nullable(t.Integer({
      description: "User defined number (scriptable)."
    })),
    UserText: t.Nullable(t.String({
      description: "User defined text (scriptable), up to 255 characters.",
      maxLength: 255
    })),
    TaggedText: t.Nullable(t.String({
      description: "Scriptable tag storage, up to 255 characters.",
      maxLength: 255
    })),
  },
  { additionalProperties: true },
);
