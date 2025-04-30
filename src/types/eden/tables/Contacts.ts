import { t } from "elysia";

export const ContactsOne = t.Object(
  {
    SequenceNumber: t.Integer({
      description: "Internal unique identifier for the contact record itself."
    }),
    LastModifiedTime: t.String({
      description: "Timestamp indicating the last time the contact record was modified."
    }),
    ParentSeq: t.Integer({
      description: "Foreign key linking to the SequenceNumber of the parent Name record. Indexed."
    }),
    Order: t.Integer({
      description: "The display order of this contact within the parent Name record's contact list."
    }),
    ContactName: t.Nullable(t.String({
      description: "The contact person's name. Corresponds to Name.Contact and Name.Contact2 for the first two.",
      maxLength: 40
    })),
    Salutation: t.Nullable(t.String({
      description: "The contact's salutation (e.g., Mr., Ms., Dr.). Corresponds to Name.Salutation and Name.Salutation2.",
      maxLength: 40
    })),
    Position: t.Nullable(t.String({
      description: "The contact's position or job title within the organisation. Corresponds to Name.Position and Name.Position2.",
      maxLength: 40
    })),
    Phone: t.Nullable(t.String({
      description: "The contact's direct phone number or DDI. Corresponds to Name.DDI and Name.DDI2.",
      maxLength: 20
    })),
    Mobile: t.Nullable(t.String({
      description: "The contact's mobile phone number. Corresponds to Name.Mobile and Name.Mobile2.",
      maxLength: 20
    })),
    AfterHours: t.Nullable(t.String({
      description: "The contact's after-hours phone number. Corresponds to Name.AfterHours and Name.AfterHours2.",
      maxLength: 20
    })),
    eMail: t.Nullable(t.String({
      description: "The contact's email address. Corresponds to Name.eMail and Name.eMail2.",
      maxLength: 140
    })),
    Memo: t.Nullable(t.String({
      description: "General memo or notes specifically about this contact.",
      maxLength: 256
    })),
    Role: t.Nullable(t.Integer({
      description: "Represents the roles assigned to the contact (e.g., Payables, CEO). Stored as a bitmask. Corresponds to Name.Role and Name.Role2. Bitmask field where each bit corresponds to one of the 16 possible roles defined in Preferences."
    })),
    UserNum: t.Nullable(t.Integer({
      description: "A user-defined number field for custom data storage, often used by scripts. (Mutable: freely, script-only)"
    })),
    UserText: t.Nullable(t.String({
      description: "A user-defined text field for custom data storage, often used by scripts. (Mutable: freely, script-only)",
      maxLength: 256
    })),
    TaggedText: t.Nullable(t.String({
      description: "Stores key-value pairs for custom data, primarily accessed via scripting functions GetTaggedValue/SetTaggedValue. (Mutable: freely, script-only)",
      maxLength: 256
    })),
  },
  { additionalProperties: true },
);
