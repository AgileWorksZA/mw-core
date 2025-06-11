/**
 * MoneyWorks Names Table Interface
 *
 * The Names file contains all the names used in MoneyWorks including
 * customers, suppliers, and general ledger contact information.
 *
 * @see https://cognito.co.nz/manual/moneyworks_appendix_names.html
 */

/**
 * Customer/Supplier type indicator
 * @description Determines whether a name record is a customer, supplier, or both
 */
export enum NameType {
  /** Not a customer or supplier (general name only) */
  Neither = 0,
  /** Customer only */
  Customer = 1,
  /** Both customer and supplier */
  Both = 2,
}

/**
 * Color codes for visual identification
 * @description Numeric color index for UI display
 */
export enum NameColor {
  Black = 0,
  White = 1,
  Red = 2,
  Green = 3,
  Blue = 4,
  Yellow = 5,
  Magenta = 6,
  Cyan = 7,
}

/**
 * Payment methods
 * @description Tracks preferred payment method
 */
export enum PaymentMethod {
  Cash = 0,
  Cheque = 1,
  CreditCard = 2,
  DirectDebit = 3,
  Other = 4,
}

/**
 * MoneyWorks Names Table
 * @description Complete interface for the Names table in MoneyWorks
 */
export interface Name {
  /**
   * Unique identifier for the name record
   * @minLength 1
   * @maxLength 11
   * @description First 10 characters are used for display
   * @example "CUST001"
   */
  code: string;

  /**
   * Full name of the entity
   * @maxLength 255
   * @example "Acme Corporation Ltd"
   */
  name: string;

  /**
   * Customer/Supplier classification
   * @description Determines if this name can be used in sales, purchases, or both
   * @default NameType.Neither
   */
  customerType: NameType;

  /**
   * Primary mailing address line 1
   * @maxLength 59
   */
  address1?: string;

  /**
   * Primary mailing address line 2
   * @maxLength 59
   */
  address2?: string;

  /**
   * Primary mailing address line 3
   * @maxLength 59
   */
  address3?: string;

  /**
   * Primary mailing address line 4
   * @maxLength 59
   */
  address4?: string;

  /**
   * Delivery address line 1
   * @maxLength 59
   * @description Physical delivery address if different from mailing
   */
  deliveryAddress1?: string;

  /**
   * Delivery address line 2
   * @maxLength 59
   */
  deliveryAddress2?: string;

  /**
   * Delivery address line 3
   * @maxLength 59
   */
  deliveryAddress3?: string;

  /**
   * Delivery address line 4
   * @maxLength 59
   */
  deliveryAddress4?: string;

  /**
   * Primary contact person
   * @maxLength 25
   */
  contact?: string;

  /**
   * Secondary contact person
   * @maxLength 29
   */
  contact2?: string;

  /**
   * Main phone number
   * @maxLength 25
   * @pattern [\d\s\-\+\(\)]+
   */
  phone?: string;

  /**
   * Fax number
   * @maxLength 25
   * @pattern [\d\s\-\+\(\)]+
   */
  fax?: string;

  /**
   * Direct dial number
   * @maxLength 25
   * @pattern [\d\s\-\+\(\)]+
   */
  directDial?: string;

  /**
   * Direct dial number for contact 2
   * @maxLength 25
   * @pattern [\d\s\-\+\(\)]+
   */
  directDial2?: string;

  /**
   * Mobile phone number
   * @maxLength 25
   * @pattern [\d\s\-\+\(\)]+
   */
  mobile?: string;

  /**
   * Mobile phone number for contact 2
   * @maxLength 25
   * @pattern [\d\s\-\+\(\)]+
   */
  mobile2?: string;

  /**
   * After hours phone number
   * @maxLength 11
   * @pattern [\d\s\-\+\(\)]+
   */
  afterHours?: string;

  /**
   * Secondary after hours number
   * @maxLength 11
   * @pattern [\d\s\-\+\(\)]+
   */
  afterHours2?: string;

  /**
   * Primary email address
   * @maxLength 80
   * @format email
   * @example "accounts@example.com"
   */
  email?: string;

  /**
   * Secondary email address
   * @maxLength 80
   * @format email
   */
  email2?: string;

  /**
   * Website URL
   * @maxLength 63
   * @format uri
   * @example "https://example.com"
   */
  webURL?: string;

  /**
   * Customer's bank code
   * @maxLength 7
   * @description Links to bank definition
   */
  bank?: string;

  /**
   * Bank branch identifier
   * @maxLength 21
   */
  bankBranch?: string;

  /**
   * Bank account name
   * @maxLength 21
   * @description Name on the bank account
   */
  accountName?: string;

  /**
   * Bank account number
   * @maxLength 23
   * @description Customer's bank account for payments
   */
  bankAccountNumber?: string;

  /**
   * Currency code
   * @maxLength 3
   * @description Three-letter currency code (e.g., "USD", "EUR")
   * @example "USD"
   */
  currency?: string;

  /**
   * Credit limit for customers
   * @description Maximum outstanding balance allowed. 0 = no limit
   * @minimum 0
   * @default 0
   */
  creditLimit?: number;

  /**
   * Sales person code
   * @maxLength 5
   * @description Links to salesperson definition
   */
  salesPerson?: string;

  /**
   * Tax identification number
   * @maxLength 31
   * @description GST/VAT registration number
   */
  taxIdent?: string;

  /**
   * Tax code
   * @maxLength 11
   * @description Default tax code for transactions
   */
  taxCode?: string;

  /**
   * Comments/notes
   * @maxLength 1020
   * @description Free-form notes about this name
   */
  comment?: string;

  /**
   * Color coding
   * @description Visual identifier in lists
   * @default NameColor.Black
   */
  colour?: NameColor;

  /**
   * Status flags
   * @description Bitwise flags for various status indicators
   * @see nameHelpers.decodeFlags
   */
  flags?: number;

  /**
   * User-defined category 1
   * @maxLength 15
   */
  category1?: string;

  /**
   * User-defined category 2
   * @maxLength 15
   */
  category2?: string;

  /**
   * User-defined category 3
   * @maxLength 15
   */
  category3?: string;

  /**
   * User-defined category 4
   * @maxLength 15
   */
  category4?: string;

  /**
   * User-defined custom field 1
   * @maxLength 255
   */
  custom1?: string;

  /**
   * User-defined custom field 2
   * @maxLength 255
   */
  custom2?: string;

  /**
   * User-defined custom field 3
   * @maxLength 255
   */
  custom3?: string;

  /**
   * User-defined custom field 4
   * @maxLength 255
   */
  custom4?: string;

  /**
   * User-defined custom field 5
   * @maxLength 255
   */
  custom5?: string;

  /**
   * User-defined custom field 6
   * @maxLength 255
   */
  custom6?: string;

  /**
   * User-defined custom field 7
   * @maxLength 255
   */
  custom7?: string;

  /**
   * User-defined custom field 8
   * @maxLength 255
   */
  custom8?: string;

  /**
   * Credit card number (encrypted)
   * @maxLength 31
   * @description Stored encrypted for security
   */
  creditCardNumber?: string;

  /**
   * Credit card expiry date
   * @format MM/YY
   * @maxLength 5
   */
  creditCardExpiry?: string;

  /**
   * Credit card name
   * @maxLength 31
   * @description Name on credit card
   */
  creditCardName?: string;

  /**
   * Preferred payment method
   * @description How this customer prefers to pay
   */
  paymentMethod?: PaymentMethod;

  /**
   * Current balance (creditor)
   * @description Current outstanding balance for suppliers
   * @readonly
   */
  cCurrent?: number;

  /**
   * 30 days balance (creditor)
   * @readonly
   */
  c30Days?: number;

  /**
   * 60 days balance (creditor)
   * @readonly
   */
  c60Days?: number;

  /**
   * 90+ days balance (creditor)
   * @readonly
   */
  c90Days?: number;

  /**
   * Current balance (debtor)
   * @description Current outstanding balance for customers
   * @readonly
   */
  dCurrent?: number;

  /**
   * 30 days balance (debtor)
   * @readonly
   */
  d30Days?: number;

  /**
   * 60 days balance (debtor)
   * @readonly
   */
  d60Days?: number;

  /**
   * 90+ days balance (debtor)
   * @readonly
   */
  d90Days?: number;

  /**
   * Mac Address Book Universal ID
   * @description Integration with Mac Address Book
   * @platform macOS
   */
  ABUID?: string;

  /**
   * Last modification timestamp
   * @format ISO 8601
   * @readonly
   */
  modTime?: string;

  /**
   * User who last modified
   * @readonly
   */
  modUser?: string;
}

/**
 * Name flags interface
 * @description Decoded representation of the flags field
 */
export interface NameFlags {
  /** Customer is on hold - no new transactions allowed */
  onHold: boolean;
  /** Customer is tax exempt */
  taxExempt: boolean;
  /** Print statements for this customer */
  printStatements: boolean;
  /** Customer has agreed to electronic invoicing */
  electronicInvoicing: boolean;
  /** Customer is inactive */
  inactive: boolean;
  /** Suppress reminders for this customer */
  suppressReminders: boolean;
}

/**
 * Helper functions for Names table
 */
export const nameHelpers = {
  /**
   * Decode bitwise flags field into boolean properties
   * @param flags - The numeric flags value from MoneyWorks
   * @returns Object with individual flag states
   */
  decodeFlags(flags: number): NameFlags {
    return {
      onHold: (flags & 1) !== 0,
      taxExempt: (flags & 2) !== 0,
      printStatements: (flags & 4) !== 0,
      electronicInvoicing: (flags & 8) !== 0,
      inactive: (flags & 16) !== 0,
      suppressReminders: (flags & 32) !== 0,
    };
  },

  /**
   * Encode boolean flags into bitwise numeric value
   * @param flags - Object with individual flag states
   * @returns Numeric value for MoneyWorks flags field
   */
  encodeFlags(flags: NameFlags): number {
    let result = 0;
    if (flags.onHold) result |= 1;
    if (flags.taxExempt) result |= 2;
    if (flags.printStatements) result |= 4;
    if (flags.electronicInvoicing) result |= 8;
    if (flags.inactive) result |= 16;
    if (flags.suppressReminders) result |= 32;
    return result;
  },

  /**
   * Check if a name is a customer
   * @param type - The customer type value
   * @returns True if the name can be used as a customer
   */
  isCustomer(type: NameType): boolean {
    return type === NameType.Customer || type === NameType.Both;
  },

  /**
   * Check if a name is a supplier
   * @param type - The customer type value
   * @returns True if the name can be used as a supplier
   */
  isSupplier(type: NameType): boolean {
    return type === NameType.Both;
  },

  /**
   * Format a name code to standard 10-character display format
   * @param code - The raw code value
   * @returns Formatted code (max 10 characters)
   */
  formatCode(code: string): string {
    return code.substring(0, 10);
  },
};

