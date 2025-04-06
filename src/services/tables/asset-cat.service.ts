import type { ANY } from "../../types/hack";
import { enforceType } from "../../types/helpers";
import {
  type AssetCat,
  type AssetCatField,
  AssetCatFields,
} from "../../types/interface/tables/assetcat";
import type {
  MoneyWorksConfig,
  MoneyWorksQueryParams,
} from "../../types/moneyworks";
import schema from "../../types/optimized/table/asset-cat-schema";
import { MoneyWorksApiService } from "../moneyworks-api.service";

/**
 * Service for interacting with MoneyWorks AssetCat table
 * AssetCat represents asset categories in the system
 */
export class AssetCatService {
  private api: MoneyWorksApiService;

  constructor(config: MoneyWorksConfig) {
    this.api = new MoneyWorksApiService(config);
  }

  dataCenterJsonToAssetCatUsingFields(
    fields: AssetCatField[],
    data: ANY,
  ): AssetCat {
    return fields.reduce((acc, key) => {
      if (data[key] === undefined) {
        console.error(
          `Missing key ${key} in data center json for AssetCat record`,
        );
      }
      const value = enforceType(
        data[key],
        schema[key as keyof typeof schema] as "string",
      );
      (acc as ANY)[key] = value === "" ? null : value;
      return acc;
    }, {} as AssetCat);
  }

  dataCenterJsonToAssetCat(data: ANY): AssetCat {
    return AssetCatFields.reduce((acc, key) => {
      if (data[key.toLowerCase()] === undefined) {
        console.error(
          `Missing key ${key} in data center json for AssetCat record`,
        );
      }
      const value = enforceType(
        data[key.toLowerCase()],
        schema[key as keyof typeof schema] as "string",
      );
      (acc as ANY)[key] = value === "" ? null : value;
      return acc;
    }, {} as AssetCat);
  }

  /**
   * Get asset categories from MoneyWorks with pagination and filtering
   *
   * @param params Query parameters
   * @returns Parsed asset category data with pagination metadata
   */
  async getAssetCats(params: {
    limit?: number;
    offset?: number;
    search?: Partial<AssetCat>;
    sort?: string;
    order?: "asc" | "desc";
    fields?: string[]; // Array of field names to include in the response
  }) {
    // Validate fields against AssetCatFields if provided
    if (params.fields && params.fields.length > 0) {
      for (const field of params.fields) {
        if (!AssetCatFields.includes(field as AssetCatField)) {
          throw new Error(
            `Invalid field '${field}' for AssetCat table. Valid fields are: ${AssetCatFields.join(", ")}`,
          );
        }
      }
    }

    try {
      // Convert from our API params to MoneyWorks params
      const mwParams: MoneyWorksQueryParams<AssetCat> = {
        limit: params.limit,
        start: params.offset,
        search: params.search,
        sort: params.sort,
        direction: params.order === "desc" ? "descending" : "ascending",
        format: params.fields ? undefined : "xml-verbose",
        fields: params.fields,
      };

      // Call MoneyWorks API
      const { data, pagination } = await this.api.export("assetcat", mwParams);

      // Parse the response
      // If we're using custom fields, use the fields-specific mapper
      // Otherwise, map the full data to asset cat objects
      const assetCats = params.fields
        ? data.map((d) =>
            this.dataCenterJsonToAssetCatUsingFields(
              params.fields as AssetCatField[],
              d,
            ),
          )
        : data.map(this.dataCenterJsonToAssetCat);

      return {
        data: assetCats,
        pagination,
      };
    } catch (error) {
      console.error("Error fetching asset categories:", error);
      throw error;
    }
  }
}
