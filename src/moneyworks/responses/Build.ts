import { t } from 'elysia';
export const BuildOne = t.Object({
  SequenceNumber: t.Number(),
  LastModifiedTime: t.Date(),
  ProductSeq: t.Number(),
  Order: t.Optional(t.Number()),
  Qty: t.Number(),
  PartCode: t.String(),
  Flags: t.Optional(t.Number()),
  Memo: t.Optional(t.String()),
});
export const BuildMany = t.Object({
  data: t.Array(BuildOne),
  pagination: t.Object({
    total: t.Number(),
    limit: t.Number(),
    offset: t.Number(),
    next: t.Number(),
    prev: t.Number(),
  })
});
