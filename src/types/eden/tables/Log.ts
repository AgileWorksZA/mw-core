import { t } from "elysia";

export const LogOne = t.Object(
  {
    SequenceNumber: t.Number({
      description: "Unsigned long sequence number (indexed). Unique internal identifier for this log entry."
    }),
    LastModifiedTime: t.String({
      description: "Timestamp of when the log entry was created."
    }),
    Description: t.String({
      description: "A description of the event or change that occurred. Max 63 chars.",
      maxLength: 63
    }),
    Who: t.Nullable(t.String({
      description: "The initials of the user who performed the action. Max 3 chars.",
      maxLength: 3
    })),
    Info1: t.Nullable(t.String({
      description: "Additional contextual information field 1. Max 31 chars.",
      maxLength: 31
    })),
    Info2: t.Nullable(t.String({
      description: "Additional contextual information field 2. Max 31 chars.",
      maxLength: 31
    })),
    Info3: t.Nullable(t.String({
      description: "Additional contextual information field 3. Max 31 chars.",
      maxLength: 31
    })),
  },
  { additionalProperties: true },
);
