import { t } from 'elysia';
export const User2One = t.Object({
  SequenceNumber: t.Number(),
  LastModifiedTime: t.String(),
  DevKey: t.Number(),
  Key: t.String(),
  Int1: t.Nullable(t.Number()),
  Int2: t.Nullable(t.Number()),
  Float1: t.Nullable(t.Number()),
  Float2: t.Nullable(t.Number()),
  Date1: t.Nullable(t.Date()),
  Date2: t.Nullable(t.Date()),
  Text1: t.Nullable(t.String()),
  Text2: t.Nullable(t.String()),
  Text: t.Nullable(t.String()),
  Int3: t.Nullable(t.Number()),
  Int4: t.Nullable(t.Number()),
  Float3: t.Nullable(t.Number()),
  Float4: t.Nullable(t.Number()),
  Date3: t.Nullable(t.Date()),
  Date4: t.Nullable(t.Date()),
  Text3: t.Nullable(t.String()),
  Text4: t.Nullable(t.String()),
  TaggedText: t.Nullable(t.String()),
  Colour: t.Nullable(t.Number()),
});
export const User2Many = t.Object({
  data: t.Array(User2One),
  pagination: t.Object({
    total: t.Number(),
    limit: t.Number(),
    offset: t.Number(),
    next: t.Number(),
    prev: t.Number(),
  })
});
