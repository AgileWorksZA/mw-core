import { t } from "elysia";
export const FilterOne = t.Object({
  SequenceNumber: t.Number(),
  LastModifiedTime: t.String(),
  File: t.Number(),
  TabSet: t.Nullable(t.Number()),
  Tab: t.Nullable(t.Number()),
  Type: t.Nullable(t.Number()),
  User: t.String(),
  Name: t.String(),
  FilterFunction: t.Nullable(t.String()),
  Order: t.Nullable(t.Number()),
});
export const FilterMany = t.Object({
  data: t.Array(t.Partial(FilterOne)),
  pagination: t.Object({
    total: t.Number(),
    limit: t.Number(),
    offset: t.Number(),
    next: t.Number(),
    prev: t.Number(),
  }),
});
