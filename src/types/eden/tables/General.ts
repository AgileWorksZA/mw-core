import { t } from 'elysia';
export const GeneralOne = t.Object({
  SequenceNumber: t.Number(),
  LastModifiedTime: t.String(),
  Code: t.String(),
  Description: t.Nullable(t.String()),
  Date: t.Nullable(t.Date()),
  Long: t.Nullable(t.Number()),
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
