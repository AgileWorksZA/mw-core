import { t } from "elysia";

export const UserOne = t.Object(
  {
    SequenceNumber: t.Number(),
    LastModifiedTime: t.String(),
    Key: t.String(),
    Data: t.Nullable(t.String()),
  },
  { additionalProperties: true },
);
