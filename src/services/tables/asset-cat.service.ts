import type { ANY } from "../../types/hack";
import { enforceType } from "../../types/helpers";
import {
  type AssetCat,
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

  dataCenterJsonToAssetCat(data: ANY): AssetCat {
    return AssetCatFields.reduce((acc, key) => {
      if (data[key.toLowerCase()] === undefined) {
        console.error(
          `Missing key ${key} in data center json for AssetCat record`,
        );
      }
      (acc as ANY)[key] = enforceType(
        data[key.toLowerCase()],
        schema[key] as "string",
      );
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
  }) {
    try {
      // Convert from our API params to MoneyWorks params
      const mwParams: MoneyWorksQueryParams<AssetCat> = {
        limit: params.limit,
        start: params.offset,
        search: params.search,
        sort: params.sort,
        direction: params.order === "desc" ? "descending" : "ascending",
        format: "xml-verbose",
      };

      // Call MoneyWorks API
      const { data, pagination } = await this.api.export("assetcat", mwParams);

      // Parse the response
      const assetCats = data.map(this.dataCenterJsonToAssetCat);

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
