import { Elysia, t } from "elysia";
import { loadMoneyWorksConfig } from "../../config/moneyworks.config";
import { InventoryService } from "../../services/tables/inventory.service";
import { inventoryObject } from "../../types/constants.eden";
import { InventoryMany } from "../../types/eden/tables/Inventory";
import {
  type Inventory,
  InventoryFields,
} from "../../types/interface/tables/inventory";

// Initialize the inventory service with configuration
const config = loadMoneyWorksConfig();
const inventoryService = new InventoryService(config);

export const inventoryRoutes = new Elysia({ prefix: "/api" }).get(
  "/inventory",
  async ({ query }) => {
    const { limit = 10, offset = 0, sort, order, search } = query;

    try {
      return await inventoryService.getInventory({
        limit: Number(limit),
        offset: Number(offset),
        sort,
        order: order as "asc" | "desc",
        search: search as unknown as Partial<Inventory>,
      });
    } catch (error) {
      console.error("Error in GET /inventory:", error);
      throw error;
    }
  },
  {
    query: t.Object({
      limit: t.Optional(t.Numeric()),
      offset: t.Optional(t.Numeric()),
      sort: t.Optional(t.String()),
      order: t.Optional(t.String()),
      search: t.Optional(inventoryObject),
    }),
    detail: {
      summary: "Inventory",
      description: `Get inventory records. Search by: ${InventoryFields.join(", ")}`,
    },
    tags: ["Inventory"],
    response: InventoryMany,
  },
);
