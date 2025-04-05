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
    const { limit = 10, offset = 0, sort, order, search } = query;

    try {
      return await productService.getProducts({
        limit: Number(limit),
        offset: Number(offset),
        sort,
        order: order as "asc" | "desc",
        search: search as unknown as Partial<Product>,
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
    }),
    detail: {
      summary: "Products",
      description: `Get all products. Search by: ${ProductFields.join(", ")}`,
    },
    tags: ["Inventory"],
    response: ProductMany,
  },
);
