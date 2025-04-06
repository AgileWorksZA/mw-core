import type { ANY } from "../../types/hack";
import { enforceType } from "../../types/helpers";
import {
  type Inventory,
  type InventoryField,
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
      const value = enforceType(
        data[key.toLowerCase()],
        schema[key] as "string",
      );
      (acc as ANY)[key] = value === "" ? null : value;
      return acc;
    }, {} as Inventory);
  }

  dataCenterJsonToInventoryUsingFields(
    fields: InventoryField[],
    data: ANY,
  ): Inventory {
    return fields.reduce((acc, key) => {
      if (data[key] === undefined) {
        console.error(
          `Missing key ${key} in data center json for Inventory record`,
        );
      }
      const value = enforceType(
        data[key],
        schema[key as keyof typeof schema] as "string",
      );
      (acc as ANY)[key] = value === "" ? null : value;
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
    fields?: string[];
  }) {
    try {
      // Validate fields if provided
      if (params.fields && params.fields.length > 0) {
        for (const field of params.fields) {
          if (!InventoryFields.includes(field as InventoryField)) {
            throw new Error(
              `Invalid field '${field}' for Inventory table. Valid fields are: ${InventoryFields.join(", ")}`,
            );
          }
        }
      }

      // Convert from our API params to MoneyWorks params
      const mwParams: MoneyWorksQueryParams<Inventory> = {
        limit: params.limit,
        start: params.offset,
        search: params.search,
        sort: params.sort,
        direction: params.order === "desc" ? "descending" : "ascending",
        format: params.fields ? undefined : "xml-verbose",
        fields: params.fields,
      };

      // Call MoneyWorks API
      const { data, pagination } = await this.api.export("inventory", mwParams);

      // Parse the response
      const inventory = params.fields
        ? data.map((d) =>
            this.dataCenterJsonToInventoryUsingFields(
              params.fields as InventoryField[],
              d,
            ),
          )
        : data.map(this.dataCenterJsonToInventory);

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
