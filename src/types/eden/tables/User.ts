import { t } from "elysia";
export const UserOne = t.Object({
  SequenceNumber: t.Number(),
  LastModifiedTime: t.String(),
  Key: t.String(),
  Data: t.Nullable(t.String()),
});
export const UserMany = t.Object({
  data: t.Array(t.Partial(UserOne)),
  pagination: t.Object({
    total: t.Number(),
    limit: t.Number(),
    offset: t.Number(),
    next: t.Number(),
    prev: t.Number(),
  }),
});
