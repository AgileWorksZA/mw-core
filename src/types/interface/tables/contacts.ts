/**
 * Represents an additional contact record associated with a Name record.
 * This table stores contacts beyond the first two (which are fields in the Name table).
 * Internal Name: Contacts (inferred, not explicitly in provided XML).
 * Likely File Number: (Not provided in schema, inferred relation).
 */
export interface Contacts {
  /** Internal unique identifier for the contact record itself. */
  SequenceNumber: number;
  /** Timestamp indicating the last time the contact record was modified. */
  LastModifiedTime: string;
  /**
   * Foreign key linking to the SequenceNumber of the parent Name record.
   * @indexed
   */
  ParentSeq: number; // Inferred field linking to Name.SequenceNumber
  /**
   * The display order of this contact within the parent Name record's contact list.
   */
  Order: number;
  /**
   * The contact person's name. Corresponds to Name.Contact and Name.Contact2 for the first two.
   * @maxLength 40
   */
  ContactName: string; // Assuming name like Name.Contact
  /**
   * The contact's salutation (e.g., Mr., Ms., Dr.). Corresponds to Name.Salutation and Name.Salutation2.
   * @maxLength 40
   */
  Salutation: string;
  /**
   * The contact's position or job title within the organisation. Corresponds to Name.Position and Name.Position2.
   * @maxLength 40
   */
  Position: string;
  /**
   * The contact's direct phone number or DDI. Corresponds to Name.DDI and Name.DDI2.
   * @maxLength 20
   */
  Phone: string; // Assuming like Name.DDI
  /**
   * The contact's mobile phone number. Corresponds to Name.Mobile and Name.Mobile2.
   * @maxLength 20
   */
  Mobile: string;
  /**
   * The contact's after-hours phone number. Corresponds to Name.AfterHours and Name.AfterHours2.
   * @maxLength 20
   */
  AfterHours: string;
  /**
   * The contact's email address. Corresponds to Name.eMail and Name.eMail2.
   * @maxLength 140
   */
  eMail: string;
  /**
   * General memo or notes specifically about this contact.
   * @maxLength 256
   */
  Memo: string; // Assuming a general memo field
  /**
   * Represents the roles assigned to the contact (e.g., Payables, CEO). Stored as a bitmask. Corresponds to Name.Role and Name.Role2.
   * Bitmask field where each bit corresponds to one of the 16 possible roles defined in Preferences.
   */
  Role: number; // Described as bitmask in documentation
  /**
   * A user-defined number field for custom data storage, often used by scripts.
   * @mutable free, script-only
   */
  UserNum: number;
  /**
   * A user-defined text field for custom data storage, often used by scripts.
   * @mutable free, script-only
   * @maxLength 256
   */
  UserText: string;
  /**
   * Stores key-value pairs for custom data, primarily accessed via scripting functions GetTaggedValue/SetTaggedValue.
   * @mutable free, script-only
   * @maxLength 256
   */
  TaggedText: string;
}

/**
 * Represents the fields available in the inferred Contacts table.
 */
export type ContactsField = keyof Contacts;

/**
 * Array of all field names in the inferred Contacts table.
 */
export const ContactsFields: ContactsField[] = [
  "SequenceNumber",
  "LastModifiedTime",
  "ParentSeq",
  "Order",
  "ContactName",
  "Salutation",
  "Position",
  "Phone",
  "Mobile",
  "AfterHours",
  "eMail",
  "Memo",
  "Role",
  "UserNum",
  "UserText",
  "TaggedText",
];

/**
 * Represents a Contacts object where all values are strings.
 * This is useful for generic handling or specific import/export scenarios.
 */
export type ContactsObject = Record<ContactsField, string>;
