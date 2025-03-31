import { t } from 'elysia';
export const GeneralOne = t.Object({
  SequenceNumber: t.Number(),
  LastModifiedTime: t.Date(),
  Code: t.String(),
  Description: t.Optional(t.String()),
  Date: t.Optional(t.Date()),
  Long: t.Optional(t.Number()),
});
export const GeneralMany = t.Object({
  data: t.Array(GeneralOne),
  pagination: t.Object({
    total: t.Number(),
    limit: t.Number(),
    offset: t.Number(),
    next: t.Number(),
    prev: t.Number(),
  })
});
