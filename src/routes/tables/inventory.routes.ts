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
    const { limit = 10, offset = 0, sort, order, search, format } = query;
    // Parse the format parameter as a comma-separated list of field names
    const fields = format ? format.split(",") : undefined;

    try {
      return await inventoryService.getInventory({
        limit: Number(limit),
        offset: Number(offset),
        sort,
        order: order as "asc" | "desc",
        search: search as unknown as Partial<Inventory>,
        fields,
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
      format: t.Optional(t.String()),
    }),
    detail: {
      summary: "Inventory",
      description: `Tracks stock levels, values, locations, serial numbers, and batch details for inventoried product items.

      Search by: ${InventoryFields.join(", ")}.
      Optionally specify comma-separated field names with "format" parameter to retrieve only specific fields.
      Example: /api/inventory?format=SequenceNumber,Identifier,ProductSeq,Qty`,
    },
    tags: ["Inventory"],
    response: { $schema: { $ref: "#/components/schemas/Inventories" } },
  },
);
