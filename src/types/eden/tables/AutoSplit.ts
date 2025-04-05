import { t } from 'elysia';
export const AutoSplitOne = t.Object({
  SequenceNumber: t.Number(),
  LastModifiedTime: t.Date(),
  MatchFunction: t.String(),
  SplitMode: t.Nullable(t.Number()),
  SplitAcct1: t.Nullable(t.String()),
  SplitAcct2: t.Nullable(t.String()),
  SplitAmount1: t.Nullable(t.Number()),
  SplitAmount2: t.Nullable(t.Number()),
  SplitAcct3: t.Nullable(t.String()),
  SplitAcct4: t.Nullable(t.String()),
  SplitAmount3: t.Nullable(t.Number()),
  MatchName: t.Nullable(t.String()),
  Priority: t.Nullable(t.Number()),
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
