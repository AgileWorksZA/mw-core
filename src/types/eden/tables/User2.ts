import { t } from "elysia";

export const User2One = t.Object({
  SequenceNumber: t.Integer({
    description: "Unsigned long sequence number (indexed). Unique internal identifier for this User2 record."
  }),
  LastModifiedTime: t.String({
    description: "Last modified timestamp. The date and time that this record was last changed."
  }),
  DevKey: t.Integer({
    description: "Developer Key. An unsigned integer > 65535 used to namespace keys, preventing conflicts between different scripts/plug-ins. Must be pre-allocated by Cognito for distributed solutions."
  }),
  Key: t.String({
    description: "Primary key (part 2) for the record, unique within a DevKey.",
    maxLength: 28
  }),
  Int1: t.Nullable(t.Integer({
    description: "User-defined signed integer field 1."
  })),
  Int2: t.Nullable(t.Integer({
    description: "User-defined signed integer field 2."
  })),
  Float1: t.Nullable(t.Integer({
    description: "User-defined floating-point number field 1."
  })),
  Float2: t.Nullable(t.Integer({
    description: "User-defined floating-point number field 2."
  })),
  Date1: t.Nullable(t.String({
    description: "User-defined date field 1."
  })),
  Date2: t.Nullable(t.String({
    description: "User-defined date field 2."
  })),
  Text1: t.Nullable(t.String({
    description: "User-defined text field 1.",
    maxLength: 255
  })),
  Text2: t.Nullable(t.String({
    description: "User-defined text field 2.",
    maxLength: 255
  })),
  Text: t.Nullable(t.String({
    description: "User-defined long text field.",
    maxLength: 1020
  })),
  Int3: t.Nullable(t.Integer({
    description: "User-defined signed integer field 3."
  })),
  Int4: t.Nullable(t.Integer({
    description: "User-defined signed integer field 4."
  })),
  Float3: t.Nullable(t.Integer({
    description: "User-defined floating-point number field 3."
  })),
  Float4: t.Nullable(t.Integer({
    description: "User-defined floating-point number field 4."
  })),
  Date3: t.Nullable(t.String({
    description: "User-defined date field 3."
  })),
  Date4: t.Nullable(t.String({
    description: "User-defined date field 4."
  })),
  Text3: t.Nullable(t.String({
    description: "User-defined text field 3.",
    maxLength: 255
  })),
  Text4: t.Nullable(t.String({
    description: "User-defined text field 4.",
    maxLength: 255
  })),
  TaggedText: t.Nullable(t.String({
    description: "Scriptable tag storage for key-value pairs.",
    maxLength: 255
  })),
  Colour: t.Nullable(t.Integer({
    description: "Display color index (0-7).",
    min: 0,
    max: 7
  })),
});