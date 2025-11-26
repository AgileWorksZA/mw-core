/**
 * MoneyWorks Stickies Entity - Canonical Ontology
 *
 * Empirical field extraction from MoneyWorks Now v9.2.3
 * Source: Full schema export 2025-11-25
 * Authority: Empirical API validation
 *
 * ENTITY PURPOSE: Sticky notes/annotations attached to records
 * - User annotations and notes attached to any record
 * - Collaboration and communication tool within accounting system
 * - Context-aware messaging for specific transactions or entities
 *
 * ARCHITECTURAL NOTE: Polymorphic attachment system
 * - FileNum identifies which table the sticky is attached to
 * - OwnerSeq identifies the specific record within that table
 * - User attribution tracks who created the note
 */

// ============================================================================
// CANONICAL MONEYWORKS STICKIES FIELD DATA TYPES
// ============================================================================

/**
 * MoneyWorks canonical Stickies file field definitions
 * Source: Empirical schema extraction from MoneyWorks Now v9.2.3
 *
 * ARCHITECTURAL INSIGHT: Flexible annotation system for any entity
 */
export const MONEYWORKS_STICKIES_FIELDS = [
  {
    fieldName: "SequenceNumber",
    dataType: "N" as const,
    canonicalDescription: "Primary key - unique sticky note identifier",
    manualSource: "Empirical API validation (MoneyWorks Now v9.2.3)",
    isRequired: true,
    isSystem: true,
    isIndexed: true
  },
  {
    fieldName: "LastModifiedTime",
    dataType: "S" as const,
    canonicalDescription: "The date and time that this record was last changed",
    manualSource: "Empirical API validation (MoneyWorks Now v9.2.3)",
    isRequired: false,
    isSystem: true
  },
  {
    fieldName: "FileNum",
    dataType: "N" as const,
    canonicalDescription: "File/table identifier for attachment target",
    manualSource: "Empirical API validation (MoneyWorks Now v9.2.3)",
    isRequired: false,
    businessRule: "Numeric ID of MoneyWorks table (e.g., 5 = Transaction table)"
  },
  {
    fieldName: "Colour",
    dataType: "N" as const,
    canonicalDescription: "Display color for sticky note",
    manualSource: "Empirical API validation (MoneyWorks Now v9.2.3)",
    isRequired: false,
    businessRule: "Numeric color code for visual categorization"
  },
  {
    fieldName: "User",
    dataType: "T" as const,
    maxLength: 31,
    canonicalDescription: "User initials of sticky note creator",
    manualSource: "Empirical API validation (MoneyWorks Now v9.2.3)",
    isRequired: false,
    businessRule: "References Login.Initials for attribution"
  },
  {
    fieldName: "OwnerSeq",
    dataType: "N" as const,
    canonicalDescription: "Sequence number of parent record",
    manualSource: "Empirical API validation (MoneyWorks Now v9.2.3)",
    isRequired: false,
    businessRule: "References SequenceNumber of record in FileNum table"
  },
  {
    fieldName: "Message",
    dataType: "T" as const,
    maxLength: 65535,
    canonicalDescription: "Sticky note message text",
    manualSource: "Empirical API validation (MoneyWorks Now v9.2.3)",
    isRequired: false,
    businessRule: "The actual note content displayed to users"
  },
  {
    fieldName: "Flags",
    dataType: "N" as const,
    canonicalDescription: "System flags for sticky note behavior",
    manualSource: "Empirical API validation (MoneyWorks Now v9.2.3)",
    isRequired: false,
    businessRule: "Bit flags controlling visibility and behavior"
  }
] as const;

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * MoneyWorks Stickies entity type definition
 */
export interface MoneyWorksStickies {
  SequenceNumber: number;           // Primary key (required)
  LastModifiedTime?: string;        // System modification timestamp
  FileNum?: number;                 // Target table identifier
  Colour?: number;                  // Display color code
  User?: string;                    // Max 31 characters, creator initials
  OwnerSeq?: number;                // Parent record sequence number
  Message?: string;                 // Max 65535 characters, note text
  Flags?: number;                   // System behavior flags
}

/**
 * MoneyWorks Stickies field definition type
 */
export interface MoneyWorksStickiesField {
  fieldName: string;
  dataType: "T" | "N" | "S";
  maxLength?: number;
  canonicalDescription: string;
  manualSource: string;
  isRequired?: boolean;
  isSystem?: boolean;
  isIndexed?: boolean;
  businessRule?: string;
}

// ============================================================================
// VALIDATION FUNCTIONS
// ============================================================================

/**
 * Validates MoneyWorks Stickies record
 */
export function validateStickiesRecord(sticky: MoneyWorksStickies): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (sticky.User && sticky.User.length > 31) {
    errors.push("User must not exceed 31 characters");
  }

  if (sticky.Message && sticky.Message.length > 65535) {
    errors.push("Message must not exceed 65535 characters");
  }

  if (sticky.FileNum !== undefined && sticky.FileNum < 0) {
    errors.push("FileNum must be a positive number");
  }

  if (sticky.OwnerSeq !== undefined && sticky.OwnerSeq < 0) {
    errors.push("OwnerSeq must be a positive number");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Gets field by name
 */
export function getStickiesField(fieldName: string): MoneyWorksStickiesField | undefined {
  return MONEYWORKS_STICKIES_FIELDS.find(f => f.fieldName === fieldName);
}

/**
 * Gets attachment reference fields
 */
export function getAttachmentFields(): MoneyWorksStickiesField[] {
  return MONEYWORKS_STICKIES_FIELDS.filter(f => ["FileNum", "OwnerSeq"].includes(f.fieldName));
}
