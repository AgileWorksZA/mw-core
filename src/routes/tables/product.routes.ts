import { Elysia, t } from "elysia";
import { loadMoneyWorksConfig } from "../../config/moneyworks.config";
import { ProductService } from "../../services/tables/product.service";
import { productObject } from "../../types/constants.eden";
import { ProductMany } from "../../types/eden/tables/Product";
import {
  type Product,
  ProductFields,
} from "../../types/interface/tables/product";

// Initialize the product service with configuration
const config = loadMoneyWorksConfig();
const productService = new ProductService(config);

export const productRoutes = new Elysia({ prefix: "/api" }).get(
  "/products",
  async ({ query }) => {
    const {
      limit = 10,
      offset = 0,
      sort,
      order,
      search,
      format,
      skip_validation,
    } = query;

    // Parse the format parameter as an array of field names if provided
    const fields = format ? format.split(",") : undefined;

    try {
      return await productService.getProducts({
        limit: Number(limit),
        offset: Number(offset),
        sort,
        order: order as "asc" | "desc",
        search: search as unknown as Partial<Product>,
        fields,
        skip_validation: skip_validation === "true" || skip_validation === true,
      });
    } catch (error) {
      console.error("Error in GET /products:", error);
      throw error;
    }
  },
  {
    query: t.Object({
      limit: t.Optional(t.Numeric()),
      offset: t.Optional(t.Numeric()),
      sort: t.Optional(t.String()),
      order: t.Optional(t.String()),
      search: t.Optional(productObject),
      format: t.Optional(t.String()),
      skip_validation: t.Optional(t.Boolean()),
    }),
    detail: {
      summary: "Products",
      description: `Defines product items and services, including descriptions, pricing, costing, inventory status, and associated GL accounts.

      Search by: ${ProductFields.join(", ")}.
      Optionally specify field names with "format" parameter to retrieve only specific fields.
      Example: /api/products?format=Code,Description
      
      Use skip_validation=true to bypass field validation when using custom fields.`,
    },
    tags: ["Inventory"],
    response: { $schema: { $ref: "#/components/schemas/Products" } },
  },
);
