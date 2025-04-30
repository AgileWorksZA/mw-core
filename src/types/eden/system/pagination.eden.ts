import { t } from "elysia";

export const PaginationSchema = t.Object({
  total: t.Integer(),
  limit: t.Integer(),
  offset: t.Integer(),
  next: t.Integer(),
  prev: t.Integer(),
});
