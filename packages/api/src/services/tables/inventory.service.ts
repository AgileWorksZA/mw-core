import { type Inventory, InventoryFields } from "../../types/interface/tables/inventory";
import schema from "../../types/optimized/table/inventory-schema";
import { TableService } from "./base/table.service";

/**
 * Service for interacting with MoneyWorks Inventory table
 * Inventory represents stock on hand by location and/or serial/batch
 */
export class InventoryService extends TableService<Inventory> {
  constructor() {
    super("inventory", schema, InventoryFields);
  }
}
