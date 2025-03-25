import { t } from 'elysia';
export const LoginOne = t.Object({
  SequenceNumber: t.Number(),
  LastModifiedTime: t.Date(),
  Initials: t.String(),
  Name: t.String(),
  Password: t.Optional(t.String()),
  SecurityLevel: t.Optional(t.Number()),
  Privileges: t.Optional(t.String()),
  Email: t.Optional(t.String()),
  Flags: t.Optional(t.Number()),
  Category: t.Optional(t.String()),
  Role: t.Optional(t.String()),
  UserNum: t.Optional(t.Number()),
  UserText: t.Optional(t.String()),
  TaggedText: t.Optional(t.String()),
  SettingsDonor: t.Optional(t.String()),
});
export const LoginMany = t.Object({
  data: t.Array(LoginOne),
  pagination: t.Object({
    total: t.Number(),
    limit: t.Number(),
    offset: t.Number(),
    next: t.Number(),
    prev: t.Number(),
  })
});
