import { t } from "elysia";
export const ContactsOne = t.Object({
  SequenceNumber: t.Number(),
  LastModifiedTime: t.String(),
  ParentSeq: t.Number(),
  Order: t.Number(),
  ContactName: t.Nullable(t.String()),
  Salutation: t.Nullable(t.String()),
  Position: t.Nullable(t.String()),
  Phone: t.Nullable(t.String()),
  Mobile: t.Nullable(t.String()),
  AfterHours: t.Nullable(t.String()),
  eMail: t.Nullable(t.String()),
  Memo: t.Nullable(t.String()),
  Role: t.Nullable(t.Number()),
  UserNum: t.Nullable(t.Number()),
  UserText: t.Nullable(t.String()),
  TaggedText: t.Nullable(t.String()),
});
export const ContactsMany = t.Object({
  data: t.Array(ContactsOne),
  pagination: t.Object({
    total: t.Number(),
    limit: t.Number(),
    offset: t.Number(),
    next: t.Number(),
    prev: t.Number(),
  }),
});
