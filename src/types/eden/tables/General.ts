import { t } from "elysia";

export const GeneralOne = t.Object(
  {
    SequenceNumber: t.Number(),
    LastModifiedTime: t.String(),
    Code: t.String(),
    Description: t.Nullable(t.String()),
    Date: t.Nullable(t.Date()),
    Long: t.Nullable(t.Number()),
  },
  { additionalProperties: true },
);
