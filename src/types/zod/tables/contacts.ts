import { z } from "zod";

export const contactsZod = z.object({
  /** Internal unique identifier for the contact record itself. */
  SequenceNumber: z
    .number()
    .positive()
    .describe("Internal unique identifier for the contact record itself."),
  /** Timestamp indicating the last time the contact record was modified. */
  LastModifiedTime: z
    .string()
    .describe(
      "Timestamp indicating the last time the contact record was modified.",
    ),
  /** Foreign key linking to the SequenceNumber of the parent Name record. */
  ParentSeq: z
    .number()
    .positive()
    .describe(
      "Foreign key linking to the SequenceNumber of the parent Name record. Indexed.",
    ),
  /** The display order of this contact within the parent Name record's contact list. */
  Order: z
    .number()
    .describe(
      "The display order of this contact within the parent Name record's contact list.",
    ),
  /** The contact person's name. Corresponds to Name.Contact and Name.Contact2 for the first two. */
  ContactName: z
    .string()
    .max(40)
    .describe(
      "The contact person's name. Corresponds to Name.Contact and Name.Contact2 for the first two.",
    ),
  /** The contact's salutation (e.g., Mr., Ms., Dr.). Corresponds to Name.Salutation and Name.Salutation2. */
  Salutation: z
    .string()
    .max(40)
    .describe(
      "The contact's salutation (e.g., Mr., Ms., Dr.). Corresponds to Name.Salutation and Name.Salutation2.",
    ),
  /** The contact's position or job title within the organisation. Corresponds to Name.Position and Name.Position2. */
  Position: z
    .string()
    .max(40)
    .describe(
      "The contact's position or job title within the organisation. Corresponds to Name.Position and Name.Position2.",
    ),
  /** The contact's direct phone number or DDI. Corresponds to Name.DDI and Name.DDI2. */
  Phone: z
    .string()
    .max(20)
    .describe(
      "The contact's direct phone number or DDI. Corresponds to Name.DDI and Name.DDI2.",
    ),
  /** The contact's mobile phone number. Corresponds to Name.Mobile and Name.Mobile2. */
  Mobile: z
    .string()
    .max(20)
    .describe(
      "The contact's mobile phone number. Corresponds to Name.Mobile and Name.Mobile2.",
    ),
  /** The contact's after-hours phone number. Corresponds to Name.AfterHours and Name.AfterHours2. */
  AfterHours: z
    .string()
    .max(20)
    .describe(
      "The contact's after-hours phone number. Corresponds to Name.AfterHours and Name.AfterHours2.",
    ),
  /** The contact's email address. Corresponds to Name.eMail and Name.eMail2. */
  eMail: z
    .string()
    .max(140)
    .describe(
      "The contact's email address. Corresponds to Name.eMail and Name.eMail2.",
    ),
  /** General memo or notes specifically about this contact. */
  Memo: z
    .string()
    .max(256)
    .describe("General memo or notes specifically about this contact."),
  /** Represents the roles assigned to the contact (e.g., Payables, CEO). Stored as a bitmask. Corresponds to Name.Role and Name.Role2. Bitmask field where each bit corresponds to one of the 16 possible roles defined in Preferences. */
  Role: z
    .number()
    .describe(
      "Represents the roles assigned to the contact (e.g., Payables, CEO). Stored as a bitmask. Corresponds to Name.Role and Name.Role2. Bitmask field where each bit corresponds to one of the 16 possible roles defined in Preferences.",
    ),
  /** A user-defined number field for custom data storage, often used by scripts. (Mutable: freely, script-only) */
  UserNum: z
    .number()
    .nullable()
    .describe(
      "A user-defined number field for custom data storage, often used by scripts. (Mutable: freely, script-only)",
    ),
  /** A user-defined text field for custom data storage, often used by scripts. (Mutable: freely, script-only) */
  UserText: z
    .string()
    .max(256)
    .describe(
      "A user-defined text field for custom data storage, often used by scripts. (Mutable: freely, script-only)",
    ),
  /** Stores key-value pairs for custom data, primarily accessed via scripting functions GetTaggedValue/SetTaggedValue. (Mutable: freely, script-only) */
  TaggedText: z
    .string()
    .max(256)
    .describe(
      "Stores key-value pairs for custom data, primarily accessed via scripting functions GetTaggedValue/SetTaggedValue. (Mutable: freely, script-only)",
    ),
});

/**
 * Inferred TypeScript type from the contactsZod schema.
 * Represents a fully validated Contacts record.
 */
export type ContactsZod = z.infer<typeof contactsZod>;
