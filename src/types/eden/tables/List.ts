import { t } from "elysia";

export const ListOne = t.Object(
  {
    SequenceNumber: t.Number(),
    LastModifiedTime: t.String(),
    ListID: t.String(),
    Item: t.String(),
    Comment: t.Nullable(t.String()),
    UserNum: t.Nullable(t.Number()),
    UserText: t.Nullable(t.String()),
    TaggedText: t.Nullable(t.String()),
  },
  { additionalProperties: true },
);
