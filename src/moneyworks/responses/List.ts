import { t } from 'elysia';
export const ListOne = t.Object({
  SequenceNumber: t.Number(),
  LastModifiedTime: t.Date(),
  ListID: t.String(),
  Item: t.String(),
  Comment: t.Optional(t.String()),
  UserNum: t.Optional(t.Number()),
  UserText: t.Optional(t.String()),
  TaggedText: t.Optional(t.String()),
});
export const ListMany = t.Object({
  data: t.Array(ListOne),
  pagination: t.Object({
    total: t.Number(),
    limit: t.Number(),
    offset: t.Number(),
    next: t.Number(),
    prev: t.Number(),
  })
});
