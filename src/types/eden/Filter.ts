import { t } from 'elysia';
export const FilterOne = t.Object({
  SequenceNumber: t.Number(),
  LastModifiedTime: t.Date(),
  File: t.Number(),
  TabSet: t.Optional(t.Number()),
  Tab: t.Optional(t.Number()),
  Type: t.Optional(t.Number()),
  User: t.String(),
  Name: t.String(),
  FilterFunction: t.Optional(t.String()),
  Order: t.Optional(t.Number()),
});
export const FilterMany = t.Object({
  data: t.Array(FilterOne),
  pagination: t.Object({
    total: t.Number(),
    limit: t.Number(),
    offset: t.Number(),
    next: t.Number(),
    prev: t.Number(),
  })
});
