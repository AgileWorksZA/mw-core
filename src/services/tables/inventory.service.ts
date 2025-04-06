import type { ANY } from "../../types/hack";
import { enforceType } from "../../types/helpers";
import {
  type Inventory,
  InventoryFields,
} from "../../types/interface/tables/inventory";
import type {
  MoneyWorksConfig,
  MoneyWorksQueryParams,
} from "../../types/moneyworks";
import schema from "../../types/optimized/table/inventory-schema";
import { MoneyWorksApiService } from "../moneyworks-api.service";

/**
 * Service for interacting with MoneyWorks Inventory table
 * Inventory represents stock on hand by location and/or serial/batch
 */
export class InventoryService {
  private api: MoneyWorksApiService;

  constructor(config: MoneyWorksConfig) {
    this.api = new MoneyWorksApiService(config);
  }

  dataCenterJsonToInventory(data: ANY): Inventory {
    return InventoryFields.reduce((acc, key) => {
      if (data[key.toLowerCase()] === undefined) {
        console.error(
          `Missing key ${key} in data center json for Inventory record`,
        );
      }
      (acc as ANY)[key] = enforceType(
        data[key.toLowerCase()],
        schema[key] as "string",
      );
      return acc;
    }, {} as Inventory);
  }

  /**
   * Get inventory items from MoneyWorks with pagination and filtering
   *
   * @param params Query parameters
   * @returns Parsed inventory data with pagination metadata
   */
  async getInventory(params: {
    limit?: number;
    offset?: number;
    search?: Partial<Inventory>;
    sort?: string;
    order?: "asc" | "desc";
  }) {
    try {
      // Convert from our API params to MoneyWorks params
      const mwParams: MoneyWorksQueryParams<Inventory> = {
        limit: params.limit,
        start: params.offset,
        search: params.search,
        sort: params.sort,
        direction: params.order === "desc" ? "descending" : "ascending",
        format: "xml-verbose",
      };

      // Call MoneyWorks API
      const { data, pagination } = await this.api.export("inventory", mwParams);

      // Parse the response
      const inventory = data.map(this.dataCenterJsonToInventory);

      return {
        data: inventory,
        pagination,
      };
    } catch (error) {
      console.error("Error fetching inventory:", error);
      throw error;
    }
  }
}
