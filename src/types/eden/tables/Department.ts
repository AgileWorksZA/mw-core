import { t } from 'elysia';
export const DepartmentOne = t.Object({
  SequenceNumber: t.Number(),
  LastModifiedTime: t.String(),
  Code: t.String(),
  Description: t.String(),
  Classification: t.Nullable(t.String()),
  Custom1: t.Nullable(t.String()),
  Custom2: t.Nullable(t.String()),
  Flags: t.Nullable(t.Number()),
  UserNum: t.Nullable(t.Number()),
  UserText: t.Nullable(t.String()),
  TaggedText: t.Nullable(t.String()),
});
export const DepartmentMany = t.Object({
  data: t.Array(t.Partial(DepartmentOne)),
  pagination: t.Object({
    total: t.Number(),
    limit: t.Number(),
    offset: t.Number(),
    next: t.Number(),
    prev: t.Number(),
  })
});
