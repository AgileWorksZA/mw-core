import { t } from "elysia";

export const LoginOne = t.Object(
  {
    SequenceNumber: t.Number(),
    LastModifiedTime: t.String(),
    Initials: t.String(),
    Name: t.String(),
    Password: t.Nullable(t.String()),
    SecurityLevel: t.Nullable(t.Number()),
    Privileges: t.Nullable(t.String()),
    Email: t.Nullable(t.String()),
    Flags: t.Nullable(t.Number()),
    Category: t.Nullable(t.String()),
    Role: t.Nullable(t.String()),
    UserNum: t.Nullable(t.Number()),
    UserText: t.Nullable(t.String()),
    TaggedText: t.Nullable(t.String()),
    SettingsDonor: t.Nullable(t.String()),
  },
  { additionalProperties: true },
);
