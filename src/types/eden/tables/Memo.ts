import { t } from "elysia";

export const MemoOne = t.Object(
  {
    SequenceNumber: t.Number(),
    LastModifiedTime: t.String(),
    NameSeq: t.Number(),
    Order: t.Nullable(t.Number()),
    Date: t.Nullable(t.Date()),
    RecallDate: t.Nullable(t.Date()),
    Flags: t.Nullable(t.Number()),
    Text: t.String(),
  },
  { additionalProperties: true },
);
