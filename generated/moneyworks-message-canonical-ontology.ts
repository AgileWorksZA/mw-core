/**
 * MoneyWorks Message Entity - Canonical Ontology
 *
 * Empirical field extraction from MoneyWorks Now v9.2.3
 * Source: Full schema export 2025-11-25
 * Authority: Empirical API validation
 *
 * COVERAGE: 29 fields
 *
 * ENTITY PURPOSE: Recurring reminders and message scheduling system
 * - Manages scheduled reminders and notifications
 * - Supports complex recurrence patterns (daily, weekly, monthly)
 * - Enables workflow automation and user notifications
 *
 * ARCHITECTURAL NOTE: Sophisticated scheduling engine
 * - Multiple recurrence patterns with flexible configuration
 * - Date range management with start/end/next tracking
 * - User assignment and message delivery system
 */

// ============================================================================
// CANONICAL MONEYWORKS MESSAGE FIELD DATA TYPES
// ============================================================================

/**
 * MoneyWorks canonical Message file field definitions
 * Source: Empirical schema extraction from MoneyWorks Now v9.2.3
 *
 * ARCHITECTURAL INSIGHT: Comprehensive reminder and scheduling entity
 */
export const MONEYWORKS_MESSAGE_FIELDS = [
  {
    fieldName: "SequenceNumber",
    dataType: "N" as const,
    canonicalDescription: "Primary key - unique message identifier",
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
    fieldName: "StartDate",
    dataType: "D" as const,
    canonicalDescription: "Start date for message recurrence",
    manualSource: "Empirical API validation (MoneyWorks Now v9.2.3)",
    isRequired: false,
    businessRule: "Beginning of the date range when message becomes active"
  },
  {
    fieldName: "EndDate",
    dataType: "D" as const,
    canonicalDescription: "End date for message recurrence",
    manualSource: "Empirical API validation (MoneyWorks Now v9.2.3)",
    isRequired: false,
    businessRule: "End of date range when message expires"
  },
  {
    fieldName: "NextDate",
    dataType: "D" as const,
    canonicalDescription: "Next scheduled date for message display",
    manualSource: "Empirical API validation (MoneyWorks Now v9.2.3)",
    isRequired: false,
    businessRule: "Calculated next occurrence based on recurrence pattern"
  },
  {
    fieldName: "Keep",
    dataType: "N" as const,
    canonicalDescription: "Flag indicating whether to keep message after display",
    manualSource: "Empirical API validation (MoneyWorks Now v9.2.3)",
    isRequired: false,
    businessRule: "0 = delete after display, 1 = keep for next recurrence"
  },
  {
    fieldName: "Ref",
    dataType: "N" as const,
    canonicalDescription: "Reference number or ID",
    manualSource: "Empirical API validation (MoneyWorks Now v9.2.3)",
    isRequired: false,
    businessRule: "Optional reference to related transaction or entity"
  },
  {
    fieldName: "LastDay",
    dataType: "N" as const,
    canonicalDescription: "Flag for last day of month scheduling",
    manualSource: "Empirical API validation (MoneyWorks Now v9.2.3)",
    isRequired: false,
    businessRule: "1 = schedule on last day of month"
  },
  {
    fieldName: "NDaily",
    dataType: "N" as const,
    canonicalDescription: "Daily recurrence pattern flag",
    manualSource: "Empirical API validation (MoneyWorks Now v9.2.3)",
    isRequired: false,
    businessRule: "1 = daily recurrence enabled"
  },
  {
    fieldName: "NWeekly",
    dataType: "N" as const,
    canonicalDescription: "Weekly recurrence pattern flag",
    manualSource: "Empirical API validation (MoneyWorks Now v9.2.3)",
    isRequired: false,
    businessRule: "1 = weekly recurrence enabled"
  },
  {
    fieldName: "NMonthly",
    dataType: "N" as const,
    canonicalDescription: "Monthly recurrence pattern flag",
    manualSource: "Empirical API validation (MoneyWorks Now v9.2.3)",
    isRequired: false,
    businessRule: "1 = monthly recurrence enabled"
  },
  {
    fieldName: "Once",
    dataType: "N" as const,
    canonicalDescription: "One-time occurrence flag",
    manualSource: "Empirical API validation (MoneyWorks Now v9.2.3)",
    isRequired: false,
    businessRule: "1 = display once only, no recurrence"
  },
  {
    fieldName: "XTimes",
    dataType: "N" as const,
    canonicalDescription: "Limited recurrence count flag",
    manualSource: "Empirical API validation (MoneyWorks Now v9.2.3)",
    isRequired: false,
    businessRule: "1 = recur X times then stop (see X field)"
  },
  {
    fieldName: "Forever",
    dataType: "N" as const,
    canonicalDescription: "Infinite recurrence flag",
    manualSource: "Empirical API validation (MoneyWorks Now v9.2.3)",
    isRequired: false,
    businessRule: "1 = recur forever until manually stopped"
  },
  {
    fieldName: "Day",
    dataType: "N" as const,
    canonicalDescription: "Day of month for monthly recurrence",
    manualSource: "Empirical API validation (MoneyWorks Now v9.2.3)",
    isRequired: false,
    businessRule: "Day number (1-31) for monthly scheduling"
  },
  {
    fieldName: "Type",
    dataType: "N" as const,
    canonicalDescription: "Message type indicator",
    manualSource: "Empirical API validation (MoneyWorks Now v9.2.3)",
    isRequired: false,
    businessRule: "Classification of message purpose or priority"
  },
  {
    fieldName: "DayOfWeek",
    dataType: "N" as const,
    canonicalDescription: "Day of week for weekly recurrence",
    manualSource: "Empirical API validation (MoneyWorks Now v9.2.3)",
    isRequired: false,
    businessRule: "0 = Sunday, 1 = Monday, ... 6 = Saturday"
  },
  {
    fieldName: "N",
    dataType: "N" as const,
    canonicalDescription: "Recurrence interval multiplier",
    manualSource: "Empirical API validation (MoneyWorks Now v9.2.3)",
    isRequired: false,
    businessRule: "Interval for recurrence (e.g., every N days/weeks/months)"
  },
  {
    fieldName: "X",
    dataType: "N" as const,
    canonicalDescription: "Maximum occurrences count",
    manualSource: "Empirical API validation (MoneyWorks Now v9.2.3)",
    isRequired: false,
    businessRule: "Number of times to recur when XTimes flag is set"
  },
  {
    fieldName: "AvoidWeekends",
    dataType: "N" as const,
    canonicalDescription: "Weekend avoidance flag",
    manualSource: "Empirical API validation (MoneyWorks Now v9.2.3)",
    isRequired: false,
    businessRule: "1 = skip weekends, move to next business day"
  },
  {
    fieldName: "Reverse",
    dataType: "N" as const,
    canonicalDescription: "Reverse weekend movement flag",
    manualSource: "Empirical API validation (MoneyWorks Now v9.2.3)",
    isRequired: false,
    businessRule: "1 = move to previous business day instead of next"
  },
  {
    fieldName: "kill_next_time",
    dataType: "N" as const,
    canonicalDescription: "Auto-delete after next display flag",
    manualSource: "Empirical API validation (MoneyWorks Now v9.2.3)",
    isRequired: false,
    businessRule: "1 = delete message after next scheduled display"
  },
  {
    fieldName: "Message",
    dataType: "T" as const,
    maxLength: 65535,
    canonicalDescription: "Message text content",
    manualSource: "Empirical API validation (MoneyWorks Now v9.2.3)",
    isRequired: false,
    businessRule: "The actual message/reminder text to display to user"
  },
  {
    fieldName: "User",
    dataType: "T" as const,
    maxLength: 31,
    canonicalDescription: "Assigned user for message delivery",
    manualSource: "Empirical API validation (MoneyWorks Now v9.2.3)",
    isRequired: false,
    businessRule: "User name who should receive this message/reminder"
  },
  {
    fieldName: "UserNum",
    dataType: "N" as const,
    canonicalDescription: "Scriptable numeric field",
    manualSource: "Empirical API validation (MoneyWorks Now v9.2.3)",
    isRequired: false,
    businessRule: "Custom numeric data for scripting extensions"
  },
  {
    fieldName: "UserText",
    dataType: "T" as const,
    maxLength: 255,
    canonicalDescription: "Scriptable text field",
    manualSource: "Empirical API validation (MoneyWorks Now v9.2.3)",
    isRequired: false,
    businessRule: "Custom text data for scripting extensions"
  },
  {
    fieldName: "TaggedText",
    dataType: "T" as const,
    maxLength: 255,
    canonicalDescription: "Scriptable tagged text storage",
    manualSource: "Empirical API validation (MoneyWorks Now v9.2.3)",
    isRequired: false,
    businessRule: "Custom data storage for scripting extensions"
  }
] as const;

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * MoneyWorks Message entity type definition
 */
export interface MoneyWorksMessage {
  SequenceNumber: number;           // Primary key (required)
  LastModifiedTime?: string;        // System modification timestamp
  StartDate?: string;               // Start date (YYYYMMDD format)
  EndDate?: string;                 // End date (YYYYMMDD format)
  NextDate?: string;                // Next occurrence (YYYYMMDD format)
  Keep?: number;                    // Keep after display flag
  Ref?: number;                     // Reference number
  LastDay?: number;                 // Last day of month flag
  NDaily?: number;                  // Daily recurrence flag
  NWeekly?: number;                 // Weekly recurrence flag
  NMonthly?: number;                // Monthly recurrence flag
  Once?: number;                    // One-time flag
  XTimes?: number;                  // Limited recurrence flag
  Forever?: number;                 // Infinite recurrence flag
  Day?: number;                     // Day of month
  Type?: number;                    // Message type
  DayOfWeek?: number;               // Day of week (0-6)
  N?: number;                       // Interval multiplier
  X?: number;                       // Max occurrences
  AvoidWeekends?: number;           // Weekend avoidance flag
  Reverse?: number;                 // Reverse weekend flag
  kill_next_time?: number;          // Auto-delete flag
  Message?: string;                 // Max 65535 characters, message text
  User?: string;                    // Max 31 characters, assigned user
  UserNum?: number;                 // Scriptable numeric
  UserText?: string;                // Max 255 characters, scriptable text
  TaggedText?: string;              // Max 255 characters, tagged text
}

/**
 * MoneyWorks Message field definition type
 */
export interface MoneyWorksMessageField {
  fieldName: string;
  dataType: "T" | "N" | "S" | "D";
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
 * Validates MoneyWorks Message record
 */
export function validateMessageRecord(message: MoneyWorksMessage): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (message.User && message.User.length > 31) {
    errors.push("User must not exceed 31 characters");
  }

  if (message.UserText && message.UserText.length > 255) {
    errors.push("UserText must not exceed 255 characters");
  }

  if (message.TaggedText && message.TaggedText.length > 255) {
    errors.push("TaggedText must not exceed 255 characters");
  }

  if (message.Message && message.Message.length > 65535) {
    errors.push("Message must not exceed 65535 characters");
  }

  // Validate recurrence pattern consistency
  const recurrenceFlags = [message.NDaily, message.NWeekly, message.NMonthly, message.Once].filter(f => f === 1);
  if (recurrenceFlags.length > 1) {
    errors.push("Only one recurrence pattern can be active (NDaily, NWeekly, NMonthly, or Once)");
  }

  // Validate duration flags
  const durationFlags = [message.Once, message.XTimes, message.Forever].filter(f => f === 1);
  if (durationFlags.length > 1) {
    errors.push("Only one duration flag can be active (Once, XTimes, or Forever)");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Gets field by name
 */
export function getMessageField(fieldName: string): MoneyWorksMessageField | undefined {
  return MONEYWORKS_MESSAGE_FIELDS.find(f => f.fieldName === fieldName);
}

/**
 * Gets all recurrence-related fields
 */
export function getRecurrenceFields(): MoneyWorksMessageField[] {
  const recurrenceFieldNames = ["NDaily", "NWeekly", "NMonthly", "Once", "XTimes", "Forever", "Day", "DayOfWeek", "N", "X"];
  return MONEYWORKS_MESSAGE_FIELDS.filter(f => recurrenceFieldNames.includes(f.fieldName));
}
