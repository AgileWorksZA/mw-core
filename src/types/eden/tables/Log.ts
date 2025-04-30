import { t } from "elysia";

export const LogOne = t.Object(
  {
    SequenceNumber: t.Number(),
    LastModifiedTime: t.String(),
    Description: t.String(),
    Who: t.Nullable(t.String()),
    Info1: t.Nullable(t.String()),
    Info2: t.Nullable(t.String()),
    Info3: t.Nullable(t.String()),
  },
  { additionalProperties: true },
);
