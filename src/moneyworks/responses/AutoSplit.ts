import { t } from 'elysia';
export const AutoSplitOne = t.Object({
  SequenceNumber: t.Number(),
  LastModifiedTime: t.Date(),
  MatchFunction: t.String(),
  SplitMode: t.Optional(t.Number()),
  SplitAcct1: t.Optional(t.String()),
  SplitAcct2: t.Optional(t.String()),
  SplitAmount1: t.Optional(t.Number()),
  SplitAmount2: t.Optional(t.Number()),
  SplitAcct3: t.Optional(t.String()),
  SplitAcct4: t.Optional(t.String()),
  SplitAmount3: t.Optional(t.Number()),
  MatchName: t.Optional(t.String()),
  Priority: t.Optional(t.Number()),
});
export const AutoSplitMany = t.Object({
  data: t.Array(AutoSplitOne),
  pagination: t.Object({
    total: t.Number(),
    limit: t.Number(),
    offset: t.Number(),
    next: t.Number(),
    prev: t.Number(),
  })
});
