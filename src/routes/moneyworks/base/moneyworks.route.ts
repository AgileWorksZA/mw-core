import type { TSchema } from "@sinclair/typebox";
import { type DocumentDecoration, Elysia, t } from "elysia";
import type { TableService } from "../../../services/tables/base/table.service";
import { accountObject } from "../../../types/constants.eden";

export function moneyworksRoute<
  T extends object,
  const Name extends string,
  const Model extends TSchema,
>(
  model: Name,
  objectSchema: Model,
  service: TableService<T>,
  detail?: DocumentDecoration,
) {
  const query = t.Object({
    limit: t.Optional(t.Numeric()),
    offset: t.Optional(t.Numeric()),
    sort: t.Optional(t.String()),
    order: t.Optional(t.String()),
    search: t.Optional(accountObject),
    format: t.Optional(t.String()),
  });
  return new Elysia({ prefix: "/api" }).model(model, objectSchema).get(
    `/${model.toLowerCase()}s`,
    async (params) => {
      const {
        limit = 10,
        offset = 0,
        sort,
        order,
        search,
        format,
      } = params.query as {
        limit?: string | number;
        offset?: string | number;
        sort?: string;
        order?: string;
        search?: unknown;
        format?: string;
      };

      // Parse the format parameter as an array of field names if provided
      const fields = format ? (format as string).split(",") : undefined;

      try {
        return await service.getData({
          limit: Number(limit),
          offset: Number(offset),
          sort: sort !== undefined ? String(sort) : undefined,
          order: order as "asc" | "desc",
          search: search as unknown as Partial<T>,
          fields,
        });
      } catch (error) {
        console.error(`Error in GET /${model.toLowerCase()}s:`, error);
        throw error;
      }
    },
    {
      query,
      detail,
      response: {
        200: t.Object({
          data: t.Array(objectSchema),
          pagination: t.Object({
            total: t.Integer(),
            limit: t.Integer(),
            offset: t.Integer(),
            next: t.Integer(),
            prev: t.Integer(),
          }),
        }),
      },
    },
  );
}
