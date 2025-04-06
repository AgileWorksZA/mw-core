import type { ANY } from "../../types/hack";
import { enforceType } from "../../types/helpers";
import {
  type Asset,
  type AssetField,
  AssetFields,
} from "../../types/interface/tables/asset";
import type {
  MoneyWorksConfig,
  MoneyWorksQueryParams,
} from "../../types/moneyworks";
import schema from "../../types/optimized/table/asset-schema";
import { MoneyWorksApiService } from "../moneyworks-api.service";

/**
 * Service for interacting with MoneyWorks Asset table
 * Assets represent fixed assets in the system
 */
export class AssetService {
  private api: MoneyWorksApiService;

  constructor(config: MoneyWorksConfig) {
    this.api = new MoneyWorksApiService(config);
  }

  dataCenterJsonToAssetUsingFields(fields: AssetField[], data: ANY): Asset {
    return fields.reduce((acc, key) => {
      if (data[key] === undefined) {
        console.error(
          `Missing key ${key} in data center json for Asset record`,
        );
      }
      const value = enforceType(
        data[key],
        schema[key as keyof typeof schema] as "string",
      );
      (acc as ANY)[key] = value === "" ? null : value;
      return acc;
    }, {} as Asset);
  }

  dataCenterJsonToAsset(data: ANY): Asset {
    return AssetFields.reduce((acc, key) => {
      if (data[key.toLowerCase()] === undefined) {
        console.error(
          `Missing key ${key} in data center json for Asset record`,
        );
      }
      const value = enforceType(
        data[key.toLowerCase()],
        schema[key as keyof typeof schema] as "string",
      );
      (acc as ANY)[key] = value === "" ? null : value;
      return acc;
    }, {} as Asset);
  }

  /**
   * Get assets from MoneyWorks with pagination and filtering
   *
   * @param params Query parameters
   * @returns Parsed asset data with pagination metadata
   */
  async getAssets(params: {
    limit?: number;
    offset?: number;
    search?: Partial<Asset>;
    sort?: string;
    order?: "asc" | "desc";
    fields?: string[]; // Array of field names to include in the response
  }) {
    // Validate fields against AssetFields if provided
    if (params.fields && params.fields.length > 0) {
      for (const field of params.fields) {
        if (!AssetFields.includes(field as AssetField)) {
          throw new Error(
            `Invalid field '${field}' for Asset table. Valid fields are: ${AssetFields.join(", ")}`,
          );
        }
      }
    }

    try {
      // Convert from our API params to MoneyWorks params
      const mwParams: MoneyWorksQueryParams<Asset> = {
        limit: params.limit,
        start: params.offset,
        search: params.search,
        sort: params.sort,
        direction: params.order === "desc" ? "descending" : "ascending",
        format: params.fields ? undefined : "xml-verbose",
        fields: params.fields,
      };

      // Call MoneyWorks API
      const { data, pagination } = await this.api.export("asset", mwParams);

      // Parse the response
      // If we're using custom fields, use the fields-specific mapper
      // Otherwise, map the full data to asset objects
      const assets = params.fields
        ? data.map((d) =>
            this.dataCenterJsonToAssetUsingFields(
              params.fields as AssetField[],
              d,
            ),
          )
        : data.map(this.dataCenterJsonToAsset);

      return {
        data: assets,
        pagination,
      };
    } catch (error) {
      console.error("Error fetching assets:", error);
      throw error;
    }
  }
}
