import { t } from "elysia";
export const LinkOne = t.Object({
  SequenceNumber: t.Number(),
  LastModifiedTime: t.String(),
  Dept: t.String(),
  Group: t.String(),
});
export const LinkMany = t.Object({
  data: t.Array(t.Partial(LinkOne)),
  pagination: t.Object({
    total: t.Number(),
    limit: t.Number(),
    offset: t.Number(),
    next: t.Number(),
    prev: t.Number(),
  }),
});
