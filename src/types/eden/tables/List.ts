import { t } from 'elysia';
export const ListOne = t.Object({
  SequenceNumber: t.Number(),
  LastModifiedTime: t.Date(),
  ListID: t.String(),
  Item: t.String(),
  Comment: t.Nullable(t.String()),
  UserNum: t.Nullable(t.Number()),
  UserText: t.Nullable(t.String()),
  TaggedText: t.Nullable(t.String()),
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
