import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import { z } from "zod";
import { loadMoneyWorksConfig } from "../../../config/moneyworks.config";
import { ProductService } from "../../../services/tables/product.service";
import { pagingSelectionSchema } from "../../../types/zod/tables/paging";
import { productZod } from "../../../types/zod/tables/product";

const productService = new ProductService(loadMoneyWorksConfig());

export function registerProductTools(server: McpServer) {
  server.tool(
    "searchProducts",
    "Search for products",
    { paging: pagingSelectionSchema, search: z.optional(productZod.partial()) },
    async ({ paging, search }) => {
      const result = await productService.getProducts({ ...paging, search });

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result),
          },
        ],
      };
    },
  );
}
