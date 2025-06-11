/**
 * MoneyWorks Contacts Table Interface
 *
 * The Contacts file contains additional contact records linked to Names entries.
 * This is a subfile of the Names table, allowing multiple contacts per customer/supplier.
 *
 * @see https://cognito.co.nz/manual/moneyworks_appendix_contacts.html
 */

/**
 * Contact role flags
 * @description Bit-mapped roles for contacts
 */
export interface ContactRoles {
  /** Primary contact */
  primary: boolean;
  /** Accounts payable contact */
  accountsPayable: boolean;
  /** Accounts receivable contact */
  accountsReceivable: boolean;
  /** Sales contact */
  sales: boolean;
  /** Technical contact */
  technical: boolean;
  /** Management contact */
  management: boolean;
}

/**
 * MoneyWorks Contacts Table (Raw Interface)
 * @description Complete interface for the Contacts table with exact field names
 */
export interface Contact {
  /**
   * Parent name sequence number
   * @description Links to the parent Name record
   * @relationship References Name via sequence number
   * @required
   */
  ParentSeq: number;

  /**
   * Contact name
   * @maxLength 39
   * @description Full name of the contact person
   * @example "John Smith"
   */
  Contact?: string;

  /**
   * Position/title
   * @maxLength 39
   * @description Job position or title
   * @example "Accounts Manager"
   */
  Position?: string;

  /**
   * Salutation
   * @maxLength 39
   * @description Title or greeting
   * @example "Mr."
   */
  Salutation?: string;

  /**
   * Email address
   * @maxLength 63
   * @format email
   * @example "john.smith@example.com"
   */
  eMail?: string;

  /**
   * Direct dial number
   * @maxLength 19
   * @pattern [\d\s\-\+\(\)]+
   */
  DDI?: string;

  /**
   * Mobile phone number
   * @maxLength 19
   * @pattern [\d\s\-\+\(\)]+
   */
  Mobile?: string;

  /**
   * After hours phone number
   * @maxLength 19
   * @pattern [\d\s\-\+\(\)]+
   */
  AfterHours?: string;

  /**
   * Contact roles
   * @description Bit-mapped field representing contact roles
   * @see contactHelpers.decodeRoles
   */
  Role?: number;

  /**
   * Display order
   * @description Determines contact's display/sort order
   * @default 0
   */
  Order?: number;

  /**
   * Memo/notes
   * @maxLength 255
   * @description Notes about the contact
   */
  Memo?: string;

  /**
   * Tagged text
   * @maxLength 255
   * @description Scriptable tag storage
   */
  TaggedText?: string;

  /**
   * User-defined numeric field
   * @description Scriptable numeric field
   */
  UserNum?: number;

  /**
   * User-defined text field
   * @maxLength 255
   * @description Scriptable text field
   */
  UserText?: string;

  /**
   * Last modification timestamp
   * @format ISO 8601
   * @readonly
   */
  LastModifiedTime?: string;

  /**
   * User who last modified
   * @readonly
   * @note This field may not be present in all MoneyWorks versions
   */
  ModUser?: string;
}

/**
 * MoneyWorks Contacts Table (CamelCase Interface)
 * @description Developer-friendly interface with camelCase property names
 */
export interface ContactCamel {
  /**
   * Parent name sequence number
   * @description Links to the parent Name record
   * @relationship References Name via sequence number
   * @required
   */
  parentSeq: number;

  /**
   * Contact name
   * @maxLength 39
   * @description Full name of the contact person
   * @example "John Smith"
   */
  contact?: string;

  /**
   * Position/title
   * @maxLength 39
   * @description Job position or title
   * @example "Accounts Manager"
   */
  position?: string;

  /**
   * Salutation
   * @maxLength 39
   * @description Title or greeting
   * @example "Mr."
   */
  salutation?: string;

  /**
   * Email address
   * @maxLength 63
   * @format email
   * @example "john.smith@example.com"
   */
  email?: string;

  /**
   * Direct dial number
   * @maxLength 19
   * @pattern [\d\s\-\+\(\)]+
   */
  ddi?: string;

  /**
   * Mobile phone number
   * @maxLength 19
   * @pattern [\d\s\-\+\(\)]+
   */
  mobile?: string;

  /**
   * After hours phone number
   * @maxLength 19
   * @pattern [\d\s\-\+\(\)]+
   */
  afterHours?: string;

  /**
   * Contact roles
   * @description Bit-mapped field representing contact roles
   * @see contactHelpers.decodeRoles
   */
  role?: number;

  /**
   * Display order
   * @description Determines contact's display/sort order
   * @default 0
   */
  order?: number;

  /**
   * Memo/notes
   * @maxLength 255
   * @description Notes about the contact
   */
  memo?: string;

  /**
   * Tagged text
   * @maxLength 255
   * @description Scriptable tag storage
   */
  taggedText?: string;

  /**
   * User-defined numeric field
   * @description Scriptable numeric field
   */
  userNum?: number;

  /**
   * User-defined text field
   * @maxLength 255
   * @description Scriptable text field
   */
  userText?: string;

  /**
   * Last modification timestamp
   * @format ISO 8601
   * @readonly
   */
  lastModifiedTime?: string;

  /**
   * User who last modified
   * @readonly
   * @note This field may not be present in all MoneyWorks versions
   */
  modUser?: string;
}

/**
 * Converter utilities for Contacts table
 */
export const contactConverters = {
  /**
   * Convert from MoneyWorks PascalCase to camelCase
   */
  toCamelCase(raw: Contact): ContactCamel {
    return {
      parentSeq: raw.ParentSeq,
      contact: raw.Contact,
      position: raw.Position,
      salutation: raw.Salutation,
      email: raw.eMail,
      ddi: raw.DDI,
      mobile: raw.Mobile,
      afterHours: raw.AfterHours,
      role: raw.Role,
      order: raw.Order,
      memo: raw.Memo,
      taggedText: raw.TaggedText,
      userNum: raw.UserNum,
      userText: raw.UserText,
      lastModifiedTime: raw.LastModifiedTime,
      modUser: raw.ModUser,
    };
  },

  /**
   * Convert from camelCase to MoneyWorks PascalCase
   */
  fromCamelCase(camel: ContactCamel): Contact {
    return {
      ParentSeq: camel.parentSeq,
      Contact: camel.contact,
      Position: camel.position,
      Salutation: camel.salutation,
      eMail: camel.email,
      DDI: camel.ddi,
      Mobile: camel.mobile,
      AfterHours: camel.afterHours,
      Role: camel.role,
      Order: camel.order,
      Memo: camel.memo,
      TaggedText: camel.taggedText,
      UserNum: camel.userNum,
      UserText: camel.userText,
      LastModifiedTime: camel.lastModifiedTime,
      ModUser: camel.modUser,
    };
  },
};

/**
 * Helper functions for Contacts table
 */
export const contactHelpers = {
  /**
   * Decode bitwise roles field into boolean properties
   * @param roles - The numeric roles value from MoneyWorks
   * @returns Object with individual role states
   */
  decodeRoles(roles: number): ContactRoles {
    return {
      primary: (roles & 0x0001) !== 0,
      accountsPayable: (roles & 0x0002) !== 0,
      accountsReceivable: (roles & 0x0004) !== 0,
      sales: (roles & 0x0008) !== 0,
      technical: (roles & 0x0010) !== 0,
      management: (roles & 0x0020) !== 0,
    };
  },

  /**
   * Encode boolean roles into bitwise numeric value
   * @param roles - Object with individual role states
   * @returns Numeric value for MoneyWorks roles field
   */
  encodeRoles(roles: ContactRoles): number {
    let result = 0;
    if (roles.primary) result |= 0x0001;
    if (roles.accountsPayable) result |= 0x0002;
    if (roles.accountsReceivable) result |= 0x0004;
    if (roles.sales) result |= 0x0008;
    if (roles.technical) result |= 0x0010;
    if (roles.management) result |= 0x0020;
    return result;
  },

  /**
   * Create a display name for the contact
   * @param contact - The contact record
   * @returns Formatted display name
   */
  getDisplayName(contact: Contact): string {
    const parts: string[] = [];

    if (contact.Salutation) {
      parts.push(contact.Salutation);
    }

    if (contact.Contact) {
      parts.push(contact.Contact);
    }

    if (parts.length === 0 && contact.eMail) {
      return contact.eMail;
    }

    return parts.join(" ");
  },

  /**
   * Get primary phone number
   * @param contact - The contact record
   * @returns The most relevant phone number
   */
  getPrimaryPhone(contact: Contact): string | undefined {
    return contact.DDI || contact.Mobile || contact.AfterHours;
  },

  /**
   * Check if contact has a specific role
   * @param contact - The contact record
   * @param roleName - The role to check
   * @returns True if contact has the role
   */
  hasRole(contact: Contact, roleName: keyof ContactRoles): boolean {
    if (!contact.Role) return false;
    const roles = this.decodeRoles(contact.Role);
    return roles[roleName];
  },

  /**
   * Create a full contact card string
   * @param contact - The contact record
   * @returns Multi-line contact information
   */
  getContactCard(contact: Contact): string {
    const lines: string[] = [];

    const displayName = this.getDisplayName(contact);
    if (displayName) lines.push(displayName);

    if (contact.Position) lines.push(contact.Position);
    if (contact.eMail) lines.push(`Email: ${contact.eMail}`);
    if (contact.DDI) lines.push(`Direct: ${contact.DDI}`);
    if (contact.Mobile) lines.push(`Mobile: ${contact.Mobile}`);
    if (contact.AfterHours) lines.push(`After Hours: ${contact.AfterHours}`);

    return lines.join("\n");
  },
};
