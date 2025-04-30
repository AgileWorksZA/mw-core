import { t } from "elysia";

export const LinkOne = t.Object(
  {
    SequenceNumber: t.Number(),
    LastModifiedTime: t.String(),
    Dept: t.String(),
    Group: t.String(),
  },
  { additionalProperties: true },
);
