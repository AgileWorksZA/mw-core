import { t } from "elysia";

export const MessageOne = t.Object(
  {
    SequenceNumber: t.Number({
      description: "Unsigned long sequence number (indexed). Unique internal identifier for this reminder message."
    }),
    LastModifiedTime: t.String({
      description: "Last modified timestamp. The date and time that this record was last changed."
    }),
    StartDate: t.Nullable(t.Date({
      description: "The date the recurrence rule starts from. Should be specified in YYYY-MM-DD format."
    })),
    EndDate: t.Nullable(t.Date({
      description: "The date the recurrence rule ends (if not Forever or XTimes). Should be specified in YYYY-MM-DD format."
    })),
    NextDate: t.Nullable(t.Date({
      description: "The date the reminder is next scheduled to appear. System calculated. Should be specified in YYYY-MM-DD format."
    })),
    Keep: t.Nullable(t.Boolean({
      description: "Keep flag. If true, the message stays visible in 'Today's Messages' until unchecked."
    })),
    Ref: t.Nullable(t.Number({
      description: "Reference number (purpose not explicitly documented)."
    })),
    LastDay: t.Nullable(t.Number({
      description: "Day of the month for monthly recurrence (1-31), or flag for last day (e.g., 32).",
      minimum: 1,
      maximum: 32
    })),
    NDaily: t.Nullable(t.Number({
      description: "Interval for 'Every N days' recurrence."
    })),
    NWeekly: t.Nullable(t.Number({
      description: "Interval for 'Every N weeks' recurrence."
    })),
    NMonthly: t.Nullable(t.Number({
      description: "Interval for 'Every N months' recurrence."
    })),
    Once: t.Nullable(t.Number({
      description: "Flag indicating if the reminder occurs only once (likely 1 if true, 0 if false).",
      minimum: 0,
      maximum: 1
    })),
    XTimes: t.Nullable(t.Number({
      description: "The number of times the reminder should recur before stopping."
    })),
    Forever: t.Nullable(t.Number({
      description: "Flag indicating if the reminder recurs indefinitely (likely 1 if true, 0 if false).",
      minimum: 0,
      maximum: 1
    })),
    Day: t.Nullable(t.Number({
      description: "Day of the month (1-31) for specific monthly recurrence.",
      minimum: 1,
      maximum: 31
    })),
    Type: t.Nullable(t.Number({
      description: "Numeric code representing the recurrence type (e.g., Daily, Weekly, Monthly). Values: 0: Once Only, 1: Daily, 2: Weekly, 3: Monthly by Day, 4: Monthly by Weekday, 5: Annually by Date"
    })),
    DayOfWeek: t.Nullable(t.Number({
      description: "Day of the week (1=Mon to 7=Sun) for weekly or Nth weekday monthly recurrence.",
      minimum: 1,
      maximum: 7
    })),
    N: t.Nullable(t.Number({
      description: "The 'Nth' occurrence (1-5, where 5 means last) for 'Nth DayOfWeek of month' recurrence.",
      minimum: 1,
      maximum: 5
    })),
    X: t.Nullable(t.Number({
      description: "Unused recurrence parameter (legacy or internal?)."
    })),
    AvoidWeekends: t.Nullable(t.Number({
      description: "Flag indicating if the recurrence date should avoid falling on a weekend (likely 1 if true, 0 if false).",
      minimum: 0,
      maximum: 1
    })),
    Reverse: t.Nullable(t.Number({
      description: "Flag indicating if this is an automatic reversing transaction reminder (legacy?).",
      minimum: 0,
      maximum: 1
    })),
    kill_next_time: t.Nullable(t.Number({
      description: "Internal flag to stop recurrence after the next occurrence (likely 1 if true, 0 if false).",
      minimum: 0,
      maximum: 1
    })),
    Message: t.String({
      description: "The text content of the reminder message. Max 255 chars.",
      maxLength: 255
    }),
    User: t.Nullable(t.String({
      description: "User initials who created/last modified the reminder. Max 3 chars.",
      maxLength: 3
    })),
    UserNum: t.Nullable(t.Number({
      description: "User-defined numeric field (scriptable)."
    })),
    UserText: t.Nullable(t.String({
      description: "User-defined text field (scriptable). Max 255 chars.",
      maxLength: 255
    })),
    TaggedText: t.Nullable(t.String({
      description: "Scriptable tag storage for key-value pairs. Max 255 chars.",
      maxLength: 255
    })),
  },
  { additionalProperties: true },
);
