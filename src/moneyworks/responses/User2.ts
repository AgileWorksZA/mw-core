import { t } from 'elysia';
export const User2One = t.Object({
  SequenceNumber: t.Number(),
  LastModifiedTime: t.Date(),
  DevKey: t.Number(),
  Key: t.String(),
  Int1: t.Optional(t.Number()),
  Int2: t.Optional(t.Number()),
  Float1: t.Optional(t.Number()),
  Float2: t.Optional(t.Number()),
  Date1: t.Optional(t.Date()),
  Date2: t.Optional(t.Date()),
  Text1: t.Optional(t.String()),
  Text2: t.Optional(t.String()),
  Text: t.Optional(t.String()),
  Int3: t.Optional(t.Number()),
  Int4: t.Optional(t.Number()),
  Float3: t.Optional(t.Number()),
  Float4: t.Optional(t.Number()),
  Date3: t.Optional(t.Date()),
  Date4: t.Optional(t.Date()),
  Text3: t.Optional(t.String()),
  Text4: t.Optional(t.String()),
  TaggedText: t.Optional(t.String()),
  Colour: t.Optional(t.Number()),
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
