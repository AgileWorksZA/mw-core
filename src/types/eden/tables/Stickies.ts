import { t } from 'elysia';
export const StickiesOne = t.Object({
  SequenceNumber: t.Number(),
  LastModifiedTime: t.Date(),
  FileNum: t.Number(),
  Colour: t.Nullable(t.Number()),
  User: t.Nullable(t.String()),
  OwnerSeq: t.Number(),
  Message: t.String(),
  Flags: t.Nullable(t.Number()),
});
export const StickiesMany = t.Object({
  data: t.Array(StickiesOne),
  pagination: t.Object({
    total: t.Number(),
    limit: t.Number(),
    offset: t.Number(),
    next: t.Number(),
    prev: t.Number(),
  })
});
