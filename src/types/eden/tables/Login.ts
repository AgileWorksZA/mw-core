import { t } from "elysia";

export const LoginOne = t.Object(
  {
    SequenceNumber: t.Number({
      description: "Unsigned long sequence number (indexed). Unique internal identifier for this user/login record."
    }),
    LastModifiedTime: t.String({
      description: "Last modified timestamp. The date and time that this record was last changed."
    }),
    Initials: t.String({
      description: "The user's unique initials (up to 3 characters). Used for logging in and tracking record changes. Indexed.",
      maxLength: 3
    }),
    Name: t.String({
      description: "The full name of the user or role. Max 31 chars.",
      maxLength: 31
    }),
    Password: t.Nullable(t.String({
      description: "The user's password (stored encrypted). Can be empty if no password is set. Max 33 chars (encrypted length).",
      maxLength: 33
    })),
    SecurityLevel: t.Nullable(t.Number({
      description: "The security level assigned to the user (0-5 stars), controlling access to sensitive accounts/transactions.",
      minimum: 0,
      maximum: 5
    })),
    Privileges: t.Nullable(t.String({
      description: "A map representing the user's specific privileges if not assigned a Role. Max 65 chars (internal representation).",
      maxLength: 65
    })),
    Email: t.Nullable(t.String({
      description: "The user's email address. Max 63 chars.",
      maxLength: 63
    })),
    Flags: t.Nullable(t.Number({
      description: "Bitmapped flags field. Bit 0: Is a Role definition; Bit 1: Is Read Only user; Bit 3: User is logged in via MoneyWorks Now."
    })),
    Category: t.Nullable(t.String({
      description: "User-defined category for grouping or classifying users/roles. Max 31 chars.",
      maxLength: 31
    })),
    Role: t.Nullable(t.String({
      description: "The name of the Role assigned to this user (if applicable). Max 31 chars.",
      maxLength: 31
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
    SettingsDonor: t.Nullable(t.String({
      description: "Internal field potentially used by scripts like CopyUserSettings. Not in Appendix A."
    })),
  },
  { additionalProperties: true },
);
