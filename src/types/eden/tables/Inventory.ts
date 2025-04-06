import { t } from "elysia";

export const InventoryOne = t.Object({
  SequenceNumber: t.Number(),
  LastModifiedTime: t.String(),
  Identifier: t.String(),
  Location: t.Optional(t.Nullable(t.String())),
  ProductSeq: t.Number(),
  Qty: t.Number(),
  Expiry: t.Optional(t.Nullable(t.String())),
});

export const InventoryMany = t.Object({
  data: t.Array(InventoryOne),
  pagination: t.Object({
    total: t.Number(),
    limit: t.Number(),
    offset: t.Number(),
    next: t.Number(),
    prev: t.Number(),
  }),
});
