import { t } from 'elysia';
export const DepartmentOne = t.Object({
  SequenceNumber: t.Number(),
  LastModifiedTime: t.Date(),
  Code: t.String(),
  Description: t.String(),
  Classification: t.Optional(t.String()),
  Custom1: t.Optional(t.String()),
  Custom2: t.Optional(t.String()),
  Flags: t.Optional(t.Number()),
  UserNum: t.Optional(t.Number()),
  UserText: t.Optional(t.String()),
  TaggedText: t.Optional(t.String()),
});
export const DepartmentMany = t.Object({
  data: t.Array(DepartmentOne),
  pagination: t.Object({
    total: t.Number(),
    limit: t.Number(),
    offset: t.Number(),
    next: t.Number(),
    prev: t.Number(),
  })
});
