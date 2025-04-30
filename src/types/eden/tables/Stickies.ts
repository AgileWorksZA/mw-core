import { t } from "elysia";

export const StickiesOne = t.Object(
  {
    SequenceNumber: t.Number(),
    LastModifiedTime: t.String(),
    FileNum: t.Number(),
    Colour: t.Nullable(t.Number()),
    User: t.Nullable(t.String()),
    OwnerSeq: t.Number(),
    Message: t.String(),
    Flags: t.Nullable(t.Number()),
  },
  { additionalProperties: true },
);
