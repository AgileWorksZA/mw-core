import { t } from 'elysia';
export const LogOne = t.Object({
  SequenceNumber: t.Number(),
  LastModifiedTime: t.Date(),
  Description: t.String(),
  Who: t.Optional(t.String()),
  Info1: t.Optional(t.String()),
  Info2: t.Optional(t.String()),
  Info3: t.Optional(t.String()),
});
export const LogMany = t.Object({
  data: t.Array(LogOne),
  pagination: t.Object({
    total: t.Number(),
    limit: t.Number(),
    offset: t.Number(),
    next: t.Number(),
    prev: t.Number(),
  })
});
