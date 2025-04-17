import { z } from "zod";

// --- Message Enums ---

/**
 * Defines the type of recurrence for the reminder message.
 * Note: These numeric values are inferred based on typical implementations and the dialog options;
 * they are not explicitly documented in Appendix A. Adjust if specific values are known.
 * 0: Once Only
 * 1: Daily
 * 2: Weekly (based on DayOfWeek)
 * 3: Monthly (based on Day)
 * 4: Monthly (based on Nth DayOfWeek)
 * 5: Annually (based on Date)
 */
export const MessageRecurrenceTypeEnum = z
  .enum([
    "0", // Once Only
    "1", // Daily
    "2", // Weekly
    "3", // Monthly by Day
    "4", // Monthly by Weekday
    "5", // Annually by Date (Inferred, not explicitly shown in dialog)
  ])
  .describe(`Defines the type of recurrence for the reminder message.
  0: Once Only
  1: Daily
  2: Weekly (based on DayOfWeek)
  3: Monthly (based on Day)
  4: Monthly (based on Nth DayOfWeek)
  5: Annually (based on Date - inferred)`);

// --- Message Schema ---

/**
 * Zod schema for the Reminder Message record.
 * Internal file name: Message
 * Stores user-defined reminder messages with recurrence rules.
 */
export const messageZod = z.object({
  /** Unsigned long sequence number (indexed). Unique internal identifier for this reminder message. */
  SequenceNumber: z
    .number()
    .positive()
    .describe(
      "Unsigned long sequence number (indexed). Unique internal identifier for this reminder message.",
    ),
  /** Last modified timestamp. The date and time that this record was last changed. */
  LastModifiedTime: z
    .string()
    .datetime({ offset: true })
    .describe(
      "Last modified timestamp. The date and time that this record was last changed.",
    ),
  /** The date the recurrence rule starts from. Should be specified in YYYY-MM-DD format. */
  StartDate: z
    .string()
    .describe(
      "The date the recurrence rule starts from. Should be specified in YYYY-MM-DD format.",
    ),
  /** The date the recurrence rule ends (if not Forever or XTimes). Should be specified in YYYY-MM-DD format. */
  EndDate: z
    .string()
    .nullable()
    .optional()
    .describe(
      "The date the recurrence rule ends (if not Forever or XTimes). Should be specified in YYYY-MM-DD format.",
    ),
  /** The date the reminder is next scheduled to appear. System calculated. Should be specified in YYYY-MM-DD format. */
  NextDate: z
    .string()
    .nullable()
    .optional()
    .describe(
      "The date the reminder is next scheduled to appear. System calculated. Should be specified in YYYY-MM-DD format.",
    ),
  /** Keep flag. If true, the message stays visible in 'Today's Messages' until unchecked. */
  Keep: z
    .boolean()
    .describe(
      "Keep flag. If true, the message stays visible in 'Today's Messages' until unchecked.",
    ),
  /** Reference number (purpose not explicitly documented). */
  Ref: z
    .number()
    .nullable()
    .optional()
    .describe("Reference number (purpose not explicitly documented)."),
  /** Day of the month for monthly recurrence (1-31), or flag for last day (e.g., 32). */
  LastDay: z
    .number()
    .min(1)
    .max(32) // 32 might represent 'last day' logic
    .nullable()
    .optional()
    .describe(
      "Day of the month for monthly recurrence (1-31), or flag for last day (e.g., 32).",
    ),
  /** Interval for 'Every N days' recurrence. */
  NDaily: z
    .number()
    .positive()
    .nullable()
    .optional()
    .describe("Interval for 'Every N days' recurrence."),
  /** Interval for 'Every N weeks' recurrence. */
  NWeekly: z
    .number()
    .positive()
    .nullable()
    .optional()
    .describe("Interval for 'Every N weeks' recurrence."),
  /** Interval for 'Every N months' recurrence. */
  NMonthly: z
    .number()
    .positive()
    .nullable()
    .optional()
    .describe("Interval for 'Every N months' recurrence."),
  /** Flag indicating if the reminder occurs only once (likely 1 if true, 0 if false). */
  Once: z
    .number()
    .min(0)
    .max(1)
    .nullable()
    .optional()
    .describe(
      "Flag indicating if the reminder occurs only once (likely 1 if true, 0 if false).",
    ),
  /** The number of times the reminder should recur before stopping. */
  XTimes: z
    .number()
    .positive()
    .nullable()
    .optional()
    .describe("The number of times the reminder should recur before stopping."),
  /** Flag indicating if the reminder recurs indefinitely (likely 1 if true, 0 if false). */
  Forever: z
    .number()
    .min(0)
    .max(1)
    .nullable()
    .optional()
    .describe(
      "Flag indicating if the reminder recurs indefinitely (likely 1 if true, 0 if false).",
    ),
  /** Day of the month (1-31) for specific monthly recurrence. */
  Day: z
    .number()
    .min(1)
    .max(31)
    .nullable()
    .optional()
    .describe("Day of the month (1-31) for specific monthly recurrence."),
  /** Numeric code representing the recurrence type (e.g., Daily, Weekly, Monthly). */
  Type: z // Using number as enum values aren't documented
    .number()
    .describe(
      "Numeric code representing the recurrence type (e.g., Daily, Weekly, Monthly). See MessageRecurrenceTypeEnum for inferred values.",
    ),
  /** Day of the week (1=Mon to 7=Sun) for weekly or Nth weekday monthly recurrence. */
  DayOfWeek: z
    .number()
    .min(1)
    .max(7)
    .nullable()
    .optional()
    .describe(
      "Day of the week (1=Mon to 7=Sun) for weekly or Nth weekday monthly recurrence.",
    ),
  /** The 'Nth' occurrence (1-5, where 5 means last) for 'Nth DayOfWeek of month' recurrence. */
  N: z
    .number()
    .min(1)
    .max(5)
    .nullable()
    .optional()
    .describe(
      "The 'Nth' occurrence (1-5, where 5 means last) for 'Nth DayOfWeek of month' recurrence.",
    ),
  /** Unused recurrence parameter (legacy or internal?). */
  X: z
    .number()
    .nullable()
    .optional()
    .describe("Unused recurrence parameter (legacy or internal?)."),
  /** Flag indicating if the recurrence date should avoid falling on a weekend (likely 1 if true, 0 if false). */
  AvoidWeekends: z
    .number()
    .min(0)
    .max(1)
    .nullable()
    .optional()
    .describe(
      "Flag indicating if the recurrence date should avoid falling on a weekend (likely 1 if true, 0 if false).",
    ),
  /** Flag indicating if this is an automatic reversing transaction reminder (legacy?). */
  Reverse: z
    .number()
    .min(0)
    .max(1)
    .nullable()
    .optional()
    .describe(
      "Flag indicating if this is an automatic reversing transaction reminder (legacy?).",
    ),
  /** Internal flag to stop recurrence after the next occurrence (likely 1 if true, 0 if false). */
  kill_next_time: z
    .number()
    .min(0)
    .max(1)
    .nullable()
    .optional()
    .describe(
      "Internal flag to stop recurrence after the next occurrence (likely 1 if true, 0 if false).",
    ),
  /** The text content of the reminder message. Max 255 chars. */
  Message: z
    .string()
    .max(255) // Assuming standard text length
    .nullable()
    .optional() // Message might just be a date trigger
    .describe("The text content of the reminder message. Max 255 chars."),
  /** User initials who created/last modified the reminder. Max 3 chars. */
  User: z
    .string()
    .max(3) // Standard user initials size
    .describe(
      "User initials who created/last modified the reminder. Max 3 chars.",
    ),
  /** User-defined numeric field (scriptable). */
  UserNum: z
    .number()
    .nullable()
    .optional()
    .describe("User-defined numeric field (scriptable)."),
  /** User-defined text field (scriptable). Max 255 chars. */
  UserText: z
    .string()
    .max(255)
    .nullable()
    .optional()
    .describe("User-defined text field (scriptable). Max 255 chars."),
  /** Scriptable tag storage for key-value pairs. Max 255 chars. */
  TaggedText: z
    .string()
    .max(255)
    .nullable()
    .optional()
    .describe("Scriptable tag storage for key-value pairs. Max 255 chars."),
});

/**
 * Inferred TypeScript type from the messageZod schema.
 * Represents a fully validated Reminder Message record.
 */
export type MessageZod = z.infer<typeof messageZod>;

// Partial schema for updates
export const messagePartialSchema = messageZod.partial();

/**
 * Inferred TypeScript type from the messagePartialSchema.
 * Represents a Message record where all fields are optional.
 */
export type MessagePartialZod = z.infer<typeof messagePartialSchema>;
