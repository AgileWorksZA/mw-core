import { InventoryService } from "../../services/tables/inventory.service";
import { inventoryObject } from "../../types/constants.eden";
import type { Inventory } from "../../types/interface/tables/inventory";
import { moneyworksRoute } from "./base/moneyworks.route";

export const inventoryRoutes = moneyworksRoute<Inventory, "Inventory", typeof inventoryObject>(
  "Inventory",
  inventoryObject,
  new InventoryService(),
  {
    summary: "Inventory",
    description: "Tracks stock levels, values, locations, serial numbers, and batch details for inventoried product items.",
    tags: ["Inventory"],
  },
);
