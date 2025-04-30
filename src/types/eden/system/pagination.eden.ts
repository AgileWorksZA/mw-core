import { t } from "elysia";

export const PaginationSchema = t.Object({
  total: t.Number(),
  limit: t.Number(),
  offset: t.Number(),
  next: t.Number(),
  prev: t.Number(),
});
