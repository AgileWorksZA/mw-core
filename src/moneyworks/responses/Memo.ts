import { t } from 'elysia';
export const MemoOne = t.Object({
  SequenceNumber: t.Number(),
  LastModifiedTime: t.Date(),
  NameSeq: t.Number(),
  Order: t.Optional(t.Number()),
  Date: t.Optional(t.Date()),
  RecallDate: t.Optional(t.Date()),
  Flags: t.Optional(t.Number()),
  Text: t.String(),
});
export const MemoMany = t.Object({
  data: t.Array(MemoOne),
  pagination: t.Object({
    total: t.Number(),
    limit: t.Number(),
    offset: t.Number(),
    next: t.Number(),
    prev: t.Number(),
  })
});
